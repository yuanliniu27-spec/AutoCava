import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const htmlPath = path.join(root, 'cavi-analytics.html')
const html = fs.readFileSync(htmlPath, 'utf8')

assert.match(html, /id="rangeStart"/)
assert.match(html, /id="rangeEnd"/)
assert.match(html, /id="sourceRanking"/)
assert.match(html, /id="elementSearch"/)
assert.match(html, /id="ctrTableBody"/)
assert.match(html, /id="dashboardData"/)
assert.match(html, /按日累计/)
assert.match(html, /AI 所有埋点事件统计/)
assert.match(html, /@media\s*\(max-width:\s*700px\)/)
assert.doesNotMatch(html, /<script[^>]+src=/)
assert.doesNotMatch(html, /<link[^>]+stylesheet/)

console.log('cavi analytics static checks passed')
