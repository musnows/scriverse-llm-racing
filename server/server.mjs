import { createHash, randomUUID } from "node:crypto";
import { createReadStream, existsSync, mkdirSync, readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { extname, join, normalize, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";

const rootDir = fileURLToPath(new URL(".", import.meta.url));
const port = Number.parseInt(process.env.PORT || "13250", 10);
const databasePath = resolve(process.env.RATING_DB || join(rootDir, "data", "ratings.sqlite"));
const configuredVoteLimit = Number.parseInt(process.env.MAX_VOTES_PER_DAY || "10", 10);
const maxVotesPerDay = Number.isFinite(configuredVoteLimit) ? Math.max(5, configuredVoteLimit) : 10;
const ipHashSecret = process.env.IP_HASH_SECRET || "change-this-secret";
const trustProxy = process.env.TRUST_PROXY === "true";
const catalogUrl = String(process.env.CATALOG_URL || "").trim();
const configuredCatalogSyncInterval = Number.parseInt(process.env.CATALOG_SYNC_INTERVAL_MS || "600000", 10);
const catalogSyncIntervalMs = Number.isFinite(configuredCatalogSyncInterval)
  ? Math.max(60_000, configuredCatalogSyncInterval)
  : 600_000;

mkdirSync(resolve(databasePath, ".."), { recursive: true });
const database = new DatabaseSync(databasePath);
database.exec("PRAGMA journal_mode = WAL");
database.exec("PRAGMA busy_timeout = 5000");
database.exec(`
  CREATE TABLE IF NOT EXISTS votes (
    id TEXT PRIMARY KEY,
    requirement_id TEXT NOT NULL,
    model_id TEXT NOT NULL,
    stars_half INTEGER NOT NULL CHECK (stars_half BETWEEN 1 AND 10),
    day TEXT NOT NULL,
    ip_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS votes_daily_limit_idx
    ON votes (day, requirement_id, model_id, ip_hash);
  CREATE INDEX IF NOT EXISTS votes_rating_totals_idx
    ON votes (requirement_id, model_id);
  CREATE TABLE IF NOT EXISTS catalog_snapshot (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    version INTEGER NOT NULL,
    payload TEXT NOT NULL,
    synced_at TEXT NOT NULL
  );
`);

let catalogSnapshot = null;
let requirementIds = new Set();
let modelIds = new Set();
let requirementModelIds = new Map();
let catalogEtag = null;
let catalogSyncInFlight = null;
let catalogSyncTimer = null;

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function getCorsOrigin(request) {
  const configured = process.env.ALLOWED_ORIGIN || "*";
  const origin = request.headers.origin;
  return configured === "*" || configured === origin ? configured : "null";
}

function responseHeaders(request, contentType = "application/json; charset=utf-8") {
  return {
    "Content-Type": contentType,
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": getCorsOrigin(request),
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

function sendJson(request, response, payload, status = 200) {
  const body = JSON.stringify(payload);
  response.writeHead(status, responseHeaders(request));
  response.end(body);
}

function safeId(value) {
  return typeof value === "string" && /^[a-z0-9][a-z0-9_-]{0,79}$/i.test(value);
}

function safeModelId(value) {
  return Number.isSafeInteger(value) && value > 0;
}

function parseStoredModelId(value) {
  if (safeModelId(value)) {
    return value;
  }
  if (typeof value !== "string" || !/^[1-9][0-9]{0,8}$/.test(value)) {
    return null;
  }
  const numericModelId = Number(value);
  return safeModelId(numericModelId) ? numericModelId : null;
}

function getCatalogVersion(payload) {
  const version = payload && typeof payload === "object" && !Array.isArray(payload) ? payload.version : null;
  if (!Number.isSafeInteger(version) || version < 1) {
    throw new Error("catalog version must be a positive integer");
  }
  return version;
}

function normalizeRatingCatalog(payload) {
  const version = getCatalogVersion(payload);
  if (!Array.isArray(payload.requirements) || payload.requirements.length > 1000) {
    throw new Error("catalog requirements must be an array with at most 1000 items");
  }

  const seenRequirements = new Set();
  const requirements = payload.requirements.map((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item) || !safeId(item.id)) {
      throw new Error("catalog requirement id is invalid");
    }
    if (seenRequirements.has(item.id)) {
      throw new Error("catalog requirement ids must be unique");
    }
    seenRequirements.add(item.id);
    if (!Array.isArray(item.modelIds) || item.modelIds.length > 100) {
      throw new Error("catalog model ids must be an array with at most 100 items");
    }
    const seenModels = new Set();
    const modelIdsForRequirement = item.modelIds.map((modelId) => {
      if (!safeModelId(modelId) || seenModels.has(modelId)) {
        throw new Error("catalog model ids must be unique positive integers");
      }
      seenModels.add(modelId);
      return modelId;
    });
    return { id: item.id, modelIds: modelIdsForRequirement };
  });
  return { version, requirements };
}

function setCatalogMemory(snapshot) {
  catalogSnapshot = snapshot;
  requirementIds = new Set(snapshot.requirements.map((item) => item.id));
  requirementModelIds = new Map(snapshot.requirements.map((item) => [item.id, new Set(item.modelIds)]));
  modelIds = new Set(snapshot.requirements.flatMap((item) => item.modelIds));
}

function persistCatalogSnapshot(snapshot) {
  database.prepare(`
    INSERT INTO catalog_snapshot (id, version, payload, synced_at)
    VALUES (1, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      version = excluded.version,
      payload = excluded.payload,
      synced_at = excluded.synced_at
  `).run(snapshot.version, JSON.stringify(snapshot), new Date().toISOString());
}

function applyCatalogSnapshot(payload) {
  const snapshot = normalizeRatingCatalog(payload);
  setCatalogMemory(snapshot);
  persistCatalogSnapshot(snapshot);
  return snapshot;
}

function loadStoredCatalog() {
  const row = database.prepare("SELECT version, payload FROM catalog_snapshot WHERE id = 1").get();
  if (!row) {
    return;
  }
  try {
    const snapshot = normalizeRatingCatalog(JSON.parse(row.payload));
    if (snapshot.version !== Number(row.version)) {
      throw new Error("stored catalog version does not match payload");
    }
    setCatalogMemory(snapshot);
    console.log(`Loaded rating catalog version ${snapshot.version} from database`);
  } catch (error) {
    console.error("Stored rating catalog is invalid", error);
  }
}

async function readRemoteCatalog() {
  if (!catalogUrl) {
    return JSON.parse(readFileSync(join(rootDir, "rating-catalog.json"), "utf8"));
  }
  const headers = catalogEtag ? { "If-None-Match": catalogEtag } : undefined;
  const response = await fetch(catalogUrl, {
    headers,
    signal: AbortSignal.timeout(10_000),
  });
  if (response.status === 304) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`catalog request failed with HTTP ${response.status}`);
  }
  catalogEtag = response.headers.get("etag") || catalogEtag;
  return JSON.parse(await response.text());
}

