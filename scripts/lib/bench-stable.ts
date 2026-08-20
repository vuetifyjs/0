/**
 * Stable-benchmark apparatus helpers.
 *
 * Goal: version-to-version numbers that are comparable and actionable.
 * Noise sources we control for:
 *   - multi-project collection (unit + browser) → always --project v0:unit
 *   - file parallelism / multi-worker timing → maxWorkers=1, no fileParallelism
 *   - single-run jitter on shared GHA → median of N runs
 *   - absolute machine paths in JSON → repo-relative filepaths
 *   - local machine commits mixed with CI → artifact guard rejects local paths
 */

export interface BenchSample {
  [key: string]: unknown
  name: string
  hz: number
  mean: number
  rme?: number
  rank?: number
}

export interface BenchGroup {
  fullName: string
  benchmarks?: BenchSample[]
}

export interface BenchFile {
  filepath: string
  groups?: BenchGroup[]
}

export interface BenchJson {
  [key: string]: unknown
  files?: BenchFile[]
}

/**
 * Strip machine-absolute prefixes down to packages/0/... (or leave relative).
 *
 * Anchored at the package root rather than `src/` so bench files outside src
 * normalize too. Anything under `src/` yields the identical string it did
 * before, since the marker only sets where the slice starts.
 */
export function normalizeFilepath (filepath: string): string {
  const markers = [
    '/packages/0/',
    'packages/0/',
  ]
  for (const marker of markers) {
    const index = filepath.indexOf(marker)
    if (index !== -1) {
      const start = marker.startsWith('/') ? index + 1 : index
      return filepath.slice(start).replace(/\\/g, '/')
    }
  }
  // Already relative-ish
  return filepath.replace(/\\/g, '/')
}

export function normalizeBenchJson (raw: BenchJson): BenchJson {
  return {
    ...raw,
    files: (raw.files ?? []).map(file => ({
      ...file,
      filepath: normalizeFilepath(file.filepath),
    })),
  }
}

