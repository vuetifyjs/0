/**
 * Shared helpers for shaping Vitest bench JSON output into the per-item
 * structure the docs consume.
 *
 * Imported by:
 *   - scripts/generate-metrics.js (current snapshot)
 *   - scripts/generate-metrics-history.ts (historical per-tag snapshots)
 */

export type Tier = 'blazing' | 'fast' | 'good' | 'slow'

export interface BenchEntry {
  name: string
  hz: number
  hzLabel: string
  mean: number
  meanLabel: string
  rme?: number
  tier: Tier
}

export interface BenchSummary {
  name: string
  hz: number
  hzLabel: string
  mean: number
  meanLabel: string
  tier: Tier
}

export interface GroupEntry {
  [benchName: string]: BenchEntry | BenchSummary | Tier | undefined
  _fastest?: BenchSummary
  _slowest?: BenchSummary
  _tier?: Tier
}

export interface ItemBenchmarks {
  [benchName: string]: BenchEntry | BenchSummary | Record<string, GroupEntry> | Tier | undefined
  _groups: Record<string, GroupEntry>
  _fastest?: BenchSummary
  _slowest?: BenchSummary
  _tier?: Tier
}

interface RawBench {
  name: string
  hz: number
  mean: number
  rme: number
}

interface RawGroup {
  fullName: string
  benchmarks?: RawBench[]
}

export interface RawBenchFile {
  filepath: string
  groups?: RawGroup[]
}

export function formatHz (hz: number): string {
  if (hz >= 1_000_000) return `${(hz / 1_000_000).toFixed(1)}M ops/s`
  if (hz >= 1000) return `${(hz / 1000).toFixed(1)}k ops/s`
  return `${Math.round(hz)} ops/s`
}

export function formatTime (ms: number): string {
  if (ms < 0.001) return `${(ms * 1_000_000).toFixed(0)}ns`
  if (ms < 1) return `${(ms * 1000).toFixed(1)}μs`
  return `${ms.toFixed(2)}ms`
}

/**
 * Parse the declared workload out of a bench name. Bench names consistently
 * encode collection size ("(10,000 items)", "~1,000 tree items") and repeat
 * factor ("Access values 100 times"). Bare numbers ≥ 1000 also count as
 * collection size ("Onboard 10,000 then offboard 1,000 items"). Unmatched
 * quantities default to 1, which under-counts work and therefore
 * over-estimates cost — errs strict, never lenient.
 */
const NOUN = /~?([\d,]+)(?:\s+\w+){0,2}?\s+(?:items?|elements?|entries|objects?|dates?|pairs?|nodes?|rows?|cells?|keys?|queries|tokens?|fields?|values?|columns?|groups?|thumbs?|primitives?|paths?|additions?|formats?)\b/gi
const TIMES = /([\d,]+)\s+times\b/i
const BARE = /([\d,]{4,})/g

export function workload (name: string): { items: number, repeats: number } {
  const match = name.match(TIMES)
  const repeats = match ? Number.parseInt(match[1].replaceAll(',', '')) : 1
  let items = 1
  for (const m of name.matchAll(NOUN)) {
    const n = Number.parseInt(m[1].replaceAll(',', ''))
    if (n > items) items = n
  }
  for (const m of name.matchAll(BARE)) {
    const n = Number.parseInt(m[1].replaceAll(',', ''))
    if (n >= 1000 && n > items) items = n
  }
  return { items, repeats }
}

/**
 * Tier on cost, not raw hz. Raw ops/s measures workload size, not code speed —
 * a 10k-item op at 17 hz (5.9μs/item) can be better engineered than a
 * single-item op at 200k hz (5μs/item).
 *
 * Collection benches (items > 1) — two axes, worst wins:
 * 1. Per-item cost: is the work done efficiently?
 * 2. Single-op latency (mean ÷ repeats vs frame budget): is one logical call
 *    something a user would feel? Keeps a 160ms 10k-row sort from badging
 *    "fast" just because its per-item cost is honest.
 *
 * One-shot benches (items = 1: constructors, single utility calls) have no
 * workload to amortize — "per-item" would be a category error that grades a
 * 22μs constructor against per-item budgets. They tier on call latency alone,
 * against one-shot budgets.
 */
const ITEM_TIERS: Array<[number, Tier]> = [
  [1, 'blazing'], // < 1μs per item
  [10, 'fast'],
  [100, 'good'],
  [Infinity, 'slow'],
]
const LATENCY_TIERS: Array<[number, Tier]> = [
  [16.7, 'blazing'], // one 60fps frame
  [33.4, 'fast'], // two frames
  [100, 'good'], // perceptibility threshold
  [Infinity, 'slow'],
]
const SHOT_TIERS: Array<[number, Tier]> = [
  [10, 'blazing'], // < 10μs per call
  [100, 'fast'],
  [16_700, 'good'], // within one frame
  [Infinity, 'slow'],
]
const TIER_SCORES: Record<Tier, number> = { blazing: 4, fast: 3, good: 2, slow: 1 }

export function getTier (mean: number, name: string): Tier {
  const { items, repeats } = workload(name)
  const latency = mean / repeats // ms per single logical op

  if (items === 1) {
    const us = latency * 1000
    return SHOT_TIERS.find(([edge]) => us < edge)![1]
  }

  const cost = (mean * 1000) / (items * repeats) // μs per item
  const efficiency = ITEM_TIERS.find(([edge]) => cost < edge)![1]
  const feel = LATENCY_TIERS.find(([edge]) => latency <= edge)![1]
  return TIER_SCORES[efficiency] < TIER_SCORES[feel] ? efficiency : feel
}

