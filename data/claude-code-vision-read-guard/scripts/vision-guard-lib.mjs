import fs from "node:fs";
import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";

const DEFAULT_IMAGE_EXTENSIONS = new Set([
  ".avif",
  ".bmp",
  ".gif",
  ".heic",
  ".heif",
  ".jpeg",
  ".jpg",
  ".png",
  ".tif",
  ".tiff",
  ".webp"
]);

const BUILT_IN_VISION_MODEL_PREFIXES = [
  "claude-",
  "gpt-",
  "grok",
  "gemini",
  "kimi-k2",
  "kimi-k3",
  "qwen-"
];

const BUILT_IN_VISION_MODELS = new Set([
  "deepseek-v4-flash-vision-exp",
  "glm-5.1v-turbo",
  "glm-5.3v-turbo"
]);

const BUILT_IN_NONVISION_MODELS = new Set([
  "gpt-oss-20b",
  "gpt-oss-120b",
  "glm-5.2",
  "glm-5.3",
  "glm-5.1",
  "glm-5",
  "deepseek-v4-pro",
  "deepseek-v4-flash"
]);

export function readHookInput() {
  const raw = fs.readFileSync(0, "utf8");
  if (!raw.trim()) {
    return {};
  }
  return JSON.parse(raw);
}

export function writeHookOutput(value) {
  process.stdout.write(`${JSON.stringify(value)}\n`);
}

export function isImagePath(filePath) {
  if (typeof filePath !== "string") {
    return false;
  }

  const extension = path.extname(filePath).toLowerCase();
  return DEFAULT_IMAGE_EXTENSIONS.has(extension);
}

export function isCommandAvailable(commandName) {
  if (typeof commandName !== "string" || !commandName.trim()) {
    return false;
  }

  const pathEntries = (process.env.PATH || "").split(path.delimiter).filter(Boolean);
  const executableNames = process.platform === "win32"
    ? [commandName, `${commandName}.exe`, `${commandName}.cmd`, `${commandName}.bat`]
    : [commandName];

  return pathEntries.some((directory) => executableNames.some((name) => {
    try {
      fs.accessSync(path.join(directory, name), fs.constants.X_OK);
      return true;
    } catch {
      return false;
    }
  }));
}

export function getStateDirectory() {
  return process.env.CLAUDE_CODE_VISION_GUARD_STATE_DIR ||
    path.join(os.tmpdir(), "claude-vision-read-guard");
}

function safeSessionId(sessionId) {
  return String(sessionId || "unknown").replace(/[^A-Za-z0-9._-]/g, "_");
}

export function getStatePath(sessionId) {
  if (!sessionId) {
    return null;
  }

  return path.join(getStateDirectory(), `${safeSessionId(sessionId)}.json`);
}

export function saveSessionModel(sessionId, model) {
  const statePath = getStatePath(sessionId);
  if (!statePath || typeof model !== "string" || !model.trim()) {
    return;
  }

  fs.mkdirSync(path.dirname(statePath), { recursive: true, mode: 0o700 });
  fs.writeFileSync(
    statePath,
    JSON.stringify({ model: model.trim(), updatedAt: new Date().toISOString() }) + "\n",
    { encoding: "utf8", mode: 0o600 }
  );
}

export function loadSessionModel(sessionId) {
  const statePath = getStatePath(sessionId);
  if (!statePath) {
    return null;
  }

  try {
    const state = JSON.parse(fs.readFileSync(statePath, "utf8"));
    return typeof state.model === "string" && state.model.trim() ? state.model.trim() : null;
  } catch {
    return null;
  }
}

function readTail(filePath, maxBytes = 2 * 1024 * 1024) {
  try {
    const stat = fs.statSync(filePath);
    const length = Math.min(stat.size, maxBytes);
    const buffer = Buffer.alloc(length);
    const fd = fs.openSync(filePath, "r");

    try {
      fs.readSync(fd, buffer, 0, length, stat.size - length);
    } finally {
      fs.closeSync(fd);
    }

    return buffer.toString("utf8");
  } catch {
    return "";
  }
}

