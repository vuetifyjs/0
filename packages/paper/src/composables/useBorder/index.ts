// Utilities
import { getCurrentInstanceName } from '#paper/utilities/getCurrentInstanceName'
import { toRef } from 'vue'

export interface BorderProps {
  borderColor?: string
  borderStyle?: string
  borderWidth?: string
}

export function useBorder (
  props: BorderProps,
  name = getCurrentInstanceName(),
) {
  const borderStyles = toRef(() => {
    return {
      [`--v0-${name}-border-color`]: props.borderColor,
      [`--v0-${name}-border-style`]: props.borderStyle,
      [`--v0-${name}-border-width`]: props.borderWidth,
    }
  })

  return {
    borderStyles,
  }
}
