import { describe, expect, it } from 'vitest'

import { apca, foreground } from './apca'

describe('apca', () => {
  it('should return high contrast for black text on white background', () => {
    const contrast = apca({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 })
    expect(Math.abs(contrast)).toBeGreaterThan(100)
  })

  it('should return high contrast for white text on black background', () => {
    const contrast = apca({ r: 255, g: 255, b: 255 }, { r: 0, g: 0, b: 0 })
    expect(Math.abs(contrast)).toBeGreaterThan(100)
  })

  it('should return low contrast for similar colors', () => {
    const contrast = apca({ r: 128, g: 128, b: 128 }, { r: 130, g: 130, b: 130 })
    expect(Math.abs(contrast)).toBeLessThan(5)
  })
})

describe('foreground', () => {
  it('should return white for dark backgrounds', () => {
    expect(foreground('#1976d2')).toBe('#ffffff')
    expect(foreground('#000000')).toBe('#ffffff')
    expect(foreground('#333333')).toBe('#ffffff')
  })

  it('should return black for light backgrounds', () => {
    expect(foreground('#ffffff')).toBe('#000000')
    expect(foreground('#ffeb3b')).toBe('#000000')
    expect(foreground('#e0e0e0')).toBe('#000000')
  })
})
