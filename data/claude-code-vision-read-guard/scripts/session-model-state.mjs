import {
  getVisionCapability,
  persistModelForBash,
  readHookInput,
  resolveModel,
  saveSessionModel,
  writeHookOutput
} from "./vision-guard-lib.mjs";

try {
  const input = readHookInput();
  const model = resolveModel(input) || "";

  if (model) {
    saveSessionModel(input.session_id, model);
    persistModelForBash(model);
  }

  const capability = getVisionCapability(model || null);
  const modelLabel = model || "unknown";
  const context = [
    `Vision read guard active: model=${modelLabel}`,
    `vision=${capability.vision ? "true" : "false"}`,
    `source=${capability.source}`
  ].join("; ");

  writeHookOutput({
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext: context
    }
  });
} catch (error) {
  process.stderr.write(`Vision read guard session hook failed: ${error.message}\n`);
  process.exitCode = 1;
}
