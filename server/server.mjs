import { createHash, randomUUID } from "node:crypto";
import { mkdirSync, readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";
import { isIP } from "node:net";

const rootDir = fileURLToPath(new URL(".", import.meta.url));
const port = Number.parseInt(process.env.PORT || "13250", 10);
const databasePath = resolve(process.env.RATING_DB || join(rootDir, "data", "ratings.sqlite"));
const configuredVoteLimit = Number.parseInt(process.env.MAX_VOTES_PER_DAY || "10", 10);
const maxVotesPerDay = Number.isFinite(configuredVoteLimit) ? Math.max(5, configuredVoteLimit) : 10;
const configuredCaseVoteLimit = Number.parseInt(process.env.MAX_CASE_VOTES_PER_DAY || String(maxVotesPerDay), 10);
const maxCaseVotesPerDay = Number.isFinite(configuredCaseVoteLimit) ? Math.max(5, configuredCaseVoteLimit) : maxVotesPerDay;
const configuredRequestInterval = Number.parseInt(process.env.REQUEST_INTERVAL_MS || "300000", 10);
const requestIntervalMs = Number.isFinite(configuredRequestInterval) ? Math.max(0, configuredRequestInterval) : 300_000;
const ipHashSecret = String(process.env.IP_HASH_SECRET || "").trim();
if (ipHashSecret.length < 32) {
  throw new Error("IP_HASH_SECRET must be at least 32 characters");
}
const visitorCookieName = "scriverse_visitor_id";
const visitorCookieMaxAge = 315_360_000;
const trustProxy = process.env.TRUST_PROXY === "true";
const configuredTrustedProxyIps = String(process.env.TRUSTED_PROXY_IPS || "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
if (configuredTrustedProxyIps.some((value) => isIP(value) === 0)) {
  throw new Error("TRUSTED_PROXY_IPS must contain only valid IP addresses");
}
const trustedProxyIps = new Set(configuredTrustedProxyIps);
const allowedOrigin = String(process.env.ALLOWED_ORIGIN || "").trim();
if (allowedOrigin === "*" || allowedOrigin === "null") {
  throw new Error("ALLOWED_ORIGIN must be an explicit HTTP or HTTPS origin");
}
if (allowedOrigin) {
  let parsedAllowedOrigin;
  try {
    parsedAllowedOrigin = new URL(allowedOrigin);
  } catch {
    throw new Error("ALLOWED_ORIGIN must be a valid HTTP or HTTPS origin");
  }
  if (!["http:", "https:"].includes(parsedAllowedOrigin.protocol)
    || parsedAllowedOrigin.username
    || parsedAllowedOrigin.password
    || parsedAllowedOrigin.hash
    || parsedAllowedOrigin.origin !== allowedOrigin) {
    throw new Error("ALLOWED_ORIGIN must be a valid HTTP or HTTPS origin");
  }
}
const catalogUrl = String(process.env.CATALOG_URL || "").trim();
if (catalogUrl) {
  let parsedCatalogUrl;
  try {
    parsedCatalogUrl = new URL(catalogUrl);
  } catch {
    throw new Error("CATALOG_URL must be a valid HTTPS URL");
  }
  if (parsedCatalogUrl.protocol !== "https:" || parsedCatalogUrl.username || parsedCatalogUrl.password) {
    throw new Error("CATALOG_URL must use HTTPS without embedded credentials");
  }
}
const configuredCatalogSyncInterval = Number.parseInt(process.env.CATALOG_SYNC_INTERVAL_MS || "600000", 10);
const catalogSyncIntervalMs = Number.isFinite(configuredCatalogSyncInterval)
  ? Math.max(60_000, configuredCatalogSyncInterval)
  : 600_000;
const configuredGlobalRequestLimit = Number.parseInt(process.env.MAX_API_REQUESTS_PER_MINUTE || "120", 10);
const maxApiRequestsPerMinute = Number.isFinite(configuredGlobalRequestLimit)
  ? Math.max(0, configuredGlobalRequestLimit)
  : 120;
const maxTrackedGlobalRateLimitKeys = 10_000;
const maxRequestBodyBytes = 16 * 1024;
const configuredCatalogMaxBytes = Number.parseInt(process.env.MAX_CATALOG_BYTES || String(4 * 1024 * 1024), 10);
const maxCatalogBytes = Number.isFinite(configuredCatalogMaxBytes)
  ? Math.max(64 * 1024, configuredCatalogMaxBytes)
  : 4 * 1024 * 1024;
const rateLimitStateRetentionMs = Math.max(2 * 24 * 60 * 60 * 1000, requestIntervalMs + 24 * 60 * 60 * 1000);

function logEvent(event, fields = {}, level = "info") {
  const entry = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    event,
    ...fields,
  });
  if (level === "error") {
    console.error(entry);
    return;
  }
  console.log(entry);
}

function getErrorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

