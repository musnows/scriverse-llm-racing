# Scriverse LLM Racing

这个仓库用于归档“叙界赛博斗蛐蛐”系列的公开复现材料，包含评测前端、用户评分后端和经过清理的数据归档。

测试基于 [musnows/Scriverse](https://github.com/musnows/Scriverse) 项目

## 目录结构

```text
web/
  index.html                 评测榜单前端
  app.js                     页面逻辑、评分请求和视图渲染
  styles.css                 页面样式
  source/index.json          需求索引和各需求数据地址
  source/models.json         模型名称、工具和能力目录
  source/requirements/       每项需求独立的评测结果
  rating-catalog.json        后端评分允许列表
  build.mjs                  构建 API 配置和部署时间

server/
  server.mjs                 Node.js 评分后端
  rating-catalog.json        后端本地评分允许列表
  DEPLOY.md                  Ubuntu、systemd、Nginx 部署说明

data/
  git-worktree/              统一的 worktree skill
  scriverse-demo-*/          脱敏后的公开验收数据
```

## 前端

前端是无构建依赖的静态页面，构建时可注入评分后端地址：

```bash
cd web
API_BASE=https://your-api.example.com \
BAIDU_STATISTICS_ID=your-baidu-statistics-id \
LEADERBOARD_TOP_N=4 \
npm run build
```

`npm run build` 会生成：

- `api-config.js`：前端评分 API 地址。
- `leaderboard-config.js`：需求排行榜默认展示数量；`LEADERBOARD_TOP_N` 未设置时显示前 4，设置为小于 3 的值时仍显示前 3。
- `build-meta.js`：footer 显示的最近更新时间。
- `baidu-statistics-config.js`：百度统计 ID；未设置 `BAIDU_STATISTICS_ID` 时不加载统计脚本。

前端首页只请求需求索引；进入排行榜、模型或功能页时按需请求模型目录和当前需求 JSON，进入需求信息页时只请求当前需求 JSON，只有进入模型总榜时才并发请求全部需求数据。新增需求时，在 `web/source/index.json` 的 `requirements[]` 中添加摘要和 `dataUrl`，并在 `web/source/requirements/` 下创建对应的独立 JSON。

单个需求可以配置最终采纳信息。字段必须写在该需求的独立 JSON 中：

```json
{
  "id": "s3-backup-v1",
  "finalAdoptedModelId": 13,
  "finalAdoptedPrUrl": "https://github.com/musnows/Scriverse/pull/123"
}
```

- `finalAdoptedModelId` 必须引用同一需求 JSON 的 `models[]` 中已有的 `modelId`。只有用户明确指定时才能设置或修改，不能根据排名或分数推断。
- `finalAdoptedPrUrl` 是可选的真实合入主仓 PR 链接；不配置时，Toast 只显示“最终采纳”的含义，不显示链接。
- 前端会动态读取字段，在单需求排行榜对应模型名称后显示“最终采纳”标识，表格表头不会显示该标识。

如果前后端同域部署，`API_BASE` 可以留空；如果前端部署在 Netlify、后端独立部署，则必须设置后端完整 URL。
如果需要启用百度统计，在前端构建环境中设置 `BAIDU_STATISTICS_ID`，统计 ID 只会在构建产物中注入，不会写死在源代码中。

前端支持直接分享路径：

- `/`：需求首页
- `/model-overall`：模型总榜
- `/test-method`：全局测试方法
- `/req/s3-backup-v1/leaderboard`：需求排行榜
- `/req/s3-backup-v1/mdl/1`：指定需求下的模型页面
- `/req/s3-backup-v1/mdl/1?tab=unexpected`：指定需求下模型的意外情况
- `/req/s3-backup-v1/model/1`：历史模型路径，继续兼容
- `/req/s3-backup-v1/feature/settings`：指定需求下的功能对比页
- `/req/s3-backup-v1/info`：需求信息页

## 评分后端

后端只使用 Node.js 内置模块，不需要 `npm install`，要求 Node.js 22.5 或更高版本。默认监听 `13250` 端口，可通过 `PORT` 修改。

```bash
cd server
PORT=13250 \
RATING_DB=/var/lib/agent-evaluation/ratings.sqlite \
IP_HASH_SECRET='替换为随机长字符串' \
REQUEST_INTERVAL_MS=300000 \
MAX_API_REQUESTS_PER_MINUTE=120 \
ALLOWED_ORIGIN='https://your-netlify-site.example' \
CATALOG_URL='https://your-netlify-site.example/rating-catalog.json' \
node server.mjs
```

后端接口：

- `GET /api/rating-config`
- `GET /api/ratings?requirementId=s3-backup-v1`
- `POST /api/ratings/vote`
- `GET /api/case-votes?requirementId=s3-backup-v1`
- `POST /api/case-votes/vote`

评分使用稳定的数字 `modelId` 标识具体模型，不按厂商或工具归类。当前模型 ID 为：`1` Doubao-Seed-2.1-Turbo、`2` Qwen3.8-Max-Preview、`3` LongCat-2.0、`4` Hy3。后续新增模型或模型版本必须追加新的数字 ID，不能修改、删除或复用旧 ID。

后端会通过 HttpOnly Cookie 记录浏览器在某项需求下是否已经给某个模型评分；同一 Cookie 不能重复评分，删除 Cookie 后可以重新获得一个身份，但仍受来源 IP 限速约束。测试用例的赞、踩同样使用 Cookie 和 IP 限流；同一访客可在限流间隔后切换反馈。

`IP_HASH_SECRET` 必须设置为至少 32 个字符的随机字符串；`ALLOWED_ORIGIN` 必须是前端的完整 HTTP 或 HTTPS Origin，不能使用 `*`。评分写接口只接受 `application/json`，并拒绝非允许 Origin 的浏览器请求。`MAX_API_REQUESTS_PER_MINUTE` 默认限制单个来源 IP 每分钟访问 API 120 次。

生产环境应让 Node 服务只监听反向代理可访问的内网端口，并由反向代理提供 HTTPS；不要直接把 `13250` 暴露到公网。

每条测试用例反馈都会使用 `SHA-256(需求 ID + case ID + case 内容)` 作为归属键。case 内容变更并同步更新 catalog、递增 catalog `version` 后，历史反馈会保留在数据库中，但不会计入新内容的计数。

也可以直接使用 Docker 镜像运行后端：

```bash
docker run -d \
  --name scriverse-llm-racing-server \
  --restart unless-stopped \
  -p 127.0.0.1:13250:13250 \
  -e IP_HASH_SECRET='替换为一段随机长字符串' \
  -e REQUEST_INTERVAL_MS=300000 \
  -e MAX_API_REQUESTS_PER_MINUTE=120 \
  -e ALLOWED_ORIGIN='https://your-netlify-site.example' \
  -e CATALOG_URL='https://your-netlify-site.example/rating-catalog.json' \
  -v /opt/scriverse-llm-racing/data:/var/lib/scriverse-llm-racing \
  musnows/scriverse-llm-racing-server:latest
```

后端目录也提供了 [`server/docker-compose.yml`](server/docker-compose.yml) 和 [`server/.env.example`](server/.env.example)，在 Ubuntu Server 上可以直接执行：

```bash
cd server
cp .env.example .env
vi .env
docker compose pull
docker compose up -d
```

完整的 Ubuntu、systemd、Nginx 和前后端连接配置见 [`server/DEPLOY.md`](server/DEPLOY.md)。

## 数据归档

公开测试材料放在 [`data/`](data/)：

| 路径 | 用途 |
| --- | --- |
| [`data/git-worktree/`](data/git-worktree/) | 给参赛 Agent 创建隔离 worktree 的统一 skill |
| [`data/scriverse-demo-db-with-setting-images-20260802/`](data/scriverse-demo-db-with-setting-images-20260802/) | 数据库迁移、图片同步和 S3 备份验收使用的演示数据 |

数据库测试目录包含：

```text
manifest.json
runtime/demo.db
runtime/master.key
runtime/attachments/
```

将 `runtime/` 作为 Scriverse 演示运行目录。验收时使用：

```bash
NODE_ENV=development APP_DEV_SKIP_AUTH=true npm run dev
```

数据库完整性检查：

```bash
sqlite3 data/scriverse-demo-db-with-setting-images-20260802/runtime/demo.db 'PRAGMA integrity_check;'
```

## 隐私与安全

这些材料只用于公开测试和复现，禁止复制到生产环境，也不要在其中保存真实凭证或个人数据。

归档数据必须满足：

- 不包含本机用户名、绝对路径、真实 API Key、S3 AK/SK 或其他生产凭证。
- 数据库中的会话、CSRF、登录尝试和个人数据已经清理。
- 图片和附件不包含真实姓名、邮箱、电话、GPS、作者或设备信息。
- manifest 使用相对路径，归档目录结构保持可复现。

项目修改规范见根目录 [`AGENTS.md`](AGENTS.md)。
