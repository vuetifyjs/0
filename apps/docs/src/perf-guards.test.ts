/**
 * Regression tests to prevent performance regressions in the docs app.
 *
 * These tests scan source files for import patterns that previously caused
 * Lighthouse performance issues (eager loading of large deps, duplicate
 * pre-bundles, etc).
 */
import { existsSync, globSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

const SRC = resolve(__dirname)
const DOCS_ROOT = resolve(__dirname, '..')

describe('perf guards', () => {
  describe('posthog-js must be lazy-loaded', () => {
    it('should not have a static import of posthog-js in plugins', () => {
      const files = globSync('plugins/**/*.ts', { cwd: SRC })

      for (const file of files) {
        const content = readFileSync(resolve(SRC, file), 'utf8')
        const staticImport = /^import\s+.*from\s+['"]posthog-js['"]/m.test(content)
        expect(staticImport, `${file} has a static import of posthog-js — use dynamic import() instead`).toBe(false)
      }
    })
  })

  describe('metrics.json must be lazy-loaded', () => {
    it('should not have a static import of metrics.json in components', () => {
      const files = globSync('components/**/*.{vue,ts}', { cwd: SRC })

      for (const file of files) {
        const content = readFileSync(resolve(SRC, file), 'utf8')
        const staticImport = /^import\s+.*from\s+['"]@\/data\/metrics\.json['"]/m.test(content)
        expect(staticImport, `${file} statically imports metrics.json — use dynamic import() instead`).toBe(false)
      }
    })
  })

  describe('fflate must use a single import strategy', () => {
    it('should not have a static import of fflate in composables', () => {
      const files = globSync('composables/**/*.ts', { cwd: SRC })

      for (const file of files) {
        const content = readFileSync(resolve(SRC, file), 'utf8')
        const staticImport = /^import\s+\{[^}]*\}\s+from\s+['"]fflate['"]/m.test(content)
        expect(staticImport, `${file} statically imports fflate — use loadFflate() from usePlayground instead`).toBe(false)
      }
    })
  })

  describe('robots.txt', () => {
    it('should have a manual robots.txt in public/', () => {
      const robotsPath = resolve(DOCS_ROOT, 'public/robots.txt')
      expect(existsSync(robotsPath), 'public/robots.txt must exist').toBe(true)

      const content = readFileSync(robotsPath, 'utf8')
      expect(content).toContain('User-agent:')
      expect(content).toContain('Sitemap:')
    })

    it('should disable auto-generated robots.txt in vite config', () => {
      const configPath = resolve(DOCS_ROOT, 'vite.config.ts')
      const content = readFileSync(configPath, 'utf8')
      expect(content).toContain('generateRobotsTxt: false')
    })
  })
})
