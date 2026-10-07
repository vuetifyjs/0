import { describe, expect, it } from 'vitest'

// Framework
import { isUndefined } from '@vuetify/v0'

import { sparklinePath, type SparklineCoord } from './sparklinePath'

function sample (path: string, coords: SparklineCoord[]): SparklineCoord[] {
  const sampled: SparklineCoord[] = []
  const commands = path.match(/[MLC][^MLC]*/g) ?? []
  let cursor = coords[0]
  if (!cursor) return sampled

  for (const command of commands) {
    const kind = command[0]
    const nums = command.slice(1).trim().split(/[\s,]+/).map(Number)
    if (kind === 'M' || kind === 'L') {
      cursor = { x: nums[0] ?? cursor.x, y: nums[1] ?? cursor.y }
      sampled.push(cursor)
      continue
    }
    const c1 = { x: nums[0] ?? 0, y: nums[1] ?? 0 }
    const c2 = { x: nums[2] ?? 0, y: nums[3] ?? 0 }
    const end = { x: nums[4] ?? 0, y: nums[5] ?? 0 }
    for (const t of [0.25, 0.5, 0.75]) {
      const u = 1 - t
      sampled.push({
        x: (u ** 3) * cursor.x + 3 * (u ** 2) * t * c1.x + 3 * u * (t ** 2) * c2.x + (t ** 3) * end.x,
        y: (u ** 3) * cursor.y + 3 * (u ** 2) * t * c1.y + 3 * u * (t ** 2) * c2.y + (t ** 3) * end.y,
      })
    }
    sampled.push(end)
    cursor = end
  }
  return sampled
}

describe('sparklinePath', () => {
  it('should draw a straight segment for two points', () => {
    expect(sparklinePath([{ x: 0, y: 10 }, { x: 20, y: 4 }])).toBe('M 0.00 10.00 L 20.00 4.00')
  })

  it('should stay on a straight run of points', () => {
    const coords = [
      { x: 0, y: 0 },
      { x: 10, y: 10 },
      { x: 20, y: 20 },
      { x: 30, y: 30 },
    ]
    const sampled = sample(sparklinePath(coords), coords)
    expect(sampled.length).toBeGreaterThan(coords.length)
    for (const point of sampled) {
      expect(point.y).toBeCloseTo(point.x, 1)
    }
  })

  it('should keep each segment inside its endpoints', () => {
    const coords = [
      { x: 0, y: 2 },
      { x: 10, y: 18 },
      { x: 20, y: 4 },
      { x: 30, y: 16 },
    ]
    const sampled = sample(sparklinePath(coords), coords).slice(1)
    expect(sampled).toHaveLength((coords.length - 1) * 4)

    for (let index = 0; index < coords.length - 1; index++) {
      const start = coords[index]
      const end = coords[index + 1]
      if (isUndefined(start) || isUndefined(end)) {
        expect.unreachable('segment endpoints missing')
        return
      }
      const low = Math.min(start.y, end.y) - 0.05
      const high = Math.max(start.y, end.y) + 0.05
      for (const point of sampled.slice(index * 4, (index + 1) * 4)) {
        expect(point.y).toBeGreaterThanOrEqual(low)
        expect(point.y).toBeLessThanOrEqual(high)
      }
    }
  })
})
