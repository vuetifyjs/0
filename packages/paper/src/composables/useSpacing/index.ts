// Utilities
import { toRef } from 'vue'

export interface SpacingProps {
  padding?: string
  margin?: string
}

export function useSpacing (props: SpacingProps) {
  const spacingClasses = toRef(() => {
    const classes: string[] = []

    if (props.padding) classes.push(`p-${props.padding}`)
    if (props.margin) classes.push(`m-${props.margin}`)

    return classes
  })

  return { spacingClasses }
}
