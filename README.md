# Scriverse LLM Racing

这个仓库用于归档“叙界赛博斗蛐蛐”系列的公开复现材料。

测试基于 [musnows/Scriverse](https://github.com/musnows/Scriverse) `v0.6.6`，基准 commit 为 `91f9189e5bb34e1bbf6bcaa8442e6a1ac61be5c2`。

## 数据文件

所有公开附件都放在 [`data/`](data/) 目录：

| 文件 | 用途 | SHA-256 |
| --- | --- | --- |
| `git-worktree-skill-20260802.zip` | 给参赛 Agent 创建隔离 worktree 的统一 skill | `b02482cad26e03872d2d2c3cb64bf65c00d2e9b16801b63906b839cfd459f13c` |
| `scriverse-demo-db-with-setting-images-20260802.zip` | 数据库迁移、图片同步和 S3 备份验收使用的演示数据 | `5ceea4eac6e1e35a2d496087c3005a02f153fa533f363ae0bbec44e958df2f4b` |

## 使用方式

把 worktree skill 解压到对应 Agent 工具的 skills 目录，再按测试 prompt 创建独立 worktree。

数据库包包含：

```text
manifest.json
runtime/demo.db
runtime/master.key
runtime/attachments/
```

解压数据库包后，将 `runtime/` 作为 Scriverse 演示运行目录。验收时使用跳过登录的开发命令启动：

```bash
NODE_ENV=development APP_DEV_SKIP_AUTH=true npm run dev
```

## 隐私与安全处理

上传前已经对两个压缩包的文本、数据库记录、二进制可见字符串、图片内容和图片元数据进行检查，并做了以下处理：

- 删除本机用户名和绝对路径，manifest 使用相对路径，skill 示例使用 `~/.worktree/`。
- 清空数据库中的用户会话、CSRF 数据和登录尝试记录。
- 将演示用户的密码哈希与盐替换为不可登录的公开占位值。
- 确认数据库中不存在用户 API Key、AI Provider Key、头像或 AI 对话记录。
- 合并并移除 SQLite WAL/SHM，避免残留历史页数据。
- 将 `runtime/master.key` 替换为固定的公开演示 key；它不是秘密，只能用于这份公开测试数据。
- 确认附件图片不包含真实姓名、邮箱、电话、GPS、作者或设备信息。
- 两个压缩包都不包含真实 S3 AK/SK 或其他生产凭证。

<font color=Red>这些材料只用于公开测试和复现，禁止复制到生产环境，也不要在其中保存真实凭证或个人数据。</font>

## 完整性校验

```bash
shasum -a 256 data/*.zip
```

如果输出与上表不一致，请重新下载，不要继续使用损坏或来源不明的压缩包。
