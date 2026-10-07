// Framework
import { isUndefined } from '@vuetify/v0'

export interface SparklineCoord {
  x: number
  y: number
}

function num (value: number): string {
  return value.toFixed(2)
}

/**
 * Monotone cubic through every point. A cardinal spline overshoots, and on a
 * sparkline that draws a release faster or slower than anything we measured.
 * Fritsch–Carlson keeps each segment inside its endpoints.
 */
export function sparklinePath (coords: readonly SparklineCoord[]): string {
  const n = coords.length
  if (n < 2) return ''

  const first = coords[0]
  const last = coords[n - 1]
  if (isUndefined(first) || isUndefined(last)) return ''
  if (n === 2) return `M ${num(first.x)} ${num(first.y)} L ${num(last.x)} ${num(last.y)}`

  const slope: number[] = []
  for (let i = 0; i < n - 1; i++) {
    const a = coords[i]
    const b = coords[i + 1]
    // A hole would shift every later slope. Refuse the path instead of drawing it wrong.
    if (isUndefined(a) || isUndefined(b)) return ''
    const dx = b.x - a.x
    slope.push(dx === 0 ? 0 : (b.y - a.y) / dx)
  }

  const tangent = Array.from({ length: n }, () => 0)
  const start = slope[0]
  const end = slope[n - 2]
  if (!isUndefined(start)) tangent[0] = start
  if (!isUndefined(end)) tangent[n - 1] = end

  for (let i = 1; i < n - 1; i++) {
    const left = slope[i - 1]
    const right = slope[i]
    tangent[i] = isUndefined(left) || isUndefined(right) || left * right <= 0 ? 0 : (left + right) / 2
  }

  for (let i = 0; i < n - 1; i++) {
    const delta = slope[i]
    const left = tangent[i]
    const right = tangent[i + 1]
    if (isUndefined(delta) || isUndefined(left) || isUndefined(right)) return ''
    if (delta === 0) {
      tangent[i] = 0
      tangent[i + 1] = 0
      continue
    }
    const alpha = left / delta
    const beta = right / delta
    const sum = alpha * alpha + beta * beta
    if (sum > 9) {
      const scale = 3 / Math.sqrt(sum)
      tangent[i] = scale * alpha * delta
      tangent[i + 1] = scale * beta * delta
    }
  }

  let d = `M ${num(first.x)} ${num(first.y)}`
  for (let i = 0; i < n - 1; i++) {
    const a = coords[i]
    const b = coords[i + 1]
    const m0 = tangent[i]
    const m1 = tangent[i + 1]
    if (isUndefined(a) || isUndefined(b) || isUndefined(m0) || isUndefined(m1)) return ''
    const dx = b.x - a.x
    const c1x = a.x + dx / 3
    const c1y = a.y + m0 * dx / 3
    const c2x = b.x - dx / 3
    const c2y = b.y - m1 * dx / 3
    d += ` C ${num(c1x)} ${num(c1y)}, ${num(c2x)} ${num(c2y)}, ${num(b.x)} ${num(b.y)}`
  }
  return d
}
