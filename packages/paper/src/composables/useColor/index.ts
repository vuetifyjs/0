// Composables
import { useContrast } from '#paper/composables/useContrast'

// Utilities
import { getCurrentInstanceName } from '#paper/utilities/getCurrentInstanceName'
import { inject, shallowRef, toRef } from 'vue'

// Types
import type { ThemeProvider } from '#paper/composables/useTheme'

export interface ColorProps {
  bgColor?: string
  color?: string
  theme?: string
}

export function rgbToRgba (rgb: string): string {
  if (rgb.startsWith('rgba')) {
    return rgb
  }
  return rgb.replace('rgb', 'rgba').replace(')', ', 1)')
}

export function hexaToRgba (hexa: string): string {
  const bigint = Number.parseInt(hexa.slice(1), 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  const a = Math.round((bigint >> 24) / 255 * 100) / 100
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

export function hexToRgba (hexCode: string, opacity = 1): string {
  let hex = hexCode.replace('#', '')

  if (hex.length === 3) {
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`
  }

  const r = Number.parseInt(hex.slice(0, 2), 16)
  const g = Number.parseInt(hex.slice(2, 4), 16)
  const b = Number.parseInt(hex.slice(4, 6), 16)

  if (opacity > 1 && opacity <= 100) {
    opacity = opacity / 100
  }

  return `rgba(${r},${g},${b},${opacity})`
}

export function rgbaToHexa (rgba: string): string {
  const sep = rgba.includes(',') ? ',' : ' '
  const rgbaString = rgba.slice(5).split(')')[0]
  if (!rgbaString) return '#000000ff'

  const rgbaArray = rgbaString
    .split(sep)
    .map((string: string) => Number.parseInt(string, 10))
  if (rgbaArray.length === 3) {
    rgbaArray.push(1)
  }
  const [r = 0, g = 0, b = 0, a = 1] = rgbaArray
  const alpha = Math.round(a * 255)
  return `#${(0x1_00_00_00 + r * 0x1_00_00 + g * 0x1_00 + b).toString(16).slice(1)}${(alpha + 0x1_00_00).toString(16).slice(-2)}`
}

export function parseColor (color?: string, contrast = false) {
  if (!color) {
    return undefined
  }

  const theme = inject<ThemeProvider>('theme')

  const rgba = shallowRef<string | undefined>('')

  if (color.startsWith('#')) {
    rgba.value = color.length === 9 ? hexaToRgba(color) : hexToRgba(color)
  } else if (color.startsWith('rgb')) {
    rgba.value = rgbToRgba(color)
  } else {
    const currentTheme = theme?.get()
    const themeColor = currentTheme?.colors[color as keyof typeof currentTheme.colors]

    if (!themeColor) {
      rgba.value = color

      return rgba
    }

    rgba.value = color.length === 9 ? hexaToRgba(themeColor) : hexToRgba(themeColor)
  }

  if (contrast) {
    rgba.value = useContrast(rgba.value)?.value
  }

  return rgba
}

export function useColor (
  props: ColorProps,
  name = getCurrentInstanceName(),
) {
  const bgColor = parseColor(props.bgColor)
  const color = parseColor(props.color ?? bgColor?.value, !props.color)

  const colorStyles = toRef(() => {
    return {
      [`--v0-${name}-bg-color`]: bgColor?.value,
      [`--v0-${name}-color`]: color?.value,
    }
  })

  return {
    colorStyles,
  }
}
