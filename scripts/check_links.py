#!/usr/bin/env python3
"""Fail if any page in docs/ links to a local file that doesn't exist."""
import re
import sys
from pathlib import Path
from urllib.parse import urlparse

DOCS = Path(__file__).resolve().parent.parent / "docs"
ATTR = re.compile(r'(?:href|src)="([^"]+)"')

broken = []
for page in DOCS.rglob("*.html"):
    for ref in ATTR.findall(page.read_text(encoding="utf8")):
        if ref.startswith(("#", "data:", "mailto:", "javascript:")) or "${" in ref or urlparse(ref).scheme:
            continue
        target = (page.parent / urlparse(ref).path).resolve()
        if target.is_dir():
            target = target / "index.html"
        if not target.exists():
            broken.append(f"{page.relative_to(DOCS)} -> {ref}")

catalog = (DOCS / "assets" / "catalog.js").read_text()
for slug in re.findall(r'"slug":"([^"]+)"', catalog):
    if not (DOCS / "workbooks" / slug / "index.html").exists():
        broken.append(f"assets/catalog.js -> workbooks/{slug}/")
    if not (DOCS / "cheat-sheets" / f"{slug}.pdf").exists():
        broken.append(f"cheat sheet missing -> cheat-sheets/{slug}.pdf")

if broken:
    print("Broken links:\n  " + "\n  ".join(broken))
    sys.exit(1)
print(f"All local links resolve ({sum(1 for _ in DOCS.rglob('*.html'))} pages).")
