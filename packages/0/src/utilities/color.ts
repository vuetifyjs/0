export interface RGB {
  r: number
  g: number
  b: number
  a?: number
}

export function hexToRgb (hex: string): RGB {
  const clean = hex.startsWith('#') ? hex.slice(1) : hex

  let r: number, g: number, b: number, a: number | undefined

  if (clean.length === 3 || clean.length === 4) {
    r = Number.parseInt(clean[0] + clean[0], 16)
    g = Number.parseInt(clean[1] + clean[1], 16)
    b = Number.parseInt(clean[2] + clean[2], 16)
    if (clean.length === 4) a = Number.parseInt(clean[3] + clean[3], 16)
  } else {
    r = Number.parseInt(clean.slice(0, 2), 16)
    g = Number.parseInt(clean.slice(2, 4), 16)
    b = Number.parseInt(clean.slice(4, 6), 16)
    if (clean.length === 8) a = Number.parseInt(clean.slice(6, 8), 16)
  }

  const rgb: RGB = { r, g, b }
  if (a !== undefined) rgb.a = a

  return rgb
}

export function rgbToHex ({ r, g, b, a }: RGB): string {
  const hex = '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('')
  if (a !== undefined) return hex + a.toString(16).padStart(2, '0')
  return hex
}
