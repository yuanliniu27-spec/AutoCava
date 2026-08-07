#!/usr/bin/env python3
"""Build a standalone daily Cavi analytics dashboard."""

from __future__ import annotations

import argparse
import csv
import html
import io
import json
import re
import subprocess
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path


CTR_DENOMINATOR_OVERRIDES = {
    "caviaix_session_layer_close": "caviaix_session_layer",
    "caviaix_session_layer_input_box": "caviaix_session_layer",
    "caviaix_dislike_layer_option_btn": "caviaix_likeorno_layer_option_btn",
    "caviaix_like_layer_option_btn": "caviaix_likeorno_layer_option_btn",
}


def parse_cavi_csv_rows(path: Path) -> list[dict]:
    with path.open(encoding="utf-8-sig", newline="") as source:
        records = list(csv.reader(source))

    try:
        header_index = next(
            index for index, row in enumerate(records) if row and row[0].strip() == "Event name"
        )
    except StopIteration as error:
        raise ValueError("CSV 中未找到 Event name 表头") from error

    parsed = []
    for raw in records[header_index + 1 :]:
        row = raw + [""] * (6 - len(raw))
        event = row[0].strip()
        element = row[1].strip()
        date = row[2].strip()
        if event not in {"click", "view_item"} or not element or not re.fullmatch(r"\d{8}", date):
            continue
        try:
            uv = int(float(row[4].replace(",", "")))
        except ValueError:
            continue
        parsed.append(
            {
                "event": event,
                "element": element,
                "date": date,
                "group": row[3].strip() or "未设置",
                "uv": uv,
            }
        )
    return parsed


def aggregate_daily(rows: list[dict], names: dict[str, str]) -> dict[str, dict]:
    days = defaultdict(lambda: {"sources": Counter(), "elements": defaultdict(Counter)})
    for row in rows:
        day = days[row["date"]]
        if row["event"] == "click":
            day["sources"][row["group"]] += row["uv"]
            day["elements"][row["element"]]["click"] += row["uv"]
        else:
            day["elements"][row["element"]]["view"] += row["uv"]

    output = {}
    for date, values in sorted(days.items()):
        sources = [
            {"name": name, "click_uv": uv} for name, uv in values["sources"].items()
        ]
        sources.sort(key=lambda item: (-item["click_uv"], item["name"]))

        elements = []
        for element, counts in values["elements"].items():
            click_uv = counts["click"]
            view_uv = counts["view"]
            elements.append(
                {
                    "element": element,
                    "name": names.get(element, element),
                    "click_uv": click_uv,
                    "view_uv": view_uv,
                    "ctr": click_uv / view_uv if view_uv else None,
                }
            )
        elements.sort(
            key=lambda item: (
                item["ctr"] is None,
                -(item["ctr"] or 0),
                -item["click_uv"],
                item["name"],
            )
        )
        output[date] = {"sources": sources, "elements": elements}
    return output


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


def fetch_feishu_rows(url: str, sheet_id: str = "zXsFTi") -> list[list[str]]:
    rows = []
    for start, end in ((1, 200), (201, 400), (401, 455)):
        raw = subprocess.check_output(
            [
                "lark-cli",
                "sheets",
                "+csv-get",
                "--url",
                url,
                "--sheet-id",
                sheet_id,
                "--range",
                f"A{start}:J{end}",
                "--max-chars",
                "500000",
                "--as",
                "user",
            ],
            stderr=subprocess.PIPE,
        )
        envelope = json.loads(raw)
        if envelope.get("ok") is not True:
            raise RuntimeError(f"读取飞书表格失败：{envelope}")
        for record in csv.reader(io.StringIO(envelope["data"]["annotated_csv"])):
            if not record:
                continue
            record[0] = re.sub(r"^\[row=\d+\] ", "", record[0])
            rows.append(record + [""] * max(0, 10 - len(record)))
    return rows


def build_element_mapping(rows: list[list[str]]) -> dict[str, str]:
    candidates = defaultdict(list)
    for row in rows:
        padded = row + [""] * max(0, 6 - len(row))
        chinese_name = padded[1].strip()
        event = padded[2].strip()
        params = padded[5]
        if not chinese_name:
            continue

        if event == "click" or "点击" in chinese_name:
            priority = 0
        elif event == "view_item" or "曝光" in chinese_name:
            priority = 1
        else:
            priority = 2

        found = re.findall(r"element_name\s*=\s*([A-Za-z0-9_./-]+)", params, re.I)
        renamed = re.findall(r"修改名称为\s*[：:]\s*([A-Za-z0-9_./-]+)", params)
        elements = renamed or found
        for element in elements:
            candidates[element].append((priority, chinese_name))

    return {
        element: sorted(options, key=lambda item: (item[0], item[1]))[0][1]
        for element, options in candidates.items()
        if options
    }


