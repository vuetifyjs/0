/**
 * @internal
 *
 * @remarks
 * Pure math for resolving where in an oriented zone a pointer would drop.
 * Not exported from the createDragDrop barrel — consumed only by the factory.
 */

type Orientation = 'vertical' | 'horizontal'

export interface ResolvedPosition {
  index: number
  edge: 'before' | 'after'
  rect: DOMRect
}

export function resolveDropPosition (
  point: { x: number, y: number },
  rects: readonly DOMRect[],
  orientation: Orientation,
): ResolvedPosition | null {
  if (rects.length === 0) return null

  const axis = orientation === 'vertical' ? 'y' : 'x'
  const start = orientation === 'vertical' ? 'top' : 'left'
  const end = orientation === 'vertical' ? 'bottom' : 'right'

  const coord = point[axis]

  if (coord < rects[0][start]) {
    return { index: 0, edge: 'before', rect: rects[0] }
  }

  const last = rects.at(-1)!
  if (coord > last[end]) {
    return { index: rects.length, edge: 'after', rect: last }
  }

  for (const [i, r] of rects.entries()) {
    if (coord >= r[start] && coord <= r[end]) {
      const mid = r[start] + (r[end] - r[start]) / 2
      if (coord < mid) {
        return { index: i, edge: 'before', rect: r }
      }
      return { index: i + 1, edge: 'after', rect: r }
    }
  }

  return { index: rects.length, edge: 'after', rect: last }
}
