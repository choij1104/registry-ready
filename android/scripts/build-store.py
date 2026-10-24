#!/usr/bin/env python3
"""Builds the Google Play web bundle (android/www) from the repository's index.html.

The web app loads its three typefaces from Google Fonts. The store build replaces that with the
same faces bundled from @fontsource (SIL Open Font License), so the app makes no network request.
Everything else is the web app unchanged, plus a build marker.

Fails if the bundle would still make a network request, register a service worker, or load an
external script or stylesheet.
"""
import os, re, shutil, sys

AND = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT = os.path.dirname(AND)
WWW = os.path.join(AND, "www")
NM = os.path.join(AND, "node_modules", "@fontsource")

FACES = [  # (css family, fontsource package, weight, style)
    ("Barlow Condensed", "barlow-condensed", 600, "normal"),
    ("Barlow Condensed", "barlow-condensed", 700, "normal"),
    ("Barlow Condensed", "barlow-condensed", 800, "normal"),
    ("Atkinson Hyperlegible", "atkinson-hyperlegible", 400, "normal"),
    ("Atkinson Hyperlegible", "atkinson-hyperlegible", 400, "italic"),
    ("Atkinson Hyperlegible", "atkinson-hyperlegible", 700, "normal"),
    ("JetBrains Mono", "jetbrains-mono", 500, "normal"),
    ("JetBrains Mono", "jetbrains-mono", 700, "normal"),
]

def die(msg):
    sys.exit(f"build-store: {msg}")

html = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()

shutil.rmtree(WWW, ignore_errors=True)
os.makedirs(os.path.join(WWW, "fonts"))

css = []
for fam, pkg, w, st in FACES:
    name = f"{pkg}-latin-{w}-{st}.woff2"
    src = os.path.join(NM, pkg, "files", name)
    if not os.path.exists(src):
        die(f"missing font file {src}; run npm ci")
    shutil.copy(src, os.path.join(WWW, "fonts", name))
    css.append(f'@font-face{{font-family:"{fam}";font-style:{st};font-weight:{w};font-display:swap;src:url("fonts/{name}") format("woff2")}}')
for pkg in sorted({f[1] for f in FACES}):
    lic = os.path.join(NM, pkg, "LICENSE")
    if os.path.exists(lic):
        shutil.copy(lic, os.path.join(WWW, "fonts", f"{pkg}-LICENSE.txt"))

html, n1 = re.subn(r'<link rel="preconnect"[^>]*>\n?', "", html)
html, n2 = re.subn(r'<link rel="stylesheet" href="https://fonts\.googleapis\.com[^>]*>\n?', "<style>" + "".join(css) + "</style>\n", html)
if n2 != 1:
    die("Google Fonts stylesheet link not found exactly once")

head = '<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n<meta name="registry-ready-build" content="store">\n'
reset = "<style>:root{color-scheme:light dark;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>\n"
doc = "<!doctype html>\n<html lang=\"en\">\n<head>\n" + head + reset + "</head>\n<body>\n" + html + "\n</body>\n</html>\n"

checks = {
    "external stylesheet or script": r'<(link|script)[^>]+(href|src)="https?://',
    "network call": r"\bfetch\(|XMLHttpRequest|WebSocket\(|navigator\.sendBeacon",
    "service worker": r"serviceWorker",
    "Google Fonts": r"fonts\.(googleapis|gstatic)\.com",
}
for what, pat in checks.items():
    if re.search(pat, doc):
        die(f"store bundle contains {what} ({pat})")

open(os.path.join(WWW, "index.html"), "w", encoding="utf-8").write(doc)
shutil.copy(os.path.join(ROOT, "icon-512.png"), os.path.join(WWW, "icon-512.png"))
items = len(re.findall(r'^[MROT]\("[SPATO]\d\d"', html, flags=re.M))
print(f"build-store: www/index.html ({len(doc)} chars), {len(FACES)} font files bundled, {items} items")