function modelFromTranscriptRecord(record) {
  const candidates = [
    record?.model,
    record?.message?.model,
    record?.message?.metadata?.model
  ];

  return candidates.find((value) => typeof value === "string" && value.trim())?.trim() || null;
}

export function loadLatestTranscriptModel(transcriptPath) {
  if (typeof transcriptPath !== "string" || !transcriptPath) {
    return null;
  }

  const lines = readTail(transcriptPath).split(/\r?\n/);
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    if (!lines[index].trim()) {
      continue;
    }

    try {
      const record = JSON.parse(lines[index]);
      const model = modelFromTranscriptRecord(record);
      if (model) {
        return model;
      }
    } catch {
      // The first line can be partial when only the tail of a large transcript was read.
    }
  }

  return null;
}

function loadParentCommandLine() {
  try {
    const result = spawnSync("ps", ["-p", String(process.ppid), "-o", "command="], {
      encoding: "utf8",
      timeout: 1000
    });

    return result.status === 0 ? result.stdout.trim() : "";
  } catch {
    return "";
  }
}

function modelFromCommandLine(commandLine) {
  const match = commandLine.match(/(?:^|\s)--model(?:=|\s+)([^\s]+)/);
  return match?.[1] || null;
}

export function resolveModel(input) {
  return (typeof input?.model === "string" && input.model.trim()) ||
    (typeof process.env.CLAUDE_CODE_ACTIVE_MODEL === "string" && process.env.CLAUDE_CODE_ACTIVE_MODEL.trim()) ||
    (typeof process.env.ANTHROPIC_MODEL === "string" && process.env.ANTHROPIC_MODEL.trim()) ||
    modelFromCommandLine(loadParentCommandLine()) ||
    loadLatestTranscriptModel(input?.transcript_path) ||
    loadSessionModel(input?.session_id) ||
    null;
}

function configuredVisionModels() {
  return (process.env.CLAUDE_CODE_VISION_MODELS || "")
    .split(",")
    .map((model) => model.trim())
    .filter(Boolean);
}

function matchesConfiguredModel(model, configuredModels) {
  return configuredModels.some((configuredModel) => {
    if (configuredModel.endsWith("*")) {
      return model.startsWith(configuredModel.slice(0, -1));
    }
    return model === configuredModel;
  });
}

export function getVisionCapability(model) {
  if (!model) {
    return { vision: false, source: "unknown-model" };
  }

  const normalizedModel = model.toLowerCase();

  if (BUILT_IN_NONVISION_MODELS.has(normalizedModel)) {
    return { vision: false, source: "built-in-blacklist" };
  }

  const configuredModels = configuredVisionModels();
  if (configuredModels.length > 0) {
    const normalizedConfiguredModels = configuredModels.map((value) => value.toLowerCase());
    if (matchesConfiguredModel(normalizedModel, normalizedConfiguredModels)) {
      return { vision: true, source: "CLAUDE_CODE_VISION_MODELS" };
    }
  }

  if (process.env.CLAUDE_CODE_VISION_MODEL_AUTO === "0") {
    return { vision: false, source: "automatic-detection-disabled" };
  }

  return {
    vision: BUILT_IN_VISION_MODELS.has(normalizedModel) ||
      BUILT_IN_VISION_MODEL_PREFIXES.some((prefix) => normalizedModel.startsWith(prefix)) ||
      ["opus", "sonnet", "haiku", "fable", "mythos"].includes(normalizedModel),
    source: "built-in-vision-allowlist"
  };
}

function shellQuote(value) {
  return `'${String(value).replaceAll("'", "'\\''")}'`;
}

export function persistModelForBash(model) {
  const envFile = process.env.CLAUDE_ENV_FILE;
  if (!envFile || !model) {
    return;
  }

  fs.appendFileSync(
    envFile,
    `export CLAUDE_CODE_ACTIVE_MODEL=${shellQuote(model)}\n`,
    "utf8"
  );
}
