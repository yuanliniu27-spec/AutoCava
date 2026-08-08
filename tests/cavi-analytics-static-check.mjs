import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const htmlPath = process.argv[2] ? path.resolve(process.argv[2]) : path.join(root, 'cavi-analytics.html')
const html = fs.readFileSync(htmlPath, 'utf8')

assert.match(html, /id="rangeStart"/)
assert.match(html, /id="rangeEnd"/)
assert.match(html, /id="sourceRanking"/)
assert.match(html, /id="elementSearch"/)
assert.match(html, /id="ctrTableBody"/)
assert.match(html, /id="dashboardData"/)
assert.match(html, /按日累计/)
assert.match(html, /AI 所有埋点事件统计/)
assert.match(html, /filter\(item => item\.click_uv > 0\)/)
assert.match(html, /ctr_denominator_overrides/)
assert.match(html, /denominatorElement = denominatorOverrides\[item\.element\] \|\| item\.element/)
assert.match(html, /caviaix_session_layer_close.*caviaix_session_layer/s)
assert.match(html, /caviaix_dislike_layer_option_btn.*caviaix_likeorno_layer_option_btn/s)
assert.match(html, /特殊点击率口径/)
assert.match(html, /http-equiv="Content-Security-Policy"/)
assert.match(html, /connect-src 'none'/)
assert.match(html, /@media\s*\(max-width:\s*700px\)/)
assert.doesNotMatch(html, /<script[^>]+src=/)
assert.doesNotMatch(html, /<link[^>]+stylesheet/)
assert.doesNotMatch(html, /analytics\.google\.com|kcn4tlh8cxcn|fetch\(|XMLHttpRequest|type="file"|<form|刷新数据|更新数据/)

console.log('cavi analytics static checks passed')
