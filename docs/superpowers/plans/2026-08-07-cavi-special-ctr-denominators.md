# Cavi Special CTR Denominators Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add four declarative cross-element CTR denominator rules to the Cavi analytics page and display the effective formula and denominator exposure UV.

**Architecture:** Keep the daily payload as raw per-element click and view totals. Add one `CTR_DENOMINATOR_OVERRIDES` configuration map, embed it in the page payload, and apply it only after the selected date range has been aggregated so both Python verification and browser rendering use the same range totals. Preserve the existing default of self-clicks divided by self-views for every element not in the map.

**Tech Stack:** Python 3 standard library, standalone HTML/CSS/JavaScript, Node.js static checks, `unittest`, `lark-cli` read-only Feishu Sheets access.

---

### Task 1: Add special denominator aggregation rules

**Files:**
- Modify: `tools/build_cavi_analytics.py:15-125`
- Test: `tests/test_cavi_analytics.py`

- [ ] **Step 1: Write the failing Python regression test**

Add this test to `ParserTests`:

```python
def test_aggregate_range_uses_special_ctr_denominators(self):
    rows = [
        {"event": "click", "element": "caviaix_session_layer_close", "date": "20260806", "group": "AI", "uv": 10},
        {"event": "view_item", "element": "caviaix_session_layer_close", "date": "20260806", "group": "AI", "uv": 999},
        {"event": "click", "element": "caviaix_session_layer_input_box", "date": "20260806", "group": "AI", "uv": 20},
        {"event": "view_item", "element": "caviaix_session_layer", "date": "20260806", "group": "AI", "uv": 200},
        {"event": "click", "element": "caviaix_dislike_layer_option_btn", "date": "20260806", "group": "AI", "uv": 30},
        {"event": "click", "element": "caviaix_like_layer_option_btn", "date": "20260806", "group": "AI", "uv": 40},
        {"event": "view_item", "element": "caviaix_like_layer_option_btn", "date": "20260806", "group": "AI", "uv": 888},
        {"event": "view_item", "element": "caviaix_likeorno_layer_option_btn", "date": "20260806", "group": "AI", "uv": 100},
    ]
    ranged = aggregate_range(aggregate_daily(rows, {}), "20260806", "20260806")
    elements = {item["element"]: item for item in ranged["elements"]}

    self.assertEqual(elements["caviaix_session_layer_close"]["view_uv"], 200)
    self.assertEqual(elements["caviaix_session_layer_close"]["denominator_element"], "caviaix_session_layer")
    self.assertEqual(elements["caviaix_session_layer_close"]["ctr"], 10 / 200)
    self.assertEqual(elements["caviaix_session_layer_input_box"]["ctr"], 20 / 200)
    self.assertEqual(elements["caviaix_dislike_layer_option_btn"]["view_uv"], 100)
    self.assertEqual(elements["caviaix_dislike_layer_option_btn"]["ctr"], 30 / 100)
    self.assertEqual(elements["caviaix_like_layer_option_btn"]["ctr"], 40 / 100)
```

- [ ] **Step 2: Run the focused test and verify the expected failure**

Run:

```bash
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest \
  tests.test_cavi_analytics.ParserTests.test_aggregate_range_uses_special_ctr_denominators -v
```

Expected: FAIL because `caviaix_session_layer_close` uses its own `view_uv=999` or lacks `denominator_element`.

- [ ] **Step 3: Add the declarative configuration and apply it in Python range aggregation**

Add near the imports in `tools/build_cavi_analytics.py`:

```python
CTR_DENOMINATOR_OVERRIDES = {
    "caviaix_session_layer_close": "caviaix_session_layer",
    "caviaix_session_layer_input_box": "caviaix_session_layer",
    "caviaix_dislike_layer_option_btn": "caviaix_likeorno_layer_option_btn",
    "caviaix_like_layer_option_btn": "caviaix_likeorno_layer_option_btn",
}
```

Change `aggregate_range` to accept the shared configuration and resolve the effective exposure after all raw element totals are available:

