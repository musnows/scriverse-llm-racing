#!/usr/bin/env bash
set -Eeuo pipefail

# 获取文件大小，兼容 macOS 和 Linux。
file_size() {
  local file_path="$1"

  if [[ "$(uname -s)" == "Darwin" ]]; then
    stat -f '%z' "$file_path"
  else
    stat -c '%s' "$file_path"
  fi
}

# 将路径转换为当前平台可比较的绝对路径。
absolute_path() {
  local file_path="$1"
  local parent_path
  local file_name

  parent_path=$(cd "$(dirname "$file_path")" && pwd -P)
  file_name=$(basename "$file_path")
  printf '%s/%s\n' "$parent_path" "$file_name"
}

if [[ $# -lt 1 || $# -gt 3 ]]; then
  printf 'Usage: %s INPUT_IMAGE [PERCENT] [OUTPUT_WEBP]\n' "$0" >&2
  exit 2
fi

input_path=$(absolute_path "$1")

compression_percent=15
if [[ $# -ge 2 ]]; then
  compression_percent="$2"
fi

if [[ ! "$compression_percent" =~ ^[0-9]+$ ]]; then
  printf 'Error: percent must be an integer from 0 to 30.\n' >&2
  exit 1
fi

compression_percent=$((10#$compression_percent))
if (( compression_percent > 30 )); then
  printf 'Error: percent must not be greater than 30.\n' >&2
  exit 1
fi

if [[ ! -f "$input_path" ]]; then
  printf 'Error: input file not found: %s\n' "$input_path" >&2
  exit 1
fi

input_name=$(basename "$input_path")
if [[ "$input_name" =~ -compressed-[0-9]+pct\.webp$ ]]; then
  printf 'Input already appears compressed; skipping: %s\n' "$input_path"
  exit 0
fi

source_bytes=$(file_size "$input_path")
minimum_compress_bytes=$((100 * 1024))
if (( compression_percent > 0 && source_bytes <= minimum_compress_bytes )); then
  printf 'Input: %s (%s bytes)\n' "$input_path" "$source_bytes"
  printf 'Input is at or below 100 KiB; compression skipped.\n'
  exit 0
fi

case "$input_name" in
  *.*) input_stem="${input_name%.*}" ;;
  *) input_stem="$input_name" ;;
esac

if [[ $# -eq 3 ]]; then
  output_path=$(absolute_path "$3")
else
  output_path="$(dirname "$input_path")/${input_stem}-compressed-${compression_percent}pct.webp"
fi

if [[ "$input_path" == "$output_path" ]]; then
  printf 'Error: output path must differ from input path.\n' >&2
  exit 1
fi

if [[ ! -d "$(dirname "$output_path")" ]]; then
  printf 'Error: output directory not found: %s\n' "$(dirname "$output_path")" >&2
  exit 1
fi

if [[ -e "$output_path" ]]; then
  printf 'Error: output file already exists: %s\n' "$output_path" >&2
  exit 1
fi

if (( compression_percent == 0 )); then
  cp -p "$input_path" "$output_path"
  output_bytes=$(file_size "$output_path")
  printf 'Input: %s (%s bytes)\n' "$input_path" "$source_bytes"
  printf 'Output: %s (%s bytes)\n' "$output_path" "$output_bytes"
  printf 'Compression disabled; original copied without re-encoding.\n'
  exit 0
fi

if ! command -v cwebp >/dev/null 2>&1; then
  printf 'Error: cwebp is required. Install it with: brew install webp\n' >&2
  exit 1
fi

desired_bytes=$((source_bytes * (100 - compression_percent) / 100))
tolerance_bytes=$((source_bytes / 200))
if (( tolerance_bytes < 1 )); then
  tolerance_bytes=1
fi
lower_target=$desired_bytes
upper_target=$source_bytes
best_target=$desired_bytes
best_error=$source_bytes

# 二分搜索 cwebp 的目标大小，使最终输出尽量接近源文件的 85%。
for ((attempt = 1; attempt <= 8; attempt++)); do
  target_bytes=$(((lower_target + upper_target) / 2))
  cwebp -quiet -size "$target_bytes" -pass 10 -mt "$input_path" -o "$output_path"

  current_output_bytes=$(file_size "$output_path")
  current_error=$((current_output_bytes - desired_bytes))
  if (( current_error < 0 )); then
    current_error=$((-current_error))
  fi

  if (( current_error < best_error )); then
    best_error=$current_error
    best_target=$target_bytes
  fi

  if (( current_output_bytes < desired_bytes )); then
    lower_target=$target_bytes
  else
    upper_target=$target_bytes
  fi

  if (( best_error <= tolerance_bytes || upper_target - lower_target <= 1 )); then
    break
  fi
done

if (( target_bytes != best_target )); then
  cwebp -quiet -size "$best_target" -pass 10 -mt "$input_path" -o "$output_path"
fi

output_bytes=$(file_size "$output_path")
savings=$(awk -v source="$source_bytes" -v output="$output_bytes" 'BEGIN { printf "%.2f", (1 - output / source) * 100 }')

printf 'Input: %s (%s bytes)\n' "$input_path" "$source_bytes"
printf 'Output: %s (%s bytes)\n' "$output_path" "$output_bytes"
printf 'Actual savings: %s%%\n' "$savings"
