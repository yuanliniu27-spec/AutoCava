import tempfile
import unittest
import inspect
from copy import deepcopy
from pathlib import Path
from unittest.mock import patch

import tools.build_cavi_analytics as builder
from tools.build_cavi_analytics import (
    aggregate_range,
    aggregate_daily,
    build_element_mapping,
    parse_cavi_csv_rows,
)


class ParserTests(unittest.TestCase):
    def test_parse_skips_report_preamble_and_reads_numeric_uv(self):
        content = """# report,,,,,
,,,,,
Event name,element_name,Date,Content Group,Total users,
click,button_a,20260806,销量榜,"1,200",
view_item,button_a,20260806,销量榜,2400,
other,ignored,20260806,销量榜,999,
"""
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "source.csv"
            path.write_text(content, encoding="utf-8")
            rows = parse_cavi_csv_rows(path)

        self.assertEqual(len(rows), 2)
        self.assertEqual(rows[0]["uv"], 1200)
        self.assertEqual(rows[0]["group"], "销量榜")

    def test_aggregate_daily_groups_and_ctr(self):
        rows = [
            {"event": "click", "element": "a", "date": "20260806", "group": "销量榜", "uv": 20},
            {"event": "click", "element": "a", "date": "20260806", "group": "销量榜", "uv": 5},
            {"event": "view_item", "element": "a", "date": "20260806", "group": "销量榜", "uv": 100},
            {"event": "click", "element": "b", "date": "20260806", "group": "other", "uv": 8},
        ]
        daily = aggregate_daily(rows, {"a": "测试按钮点击", "b": "无曝光按钮"})

        self.assertEqual(
            daily["20260806"]["sources"],
            [{"name": "销量榜", "click_uv": 25}, {"name": "other", "click_uv": 8}],
        )
        self.assertEqual(daily["20260806"]["elements"][0]["ctr"], 0.25)
        self.assertIsNone(daily["20260806"]["elements"][1]["ctr"])

    def test_aggregate_range_sums_selected_dates_only(self):
        rows = [
            {"event": "view_item", "element": "a", "date": "20260805", "group": "销量榜", "uv": 100},
            {"event": "click", "element": "a", "date": "20260806", "group": "销量榜", "uv": 20},
            {"event": "view_item", "element": "a", "date": "20260806", "group": "销量榜", "uv": 200},
            {"event": "click", "element": "a", "date": "20260807", "group": "销量榜", "uv": 999},
            {"event": "view_item", "element": "a", "date": "20260807", "group": "销量榜", "uv": 999},
            {"event": "view_item", "element": "b", "date": "20260805", "group": "销量榜", "uv": 50},
        ]
        daily = aggregate_daily(rows, {"a": "测试按钮点击"})
        ranged = aggregate_range(daily, "20260805", "20260806")
        self.assertEqual(ranged["sources"], [{"name": "销量榜", "click_uv": 20}])
        self.assertEqual(ranged["elements"][0]["click_uv"], 20)
        self.assertEqual(ranged["elements"][0]["view_uv"], 300)
        self.assertAlmostEqual(ranged["elements"][0]["ctr"], 20 / 300)
        self.assertEqual(len(ranged["elements"]), 1)

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

    def test_incremental_merge_replaces_target_date_and_preserves_history(self):
        existing = {
            "meta": {"title": "AI 所有埋点事件统计"},
            "dates": ["20260805", "20260806"],
            "daily": {
                "20260805": {
                    "sources": [{"name": "old-source", "click_uv": 8}],
                    "elements": [
                        {
                            "element": "old_element",
                            "name": "旧埋点",
                            "click_uv": 8,
                            "view_uv": 80,
                            "ctr": 0.1,
                        }
                    ],
                },
                "20260806": {
                    "sources": [{"name": "stale-source", "click_uv": 999}],
                    "elements": [
                        {
                            "element": "button_a",
                            "name": "旧按钮",
                            "click_uv": 999,
                            "view_uv": 999,
                            "ctr": 1.0,
                        }
                    ],
                },
            },
            "ctr_denominator_overrides": {},
        }
        historical_day = deepcopy(existing["daily"]["20260805"])
        rows = [
            {"event": "click", "element": "button_a", "date": "20260806", "group": "new-source", "uv": 20},
            {"event": "view_item", "element": "button_a", "date": "20260806", "group": "new-source", "uv": 200},
            {"event": "view_item", "element": "view_only", "date": "20260806", "group": "new-source", "uv": 50},
        ]
        merge = getattr(builder, "merge_incremental_payload", None)
        self.assertIsNotNone(merge, "incremental merge helper is missing")

        merged = merge(existing, rows, {"button_a": "新按钮", "view_only": "纯曝光"}, "yesterday.csv")

        self.assertEqual(merged["dates"], ["20260805", "20260806"])
        self.assertEqual(merged["daily"]["20260805"], historical_day)
        self.assertEqual(merged["daily"]["20260806"]["sources"], [{"name": "new-source", "click_uv": 20}])
        elements = {item["element"]: item for item in merged["daily"]["20260806"]["elements"]}
        self.assertEqual(elements["button_a"]["click_uv"], 20)
        self.assertEqual(elements["button_a"]["view_uv"], 200)
        self.assertEqual(elements["view_only"]["click_uv"], 0)
        self.assertEqual(elements["view_only"]["view_uv"], 50)
        self.assertEqual(merged["meta"]["target_date"], "20260806")
        self.assertEqual(merged["meta"]["merge_action"], "replaced")

    def test_load_dashboard_payload_reads_embedded_json(self):
        load_payload = getattr(builder, "load_dashboard_payload", None)
        self.assertIsNotNone(load_payload, "dashboard payload loader is missing")
        document = """<!doctype html><script id="dashboardData" type="application/json">{"dates":["20260806"],"daily":{"20260806":{}}}</script>"""
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "dashboard.html"
            path.write_text(document, encoding="utf-8")
            payload = load_payload(path)

        self.assertEqual(payload["dates"], ["20260806"])
        self.assertIn("20260806", payload["daily"])

    def test_build_payload_merges_csv_into_existing_dashboard(self):
        self.assertIn(
            "existing_html",
            inspect.signature(builder.build_payload).parameters,
            "build_payload does not accept an existing dashboard",
        )
        existing = {
            "meta": {"title": "AI 所有埋点事件统计"},
            "dates": ["20260805"],
            "daily": {
                "20260805": {
                    "sources": [{"name": "历史来源", "click_uv": 7}],
                    "elements": [],
                }
            },
            "ctr_denominator_overrides": {},
        }
        source = """Event name,element_name,Date,Content Group,Total users
click,button_a,20260806,昨日来源,12
view_item,button_a,20260806,昨日来源,120
"""
        mapping_rows = [["页面", "按钮点击", "click", "", "", "element_name=button_a"]]
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            csv_path = root / "yesterday.csv"
            html_path = root / "dashboard.html"
            csv_path.write_text(source, encoding="utf-8")
            html_path.write_text(
                f'<script id="dashboardData" type="application/json">{builder._safe_json(existing)}</script>',
                encoding="utf-8",
            )
            with patch.object(builder, "fetch_feishu_rows", return_value=mapping_rows):
                payload = builder.build_payload(csv_path, "https://example.test", existing_html=html_path)

        self.assertEqual(payload["dates"], ["20260805", "20260806"])
        self.assertEqual(payload["daily"]["20260805"], existing["daily"]["20260805"])
        self.assertEqual(payload["daily"]["20260806"]["sources"][0]["click_uv"], 12)

    def test_incremental_merge_rejects_multiple_dates(self):
        existing = {
            "meta": {},
            "dates": ["20260805"],
            "daily": {"20260805": {"sources": [], "elements": []}},
        }
        rows = [
            {"event": "click", "element": "a", "date": "20260806", "group": "x", "uv": 1},
            {"event": "click", "element": "a", "date": "20260807", "group": "x", "uv": 1},
        ]
        with self.assertRaisesRegex(ValueError, "只能包含一个有效日期"):
            builder.merge_incremental_payload(existing, rows, {}, "bad.csv")


class MappingTests(unittest.TestCase):
    def test_mapping_prefers_click_name(self):
        rows = [
            ["页面", "卡片曝光", "view_item", "", "", "element_name=card"],
            ["页面", "卡片点击", "click", "", "", "element_name=card"],
        ]
        self.assertEqual(build_element_mapping(rows)["card"], "卡片点击")

    def test_mapping_normalizes_renamed_element(self):
        rows = [
            ["页面", "AI入口模块卡片曝光", "view_item", "", "", "element_name=cavaiix_entry_module_card 修改名称为：caviaix_entry_module_card"],
            ["页面", "AI入口模块卡片点击", "click", "", "", "element_name=cavaiix_entry_module_card 修改名称为：caviaix_entry_module_card"],
        ]
        mapping = build_element_mapping(rows)
        self.assertEqual(mapping["caviaix_entry_module_card"], "AI入口模块卡片点击")


if __name__ == "__main__":
    unittest.main()
