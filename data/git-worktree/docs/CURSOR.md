# Cursor 专用说明（仅限 Cursor Agent 阅读）

> **适用范围：** 仅 Cursor IDE / Cursor Agent。
> **其他工具（Claude Code、Codex、CLI 等）必须忽略本文件**，继续只遵循 `SKILL.md` 主流程。

本文件记录 Cursor 下创建 `~/.worktree/` 时的已知行为差异。主流程仍以 `SKILL.md` 为准；下列条款仅在 Cursor 中覆盖冲突处理。

## 现象

在 Cursor 中按 `SKILL.md` 执行：

1. `get_worktree_hash.sh` 生成 `TARGET_PATH` / `HASH`（脚本本身不创建 worktree）
2. 执行一次 `git worktree add -b worktree/{hash} {target_path} {base_branch}` 并成功
3. 随后同一条 `git worktree add` 可能再次执行并报：

```text
fatal: a branch named 'worktree/{hash}' already exists
```

## 根因（已用日志核实）

1. **第一次** `git worktree add` 已成功创建目录与分支。
2. Cursor 的 `WorktreeManager` 发现 `~/.worktree/{hash}/...` 后切换 Agent workspace。
3. 切仓可能导致**同一条 Shell 工具调用被重放/重跑**；第二次 `add` 撞上刚建好的分支。

这不是 `get_worktree_hash.sh` 预创建，也不是 `move_agent_to_root` 建分支，更不是外部并发操作。

## Cursor 下必须遵守的处理

### 仍然需要执行一次 `git worktree add`

`WorktreeManager` 只发现并切仓，**不会**替你创建 worktree。主流程步骤 4 仍要执行。

### `already exists` 时禁止换 hash 重试

在 Cursor 中，**不要**按 `SKILL.md` 步骤 4 的「换新 hash 再 `add`」处理。先判定是否已是本次目标：

```bash
test -d "$TARGET_PATH" \
  && git show-ref --verify --quiet "refs/heads/worktree/$HASH" \
  && git worktree list | grep -F "$TARGET_PATH"
```

若三者均成立：

- 视为**创建已成功**
- 禁止再次 `git worktree add -b worktree/$HASH ...`
- 禁止删除该目录或删除该分支后重建
- 直接 `move_agent_to_root` 到 `TARGET_PATH`（若尚未切过去），然后按 `SKILL.md` 回显结果

仅当确认「分支/目录残留但不是本次成功产物、且 `worktree list` 未正确挂载本次 `TARGET_PATH`」时，才清理孤儿状态并换新 hash；Cursor 下首次 `add` 后立刻出现的 `already exists` 默认按成功处理。

### `add` 前后自检

- `add` 前：确认目标目录与 `worktree/{hash}` 分支均不存在。
- `add` 后（含收到失败输出时）：再查一次上述三者；已存在则按成功收尾，不要二次创建。

## 不要做的事

- 不要因为 Cursor 切工作区就怀疑脚本已创建 worktree
- 不要把切仓后的二次 `already exists` 当成外部异步占用
- 不要对刚成功的目标执行 `rm -rf` 或 `git branch -D` 后重来
