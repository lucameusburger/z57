#!/bin/bash
#
# Resize images so the longest side is max 1920px and compress JPEGs to quality 82.
# Uses ImageMagick (magick). Only touches files that are oversized or too heavy.
#

set -euo pipefail

IMAGE_DIR="$(cd "$(dirname "$0")/../public/images" && pwd)"
MAX_DIM=1920
QUALITY=82
# Skip files already under this size (bytes) AND already within dimension limits
MIN_SIZE_BYTES=$((300 * 1024))

total_before=0
total_after=0
processed=0
skipped=0

echo "Optimizing images in: $IMAGE_DIR"
echo "Max dimension: ${MAX_DIM}px | JPEG quality: ${QUALITY}"
echo "---"

while IFS= read -r -d '' file; do
  before_size=$(stat -f%z "$file")
  total_before=$((total_before + before_size))

  width=$(sips -g pixelWidth "$file" 2>/dev/null | tail -1 | awk '{print $2}')
  height=$(sips -g pixelHeight "$file" 2>/dev/null | tail -1 | awk '{print $2}')

  needs_resize=false
  if [ "$width" -gt "$MAX_DIM" ] || [ "$height" -gt "$MAX_DIM" ]; then
    needs_resize=true
  fi

  if [ "$needs_resize" = false ] && [ "$before_size" -lt "$MIN_SIZE_BYTES" ]; then
    total_after=$((total_after + before_size))
    skipped=$((skipped + 1))
    continue
  fi

  before_human=$(echo "$before_size" | awk '{
    if ($1 >= 1048576) printf "%.1fM", $1/1048576;
    else printf "%.0fK", $1/1024;
  }')

  ext="${file##*.}"
  ext_lower=$(echo "$ext" | tr '[:upper:]' '[:lower:]')

  if [ "$ext_lower" = "png" ]; then
    if [ "$needs_resize" = true ]; then
      magick "$file" -resize "${MAX_DIM}x${MAX_DIM}>" -quality "$QUALITY" "$file"
    else
      magick "$file" -quality "$QUALITY" "$file"
    fi
  else
    if [ "$needs_resize" = true ]; then
      magick "$file" -resize "${MAX_DIM}x${MAX_DIM}>" -quality "$QUALITY" -sampling-factor 4:2:0 -strip -interlace Plane "$file"
    else
      magick "$file" -quality "$QUALITY" -sampling-factor 4:2:0 -strip -interlace Plane "$file"
    fi
  fi

  after_size=$(stat -f%z "$file")
  total_after=$((total_after + after_size))
  after_human=$(echo "$after_size" | awk '{
    if ($1 >= 1048576) printf "%.1fM", $1/1048576;
    else printf "%.0fK", $1/1024;
  }')

  savings=$(( (before_size - after_size) * 100 / before_size ))
  resize_tag=""
  if [ "$needs_resize" = true ]; then
    resize_tag=" [resized]"
  fi

  echo "${before_human} -> ${after_human} (-${savings}%)${resize_tag}  $(basename "$file")"
  processed=$((processed + 1))

done < <(find "$IMAGE_DIR" -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.webp' \) -print0)

total_before_human=$(echo "$total_before" | awk '{printf "%.0fM", $1/1048576}')
total_after_human=$(echo "$total_after" | awk '{printf "%.0fM", $1/1048576}')
total_savings=$(( (total_before - total_after) * 100 / total_before ))

echo ""
echo "=== Done ==="
echo "Processed: $processed | Skipped (already small): $skipped"
echo "Total: ${total_before_human} -> ${total_after_human} (-${total_savings}%)"
