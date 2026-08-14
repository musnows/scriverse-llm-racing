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

### 需求的最终采纳模型

- 单个需求的最终采纳配置只写在 `web/source/requirements/` 中对应的需求 JSON，不要在 `web/app.js` 或其他前端代码中写死模型 ID、模型名或排名。
- `finalAdoptedModelId` 必须是该需求 JSON 的 `models[]` 中已经存在的正整数 `modelId`；它表示作者最终采纳并合入叙界主仓的模型实现。
- 只有用户明确指定最终采纳模型时，才能新增或修改 `finalAdoptedModelId`。不得根据分数、排名、耗时或个人判断自动设置、替换或清空该字段。
- `finalAdoptedPrUrl` 是可选的合入主仓 PR 链接；只有用户提供或明确指定真实链接时才能填写，未配置或为空时不显示链接，禁止编造 URL。
- 前端必须从当前需求 JSON 动态读取这两个字段：只在对应模型的单需求排行榜卡片名称后显示“最终采纳”标识，表格表头不得显示；点击标识显示含义说明，并在 `finalAdoptedPrUrl` 有效时提供 PR 链接。

### 模型测试时间与用量

- 每个需求 JSON 的已测试结果必须填写带时区的 ISO 8601 `testedAt`；如果没有单独记录测试时间，使用该模型实现提交到 worktree 分支的 commit 时间，并在更新时一并填写，禁止留空。
- 每个需求 JSON 的已测试结果必须填写 `durationSeconds` 和 `tokenUsage`。用量为 credit 时保留数字并设置 `tokenUsageUnit: "credit"`，不得把 credit 当作 token；普通 token 用量省略该字段或设置为 `"token"`。

### 需求级数据隔离

- `web/source/index.json` 只保存需求摘要和 `dataUrl`，`web/source/models.json` 只保存模型公共元数据；每个需求的 Prompt、测试用例、结果、参赛配置和截图必须保存在 `web/source/requirements/` 下独立的 JSON 中。
- 首页不得预取任何需求详情；单需求页面只能请求当前需求 JSON；只有模型总榜等确实需要跨需求聚合的页面才能请求全部需求 JSON。
- 新需求的最低必填字段只有需求 `id`、完整 `prompt` 和基于的 `baseCommit`；未提供新测试定义时，`testCases` 默认为空、`scoring` 默认初始分为 `0` 且无扣分规则；用户明确提供新测试用例或打分规则时，必须原样写入该需求自己的字段。
- 每个需求必须独立保存自己的测试结果、截图、测试时间和用量；新需求尚未测试时，结果数组必须为空，不能回退显示其他需求的得分、失败原因、耗时或测试时间。
- 新需求可以只复制已有需求的参赛模型名单到自己的 `participants` 字段，但不得复制其他需求的截图、测试结果、测试用例、打分规则、测试时间、用量、失败原因或分支链接；新需求截图应在该需求实际测试后独立录入，修改一个需求的数据不得改变其他需求。
- 前端不得为需求级 `models`、`results`、`evaluations`、`modelResults` 和 `screenshots` 提供全局兼容回退；显式空数组表示尚无结果。

## 后端修改

- 后端只使用 Node.js 内置模块，保持 Node.js 22.5 或更高版本可运行。
- 评分数据必须继续写入 `RATING_DB` 指定的 SQLite 文件，不要把投票数据写入仓库。
- 不得移除需求、模型允许列表校验、每日投票限制、IP 哈希和 CORS 保护。
- `ALLOWED_ORIGIN`、`CATALOG_URL`、`PORT` 和 `RATING_DB` 必须通过环境变量配置，不要写死生产地址或凭证。
- 修改 catalog 结构时，必须同时检查：
  - `server/rating-catalog.json`
  - `web/rating-catalog.json`
  - `web/source/index.json`
  - `web/source/models.json`
  - `web/source/requirements/` 下对应的需求 JSON
- 新增需求或可评分模型时，前后端 catalog 必须同步，且 catalog `version` 必须递增。
- 每个具体模型独立使用一个 `modelId` 正整数，不得按厂商、工具或模型系列共用 ID；同一厂家的不同模型必须使用不同 ID。
- 新增模型或新模型版本只能追加新的 `modelId`，已分配的 ID 禁止修改、删除或复用。
- 后端只接受 catalog 中声明的数字 `modelId`，不保留旧字符串 ID 或旧客户端兼容逻辑。
- `starsHalf` 只接受 JSON 数字类型的 `0` 到 `10` 整数，前端按星级乘以 2 传值；小数、字符串、缺失值、负数和大于 `10` 的值必须直接返回 `4xx`。

## 测试用例维护

- 修改已有需求的测试用例时，必须保持已有 `tc` 编号不变，只允许修改编号以外的字段；除非删除该测试用例，否则不得修改其编号。
- 删除测试用例后必须保留编号空缺，不得将后续 `tc` 编号向前顺延或重新编号；新测试用例使用新的编号，不得复用已删除的编号。

## data 数据归档

- `data/` 只保存公开、脱敏、可复现的测试材料。
- 严禁提交真实 API Key、S3 AK/SK、密码、Cookie、Token、个人数据、绝对路径或未清理的数据库日志。
- 新增或替换数据库、附件、截图时，必须检查 manifest 相对路径和 SQLite 完整性。
- 数据归档的用途、来源和清理方式应在 README 或对应目录说明中保持可追溯。
- 不要把服务器运行产生的 SQLite、WAL、SHM、日志或临时文件提交到仓库。

### 图片上传与压缩

- 新增或替换图片前，默认检查文件大小；超过 100KB 的图片必须使用 `data/compress_webp_15pct.sh` 压缩后再上传或归档，脚本默认目标为源文件大小的 85%。
- 不超过 100KB 的图片可以保持原文件；已经带有 `-compressed-Npct.webp` 压缩标记的文件不得再次压缩，避免重复有损处理。
- 图片压缩依赖 `cwebp`；压缩失败时不得静默上传原始大文件，必须先处理失败原因。脚本会对小文件和已标记压缩文件主动跳过。

## 测试要求

提交前至少执行：

```bash
node --check web/app.js
node --check server/server.mjs
for file in web/source/index.json web/source/models.json web/source/requirements/*.json; do jq empty "$file"; done
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
