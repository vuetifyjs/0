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

const report = []
let failed = false

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
      page.on('pageerror', err => pageErrors.push(String(err)))
      page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text())
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
        const file = join(visualDir, `${route.slug}-${vp.name}.png`)
        await page.screenshot({ path: file, fullPage: true })
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
      ]
      if (appErrors.length > 0) {
        failed = true
        status = 'console_errors'
      }

      report.push({
        route: route.path,
        viewport: vp.name,
        status,
        errors: appErrors,
      })
      await page.close()
    }
  }
} finally {
  await browser.close()
}

const logPath = join(scratch, 'visual-errors.json')
writeFileSync(logPath, JSON.stringify(report, null, 2))
writeFileSync(
  join(scratch, 'visual-notes.md'),
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

console.log(JSON.stringify(report, null, 2))
if (failed) {
  throw new Error('visual capture failed — see visual-errors.json')
}
console.log('visual capture pass')
