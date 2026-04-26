// Utilities
import { toRef } from 'vue'

export interface BorderProps {
  borderColor?: string
  borderStyle?: string
  borderWidth?: string
}

export function useBorder (props: BorderProps) {
  const borderClasses = toRef(() => {
    const classes: string[] = []

    if (props.borderWidth) classes.push(`border-${props.borderWidth}`)
    if (props.borderColor) classes.push(`border-${props.borderColor}`)
    if (props.borderStyle) classes.push(`border-${props.borderStyle}`)

    return classes
  })

  return { borderClasses }
}
