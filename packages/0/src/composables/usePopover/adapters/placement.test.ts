import { describe, expect, it } from 'vitest'

import { toPlacement } from './placement'

describe('toPlacement', () => {
  it('should derive side from a single-keyword value', () => {
    expect(toPlacement('top')).toEqual({ side: 'top', align: 'center', raw: 'top' })
    expect(toPlacement('bottom')).toEqual({ side: 'bottom', align: 'center', raw: 'bottom' })
    expect(toPlacement('left')).toEqual({ side: 'left', align: 'center', raw: 'left' })
    expect(toPlacement('right')).toEqual({ side: 'right', align: 'center', raw: 'right' })
  })

  it('should derive align=start from a span-left/span-start modifier', () => {
    expect(toPlacement('top span-left').align).toBe('start')
    expect(toPlacement('bottom span-start').align).toBe('start')
  })

  it('should derive align=end from a span-right/span-end modifier', () => {
    expect(toPlacement('top span-right').align).toBe('end')
    expect(toPlacement('bottom span-end').align).toBe('end')
  })

  it('should map logical block-start/block-end to top/bottom', () => {
    expect(toPlacement('block-start').side).toBe('top')
    expect(toPlacement('block-end').side).toBe('bottom')
  })

  it('should map logical inline-start/inline-end to left/right, not top/bottom', () => {
    expect(toPlacement('inline-start').side).toBe('left')
    expect(toPlacement('inline-end').side).toBe('right')
  })

  it('should fall back to bottom/center for an unrecognized value', () => {
    expect(toPlacement('center')).toEqual({ side: 'bottom', align: 'center', raw: 'center' })
  })

  it('should always preserve the original value in raw, even when unrecognized', () => {
    const placement = toPlacement('span-all block-start')
    expect(placement.raw).toBe('span-all block-start')
  })
})