async function syncCatalog() {
  if (catalogSyncInFlight) {
    return catalogSyncInFlight;
  }
  catalogSyncInFlight = (async () => {
    try {
      const payload = await readRemoteCatalog();
      if (payload === null) {
        console.log("Rating catalog not modified");
        return;
      }
      const incomingVersion = getCatalogVersion(payload);
      if (catalogSnapshot && incomingVersion === catalogSnapshot.version) {
        console.log(`Rating catalog version ${incomingVersion} unchanged`);
        return;
      }
      if (catalogSnapshot && incomingVersion < catalogSnapshot.version) {
        console.error(`Rating catalog version ${incomingVersion} is older than ${catalogSnapshot.version}`);
        return;
      }
      const snapshot = applyCatalogSnapshot(payload);
      console.log(`Rating catalog updated to version ${snapshot.version}`);
    } catch (error) {
      console.error("Rating catalog sync failed", error);
    } finally {
      catalogSyncInFlight = null;
    }
  })();
  return catalogSyncInFlight;
}

function getClientIp(request) {
  if (trustProxy) {
    const forwarded = request.headers["x-forwarded-for"];
    if (typeof forwarded === "string" && forwarded.length > 0) {
      return forwarded.split(",")[0].trim();
    }
    const realIp = request.headers["x-real-ip"];
    if (typeof realIp === "string" && realIp.length > 0) {
      return realIp;
    }
  }
  return request.socket.remoteAddress || "unknown";
}

function getDailyKey() {
  return new Date().toISOString().slice(0, 10);
}

function hashIp(ip, day) {
  return createHash("sha256").update(`${ipHashSecret}:${day}:${ip}`).digest("hex");
}

function parseBody(request) {
  return new Promise((resolveBody, reject) => {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 16 * 1024) {
        reject(new Error("request body too large"));
        request.destroy();
      }
    });
    request.on("end", () => {
      try {
        resolveBody(JSON.parse(body));
      } catch {
        reject(new Error("invalid json"));
      }
    });
    request.on("error", reject);
  });
}

function getRatings(request, response, url) {
  if (!catalogSnapshot) {
    sendJson(request, response, { error: "catalog_not_ready" }, 503);
    return;
  }
  const requirementId = url.searchParams.get("requirementId") || "";
  if (!safeId(requirementId) || !requirementIds.has(requirementId)) {
    sendJson(request, response, { error: "invalid_requirement_id" }, 400);
    return;
  }
  const rows = database.prepare(`
    SELECT model_id, COUNT(*) AS vote_count, COALESCE(SUM(stars_half), 0) AS stars_half_sum
    FROM votes
    WHERE requirement_id = ?
    GROUP BY model_id
  `).all(requirementId);
  const data = rows.map((row) => ({
    modelId: parseStoredModelId(row.model_id),
    voteCount: Number(row.vote_count),
    starsHalfSum: Number(row.stars_half_sum),
    averageStars: Number((Number(row.stars_half_sum) / Number(row.vote_count) / 2).toFixed(2)),
  })).filter((item) => safeModelId(item.modelId));
  sendJson(request, response, { data });
}

