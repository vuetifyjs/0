/**
 * Headless visual capture for Emerald showcase routes.
 * Uses Playwright + system Chrome. Writes PNG + error log under SCRATCH.
 *
 * SCRATCH=/tmp/grok-goal-... node packages/emerald/scripts/visual-capture.mjs
 */
import { chromium } from 'playwright'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const base = process.env.EMERALD_BASE || 'http://127.0.0.1:5174'
const scratch = process.env.SCRATCH || join(process.cwd(), '.emerald-visual')
const visualDir = join(scratch, 'visual')
mkdirSync(visualDir, { recursive: true })

const routes = [
  { path: '/emerald', slug: 'dashboard' },
  { path: '/emerald/sink', slug: 'sink' },
  { path: '/emerald/contact', slug: 'contact' },
  { path: '/emerald/settings', slug: 'settings' },
  { path: '/emerald/pricing', slug: 'pricing' },
  { path: '/emerald/features', slug: 'features' },
]

const viewports = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'desktop', width: 1280, height: 800 },
]

// Vue/Router/v0 emit these at console type 'warning', not 'error' — a route that
// matches nothing still returns the Vite SPA fallback with HTTP 200.
const warnPattern = /\[Vue warn\]|\[Vue Router warn\]|\[v0|No match found for location/

// Floor for "something actually rendered" — every showcase route is a full screen.
const minElements = 10
const minText = 20

const logPath = join(scratch, 'visual-errors.json')
const notesPath = join(scratch, 'visual-notes.md')

const report = []
let failed = false

/** Persist after every page so a mid-run crash still leaves the results so far. */
function flush () {
  writeFileSync(logPath, JSON.stringify(report, null, 2))
  writeFileSync(
    notesPath,
    [
      '# Emerald visual capture notes',
      '',
      '- Charts on Dashboard are intentional fillers (no chart lib).',
      '- Tables/Chat product screens deferred (no EmTable / chat primitive).',
      '- Mobile shell: overlay drawer + FAB; desktop: fixed rail.',
      '',
      `Captured ${report.length} shots under visual/.`,
      failed ? 'RESULT: FAIL (see visual-errors.json)' : 'RESULT: PASS',
      '',
    ].join('\n'),
  )
}

const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
})

try {
  for (const route of routes) {
    for (const vp of viewports) {
      const page = await browser.newPage({
        viewport: { width: vp.width, height: vp.height },
      })
      const pageErrors = []
      const consoleErrors = []
      const consoleWarnings = []
      page.on('pageerror', err => pageErrors.push(String(err)))
      page.on('console', msg => {
        const type = msg.type()
        if (type === 'error') consoleErrors.push(msg.text())
        else if (type === 'warning' && warnPattern.test(msg.text())) consoleWarnings.push(msg.text())
      })

      const url = `${base}${route.path}`
      let status = 'ok'
      try {
        const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 })
        if (!res || !res.ok()) {
          status = `http_${res?.status() ?? 'none'}`
          failed = true
        }
        await page.waitForTimeout(400)

        const metrics = await page.evaluate(() => {
          const doc = document.documentElement
          const body = document.body
          const app = document.querySelector('#app')
          const scrollWidth = Math.max(doc.scrollWidth, body?.scrollWidth ?? 0)
          return {
            scrollWidth,
            clientWidth: doc.clientWidth,
            innerWidth: window.innerWidth,
            elements: app ? app.querySelectorAll('*').length : 0,
            // Collapse whitespace so inter-element template padding can't inflate the count
            text: app ? (app.textContent ?? '').replaceAll(/\s+/g, ' ').trim().length : 0,
          }
        })

        if (metrics.scrollWidth > metrics.innerWidth + 1) {
          failed = true
          status = `horizontal_overflow scrollWidth=${metrics.scrollWidth} innerWidth=${metrics.innerWidth}`
        }

        if (metrics.elements < minElements || metrics.text < minText) {
          failed = true
          if (status === 'ok') status = `blank_render elements=${metrics.elements} text=${metrics.text}`
        }

        // Viewport clip — fullPage inflates width when content overflows
        const file = join(visualDir, `${route.slug}-${vp.name}.png`)
        await page.screenshot({ path: file, fullPage: false })
      } catch (error) {
        status = `nav_error: ${error}`
        failed = true
      }

      const appErrors = [
        ...pageErrors,
        ...consoleErrors.filter(t =>
          !t.includes('favicon')
          && !t.includes('Download the Vue Devtools'),
        ),
        ...consoleWarnings,
      ]
      if (appErrors.length > 0) {
        failed = true
        if (status === 'ok') status = 'console_errors'
      }

      report.push({
        route: route.path,
        viewport: vp.name,
        status,
        errors: appErrors,
      })
      flush()
      await page.close()
    }
  }
} catch (error) {
  failed = true
  report.push({
    route: 'n/a',
    viewport: 'n/a',
    status: `fatal: ${error}`,
    errors: [String(error)],
  })
} finally {
  await browser.close().catch(() => {})
  flush()
}

console.log(JSON.stringify(report, null, 2))
if (failed) {
  throw new Error('visual capture failed — see visual-errors.json')
}
console.log('visual capture pass')
