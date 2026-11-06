#!/bin/bash
#
# Renders the favicon, app icons and Open Graph image from the site's wordmark
# and colours. Needs librsvg, ImageMagick and fonttools.
#

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
GREEN="#1c3108"
LIME="#defe51"
WORDMARK="Z57"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# The Python that fonttools runs on, which can import fontTools.
FONTTOOLS_PYTHON="$(head -1 "$(command -v fonttools)" | sed 's/^#!//')"

# Pins the variable font to one weight, so the outlines below match the site.
instance() {
  fonttools varLib.instancer "$ROOT/app/fonts/IntertopiaVF.ttf" "wght=$1" \
    -o "$TMP/Intertopia-$1.ttf" -q
}

# Prints the wordmark's outlines as one SVG path on a 100 unit square, centred
# and scaled so its ink is the given width. Icons can't load the site font, so
# the letters have to be shapes.
cat >"$TMP/wordmark_path.py" <<'PY'
import sys

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

font_path, text, width = sys.argv[1], sys.argv[2], float(sys.argv[3])
font = TTFont(font_path)
glyphs = font.getGlyphSet()
names = [font.getBestCmap()[ord(char)] for char in text]

def draw(pen):
    x = 0
    for name in names:
        glyphs[name].draw(TransformPen(pen, (1, 0, 0, 1, x, 0)))
        x += glyphs[name].width

bounds = BoundsPen(glyphs)
draw(bounds)
x_min, y_min, x_max, y_max = bounds.bounds
scale = width / (x_max - x_min)
# Font units point up, SVG units point down.
transform = (
    scale, 0, 0, -scale,
    50 - (x_min + x_max) / 2 * scale,
    50 + (y_min + y_max) / 2 * scale,
)
path = SVGPathPen(glyphs, ntos=lambda v: f"{v:.2f}".rstrip("0").rstrip("."))
draw(TransformPen(path, transform))
print(path.getCommands())
PY

# Prints the wordmark in lime on a dark green tile. The arguments are the font
# weight, the wordmark's width on the 100 unit tile, then the tile's corner
# radius, which defaults to square.
tile() {
  local path
  path="$("$FONTTOOLS_PYTHON" -I "$TMP/wordmark_path.py" "$TMP/Intertopia-$1.ttf" "$WORDMARK" "$2")"
  cat <<SVG
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="${3:-0}" fill="$GREEN"/>
  <path fill="$LIME" d="$path"/>
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

instance 500
instance 700

# Browser tabs: a heavier wordmark that nearly fills the tile, so it stays
# legible at 16px.
tile 700 84 22 >"$ROOT/app/icon.svg"
for size in 16 32 48; do
  rounded_png "$ROOT/app/icon.svg" "$size" "$TMP/favicon-$size.png"
done
magick "$TMP/favicon-16.png" "$TMP/favicon-32.png" "$TMP/favicon-48.png" \
  "$ROOT/app/favicon.ico"

# Home screens: phones crop the corners, and maskable icons must keep their
# content inside a centred circle of 80% of the width. At 66 units wide the
# wordmark's corners stay inside it. These two stay square and opaque: the
# platform rounds them, and iOS fills transparent corners with black.
tile 500 66 >"$TMP/app-icon.svg"
png "$TMP/app-icon.svg" 180 "$ROOT/app/apple-icon.png"
png "$TMP/app-icon.svg" 512 "$ROOT/public/icon-maskable-512.png"

# Everywhere else shows the manifest icons as they are.
tile 500 66 22 >"$TMP/app-icon-rounded.svg"
rounded_png "$TMP/app-icon-rounded.svg" 192 "$ROOT/public/icon-192.png"
rounded_png "$TMP/app-icon-rounded.svg" 512 "$ROOT/public/icon-512.png"

# Link previews: 1200x630, the wordmark on lime beside a dark green panel with
# the address, like the Wintermarkt band on the home page.
magick -size 1200x630 "xc:$LIME" \
  -fill "$GREEN" -draw "rectangle 570,0 1200,630" \
  -font "$TMP/Intertopia-500.ttf" \
  -gravity NorthWest -pointsize 260 -kerning -5 -annotate +46+50 "$WORDMARK" \
  -gravity SouthWest -pointsize 56 -kerning -0.6 -interline-spacing -6 \
  -annotate +56+48 $'Atelier & Studio\nSpace Vienna' \
  -fill "$LIME" -annotate +626+48 $'Zieglergasse 57\n1070 Wien' \
  -strip "PNG24:$ROOT/app/og.png"

echo "Brand assets written."
