import { writeFileSync } from "node:fs";

const apiBase = (process.env.API_BASE || "").trim().replace(/\/+$/, "");
writeFileSync("api-config.js", `window.__RATING_API_BASE__ = ${JSON.stringify(apiBase)};\n`);
console.log(`Generated API base configuration${apiBase ? ` for ${apiBase}` : " with same-origin API"}.`);
