import { describe, expect, it } from 'vitest'

import { derivePlacement } from './placement'

describe('derivePlacement', () => {
  it('should derive side from a single-keyword value', () => {
    expect(derivePlacement('top')).toEqual({ side: 'top', align: 'center', raw: 'top' })
    expect(derivePlacement('bottom')).toEqual({ side: 'bottom', align: 'center', raw: 'bottom' })
    expect(derivePlacement('left')).toEqual({ side: 'left', align: 'center', raw: 'left' })
    expect(derivePlacement('right')).toEqual({ side: 'right', align: 'center', raw: 'right' })
  })

  it('should derive align=start from a span-left/span-start modifier', () => {
    expect(derivePlacement('top span-left').align).toBe('start')
    expect(derivePlacement('bottom span-start').align).toBe('start')
  })

  it('should derive align=end from a span-right/span-end modifier', () => {
    expect(derivePlacement('top span-right').align).toBe('end')
    expect(derivePlacement('bottom span-end').align).toBe('end')
  })

  it('should map logical block-start/block-end to top/bottom', () => {
    expect(derivePlacement('block-start').side).toBe('top')
    expect(derivePlacement('block-end').side).toBe('bottom')
  })

  it('should map logical inline-start/inline-end to top/bottom', () => {
    expect(derivePlacement('inline-start').side).toBe('top')
    expect(derivePlacement('inline-end').side).toBe('bottom')
  })

  it('should fall back to bottom/center for an unrecognized value', () => {
    expect(derivePlacement('center')).toEqual({ side: 'bottom', align: 'center', raw: 'center' })
  })

  it('should always preserve the original value in raw, even when unrecognized', () => {
    const placement = derivePlacement('span-all block-start')
    expect(placement.raw).toBe('span-all block-start')
  })
})
