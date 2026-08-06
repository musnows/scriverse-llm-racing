#!/bin/bash
# 生成唯一的目标路径: ~/.worktree/{8位hash}/{项目目录名}
# 同时避开已占用目录与本地分支 worktree/{hash}
# 输出: TARGET_PATH=xxx 和 HASH=xxx

set -e

PROJECT_NAME=$(basename "$(git rev-parse --show-toplevel 2>/dev/null)")

if [ -z "$PROJECT_NAME" ]; then
  echo "ERROR: Not in a git repository" >&2
  exit 1
fi

WORKTREE_BASE="$HOME/.worktree"
mkdir -p "$WORKTREE_BASE"

# 候选是否可用：目录未占用，且本地不存在 worktree/{hash} 分支
is_hash_available() {
  local candidate="$1"

  if [ -e "$WORKTREE_BASE/$candidate" ]; then
    return 1
  fi

  # set -e 下用 if 包裹，避免 ref 不存在时直接退出
  if git show-ref --verify --quiet "refs/heads/worktree/$candidate"; then
    return 1
  fi

  return 0
}

while true; do
  # 一次性生成5个候选 hash
  CANDIDATES=$(for _ in 1 2 3 4 5; do
    head -c 32 /dev/urandom | md5sum | cut -c 1-8
  done)

  # 遍历5个候选，选第一个目录与分支都不冲突的
  HASH=""
  while IFS= read -r candidate; do
    [ -z "$candidate" ] && continue
    if is_hash_available "$candidate"; then
      HASH="$candidate"
      break
    fi
  done <<< "$CANDIDATES"

  # 找到一个可用 hash，跳出循环
  if [ -n "$HASH" ]; then
    TARGET_PATH="$WORKTREE_BASE/$HASH/$PROJECT_NAME"
    break
  fi
  # 5个都冲突，重试
done

echo "TARGET_PATH=$TARGET_PATH"
echo "HASH=$HASH"
