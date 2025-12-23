// Utilities
import { ref } from 'vue'

function getLuminance (r: number, g: number, b: number): number {
  const [red = 0, green = 0, blue = 0] = [r, g, b].map(value => {
    const normalized = value / 255
    return normalized <= 0.039_28
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

function parseRgba (color: string): { r: number, g: number, b: number } | null {
  const match = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+),\s*\d*\.?\d*\)$/)
  if (match && match[1] && match[2] && match[3]) {
    return {
      r: Number.parseInt(match[1], 10),
      g: Number.parseInt(match[2], 10),
      b: Number.parseInt(match[3], 10),
    }
  }
  return null
}

export function useContrast (color?: string) {
  if (!color) {
    return undefined
  }

  const contrastColor = ref('rgba(0, 0, 0, 1)')

  const rgba = parseRgba(color)
  if (rgba) {
    const luminance = getLuminance(rgba.r, rgba.g, rgba.b)
    contrastColor.value = luminance > 0.5 ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255, 1)'
  }

  return contrastColor
}
