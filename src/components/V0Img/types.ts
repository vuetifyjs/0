// Types
import type { V0AtomProps } from '@/components/V0Atom'
import type { DimensionProps } from '@/composables/dimensions'

export interface V0ImgProps extends V0AtomProps, DimensionProps {
  alt?: string
  decoding?: 'sync' | 'async' | 'auto'
  priority?: 'high' | 'low' | 'auto'
  src?: string
}
