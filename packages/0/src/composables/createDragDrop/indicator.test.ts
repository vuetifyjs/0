import { describe, expect, it } from 'vitest'

import { resolveDropPosition } from './indicator'

function rect (top: number, height: number): DOMRect {
  return {
    top,
    bottom: top + height,
    left: 0,
    right: 100,
    width: 100,
    height,
    x: 0,
    y: top,
    toJSON: () => ({}),
  } as DOMRect
}

describe('resolveDropPosition', () => {
  it('should return index 0 with edge "before" when pointer is above first item', () => {
    const rects = [rect(0, 50), rect(50, 50), rect(100, 50)]

    const result = resolveDropPosition({ x: 0, y: -10 }, rects, 'vertical')

    expect(result).toEqual({ index: 0, edge: 'before', rect: rects[0] })
  })

  it('should return index N with edge "after" when pointer is past last item', () => {
    const rects = [rect(0, 50), rect(50, 50), rect(100, 50)]

    const result = resolveDropPosition({ x: 0, y: 200 }, rects, 'vertical')

    expect(result).toEqual({ index: 3, edge: 'after', rect: rects[2] })
  })

  it('should pick "before" when pointer is in the upper half of an item', () => {
    const rects = [rect(0, 50), rect(50, 50)]

    const result = resolveDropPosition({ x: 0, y: 60 }, rects, 'vertical')

    expect(result?.index).toBe(1)
    expect(result?.edge).toBe('before')
  })

  it('should pick "after" when pointer is in the lower half of an item', () => {
    const rects = [rect(0, 50), rect(50, 50)]

    const result = resolveDropPosition({ x: 0, y: 80 }, rects, 'vertical')

    expect(result?.index).toBe(2)
    expect(result?.edge).toBe('after')
  })

  it('should return null when rects array is empty', () => {
    const result = resolveDropPosition({ x: 0, y: 0 }, [], 'vertical')

    expect(result).toBeNull()
  })

  it('should switch to x-axis math for horizontal orientation', () => {
    const horizontalRects: DOMRect[] = [
      { top: 0, bottom: 50, left: 0, right: 50, width: 50, height: 50, x: 0, y: 0, toJSON: () => ({}) } as DOMRect,
      { top: 0, bottom: 50, left: 50, right: 100, width: 50, height: 50, x: 50, y: 0, toJSON: () => ({}) } as DOMRect,
    ]

    const result = resolveDropPosition({ x: 60, y: 0 }, horizontalRects, 'horizontal')

    expect(result?.index).toBe(1)
    expect(result?.edge).toBe('before')
  })
})
