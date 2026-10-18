/**
 * live.js — the bridge that puts the knobs' values into somebody else's app.
 * It is browser code, so the assertions are about its contract: it parses, it
 * only listens to this tool's origins, it speaks the two message names the
 * page sends, and the page never writes the one string that would end its own
 * inline module.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const src = readFileSync('live.js', 'utf8')

test('the bridge parses and is inert outside a frame', () => {
  assert.doesNotThrow(() => new Function(src))
  assert.match(src, /window\.parent === window\) return/)
})

test('only the tool\'s own origins may theme the page', () => {
  const m = src.match(/var ALLOW = (\/.+\/)\n/)
  assert.ok(m, 'ALLOW regex not found')
  const allow = new Function('return ' + m[1])()
  for (const ok of ['https://uicockpit.com', 'https://www.uicockpit.com', 'http://localhost:5174', 'http://127.0.0.1:8765', 'https://localhost']) {
    assert.ok(allow.test(ok), `${ok} should be allowed`)
  }
  for (const no of ['https://evil.example', 'http://uicockpit.com', 'https://uicockpit.com.evil.example', 'https://notlocalhost:3000']) {
    assert.ok(!allow.test(no), `${no} should be refused`)
  }
})

test('the two message names match what the page sends and expects', () => {
  const page = readFileSync('page.template.html', 'utf8')
  for (const name of ['uicockpit:theme', 'uicockpit:ready']) {
    assert.ok(src.includes(name) && page.includes(name), `${name} missing on one side`)
  }
  /* the snippet the page shows is assembled; a literal closing tag inside
     the inline module would end the module where it stands */
  const drawApp = page.slice(page.indexOf('function drawApp'), page.indexOf('function appStatus'))
  assert.ok(!drawApp.includes('</' + 'script>'), 'drawApp writes a literal closing tag')
})

test('every kit the bridge can detect is one the page knows', () => {
  const ids = [...src.matchAll(/return '([a-z]+)'/g)].map((m) => m[1])
  const known = ['tailwind', 'daisyui', 'shadcn', 'bootstrap', 'material', 'radix', 'mantine', 'antd', 'openprops']
  assert.deepEqual([...new Set(ids)].sort(), known.sort())
})