async function createVote(request, response) {
  let body;
  try {
    body = await parseBody(request);
  } catch {
    sendJson(request, response, { error: "invalid_json" }, 400);
    return;
  }

  const requirementId = body?.requirementId;
  const modelId = body?.modelId;
  const starsHalf = Number(body?.starsHalf);
  const allowedModels = requirementModelIds.get(requirementId);
  if (!catalogSnapshot || !safeId(requirementId) || !requirementIds.has(requirementId) || !safeModelId(modelId) || !modelIds.has(modelId) || !allowedModels?.has(modelId) || !Number.isInteger(starsHalf) || starsHalf < 1 || starsHalf > 10) {
    if (!catalogSnapshot) {
      sendJson(request, response, { error: "catalog_not_ready" }, 503);
      return;
    }
    sendJson(request, response, { error: "invalid_vote" }, 400);
    return;
  }

  const day = getDailyKey();
  const ipHash = hashIp(getClientIp(request), day);
  const voteId = randomUUID();
  const result = database.prepare(`
    INSERT INTO votes (id, requirement_id, model_id, stars_half, day, ip_hash, created_at)
    SELECT ?, ?, ?, ?, ?, ?, ?
    WHERE (
      SELECT COUNT(*)
      FROM votes
      WHERE day = ? AND requirement_id = ? AND model_id = ? AND ip_hash = ?
    ) < ?
  `).run(
    voteId,
    requirementId,
    modelId,
    starsHalf,
    day,
    ipHash,
    new Date().toISOString(),
    day,
    requirementId,
    modelId,
    ipHash,
    Number.isFinite(maxVotesPerDay) && maxVotesPerDay > 0 ? maxVotesPerDay : 10,
  );

  if (Number(result.changes) !== 1) {
    sendJson(request, response, { error: "daily_limit_reached", limit: maxVotesPerDay }, 429);
    return;
  }
  sendJson(request, response, { data: { voteId, requirementId, modelId, starsHalf } }, 201);
}

function serveStatic(request, response, url) {
  const requestedPath = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const absolutePath = resolve(rootDir, `.${normalize(requestedPath)}`);
  const relativePath = relative(rootDir, absolutePath);
  const blockedExtensions = new Set([".db", ".sqlite", ".sqlite3", ".wal", ".shm", ".zip", ".mjs", ".toml", ".sql", ".md"]);
  const blockedDirectory = relativePath === "data" || relativePath.startsWith("data/") || relativePath === "privacy-ocr" || relativePath.startsWith("privacy-ocr/");
  if (relativePath.startsWith("..") || relativePath.includes("..") || blockedDirectory || blockedExtensions.has(extname(absolutePath).toLowerCase())) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }
  if (!existsSync(absolutePath)) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }
  response.writeHead(200, {
    "Content-Type": contentTypes[extname(absolutePath).toLowerCase()] || "application/octet-stream",
    "Cache-Control": "no-cache",
  });
  createReadStream(absolutePath).pipe(response);
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
  if (request.method === "OPTIONS") {
    response.writeHead(204, responseHeaders(request));
    response.end();
    return;
  }
  try {
    if (url.pathname === "/api/rating-config" && request.method === "GET") {
      sendJson(request, response, { data: { turnstileRequired: false, turnstileSiteKey: null, maxVotesPerDay } });
      return;
    }
    if (url.pathname === "/api/ratings" && request.method === "GET") {
      getRatings(request, response, url);
      return;
    }
    if (url.pathname === "/api/ratings/vote" && request.method === "POST") {
      await createVote(request, response);
      return;
    }
    if (url.pathname.startsWith("/api/")) {
      sendJson(request, response, { error: "not_found" }, 404);
      return;
    }
    serveStatic(request, response, url);
  } catch (error) {
    console.error("Rating server request failed", error);
    if (!response.headersSent) {
      sendJson(request, response, { error: "internal_error" }, 500);
    } else {
      response.destroy();
    }
  }
});

async function startServer() {
  loadStoredCatalog();
  await syncCatalog();
  catalogSyncTimer = setInterval(() => {
    void syncCatalog();
  }, catalogSyncIntervalMs);
  catalogSyncTimer.unref?.();
  server.listen(port, "0.0.0.0", () => {
    console.log(`Rating server listening on http://0.0.0.0:${port}`);
  });
}

void startServer();

function shutdown() {
  if (catalogSyncTimer) {
    clearInterval(catalogSyncTimer);
  }
  database.close();
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
