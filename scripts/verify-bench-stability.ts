/**
 * @fileoverview Prove the benchmark apparatus is trustworthy, by measuring
 * identical code more than once and checking the answers agree.
 *
 * This exists because "the numbers are reliable now" is a claim, and a claim is
 * not worth much when the previous apparatus was confidently wrong. Identical
 * code benched twice should look identical; how close it actually comes is a
 * measurable property of the setup, not a matter of opinion. Run this whenever
 * something about the measuring environment changes — new machine, new Node,
 * kernel upgrade, a change to the bench harness itself — and it will say
 * whether the setup still earns the trust the docs place in it.
 *
 * Usage:
 *   node scripts/verify-bench-stability.ts --runs 3
 *     Measure the suite N times back-to-back and compare. Slow and the real
 *     test, because it exercises the whole path.
 *
 *   node scripts/verify-bench-stability.ts --runs 3 --merge 1
 *     Faster and much noisier: each sample is a single pass rather than the
 *     median-of-3 the pipeline actually ships. Bands below do not apply.
 *
 *   node scripts/verify-bench-stability.ts --from a.json b.json c.json
 *     Compare artifacts that already exist. Fast, and useful for re-checking a
 *     past decision without paying for new measurements.
 *
 * Thresholds are set from measured behaviour on the reference host, not from
 * taste — see THRESHOLDS below.
 */

import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { normalizeFilepath, type BenchJson } from './lib/bench-stable.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

/**
 * Pass/fail bands, in percent.
 *
 * Calibrated against what the pipeline actually publishes — median-of-3
 * artifacts, which is why `--merge` defaults to 3. Measured across four such
 * artifacts of identical code on the idle reference workstation: per-feature
 * spread 2.16% median / 4.96% worst, per-bench 3.90% median / 14.60% at p95.
 * The limits sit at roughly 1.4-2x the observed worst case, so ordinary
 * variation passes and a genuine change in measurement conditions fails.
 *
 * The merge level matters more than it looks: repeated passes are the only
 * lever that measurably reduces error here, far more than any normalization
 * scheme. Single-pass samples run ~6% per-bench median against the ~3.9% of a
 * median-of-3, so comparing single passes against these bands fails on healthy
 * hardware — an earlier version of this script did exactly that.
 */
const THRESHOLDS = {
  featureMedian: 5,
  featureMax: 10,
  benchMedian: 6,
  benchP95: 20,
}

interface Sample {
  label: string
  /** hz by "<file>::<bench>", excluding anything that is apparatus rather than result. */
  benches: Record<string, number>
}

function parseArgs (argv: string[]): { runs: number, merge: number, from: string[] } {
  let runs = 0
  let merge = 3
  const from: string[] = []
  for (let i = 0; i < argv.length; i++) {
    switch (argv[i]) {
      case '--runs': {
        runs = Number(argv[++i])
        if (!Number.isFinite(runs) || runs < 2) throw new Error('--runs must be >= 2 to compare anything')
        break
      }
      case '--merge': {
        merge = Number(argv[++i])
        if (!Number.isFinite(merge) || merge < 1) throw new Error('--merge must be >= 1')
        break
      }
      case '--from': {
        while (i + 1 < argv.length && !argv[i + 1]!.startsWith('--')) from.push(resolve(argv[++i]!))
        break
      }
    }
  }
  if (runs === 0 && from.length === 0) runs = 2
  if (from.length === 1) throw new Error('--from needs at least two artifacts to compare')
  return { runs, merge, from }
}

function read (path: string, label: string): Sample {
  const json = JSON.parse(readFileSync(path, 'utf8')) as BenchJson
  const benches: Record<string, number> = {}
  for (const file of json.files ?? []) {
    const filepath = normalizeFilepath(file.filepath)
    for (const group of file.groups ?? []) {
      for (const bench of group.benchmarks ?? []) {
        if (typeof bench.hz === 'number' && bench.hz > 0) benches[`${filepath}::${bench.name}`] = bench.hz
      }
    }
  }
  return { label, benches }
}

