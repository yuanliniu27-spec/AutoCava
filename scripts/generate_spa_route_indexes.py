#!/usr/bin/env python3
from __future__ import annotations

import argparse
import posixpath
import re
from pathlib import Path
from urllib.parse import urlparse


INTERNAL_HREF_RE = re.compile(r"<a\b[^>]*\bhref=[\"']([^\"']+)", re.IGNORECASE)
SKIP_PREFIXES = ("/site/", "/_i18n/", "/.github/", "/scripts/")


def normalize_route(href: str) -> str | None:
    parsed = urlparse(href)
    if parsed.scheme or parsed.netloc:
        return None
    path = parsed.path
    if not path or not path.startswith("/") or path == "/":
        return None
    if path.startswith(SKIP_PREFIXES):
        return None
    normalized = posixpath.normpath(path)
    if normalized == "." or not normalized.startswith("/"):
        return None
    if normalized == "/":
        return None
    if any(part in ("", ".", "..") for part in normalized.split("/")[1:]):
        return None
    return normalized


def collect_routes(html: str) -> list[str]:
    routes: set[str] = set()
    for href in INTERNAL_HREF_RE.findall(html):
        route = normalize_route(href)
        if route:
            routes.add(route)
    return sorted(routes)


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate static index.html files for SPA routes linked from the homepage.")
    parser.add_argument("--root", default=".", help="Static site root. Defaults to current directory.")
    parser.add_argument("--dry-run", action="store_true", help="Print routes without writing files.")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    index_path = root / "index.html"
    html = index_path.read_text(encoding="utf-8")
    routes = collect_routes(html)

    if args.dry_run:
        for route in routes:
            print(route)
        print(f"routes: {len(routes)}")
        return 0

    for route in routes:
        output = root.joinpath(*route.strip("/").split("/")) / "index.html"
        if output.exists():
            print(f"Skipped existing {route}")
            continue
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(html, encoding="utf-8")

    (root / "404.html").write_text(html, encoding="utf-8")
    print(f"Generated {len(routes)} route index files and 404.html")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