/** True when the artifact was measured on a developer machine, not GHA/metrics-regen. */
export function isLocalMachinePath (filepath: string): boolean {
  // GHA: /home/runner/work/...
  // Local: /home/john/..., /Users/..., C:\Users\...
  if (/\/home\/runner\//.test(filepath)) return false
  if (/^packages\/0\//.test(filepath)) return false // already normalized
  if (/^\/home\//.test(filepath)) return true
  if (/^\/Users\//.test(filepath)) return true
  if (/^[A-Za-z]:\\Users\\/.test(filepath)) return true
  return false
}

export function assertCiOrRelativePaths (raw: BenchJson): string[] {
  const errors: string[] = []
  for (const file of raw.files ?? []) {
    if (isLocalMachinePath(file.filepath)) {
      errors.push(
        `local machine path in benchmarks.json: ${file.filepath}\n`
        + '  Metrics artifacts must be produced by metrics-regen on GHA (or use relative packages/0/src paths).\n'
        + '  Do not commit `pnpm test:bench:json` output from a laptop — it is not comparable to CI.',
      )
    }
  }
  return errors
}

function medianIndex (length: number): number {
  return Math.floor((length - 1) / 2)
}

function medianOf<T> (items: T[], by: (item: T) => number): T {
  const sorted = [...items].toSorted((a, b) => by(a) - by(b))
  return sorted[medianIndex(sorted.length)]!
}

/**
 * Merge N vitest bench JSON runs by (filepath, group fullName, bench name).
 * For each key, keep the sample whose hz is the median across runs (and that
 * sample's full stats — mean/rme travel with the median hz observation).
 */
export function medianMergeRuns (runs: BenchJson[]): BenchJson {
  if (runs.length === 0) throw new Error('medianMergeRuns: no runs')
  if (runs.length === 1) return normalizeBenchJson(runs[0]!)

  type Key = string
  const samples = new Map<Key, BenchSample[]>()
  const fileOrder: string[] = []
  const groupOrder = new Map<string, string[]>() // filepath → fullNames

  for (const run of runs) {
    const normalized = normalizeBenchJson(run)
    for (const file of normalized.files ?? []) {
      if (!fileOrder.includes(file.filepath)) fileOrder.push(file.filepath)
      if (!groupOrder.has(file.filepath)) groupOrder.set(file.filepath, [])
      for (const group of file.groups ?? []) {
        const groups = groupOrder.get(file.filepath)!
        if (!groups.includes(group.fullName)) groups.push(group.fullName)
        for (const bench of group.benchmarks ?? []) {
          const key = `${file.filepath}\0${group.fullName}\0${bench.name}`
          const list = samples.get(key) ?? []
          list.push(bench)
          samples.set(key, list)
        }
      }
    }
  }

  const files: BenchFile[] = fileOrder.map(filepath => {
    const fullNames = groupOrder.get(filepath) ?? []
    const groups: BenchGroup[] = fullNames.map(fullName => {
      const prefix = `${filepath}\0${fullName}\0`
      const benchmarks: BenchSample[] = []
      for (const [key, list] of samples) {
        if (!key.startsWith(prefix)) continue
        benchmarks.push(medianOf(list, s => s.hz))
      }
      // Stable order by name so diffs stay readable
      benchmarks.sort((a, b) => a.name.localeCompare(b.name))
      return { fullName, benchmarks }
    })
    return { filepath, groups }
  })

  return { files }
}

/** Canary benches used for cross-run / cross-version stability reporting. */
export const CANARY_BENCHES = [
  { file: 'packages/0/src/composables/createRegistry/index.bench.ts', name: 'Get by id (1,000 items)' },
  { file: 'packages/0/src/composables/createRegistry/index.bench.ts', name: 'Check has (1,000 items)' },
  { file: 'packages/0/src/composables/createModel/index.bench.ts', name: 'Get by id (1,000 items)' },
  { file: 'packages/0/src/composables/createFilter/index.bench.ts', name: 'Filter 1,000 objects across all keys' },
  { file: 'packages/0/src/composables/createNested/index.bench.ts', name: 'Get by id (1,000 flat items)' },
] as const

export interface CanaryPoint {
  id: string
  hz: number | null
}

export function extractCanaries (raw: BenchJson): CanaryPoint[] {
  const normalized = normalizeBenchJson(raw)
  return CANARY_BENCHES.map(c => {
    const id = `${c.file} :: ${c.name}`
    const needle = c.file.replace(/^packages\/0\//, '') // src/composables/...
    for (const file of normalized.files ?? []) {
      const fp = normalizeFilepath(file.filepath)
      const match = fp === c.file || fp.endsWith(needle) || fp.endsWith(c.file)
      if (!match) continue
      for (const group of file.groups ?? []) {
        for (const b of group.benchmarks ?? []) {
          if (b.name === c.name) return { id, hz: b.hz }
        }
      }
    }
    return { id, hz: null }
  })
}

export interface DeltaRow {
  id: string
  prevHz: number | null
  nextHz: number | null
  ratio: number | null
  pct: number | null
}

/**
 * Compare canaries as raw ops/s.
 *
 * This gate used to divide both sides by a host "scale" derived from a
 * synthetic anchor suite, because artifacts came from whichever GHA runner won
 * the lottery — on PR #714 all five canaries "regressed" 44–61% on unchanged
 * code purely from hardware rotation. That correction is gone along with the
 * anchors: benchmarks are measured on one fixed workstation, so both sides come
 * from the same machine and raw ops/s are directly comparable.
 *
 * Deleting it was not merely simplification, it was a fix. Measured over four
 * full-suite runs of identical code, dividing by the anchor scale made results
 * less reproducible than not (per-feature spread 6.23% median versus 2.16%
 * raw), because the anchors did not track the suite they were correcting.
 *
 * The guard against comparing across machines is now the environment
 * fingerprint in `env` — if `cpu` or `node` differ between two artifacts their
 * absolute numbers are not comparable and the answer is to re-measure, not to
 * rescale.
 */
export function compareCanaries (prev: BenchJson | null, next: BenchJson): DeltaRow[] {
  const nextC = extractCanaries(next)
  const prevC = prev ? extractCanaries(prev) : []
  return nextC.map(n => {
    const p = prevC.find(x => x.id === n.id)
    const prevHz = p?.hz ?? null
    const nextHz = n.hz ?? null
    if (prevHz == null || nextHz == null || prevHz === 0) {
      return { id: n.id, prevHz, nextHz, ratio: null, pct: null }
    }
    const ratio = nextHz / prevHz
    return { id: n.id, prevHz, nextHz, ratio, pct: (ratio - 1) * 100 }
  })
}

/** Default acceptable |pct| swing on canaries before a run is flagged noisy. */
export const CANARY_NOISE_PCT = 20

/**
 * How far the whole suite moved between two artifacts, as a percentage.
 *
 * This is the honest replacement for host calibration. The old apparatus tried
 * to *correct* for the machine by dividing every number by a scale derived from
 * synthetic anchors, which made results measurably less reproducible because
 * the anchors did not track the suite. This instead makes host movement
 * *visible* and leaves the numbers alone: when every bench moves together by a
 * similar amount, that is the machine, and a reader can see it in one line
 * rather than having it silently folded into each figure.
 *
 * Median rather than mean, so a handful of genuinely-changed benches do not drag
 * it. Null when the two artifacts share no benchmarks.
 */
export function suiteShiftPct (prev: BenchJson | null, next: BenchJson): number | null {
  if (!prev) return null
  const before = new Map<string, number>()
  for (const file of normalizeBenchJson(prev).files ?? []) {
    for (const group of file.groups ?? []) {
      for (const b of group.benchmarks ?? []) {
        if (b.hz > 0) before.set(`${normalizeFilepath(file.filepath)}::${b.name}`, b.hz)
      }
    }
  }
  const ratios: number[] = []
  for (const file of normalizeBenchJson(next).files ?? []) {
    for (const group of file.groups ?? []) {
      for (const b of group.benchmarks ?? []) {
        const was = before.get(`${normalizeFilepath(file.filepath)}::${b.name}`)
        if (was && b.hz > 0) ratios.push(b.hz / was)
      }
    }
  }
  if (ratios.length === 0) return null
  const sorted = ratios.toSorted((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  const median = sorted.length % 2 ? sorted[mid]! : (sorted[mid - 1]! + sorted[mid]!) / 2
  return (median - 1) * 100
}

export function formatDeltaReport (
  rows: DeltaRow[],
  noisePct = CANARY_NOISE_PCT,
  suiteShift: number | null = null,
): string {
  const lines = [
    '### Canary bench delta (next / prev)',
    '',
    'Raw ops/s, both sides measured on the same fixed workstation. Individual benches are '
    + 'noisier than feature aggregates — repeated runs of identical code move ~4% at the median '
    + 'per bench but ~2% per feature — so read a single canary moving a few percent as noise.',
  ]
  if (suiteShift != null) {
    const sign = suiteShift >= 0 ? '+' : ''
    lines.push(
      '',
      `Whole suite moved **${sign}${suiteShift.toFixed(2)}%** at the median.`
      + (Math.abs(suiteShift) > 5
        ? ' That is large enough to suspect the machine rather than the code — check the `env`'
        + ' fingerprints match and that the host was idle before reading anything below as a regression.'
        : ' Consistent with the same machine measuring the same way.'),
    )
  }
  lines.push(
    '',
    '| Canary | prev | next | Δ |',
    '|--------|-----:|-----:|----:|',
  )
  let flagged = 0
  for (const row of rows) {
    const prev = row.prevHz == null ? '—' : formatHz(row.prevHz)
    const next = row.nextHz == null ? '—' : formatHz(row.nextHz)
    let delta = '—'
    if (row.pct != null) {
      const sign = row.pct >= 0 ? '+' : ''
      delta = `${sign}${row.pct.toFixed(1)}%`
      if (Math.abs(row.pct) > noisePct) {
        delta += ' ⚠️'
        flagged++
      }
    }
    const short = row.id.replace('packages/0/src/composables/', '').replace('/index.bench.ts :: ', ' · ')
    lines.push(`| ${short} | ${prev} | ${next} | ${delta} |`)
  }
  lines.push('')
  if (flagged > 0) {
    lines.push(
      `**${flagged} canary(ies) exceeded ±${noisePct}%.** Shared GHA runners commonly move ~10–20%; `
      + `beyond that, re-run metrics-regen or investigate before merging.`,
    )
  } else {
    lines.push(`All canaries within ±${noisePct}% (per-bench noise band on the reference host).`)
  }
  return lines.join('\n')
}

function formatHz (hz: number): string {
  if (hz >= 1_000_000) return `${(hz / 1_000_000).toFixed(2)}M`
  if (hz >= 1000) return `${(hz / 1000).toFixed(1)}k`
  return `${Math.round(hz)}`
}

/** Vitest CLI flags shared by every metrics/history bench invocation. */
export const STABLE_VITEST_BENCH_ARGS = [
  'bench',
  '--run',
  '--project',
  'v0:unit',
  '--maxWorkers=1',
  '--no-file-parallelism',
] as const
