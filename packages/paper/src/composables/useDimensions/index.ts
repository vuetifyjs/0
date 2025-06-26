import { getCurrentInstanceName } from '#paper/utils/getCurrentInstanceName'
import { toRef } from 'vue'

export interface DimensionProps {
  width?: string
  height?: string
  maxWidth?: string
  maxHeight?: string
  minWidth?: string
  minHeight?: string
}

export function useDimensions (
  props: DimensionProps,
  name = getCurrentInstanceName(),
) {
  const dimensionStyles = toRef(() => ({
    [`--v0-${name}-width`]: props.width,
    [`--v0-${name}-height`]: props.height,
    [`--v0-${name}-max-width`]: props.maxWidth,
    [`--v0-${name}-max-height`]: props.maxHeight,
    [`--v0-${name}-min-width`]: props.minWidth,
    [`--v0-${name}-min-height`]: props.minHeight,
  }))

  return { dimensionStyles }
}
