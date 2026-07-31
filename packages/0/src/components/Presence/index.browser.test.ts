import { describe, expect, it } from 'vitest'

import { Presence } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'

describe('presence', () => {
  describe('rendering', () => {
    it('should not render content when model is false', () => {
      const wrapper = mount(Presence, {
        props: { modelValue: false },
        slots: {
          default: () => h('div', { class: 'content' }, 'Hello'),
        },
      })

      expect(wrapper.find('.content').exists()).toBe(false)

      wrapper.unmount()
    })

    it('should render content when model is true', async () => {
      const wrapper = mount(Presence, {
        props: { modelValue: true },
        slots: {
          default: () => h('div', { class: 'content' }, 'Hello'),
        },
      })

      await nextTick()

      expect(wrapper.find('.content').exists()).toBe(true)
      expect(wrapper.find('.content').text()).toBe('Hello')

      wrapper.unmount()
    })
  })

  describe('slot props', () => {
    it('should expose attrs, done, isPresent, isLeaving via slot props', async () => {
      let slotProps: any

      const wrapper = mount(Presence, {
        props: { modelValue: true },
        slots: {
          default: (props: any) => {
            slotProps = props
            return h('div', 'Content')
          },
        },
      })

      await nextTick()
      await nextTick()

      expect(slotProps).toBeDefined()
      expect(slotProps.attrs['data-state']).toBe('present')
      expect(typeof slotProps.done).toBe('function')
      expect(slotProps.isPresent).toBe(true)
      expect(slotProps.isLeaving).toBe(false)

      wrapper.unmount()
    })
  })

  describe('lazy mounting', () => {
    it('should not mount until first true when lazy', async () => {
      const Host = defineComponent({
        data: () => ({ open: false }),
        render () {
          return h(Presence, { modelValue: this.open, lazy: true }, {
            default: () => h('div', { class: 'lazy' }, 'Lazy'),
          })
        },
      })

      const wrapper = mount(Host)
      await nextTick()

      expect(wrapper.find('.lazy').exists()).toBe(false)

      await wrapper.setData({ open: true })
      await nextTick()

      expect(wrapper.find('.lazy').exists()).toBe(true)

      wrapper.unmount()
    })

    it('should keep content mounted after hide when lazy', async () => {
      const Host = defineComponent({
        data: () => ({ open: true }),
        render () {
          return h(Presence, { modelValue: this.open, lazy: true }, {
            default: () => h('div', { class: 'lazy-keep' }, 'Lazy'),
          })
        },
      })

      const wrapper = mount(Host)
      await nextTick()
      await nextTick()

      expect(wrapper.find('.lazy-keep').exists()).toBe(true)

      await wrapper.setData({ open: false })
      await nextTick()
      await nextTick()

      // Still in DOM after leave
      expect(wrapper.find('.lazy-keep').exists()).toBe(true)

      wrapper.unmount()
    })
  })

  describe('leaving state', () => {
    it('should keep content mounted during leaving when immediate is false', async () => {
      const Host = defineComponent({
        data: () => ({ open: true }),
        render () {
          return h(Presence, { modelValue: this.open, immediate: false }, {
            default: (props: any) => h('div', {
              class: 'leaving-test',
              ...props.attrs,
            }, 'Content'),
          })
        },
      })

      const wrapper = mount(Host)
      await nextTick()
      await nextTick()

      await wrapper.setData({ open: false })
      await nextTick()

      const el = wrapper.find('.leaving-test')
      expect(el.exists()).toBe(true)
      expect(el.attributes('data-state')).toBe('leaving')

      wrapper.unmount()
    })
  })

  describe('v-model', () => {
    it('should react to v-model changes', async () => {
      const Host = defineComponent({
        data: () => ({ open: false }),
        render () {
          return h(Presence, { modelValue: this.open }, {
            default: () => h('div', { class: 'model' }, 'Content'),
          })
        },
      })

      const wrapper = mount(Host)

      expect(wrapper.find('.model').exists()).toBe(false)

      await wrapper.setData({ open: true })
      await nextTick()

      expect(wrapper.find('.model').exists()).toBe(true)

      wrapper.unmount()
    })
  })

  describe('events', () => {
    it('should emit enter when present becomes true', async () => {
      const Host = defineComponent({
        data: () => ({ open: false }),
        render () {
          return h(Presence, { modelValue: this.open }, {
            default: () => h('div', 'Content'),
          })
        },
      })

      const wrapper = mount(Host)
      const presence = wrapper.findComponent(Presence)

      await wrapper.setData({ open: true })
      await nextTick()

      expect(presence.emitted('enter')).toHaveLength(1)

      wrapper.unmount()
    })

    it('should emit leave and after-leave on exit', async () => {
      const Host = defineComponent({
        data: () => ({ open: true }),
        render () {
          return h(Presence, { modelValue: this.open }, {
            default: () => h('div', 'Content'),
          })
        },
      })

      const wrapper = mount(Host)
      const presence = wrapper.findComponent(Presence)

      await nextTick()
      await nextTick()

      await wrapper.setData({ open: false })
      await nextTick()

      expect(presence.emitted('leave')).toHaveLength(1)

      await nextTick()

      expect(presence.emitted('after-leave')).toHaveLength(1)

      wrapper.unmount()
    })

    it('should emit leave but not after-leave until done() when immediate is false', async () => {
      let slotDone: () => void

      const wrapper = mount(Presence, {
        props: { modelValue: true, immediate: false },
        slots: {
          default: (props: any) => {
            slotDone = props.done
            return h('div', 'Content')
          },
        },
      })

      await nextTick()
      await nextTick()

      await wrapper.setProps({ modelValue: false })
      await nextTick()

      expect(wrapper.emitted('leave')).toHaveLength(1)
      expect(wrapper.emitted('after-leave')).toBeUndefined()

      slotDone!()
      await nextTick()

      expect(wrapper.emitted('after-leave')).toHaveLength(1)

      wrapper.unmount()
    })
  })
})
