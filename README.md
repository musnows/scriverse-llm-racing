# Scriverse LLM Racing

这个仓库用于归档“叙界赛博斗蛐蛐”系列的公开复现材料。

测试基于 [musnows/Scriverse](https://github.com/musnows/Scriverse) `v0.6.6`，基准 commit 为 `91f9189e5bb34e1bbf6bcaa8442e6a1ac61be5c2`。

## 数据文件

所有公开测试材料都直接放在 [`data/`](data/) 目录：

| 目录 | 用途 |
| --- | --- |
| [`data/git-worktree/`](data/git-worktree/) | 给参赛 Agent 创建隔离 worktree 的统一 skill |
| [`data/scriverse-demo-db-with-setting-images-20260802/`](data/scriverse-demo-db-with-setting-images-20260802/) | 数据库迁移、图片同步和 S3 备份验收使用的演示数据 |

## 使用方式

把 [`data/git-worktree/`](data/git-worktree/) 复制到对应 Agent 工具的 skills 目录，再按测试 prompt 创建独立 worktree。

数据库测试目录包含：

```text
manifest.json
runtime/demo.db
runtime/master.key
runtime/attachments/
```

将 `data/scriverse-demo-db-with-setting-images-20260802/runtime/` 作为 Scriverse 演示运行目录。验收时使用跳过登录的开发命令启动：

```bash
NODE_ENV=development APP_DEV_SKIP_AUTH=true npm run dev
```

## 隐私与安全处理

上传前已经对两个目录的文本、数据库记录、二进制可见字符串、图片内容和图片元数据进行检查，并做了以下处理：

- 删除本机用户名和绝对路径，manifest 使用相对路径，skill 示例使用 `~/.worktree/`。
- 清空数据库中的用户会话、CSRF 数据和登录尝试记录。
- 将演示用户的密码哈希与盐替换为不可登录的公开占位值。
- 确认数据库中不存在用户 API Key、AI Provider Key、头像或 AI 对话记录。
- 合并并移除 SQLite WAL/SHM，避免残留历史页数据。
- 将 `runtime/master.key` 替换为固定的公开演示 key；它不是秘密，只能用于这份公开测试数据。
- 确认附件图片不包含真实姓名、邮箱、电话、GPS、作者或设备信息。
- 两个目录都不包含真实 S3 AK/SK 或其他生产凭证。

<font color=Red>这些材料只用于公开测试和复现，禁止复制到生产环境，也不要在其中保存真实凭证或个人数据。</font>

## 数据库完整性校验

```bash
sqlite3 data/scriverse-demo-db-with-setting-images-20260802/runtime/demo.db 'PRAGMA integrity_check;'
```

正常输出应为`ok`。如果检查失败，请重新拉取仓库，不要继续使用损坏或来源不明的数据库文件。
