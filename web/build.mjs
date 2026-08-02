import { writeFileSync } from "node:fs";

const apiBase = (process.env.API_BASE || "").trim().replace(/\/+$/, "");
const deployedAt = new Date().toISOString();
writeFileSync("api-config.js", `window.__RATING_API_BASE__ = ${JSON.stringify(apiBase)};\n`);
console.log(`Generated API base configuration${apiBase ? ` for ${apiBase}` : " with same-origin API"}.`);
writeFileSync("build-meta.js", `window.__WEB_UPDATED_AT__ = ${JSON.stringify(deployedAt)};\n`);
console.log(`Generated build metadata for ${deployedAt}.`);
