import type { AtomProps } from '@vuetify/v0'

export interface IconProps extends AtomProps {
  /** Icon alias or class name */
  icon: string
  /** Accessible label. When omitted the icon is hidden from assistive tech. */
  label?: string
}

export interface IconSlotProps {
  /** Resolved icon value (alias → token value, or the original name if unregistered) */
  icon: string
  /** Attributes to spread onto the icon element */
  attrs: {
    'class': string
    'aria-hidden': true | undefined
    'aria-label': string | undefined
    'role': 'img' | undefined
  }
}
