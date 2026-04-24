/**
 * Shared helpers for shaping Vitest bench JSON output into the per-item
 * structure the docs consume.
 *
 * Imported by:
 *   - scripts/generate-metrics.js (current snapshot)
 *   - scripts/generate-metrics-history.ts (historical per-tag snapshots)
 */

export type Tier = 'blazing' | 'fast' | 'good' | 'slow'
export type Complexity = 'O(1)' | 'O(n)' | 'O(n²)'

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
  [benchName: string]: BenchEntry | BenchSummary | Record<string, GroupEntry> | undefined
  _groups: Record<string, GroupEntry>
  _fastest?: BenchSummary
  _slowest?: BenchSummary
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

export function detectComplexity (name: string): Complexity {
  const lower = name.toLowerCase()
  if (/nested|recursive|all.*all/.test(lower)) return 'O(n²)'
  if (/\d+[,\d]*\s*(items?|objects?|entries|elements)/.test(lower)) return 'O(n)'
  if (/all\s+(items?|keys?)/.test(lower)) return 'O(n)'
  if (/single|one\s+(item|query|key)/.test(lower)) return 'O(1)'
  return 'O(n)'
}

export function getTier (hz: number, name: string): Tier {
  const complexity = detectComplexity(name)
  const thresholds: Record<Complexity, { blazing: number, fast: number, good: number }> = {
    'O(1)': { blazing: 100_000, fast: 10_000, good: 1000 },
    'O(n)': { blazing: 10_000, fast: 1000, good: 100 },
    'O(n²)': { blazing: 1000, fast: 100, good: 10 },
  }
  const { blazing, fast, good } = thresholds[complexity]
  if (hz >= blazing) return 'blazing'
  if (hz >= fast) return 'fast'
  if (hz >= good) return 'good'
  return 'slow'
}

const TIER_SCORES: Record<Tier, number> = { blazing: 4, fast: 3, good: 2, slow: 1 }
const SCORE_TIERS: Array<[number, Tier]> = [
  [3.5, 'blazing'],
  [2.5, 'fast'],
  [1.5, 'good'],
  [0, 'slow'],
]

export function getGroupTier (tiers: Tier[]): Tier {
  if (tiers.length === 0) return 'good'
  const avg = tiers.reduce((sum, t) => sum + TIER_SCORES[t], 0) / tiers.length
  return SCORE_TIERS.find(([threshold]) => avg >= threshold)![1]
}

function benchSummary (b: RawBench): BenchSummary {
  return {
    name: b.name,
    hz: Math.round(b.hz),
    hzLabel: formatHz(b.hz),
    mean: b.mean,
    meanLabel: formatTime(b.mean),
    tier: getTier(b.hz, b.name),
  }
}

/**
 * Reduce a single file entry from vitest bench JSON into the per-item
 * benchmarks shape used by metrics.json and the per-version history files.
 */
export function buildItemBenchmarks (file: RawBenchFile): ItemBenchmarks {
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
        tier: getTier(b.hz, b.name),
      }
      result[b.name] = entry
      groupEntry[b.name] = entry
    }

    const fastest = groupBenchmarks.reduce<RawBench | null>((a, b) => (!a || b.hz > a.hz) ? b : a, null)
    const slowest = groupBenchmarks.reduce<RawBench | null>((a, b) => (!a || b.hz < a.hz) ? b : a, null)

    if (fastest && slowest) {
      groupEntry._fastest = benchSummary(fastest)
      groupEntry._slowest = benchSummary(slowest)
      groupEntry._tier = getGroupTier(groupBenchmarks.map(b => getTier(b.hz, b.name)))
    }

    result._groups[groupName] = groupEntry
  }

  const allBenchmarks = (file.groups ?? []).flatMap(g => g.benchmarks ?? [])
  const fastestOverall = allBenchmarks.reduce<RawBench | null>((a, b) => (!a || b.hz > a.hz) ? b : a, null)
  const slowestOverall = allBenchmarks.reduce<RawBench | null>((a, b) => (!a || b.hz < a.hz) ? b : a, null)
  if (fastestOverall) result._fastest = benchSummary(fastestOverall)
  if (slowestOverall) result._slowest = benchSummary(slowestOverall)

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
  return null
}
