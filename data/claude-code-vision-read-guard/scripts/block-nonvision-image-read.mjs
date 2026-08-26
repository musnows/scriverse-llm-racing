import {
  getVisionCapability,
  isCommandAvailable,
  readHookInput,
  resolveModel,
  isImagePath,
  writeHookOutput
} from "./vision-guard-lib.mjs";

try {
  const input = readHookInput();
  const filePath = input.tool_input?.file_path;

  if (!isImagePath(filePath)) {
    writeHookOutput({});
    process.exit(0);
  }

  const model = resolveModel(input);
  const capability = getVisionCapability(model);

  if (capability.vision) {
    writeHookOutput({});
    process.exit(0);
  }

  const modelLabel = model || "unknown";
  const readImageAvailable = isCommandAvailable("read-image");
  const explicitModelsHint = capability.source === "built-in-blacklist"
    ? "This model is on the built-in non-vision blacklist and cannot be enabled through CLAUDE_CODE_VISION_MODELS."
    : process.env.CLAUDE_CODE_VISION_MODELS
    ? "Add the model ID to CLAUDE_CODE_VISION_MODELS if this provider supports image input."
    : "Set CLAUDE_CODE_VISION_MODELS to an explicit comma-separated allowlist for custom providers.";
  const readImageInstruction = readImageAvailable
    ? "The read-image CLI is available. Use it to inspect the image and then continue from its text output."
    : "The read-image CLI is unavailable. Do not retry or analyze this image; continue without image context.";

  writeHookOutput({
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: [
        `The current model (${modelLabel}) cannot receive image content directly.`,
        "Do not retry the Read tool for this image.",
        readImageInstruction,
        explicitModelsHint
      ].join(" "),
      additionalContext: [
        `Image Read was stopped before execution: ${filePath}`,
        readImageAvailable
          ? "Use the available read-image CLI instead."
          : "The read-image CLI is unavailable; abandon image reading."
      ].join(" ")
    }
  });
} catch (error) {
  process.stderr.write(`Vision read guard pre-tool hook failed: ${error.message}\n`);
  process.exitCode = 2;
}
