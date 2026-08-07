import tempfile
import unittest
from pathlib import Path

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
            {"event": "click", "element": "a", "date": "20260805", "group": "销量榜", "uv": 10},
            {"event": "view_item", "element": "a", "date": "20260805", "group": "销量榜", "uv": 100},
            {"event": "click", "element": "a", "date": "20260806", "group": "销量榜", "uv": 20},
            {"event": "view_item", "element": "a", "date": "20260806", "group": "销量榜", "uv": 200},
            {"event": "click", "element": "a", "date": "20260807", "group": "销量榜", "uv": 999},
            {"event": "view_item", "element": "a", "date": "20260807", "group": "销量榜", "uv": 999},
        ]
        daily = aggregate_daily(rows, {"a": "测试按钮点击"})
        ranged = aggregate_range(daily, "20260805", "20260806")
        self.assertEqual(ranged["sources"], [{"name": "销量榜", "click_uv": 30}])
        self.assertEqual(ranged["elements"][0]["click_uv"], 30)
        self.assertEqual(ranged["elements"][0]["view_uv"], 300)
        self.assertEqual(ranged["elements"][0]["ctr"], 0.1)


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