```python
def aggregate_range(
    daily: dict[str, dict],
    start: str,
    end: str,
    denominator_overrides: dict[str, str] = CTR_DENOMINATOR_OVERRIDES,
) -> dict:
    """Combine daily results for an inclusive YYYYMMDD range."""
    source_totals = Counter()
    element_totals = {}
    selected_dates = [date for date in sorted(daily) if start <= date <= end]
    for date in selected_dates:
        day = daily[date]
        for source in day["sources"]:
            source_totals[source["name"]] += source["click_uv"]
        for item in day["elements"]:
            current = element_totals.setdefault(
                item["element"], {"name": item["name"], "click_uv": 0, "view_uv": 0}
            )
            current["click_uv"] += item["click_uv"]
            current["view_uv"] += item["view_uv"]

    sources = [{"name": name, "click_uv": uv} for name, uv in source_totals.items()]
    sources.sort(key=lambda item: (-item["click_uv"], item["name"]))
    elements = []
    for element, item in element_totals.items():
        if item["click_uv"] == 0:
            continue
        denominator_element = denominator_overrides.get(element, element)
        denominator = element_totals.get(denominator_element)
        view_uv = denominator["view_uv"] if denominator else 0
        item = dict(item)
        item["element"] = element
        item["view_uv"] = view_uv
        item["denominator_element"] = denominator_element
        item["ctr"] = item["click_uv"] / view_uv if view_uv else None
        elements.append(item)
    elements.sort(
        key=lambda item: (
            item["ctr"] is None,
            -(item["ctr"] or 0),
            -item["click_uv"],
            item["name"],
        )
    )
    return {"dates": selected_dates, "sources": sources, "elements": elements}
```

- [ ] **Step 4: Run focused and full Python tests**

Run:

```bash
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest \
  tests.test_cavi_analytics.ParserTests.test_aggregate_range_uses_special_ctr_denominators -v
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest tests/test_cavi_analytics.py -v
```

Expected: focused test PASS; all Python tests PASS with zero failures.

- [ ] **Step 5: Commit the tested aggregation change**

```bash
git add tools/build_cavi_analytics.py tests/test_cavi_analytics.py
git commit -m "feat: add special Cavi CTR denominators"
```

### Task 2: Apply the same rules in the browser and explain them in the UI

**Files:**
- Modify: `tools/build_cavi_analytics.py:280-460`
- Test: `tests/cavi-analytics-static-check.mjs`

- [ ] **Step 1: Add failing static assertions for the browser contract**

Add these assertions:

```javascript
assert.match(html, /ctr_denominator_overrides/)
assert.match(html, /denominatorElement = denominatorOverrides\[item\.element\] \|\| item\.element/)
assert.match(html, /caviaix_session_layer_close.*caviaix_session_layer/s)
assert.match(html, /caviaix_dislike_layer_option_btn.*caviaix_likeorno_layer_option_btn/s)
assert.match(html, /特殊点击率口径/)
```

- [ ] **Step 2: Run the static check and verify the expected failure**

Run:

```bash
node tests/cavi-analytics-static-check.mjs
```

Expected: FAIL because the generated HTML does not yet contain the overrides or explanation.

- [ ] **Step 3: Embed the configuration in the payload**

Add to the dictionary returned by `build_payload`:

```python
"ctr_denominator_overrides": CTR_DENOMINATOR_OVERRIDES,
```

- [ ] **Step 4: Resolve the effective denominator in `aggregateSelectedRange`**

Add beside the other browser constants:

```javascript
const denominatorOverrides = payload.ctr_denominator_overrides || {}
```

Replace the final element mapping with:

```javascript
const elements = [...elementTotals.values()]
  .filter(item => item.click_uv > 0)
  .map(item => {{
    const denominatorElement = denominatorOverrides[item.element] || item.element
    const denominator = elementTotals.get(denominatorElement)
    const view_uv = denominator ? denominator.view_uv : 0
    return {{
      ...item,
      view_uv,
      denominator_element: denominatorElement,
      ctr: view_uv ? item.click_uv / view_uv : null
    }}
  }})
  .sort((a,b) => (a.ctr === null) - (b.ctr === null) || (b.ctr || 0) - (a.ctr || 0) || b.click_uv - a.click_uv || a.name.localeCompare(b.name))
```

- [ ] **Step 5: Add visible special-formula documentation and informative tooltips**

Add this style beside `.footnote`:

```css
.formula-note {{ margin-top: 10px; color: #6f7686; font-size: 11px; line-height: 1.7; }}
.formula-note strong {{ color: #4f5667; }}
```

Below the CTR card header, add the compact note while keeping the existing table columns unchanged:

```html
<p class="formula-note"><strong>特殊点击率口径：</strong>
  caviaix_session_layer_close、caviaix_session_layer_input_box 使用 caviaix_session_layer 曝光 UV；
  caviaix_dislike_layer_option_btn、caviaix_like_layer_option_btn 使用 caviaix_likeorno_layer_option_btn 曝光 UV。
</p>
```

In `renderElements`, replace the tooltip construction with:

```javascript
const denominatorElement = item.denominator_element || item.element
const title = valid
  ? `${{item.element}} 点击 UV ${{number.format(item.click_uv)}} ÷ ${{denominatorElement}} 曝光 UV ${{number.format(item.view_uv)}}`
  : `缺少 ${{denominatorElement}} 的 view_item 曝光数据`
```

