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

import { spawn, type ChildProcess } from 'node:child_process'
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
import { checkHost, formatHost, holdGovernor, isReferenceHost } from './lib/host-guard.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const DEFAULT_OUT = resolve(ROOT, 'apps/docs/public/benchmarks.json')

function parseArgs (argv: string[]): { runs: number, out: string, help: boolean, contended: boolean } {
  let runs = 3
  let out = DEFAULT_OUT
  let help = false
  let contended = process.env.V0_BENCH_ALLOW_CONTENDED === '1'
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    switch (arg) {
      case '--allow-contended': {
        contended = true
        break
      }
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
  return { runs, out, help, contended }
}

/**
 * Refuse to measure a machine that is busy with something else.
 *
 * The host is *always* inspected, so `apparatus.env` records the conditions
 * behind every artifact even where the guard would not stop anything — that
 * attribution is the whole reason the fields exist.
 *
 * Enforcement is skipped only on an ephemeral CI runner, which is a fresh VM
 * doing nothing else and where the host-rotation problem calibration exists for
 * dominates instead. "Ephemeral" is read as `CI` set *and* no governor helper
 * installed, rather than `CI` alone: the reference workstation driven by
 * automation also sets `CI`, and that is precisely the case where the readiness
 * contract must still hold. Keying on `CI` alone would disable the guard on the
 * one machine it was written for.
 */
function guardHost (contended: boolean): ReturnType<typeof checkHost> {
  const report = checkHost()
  const ephemeral = process.env.CI === 'true' && !isReferenceHost()
  console.log(`[run-bench-stable] host: ${formatHost(report)}`)
  for (const warn of report.warns) console.warn(`[run-bench-stable] warn: ${warn}`)

  if (report.blocks.length === 0) return report
  for (const block of report.blocks) console.error(`[run-bench-stable] blocked: ${block}`)
  if (ephemeral) {
    console.warn('[run-bench-stable] ephemeral CI runner — not enforcing host readiness')
    return report
  }
  if (contended) {
    console.warn('[run-bench-stable] --allow-contended set — measuring anyway, numbers are not comparable')
    return report
  }
  throw new Error(
    '[run-bench-stable] host is not idle enough to bench. Wait for it to settle, '
    + 'or pass --allow-contended (V0_BENCH_ALLOW_CONTENDED=1) to measure anyway.',
  )
}

/** The vitest process currently being awaited, so a signal can take it down with us. */
let child: ChildProcess | null = null

/**
 * Run one vitest bench pass.
 *
 * Spawned asynchronously rather than with `execFileSync` specifically so the
 * event loop stays free. A synchronous exec blocks signal delivery for its
 * whole duration, which here is the entire suite — a Ctrl-C would sit queued
 * behind a 25-minute child, the interrupt would appear to do nothing, and the
 * governor restore wired to that signal could not run until the run it was
 * meant to abort had finished anyway. Verified on the reference host before
 * this was changed: SIGINT to the parent left vitest benching on and the box
 * pinned to `performance`.
 */
function runOnce (jsonOut: string): Promise<BenchJson> {
  return new Promise((resolve, reject) => {
    const proc = spawn('pnpm', [
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
    child = proc

    proc.on('error', error => {
      child = null
      reject(error)
    })

    proc.on('close', code => {
      child = null
      if (code !== 0) {
        // Vitest exits non-zero when some benches error (e.g. history vs old
        // API). Keep partial outputJson if present.
        console.warn(`[run-bench-stable] vitest exited ${code} — using partial results if present`)
      }
      if (!existsSync(jsonOut)) {
        reject(new Error(`[run-bench-stable] no output written to ${jsonOut}`))
        return
      }
      resolve(JSON.parse(readFileSync(jsonOut, 'utf8')) as BenchJson)
    })
  })
}

/** Take the in-flight vitest process down so an interrupt is not silently ignored. */
function stopChild (signal: NodeJS.Signals): void {
  child?.kill(signal)
}

async function main (): Promise<void> {
  const { runs, out, help, contended } = parseArgs(process.argv.slice(2))
  if (help) {
    console.log(`Usage: node scripts/run-bench-stable.ts [--runs N] [--out path]
  --runs             Independent vitest bench passes to median-merge (default: 3)
  --out              Output JSON path (default: apps/docs/public/benchmarks.json)
  --allow-contended  Measure even when the host is busy (default: refuse)`)
    return
  }
  const target = process.env.V0_BENCH_TARGET ?? '(source)'
  console.log(`[run-bench-stable] apparatus: project=v0:unit maxWorkers=1 no-file-parallelism runs=${runs} V0_BENCH_TARGET=${target}`)

  const host = guardHost(contended)

  // Everything that can throw happens before the governor is touched, so there
  // is no window in which the host has been changed but the restore is not yet
  // armed.
  const dir = mkdtempSync(resolve(tmpdir(), 'v0-bench-stable-'))
  const runFiles: BenchJson[] = []

  // Hold the clock steady for the duration of the suite, then hand the machine
  // back as it was found — this is somebody's desktop, and leaving 18 cores
  // pinned to max clocks after a bench is a cost paid around the clock for a
  // benefit that only exists during one. No-ops wherever the helper is absent,
  // where the governor is already `performance`, or where the original value is
  // one the helper cannot set back.
  const release = holdGovernor(stopChild)
  if (release) console.log(`[run-bench-stable] governor: ${host.governor} → performance (restored after)`)

  try {
    for (let i = 0; i < runs; i++) {
      const path = resolve(dir, `run-${i + 1}.json`)
      console.log(`[run-bench-stable] run ${i + 1}/${runs} → ${path}`)
      runFiles.push(await runOnce(path))
    }

    const merged = runs === 1
      ? normalizeBenchJson(runFiles[0]!)
      : medianMergeRuns(runFiles)

    // Host fingerprint + scale factor travel with the numbers they describe.
    // Raw hz stays raw here — this file is the source of truth for what was
    // actually measured; normalization happens where artifacts are shaped for
    // consumption, so a bad baseline can always be re-derived rather than
    // having been baked in irreversibly.
    // Record the governor that was in force while measuring, not the one the
    // host happened to idle at before the toggle.
    const apparatus = buildApparatus(merged, runs, {
      busy: host.busy,
      peak: host.peak,
      governor: release ? 'performance' : host.governor,
    })
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
    release?.()
  }
}

// Explicit rather than relying on the default unhandled-rejection exit: the
// guard refusing a contended host is an expected outcome, and it should read as
// one line rather than a stack trace.
main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
