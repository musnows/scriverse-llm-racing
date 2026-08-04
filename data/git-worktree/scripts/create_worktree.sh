#!/bin/bash
# 生成唯一的目标路径: ~/.worktree/{8位hash}/{项目目录名}
# 输出: TARGET_PATH=xxx 和 HASH=xxx

set -e

PROJECT_NAME=$(basename "$(git rev-parse --show-toplevel 2>/dev/null)")

if [ -z "$PROJECT_NAME" ]; then
  echo "ERROR: Not in a git repository" >&2
  exit 1
fi

WORKTREE_BASE="$HOME/.worktree"
mkdir -p "$WORKTREE_BASE"

while true; do
  # 一次 ls 快照
  EXISTING=$(ls -1 "$WORKTREE_BASE" 2>/dev/null || true)

  # 一次性生成3个候选 hash
  CANDIDATES=$(for _ in 1 2 3; do
    head -c 32 /dev/urandom | md5sum | cut -c 1-8
  done)

  # 遍历3个候选，选第一个不冲突的
  HASH=""
  while IFS= read -r candidate; do
    if ! echo "$EXISTING" | grep -qx "$candidate"; then
      HASH="$candidate"
      break
    fi
  done <<< "$CANDIDATES"

  # 找到一个可用 hash，跳出循环
  if [ -n "$HASH" ]; then
    TARGET_PATH="$WORKTREE_BASE/$HASH/$PROJECT_NAME"
    break
  fi
  # 3个都冲突，重试
done

echo "TARGET_PATH=$TARGET_PATH"
echo "HASH=$HASH"
