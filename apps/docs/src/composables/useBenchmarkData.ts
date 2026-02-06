// Framework
import { createFilter, createGroup } from '@vuetify/v0'

// Utilities
import { computed, onBeforeMount, shallowRef } from 'vue'

// Types
import type { GroupContext } from '@vuetify/v0'
import type { ComputedRef, ShallowRef } from 'vue'

export interface RawBenchmarkEntry {
  id: string
  name: string
  rank: number
  rme: number
  hz: number
  mean: number
  min: number
  max: number
  sampleCount: number
  p75: number
  p99: number
  p995: number
  p999: number
  variance: number
  sd: number
  sem: number
  df: number
  critical: number
  moe: number
  totalTime: number
  median: number
  samples: number[]
}

export interface RawBenchmarkGroup {
  fullName: string
  benchmarks: RawBenchmarkEntry[]
}

export interface RawBenchmarkFile {
  filepath: string
  groups: RawBenchmarkGroup[]
}

export interface NormalizedBenchmark {
  id: string
  name: string
  hz: number
  hzLabel: string
  mean: number
  meanLabel: string
  rme: number
  rank: number
  /** 0–100, fastest in group = 100 */
  relativeHz: number
  /** Percentage slower than fastest. null if this IS fastest */
  diffFromFastest: number | null
}

export interface NormalizedGroup {
  id: string
  name: string
  fullName: string
  composable: string
  benchmarks: NormalizedBenchmark[]
  fastest: NormalizedBenchmark
}

export type Tier = 'blazing' | 'fast' | 'good'

export interface NormalizedComposable {
  name: string
  tier: Tier
  fastest: { name: string, hz: number, hzLabel: string }
  groupCount: number
  benchmarkCount: number
  groups: NormalizedGroup[]
}

export interface BenchmarkSummary {
  totalBenchmarks: number
  totalGroups: number
  composableCount: number
  tierCounts: Record<Tier, number>
}

export interface UseBenchmarkDataOptions {
  /** Restrict to a single composable (embed mode) */
  composable?: string
}

export interface UseBenchmarkDataReturn {
  isLoading: ShallowRef<boolean>
  composables: ComputedRef<NormalizedComposable[]>
  filteredGroups: ComputedRef<NormalizedGroup[]>
  summary: ComputedRef<BenchmarkSummary>
  filter: ReturnType<typeof createFilter>
  composableSelection: GroupContext
  tierSelection: GroupContext
  expandedGroups: GroupContext
  sortBy: ShallowRef<'hz' | 'mean' | 'rme'>
  sortDesc: ShallowRef<boolean>
  expandAll: () => void
  collapseAll: () => void
  clearFilters: () => void
}

// Tier config
export const TIER_CONFIG: Record<Tier, { icon: string, color: string, label: string }> = {
  blazing: { icon: 'benchmark-blazing', color: 'text-error', label: 'Blazing' },
  fast: { icon: 'benchmark-fast', color: 'text-warning', label: 'Fast' },
  good: { icon: 'benchmark-good', color: 'text-info', label: 'Good' },
}

export const TIER_BG: Record<Tier, string> = {
  blazing: 'bg-error',
  fast: 'bg-warning',
  good: 'bg-info',
}

