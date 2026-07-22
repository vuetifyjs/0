/**
 * @fileoverview Guardrail for benchmarks.json / metrics artifacts.
 *
 * 1. Always: reject local-machine absolute paths (laptop numbers are not CI).
 * 2. On PRs (GITHUB_BASE_REF set): reject changes to metrics artifacts unless
 *    the commit subject matches the metrics-regen bot message, so feature PRs
 *    cannot silently overwrite the series.
 *
 * Exit 0 = ok, 1 = fail.
 */

import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  assertCiOrRelativePaths,
  type BenchJson,
} from './lib/bench-stable.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const BENCH_PATH = resolve(ROOT, 'apps/docs/public/benchmarks.json')

const METRICS_PATHS = new Set([
  'apps/docs/public/benchmarks.json',
  'apps/docs/src/data/metrics.json',
])

const REGEN_SUBJECT = /^chore: regenerate benchmark/

function changedMetricsPaths (): string[] {
  const base = process.env.GITHUB_BASE_REF
  if (!base) return []
  try {
    // PR checks checkout merge commit; compare to origin/<base>
    const ref = `origin/${base}`
    const out = execFileSync(
      'git',
      ['diff', '--name-only', `${ref}...HEAD`],
      { cwd: ROOT, encoding: 'utf8' },
    )
    return out.split('\n').map(s => s.trim()).filter(p =>
      METRICS_PATHS.has(p) || p.startsWith('apps/docs/src/data/metrics/'),
    )
  } catch {
    return []
  }
}

function commitSubjects (): string[] {
  const base = process.env.GITHUB_BASE_REF
  try {
    // PR checks often land on a merge commit ("Merge …"); scan the whole
    // base...HEAD range so a chore(bench)/regen subject still counts.
    if (base) {
      const out = execFileSync(
        'git',
        ['log', '--pretty=%s', `origin/${base}...HEAD`],
        { cwd: ROOT, encoding: 'utf8' },
      )
      const list = out.split('\n').map(s => s.trim()).filter(Boolean)
      if (list.length > 0) return list
    }
    return [
      execFileSync('git', ['log', '-1', '--pretty=%s'], { cwd: ROOT, encoding: 'utf8' }).trim(),
    ]
  } catch {
    return []
  }
}

function main (): void {
  const errors: string[] = []

  if (existsSync(BENCH_PATH)) {
    const raw = JSON.parse(readFileSync(BENCH_PATH, 'utf8')) as BenchJson
    errors.push(...assertCiOrRelativePaths(raw))

    const hasAbsolute = (raw.files ?? []).some(f => f.filepath.startsWith('/'))
    if (hasAbsolute) {
      errors.push(
        'benchmarks.json still uses absolute filepaths. Re-run via `pnpm metrics:bench` '
        + '(run-bench-stable normalizes to packages/0/src/...).',
      )
    }
  }

  const changed = changedMetricsPaths()
  if (changed.length > 0) {
    const subjects = commitSubjects()
    const actor = process.env.GITHUB_ACTOR ?? ''
    const allowed = subjects.some(s => REGEN_SUBJECT.test(s) || /^chore\(bench\):/.test(s))
      || actor === 'github-actions[bot]'
      || process.env.ALLOW_METRICS_ARTIFACT_EDIT === '1'

    if (!allowed) {
      errors.push(
        `Metrics artifacts changed on this PR without a metrics-regen / chore(bench) commit:\n`
        + changed.map(p => `  - ${p}`).join('\n')
        + `\n\nSubjects seen: ${subjects.map(s => JSON.stringify(s)).join(', ') || '(none)'}\n`
        + 'Only metrics-regen ("chore: regenerate benchmark + history metrics") or '
        + 'bench-tooling ("chore(bench): …") may touch these files.\n'
        + 'Feature PRs must not commit local `pnpm test:bench:json` / `pnpm metrics` output.\n'
        + 'To override intentionally: ALLOW_METRICS_ARTIFACT_EDIT=1 (rare; document why).',
      )
    }
  }

  if (errors.length > 0) {
    console.error('[check-benchmark-artifacts] FAILED\n')
    for (const e of errors) console.error(e, '\n')
    process.exitCode = 1
    return
  }

  console.log('[check-benchmark-artifacts] ok')
}

main()
