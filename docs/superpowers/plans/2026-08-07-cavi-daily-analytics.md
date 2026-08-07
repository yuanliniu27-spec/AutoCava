# Cavi Daily Analytics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone `cavi-analytics.html` that shows Content Group click UV rankings and element click-through-rate rankings for a selected date range with fuzzy search.

**Architecture:** A Python build script reads the supplied CSV and fetches the Feishu mapping only at build time, aggregates compact per-day JSON, then writes one dependency-free HTML file. Browser JavaScript combines the selected inclusive date range, filters rows, sorts deterministic results, and renders the selected B-style vertical report.

**Tech Stack:** Python 3 standard library, HTML/CSS/vanilla JavaScript, Node.js static checks, Python `unittest`.

---

### Task 1: Implement and test data parsing

**Files:**
- Create: `tools/build_cavi_analytics.py`
- Create: `tests/test_cavi_analytics.py`

- [ ] **Step 1: Write failing parser and aggregation tests**

Create tests that import `parse_cavi_csv_rows()` and `aggregate_daily()` and assert that comment rows are skipped, commas in `Total users` are parsed, click source totals are summed by date, and CTR is `click_uv / view_uv`.

```python
def test_aggregate_daily_groups_and_ctr():
    rows = [
        {"event": "click", "element": "a", "date": "20260806", "group": "销量榜", "uv": 20},
        {"event": "click", "element": "a", "date": "20260806", "group": "销量榜", "uv": 5},
        {"event": "view_item", "element": "a", "date": "20260806", "group": "销量榜", "uv": 100},
    ]
    daily = aggregate_daily(rows, {"a": "测试按钮点击"})
    assert daily["20260806"]["sources"] == [{"name": "销量榜", "click_uv": 25}]
    assert daily["20260806"]["elements"][0]["ctr"] == 0.25
```

- [ ] **Step 2: Run tests and verify failure**

Run: `python3 -m unittest tests/test_cavi_analytics.py -v`

Expected: import or missing-function failure.

- [ ] **Step 3: Implement minimal parser and aggregator**

Implement these stable interfaces and behavior:

```python
def parse_cavi_csv_rows(path: Path) -> list[dict]:
    with path.open(encoding="utf-8-sig", newline="") as source:
        records = list(csv.reader(source))
    header_index = next(i for i, row in enumerate(records) if row and row[0].strip() == "Event name")
    parsed = []
    for raw in records[header_index + 1:]:
        row = raw + [""] * (6 - len(raw))
        event = row[0].strip()
        if event not in {"click", "view_item"} or not row[1].strip():
            continue
        try:
            uv = int(float(row[4].replace(",", "")))
        except ValueError:
            continue
        parsed.append({"event": event, "element": row[1].strip(), "date": row[2].strip(),
                       "group": row[3].strip() or "未设置", "uv": uv})
    return parsed


def aggregate_daily(rows: list[dict], names: dict[str, str]) -> dict[str, dict]:
    days = defaultdict(lambda: {"sources": Counter(), "elements": defaultdict(Counter)})
    for row in rows:
        if row["event"] == "click":
            days[row["date"]]["sources"][row["group"]] += row["uv"]
            days[row["date"]]["elements"][row["element"]]["click"] += row["uv"]
        else:
            days[row["date"]]["elements"][row["element"]]["view"] += row["uv"]
    output = {}
    for date, values in sorted(days.items()):
        sources = [{"name": name, "click_uv": uv} for name, uv in values["sources"].items()]
        sources.sort(key=lambda item: (-item["click_uv"], item["name"]))
        elements = []
        for element, counts in values["elements"].items():
            click_uv, view_uv = counts["click"], counts["view"]
            if click_uv == 0:
                continue
            elements.append({"element": element, "name": names.get(element, element),
                             "click_uv": click_uv, "view_uv": view_uv,
                             "ctr": click_uv / view_uv if view_uv else None})
        elements.sort(key=lambda item: (item["ctr"] is None,
                                        -(item["ctr"] or 0), -item["click_uv"], item["name"]))
        output[date] = {"sources": sources, "elements": elements}
    return output
```

`aggregate_daily()` must include click-only elements with `ctr=None`, sort valid CTR rows before missing-denominator rows, break equal CTR by click UV descending, and sort sources by click UV descending then name.

- [ ] **Step 4: Run tests and verify pass**

Run: `python3 -m unittest tests/test_cavi_analytics.py -v`

Expected: all parser and aggregation tests pass.

- [ ] **Step 5: Commit**

```bash
git add tools/build_cavi_analytics.py tests/test_cavi_analytics.py
git commit -m "feat: add Cavi analytics aggregation"
```

### Task 2: Implement and test Feishu name mapping

**Files:**
- Modify: `tools/build_cavi_analytics.py`
- Modify: `tests/test_cavi_analytics.py`

- [ ] **Step 1: Write failing mapping tests**

Test that click rows take priority over view rows, `element_name=` is extracted from column F, the phrase `修改名称为：caviaix_entry_module_card` overrides the historical typo, and missing names fall back to the English element name.

```python
def test_mapping_prefers_click_and_normalizes_renamed_element():
    rows = [
        ["页面", "卡片曝光", "view_item", "", "", "element_name=old 修改名称为：new"],
        ["页面", "卡片点击", "click", "", "", "element_name=old 修改名称为：new"],
    ]
    mapping = build_element_mapping(rows)
    assert mapping["new"] == "卡片点击"
```

- [ ] **Step 2: Run the focused test and verify failure**

Run: `python3 -m unittest tests.test_cavi_analytics.MappingTests -v`

Expected: missing `build_element_mapping` or failed assertion.

- [ ] **Step 3: Implement Feishu read and mapping functions**

