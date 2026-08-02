# 自托管部署

## 环境要求

- Node.js 22.5 或更高版本
- 一个可以持久化 SQLite 文件的服务器目录

这个后端只使用 Node.js 内置模块，不需要 `npm install`。

## Docker

构建镜像时使用 `server/` 作为构建上下文：

```bash
docker build -f server/Dockerfile \
  -t musnows/scriverse-llm-racing-server:latest \
  server
```

在 Ubuntu Server 上运行，使用宿主机目录保存 SQLite 数据，并让 Docker 在服务器重启后自动拉起：

```bash
sudo mkdir -p /opt/scriverse-llm-racing/data
sudo chown -R 1000:1000 /opt/scriverse-llm-racing/data
docker run -d \
  --name scriverse-llm-racing-server \
  --restart unless-stopped \
  -p 13250:13250 \
  -e IP_HASH_SECRET='替换为一段随机长字符串' \
  -e ALLOWED_ORIGIN='https://your-netlify-site.example' \
  -e CATALOG_URL='https://your-netlify-site.example/rating-catalog.json' \
  -e TRUST_PROXY=true \
  -v /opt/scriverse-llm-racing/data:/var/lib/scriverse-llm-racing \
  musnows/scriverse-llm-racing-server:latest
```

容器默认监听 `13250`。如果只需要更换宿主机端口，只修改左侧端口，例如 `-p 18080:13250`；容器内部端口仍保持 `13250`。如果需要同时更换容器端口，则增加 `-e PORT=18080 -p 18080:18080`。

发布到 Docker Hub 前先登录，然后使用 Buildx 发布常见服务器架构：

```bash
docker login
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -f server/Dockerfile \
  -t musnows/scriverse-llm-racing-server:latest \
  --push \
  server
```

发布后，Ubuntu Server 可以用同一个 `docker run` 命令启动镜像；更新镜像时执行 `docker pull`，再删除旧容器并重新执行启动命令。

如果使用 Docker Compose，在仓库根目录准备配置：

```bash
cp .env.example .env
vi .env
docker compose pull
docker compose up -d
docker compose ps
```

Compose 会读取 `.env` 中的前端 Origin、评分目录地址和密钥，并将当前目录的 `data/` 挂载到容器的 SQLite 数据目录。宿主机端口通过 `HOST_PORT` 修改，容器内部端口固定为 `13250`。

## 启动

把当前仓库的 `server/` 目录上传到服务器，例如 `/opt/agent-evaluation`，然后执行：

```bash
cd /opt/agent-evaluation
PORT=13250 \
RATING_DB=/var/lib/agent-evaluation/ratings.sqlite \
IP_HASH_SECRET='替换为一段随机长字符串' \
MAX_VOTES_PER_DAY=10 \
ALLOWED_ORIGIN='https://your-netlify-site.example' \
node server.mjs
```

投票数据会写入 `RATING_DB` 指定的 SQLite 文件。后端按“UTC 日期 + 需求 + 模型 + IP 哈希”限制每天投票次数，默认每个模型每天 10 次。

`MAX_VOTES_PER_DAY` 可以改成其他整数，但服务端会强制最低为 5；填写小于 5 或非法值时按 5 次处理。

## 评分允许列表同步

`rating-catalog.json` 是前端公开的评分允许列表，只包含需求 ID、该需求允许评分的模型 ID 和一个单调递增的 `version`。后端启动时会加载评分数据库中最后一次有效快照，然后同步这个 JSON；默认每 10 分钟同步一次。

如果前后端分别部署，需要把允许列表文件的公开地址配置给后端：

```bash
CATALOG_URL=https://your-netlify-site.example/rating-catalog.json \
CATALOG_SYNC_INTERVAL_MS=600000 \
node server.mjs
```

后端只先比较顶层 `version`：版本号没有变化时不会遍历需求和模型，也不会写数据库；版本号变更后才校验并替换快照。网络错误、格式错误或回退版本会保留上一次有效快照；如果从未同步成功，评分接口会返回 `catalog_not_ready`，不会接受未知的需求或模型组合。

## 反向代理

如果前面使用 Nginx，需要把真实客户端 IP 传给后端，并设置 `TRUST_PROXY=true`：

```nginx
location / {
    proxy_pass http://127.0.0.1:13250;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

启动时增加：

```bash
TRUST_PROXY=true
```

只有在服务器前面确实有可信反向代理时才开启 `TRUST_PROXY`。

## systemd 示例

```ini
[Unit]
Description=Agent evaluation rating server
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/agent-evaluation
ExecStart=/usr/bin/node /opt/agent-evaluation/server.mjs
Environment=PORT=13250
Environment=RATING_DB=/var/lib/agent-evaluation/ratings.sqlite
Environment=MAX_VOTES_PER_DAY=10
Environment=CATALOG_URL=https://your-netlify-site.example/rating-catalog.json
Environment=CATALOG_SYNC_INTERVAL_MS=600000
Environment=ALLOWED_ORIGIN=https://your-netlify-site.example
Environment=TRUST_PROXY=true
Environment=IP_HASH_SECRET=替换为随机长字符串
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

保存到 `/etc/systemd/system/agent-evaluation.service` 后执行：

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now agent-evaluation
sudo systemctl status agent-evaluation
```

## 接口

- `GET /api/ratings?requirementId=s3-backup-v1`
- `POST /api/ratings/vote`
- `GET /api/rating-config`

前端已经接入这些接口；本地使用静态服务器时会显示“评分服务尚未部署”，切换到这个 Node 服务后即可写入评分。

## 前端连接后端

Netlify 部署前端时，在 `web/` 目录执行构建，并将后端地址传给 `API_BASE`：

```bash
cd web
API_BASE=https://your-api.example.com npm run build
```

构建会写入 `api-config.js`，前端随后会请求 `https://your-api.example.com/api/...`。后端的 `ALLOWED_ORIGIN` 必须填写 Netlify 前端的完整 Origin。
