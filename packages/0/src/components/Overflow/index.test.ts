import { describe, expect, it } from 'vitest'

// Utilities
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

import { Overflow, useOverflowRoot } from './index'

describe('overflow', () => {
  describe('root', () => {
    it('should render as div by default', () => {
      const wrapper = mount(Overflow.Root, {
        props: { namespace: 'test:overflow' },
        slots: { default: () => h('span', 'content') },
      })

      expect(wrapper.element.tagName).toBe('DIV')
    })

    it('should support renderless mode', () => {
      const wrapper = mount(Overflow.Root, {
        props: { namespace: 'test:overflow', renderless: true },
        slots: { default: () => h('section', { class: 'wrapper' }, 'content') },
      })

      expect(wrapper.find('.wrapper').exists()).toBe(true)
    })

    it('should expose slot props', () => {
      let captured: any

      mount(Overflow.Root, {
        props: { namespace: 'test:overflow' },
        slots: {
          default: (props: any) => {
            captured = props
            return h('span')
          },
        },
      })

      expect(captured).toBeDefined()
      expect(typeof captured.capacity).toBe('number')
      expect(typeof captured.size).toBe('number')
      expect(typeof captured.isOverflowing).toBe('boolean')
      expect(captured.attrs['data-priority']).toBe('start')
    })

    it('should provide context to descendants', () => {
      let captured: any

      const Probe = defineComponent({
        setup () {
          captured = useOverflowRoot('test:overflow')
          return () => null
        },
      })

      mount(Overflow.Root, {
        props: { namespace: 'test:overflow' },
        slots: { default: () => h(Probe) },
      })

      expect(captured).toBeDefined()
      expect(captured.overflow).toBeDefined()
      expect(captured.registry).toBeDefined()
      expect(typeof captured.isVisible).toBe('function')
    })
  })
})
