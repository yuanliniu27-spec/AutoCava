import re
import urllib.request
from pathlib import Path


ROOT = Path("/Users/nyl/autocava-demo-download")
SNAPSHOT_DIR = ROOT / "snapshots"
SERIES_IDS = ("336", "337", "338", "332", "552")
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36"


def rewrite_html(html: str) -> str:
    replacements = {
        "https://uat-cdn.autocava.com": "/site/uat-cdn.autocava.com",
        "https://cdn.autocava.com.mx": "/site/cdn.autocava.com.mx",
        "https://api.autocava.com.mx": "/api",
        "https://demo.autocava.com.mx": "",
    }
    for old, new in replacements.items():
        html = html.replace(old, new)

    html = html.replace("//uat-cdn.autocava.com", "/site/uat-cdn.autocava.com")
    html = html.replace("//cdn.autocava.com.mx", "/site/cdn.autocava.com.mx")
    html = html.replace("//api.autocava.com.mx", "/api")
    html = html.replace("//demo.autocava.com.mx", "")

    # Fix a few malformed relative srcset entries emitted by the original SSR.
    html = re.sub(r'(?<=["\s,])site/(uat-cdn\.autocava\.com|cdn\.autocava\.com\.mx)', r"/site/\1", html)
    return html


def download_page(series_id: str) -> None:
    url = f"https://demo.autocava.com.mx/auto/series/{series_id}"
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "es-MX,es;q=0.9"})
    with urllib.request.urlopen(req, timeout=30) as response:
        html = response.read().decode("utf-8", "ignore")

    rewritten = rewrite_html(html)
    target = SNAPSHOT_DIR / f"auto_series_{series_id}.html"
    target.write_text(rewritten)
    print(f"{series_id}: {len(html)} bytes -> {target}")


def main() -> None:
    SNAPSHOT_DIR.mkdir(parents=True, exist_ok=True)
    for series_id in SERIES_IDS:
        download_page(series_id)


if __name__ == "__main__":
    main()
