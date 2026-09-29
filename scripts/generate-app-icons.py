#!/usr/bin/env python3
"""
Generate the GlobalHealth PWA / touch icon PNG set from a vector description.

The artwork is drawn programmatically (rounded gradient tile + globe meridians
+ ECG heartbeat trace) so the raster icons stay pixel-crisp at every required
size without depending on an SVG rasteriser being installed.

Usage:  python3 scripts/generate-app-icons.py
Output: public/icon-192.png, public/icon-512.png, public/icon-maskable-512.png,
        public/apple-touch-icon.png, public/favicon-32.png
"""

import math
import os

from PIL import Image, ImageDraw, ImageFilter

OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public")

SS = 4  # supersample factor for smooth antialiased edges


def lerp(a, b, t):
    return a + (b - a) * t


def gradient_tile(size, stops):
    """Diagonal multi-stop linear gradient."""
    img = Image.new("RGB", (size, size))
    px = img.load()
    for y in range(size):
        for x in range(size):
            t = (x + y) / (2 * (size - 1))
            # find the surrounding stops
            for i in range(len(stops) - 1):
                t0, c0 = stops[i]
                t1, c1 = stops[i + 1]
                if t0 <= t <= t1:
                    local = (t - t0) / (t1 - t0) if t1 > t0 else 0
                    px[x, y] = tuple(int(lerp(c0[k], c1[k], local)) for k in range(3))
                    break
            else:
                px[x, y] = stops[-1][1]
    return img


def rounded_mask(size, radius):
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=255)
    return mask


def draw_globe(draw, size):
    cx = cy = size / 2
    r = size * 0.345
    w = max(1, int(size * 0.017))
    col = (255, 255, 255, 58)

    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=col, width=w)
    draw.ellipse([cx - r * 0.49, cy - r, cx + r * 0.49, cy + r], outline=col, width=w)
    # latitude lines
    for offset in (-0.40, 0.40):
        y = cy + r * offset
        half = math.sqrt(max(0.0, r * r - (r * offset) ** 2))
        draw.line([cx - half, y, cx + half, y], fill=col, width=w)


def draw_heartbeat(draw, size):
    """ECG trace with a soft outer glow for the app-tile look."""
    s = size
    pts = [
        (0.203, 0.512),
        (0.316, 0.512),
        (0.375, 0.398),
        (0.457, 0.625),
        (0.523, 0.461),
        (0.574, 0.547),
        (0.797, 0.547),
    ]
    path = [(x * s, y * s) for x, y in pts]
    width = int(s * 0.052)

    # glow pass
    glow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    ImageDraw.Draw(glow).line(path, fill=(255, 255, 255, 90), width=int(width * 2.1), joint="curve")
    glow = glow.filter(ImageFilter.GaussianBlur(radius=size * 0.022))
    return glow


def build(size, maskable=False, out_name="icon.png"):
    canvas = size * SS
    tile = gradient_tile(canvas, [(0.0, (47, 106, 133)), (0.55, (15, 118, 110)), (1.0, (5, 150, 105))]).convert("RGBA")

    # top-left highlight
    highlight = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))
    hd = ImageDraw.Draw(highlight)
    hd.ellipse([-canvas * 0.30, -canvas * 0.38, canvas * 0.86, canvas * 0.62], fill=(255, 255, 255, 46))
    highlight = highlight.filter(ImageFilter.GaussianBlur(radius=canvas * 0.09))
    tile = Image.alpha_composite(tile, highlight)

    art = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))
    ad = ImageDraw.Draw(art)

    # Maskable icons need the artwork inside the safe zone (80% centre circle),
    # so shrink the drawing instead of letting the launcher crop it.
    scale = 0.78 if maskable else 1.0
    if scale != 1.0:
        inner = int(canvas * scale)
        sub = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))
        sd = ImageDraw.Draw(sub)
        draw_globe(sd, canvas)
        sub = Image.alpha_composite(sub, draw_heartbeat(sd, canvas))
        sd2 = ImageDraw.Draw(sub)
        # heartbeat drawn on top of globe within sub-canvas
        sd2.line(
            [(x * canvas, y * canvas) for x, y in [
                (0.203, 0.512), (0.316, 0.512), (0.375, 0.398), (0.457, 0.625),
                (0.523, 0.461), (0.574, 0.547), (0.797, 0.547)]],
            fill=(255, 255, 255, 255),
            width=int(canvas * 0.052),
            joint="curve",
        )
        sub = sub.resize((inner, inner), Image.LANCZOS)
        art.alpha_composite(sub, ((canvas - inner) // 2, (canvas - inner) // 2))
    else:
        draw_globe(ad, canvas)
        art.alpha_composite(draw_heartbeat(ad, canvas))
        ImageDraw.Draw(art).line(
            [(x * canvas, y * canvas) for x, y in [
                (0.203, 0.512), (0.316, 0.512), (0.375, 0.398), (0.457, 0.625),
                (0.523, 0.461), (0.574, 0.547), (0.797, 0.547)]],
            fill=(255, 255, 255, 255),
            width=int(canvas * 0.052),
            joint="curve",
        )

    tile = Image.alpha_composite(tile, art)

    radius = int(canvas * 0.0) if maskable else int(canvas * 0.2266)
    if maskable:
        mask = Image.new("L", (canvas, canvas), 255)
    else:
        mask = rounded_mask(canvas, radius)
    tile.putalpha(mask)

    final = tile.resize((size, size), Image.LANCZOS)
    path = os.path.join(OUT_DIR, out_name)
    final.save(path, "PNG", optimize=True)
    print(f"wrote {path} ({size}x{size})")


if __name__ == "__main__":
    os.makedirs(OUT_DIR, exist_ok=True)
    build(512, maskable=False, out_name="icon-512.png")
    build(512, maskable=True, out_name="icon-maskable-512.png")
    build(192, maskable=False, out_name="icon-192.png")
    build(180, maskable=False, out_name="apple-touch-icon.png")
    build(32, maskable=False, out_name="favicon-32.png")
