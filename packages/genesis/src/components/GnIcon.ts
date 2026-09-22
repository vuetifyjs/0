/**
 * @internal Internal chrome renderer. Not a public icon component — do not
 * barrel-export. Slot defaults call this; hosts override via `provideGnIcons`.
 */

// Framework
import { isNullOrUndefined } from '@vuetify/v0'

// Utilities
import { defineComponent, h, mergeProps } from 'vue'

// Types
import type { PropType, VNode } from 'vue'

import { type GnIconRole, useGnIcons } from '../icons'

export const GnIcon = defineComponent({
  name: 'GnIcon',
  inheritAttrs: false,
  props: {
    /** Local MDI path used when no host renderer returns a VNode. */
    d: {
      type: String,
      required: true,
    },
    role: {
      type: String as PropType<GnIconRole>,
      required: true,
    },
    size: {
      type: Number,
      default: 16,
    },
  },
  setup (props, { attrs }) {
    const icons = useGnIcons()

    function fallback (): VNode {
      return h('svg', {
        'aria-hidden': 'true',
        'fill': 'currentColor',
        'height': props.size,
        'viewBox': '0 0 24 24',
        'width': props.size,
        'xmlns': 'http://www.w3.org/2000/svg',
      }, [h('path', { d: props.d })])
    }

    return () => {
      const rendered = icons?.render(props.role, { size: props.size })
      const child = isNullOrUndefined(rendered) ? fallback() : rendered

      return h('span', mergeProps(attrs, {
        'aria-hidden': 'true',
        'class': 'genesis-icon',
        'style': {
          alignItems: 'center',
          display: 'inline-flex',
          flex: 'none',
          justifyContent: 'center',
          lineHeight: 0,
        },
      }), [child])
    }
  },
})
