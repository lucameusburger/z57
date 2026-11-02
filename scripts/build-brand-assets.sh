#!/bin/bash
#
# Renders the favicon, app icons and Open Graph image from the site's clover
# shape and colours. Needs librsvg, ImageMagick and fonttools.
#

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
GREEN="#1c3108"
LIME="#defe51"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# Prints the clover on a dark green tile. The arguments are the clover's offset
# and scale on the 100 unit tile (see CloverGlyph in app/components/Shapes.tsx),
# then the tile's corner radius, which defaults to square.
tile() {
  cat <<SVG
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="${3:-0}" fill="$GREEN"/>
  <g fill="$LIME" transform="translate($1 $1) scale($2)">
    <circle cx="27" cy="27" r="27"/>
    <circle cx="73" cy="27" r="27"/>
    <circle cx="27" cy="73" r="27"/>
    <circle cx="73" cy="73" r="27"/>
    <rect x="27" y="27" width="46" height="46"/>
  </g>
</svg>
SVG
}

png() {
  rsvg-convert -w "$2" -h "$2" "$1" | magick - -alpha off -strip "PNG24:$3"
}

# Keeps the transparent corners of a rounded tile.
rounded_png() {
  rsvg-convert -w "$2" -h "$2" "$1" | magick - -strip "PNG32:$3"
}

# Browser tabs: the clover fills the tile so it stays legible at 16px.
tile 12.5 0.75 22 >"$ROOT/app/icon.svg"
for size in 16 32 48; do
  rounded_png "$ROOT/app/icon.svg" "$size" "$TMP/favicon-$size.png"
done
magick "$TMP/favicon-16.png" "$TMP/favicon-32.png" "$TMP/favicon-48.png" \
  "$ROOT/app/favicon.ico"

# Home screens: phones crop the corners, and maskable icons must keep their
# content inside a centred circle of 80% of the width. The clover's outermost
# point reaches 59.5% of its size from the centre, so 0.64 stays inside. These
# two stay square and opaque: the platform rounds them, and iOS fills
# transparent corners with black.
tile 18 0.64 >"$TMP/app-icon.svg"
png "$TMP/app-icon.svg" 180 "$ROOT/app/apple-icon.png"
png "$TMP/app-icon.svg" 512 "$ROOT/public/icon-maskable-512.png"

# Everywhere else shows the manifest icons as they are.
tile 18 0.64 22 >"$TMP/app-icon-rounded.svg"
rounded_png "$TMP/app-icon-rounded.svg" 192 "$ROOT/public/icon-192.png"
rounded_png "$TMP/app-icon-rounded.svg" 512 "$ROOT/public/icon-512.png"

# Link previews: 1200x630, the wordmark on lime beside a clover tile.
fonttools varLib.instancer "$ROOT/app/fonts/IntertopiaVF.ttf" wght=500 \
  -o "$TMP/Intertopia-500.ttf" -q
tile 8.333 0.8333 >"$TMP/og-tile.svg"
png "$TMP/og-tile.svg" 630 "$TMP/og-tile.png"
magick -size 1200x630 "xc:$LIME" \
  "$TMP/og-tile.png" -geometry +570+0 -composite \
  -font "$TMP/Intertopia-500.ttf" -fill "$GREEN" \
  -gravity NorthWest -pointsize 260 -kerning -5 -annotate +46+50 "z57" \
  -gravity SouthWest -pointsize 56 -kerning -0.6 -interline-spacing -6 \
  -annotate +56+48 $'Atelier & Studio\nSpace Vienna' \
  -strip "PNG24:$ROOT/app/og.png"

echo "Brand assets written."
