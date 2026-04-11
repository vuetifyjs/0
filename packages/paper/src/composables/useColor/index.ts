// Utilities
import { toRef } from 'vue'

export interface ColorProps {
  bgColor?: string
  color?: string
}

export function useColor (props: ColorProps) {
  const colorClasses = toRef(() => {
    const classes: string[] = []

    if (props.bgColor) classes.push(`bg-${props.bgColor}`)
    if (props.color) classes.push(`text-${props.color}`)

    return classes
  })

  return { colorClasses }
}

// Re-export utility functions for consumers who need runtime color parsing
export {
  hexaToRgba,
  hexToRgba,
  parseColor,
  rgbaToHexa,
  rgbToRgba,
} from './color-utils'