function measure (count: number, merge: number): Sample[] {
  const dir = mkdtempSync(resolve(tmpdir(), 'v0-bench-verify-'))
  const samples: Sample[] = []
  try {
    for (let i = 0; i < count; i++) {
      const out = resolve(dir, `run-${i + 1}.json`)
      console.log(`[verify] measuring ${i + 1}/${count} (median of ${merge}) — this takes a while by design`)
      execFileSync('node', [resolve(ROOT, 'scripts/run-bench-stable.ts'), '--runs', String(merge), '--out', out], {
        cwd: ROOT,
        stdio: 'inherit',
        env: { ...process.env, V0_BENCH_TARGET: process.env.V0_BENCH_TARGET ?? 'dist' },
      })
      if (!existsSync(out)) throw new Error(`[verify] run ${i + 1} produced no artifact`)
      samples.push(read(out, `run-${i + 1}`))
    }
    return samples
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

function gmean (values: number[]): number {
  return Math.exp(values.reduce((sum, v) => sum + Math.log(v), 0) / values.length)
}

function quantile (values: number[], q: number): number {
  const sorted = [...values].toSorted((a, b) => a - b)
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * q))] ?? Number.NaN
}

/** Spread of a set of measurements of the same thing, as a percentage. */
function spread (values: number[]): number {
  return (Math.max(...values) / Math.min(...values) - 1) * 100
}

function main (): void {
  const { runs, merge, from } = parseArgs(process.argv.slice(2))
  const samples = from.length > 0
    ? from.map((path, index) => read(path, `artifact-${index + 1}`))
    : measure(runs, merge)
  if (from.length === 0 && merge !== 3) {
    console.warn(`[verify] --merge ${merge} does not match the shipping pipeline's median-of-3; the bands below are calibrated for 3 and will misjudge this run.`)
  }

  // Only benches present in every sample can be compared at all.
  const keys = Object.keys(samples[0]!.benches).filter(key => samples.every(s => s.benches[key] !== undefined))
  if (keys.length === 0) throw new Error('[verify] samples share no benchmarks — are these the same suite?')

  const features = [...new Set(keys.map(key => key.split('::')[0]!))]

  const benchSpreads = keys.map(key => spread(samples.map(s => s.benches[key]!)))
  const featureSpreads = features.map(feature => {
    const owned = keys.filter(key => key.startsWith(`${feature}::`))
    return spread(samples.map(s => gmean(owned.map(key => s.benches[key]!))))
  })

  const measured = {
    featureMedian: quantile(featureSpreads, 0.5),
    featureMax: Math.max(...featureSpreads),
    benchMedian: quantile(benchSpreads, 0.5),
    benchP95: quantile(benchSpreads, 0.95),
  }

  console.log(`\n[verify] ${samples.length} measurements of identical code — ${keys.length} benches across ${features.length} features`)
  console.log('[verify] identical code should produce identical numbers; this is how close it got.\n')
  console.log('  metric'.padEnd(28), 'measured'.padStart(10), 'limit'.padStart(8), '  result')

  let failed = false
  for (const [key, limit] of Object.entries(THRESHOLDS)) {
    const value = measured[key as keyof typeof measured]
    const ok = value <= limit
    if (!ok) failed = true
    console.log(
      `  ${key}`.padEnd(28),
      `${value.toFixed(2)}%`.padStart(10),
      `${limit}%`.padStart(8),
      `  ${ok ? 'pass' : 'FAIL'}`,
    )
  }

  const worst = featureSpreads
    .map((value, index) => ({ value, feature: features[index]! }))
    .toSorted((a, b) => b.value - a.value)
    .slice(0, 5)
  console.log('\n  least reproducible features:')
  for (const { value, feature } of worst) console.log(`    ${value.toFixed(2).padStart(6)}%  ${feature}`)

  if (failed) {
    console.error(
      '\n[verify] FAILED — repeated measurement of identical code disagrees by more than the apparatus allows.\n'
      + 'Do not trust committed numbers until this passes. Usual causes: the host was not idle, the\n'
      + 'machine or toolchain changed, or the bench harness itself regressed.',
    )
    process.exitCode = 1
    return
  }
  console.log('\n[verify] PASS — the apparatus reproduces itself within its limits.')
}

main()
