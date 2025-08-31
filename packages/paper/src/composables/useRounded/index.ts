import { getCurrentInstanceName } from '#paper/utilities/getCurrentInstanceName'
import { toRef } from 'vue'

export interface RoundedProps {
  borderRadius?: string
}

export function useRounded (
  props: RoundedProps,
  name = getCurrentInstanceName(),
) {
  const roundedStyles = toRef(() => {
    return {
      [`--v0-${name}-border-radius`]: props.borderRadius,
    }
  })

  return {
    roundedStyles,
  }
}
