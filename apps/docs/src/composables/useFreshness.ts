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
  introduction: number
  skillz: number
  reference: number
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
 * Map a 0–100 score to an avocado-themed color: fresh green at 100, olive
 * around 75, browning by 50, pit-brown by 25, overripe by 0. Linear-interpolated
 * between stops via CSS color-mix.
 */
const SCORE_STOPS: { score: number, color: string }[] = [
  { score: 0, color: '#3a1f0c' },
  { score: 25, color: '#6e3e1c' },
  { score: 50, color: '#7a6132' },
  { score: 75, color: '#5a6e2a' },
  { score: 100, color: '#4a8c1f' },
]

export function scoreToColor (score: number): string {
  const clamped = Math.max(0, Math.min(100, score))
  for (let i = 0; i < SCORE_STOPS.length - 1; i++) {
    const a = SCORE_STOPS[i]
    const b = SCORE_STOPS[i + 1]
    if (clamped <= b.score) {
      const t = (clamped - a.score) / (b.score - a.score)
      return `color-mix(in srgb, ${a.color}, ${b.color} ${t * 100}%)`
    }
  }
  return SCORE_STOPS.at(-1)!.color
}

/**
 * Map a 0–100 score to a CSS filter that tints a multi-color avocado SVG.
 * Fresh score keeps colors as-authored; lower scores shift greens toward olive
 * and brown via hue-rotate + sepia + reduced brightness.
 */
export function scoreToFilter (score: number): string {
  const clamped = Math.max(0, Math.min(100, score))
  const t = (100 - clamped) / 100
  const sepia = (t * 0.55).toFixed(2)
  const hue = (-t * 25).toFixed(0)
  const saturate = (1 - t * 0.3).toFixed(2)
  const brightness = (1 - t * 0.25).toFixed(2)
  return `sepia(${sepia}) hue-rotate(${hue}deg) saturate(${saturate}) brightness(${brightness})`
}

function categoryOf (path: string): string {
  if (path.startsWith('/components/')) return 'components'
  if (path.startsWith('/composables/')) return 'composables'
  if (path.startsWith('/guide/')) return 'guide'
  if (path.startsWith('/introduction/')) return 'introduction'
  if (path.startsWith('/skillz/')) return 'skillz'
  if (path.startsWith('/api/')) return 'reference'
  if (path === '/releases' || path === '/roadmap') return 'reference'
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
    introduction: meanOf(p => p.category === 'introduction'),
    skillz: meanOf(p => p.category === 'skillz'),
    reference: meanOf(p => p.category === 'reference'),
    pages: details,
  }
}

export interface UseFreshnessReturn {
  overall: Ref<number>
  components: Ref<number>
  composables: Ref<number>
  guides: Ref<number>
  introduction: Ref<number>
  skillz: Ref<number>
  reference: Ref<number>
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
    introduction: toRef(() => result.value.introduction),
    skillz: toRef(() => result.value.skillz),
    reference: toRef(() => result.value.reference),
    pages: toRef(() => result.value.pages),
  }
}
