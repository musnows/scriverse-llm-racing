# 项目协作要求

## 项目范围

本仓库包含三个需要一起维护的部分：

- `web/`：静态评测榜单前端，负责需求、模型、排行榜、截图和用户评分展示。
- `server/`：Node.js 评分后端，负责评分查询、投票写入、限流和评分 catalog 校验。
- `data/`：公开测试材料和脱敏后的验收数据归档。

## 前端修改

- 保持现有原生 HTML、CSS 和 JavaScript 结构，不为简单页面功能引入第三方依赖。
- 前端评分请求必须继续兼容以下接口：
  - `GET /api/rating-config`
  - `GET /api/ratings?requirementId=<id>`
  - `POST /api/ratings/vote`
- 修改 API 路径、请求字段或返回字段时，必须同步检查并修改 `server/server.mjs`。
- 修改 `web/app.js`、`web/styles.css` 或静态数据后，更新对应资源版本参数，避免部署后继续使用旧资源。
- 修改页面交互后，使用本地浏览器至少验证相关入口、页面切换和主要按钮。

## 后端修改

- 后端只使用 Node.js 内置模块，保持 Node.js 22.5 或更高版本可运行。
- 评分数据必须继续写入 `RATING_DB` 指定的 SQLite 文件，不要把投票数据写入仓库。
- 不得移除需求、模型允许列表校验、每日投票限制、IP 哈希和 CORS 保护。
- `ALLOWED_ORIGIN`、`CATALOG_URL`、`PORT` 和 `RATING_DB` 必须通过环境变量配置，不要写死生产地址或凭证。
- 修改 catalog 结构时，必须同时检查：
  - `server/rating-catalog.json`
  - `web/rating-catalog.json`
  - `web/source/leaderboard.json`
- 新增需求或可评分模型时，前后端 catalog 必须同步，且 catalog `version` 必须递增。

## data 数据归档

- `data/` 只保存公开、脱敏、可复现的测试材料。
- 严禁提交真实 API Key、S3 AK/SK、密码、Cookie、Token、个人数据、绝对路径或未清理的数据库日志。
- 新增或替换数据库、附件、截图时，必须检查 manifest 相对路径和 SQLite 完整性。
- 数据归档的用途、来源和清理方式应在 README 或对应目录说明中保持可追溯。
- 不要把服务器运行产生的 SQLite、WAL、SHM、日志或临时文件提交到仓库。

## 测试要求

提交前至少执行：

```bash
node --check web/app.js
node --check server/server.mjs
node -e "JSON.parse(require('fs').readFileSync('web/source/leaderboard.json', 'utf8'))"
git diff --check
```

后端修改还应使用临时 SQLite 文件启动服务，验证评分配置、评分查询和投票接口。前端修改还应使用内置浏览器验证对应页面和交互。

## 提交要求

- 每次修改都必须单独创建一个 Angular Commit，例如：
  - `feat(web): add requirement summary`
  - `fix(server): reject invalid rating catalog`
  - `docs: update deployment instructions`
- 不要把无关的格式化、临时文件或服务器数据混入 commit。
- 推送前确认工作区干净，并说明本次 commit 是否已经推送。
