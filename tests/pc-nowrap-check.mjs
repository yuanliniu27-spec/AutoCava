import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const baseUrl = process.env.BASE_URL || "https://yuanliniu27-spec.github.io/AutoCava/";
const widths = [1024, 1280, 1440, 1920];
const paths = [
  "",
  "auto/brand/46/",
  "auto/series/332/",
  "auto/series/586/",
];

function pageUrl(path) {
  return new URL(path, baseUrl).href;
}

const browser = await chromium.launch({
  headless: true,
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});

const failures = [];

try {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });

    for (const path of paths) {
      await page.goto(pageUrl(path), { waitUntil: "networkidle", timeout: 45_000 });
      await page.waitForTimeout(800);

      const result = await page.evaluate(() => {
        const visible = (element) => {
          const style = getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return (
            style.display !== "none" &&
            style.visibility !== "hidden" &&
            Number(style.opacity) !== 0 &&
            rect.width > 0 &&
            rect.height > 0
          );
        };

        const lineCount = (element) => {
          const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
          const tops = [];
          let textNode;

          while ((textNode = walker.nextNode())) {
            if (!textNode.textContent?.trim()) continue;
            const range = document.createRange();
            range.selectNodeContents(textNode);
            tops.push(
              ...[...range.getClientRects()]
                .filter((rect) => rect.width > 0 && rect.height > 0)
                .map((rect) => Math.round(rect.top)),
            );
          }

          return new Set(tops).size;
        };

        const candidates = [
          ...document.querySelectorAll("h1, h2, h3"),
          ...document.querySelectorAll("#page-header nav a, #page-header nav button"),
        ];

        const items = candidates
          .filter(visible)
          .map((element) => ({
            tag: element.tagName.toLowerCase(),
            text: (element.textContent || "").replace(/\s+/g, " ").trim(),
            lines: lineCount(element),
            whiteSpace: getComputedStyle(element).whiteSpace,
            rect: element.getBoundingClientRect().toJSON(),
          }))
          .filter((item) => item.text);

        return {
          wrapped: items.filter((item) => item.lines > 1),
          outOfViewport: items.filter(
            (item) =>
              item.tag !== "h1" &&
              item.tag !== "h2" &&
              item.tag !== "h3" &&
              (item.rect.left < -1 || item.rect.right > window.innerWidth + 1),
          ),
        };
      });

      if (result.wrapped.length || result.outOfViewport.length) {
        failures.push({ width, path: pageUrl(path), ...result });
      }
    }

    await page.close();
  }
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(JSON.stringify(failures, null, 2));
  process.exit(1);
}

console.log("PASS: PC page headings and header navigation stay on one line.");
