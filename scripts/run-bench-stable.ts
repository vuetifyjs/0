/**
 * @fileoverview Run the v0 bench suite under the fixed stability apparatus and
 * write a single median-merged benchmarks.json.
 *
 * Apparatus (non-negotiable for metrics / history):
 *   - project: v0:unit only (never v0:browser)
 *   - maxWorkers=1, no file parallelism
 *   - V0_BENCH_TARGET from env (dist | path | unset=source)
 *   - N independent runs, median hz per bench (default N=3)
 *   - filepaths normalized to packages/0/src/...
 *
 * Usage:
 *   V0_BENCH_TARGET=dist node scripts/run-bench-stable.ts
 *   node scripts/run-bench-stable.ts --runs 3 --out apps/docs/public/benchmarks.json
 *   node scripts/run-bench-stable.ts --runs 1 --out /tmp/b.json   # history (same isolation)
 */

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  STABLE_VITEST_BENCH_ARGS,
  type BenchJson,
  medianMergeRuns,
  normalizeBenchJson,
} from './lib/bench-stable.ts'
import { CALIBRATION_FILE, buildApparatus } from './lib/calibration.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const DEFAULT_OUT = resolve(ROOT, 'apps/docs/public/benchmarks.json')

function parseArgs (argv: string[]): { runs: number, out: string, help: boolean } {
  let runs = 3
  let out = DEFAULT_OUT
  let help = false
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    switch (arg) {
      case '--runs': {
        runs = Number(argv[++i])
        if (!Number.isFinite(runs) || runs < 1) throw new Error(`--runs must be >= 1, got ${argv[i]}`)
        break
      }
      case '--out': {
        out = resolve(ROOT, argv[++i]!)
        break
      }
      case '--help':
      case '-h': {
        help = true
        break
      }
    }
  }
  return { runs, out, help }
}

function runOnce (jsonOut: string): BenchJson {
  try {
    execFileSync('pnpm', [
      'exec',
      'vitest',
      ...STABLE_VITEST_BENCH_ARGS,
      '--outputJson',
      jsonOut,
    ], {
      cwd: ROOT,
      stdio: 'inherit',
      env: { ...process.env },
    })
  } catch {
    // Vitest exits non-zero when some benches error (e.g. history vs old API).
    // Keep partial outputJson if present.
    console.warn('[run-bench-stable] vitest exited non-zero — using partial results if present')
  }
  if (!existsSync(jsonOut)) {
    throw new Error(`[run-bench-stable] no output written to ${jsonOut}`)
  }
  return JSON.parse(readFileSync(jsonOut, 'utf8')) as BenchJson
}

function main (): void {
  const { runs, out, help } = parseArgs(process.argv.slice(2))
  if (help) {
    console.log(`Usage: node scripts/run-bench-stable.ts [--runs N] [--out path]
  --runs  Independent vitest bench passes to median-merge (default: 3)
  --out   Output JSON path (default: apps/docs/public/benchmarks.json)`)
    return
  }
  const target = process.env.V0_BENCH_TARGET ?? '(source)'
  console.log(`[run-bench-stable] apparatus: project=v0:unit maxWorkers=1 no-file-parallelism runs=${runs} V0_BENCH_TARGET=${target}`)

  const dir = mkdtempSync(resolve(tmpdir(), 'v0-bench-stable-'))
  const runFiles: BenchJson[] = []

  try {
    for (let i = 0; i < runs; i++) {
      const path = resolve(dir, `run-${i + 1}.json`)
      console.log(`[run-bench-stable] run ${i + 1}/${runs} → ${path}`)
      runFiles.push(runOnce(path))
    }

    const merged = runs === 1
      ? normalizeBenchJson(runFiles[0]!)
      : medianMergeRuns(runFiles)

    // Host fingerprint + scale factor travel with the numbers they describe.
    // Raw hz stays raw here — this file is the source of truth for what was
    // actually measured; normalization happens where artifacts are shaped for
    // consumption, so a bad baseline can always be re-derived rather than
    // having been baked in irreversibly.
    const apparatus = buildApparatus(merged, runs)
    const withApparatus: BenchJson = { ...merged, apparatus }

    mkdirSync(dirname(out), { recursive: true })
    writeFileSync(out, `${JSON.stringify(withApparatus, null, 2)}\n`)
    const nFiles = merged.files?.length ?? 0
    const nBenches = (merged.files ?? []).reduce(
      (sum, f) => sum + (f.groups ?? []).reduce((s, g) => s + (g.benchmarks?.length ?? 0), 0),
      0,
    )
    console.log(`[run-bench-stable] wrote ${out} (${nFiles} files, ${nBenches} benches, median of ${runs})`)
    const anchorCount = Object.keys(apparatus.anchors).length
    console.log(
      `[run-bench-stable] apparatus: scale=${apparatus.scale.toFixed(4)} `
      + `anchors=${anchorCount}${apparatus.complete ? '' : ' (INCOMPLETE)'} `
      + `baseline=${apparatus.baseline ? 'stored' : 'null — numbers are raw, not yet host-normalized'} `
      + `cpu=${apparatus.env.cpu ?? 'unknown'}`,
    )
    if (!apparatus.complete) {
      console.warn(
        '[run-bench-stable] calibration anchors missing or partial — scale forced to 1. '
        + `Expected ${CALIBRATION_FILE} to contribute its full anchor set.`,
      )
    }
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

main()