mkdirSync(resolve(databasePath, ".."), { recursive: true });
const database = new DatabaseSync(databasePath);
database.exec("PRAGMA journal_mode = WAL");
database.exec("PRAGMA busy_timeout = 5000");
database.exec(`
  CREATE TABLE IF NOT EXISTS votes (
    id TEXT PRIMARY KEY,
    requirement_id TEXT NOT NULL,
    model_id INTEGER NOT NULL,
    stars_half INTEGER NOT NULL CHECK (stars_half BETWEEN 0 AND 10),
    day TEXT NOT NULL,
    ip_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS votes_daily_limit_idx
    ON votes (day, requirement_id, model_id, ip_hash);
  CREATE INDEX IF NOT EXISTS votes_rating_totals_idx
    ON votes (requirement_id, model_id);
  CREATE TABLE IF NOT EXISTS request_rate_limits (
    ip_hash TEXT NOT NULL,
    requirement_id TEXT NOT NULL,
    model_id INTEGER NOT NULL,
    last_request_at INTEGER NOT NULL,
    PRIMARY KEY (ip_hash, requirement_id, model_id)
  );
  CREATE TABLE IF NOT EXISTS visitor_ratings (
    visitor_id_hash TEXT NOT NULL,
    requirement_id TEXT NOT NULL,
    model_id INTEGER NOT NULL,
    vote_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (visitor_id_hash, requirement_id, model_id)
  );
  CREATE TABLE IF NOT EXISTS case_votes (
    id TEXT PRIMARY KEY,
    requirement_id TEXT NOT NULL,
    test_case_id TEXT NOT NULL,
    case_hash TEXT NOT NULL,
    reaction INTEGER NOT NULL CHECK (reaction IN (-1, 1)),
    day TEXT NOT NULL,
    ip_hash TEXT NOT NULL,
    visitor_id_hash TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    UNIQUE (visitor_id_hash, requirement_id, test_case_id, case_hash)
  );
  CREATE INDEX IF NOT EXISTS case_votes_daily_limit_idx
    ON case_votes (day, requirement_id, test_case_id, case_hash, ip_hash);
  CREATE INDEX IF NOT EXISTS case_votes_totals_idx
    ON case_votes (requirement_id, test_case_id, case_hash);
  CREATE TABLE IF NOT EXISTS case_vote_rate_limits (
    ip_hash TEXT NOT NULL,
    requirement_id TEXT NOT NULL,
    test_case_id TEXT NOT NULL,
    case_hash TEXT NOT NULL,
    last_request_at INTEGER NOT NULL,
    PRIMARY KEY (ip_hash, requirement_id, test_case_id, case_hash)
  );
  CREATE TABLE IF NOT EXISTS catalog_snapshot (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    version INTEGER NOT NULL,
    payload TEXT NOT NULL,
    synced_at TEXT NOT NULL
  );
`);

function migrateVotesTable() {
  const table = database.prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'votes'").get();
  if (!table?.sql || (!/BETWEEN\s+1\s+AND\s+10/i.test(table.sql) && !/model_id\s+TEXT/i.test(table.sql))) {
    return;
  }
  database.exec(`
    BEGIN IMMEDIATE;
    DROP INDEX IF EXISTS votes_daily_limit_idx;
    DROP INDEX IF EXISTS votes_rating_totals_idx;
    ALTER TABLE votes RENAME TO votes_legacy;
    CREATE TABLE votes (
      id TEXT PRIMARY KEY,
      requirement_id TEXT NOT NULL,
      model_id INTEGER NOT NULL,
      stars_half INTEGER NOT NULL CHECK (stars_half BETWEEN 0 AND 10),
      day TEXT NOT NULL,
      ip_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    INSERT INTO votes (id, requirement_id, model_id, stars_half, day, ip_hash, created_at)
      SELECT id, requirement_id, CAST(model_id AS INTEGER), stars_half, day, ip_hash, created_at
      FROM votes_legacy
      WHERE CAST(model_id AS REAL) >= 1
        AND CAST(model_id AS REAL) = CAST(model_id AS INTEGER);
    DROP TABLE votes_legacy;
    CREATE INDEX votes_daily_limit_idx
      ON votes (day, requirement_id, model_id, ip_hash);
    CREATE INDEX votes_rating_totals_idx
      ON votes (requirement_id, model_id);
    COMMIT;
  `);
}

function migrateRequestRateLimitsTable() {
  const table = database.prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'request_rate_limits'").get();
  if (!table?.sql || /PRIMARY KEY\s*\(\s*ip_hash\s*,\s*requirement_id\s*,\s*model_id\s*\)/i.test(table.sql)) {
    return;
  }
  database.exec(`
    BEGIN IMMEDIATE;
    ALTER TABLE request_rate_limits RENAME TO request_rate_limits_legacy;
    CREATE TABLE request_rate_limits (
      ip_hash TEXT NOT NULL,
      requirement_id TEXT NOT NULL,
      model_id INTEGER NOT NULL,
      last_request_at INTEGER NOT NULL,
      PRIMARY KEY (ip_hash, requirement_id, model_id)
    );
    DROP TABLE request_rate_limits_legacy;
    COMMIT;
  `);
}

function migrateCaseVotesTable() {
  const table = database.prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'case_votes'").get();
  if (!table?.sql || /case_hash\s+TEXT/i.test(table.sql)) {
    return;
  }
  database.exec(`
    BEGIN IMMEDIATE;
    DROP INDEX IF EXISTS case_votes_daily_limit_idx;
    DROP INDEX IF EXISTS case_votes_totals_idx;
    ALTER TABLE case_votes RENAME TO case_votes_legacy;
    CREATE TABLE case_votes (
      id TEXT PRIMARY KEY,
      requirement_id TEXT NOT NULL,
      test_case_id TEXT NOT NULL,
      case_hash TEXT NOT NULL,
      reaction INTEGER NOT NULL CHECK (reaction IN (-1, 1)),
      day TEXT NOT NULL,
      ip_hash TEXT NOT NULL,
      visitor_id_hash TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE (visitor_id_hash, requirement_id, test_case_id, case_hash)
    );
    INSERT INTO case_votes (
      id,
      requirement_id,
      test_case_id,
      case_hash,
      reaction,
      day,
      ip_hash,
      visitor_id_hash,
      created_at,
      updated_at
    )
    SELECT
      id,
      requirement_id,
      test_case_id,
      'legacy',
      reaction,
      day,
      ip_hash,
      visitor_id_hash,
      created_at,
      updated_at
    FROM case_votes_legacy;
    DROP TABLE case_votes_legacy;
    CREATE INDEX case_votes_daily_limit_idx
      ON case_votes (day, requirement_id, test_case_id, case_hash, ip_hash);
    CREATE INDEX case_votes_totals_idx
      ON case_votes (requirement_id, test_case_id, case_hash);
    COMMIT;
  `);
}

