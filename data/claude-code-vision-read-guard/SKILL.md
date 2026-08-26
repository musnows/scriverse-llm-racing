---
name: claude-code-vision-read-guard
description: Install, audit, or update Claude Code hooks that prevent non-vision models from reading image files and redirect them to the read-image CLI when available.
---

# Claude Code Vision Read Guard

Use this skill when the user asks to install, inspect, maintain, or modify the Claude Code image-read guard.

## Runtime layout

- Hook scripts are in `scripts/` in this skill directory.
- The global Claude Code settings file is `~/.claude/settings.json`.
- The installed settings must preserve unrelated environment variables, permissions, and hooks.
- Use absolute paths to the scripts when registering global hooks.

## Behavior

The `PreToolUse` hook matches `Read` and checks image filename extensions before the tool runs. Non-image reads are allowed unchanged.

The built-in vision allowlist includes:

- Prefixes: `claude-`, `gpt-`, `grok`, `gemini`, `kimi-k2`, `kimi-k3`, and `qwen-`.
- Exact IDs: `deepseek-v4-flash-vision-exp`, `glm-5.1v-turbo`, and `glm-5.3v-turbo`.

The built-in non-vision blacklist has priority over both the built-in allowlist and `CLAUDE_CODE_VISION_MODELS`:

- `gpt-oss-20b`, `gpt-oss-120b`
- `glm-5.2`, `glm-5.3`, `glm-5.1`, `glm-5`
- `deepseek-v4-pro`, `deepseek-v4-flash`

`CLAUDE_CODE_VISION_MODELS` is an additive allowlist. It accepts comma-separated exact IDs and suffix wildcards such as `my-vlm-*`; it must never override the built-in blacklist.

For a non-vision image read, deny the original `Read` call so image content cannot enter the model request. Return an English instruction to use `read-image` when that executable is available. If it is unavailable, tell the model to abandon image reading and continue without image context.

Model resolution is best-effort: use the SessionStart model field when provided, then explicit environment values or `--model` process arguments, followed by session state and transcript fallback. Treat an unresolved model as non-vision and fail closed.

## Safe changes

Only install or change global settings after the user explicitly requests it. Merge the two hook entries into the existing `hooks` object; do not replace existing hooks. Keep the scripts deterministic and do not add image base64 to hook output.

After changes:

1. Run `node --check` on every `.mjs` script.
2. Parse `~/.claude/settings.json` as JSON.
3. Test a built-in allowlisted model, a blacklisted model, a custom env allowlist entry, and an unknown model.
4. If committing, use an Angular-style commit message and verify the remote, branch, commit, and push result.