Add the complete build-time Feishu read and mapping functions:

```python
def fetch_feishu_rows(url: str, sheet_id: str = "zXsFTi") -> list[list[str]]:
    rows = []
    for start, end in ((1, 200), (201, 400), (401, 455)):
        raw = subprocess.check_output([
            "lark-cli", "sheets", "+csv-get", "--url", url, "--sheet-id", sheet_id,
            "--range", f"A{start}:J{end}", "--max-chars", "500000", "--as", "user",
        ])
        envelope = json.loads(raw)
        if envelope.get("ok") is not True:
            raise RuntimeError(envelope)
        for record in csv.reader(io.StringIO(envelope["data"]["annotated_csv"])):
            if record:
                record[0] = re.sub(r"^\[row=\d+\] ", "", record[0])
                rows.append(record + [""] * (10 - len(record)))
    return rows


def build_element_mapping(rows: list[list[str]]) -> dict[str, str]:
    candidates = defaultdict(list)
    priority = {"click": 0, "view_item": 1}
    for row in rows:
        chinese_name, event, params = row[1].strip(), row[2].strip(), row[5]
        renamed = re.search(r"修改名称为\s*[：:]\s*([A-Za-z0-9_./-]+)", params)
        found = re.findall(r"element_name\s*=\s*([A-Za-z0-9_./-]+)", params, re.I)
        if renamed:
            found.append(renamed.group(1))
        for element in found:
            candidates[element].append((priority.get(event, 2), chinese_name))
    return {element: sorted(options, key=lambda item: (item[0], item[1]))[0][1]
            for element, options in candidates.items() if options}
```

Fetch `A1:J200`, `A201:J400`, and `A401:J455` with `lark-cli sheets +csv-get --as user`, parse the JSON envelope and annotated CSV with Python's CSV parser, and select names by priority `click > view_item > other`.

- [ ] **Step 4: Run tests and verify pass**

Run: `python3 -m unittest tests/test_cavi_analytics.py -v`

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add tools/build_cavi_analytics.py tests/test_cavi_analytics.py
git commit -m "feat: map Cavi event names from Feishu"
```

### Task 3: Generate the standalone vertical-report page

**Files:**
- Modify: `tools/build_cavi_analytics.py`
- Create: `cavi-analytics.html`
- Create: `tests/cavi-analytics-static-check.mjs`

- [ ] **Step 1: Write the failing static page check**

The Node check must assert that the generated page contains a date control, `sourceRanking`, `elementSearch`, `ctrTableBody`, an embedded JSON payload, mobile CSS, the text `按日累计`, and no external JavaScript or stylesheet dependency.

```javascript
assert.match(html, /id="reportDate"/)
assert.match(html, /id="elementSearch"/)
assert.match(html, /按日累计/)
assert.doesNotMatch(html, /<script[^>]+src=/)
assert.doesNotMatch(html, /<link[^>]+stylesheet/)
```

- [ ] **Step 2: Run the static check and verify failure**

Run: `node tests/cavi-analytics-static-check.mjs`

Expected: missing `cavi-analytics.html` or required marker failure.

- [ ] **Step 3: Implement deterministic HTML rendering**

Add `render_html(payload)` and a CLI `main()` accepting:

```text
--csv /Users/nyl/Downloads/download (8).csv
--feishu-url https://kcn4tlh8cxcn.feishu.cn/wiki/P0GKwHJiliHcRTkxLTncsirKnzd?sheet=zXsFTi
--output cavi-analytics.html
```

The page must use the approved B layout: header and start/end date controls defaulting to the full source range, stacked source ranking, stacked CTR table, Chinese name plus English name, actual CTR-width background capped at 100%, `—` for missing exposure, fuzzy search over both names, responsive narrow-screen layout, and accessible labels/focus styles.

- [ ] **Step 4: Generate the page**

Run the builder with the exact three arguments above.

Expected: the builder prints the output path, date count, source count, element count, and mapping coverage; `cavi-analytics.html` exists.

- [ ] **Step 5: Run all automated checks**

Run:

```bash
python3 -m unittest tests/test_cavi_analytics.py -v
node tests/cavi-analytics-static-check.mjs
```

Expected: all Python tests pass and Node prints `cavi analytics static checks passed`.

- [ ] **Step 6: Commit**

```bash
git add tools/build_cavi_analytics.py tests/test_cavi_analytics.py tests/cavi-analytics-static-check.mjs cavi-analytics.html
git commit -m "feat: add Cavi daily analytics dashboard"
```

### Task 4: Verify data and visual behavior

**Files:**
- Modify if needed: `cavi-analytics.html`
- Modify if needed: `tools/build_cavi_analytics.py`
- Modify if needed: tests listed above

- [ ] **Step 1: Cross-check payload totals**

Run a compact Python verification that compares every date's source click total against raw CSV click rows, confirms every finite CTR equals aggregated click/view UV, and reports zero mismatches.

- [ ] **Step 2: Serve and inspect the page**

Run: `python3 -m http.server 8765` from the repository root, open `http://localhost:8765/cavi-analytics.html`, and verify the latest date renders without console errors.

- [ ] **Step 3: Exercise required interactions**

Verify: switching to the earliest date changes both modules; searching a Chinese substring filters rows; searching an English substring filters rows; clearing search restores all rows; a date with click-only elements displays `—`; viewport widths near 1440 px and 390 px remain readable.

- [ ] **Step 4: Re-run automated checks after visual fixes**

Run the Python unit suite and Node static check again.

Expected: all checks still pass.

- [ ] **Step 5: Commit final verification fixes if any**

```bash
git add cavi-analytics.html tools/build_cavi_analytics.py tests
git commit -m "test: verify Cavi analytics dashboard"
```