function migrateCaseVoteRateLimitsTable() {
  const table = database.prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'case_vote_rate_limits'").get();
  if (!table?.sql || /case_hash\s+TEXT/i.test(table.sql)) {
    return;
  }
  database.exec(`
    BEGIN IMMEDIATE;
    ALTER TABLE case_vote_rate_limits RENAME TO case_vote_rate_limits_legacy;
    CREATE TABLE case_vote_rate_limits (
      ip_hash TEXT NOT NULL,
      requirement_id TEXT NOT NULL,
      test_case_id TEXT NOT NULL,
      case_hash TEXT NOT NULL,
      last_request_at INTEGER NOT NULL,
      PRIMARY KEY (ip_hash, requirement_id, test_case_id, case_hash)
    );
    INSERT INTO case_vote_rate_limits (ip_hash, requirement_id, test_case_id, case_hash, last_request_at)
      SELECT ip_hash, requirement_id, test_case_id, 'legacy', last_request_at
      FROM case_vote_rate_limits_legacy;
    DROP TABLE case_vote_rate_limits_legacy;
    COMMIT;
  `);
}

migrateVotesTable();
migrateRequestRateLimitsTable();
migrateCaseVotesTable();
migrateCaseVoteRateLimitsTable();

let catalogSnapshot = null;
let requirementIds = new Set();
let modelIds = new Set();
let requirementModelIds = new Map();
let requirementTestCases = new Map();
let catalogEtag = null;
let catalogSyncInFlight = null;
let catalogSyncTimer = null;
let rateLimitCleanupTimer = null;
const globalRequestBuckets = new Map();

function getCorsOrigin(request) {
  const origin = request.headers.origin;
  return allowedOrigin && origin === allowedOrigin ? allowedOrigin : null;
}