Escape the complete `title` string before inserting it into the HTML attribute:

```javascript
<div class="ctr-cell ${{valid ? '' : 'missing'}}" title="${{escapeHtml(title)}}">
```

- [ ] **Step 6: Regenerate the HTML and run the static check**

Run:

```bash
python3 tools/build_cavi_analytics.py \
  --csv '/Users/nyl/Downloads/download (8).csv' \
  --feishu-url 'https://kcn4tlh8cxcn.feishu.cn/wiki/P0GKwHJiliHcRTkxLTncsirKnzd?sheet=zXsFTi' \
  --output cavi-analytics.html
node tests/cavi-analytics-static-check.mjs
```

Expected: generation reports `mapping=30/30`; static check PASS.

- [ ] **Step 7: Commit the browser and generated-page changes**

```bash
git add tools/build_cavi_analytics.py tests/cavi-analytics-static-check.mjs cavi-analytics.html
git commit -m "feat: show special Cavi CTR formulas"
```

### Task 3: Independently reconcile the four formulas and finish verification

**Files:**
- Verify: `cavi-analytics.html`
- Verify: `tools/build_cavi_analytics.py`
- Verify: `tests/test_cavi_analytics.py`
- Verify: `tests/cavi-analytics-static-check.mjs`

- [ ] **Step 1: Independently calculate and reconcile the four expected ratios**

Use `parse_cavi_csv_rows` only to parse source records, then independently sum the generated payload's raw daily data. Do not use `aggregate_range` for either calculation.

Expected formulas:

```text
caviaix_session_layer_close.click / caviaix_session_layer.view_item
caviaix_session_layer_input_box.click / caviaix_session_layer.view_item
caviaix_dislike_layer_option_btn.click / caviaix_likeorno_layer_option_btn.view_item
caviaix_like_layer_option_btn.click / caviaix_likeorno_layer_option_btn.view_item
```

Run this independent reconciliation, which applies the embedded override map to the page's raw daily values and compares the effective numerator, denominator, and unrounded CTR with the CSV totals:

```bash
python3 -c 'import json,re
from collections import defaultdict
from pathlib import Path
from tools.build_cavi_analytics import parse_cavi_csv_rows
rows=parse_cavi_csv_rows(Path("/Users/nyl/Downloads/download (8).csv"))
html=Path("cavi-analytics.html").read_text(encoding="utf-8")
payload=json.loads(re.search(r"<script id=\"dashboardData\" type=\"application/json\">(.*?)</script>",html,re.S).group(1))
totals=defaultdict(lambda:{"click":0,"view_item":0})
for row in rows: totals[row["element"]][row["event"]]+=row["uv"]
page=defaultdict(lambda:{"click":0,"view_item":0})
for day in payload["daily"].values():
 for item in day["elements"]:
  page[item["element"]]["click"]+=item["click_uv"]
  page[item["element"]]["view_item"]+=item["view_uv"]
special=payload["ctr_denominator_overrides"]
assert special=={
 "caviaix_session_layer_close":"caviaix_session_layer",
 "caviaix_session_layer_input_box":"caviaix_session_layer",
 "caviaix_dislike_layer_option_btn":"caviaix_likeorno_layer_option_btn",
 "caviaix_like_layer_option_btn":"caviaix_likeorno_layer_option_btn"}
for element,denominator in special.items():
 click_uv=totals[element]["click"]
 view_uv=totals[denominator]["view_item"]
 page_click=page[element]["click"]
 page_view=page[denominator]["view_item"]
 assert view_uv>0,(element,denominator)
 assert (page_click,page_view)==(click_uv,view_uv),(element,(click_uv,view_uv),(page_click,page_view))
 assert page_click/page_view==click_uv/view_uv,element
 print(element,click_uv,denominator,view_uv,click_uv/view_uv)
print("special_ctr_mismatches=0")'
```

Expected: four formula rows followed by `special_ctr_mismatches=0`.

- [ ] **Step 2: Run the full final verification suite**

Run:

```bash
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest tests/test_cavi_analytics.py -v
node tests/cavi-analytics-static-check.mjs
git diff --check
git status --short
```

Expected: all Python tests PASS, static check PASS, `git diff --check` produces no output, and the working tree is clean after the Task 2 commit.

- [ ] **Step 3: Refresh the existing local page for manual confirmation**

Open or refresh:

```text
/Users/nyl/Documents/AutoCava工作/AutoCava-publish/cavi-analytics.html
```

Verify that the special formula note is visible, each affected row tooltip names its configured denominator and exposure UV, date filtering still updates both numerator and denominator, and fuzzy search still filters by the displayed element name.
