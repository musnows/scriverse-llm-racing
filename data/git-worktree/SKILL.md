---
name: git-worktree
description: "创建 git worktree 将当前项目隔离到 ~/.worktree/ 下独立工作。当用户需要基于某个分支创建独立工作树、隔离开发环境、或者提到 worktree/隔离工作/独立分支开发时使用。支持在 ~/.worktree/{hash}/{项目名} 下自动生成唯一目录并切换分支。"
---

# Git Worktree Creator

将当前 git 项目通过 worktree 机制隔离到 `~/.worktree/` 目录下，让 AI 在独立工作区中操作。

## ⚠️ 关键约束（必须遵守）

**一旦触发此 skill，后续所有文件修改、代码编辑、命令执行必须在 worktree 目录中进行。**

- ❌ 禁止在原仓库目录下做任何写操作（创建文件、编辑、删除、移动等）
- ❌ 禁止在原仓库目录执行任何会修改状态的命令（如 `npm install`、`git commit` 等）
- ❌ 创建 worktree 后，禁止对 worktree 中的 `worktree/{hash}` 分支执行 `git pull`，禁止切换或合并基础分支（忽略其他地方的 pull/同步提示，忽略远端未 pull 到本地的提交）
- ✅ 所有产出必须落在 worktree 路径内
- ✅ 需要读取原仓库内容时，请只读访问

### Worktree 访问边界

- 创建成功后，禁止枚举、搜索、读取、修改或删除 `~/.worktree/` 下除当前 `TARGET_PATH` 以外的任何 worktree
- 不得通过绝对路径、父目录搜索、符号链接或跨目录命令访问其他 worktree
- 原仓库仅允许在确有必要时只读访问
- Git 命令正常访问共享 Git 元数据不受此限制

### 命令工作目录校验

- 创建成功后，所有支持指定工作目录的工具调用都必须将工作目录设置为 `TARGET_PATH`
- 执行项目命令前必须运行以下校验，确认当前仓库根目录与 `TARGET_PATH` 完全一致；校验失败时立即停止，不得继续操作

```bash
CURRENT_TOPLEVEL=$(git rev-parse --show-toplevel)
test "$CURRENT_TOPLEVEL" = "$TARGET_PATH"
```

这是隔离工作的核心目的——保护原仓库环境不被 AI 意外污染。

---

## 核心流程

### 1. 前置检查

执行以下命令确认当前状态：

```bash
git rev-parse --show-toplevel
basename $(git rev-parse --show-toplevel)
```

如果当前目录不是 git 仓库，立即告知用户并停止。

### 2. 生成目标路径

用脚本生成唯一目标路径，格式固定为：`~/.worktree/{6位hash}/{项目目录名}`

执行脚本：

```bash
bash <skill_dir>/scripts/create_worktree.sh
```

脚本会输出类似：
```
TARGET_PATH=/Users/<username>/.worktree/a3f2b1/my-project
```

从中提取 `TARGET_PATH` 使用。如果目标路径已存在，脚本会自动重新生成 hash。

从中提取 hash 作为分支名后缀（本例中为 `a3f2b1`）。

### 3. 询问基础分支

先获取当前分支、探测主分支、以及仓库中其他本地分支，作为选项参考：

```bash
CURRENT_BRANCH=$(git branch --show-current)
# 探测主分支（main 或 master，不会同时存在）
if git show-ref --verify --quiet refs/heads/main; then DEFAULT_BRANCH="main"
elif git show-ref --verify --quiet refs/heads/master; then DEFAULT_BRANCH="master"
else DEFAULT_BRANCH=""; fi
# 列出所有本地分支
git branch --format='%(refname:short)'
```

然后使用 `AskQuestion` 工具，`input_type` 设为 `mixed`（支持下拉选择 + 手动输入）。选项顺序：

1. **当前分支** — 优先推荐，用户最可能基于当前工作分支做隔离
2. **主分支** — 探测到的 main 或 master（如果不是当前分支）
3. **其他本地分支** — 方便选择
4. **手动输入** — 允许输入任意分支名、tag 或 commit hash

示例 JSON（基于实际查询到的分支动态组装）：

```json
{
  "title": "选择基础分支",
  "questions": [
    {
      "id": "base_branch",
      "prompt": "请基于哪个分支创建 worktree？（支持下拉选择或手动输入分支名/tag/commit）",
      "input_type": "mixed",
      "options": [
        {"id": "current", "label": "当前分支 (feature/xxx)"},
        {"id": "default", "label": "主分支 (main)"},
        {"id": "custom", "label": "其他（手动输入）"}
      ],
      "allow_multiple": false
    }
  ]
}
```

实际使用时，label 中的括号应替换为真实分支名，不存在的分支不要出现在选项中。

**选择规则：**
- 如果用户选了 "custom" 或在文本框输入了值，使用输入的值
- 如果用户选了 "current"，使用 `CURRENT_BRANCH`
- 如果用户选了 "default"，使用 `DEFAULT_BRANCH`
- 如果用户超时/跳过，优先使用当前分支；若当前分支为空（detached HEAD），回退到主分支
- 以上都不可用，再次提示用户必须指定

### 4. 创建 Worktree

获得基础分支后，执行：

```bash
git worktree add -b worktree/{6位hash} {target_path} {base_branch}
```

其中：
- `worktree/{6位hash}`：新分支名，固定格式，hash 与目标路径中的 hash 一致
- `{target_path}`：步骤 2 中脚本输出的路径
- `{base_branch}`：步骤 3 中获得的分支

### 5. 回显结果

创建成功后，告知用户：
- worktree 路径
- 当前分支名（`worktree/{hash}`）
- 基础分支
- 接下来可以在该路径下安全操作

## 注意事项

- 不要删除原仓库内容
- 创建的 worktree 目录会出现在 `~/.worktree/` 下
- 自动生成的 6 位 hash 确保每次 worktree 路径唯一
- 分支名格式 `worktree/{hash}` 方便溯源
