/**
 * @fileoverview Generate metrics.json from coverage and benchmark data
 *
 * Run after:
 *   pnpm test:coverage
 *   pnpm test:bench:json
 *
 * Outputs: apps/docs/src/data/metrics.json
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { buildItemBenchmarks, extractName } from './lib/benchmarks.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const COVERAGE_PATH = resolve(ROOT, 'coverage/coverage-final.json')
const BENCHMARKS_PATH = resolve(ROOT, 'apps/docs/public/benchmarks.json')
const OUTPUT_PATH = resolve(ROOT, 'apps/docs/src/data/metrics.json')

function calculateCoverage (map) {
  const entries = Object.values(map)
  const total = entries.length
  const covered = entries.filter(v => v > 0).length
  const pct = total > 0 ? Math.round((covered / total) * 1000) / 10 : 0
  return { covered, total, pct }
}

function main () {
  const metrics = {}

  if (existsSync(COVERAGE_PATH)) {
    console.log('Reading coverage data...')
    const coverage = JSON.parse(readFileSync(COVERAGE_PATH, 'utf8'))

    for (const [filePath, data] of Object.entries(coverage)) {
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

      if (!metrics[name]?.coverage || statements.pct > metrics[name].coverage.statements) {
        metrics[name] = metrics[name] || {}

        const overall = functions.total === 0
          ? Math.round((statements.pct * 0.6 + branches.pct * 0.4) * 10) / 10
          : Math.round((statements.pct * 0.5 + functions.pct * 0.3 + branches.pct * 0.2) * 10) / 10

        metrics[name].coverage = {
          statements: statements.pct,
          functions: functions.total === 0 ? null : functions.pct,
          branches: branches.pct,
          overall,
        }
      }
    }
    console.log(`  Processed ${Object.keys(metrics).length} items with coverage`)
  } else {
    console.log('No coverage data found at', COVERAGE_PATH)
  }

  if (existsSync(BENCHMARKS_PATH)) {
    console.log('Reading benchmark data...')
    const benchmarks = JSON.parse(readFileSync(BENCHMARKS_PATH, 'utf8'))

    // Values are raw. Benchmarks come from one fixed workstation, so there is no
    // host factor to divide out; the fingerprint below is what says whether two
    // artifacts are comparable at all.
    for (const file of benchmarks.files || []) {
      const name = extractName(file.filepath)
      if (!name) continue

      metrics[name] = metrics[name] || {}
      metrics[name].benchmarks = buildItemBenchmarks(file)
    }

    // Underscore-prefixed so it cannot collide with a feature name, matching the
    // `_groups`/`_tier` convention one level down. Consumers key into this map by
    // feature name or skip entries without `.benchmarks._groups`, so it is inert
    // to the docs while keeping each artifact self-describing about how it was
    // measured — the provenance whose absence made PR #714 an hour of forensics.
    if (benchmarks.env) metrics._env = benchmarks.env

    console.log(`  Processed benchmark data for ${Object.keys(metrics).filter(k => metrics[k].benchmarks).length} items`)
    console.log(benchmarks.env
      ? `  Benchmarks measured on ${benchmarks.env.cpu ?? 'unknown cpu'} / node ${benchmarks.env.node ?? '?'}`
      : '  Benchmarks carry no `env` fingerprint (measured before it existed) — regenerate on the reference host to record one')
  } else {
    console.log('No benchmark data found at', BENCHMARKS_PATH)
  }

  const outputDir = dirname(OUTPUT_PATH)
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }

  writeFileSync(OUTPUT_PATH, JSON.stringify(metrics, null, 2))
  console.log(`\nWrote metrics to ${OUTPUT_PATH}`)
  console.log(`  Total items: ${Object.keys(metrics).filter(k => !k.startsWith('_')).length}`)
}

main()
