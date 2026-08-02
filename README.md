# Scriverse LLM Racing

这个仓库用于归档“叙界赛博斗蛐蛐”系列的公开复现材料，包含评测前端、用户评分后端和经过清理的数据归档。

测试基于 [musnows/Scriverse](https://github.com/musnows/Scriverse) `v0.6.6`，基准 commit 为 `91f9189e5bb34e1bbf6bcaa8442e6a1ac61be5c2`。

## 目录结构

```text
web/
  index.html                 评测榜单前端
  app.js                     页面逻辑、评分请求和视图渲染
  styles.css                 页面样式
  source/leaderboard.json    评测需求、模型和测试结果
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
API_BASE=https://your-api.example.com npm run build
```

`npm run build` 会生成：

- `api-config.js`：前端评分 API 地址。
- `build-meta.js`：footer 显示的最近更新时间。

如果前后端同域部署，`API_BASE` 可以留空；如果前端部署在 Netlify、后端独立部署，则必须设置后端完整 URL。

前端支持直接分享路径：

- `/`：需求首页
- `/model-overall`：模型总榜
- `/test-method`：全局测试方法
- `/req/s3-backup-v1/leaderboard`：需求排行榜
- `/req/s3-backup-v1/model/1`：指定需求下的模型页面
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
ALLOWED_ORIGIN='https://your-netlify-site.example' \
CATALOG_URL='https://your-netlify-site.example/rating-catalog.json' \
node server.mjs
```

后端接口：

- `GET /api/rating-config`
- `GET /api/ratings?requirementId=s3-backup-v1`
- `POST /api/ratings/vote`

评分使用稳定的数字 `modelId` 标识具体模型，不按厂商或工具归类。当前模型 ID 为：`1` Doubao-Seed-2.1-Turbo、`2` Qwen3.8-Max-Preview、`3` LongCat-2.0、`4` Hy3。后续新增模型或模型版本必须追加新的数字 ID，不能修改、删除或复用旧 ID。

后端会通过 HttpOnly Cookie 记录浏览器在某项需求下是否已经给某个模型评分；同一 Cookie 不能重复评分，删除 Cookie 后可以重新获得一个身份，但仍受来源 IP 限速约束。

也可以直接使用 Docker 镜像运行后端：

```bash
docker run -d \
  --name scriverse-llm-racing-server \
  --restart unless-stopped \
  -p 13250:13250 \
  -e IP_HASH_SECRET='替换为一段随机长字符串' \
  -e REQUEST_INTERVAL_MS=300000 \
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
