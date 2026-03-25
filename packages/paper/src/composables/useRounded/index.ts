// Utilities
import { toRef } from 'vue'

export interface RoundedProps {
  borderRadius?: string
}

export function useRounded (props: RoundedProps) {
  const roundedClasses = toRef(() => {
    const classes: string[] = []

    if (props.borderRadius) classes.push(`rounded-${props.borderRadius}`)

    return classes
  })

  return { roundedClasses }
}
