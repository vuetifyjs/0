import { describe, expect, it } from 'vitest'

import { hexToRgb, rgbToHex } from './color'

describe('hexToRgb', () => {
  it('should parse 6-digit hex', () => {
    expect(hexToRgb('#1976d2')).toEqual({ r: 25, g: 118, b: 210 })
  })

  it('should parse 8-digit hex with alpha', () => {
    expect(hexToRgb('#1976d280')).toEqual({ r: 25, g: 118, b: 210, a: 128 })
  })

  it('should parse 3-digit shorthand', () => {
    expect(hexToRgb('#fff')).toEqual({ r: 255, g: 255, b: 255 })
  })

  it('should handle without hash', () => {
    expect(hexToRgb('1976d2')).toEqual({ r: 25, g: 118, b: 210 })
  })
})

describe('rgbToHex', () => {
  it('should convert rgb to hex', () => {
    expect(rgbToHex({ r: 25, g: 118, b: 210 })).toBe('#1976d2')
  })

  it('should convert rgb with alpha to 8-digit hex', () => {
    expect(rgbToHex({ r: 25, g: 118, b: 210, a: 128 })).toBe('#1976d280')
  })

  it('should pad single-digit channels', () => {
    expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe('#000000')
  })
})
