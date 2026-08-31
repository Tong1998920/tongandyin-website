#!/usr/bin/env python3
"""
Generates clearly-labeled neutral placeholder images for the Tong Yin
website first draft. Not part of the delivered site's runtime — safe to
delete once real artwork images are in place.
"""
import os
from PIL import Image, ImageDraw, ImageFont

FONT_PATHS = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]

def get_font(size, bold=False):
    path = FONT_PATHS[1] if bold and os.path.exists(FONT_PATHS[1]) else FONT_PATHS[0]
    if os.path.exists(path):
        return ImageFont.truetype(path, size)
    return ImageFont.load_default()

# A quiet, warm neutral palette so placeholders don't look like broken
# images or clash with the site's off-white background — each a slightly
# different tone so a page full of them doesn't look identical.
TONES = [
    (222, 219, 213),
    (214, 210, 202),
    (226, 222, 214),
    (206, 203, 196),
    (218, 213, 203),
    (210, 208, 202),
    (230, 227, 220),
    (200, 197, 190),
]

def make_placeholder(path, w, h, label, tone_index=0, sublabel=""):
    tone = TONES[tone_index % len(TONES)]
    img = Image.new("RGB", (w, h), tone)
    draw = ImageDraw.Draw(img)

    # Subtle diagonal hairlines corner-to-corner, thin, low-contrast —
    # reads as "placeholder" without looking like a broken-image icon.
    line_color = tuple(max(0, c - 24) for c in tone)
    draw.line([(0, 0), (w, h)], fill=line_color, width=1)
    draw.line([(w, 0), (0, h)], fill=line_color, width=1)

    label_text = "PLACEHOLDER IMAGE"
    dim_text = f"{w} × {h}  —  {label}"

    f1 = get_font(max(14, w // 40), bold=True)
    f2 = get_font(max(12, w // 60))

    text_color = (74, 71, 66)

    bbox1 = draw.textbbox((0, 0), label_text, font=f1)
    tw1, th1 = bbox1[2] - bbox1[0], bbox1[3] - bbox1[1]
    bbox2 = draw.textbbox((0, 0), dim_text, font=f2)
    tw2, th2 = bbox2[2] - bbox2[0], bbox2[3] - bbox2[1]

    cx, cy = w / 2, h / 2
    gap = 10
    draw.text((cx - tw1 / 2, cy - th1 - gap / 2), label_text, font=f1, fill=text_color)
    draw.text((cx - tw2 / 2, cy + gap / 2), dim_text, font=f2, fill=text_color)

    if sublabel:
        f3 = get_font(max(11, w // 70))
        bbox3 = draw.textbbox((0, 0), sublabel, font=f3)
        tw3 = bbox3[2] - bbox3[0]
        pad = max(16, w // 60)
        draw.text((pad, h - pad - (bbox3[3] - bbox3[1])), sublabel, font=f3, fill=text_color)

    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path, quality=90)
    print("wrote", path)

base = "assets/images"

# Hero (homepage) — wide landscape
make_placeholder(f"{base}/hero/hero-01.jpg", 2400, 1500, "Homepage hero artwork", 0,
                  "Replace with a large installation or artwork image, landscape orientation")

# ---- Works: Project 01 — "Quiet Structures" ----
p = f"{base}/works/project-01"
make_placeholder(f"{p}-cover.jpg", 1800, 1300, "Project 01 cover", 1)
make_placeholder(f"{p}-01.jpg", 2000, 1500, "Untitled I", 2)
make_placeholder(f"{p}-02.jpg", 1400, 1900, "Untitled II", 3)
make_placeholder(f"{p}-03.jpg", 1800, 1800, "Untitled III", 4)
make_placeholder(f"{p}-04.jpg", 2000, 1300, "Untitled IV", 5)
make_placeholder(f"{p}-installation-01.jpg", 2400, 1400, "Installation view 1", 6)
make_placeholder(f"{p}-installation-02.jpg", 2400, 1400, "Installation view 2", 0)

# ---- Works: Project 02 — "Interior Margins" ----
p = f"{base}/works/project-02"
make_placeholder(f"{p}-cover.jpg", 1400, 1900, "Project 02 cover", 3)
make_placeholder(f"{p}-01.jpg", 1400, 1900, "Untitled I", 1)
make_placeholder(f"{p}-02.jpg", 2000, 1300, "Untitled II", 2)
make_placeholder(f"{p}-03.jpg", 1800, 1800, "Untitled III", 5)
make_placeholder(f"{p}-installation-01.jpg", 2400, 1400, "Installation view 1", 4)

# ---- Works: Project 03 — "Untitled Series" ----
p = f"{base}/works/project-03"
make_placeholder(f"{p}-cover.jpg", 1800, 1300, "Project 03 cover", 6)
make_placeholder(f"{p}-01.jpg", 1800, 1300, "Untitled I", 0)
make_placeholder(f"{p}-02.jpg", 1400, 1900, "Untitled II", 7)
make_placeholder(f"{p}-03.jpg", 2000, 1300, "Untitled III", 2)

# ---- Exhibitions ----
e = f"{base}/exhibitions"
make_placeholder(f"{e}/example-solo-2025-01.jpg", 2400, 1400, "Installation view 1", 1)
make_placeholder(f"{e}/example-solo-2025-02.jpg", 1600, 2000, "Installation view 2", 4)
make_placeholder(f"{e}/example-solo-2025-03.jpg", 2400, 1400, "Installation view 3", 6)

# ---- About ----
a = f"{base}/about"
make_placeholder(f"{a}/portrait.jpg", 1400, 1750, "Studio / artist portrait", 3)

print("done")
