import { mergeProps } from 'vue'
import type { PropType, VNode } from 'vue'

type DOMElements = Parameters<typeof h>[0]

export interface V0AtomProps {
  as?: DOMElements
  asChild?: boolean
}

export const V0Atom = defineComponent({
  name: 'V0Atom',

  inheritAttrs: false,

  props: {
    as: {
      type: [String, Object] as PropType<V0AtomProps['as']>,
      default: 'div',
    },
    asChild: {
      type: Boolean as PropType<V0AtomProps['asChild']>,
      default: false,
    },
  },

  setup (props, { slots, attrs }) {
    return () => {
      const Tag = props.asChild ? 'template' : props.as || 'div'
      const isSelfClosing = typeof props.as === 'string' && isSelfClosingTag(props.as as keyof HTMLElementTagNameMap)

      if (props.asChild) {
        const children = slots.default?.()
        if (children && children.length === 1) {
          const childVNode = children[0] as VNode
          // Merge props and attrs from V0Atom to the child
          const newProps = mergeProps(childVNode.props || {}, attrs)
          // If the child is a component, pass attrs as props
          // If it's a DOM element, attrs are handled by Vue
          // @ts-expect-error
          return h(childVNode.type, newProps, childVNode.children)
        }
        // Fallback if asChild is true but no single child is provided
        return slots.default ? slots.default() : null
      }

      return isSelfClosing ? h(Tag, attrs) : h(Tag, attrs, slots.default ? slots.default() : undefined)
    }
  },
})

export type V0AtomInstance = InstanceType<typeof V0Atom>
