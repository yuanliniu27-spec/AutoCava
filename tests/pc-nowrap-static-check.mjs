import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const cssPath = path.join(root, "site/local/autocava-pc-nowrap.css");
const pageFiles = [
  "index.html",
  "auto/brand/46/index.html",
  "auto/series/332/index.html",
  "auto/series/336/index.html",
  "auto/series/337/index.html",
  "auto/series/338/index.html",
  "auto/series/351/index.html",
  "auto/series/354/index.html",
  "auto/series/359/index.html",
  "auto/series/552/index.html",
  "auto/series/586/index.html",
  "auto/series/884/index.html",
];

assert.ok(fs.existsSync(cssPath), "Missing PC nowrap stylesheet");

const css = fs.readFileSync(cssPath, "utf8");
assert.match(css, /@media\s*\(min-width:\s*1024px\)/);
assert.match(css, /#page-header[\s\S]*white-space:\s*nowrap/);
assert.match(css, /h1[\s\S]*h2[\s\S]*h3:not\(a h3\)[\s\S]*white-space:\s*nowrap/);

for (const relativePath of pageFiles) {
  const html = fs.readFileSync(path.join(root, relativePath), "utf8");
  const href =
    relativePath === "auto/series/586/index.html"
      ? "../../../site/local/autocava-pc-nowrap.css"
      : "site/local/autocava-pc-nowrap.css";
  assert.ok(
    html.includes(
      `<link rel="stylesheet" href="${href}">`,
    ),
    `${relativePath} does not include the PC nowrap stylesheet`,
  );
}

console.log("PASS: every deployed page loads the shared PC nowrap stylesheet.");