/** Short descriptions for benchmark groups, keyed by extracted group name */
export const GROUP_DESCRIPTIONS: Record<string, string> = {
  // Shared across composables
  'initialization': 'Setup cost when creating a new instance. Affects first render and dynamic creation patterns.',
  'lookup operations': 'Single-item access by ID. Should be O(1) regardless of collection size.',
  'mutation operations': 'Cost of updating, inserting, or removing items. Triggers reactivity and re-indexing.',
  'batch operations': 'Bulk onboard/offboard of many items at once. Critical for initial data loading.',
  'computed access': 'Reading cached computed values. Measures Vue reactivity overhead on derived state.',
  'seek operations': 'Directional search for the first or last matching item in a collection.',
  // createFilter
  'primitive filtering': 'Filtering arrays of strings or numbers. The simplest filter path.',
  'object filtering': 'Filtering objects across one or more keys. Tests key extraction overhead.',
  'filter modes': 'Comparing some/every/union/intersection match strategies on the same dataset.',
  'native comparison': 'Raw Array.filter baseline to show the overhead v0 adds vs native.',
  // createNested
  'traversal operations': 'Walking the tree to find paths, ancestors, or descendants of a node.',
  'open/close operations': 'Expanding and collapsing tree nodes. Triggers cascading state updates.',
  'selection operations': 'Selecting tree nodes with cascade propagation to parents and children.',
  'selection mode comparison': 'Comparing cascade vs independent selection modes on the same tree.',
  'open mode comparison': 'Comparing multiple vs single open mode for tree expansion.',
  // createTokens
  'alias resolution': 'Resolving token aliases like {palette.blue.500} through reference chains.',
  'batch resolution': 'Resolving many token paths in sequence. Tests cache hit rate.',
  // createVirtual
  'scroll operations': 'Updating the virtual window position. Must be fast for smooth 60fps scrolling.',
  'resize operations': 'Recalculating layout when item sizes change. Triggers range recomputation.',
  'scrollTo operations': 'Programmatic scroll-to-index. May need binary search for variable-height items.',
  // useDate
  'construction': 'Creating date instances from various inputs (null, ISO string, Date object).',
  'formatting': 'Converting dates to display strings. Called frequently in calendar UIs.',
  'navigation': 'Computing start-of-day, start-of-week, start-of-month for calendar navigation.',
  'arithmetic': 'Adding days, months, years. Used for date range calculations.',
  'comparison': 'isAfter, isSameDay, and similar checks. Used heavily in date range validation.',
  'getters/setters': 'Reading and writing individual date components (year, month, day, hour).',
  'locale switching': 'Changing locale and reformatting. Tests adapter cache invalidation.',
}

// Module-level cache so re-visits don't re-fetch
let cachedData: ShallowRef<RawBenchmarkFile[] | null> | null = null

function formatHz (hz: number): string {
  if (hz >= 1_000_000) return `${(hz / 1_000_000).toFixed(1)}M ops/s`
  if (hz >= 1000) return `${(hz / 1000).toFixed(1)}k ops/s`
  return `${Math.round(hz)} ops/s`
}

function formatMean (mean: number): string {
  if (mean < 0.000_001) return `${(mean * 1_000_000_000).toFixed(0)}ns`
  if (mean < 0.001) return `${(mean * 1_000_000).toFixed(1)}μs`
  if (mean < 1) return `${(mean * 1000).toFixed(1)}ms`
  return `${mean.toFixed(1)}s`
}