/**
 * A group is as fast as its slowest bench. Averaging (or taking the fastest)
 * lets one flattering microbench mask a genuinely slow path.
 */
export function getGroupTier (tiers: Tier[]): Tier {
  if (tiers.length === 0) return 'good'
  return tiers.reduce((worst, t) => TIER_SCORES[t] < TIER_SCORES[worst] ? t : worst)
}

function benchSummary (b: RawBench): BenchSummary {
  return {
    name: b.name,
    hz: Math.round(b.hz),
    hzLabel: formatHz(b.hz),
    mean: b.mean,
    meanLabel: formatTime(b.mean),
    tier: getTier(b.mean, b.name),
  }
}

/**
 * Divide the host out of a file's measurements.
 *
 * Applied once here, at the boundary where raw vitest output becomes a consumed
 * artifact, so everything downstream — tiers, labels, fastest/slowest roll-ups,
 * docs, sparklines — is already in baseline units and needs no scale awareness.
 *
 * Raw values are deliberately not duplicated into the output: `apparatus.scale`
 * travels with every artifact, so `rawHz === hz * scale` is always recoverable.
 * Storing both would inflate snapshots that are already the dominant source of
 * diff churn in the metrics-regen PR.
 */
function rescale (file: RawBenchFile, scale: number): RawBenchFile {
  if (scale === 1) return file
  return {
    ...file,
    groups: (file.groups ?? []).map(group => ({
      ...group,
      benchmarks: (group.benchmarks ?? []).map(b => ({
        ...b,
        hz: b.hz / scale,
        mean: b.mean * scale,
      })),
    })),
  }
}

/**
 * Reduce a single file entry from vitest bench JSON into the per-item
 * benchmarks shape used by metrics.json and the per-version history files.
 *
 * `scale` is the host calibration factor from `apparatus.scale` (see
 * scripts/lib/calibration.ts). Passing it makes the output host-independent,
 * which is what lets a snapshot measured on one runner sit in the same trend
 * line as one measured on another. Defaults to 1 — an uncalibrated no-op.
 */
export function buildItemBenchmarks (rawFile: RawBenchFile, scale = 1): ItemBenchmarks {
  const file = rescale(rawFile, scale)
  const result: ItemBenchmarks = { _groups: {} }

  for (const group of file.groups ?? []) {
    const groupName = group.fullName.split(' > ').pop() ?? group.fullName
    const groupBenchmarks = group.benchmarks ?? []
    const groupEntry: GroupEntry = {}

    for (const b of groupBenchmarks) {
      const entry: BenchEntry = {
        name: b.name,
        hz: Math.round(b.hz),
        hzLabel: formatHz(b.hz),
        mean: b.mean,
        meanLabel: formatTime(b.mean),
        rme: Math.round(b.rme * 10) / 10,
        tier: getTier(b.mean, b.name),
      }
      result[b.name] = entry
      groupEntry[b.name] = entry
    }

    const fastest = groupBenchmarks.reduce<RawBench | null>((a, b) => (!a || b.hz > a.hz) ? b : a, null)
    const slowest = groupBenchmarks.reduce<RawBench | null>((a, b) => (!a || b.hz < a.hz) ? b : a, null)

    if (fastest && slowest) {
      groupEntry._fastest = benchSummary(fastest)
      groupEntry._slowest = benchSummary(slowest)
      groupEntry._tier = getGroupTier(groupBenchmarks.map(b => getTier(b.mean, b.name)))
    }

    result._groups[groupName] = groupEntry
  }

  const allBenchmarks = (file.groups ?? []).flatMap(g => g.benchmarks ?? [])
  const fastestOverall = allBenchmarks.reduce<RawBench | null>((a, b) => (!a || b.hz > a.hz) ? b : a, null)
  const slowestOverall = allBenchmarks.reduce<RawBench | null>((a, b) => (!a || b.hz < a.hz) ? b : a, null)
  if (fastestOverall) result._fastest = benchSummary(fastestOverall)
  if (slowestOverall) result._slowest = benchSummary(slowestOverall)

  // Item tier = worst group tier. A feature is as fast as its slowest
  // documented operation — never the tier of its most flattering bench.
  const groupTiers = Object.values(result._groups)
    .map(g => g._tier)
    .filter((t): t is Tier => t !== undefined)
  if (groupTiers.length > 0) result._tier = getGroupTier(groupTiers)

  return result
}

/**
 * Extract composable/component name from a file path.
 * Matches the same patterns as the coverage-side extractor.
 */
export function extractName (filePath: string): string | null {
  const composableMatch = filePath.match(/\/composables\/([^/]+)\/index\.(ts|bench\.ts|test\.ts)$/)
  if (composableMatch) return composableMatch[1]
  const componentMatch = filePath.match(/\/components\/([^/]+)\//)
  if (componentMatch) return componentMatch[1]
  // Utilities are flat files (utilities/helpers.ts, utilities/helpers.bench.ts),
  // not a dir/index pair — without this, a utilities bench (e.g. helpers) never
  // gets a metrics.json entry and its docs card falls back to "Unmeasured".
  const utilityMatch = filePath.match(/\/utilities\/([^/]+?)(?:\.(?:bench|test))?\.ts$/)
  if (utilityMatch && utilityMatch[1] !== 'index') return utilityMatch[1]
  return null
}
