#!/usr/bin/env python3
"""Draws the Registry Ready icon: a navy field, a band of reflective chevron striping
(the livery stripe on a rig), and a heavy check mark for "ready". No text.
Writes icon-512.png and icon-192.png at the repository root."""
import os
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NAVY = (22, 50, 74)
ORANGE = (217, 72, 15)
YELLOW = (244, 196, 48)
WHITE = (255, 255, 255)

def draw(size=1024):
    im = Image.new("RGB", (size, size), NAVY)
    d = ImageDraw.Draw(im)
    s = size / 1024
    # chevron band across the lower part
    top, bot = int(700 * s), int(860 * s)
    band = Image.new("RGB", (size, bot - top), YELLOW)
    bd = ImageDraw.Draw(band)
    w = int(64 * s)
    h = bot - top
    x = -h
    while x < size + h:
        bd.polygon([(x, h), (x + w, h), (x + w + h, 0), (x + h, 0)], fill=ORANGE)
        x += 2 * w
    im.paste(band, (0, top))
    # check mark
    pts = [(260, 420), (360, 320), (450, 410), (690, 170), (790, 270), (450, 610)]
    d.polygon([(int(px * s), int(py * s)) for px, py in pts], fill=WHITE)
    return im

big = draw(1024)
big.resize((512, 512), Image.LANCZOS).save(os.path.join(ROOT, "icon-512.png"))
big.resize((192, 192), Image.LANCZOS).save(os.path.join(ROOT, "icon-192.png"))
print("icons written")
