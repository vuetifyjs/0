// Utilities
import { toRef } from 'vue'

export interface DimensionProps {
  width?: string
  height?: string
  maxWidth?: string
  maxHeight?: string
  minWidth?: string
  minHeight?: string
}

export function useDimensions (props: DimensionProps) {
  const dimensionClasses = toRef(() => {
    const classes: string[] = []

    if (props.width) classes.push(`w-${props.width}`)
    if (props.height) classes.push(`h-${props.height}`)
    if (props.maxWidth) classes.push(`max-w-${props.maxWidth}`)
    if (props.maxHeight) classes.push(`max-h-${props.maxHeight}`)
    if (props.minWidth) classes.push(`min-w-${props.minWidth}`)
    if (props.minHeight) classes.push(`min-h-${props.minHeight}`)

    return classes
  })

  return { dimensionClasses }
}
