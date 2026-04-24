// Virtual module (emitted by generate-page-dates.ts)
import pageDatesModule from 'virtual:page-dates'

// Framework
import { isNullOrUndefined } from '@vuetify/v0'

// Utilities
import { computed, toRef, toValue } from 'vue'

// Types
import type { PageDates } from '@build/generate-page-dates'
import type { MaybeRefOrGetter, Ref } from 'vue'

const DAY_MS = 24 * 60 * 60 * 1000

export interface PageFreshnessInput {
  updated: string
  hash: string
  history: string[]
}

export interface PageFreshness {
  path: string
  score: number
  ageMs: number
  updated: string
  hash: string
  category: string
}

export interface FreshnessResult {
  overall: number
  components: number
  composables: number
  guides: number
  pages: PageFreshness[]
}

const pageDates: PageDates = pageDatesModule

/**
 * Bucket an age in milliseconds into a 0/25/50/75/100 score.
 * Boundaries match the existing nav heatmap: ≤7d, ≤30d, ≤90d, ≤180d, >180d.
 */
export function bucketAge (ageMs: number): number {
  if (ageMs <= 7 * DAY_MS) return 100
  if (ageMs <= 30 * DAY_MS) return 75
  if (ageMs <= 90 * DAY_MS) return 50
  if (ageMs <= 180 * DAY_MS) return 25
  return 0
}

/**
 * Map a 0–100 score to a CSS color-mix string between --v0-success and --v0-error.
 * Mirrors AppNavLink.vue's heatmap formula: score 100 → pure success, score 0 → pure error.
 */
export function scoreToColor (score: number): string {
  const clamped = Math.max(0, Math.min(100, score))
  const t = 100 - clamped
  return `color-mix(in srgb, var(--v0-success), var(--v0-error) ${t}%)`
}

function categoryOf (path: string): string {
  if (path.startsWith('/components/')) return 'components'
  if (path.startsWith('/composables/')) return 'composables'
  if (path.startsWith('/guide/')) return 'guide'
  if (path.startsWith('/introduction/')) return 'introduction'
  if (path.startsWith('/skillz/')) return 'skillz'
  if (path.startsWith('/api/')) return 'api'
  return 'other'
}

/**
 * Pure, deterministic scoring function.
 * Pages whose earliest commit is after `asOf` are excluded (they did not exist yet).
 * Pages with an empty history are treated as brand-new and score 100.
 */
export function computeFreshness (
  pages: Record<string, PageFreshnessInput>,
  asOf: Date,
): FreshnessResult {
  const asOfMs = asOf.getTime()
  const details: PageFreshness[] = []

  for (const [path, entry] of Object.entries(pages)) {
    if (entry.history.length === 0) {
      details.push({
        path,
        score: 100,
        ageMs: 0,
        updated: entry.updated,
        hash: entry.hash,
        category: categoryOf(path),
      })
      continue
    }

    const effective = entry.history.find(iso => Date.parse(iso) <= asOfMs)
    if (isNullOrUndefined(effective)) continue

    const ageMs = asOfMs - Date.parse(effective)
    details.push({
      path,
      score: bucketAge(ageMs),
      ageMs,
      updated: effective,
      hash: entry.hash,
      category: categoryOf(path),
    })
  }

  function meanOf (filterFn: (p: PageFreshness) => boolean): number {
    const subset = details.filter(filterFn)
    if (subset.length === 0) return 0
    const total = subset.reduce((acc, p) => acc + p.score, 0)
    return Math.round(total / subset.length)
  }

  return {
    overall: meanOf(() => true),
    components: meanOf(p => p.category === 'components'),
    composables: meanOf(p => p.category === 'composables'),
    guides: meanOf(p => p.category === 'guide'),
    pages: details,
  }
}

export interface UseFreshnessReturn {
  overall: Ref<number>
  components: Ref<number>
  composables: Ref<number>
  guides: Ref<number>
  pages: Ref<PageFreshness[]>
}

/**
 * Reactive wrapper over computeFreshness. Defaults asOf to `new Date()`.
 * For the sparkline, pass a distinct asOf per checkpoint.
 */
export function useFreshness (asOf?: MaybeRefOrGetter<Date>): UseFreshnessReturn {
  const result = computed(() => {
    const when = toValue(asOf) ?? new Date()
    const clamped = when.getTime() > Date.now() ? new Date() : when
    return computeFreshness(pageDates, clamped)
  })

  return {
    overall: toRef(() => result.value.overall),
    components: toRef(() => result.value.components),
    composables: toRef(() => result.value.composables),
    guides: toRef(() => result.value.guides),
    pages: toRef(() => result.value.pages),
  }
}
