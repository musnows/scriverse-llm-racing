import { writeFileSync } from "node:fs";

const apiBase = (process.env.API_BASE || "").trim().replace(/\/+$/, "");
const baiduStatisticsId = (process.env.BAIDU_STATISTICS_ID || "").trim();
const configuredLeaderboardTopN = Number.parseInt(process.env.LEADERBOARD_TOP_N || "4", 10);
const leaderboardTopN = Number.isFinite(configuredLeaderboardTopN) ? Math.max(3, configuredLeaderboardTopN) : 4;
const deployedAt = new Date().toISOString();
writeFileSync("api-config.js", `window.__RATING_API_BASE__ = ${JSON.stringify(apiBase)};\n`);
console.log(`Generated API base configuration${apiBase ? ` for ${apiBase}` : " with same-origin API"}.`);
writeFileSync("leaderboard-config.js", `window.__LEADERBOARD_TOP_N__ = ${leaderboardTopN};\n`);
console.log(`Generated leaderboard display configuration for top ${leaderboardTopN} entries.`);
writeFileSync("build-meta.js", `window.__WEB_UPDATED_AT__ = ${JSON.stringify(deployedAt)};\n`);
console.log(`Generated build metadata for ${deployedAt}.`);
writeFileSync("baidu-statistics-config.js", `window.__BAIDU_STATISTICS_ID__ = ${JSON.stringify(baiduStatisticsId)};\n`);
console.log(`Generated Baidu statistics configuration${baiduStatisticsId ? " with configured ID" : " without an ID"}.`);