def _safe_json(value: dict) -> str:
    return json.dumps(value, ensure_ascii=False, separators=(",", ":")).replace("<", "\\u003c")


def render_html(payload: dict) -> str:
    data_json = _safe_json(payload)
    title = html.escape(payload["meta"]["title"])
    return f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'none'; img-src data:; base-uri 'none'; form-action 'none'">
  <title>{title}</title>
  <style>
    :root {{
      color-scheme: light;
      --ink: #182033;
      --muted: #6f7788;
      --line: #e6e9f0;
      --surface: rgba(255,255,255,.92);
      --purple: #7557e8;
      --purple-soft: #eee9ff;
      --cyan: #23b7c9;
      --cyan-soft: #dcf7fa;
      --shadow: 0 18px 52px rgba(31, 39, 62, .08);
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      min-height: 100vh;
      color: var(--ink);
      background:
        radial-gradient(circle at 8% 4%, rgba(117,87,232,.14), transparent 28rem),
        radial-gradient(circle at 93% 11%, rgba(35,183,201,.12), transparent 26rem),
        #f6f7fb;
      font-family: Inter, "PingFang SC", "Microsoft YaHei", system-ui, -apple-system, sans-serif;
    }}
    button, input, select {{ font: inherit; }}
    .shell {{ width: min(1120px, calc(100% - 40px)); margin: 0 auto; padding: 54px 0 76px; }}
    .eyebrow {{ margin: 0 0 12px; color: var(--purple); font-size: 12px; font-weight: 800; letter-spacing: .16em; }}
    .hero {{ display: flex; justify-content: space-between; gap: 30px; align-items: flex-end; margin-bottom: 28px; }}
    h1 {{ margin: 0; font-size: clamp(30px, 4vw, 48px); line-height: 1.08; letter-spacing: -.045em; }}
    .subtitle {{ margin: 13px 0 0; color: var(--muted); font-size: 14px; line-height: 1.7; }}
    .date-control {{ min-width: 340px; }}
    .date-control label {{ display: block; margin-bottom: 8px; color: var(--muted); font-size: 12px; font-weight: 700; }}
    input[type="date"], .search-input {{
      width: 100%; border: 1px solid #d9deea; border-radius: 13px; background: rgba(255,255,255,.9);
      color: var(--ink); outline: none; transition: border-color .2s, box-shadow .2s;
    }}
    input[type="date"] {{ padding: 12px 14px; }}
    input[type="date"]:focus, .search-input:focus {{ border-color: var(--purple); box-shadow: 0 0 0 4px rgba(117,87,232,.12); }}
    .range-inputs {{ display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 9px; }}
    .range-separator {{ color: var(--muted); font-size: 12px; font-weight: 700; }}
    .notice {{ display: flex; gap: 9px; align-items: center; margin-bottom: 18px; color: #5b5670; font-size: 12px; }}
    .notice-dot {{ width: 8px; height: 8px; border-radius: 50%; background: var(--purple); box-shadow: 0 0 0 5px rgba(117,87,232,.1); }}
    .card {{ margin-top: 22px; padding: 26px; border: 1px solid rgba(222,225,235,.9); border-radius: 22px; background: var(--surface); box-shadow: var(--shadow); backdrop-filter: blur(14px); }}
    .card-head {{ display: flex; justify-content: space-between; gap: 22px; align-items: flex-start; margin-bottom: 22px; }}
    h2 {{ margin: 0; font-size: 19px; letter-spacing: -.02em; }}
    .card-description {{ margin: 7px 0 0; color: var(--muted); font-size: 13px; }}
    .metrics {{ display: flex; gap: 24px; flex-wrap: wrap; }}
    .metric {{ min-width: 82px; }}
    .metric strong {{ display: block; font-size: 22px; letter-spacing: -.03em; }}
    .metric span {{ color: var(--muted); font-size: 11px; }}
    .ranking {{ display: grid; gap: 13px; }}
    .source-row {{ display: grid; grid-template-columns: minmax(110px, 180px) 1fr 76px; align-items: center; gap: 14px; }}
    .source-name {{ overflow: hidden; font-size: 13px; font-weight: 650; text-overflow: ellipsis; white-space: nowrap; }}
    .track {{ height: 10px; overflow: hidden; border-radius: 99px; background: #eef0f5; }}
    .source-fill {{ height: 100%; min-width: 3px; border-radius: inherit; background: linear-gradient(90deg, #8871ef, #43c1d1); }}
    .source-value {{ text-align: right; font-variant-numeric: tabular-nums; font-size: 13px; font-weight: 750; }}
    .search-wrap {{ width: min(340px, 100%); }}
    .search-input {{ padding: 11px 14px; }}
    .table-wrap {{ overflow-x: auto; border: 1px solid var(--line); border-radius: 15px; }}
    table {{ width: 100%; border-collapse: collapse; min-width: 680px; }}
    th {{ padding: 12px 16px; background: #f7f8fb; color: var(--muted); text-align: left; font-size: 11px; letter-spacing: .04em; }}
    th:nth-child(2), td:nth-child(2) {{ width: 260px; }}
    th:last-child, td:last-child {{ width: 110px; text-align: right; }}
    td {{ padding: 14px 16px; border-top: 1px solid var(--line); vertical-align: middle; font-size: 13px; }}
    .cn-name {{ display: block; font-weight: 700; }}
    .en-name {{ display: block; margin-top: 4px; color: #8a91a0; font: 11px ui-monospace, SFMono-Regular, Menlo, monospace; }}
    .ctr-cell {{ position: relative; overflow: hidden; border-radius: 9px; background: #f1f2f7; }}
    .ctr-bar {{ position: absolute; inset: 0 auto 0 0; border-radius: inherit; background: linear-gradient(90deg, rgba(117,87,232,.28), rgba(35,183,201,.28)); }}
    .ctr-text {{ position: relative; z-index: 1; display: block; padding: 8px 10px; font-weight: 800; font-variant-numeric: tabular-nums; }}
    .missing {{ color: #9299a8; background: repeating-linear-gradient(135deg,#f6f7f9,#f6f7f9 6px,#eceef2 6px,#eceef2 12px); }}
    .empty {{ padding: 34px 18px; color: var(--muted); text-align: center; font-size: 13px; }}
    .footnote {{ margin: 18px 2px 0; color: #89909e; font-size: 11px; line-height: 1.7; }}
    .formula-note {{ margin: -8px 0 18px; color: #6f7686; font-size: 11px; line-height: 1.7; }}
    .formula-note strong {{ color: #4f5667; }}
    @media (max-width: 700px) {{
      .shell {{ width: min(100% - 24px, 1120px); padding: 34px 0 48px; }}
      .hero, .card-head {{ display: block; }}
      .date-control, .search-wrap {{ width: 100%; margin-top: 18px; }}
      .range-inputs {{ grid-template-columns: 1fr; gap: 7px; }}
      .range-separator {{ display: none; }}
      .card {{ padding: 18px; border-radius: 18px; }}
      .metrics {{ margin-top: 18px; gap: 18px; }}
      .source-row {{ grid-template-columns: 92px 1fr 58px; gap: 9px; }}
      h1 {{ font-size: 34px; }}
    }}
  </style>
</head>
<body>
  <main class="shell">
    <header class="hero">
      <div>
        <p class="eyebrow">CAVI ANALYTICS · DAILY</p>
        <h1>AI 所有埋点事件统计</h1>
        <p class="subtitle">查看 AI 埋点的用户来源点击表现与点击率分布，数据按选择日期区间累计。</p>
      </div>
      <div class="date-control">
        <label>统计区间</label>
        <div class="range-inputs">
          <input id="rangeStart" type="date" aria-label="开始日期">
          <span class="range-separator">至</span>
          <input id="rangeEnd" type="date" aria-label="结束日期">
        </div>
      </div>
    </header>
    <div class="notice"><span class="notice-dot"></span><span>统计口径：Total users 按日累计；不进行跨日用户去重。</span></div>

    <section class="card" aria-labelledby="sourceTitle">
      <div class="card-head">
        <div><h2 id="sourceTitle">用户来源 · 点击 UV</h2><p class="card-description">按 Content Group 汇总所选区间 click 事件，由高到低排列。</p></div>
        <div class="metrics"><div class="metric"><strong id="sourceTotal">0</strong><span>点击 UV 累计</span></div><div class="metric"><strong id="sourceCount">0</strong><span>来源数量</span></div></div>
      </div>
      <div id="sourceRanking" class="ranking"></div>
    </section>

    <section class="card" aria-labelledby="ctrTitle">
      <div class="card-head">
        <div><h2 id="ctrTitle">埋点点击率 · 由高到低</h2><p class="card-description">点击率 = click 的 Total users ÷ view_item 的 Total users。</p></div>
        <div class="search-wrap"><label for="elementSearch" style="position:absolute;left:-9999px">模糊搜索埋点名称</label><input id="elementSearch" class="search-input" type="search" placeholder="搜索中文或英文埋点名称…" autocomplete="off"></div>
      </div>
      <p class="formula-note"><strong>特殊点击率口径：</strong>
        caviaix_session_layer_close、caviaix_session_layer_input_box 使用 caviaix_session_layer 曝光 UV；
        caviaix_dislike_layer_option_btn、caviaix_like_layer_option_btn 使用 caviaix_likeorno_layer_option_btn 曝光 UV。
      </p>
      <div class="table-wrap">
        <table>
          <thead><tr><th>埋点名称</th><th>点击率</th><th>点击 UV</th></tr></thead>
          <tbody id="ctrTableBody"></tbody>
        </table>
      </div>
      <p id="resultNote" class="footnote"></p>
    </section>
  </main>

  <script id="dashboardData" type="application/json">{data_json}</script>
  <script>
    const payload = JSON.parse(document.getElementById('dashboardData').textContent)
    const rangeStart = document.getElementById('rangeStart')
    const rangeEnd = document.getElementById('rangeEnd')
    const sourceRanking = document.getElementById('sourceRanking')
    const sourceTotal = document.getElementById('sourceTotal')
    const sourceCount = document.getElementById('sourceCount')
    const elementSearch = document.getElementById('elementSearch')
    const ctrTableBody = document.getElementById('ctrTableBody')
    const resultNote = document.getElementById('resultNote')
    const denominatorOverrides = payload.ctr_denominator_overrides || {{}}
    const number = new Intl.NumberFormat('zh-CN')

    function inputDate(raw) {{
      return `${{raw.slice(0,4)}}-${{raw.slice(4,6)}}-${{raw.slice(6,8)}}`
    }}

    function keyDate(raw) {{ return raw.replaceAll('-', '') }}

    function selectedKeys() {{
      let start = keyDate(rangeStart.value) || payload.dates[0]
      let end = keyDate(rangeEnd.value) || payload.dates[payload.dates.length - 1]
      if (start > end) {{
        if (document.activeElement === rangeStart) {{ end = start; rangeEnd.value = inputDate(end) }}
        else {{ start = end; rangeStart.value = inputDate(start) }}
      }}
      return payload.dates.filter(date => date >= start && date <= end)
    }}

    function aggregateSelectedRange() {{
      const keys = selectedKeys()
      const sourceTotals = new Map()
      const elementTotals = new Map()
      keys.forEach(key => {{
        const day = payload.daily[key]
        ;(day.sources || []).forEach(item => sourceTotals.set(item.name, (sourceTotals.get(item.name) || 0) + item.click_uv))
        ;(day.elements || []).forEach(item => {{
          const current = elementTotals.get(item.element) || {{ element: item.element, name: item.name, click_uv: 0, view_uv: 0 }}
          current.click_uv += item.click_uv
          current.view_uv += item.view_uv
          elementTotals.set(item.element, current)
        }})
      }})
      const sources = [...sourceTotals].map(([name, click_uv]) => ({{name, click_uv}})).sort((a,b) => b.click_uv - a.click_uv || a.name.localeCompare(b.name))
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
      return {{keys, sources, elements}}
    }}

    function escapeHtml(value) {{
      return String(value).replace(/[&<>"']/g, char => ({{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}})[char])
    }}

    function renderSources(day) {{
      const sources = day.sources || []
      const total = sources.reduce((sum, item) => sum + item.click_uv, 0)
      const max = Math.max(...sources.map(item => item.click_uv), 1)
      sourceTotal.textContent = number.format(total)
      sourceCount.textContent = number.format(sources.length)
      sourceRanking.innerHTML = sources.length ? sources.map((item, index) => `
        <div class="source-row">
          <div class="source-name" title="${{escapeHtml(item.name)}}">${{index + 1}}. ${{escapeHtml(item.name)}}</div>
          <div class="track" aria-hidden="true"><div class="source-fill" style="width:${{Math.max(item.click_uv / max * 100, 1)}}%"></div></div>
          <div class="source-value">${{number.format(item.click_uv)}}</div>
        </div>`).join('') : '<div class="empty">该日期没有点击来源数据</div>'
    }}

    function renderElements(day) {{
      const query = elementSearch.value.trim().toLocaleLowerCase()
      const all = day.elements || []
      const filtered = all.filter(item => !query || item.name.toLocaleLowerCase().includes(query) || item.element.toLocaleLowerCase().includes(query))
      ctrTableBody.innerHTML = filtered.length ? filtered.map(item => {{
        const valid = Number.isFinite(item.ctr)
        const rateText = valid ? `${{(item.ctr * 100).toFixed(1)}}%` : '—'
        const width = valid ? Math.min(Math.max(item.ctr * 100, 1), 100) : 0
        const denominatorElement = item.denominator_element || item.element
        const title = valid
          ? `${{item.element}} 点击 UV ${{number.format(item.click_uv)}} ÷ ${{denominatorElement}} 曝光 UV ${{number.format(item.view_uv)}}`
          : `缺少 ${{denominatorElement}} 的 view_item 曝光数据`
        return `<tr>
          <td><span class="cn-name">${{escapeHtml(item.name)}}</span><span class="en-name">${{escapeHtml(item.element)}}</span></td>
          <td><div class="ctr-cell ${{valid ? '' : 'missing'}}" title="${{escapeHtml(title)}}"><span class="ctr-bar" style="width:${{width}}%"></span><span class="ctr-text">${{rateText}}</span></div></td>
          <td>${{number.format(item.click_uv)}}</td>
        </tr>`
      }}).join('') : '<tr><td colspan="3"><div class="empty">没有匹配的埋点</div></td></tr>'
      const missing = filtered.filter(item => !Number.isFinite(item.ctr)).length
      resultNote.textContent = `显示 ${{filtered.length}} / ${{all.length}} 个点击埋点${{missing ? `；其中 ${{missing}} 个缺少曝光分母` : ''}}。点击率排序使用未四舍五入的原始值。`
    }}

    function render() {{
      const summary = aggregateSelectedRange()
      renderSources(summary)
      renderElements(summary)
    }}

    rangeStart.min = inputDate(payload.dates[0]); rangeStart.max = inputDate(payload.dates[payload.dates.length - 1]); rangeStart.value = inputDate(payload.dates[0])
    rangeEnd.min = inputDate(payload.dates[0]); rangeEnd.max = inputDate(payload.dates[payload.dates.length - 1]); rangeEnd.value = inputDate(payload.dates[payload.dates.length - 1])
    rangeStart.addEventListener('change', render); rangeEnd.addEventListener('change', render)
    elementSearch.addEventListener('input', () => renderElements(aggregateSelectedRange()))
    render()
  </script>
</body>
</html>
"""


def build_payload(csv_path: Path, feishu_url: str) -> dict:
    rows = parse_cavi_csv_rows(csv_path)
    if not rows:
        raise ValueError("CSV 中没有可用的 click/view_item 数据")
    mapping = build_element_mapping(fetch_feishu_rows(feishu_url))
    daily = aggregate_daily(rows, mapping)
    elements = sorted({row["element"] for row in rows})
    mapped = sum(element in mapping for element in elements)
    return {
        "meta": {
            "title": "AI 所有埋点事件统计",
            "source_file": csv_path.name,
            "date_min": min(daily),
            "date_max": max(daily),
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "mapping_coverage": {"mapped": mapped, "total": len(elements)},
        },
        "dates": sorted(daily),
        "daily": daily,
        "ctr_denominator_overrides": CTR_DENOMINATOR_OVERRIDES,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--csv", required=True, type=Path)
    parser.add_argument("--feishu-url", required=True)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()

    payload = build_payload(args.csv, args.feishu_url)
    args.output.write_text(render_html(payload), encoding="utf-8")
    source_count = len({source["name"] for day in payload["daily"].values() for source in day["sources"]})
    element_count = len({item["element"] for day in payload["daily"].values() for item in day["elements"]})
    coverage = payload["meta"]["mapping_coverage"]
    print(
        f"generated={args.output.resolve()} dates={len(payload['dates'])} "
        f"sources={source_count} elements={element_count} mapping={coverage['mapped']}/{coverage['total']}"
    )


if __name__ == "__main__":
    main()
