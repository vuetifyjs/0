// Types
import type { V0AtomProps } from '@/components/V0Atom'
import type { BorderProps } from '@/composables/border'
import type { ColorProps } from '@/composables/color'
import type { DimensionProps } from '@/composables/dimensions'
import type { ElevationProps } from '@/composables/elevation'
import type { RoundedProps } from '@/composables/rounded'

interface V0PaperPropsBase {
  fontSize?: string
  fontWeight?: string | number
  margin?: string
  opacity?: string | number
  padding?: string
}

export interface V0PaperProps extends
  V0PaperPropsBase,
  V0AtomProps,
  DimensionProps,
  ColorProps,
  BorderProps,
  ElevationProps,
  RoundedProps {}
