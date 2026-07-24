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

/** Strip machine-absolute prefixes down to packages/0/src/... (or leave relative). */
export function normalizeFilepath (filepath: string): string {
  const markers = [
    '/packages/0/src/',
    'packages/0/src/',
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
 * Host calibration factor recorded by run-bench-stable.ts, or 1 when absent.
 *
 * Read positionally rather than by importing scripts/lib/calibration.ts, which
 * imports this module — the dependency stays one-directional.
 */
export function scaleOf (raw: BenchJson | null | undefined): number {
  const scale = (raw?.apparatus as { scale?: number } | undefined)?.scale
  return typeof scale === 'number' && scale > 0 ? scale : 1
}

/**
 * Compare canaries in baseline units, not raw ops/s.
 *
 * The two artifacts are, in general, measured on different GHA hosts — the
 * previous one was committed by an earlier regen run. Comparing raw hz across
 * them measures the runner lottery: on PR #714 every one of the five canaries
 * "regressed" 44–61% on completely unchanged code. Dividing each side by its own
 * recorded scale is what makes this gate a regression detector instead of a
 * hardware detector.
 */
export function compareCanaries (prev: BenchJson | null, next: BenchJson): DeltaRow[] {
  const nextC = extractCanaries(next)
  const prevC = prev ? extractCanaries(prev) : []
  const prevScale = scaleOf(prev)
  const nextScale = scaleOf(next)
  return nextC.map(n => {
    const p = prevC.find(x => x.id === n.id)
    const prevHz = p?.hz == null ? null : p.hz / prevScale
    const nextHz = n.hz == null ? null : n.hz / nextScale
    if (prevHz == null || nextHz == null || prevHz === 0) {
      return { id: n.id, prevHz, nextHz, ratio: null, pct: null }
    }
    const ratio = nextHz / prevHz
    return { id: n.id, prevHz, nextHz, ratio, pct: (ratio - 1) * 100 }
  })
}

/** Default acceptable |pct| swing on canaries before a run is flagged noisy. */
export const CANARY_NOISE_PCT = 20

export function formatDeltaReport (
  rows: DeltaRow[],
  noisePct = CANARY_NOISE_PCT,
  scales?: { prev: number, next: number },
): string {
  const calibrated = scales != null && (scales.prev !== 1 || scales.next !== 1)
  const lines = [
    '### Canary bench delta (next / prev)',
    '',
    calibrated
      ? `Host-normalized (prev scale ${scales.prev.toFixed(4)}, next ${scales.next.toFixed(4)}) — `
      + 'runner speed is divided out, so a flagged delta is a real change.'
      : '**Raw ops/s — not host-normalized.** No calibration baseline is stored yet, so a '
        + 'whole-panel shift in one direction is most likely a GHA host rotation rather than a '
        + 'code change. See scripts/lib/calibration.ts.',
    '',
    '| Canary | prev | next | Δ |',
    '|--------|-----:|-----:|----:|',
  ]
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
    lines.push(`All canaries within ±${noisePct}% (acceptable GHA noise band).`)
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
