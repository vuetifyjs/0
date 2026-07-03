// Framework
import { isNumber } from '@vuetify/v0'

// Composables
import { historySources } from './benchmarkHistorySources'

// Utilities
import { type ComputedRef, type MaybeRefOrGetter, type ShallowRef, computed, shallowRef, toValue } from 'vue'

// Types
import type { RawFeature } from './benchmarkHistorySources'
import type { Tier } from './useBenchmarkData'

const CURRENT_LABEL = 'current' as const

export interface HistoryPoint {
  version: string
  hz: number
  mean: number
  isCurrent: boolean
  tier: Tier
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

/** Chronological order; `current` always sorts last, releases outrank their prereleases. */
function compareVersion (a: string, b: string): number {
  if (a === b) return 0
  if (a === CURRENT_LABEL) return 1
  if (b === CURRENT_LABEL) return -1

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
  isCurrent: boolean,
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
          isCurrent,
          tier: tier ?? 'good',
        })
      }
    }
  }
}

function shapeFeature (feature: string, featureMap: Map<string, Map<string, HistoryPoint[]>>): FeatureHistory | null {
  const groups: GroupHistory[] = []
  const allVersions = new Set<string>()

  for (const [groupName, benchMap] of featureMap) {
    const benchmarks: BenchmarkHistory[] = []
    for (const [benchName, points] of benchMap) {
      if (points.length < 2) continue
      const sorted = points.toSorted((a, b) => compareVersion(a.version, b.version))
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
      .then(m => ({ version: m.default.version, items: m.default.items ?? {}, isCurrent: false }))
      .catch(() => null)),
  )

  const current = await import('@/data/metrics.json')
    .then(m => ({ version: CURRENT_LABEL, items: m.default as Record<string, RawFeature>, isCurrent: true }))
    .catch(() => null)

  for (const source of [...history, current]) {
    if (!source) continue
    ingestSource(index, source.version, source.items, source.isCurrent)
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
