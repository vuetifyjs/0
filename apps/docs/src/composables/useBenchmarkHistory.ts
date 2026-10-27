// Framework
import { isNumber } from '@vuetify/v0'

// Composables
import { historySources } from './benchmarkHistorySources'

// Utilities
import { type ComputedRef, type MaybeRefOrGetter, type ShallowRef, computed, shallowRef, toValue } from 'vue'

// Types
import type { RawFeature } from './benchmarkHistorySources'
import type { TierState } from './useBenchmarkData'

/**
 * The band a trend delta has to clear before it counts as a real change.
 *
 * Flat on purpose. `rme` is within-run dispersion and does not predict
 * between-run spread — the two correlate at 0.413 — so gating on it was
 * measured and rejected when host calibration was removed (#749). That same
 * work measured what identical code does across runs on the fixed reference
 * host: 42 of 433 benches spread over 10%, 9 over 20%. A 20% band is where
 * most of what surfaces is movement rather than apparatus; it flags 16 of 95
 * groups on the current data, against 30 at 10%.
 */
export const NOISE_BAND = 20

/**
 * How many published releases a trend may look back across.
 *
 * Early snapshots sit well below later ones, so a first-to-last delta reads
 * as a large speedup that did not happen recently.
 */
export const TREND_RELEASES = 5

/** True when a trend delta is large enough to outrank run-to-run noise. */
export function significant (delta: number): boolean {
  return Math.abs(delta) > NOISE_BAND
}

export interface HistoryPoint {
  version: string
  hz: number
  mean: number
  tier: TierState
}

export interface BenchmarkHistory {
  name: string
  points: HistoryPoint[]
  delta: number
}

export interface GroupHistory {
  name: string
  benchmarks: BenchmarkHistory[]
}

export interface FeatureHistory {
  feature: string
  versionsSpanned: string[]
  groups: GroupHistory[]
}

type FeatureIndex = Map<string, Map<string, Map<string, HistoryPoint[]>>>

let cache: ShallowRef<FeatureIndex | null> | null = null
let loadingState: ShallowRef<boolean> | null = null
let loadPromise: Promise<void> | null = null

/** Chronological order. A release sorts after its own prerelease. */
function compareVersion (a: string, b: string): number {
  if (a === b) return 0

  function parse (v: string) {
    const [core, pre] = v.split('-')
    return { nums: core.split('.').map(Number), pre }
  }

  const pa = parse(a)
  const pb = parse(b)

  for (let i = 0; i < 3; i++) {
    const diff = (pa.nums[i] ?? 0) - (pb.nums[i] ?? 0)
    if (diff !== 0) return diff
  }

  if (!pa.pre && pb.pre) return 1
  if (pa.pre && !pb.pre) return -1
  if (pa.pre && pb.pre) return pa.pre < pb.pre ? -1 : (pa.pre > pb.pre ? 1 : 0)
  return 0
}

function ingestSource (
  index: FeatureIndex,
  version: string,
  items: Record<string, RawFeature>,
) {
  for (const [feature, raw] of Object.entries(items)) {
    const groups = raw?.benchmarks?._groups
    if (!groups) continue

    let featureMap = index.get(feature)
    if (!featureMap) {
      featureMap = new Map()
      index.set(feature, featureMap)
    }

    for (const [groupName, benches] of Object.entries(groups)) {
      let groupMap = featureMap.get(groupName)
      if (!groupMap) {
        groupMap = new Map()
        featureMap.set(groupName, groupMap)
      }

      for (const [benchName, entry] of Object.entries(benches)) {
        if (!entry) continue
        const { hz, mean, tier } = entry
        if (!isNumber(hz) || !Number.isFinite(hz) || hz <= 0) continue
        if (!isNumber(mean) || !Number.isFinite(mean)) continue

        let points = groupMap.get(benchName)
        if (!points) {
          points = []
          groupMap.set(benchName, points)
        }
        points.push({
          version,
          hz,
          mean,
          tier: tier ?? 'unmeasured',
        })
      }
    }
  }
}

/** Last {@link TREND_RELEASES} releases. A shorter series is kept whole. */
function trendPoints (sorted: HistoryPoint[]): HistoryPoint[] {
  return sorted.slice(-TREND_RELEASES)
}

function shapeFeature (feature: string, featureMap: Map<string, Map<string, HistoryPoint[]>>): FeatureHistory | null {
  const groups: GroupHistory[] = []
  const allVersions = new Set<string>()

  for (const [groupName, benchMap] of featureMap) {
    const benchmarks: BenchmarkHistory[] = []
    for (const [benchName, points] of benchMap) {
      if (points.length < 2) continue
      const sorted = trendPoints(points.toSorted((a, b) => compareVersion(a.version, b.version)))
      const first = sorted[0]!
      const last = sorted.at(-1)!
      const delta = first.hz === 0 ? 0 : ((last.hz - first.hz) / first.hz) * 100
      benchmarks.push({ name: benchName, points: sorted, delta })
      for (const p of sorted) allVersions.add(p.version)
    }
    if (benchmarks.length > 0) {
      groups.push({ name: groupName, benchmarks })
    }
  }

  if (groups.length === 0) return null

  const versionsSpanned = [...allVersions].toSorted(compareVersion)
  return { feature, versionsSpanned, groups }
}

async function loadAll (): Promise<FeatureIndex> {
  const index: FeatureIndex = new Map()

  const history = await Promise.all(
    Object.values(historySources).map(load => load()
      .then(m => ({ version: m.default.version, items: m.default.items ?? {} }))
      .catch(() => null)),
  )

  for (const source of history) {
    if (!source) continue
    ingestSource(index, source.version, source.items)
  }

  return index
}

function ensureLoad (): { isLoading: ShallowRef<boolean>, data: ShallowRef<FeatureIndex | null> } {
  if (!cache) cache = shallowRef<FeatureIndex | null>(null)
  if (!loadingState) loadingState = shallowRef(false)

  if (!loadPromise) {
    const cacheRef = cache
    const loadingRef = loadingState
    loadingRef.value = true
    loadPromise = loadAll().then(index => {
      cacheRef.value = index
      loadingRef.value = false
    })
  }

  return { isLoading: loadingState, data: cache }
}

export interface UseBenchmarkHistoryReturn {
  isLoading: ShallowRef<boolean>
  history: ComputedRef<FeatureHistory | null>
}

export function useBenchmarkHistory (featureName: MaybeRefOrGetter<string | undefined>): UseBenchmarkHistoryReturn {
  const { isLoading, data } = ensureLoad()

  const history = computed<FeatureHistory | null>(() => {
    const name = toValue(featureName)
    if (!name) return null
    const index = data.value
    if (!index) return null
    const featureMap = index.get(name)
    if (!featureMap) return null
    return shapeFeature(name, featureMap)
  })

  return { isLoading, history }
}

/** @internal — for tests only */
export function __resetBenchmarkHistoryCacheForTests () {
  cache = null
  loadingState = null
  loadPromise = null
}
