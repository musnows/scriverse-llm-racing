#!/bin/bash
# 生成唯一的目标路径: ~/.worktree/{6位hash}/{项目目录名}
# 输出: TARGET_PATH=xxx 和 HASH=xxx

set -e

# 获取项目目录名
PROJECT_NAME=$(basename "$(git rev-parse --show-toplevel 2>/dev/null)")

if [ -z "$PROJECT_NAME" ]; then
  echo "ERROR: Not in a git repository" >&2
  exit 1
fi

WORKTREE_BASE="$HOME/.worktree"
mkdir -p "$WORKTREE_BASE"

# 生成唯一 hash，避免冲突
while true; do
  HASH=$(head -c 32 /dev/urandom | md5sum | head -c 6)
  TARGET_PATH="$WORKTREE_BASE/$HASH/$PROJECT_NAME"
  if [ ! -e "$TARGET_PATH" ]; then
    break
  fi
done

echo "TARGET_PATH=$TARGET_PATH"
echo "HASH=$HASH"
