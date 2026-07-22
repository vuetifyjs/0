/**
 * @fileoverview Compare canary benches in two benchmarks.json files.
 * Prints a markdown report for metrics-regen PR bodies.
 *
 *   node scripts/report-benchmark-delta.ts --prev path --next path [--fail-above 25]
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  CANARY_NOISE_PCT,
  type BenchJson,
  compareCanaries,
  formatDeltaReport,
} from './lib/bench-stable.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

function parseArgs (argv: string[]) {
  let prev: string | null = null
  let next: string | null = null
  let failAbove: number | null = null
  let out: string | null = null
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    switch (a) {
      case '--prev': {
        prev = resolve(ROOT, argv[++i]!)
        break
      }
      case '--next': {
        next = resolve(ROOT, argv[++i]!)
        break
      }
      case '--fail-above': {
        failAbove = Number(argv[++i])
        break
      }
      case '--out': {
        out = resolve(ROOT, argv[++i]!)
        break
      }
    }
  }
  if (!next) throw new Error('--next is required')
  return { prev, next, failAbove, out }
}

function main (): void {
  const { prev, next, failAbove, out } = parseArgs(process.argv.slice(2))
  const nextJson = JSON.parse(readFileSync(next, 'utf8')) as BenchJson
  const prevJson = prev
    ? JSON.parse(readFileSync(prev, 'utf8')) as BenchJson
    : null

  const rows = compareCanaries(prevJson, nextJson)
  const report = formatDeltaReport(rows, CANARY_NOISE_PCT)
  console.log(report)

  if (out) writeFileSync(out, `${report}\n`)

  if (failAbove != null) {
    const bad = rows.filter(r => r.pct != null && Math.abs(r.pct) > failAbove)
    if (bad.length > 0) {
      console.error(`\n[report-benchmark-delta] ${bad.length} canary(ies) exceeded ±${failAbove}%`)
      process.exitCode = 1
    }
  }
}

main()