function getCookieValue(request, name) {
  const cookieHeader = request.headers.cookie;
  if (typeof cookieHeader !== "string") {
    return null;
  }
  const cookie = cookieHeader.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${name}=`));
  return cookie ? cookie.slice(name.length + 1) : null;
}

function initializeVisitorCookie(request) {
  const existingId = getCookieValue(request, visitorCookieName);
  if (typeof existingId === "string" && /^[A-Za-z0-9_-]{36,64}$/.test(existingId)) {
    return { id: existingId, setCookie: null };
  }
  const id = randomUUID();
  const secureAttribute = process.env.COOKIE_SECURE === "false" ? "" : "; Secure";
  return {
    id,
    setCookie: `${visitorCookieName}=${id}; Max-Age=${visitorCookieMaxAge}; Path=/; HttpOnly; SameSite=None${secureAttribute}`,
  };
}

function responseHeaders(request, contentType = "application/json; charset=utf-8") {
  const corsOrigin = getCorsOrigin(request);
  const headers = {
    "Content-Type": contentType,
    "Cache-Control": "no-store",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "X-Content-Type-Options": "nosniff",
    Vary: "Origin",
  };
  if (corsOrigin) {
    headers["Access-Control-Allow-Origin"] = corsOrigin;
    headers["Access-Control-Allow-Credentials"] = "true";
  }
  if (request.visitorCookieToSet) {
    headers["Set-Cookie"] = request.visitorCookieToSet;
  }
  return headers;
}

function sendJson(request, response, payload, status = 200, headers = {}) {
  const body = JSON.stringify(payload);
  response.writeHead(status, { ...responseHeaders(request), ...headers });
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
  if (typeof value !== "string") {
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
    if (item.testCases === undefined && version < 9) {
      return { id: item.id, modelIds: modelIdsForRequirement, testCases: [] };
    }
    if (!Array.isArray(item.testCases) || item.testCases.length > 1000) {
      throw new Error("catalog test cases must be an array with at most 1000 items");
    }
    const seenTestCases = new Set();
    const testCasesForRequirement = item.testCases.map((testCase) => {
      const testCaseId = testCase?.id;
      const content = testCase?.content;
      if (!testCase || typeof testCase !== "object" || Array.isArray(testCase)
        || !safeId(testCaseId)
        || seenTestCases.has(testCaseId)
        || typeof content !== "string"
        || content.length === 0
        || content.length > 20_000) {
        throw new Error("catalog test cases must have unique safe ids and non-empty content");
      }
      seenTestCases.add(testCaseId);
      return { id: testCaseId, content };
    });
    return {
      id: item.id,
      modelIds: modelIdsForRequirement,
      testCases: testCasesForRequirement,
    };
  });
  return { version, requirements };
}

function setCatalogMemory(snapshot) {
  catalogSnapshot = snapshot;
  requirementIds = new Set(snapshot.requirements.map((item) => item.id));
  requirementModelIds = new Map(snapshot.requirements.map((item) => [item.id, new Set(item.modelIds)]));
  requirementTestCases = new Map(snapshot.requirements.map((item) => [
    item.id,
    new Map(item.testCases.map((testCase) => [
      testCase.id,
      hashCaseVote(item.id, testCase.id, testCase.content),
    ])),
  ]));
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
    logEvent("catalog_loaded", { version: snapshot.version, source: "database" });
  } catch (error) {
    logEvent("catalog_load_failed", { error: getErrorMessage(error) }, "error");
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
  const contentLength = Number(response.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > maxCatalogBytes) {
    throw new Error("catalog response is too large");
  }
  const reader = response.body?.getReader();
  if (!reader) {
    const text = await response.text();
    if (Buffer.byteLength(text, "utf8") > maxCatalogBytes) {
      throw new Error("catalog response is too large");
    }
    return JSON.parse(text);
  }
  const chunks = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      totalBytes += value.byteLength;
      if (totalBytes > maxCatalogBytes) {
        await reader.cancel();
        throw new Error("catalog response is too large");
      }
      chunks.push(Buffer.from(value));
    }
  } finally {
    reader.releaseLock();
  }
  return JSON.parse(Buffer.concat(chunks, totalBytes).toString("utf8"));
}

async function syncCatalog() {
  if (catalogSyncInFlight) {
    return catalogSyncInFlight;
  }
  catalogSyncInFlight = (async () => {
    try {
      const payload = await readRemoteCatalog();
      if (payload === null) {
        logEvent("catalog_sync_skipped", { reason: "not_modified" });
        return;
      }
      const incomingVersion = getCatalogVersion(payload);
      if (catalogSnapshot && incomingVersion === catalogSnapshot.version) {
        logEvent("catalog_sync_skipped", { reason: "version_unchanged", version: incomingVersion });
        return;
      }
      if (catalogSnapshot && incomingVersion < catalogSnapshot.version) {
        logEvent("catalog_sync_rejected", {
          reason: "older_version",
          version: incomingVersion,
          currentVersion: catalogSnapshot.version,
        }, "error");
        return;
      }
      const snapshot = applyCatalogSnapshot(payload);
      logEvent("catalog_synced", { version: snapshot.version });
    } catch (error) {
      logEvent("catalog_sync_failed", { error: getErrorMessage(error) }, "error");
    } finally {
      catalogSyncInFlight = null;
    }
  })();
  return catalogSyncInFlight;
}

function getValidIp(value) {
  if (typeof value !== "string") {
    return null;
  }
  const ip = value.trim();
  return isIP(ip) > 0 ? ip : null;
}

function isPrivateProxyAddress(value) {
  const ip = getValidIp(value);
  if (!ip) {
    return false;
  }
  const mappedIpv4 = ip.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i)?.[1];
  const ipv4 = mappedIpv4 || (isIP(ip) === 4 ? ip : null);
  if (ipv4) {
    const octets = ipv4.split(".").map(Number);
    return octets[0] === 10
      || octets[0] === 127
      || (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31)
      || (octets[0] === 192 && octets[1] === 168)
      || (octets[0] === 169 && octets[1] === 254);
  }
  return ip === "::1" || /^f[cd]/i.test(ip) || /^fe[89ab]/i.test(ip);
}

function isTrustedProxyAddress(value) {
  const ip = getValidIp(value);
  if (!ip) {
    return false;
  }
  if (trustedProxyIps.size > 0) {
    return trustedProxyIps.has(ip);
  }
  return isPrivateProxyAddress(ip);
}

function getClientIp(request) {
  const remoteIp = request.socket.remoteAddress || "unknown";
  if (!trustProxy || !isTrustedProxyAddress(remoteIp)) {
    return remoteIp;
  }
  const realIp = getValidIp(request.headers["x-real-ip"]);
  if (realIp) {
    return realIp;
  }
  const forwarded = request.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    const firstForwardedIp = getValidIp(forwarded.split(",")[0]);
    if (firstForwardedIp) {
      return firstForwardedIp;
    }
  }
  return remoteIp;
}

function getRequestIp(request) {
  return {
    ip: getClientIp(request),
    remoteIp: request.socket.remoteAddress || "unknown",
  };
}

function attachRequestLogging(request, response, url) {
  const requestId = randomUUID();
  const startedAt = process.hrtime.bigint();
  const { ip, remoteIp } = getRequestIp(request);
  const visitorCookie = initializeVisitorCookie(request);
  request.requestId = requestId;
  request.clientIp = ip;
  request.visitorId = visitorCookie.id;
  request.visitorIdHash = hashVisitorId(visitorCookie.id);
  request.visitorCookieToSet = visitorCookie.setCookie;
  let completed = false;

  logEvent("http_request_started", {
    requestId,
    method: request.method,
    path: url.pathname,
    ip,
    remoteIp,
    userAgent: request.headers["user-agent"] || null,
    contentLength: request.headers["content-length"] || null,
  });

  const logCompletion = () => {
    if (completed) {
      return;
    }
    completed = true;
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
    logEvent("http_request_completed", {
      requestId,
      method: request.method,
      path: url.pathname,
      ip,
      remoteIp,
      status: response.statusCode,
      durationMs: Number(durationMs.toFixed(2)),
      clientDisconnected: !response.writableEnded,
    });
  };

  response.once("finish", logCompletion);
  response.once("close", logCompletion);
}

function getVoteLogFields(body) {
  const fields = {};
  if (typeof body?.requirementId === "string") {
    fields.requirementId = body.requirementId.slice(0, 80);
  }
  if (Number.isSafeInteger(body?.modelId)) {
    fields.modelId = body.modelId;
  }
  if (Number.isInteger(body?.starsHalf) && body.starsHalf >= 0 && body.starsHalf <= 10) {
    fields.starsHalf = body.starsHalf;
    fields.stars = body.starsHalf / 2;
  }
  return fields;
}

function logVote(request, result, status, body, fields = {}) {
  logEvent("rating_vote", {
    requestId: request.requestId,
    ip: request.clientIp,
    result,
    status,
    ...getVoteLogFields(body),
    ...fields,
  }, result === "accepted" ? "info" : "warn");
}

function getCaseVoteLogFields(body) {
  const fields = {};
  if (typeof body?.requirementId === "string") {
    fields.requirementId = body.requirementId.slice(0, 80);
  }
  if (typeof body?.testCaseId === "string") {
    fields.testCaseId = body.testCaseId.slice(0, 80);
  }
  if (body?.reaction === "up" || body?.reaction === "down") {
    fields.reaction = body.reaction;
  }
  return fields;
}

function logCaseVote(request, result, status, body, fields = {}) {
  logEvent("case_vote", {
    requestId: request.requestId,
    ip: request.clientIp,
    result,
    status,
    ...getCaseVoteLogFields(body),
    ...fields,
  }, ["accepted", "updated", "unchanged"].includes(result) ? "info" : "warn");
}

function getDailyKey() {
  return new Date().toISOString().slice(0, 10);
}

function hashIp(ip, day) {
  return createHash("sha256").update(`${ipHashSecret}:${day}:${ip}`).digest("hex");
}

function hashCaseVote(requirementId, testCaseId, content) {
  return createHash("sha256")
    .update(`${requirementId}\n${testCaseId}\n${content}`)
    .digest("hex");
}

function hashRateLimitIp(ip) {
  return createHash("sha256").update(`${ipHashSecret}:request-rate-limit:${ip}`).digest("hex");
}

function hashVisitorId(visitorId) {
  return createHash("sha256").update(`${ipHashSecret}:visitor:${visitorId}`).digest("hex");
}

function cleanupGlobalRequestBuckets(now) {
  for (const [key, bucket] of globalRequestBuckets) {
    if (now - bucket.windowStartedAt >= 60_000) {
      globalRequestBuckets.delete(key);
    }
  }
}

function takeGlobalRequestSlot(ip) {
  if (maxApiRequestsPerMinute === 0) {
    return { allowed: true };
  }

  const now = Date.now();
  const key = hashRateLimitIp(ip);
  let bucket = globalRequestBuckets.get(key);
  if (!bucket || now - bucket.windowStartedAt >= 60_000) {
    if (globalRequestBuckets.size >= maxTrackedGlobalRateLimitKeys) {
      cleanupGlobalRequestBuckets(now);
    }
    if (globalRequestBuckets.size >= maxTrackedGlobalRateLimitKeys) {
      return { allowed: false, retryAfterSeconds: 60 };
    }
    bucket = { windowStartedAt: now, count: 0 };
    globalRequestBuckets.set(key, bucket);
  }
  bucket.count += 1;
  if (bucket.count > maxApiRequestsPerMinute) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((60_000 - (now - bucket.windowStartedAt)) / 1000)),
    };
  }
  return { allowed: true };
}

function takeRequestSlot(ip, requirementId, modelId) {
  if (requestIntervalMs === 0) {
    return { allowed: true };
  }

  const now = Date.now();
  const ipHash = hashRateLimitIp(ip);
  const previous = database.prepare(`
    SELECT last_request_at
    FROM request_rate_limits
    WHERE ip_hash = ? AND requirement_id = ? AND model_id = ?
  `).get(ipHash, requirementId, modelId);
  const lastRequestAt = Number(previous?.last_request_at);
  if (Number.isFinite(lastRequestAt) && now - lastRequestAt < requestIntervalMs) {
    const retryAfterSeconds = Math.max(1, Math.ceil((requestIntervalMs - (now - lastRequestAt)) / 1000));
    return { allowed: false, retryAfterSeconds };
  }

  database.prepare(`
    INSERT INTO request_rate_limits (ip_hash, requirement_id, model_id, last_request_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(ip_hash, requirement_id, model_id) DO UPDATE SET last_request_at = excluded.last_request_at
  `).run(ipHash, requirementId, modelId, now);
  return { allowed: true };
}

function takeCaseVoteRequestSlot(ip, requirementId, testCaseId, caseHash) {
  if (requestIntervalMs === 0) {
    return { allowed: true };
  }

  const now = Date.now();
  const ipHash = hashRateLimitIp(ip);
  const previous = database.prepare(`
    SELECT last_request_at
    FROM case_vote_rate_limits
    WHERE ip_hash = ? AND requirement_id = ? AND test_case_id = ? AND case_hash = ?
  `).get(ipHash, requirementId, testCaseId, caseHash);
  const lastRequestAt = Number(previous?.last_request_at);
  if (Number.isFinite(lastRequestAt) && now - lastRequestAt < requestIntervalMs) {
    const retryAfterSeconds = Math.max(1, Math.ceil((requestIntervalMs - (now - lastRequestAt)) / 1000));
    return { allowed: false, retryAfterSeconds };
  }

  database.prepare(`
    INSERT INTO case_vote_rate_limits (ip_hash, requirement_id, test_case_id, case_hash, last_request_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(ip_hash, requirement_id, test_case_id, case_hash) DO UPDATE SET last_request_at = excluded.last_request_at
  `).run(ipHash, requirementId, testCaseId, caseHash, now);
  return { allowed: true };
}

function cleanupRequestRateLimitState() {
  const cutoff = Date.now() - rateLimitStateRetentionMs;
  database.prepare("DELETE FROM request_rate_limits WHERE last_request_at < ?").run(cutoff);
  database.prepare("DELETE FROM case_vote_rate_limits WHERE last_request_at < ?").run(cutoff);
}

function hasVisitorRated(visitorIdHash, requirementId, modelId) {
  return Boolean(database.prepare(`
    SELECT vote_id
    FROM visitor_ratings
    WHERE visitor_id_hash = ? AND requirement_id = ? AND model_id = ?
  `).get(visitorIdHash, requirementId, modelId));
}

function recordVote({ voteId, requirementId, modelId, starsHalf, day, ipHash, visitorIdHash, createdAt }) {
  database.exec("BEGIN IMMEDIATE");
  try {
    if (hasVisitorRated(visitorIdHash, requirementId, modelId)) {
      database.exec("ROLLBACK");
      return { type: "already_rated" };
    }

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
      createdAt,
      day,
      requirementId,
      modelId,
      ipHash,
      Number.isFinite(maxVotesPerDay) && maxVotesPerDay > 0 ? maxVotesPerDay : 10,
    );

    if (Number(result.changes) !== 1) {
      database.exec("ROLLBACK");
      return { type: "daily_limit_reached" };
    }

    database.prepare(`
      INSERT INTO visitor_ratings (visitor_id_hash, requirement_id, model_id, vote_id, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(visitorIdHash, requirementId, modelId, voteId, createdAt);
    database.exec("COMMIT");
    return { type: "accepted" };
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
}

function recordCaseVote({ voteId, requirementId, testCaseId, caseHash, reaction, day, ipHash, visitorIdHash, createdAt }) {
  database.exec("BEGIN IMMEDIATE");
  try {
    const previous = database.prepare(`
      SELECT reaction
      FROM case_votes
      WHERE visitor_id_hash = ? AND requirement_id = ? AND test_case_id = ? AND case_hash = ?
    `).get(visitorIdHash, requirementId, testCaseId, caseHash);

    if (previous) {
      if (Number(previous.reaction) === reaction) {
        database.exec("COMMIT");
        return { type: "unchanged" };
      }
      database.prepare(`
        UPDATE case_votes
        SET reaction = ?, day = ?, ip_hash = ?, updated_at = ?
        WHERE visitor_id_hash = ? AND requirement_id = ? AND test_case_id = ? AND case_hash = ?
      `).run(reaction, day, ipHash, createdAt, visitorIdHash, requirementId, testCaseId, caseHash);
      database.exec("COMMIT");
      return { type: "updated" };
    }

    const result = database.prepare(`
      INSERT INTO case_votes (
        id,
        requirement_id,
        test_case_id,
        case_hash,
        reaction,
        day,
        ip_hash,
        visitor_id_hash,
        created_at,
        updated_at
      )
      SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      WHERE (
        SELECT COUNT(*)
        FROM case_votes
        WHERE day = ? AND requirement_id = ? AND test_case_id = ? AND case_hash = ? AND ip_hash = ?
      ) < ?
    `).run(
      voteId,
      requirementId,
      testCaseId,
      caseHash,
      reaction,
      day,
      ipHash,
      visitorIdHash,
      createdAt,
      createdAt,
      day,
      requirementId,
      testCaseId,
      caseHash,
      ipHash,
      maxCaseVotesPerDay,
    );

    if (Number(result.changes) !== 1) {
      database.exec("ROLLBACK");
      return { type: "daily_limit_reached" };
    }

    database.exec("COMMIT");
    return { type: "accepted" };
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
}

function isAllowedRequestOrigin(request) {
  const origin = request.headers.origin;
  if (typeof origin !== "string" || origin.length === 0) {
    return true;
  }
  if (allowedOrigin) {
    return origin === allowedOrigin;
  }
  const host = request.headers.host;
  return typeof host === "string" && (origin === `http://${host}` || origin === `https://${host}`);
}

function isJsonContentType(request) {
  const contentType = request.headers["content-type"];
  return typeof contentType === "string" && /^application\/json(?:\s*;|$)/i.test(contentType.trim());
}

function validateJsonWriteRequest(request, response, logFunction) {
  if (!isAllowedRequestOrigin(request)) {
    logFunction(request, "origin_not_allowed", 403, null);
    sendJson(request, response, { error: "origin_not_allowed" }, 403);
    return false;
  }
  if (!isJsonContentType(request)) {
    logFunction(request, "unsupported_media_type", 415, null);
    sendJson(request, response, { error: "unsupported_media_type" }, 415);
    return false;
  }
  return true;
}

function parseBody(request) {
  return new Promise((resolveBody, reject) => {
    request.on("error", reject);
    const contentLength = Number(request.headers["content-length"]);
    if (Number.isFinite(contentLength) && contentLength > maxRequestBodyBytes) {
      reject(new Error("request body too large"));
      request.destroy();
      return;
    }
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body, "utf8") > maxRequestBodyBytes) {
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
  if (!validateJsonWriteRequest(request, response, logVote)) {
    return;
  }
  let body;
  try {
    body = await parseBody(request);
  } catch {
    logVote(request, "invalid_json", 400, null);
    sendJson(request, response, { error: "invalid_json" }, 400);
    return;
  }

  const requirementId = body?.requirementId;
  const modelId = body?.modelId;
  const starsHalf = body?.starsHalf;
  const allowedModels = requirementModelIds.get(requirementId);
  if (!Number.isInteger(starsHalf) || starsHalf < 0 || starsHalf > 10) {
    logVote(request, "invalid_vote", 400, body);
    sendJson(request, response, { error: "invalid_vote" }, 400);
    return;
  }
  if (!catalogSnapshot) {
    logVote(request, "catalog_not_ready", 503, body);
    sendJson(request, response, { error: "catalog_not_ready" }, 503);
    return;
  }
  if (!safeId(requirementId) || !requirementIds.has(requirementId) || !safeModelId(modelId) || !modelIds.has(modelId) || !allowedModels?.has(modelId)) {
    logVote(request, "invalid_vote", 400, body);
    sendJson(request, response, { error: "invalid_vote" }, 400);
    return;
  }

  if (hasVisitorRated(request.visitorIdHash, requirementId, modelId)) {
    logVote(request, "already_rated", 409, body);
    sendJson(request, response, { error: "already_rated" }, 409);
    return;
  }

  const requestSlot = takeRequestSlot(request.clientIp, requirementId, modelId);
  if (!requestSlot.allowed) {
    logVote(request, "request_rate_limited", 429, body, {
      intervalMs: requestIntervalMs,
      retryAfterSeconds: requestSlot.retryAfterSeconds,
    });
    sendJson(request, response, {
      error: "request_rate_limited",
      retryAfterSeconds: requestSlot.retryAfterSeconds,
    }, 429, {
      "Retry-After": String(requestSlot.retryAfterSeconds),
    });
    return;
  }

  const day = getDailyKey();
  const ipHash = hashIp(request.clientIp, day);
  const voteId = randomUUID();
  const createdAt = new Date().toISOString();
  const result = recordVote({
    voteId,
    requirementId,
    modelId,
    starsHalf,
    day,
    ipHash,
    visitorIdHash: request.visitorIdHash,
    createdAt,
  });

  if (result.type === "already_rated") {
    logVote(request, "already_rated", 409, body);
    sendJson(request, response, { error: "already_rated" }, 409);
    return;
  }
  if (result.type === "daily_limit_reached") {
    logVote(request, "daily_limit_reached", 429, body, { limit: maxVotesPerDay });
    sendJson(request, response, { error: "daily_limit_reached", limit: maxVotesPerDay }, 429);
    return;
  }
  logVote(request, "accepted", 201, body, { voteId });
  sendJson(request, response, { data: { voteId, requirementId, modelId, starsHalf } }, 201);
}

function getCaseVoteData(requirementId, visitorIdHash) {
  const testCases = requirementTestCases.get(requirementId) ?? new Map();
  const rows = database.prepare(`
    SELECT
      test_case_id,
      case_hash,
      SUM(CASE WHEN reaction = 1 THEN 1 ELSE 0 END) AS upvote_count,
      SUM(CASE WHEN reaction = -1 THEN 1 ELSE 0 END) AS downvote_count
    FROM case_votes
    WHERE requirement_id = ?
    GROUP BY test_case_id, case_hash
  `).all(requirementId);
  const totals = new Map(rows.map((row) => [`${row.test_case_id}:${row.case_hash}`, {
    upvoteCount: Number(row.upvote_count),
    downvoteCount: Number(row.downvote_count),
  }]));
  const visitorRows = visitorIdHash
    ? database.prepare(`
      SELECT test_case_id, case_hash, reaction
      FROM case_votes
      WHERE requirement_id = ? AND visitor_id_hash = ?
    `).all(requirementId, visitorIdHash)
    : [];
  const visitorReactions = new Map(visitorRows.map((row) => [
    `${row.test_case_id}:${row.case_hash}`,
    Number(row.reaction),
  ]));

  return [...testCases].map(([testCaseId, caseHash]) => {
    const key = `${testCaseId}:${caseHash}`;
    const reaction = visitorReactions.get(key);
    return {
      testCaseId,
      upvoteCount: totals.get(key)?.upvoteCount ?? 0,
      downvoteCount: totals.get(key)?.downvoteCount ?? 0,
      viewerReaction: reaction === 1 ? "up" : reaction === -1 ? "down" : null,
    };
  });
}

function getCaseVotes(request, response, url) {
  if (!catalogSnapshot) {
    sendJson(request, response, { error: "catalog_not_ready" }, 503);
    return;
  }
  const requirementId = url.searchParams.get("requirementId") || "";
  if (!safeId(requirementId) || !requirementIds.has(requirementId)) {
    sendJson(request, response, { error: "invalid_requirement_id" }, 400);
    return;
  }
  sendJson(request, response, { data: getCaseVoteData(requirementId, request.visitorIdHash) });
}

async function createCaseVote(request, response) {
  if (!validateJsonWriteRequest(request, response, logCaseVote)) {
    return;
  }
  let body;
  try {
    body = await parseBody(request);
  } catch {
    logCaseVote(request, "invalid_json", 400, null);
    sendJson(request, response, { error: "invalid_json" }, 400);
    return;
  }

  const requirementId = body?.requirementId;
  const testCaseId = body?.testCaseId;
  const reaction = body?.reaction;
  const allowedTestCases = requirementTestCases.get(requirementId);
  if (!catalogSnapshot) {
    logCaseVote(request, "catalog_not_ready", 503, body);
    sendJson(request, response, { error: "catalog_not_ready" }, 503);
    return;
  }
  if (!safeId(requirementId)
    || !requirementIds.has(requirementId)
    || !safeId(testCaseId)
    || !allowedTestCases?.has(testCaseId)
    || (reaction !== "up" && reaction !== "down")) {
    logCaseVote(request, "invalid_case_vote", 400, body);
    sendJson(request, response, { error: "invalid_case_vote" }, 400);
    return;
  }

  const caseHash = allowedTestCases.get(testCaseId);
  const requestSlot = takeCaseVoteRequestSlot(request.clientIp, requirementId, testCaseId, caseHash);
  if (!requestSlot.allowed) {
    logCaseVote(request, "request_rate_limited", 429, body, {
      intervalMs: requestIntervalMs,
      retryAfterSeconds: requestSlot.retryAfterSeconds,
    });
    sendJson(request, response, {
      error: "request_rate_limited",
      retryAfterSeconds: requestSlot.retryAfterSeconds,
    }, 429, {
      "Retry-After": String(requestSlot.retryAfterSeconds),
    });
    return;
  }

  const day = getDailyKey();
  const voteId = randomUUID();
  const createdAt = new Date().toISOString();
  const result = recordCaseVote({
    voteId,
    requirementId,
    testCaseId,
    caseHash,
    reaction: reaction === "up" ? 1 : -1,
    day,
    ipHash: hashIp(request.clientIp, day),
    visitorIdHash: request.visitorIdHash,
    createdAt,
  });

  if (result.type === "daily_limit_reached") {
    logCaseVote(request, "daily_limit_reached", 429, body, { limit: maxCaseVotesPerDay });
    sendJson(request, response, { error: "daily_limit_reached", limit: maxCaseVotesPerDay }, 429);
    return;
  }

  const item = getCaseVoteData(requirementId, request.visitorIdHash)
    .find((entry) => entry.testCaseId === testCaseId);
  const status = result.type === "accepted" ? 201 : 200;
  logCaseVote(request, result.type, status, body, { voteId });
  sendJson(request, response, {
    data: {
      ...item,
      result: result.type,
    },
  }, status);
}

function servePublicCatalog(request, response) {
  const body = readFileSync(join(rootDir, "rating-catalog.json"), "utf8");
  response.writeHead(200, responseHeaders(request, "application/json; charset=utf-8"));
  response.end(body);
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
  attachRequestLogging(request, response, url);
  if (request.method === "OPTIONS") {
    response.writeHead(204, responseHeaders(request));
    response.end();
    return;
  }
  try {
    if (url.pathname.startsWith("/api/") && request.method !== "OPTIONS") {
      const globalRequestSlot = takeGlobalRequestSlot(request.clientIp);
      if (!globalRequestSlot.allowed) {
        logEvent("api_request_rate_limited", {
          requestId: request.requestId,
          ip: request.clientIp,
          path: url.pathname,
          retryAfterSeconds: globalRequestSlot.retryAfterSeconds,
          limitPerMinute: maxApiRequestsPerMinute,
        }, "warn");
        sendJson(request, response, {
          error: "api_request_rate_limited",
          retryAfterSeconds: globalRequestSlot.retryAfterSeconds,
        }, 429, {
          "Retry-After": String(globalRequestSlot.retryAfterSeconds),
        });
        return;
      }
    }
    if (url.pathname === "/api/rating-config" && request.method === "GET") {
      sendJson(request, response, {
        data: {
          turnstileRequired: false,
          turnstileSiteKey: null,
          maxVotesPerDay,
          maxCaseVotesPerDay,
          requestIntervalMs,
          maxApiRequestsPerMinute,
        },
      });
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
    if (url.pathname === "/api/case-votes" && request.method === "GET") {
      getCaseVotes(request, response, url);
      return;
    }
    if (url.pathname === "/api/case-votes/vote" && request.method === "POST") {
      await createCaseVote(request, response);
      return;
    }
    if (url.pathname.startsWith("/api/")) {
      sendJson(request, response, { error: "not_found" }, 404);
      return;
    }
    if (url.pathname === "/rating-catalog.json" && request.method === "GET") {
      servePublicCatalog(request, response);
      return;
    }
    sendJson(request, response, { error: "not_found" }, 404);
  } catch (error) {
    logEvent("http_request_failed", {
      requestId: request.requestId,
      ip: request.clientIp,
      method: request.method,
      path: url.pathname,
      error: getErrorMessage(error),
    }, "error");
    if (!response.headersSent) {
      sendJson(request, response, { error: "internal_error" }, 500);
    } else {
      response.destroy();
    }
  }
});

server.requestTimeout = 30_000;
server.headersTimeout = 15_000;
server.timeout = 30_000;
server.keepAliveTimeout = 5_000;

async function startServer() {
  cleanupRequestRateLimitState();
  loadStoredCatalog();
  await syncCatalog();
  catalogSyncTimer = setInterval(() => {
    void syncCatalog();
  }, catalogSyncIntervalMs);
  catalogSyncTimer.unref?.();
  rateLimitCleanupTimer = setInterval(() => {
    cleanupRequestRateLimitState();
  }, 60 * 60 * 1000);
  rateLimitCleanupTimer.unref?.();
  server.listen(port, "0.0.0.0", () => {
    logEvent("server_started", {
      host: "0.0.0.0",
      port,
      requestIntervalMs,
      maxApiRequestsPerMinute,
    });
  });
}

void startServer();

function shutdown() {
  if (catalogSyncTimer) {
    clearInterval(catalogSyncTimer);
  }
  if (rateLimitCleanupTimer) {
    clearInterval(rateLimitCleanupTimer);
  }
  database.close();
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
