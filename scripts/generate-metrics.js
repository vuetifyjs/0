/**
 * @fileoverview Generate metrics.json from coverage and benchmark data
 *
 * Run after:
 *   pnpm test:coverage
 *   pnpm test:bench --outputJson coverage/benchmarks.json
 *
 * Outputs: apps/docs/src/data/metrics.json
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const COVERAGE_PATH = resolve(ROOT, 'coverage/coverage-final.json')
const BENCHMARKS_PATH = resolve(ROOT, 'apps/docs/src/data/benchmarks.json')
const OUTPUT_PATH = resolve(ROOT, 'apps/docs/src/data/metrics.json')

/**
 * Calculate coverage percentage from istanbul coverage data
 * @param {Record<string, number>} map - Coverage map (s, f, or b)
 * @returns {{ covered: number, total: number, pct: number }}
 */
function calculateCoverage (map) {
  const entries = Object.values(map)
  const total = entries.length
  const covered = entries.filter(v => v > 0).length
  const pct = total > 0 ? Math.round((covered / total) * 1000) / 10 : 0
  return { covered, total, pct }
}

/**
 * Extract composable/component name from file path
 * @param {string} filePath
 * @returns {string | null}
 */
function extractName (filePath) {
  // Match composables: /composables/useRegistry/index.ts or index.bench.ts or index.test.ts
  const composableMatch = filePath.match(/\/composables\/([^/]+)\/index\.(ts|bench\.ts|test\.ts)$/)
  if (composableMatch) return composableMatch[1]

  // Match components: /components/Atom/Atom.vue or /components/Selection/SelectionRoot.vue
  const componentMatch = filePath.match(/\/components\/([^/]+)\//)
  if (componentMatch) return componentMatch[1]

  return null
}

/**
 * Format ops/sec for display
 * @param {number} hz - Operations per second
 * @returns {string}
 */
function formatHz (hz) {
  if (hz >= 1_000_000) return `${(hz / 1_000_000).toFixed(1)}M ops/s`
  if (hz >= 1000) return `${(hz / 1000).toFixed(1)}k ops/s`
  return `${Math.round(hz)} ops/s`
}

/**
 * Format time for display
 * @param {number} ms - Time in milliseconds
 * @returns {string}
 */
function formatTime (ms) {
  if (ms < 0.001) return `${(ms * 1_000_000).toFixed(0)}ns`
  if (ms < 1) return `${(ms * 1000).toFixed(1)}μs`
  return `${ms.toFixed(2)}ms`
}

/**
 * Determine performance tier based on mean execution time
 * @param {number} ms - Mean time in milliseconds
 * @returns {'blazing' | 'fast' | 'good' | null}
 */
function getTier (ms) {
  if (ms < 0.001) return 'blazing' // < 1μs
  if (ms < 0.1) return 'fast' // < 100μs
  if (ms < 1) return 'good' // < 1ms
  return null
}

function main () {
  /** @type {Record<string, { coverage?: object, benchmarks?: object }>} */
  const metrics = {}

  // Process coverage data
  if (existsSync(COVERAGE_PATH)) {
    console.log('Reading coverage data...')
    const coverage = JSON.parse(readFileSync(COVERAGE_PATH, 'utf8'))

    for (const [filePath, data] of Object.entries(coverage)) {
      // Skip test and bench files
      if (filePath.includes('.test.') || filePath.includes('.bench.')) continue

      const name = extractName(filePath)
      if (!name) continue

      const statements = calculateCoverage(data.s)
      const functions = calculateCoverage(data.f)
      const branches = calculateCoverage(data.b
        ? Object.fromEntries(
            Object.entries(data.b).map(([k, v]) => [k, v.reduce((a, b) => a + b, 0)]),
          )
        : {})

      // Use highest coverage file if multiple (e.g., index.ts vs helpers.ts)
      if (!metrics[name]?.coverage || statements.pct > metrics[name].coverage.statements) {
        metrics[name] = metrics[name] || {}
        metrics[name].coverage = {
          statements: statements.pct,
          functions: functions.pct,
          branches: branches.pct,
          // Overall score (weighted average)
          overall: Math.round((statements.pct * 0.5 + functions.pct * 0.3 + branches.pct * 0.2) * 10) / 10,
        }
      }
    }
    console.log(`  Processed ${Object.keys(metrics).length} items with coverage`)
  } else {
    console.log('No coverage data found at', COVERAGE_PATH)
  }

  // Process benchmark data
  if (existsSync(BENCHMARKS_PATH)) {
    console.log('Reading benchmark data...')
    const benchmarks = JSON.parse(readFileSync(BENCHMARKS_PATH, 'utf8'))

    for (const file of benchmarks.files || []) {
      const name = extractName(file.filepath)
      if (!name) continue

      metrics[name] = metrics[name] || {}
      metrics[name].benchmarks = {}

      for (const group of file.groups || []) {
        // Find the fastest benchmark in each group (rank 1)
        const fastest = group.benchmarks?.find(b => b.rank === 1)
        if (!fastest) continue

        // Use group name as key (e.g., "registration", "lookup operations")
        const groupName = group.fullName.split(' > ').pop() || 'default'

        metrics[name].benchmarks[groupName] = {
          name: fastest.name,
          hz: Math.round(fastest.hz),
          hzLabel: formatHz(fastest.hz),
          mean: fastest.mean,
          meanLabel: formatTime(fastest.mean),
          rme: Math.round(fastest.rme * 10) / 10,
        }
      }

      // Add summary: fastest overall operation
      const allBenchmarks = (file.groups || []).flatMap(g => g.benchmarks || [])
      const fastestOverall = allBenchmarks.reduce((a, b) => (a?.hz || 0) > (b?.hz || 0) ? a : b, null)
      if (fastestOverall) {
        metrics[name].benchmarks._fastest = {
          name: fastestOverall.name,
          hz: Math.round(fastestOverall.hz),
          hzLabel: formatHz(fastestOverall.hz),
          mean: fastestOverall.mean,
          meanLabel: formatTime(fastestOverall.mean),
          tier: getTier(fastestOverall.mean),
        }
      }
    }
    console.log(`  Processed benchmark data for ${Object.keys(metrics).filter(k => metrics[k].benchmarks).length} items`)
  } else {
    console.log('No benchmark data found at', BENCHMARKS_PATH)
  }

  // Write output
  const outputDir = dirname(OUTPUT_PATH)
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }

  writeFileSync(OUTPUT_PATH, JSON.stringify(metrics, null, 2))
  console.log(`\nWrote metrics to ${OUTPUT_PATH}`)
  console.log(`  Total items: ${Object.keys(metrics).length}`)
}

main()
