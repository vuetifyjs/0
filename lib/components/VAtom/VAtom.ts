import { defineComponent, h, mergeProps, type PropType, type VNode } from 'vue'
import { isSelfClosingTag } from '../../constants/htmlElements'

type DOMElements = Parameters<typeof h>[0]

export interface VAtomProps {
  as?: DOMElements
  asChild?: boolean
}

export const VAtom = defineComponent({
  name: 'VAtom',
  inheritAttrs: false,
  props: {
    as: {
      type: [String, Object] as PropType<VAtomProps['as']>,
      default: 'div',
    },
    asChild: {
      type: Boolean as PropType<VAtomProps['asChild']>,
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
          // Merge props and attrs from VAtom to the child
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

export type VAtomInstance = InstanceType<typeof VAtom>
