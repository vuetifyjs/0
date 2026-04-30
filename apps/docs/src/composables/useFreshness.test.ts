import { describe, it, expect } from 'vitest'

// Composables
import { bucketAge, computeFreshness, scoreToColor } from './useFreshness'

// Types
import type { PageFreshnessInput } from './useFreshness'

const DAY_MS = 24 * 60 * 60 * 1000
const NOW = new Date('2026-04-24T12:00:00Z')

function iso (daysAgo: number): string {
  return new Date(NOW.getTime() - daysAgo * DAY_MS).toISOString()
}

function page (path: string, ...daysAgoList: number[]): [string, PageFreshnessInput] {
  return [
    path,
    { updated: iso(daysAgoList[0] ?? 0), hash: 'abc', history: daysAgoList.map(iso) },
  ]
}

describe('bucketAge', () => {
  it('returns 100 for age ≤ 7 days', () => {
    expect(bucketAge(0)).toBe(100)
    expect(bucketAge(7 * DAY_MS)).toBe(100)
  })

  it('returns 75 for age > 7 and ≤ 30 days', () => {
    expect(bucketAge(7 * DAY_MS + 1)).toBe(75)
    expect(bucketAge(30 * DAY_MS)).toBe(75)
  })

  it('returns 50 for age > 30 and ≤ 90 days', () => {
    expect(bucketAge(30 * DAY_MS + 1)).toBe(50)
    expect(bucketAge(90 * DAY_MS)).toBe(50)
  })

  it('returns 25 for age > 90 and ≤ 180 days', () => {
    expect(bucketAge(90 * DAY_MS + 1)).toBe(25)
    expect(bucketAge(180 * DAY_MS)).toBe(25)
  })

  it('returns 0 for age > 180 days', () => {
    expect(bucketAge(180 * DAY_MS + 1)).toBe(0)
    expect(bucketAge(400 * DAY_MS)).toBe(0)
  })
})

describe('computeFreshness', () => {
  it('returns all zeros for an empty map', () => {
    const result = computeFreshness({}, NOW)
    expect(result.overall).toBe(0)
    expect(result.components).toBe(0)
    expect(result.composables).toBe(0)
    expect(result.guides).toBe(0)
    expect(result.pages).toEqual([])
  })

  it('scores a fresh page at 100', () => {
    const pages = Object.fromEntries([page('/components/dialog', 2)])
    expect(computeFreshness(pages, NOW).overall).toBe(100)
  })

  it('scores a very stale page at 0', () => {
    const pages = Object.fromEntries([page('/components/dialog', 200)])
    expect(computeFreshness(pages, NOW).overall).toBe(0)
  })

  it('averages across pages', () => {
    const pages = Object.fromEntries([
      page('/components/a', 2),
      page('/components/b', 200),
    ])
    expect(computeFreshness(pages, NOW).overall).toBe(50)
  })

  it('treats a page with an empty history as fresh (score 100)', () => {
    const pages: Record<string, PageFreshnessInput> = {
      '/components/new': { updated: '', hash: '', history: [] },
    }
    expect(computeFreshness(pages, NOW).overall).toBe(100)
  })

  it('uses the most recent commit ≤ asOf for historical queries', () => {
    const pages = Object.fromEntries([page('/components/dialog', 3, 10)])
    expect(computeFreshness(pages, NOW).overall).toBe(100)
    const asOfMinus5d = new Date(NOW.getTime() - 5 * DAY_MS)
    expect(computeFreshness(pages, asOfMinus5d).overall).toBe(100)
  })

  it('excludes pages whose earliest commit is after asOf', () => {
    const pages = Object.fromEntries([
      page('/components/new', 5),
      page('/components/ancient', 100),
    ])
    const asOfMinus50d = new Date(NOW.getTime() - 50 * DAY_MS)
    expect(computeFreshness(pages, asOfMinus50d).overall).toBe(50)
  })

  it('computes category sub-scores from route prefixes', () => {
    const pages = Object.fromEntries([
      page('/components/a', 2),
      page('/components/b', 200),
      page('/composables/c', 60),
      page('/guide/d', 200),
      page('/introduction/e', 200),
    ])
    const result = computeFreshness(pages, NOW)
    expect(result.components).toBe(50)
    expect(result.composables).toBe(50)
    expect(result.guides).toBe(0)
    expect(result.overall).toBe(30)
  })

  it('returns per-page PageFreshness entries with score and age', () => {
    const pages = Object.fromEntries([page('/components/dialog', 2)])
    const result = computeFreshness(pages, NOW)
    expect(result.pages).toHaveLength(1)
    const [first] = result.pages
    expect(first.path).toBe('/components/dialog')
    expect(first.score).toBe(100)
    expect(first.ageMs).toBeCloseTo(2 * DAY_MS, -4)
  })
})

describe('scoreToColor', () => {
  it('should map score 100 to fresh avocado green', () => {
    expect(scoreToColor(100)).toBe('color-mix(in srgb, #5a6e2a, #4a8c1f 100%)')
  })

  it('should map score 0 to overripe brown', () => {
    expect(scoreToColor(0)).toBe('color-mix(in srgb, #3a1f0c, #6e3e1c 0%)')
  })

  it('should map score 50 to olive-brown stop', () => {
    expect(scoreToColor(50)).toBe('color-mix(in srgb, #6e3e1c, #7a6132 100%)')
  })

  it('should clamp above 100 to fresh and below 0 to overripe', () => {
    expect(scoreToColor(150)).toBe('color-mix(in srgb, #5a6e2a, #4a8c1f 100%)')
    expect(scoreToColor(-10)).toBe('color-mix(in srgb, #3a1f0c, #6e3e1c 0%)')
  })

  it('should interpolate between stops', () => {
    expect(scoreToColor(87.5)).toBe('color-mix(in srgb, #5a6e2a, #4a8c1f 50%)')
  })
})