function extractComposableName (filepath: string): string {
  const match = filepath.match(/composables\/(\w+)\//)
  return match?.[1] ?? filepath
}

function extractGroupName (fullName: string): string {
  const parts = fullName.split(' > ')
  return parts.length > 1 ? parts.slice(1).join(' > ') : fullName
}

function normalizeFiles (
  files: RawBenchmarkFile[],
  metricsData: Record<string, { benchmarks?: Record<string, { tier?: Tier }> }>,
): NormalizedComposable[] {
  return files.map(file => {
    const composableName = extractComposableName(file.filepath)
    const metrics = metricsData[composableName]
    const tier = (metrics?.benchmarks?._fastest as { tier?: Tier } | undefined)?.tier ?? 'good'

    const groups: NormalizedGroup[] = file.groups.map((group, gi) => {
      const groupName = extractGroupName(group.fullName)
      const maxHz = Math.max(...group.benchmarks.map(b => b.hz))

      const benchmarks: NormalizedBenchmark[] = group.benchmarks
        .map(b => {
          const relativeHz = maxHz > 0 ? (b.hz / maxHz) * 100 : 0
          const isFastest = b.hz === maxHz
          return {
            id: b.id,
            name: b.name,
            hz: b.hz,
            hzLabel: formatHz(b.hz),
            mean: b.mean,
            meanLabel: formatMean(b.mean),
            rme: b.rme,
            rank: b.rank,
            relativeHz,
            diffFromFastest: isFastest ? null : ((maxHz - b.hz) / maxHz) * 100,
          }
        })
        .toSorted((a, b) => b.hz - a.hz)

      return {
        id: `${composableName}-${gi}`,
        name: groupName,
        fullName: group.fullName,
        composable: composableName,
        benchmarks,
        fastest: benchmarks[0]!,
      }
    })

    let overallFastest = groups[0]?.fastest
    for (const g of groups) {
      if (!overallFastest || g.fastest.hz > overallFastest.hz) {
        overallFastest = g.fastest
      }
    }

    return {
      name: composableName,
      tier,
      fastest: overallFastest
        ? { name: overallFastest.name, hz: overallFastest.hz, hzLabel: overallFastest.hzLabel }
        : { name: '', hz: 0, hzLabel: '0 ops/s' },
      groupCount: groups.length,
      benchmarkCount: groups.reduce((sum, g) => sum + g.benchmarks.length, 0),
      groups,
    }
  })
}

export function useBenchmarkData (options?: UseBenchmarkDataOptions): UseBenchmarkDataReturn {
  const isLoading = shallowRef(false)

  if (!cachedData) {
    cachedData = shallowRef(null)
  }

  const rawData = cachedData
  const metricsData = shallowRef<Record<string, { benchmarks?: Record<string, { tier?: Tier }> }>>({})

  // v0 composables for selection state
  const composableSelection = createGroup({ multiple: true })
  const tierSelection = createGroup({ multiple: true })
  const expandedGroups = createGroup({ multiple: true })

  // v0 filter for search
  const filter = createFilter({ mode: 'some' })

  const sortBy = shallowRef<'hz' | 'mean' | 'rme'>('hz')
  const sortDesc = shallowRef(true)

  // Fetch full benchmark data
  onBeforeMount(async () => {
    const m = await import('@/data/metrics.json')
    metricsData.value = m.default as Record<string, { benchmarks?: Record<string, { tier?: Tier }> }>

    if (!rawData.value) {
      isLoading.value = true
      try {
        const response = await fetch('/benchmarks.json')
        const json = await response.json() as { files: RawBenchmarkFile[] }
        rawData.value = json.files
      } catch {
        rawData.value = []
      } finally {
        isLoading.value = false
      }
    }
  })

  // Normalized composables
  const composables = computed<NormalizedComposable[]>(() => {
    if (!rawData.value) return []
    const all = normalizeFiles(rawData.value, metricsData.value)
    if (options?.composable) {
      return all.filter(c => c.name === options.composable)
    }
    return all
  })

  // Build a searchable flat list for createFilter
  const allGroups = computed(() => composables.value.flatMap(c => c.groups))

  const searchableGroups = computed(() =>
    allGroups.value.map(g => ({
      ...g,
      // Concatenate all benchmark names for searchability
      _searchText: [g.name, ...g.benchmarks.map(b => b.name)].join(' '),
    })),
  )

  const { items: searchFilteredGroups } = filter.apply(
    () => filter.query.value,
    searchableGroups,
  )

  // Filtered and sorted groups
  const filteredGroups = computed<NormalizedGroup[]>(() => {
    let groups = searchFilteredGroups.value as (NormalizedGroup & { _searchText: string })[]

    // Composable filter via createGroup selectedIds
    if (composableSelection.selectedIds.size > 0) {
      groups = groups.filter(g => composableSelection.selectedIds.has(g.composable))
    }

    // Tier filter via createGroup selectedIds
    if (tierSelection.selectedIds.size > 0) {
      const composableTiers = new Map(composables.value.map(c => [c.name, c.tier]))
      groups = groups.filter(g => {
        const tier = composableTiers.get(g.composable)
        return tier && tierSelection.selectedIds.has(tier)
      })
    }

    // Sort benchmarks within each group
    const field = sortBy.value
    const desc = sortDesc.value
    return groups.map(g => ({
      ...g,
      benchmarks: g.benchmarks.toSorted((a, b) => {
        const diff = a[field] - b[field]
        return desc ? -diff : diff
      }),
    }))
  })

  // Summary (unfiltered)
  const summary = computed<BenchmarkSummary>(() => {
    const tierCounts: Record<Tier, number> = { blazing: 0, fast: 0, good: 0 }
    for (const c of composables.value) {
      tierCounts[c.tier]++
    }
    return {
      totalBenchmarks: composables.value.reduce((s, c) => s + c.benchmarkCount, 0),
      totalGroups: composables.value.reduce((s, c) => s + c.groupCount, 0),
      composableCount: composables.value.length,
      tierCounts,
    }
  })

  function expandAll () {
    for (const g of filteredGroups.value) {
      if (!expandedGroups.selected(g.id)) {
        expandedGroups.select(g.id)
      }
    }
  }

  function collapseAll () {
    expandedGroups.reset()
  }

  function clearFilters () {
    filter.query.value = ''
    composableSelection.reset()
    tierSelection.reset()
  }

  return {
    isLoading,
    composables,
    filteredGroups,
    summary,
    filter,
    composableSelection,
    tierSelection,
    expandedGroups,
    sortBy,
    sortDesc,
    expandAll,
    collapseAll,
    clearFilters,
  }
}
