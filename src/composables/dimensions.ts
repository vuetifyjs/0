import { shallowRef } from 'vue'

export interface DimensionProps {
  width?: string
  height?: string
  maxWidth?: string
  maxHeight?: string
  minWidth?: string
  minHeight?: string
}

export function useDimensions (props: DimensionProps, name: string) {
  const dimensionStyles = shallowRef<DimensionProps>({
    [`--v0-${name}-width`]: props.width,
    [`--v0-${name}-height`]: props.height,
    [`--v0-${name}-maxWidth`]: props.maxWidth,
    [`--v0-${name}-maxHeight`]: props.maxHeight,
    [`--v0-${name}-minWidth`]: props.minWidth,
    [`--v0-${name}-minHeight`]: props.minHeight
  })

  return { dimensionStyles }
}
