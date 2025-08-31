import { getCurrentInstanceName } from '#paper/utilities/getCurrentInstanceName'
import { toRef } from 'vue'

export interface SpacingProps {
  padding?: string
  margin?: string
}

export function useSpacing (
  props: SpacingProps,
  name = getCurrentInstanceName(),
) {
  const spacingStyles = toRef(() => {
    return {
      [`--v0-${name}-padding`]: props.padding,
      [`--v0-${name}-margin`]: props.margin,
    }
  })

  return {
    spacingStyles,
  }
}
