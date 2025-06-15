import type { ColorProps } from '@/composables/color'
import type { V0AtomProps } from '@/components/V0Atom'

interface V0IconPropsBase {
  fontSize?: string
  icon?: string
  opacity?: number | string
}

export interface V0IconProps extends V0IconPropsBase, V0AtomProps, ColorProps {}
