// Utilities
import { isUndefined } from '#v0/utilities'

export interface RGB {
  r: number
  g: number
  b: number
  a?: number
}

/* #__NO_SIDE_EFFECTS__ */
export function hexToRgb (hex: string): RGB {
  const clean = hex.startsWith('#') ? hex.slice(1) : hex

  if (clean.length === 3 || clean.length === 4) {
    const r = Number.parseInt(clean[0] + clean[0], 16)
    const g = Number.parseInt(clean[1] + clean[1], 16)
    const b = Number.parseInt(clean[2] + clean[2], 16)
    const a = clean.length === 4 ? Number.parseInt(clean[3] + clean[3], 16) : undefined

    return isUndefined(a) ? { r, g, b } : { r, g, b, a }
  }

  const r = Number.parseInt(clean.slice(0, 2), 16)
  const g = Number.parseInt(clean.slice(2, 4), 16)
  const b = Number.parseInt(clean.slice(4, 6), 16)
  const a = clean.length === 8 ? Number.parseInt(clean.slice(6, 8), 16) : undefined

  return isUndefined(a) ? { r, g, b } : { r, g, b, a }
}

/* #__NO_SIDE_EFFECTS__ */
export function rgbToHex ({ r, g, b, a }: RGB): string {
  const hex = '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('')
  if (!isUndefined(a)) return hex + a.toString(16).padStart(2, '0')
  return hex
}
