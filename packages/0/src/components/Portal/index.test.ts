import { describe, expect, it } from 'vitest'

// Utilities
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'

import { Portal } from './index'

describe('portal', () => {
  describe('rendering', () => {
    it('should teleport content to body by default', () => {
      const wrapper = mount(Portal, {
        slots: {
          default: () => h('div', { class: 'content' }, 'Hello'),
        },
      })

      expect(wrapper.find('.content').exists()).toBe(false)
      expect(document.body.querySelector('.content')).not.toBeNull()
      expect(document.body.querySelector('.content')!.textContent).toBe('Hello')

      wrapper.unmount()
    })

    it('should render inline when disabled', () => {
      const wrapper = mount(Portal, {
        props: { disabled: true },
        slots: {
          default: () => h('div', { class: 'inline-content' }, 'Inline'),
        },
      })

      expect(wrapper.find('.inline-content').exists()).toBe(true)
      expect(wrapper.find('.inline-content').text()).toBe('Inline')

      wrapper.unmount()
    })

    it('should teleport to a custom target', () => {
      const target = document.createElement('div')
      target.id = 'custom-target'
      document.body.append(target)

      const wrapper = mount(Portal, {
        props: { to: '#custom-target' },
        slots: {
          default: () => h('div', { class: 'custom' }, 'Custom'),
        },
      })

      expect(target.querySelector('.custom')).not.toBeNull()
      expect(target.querySelector('.custom')!.textContent).toBe('Custom')

      wrapper.unmount()
      target.remove()
    })
  })

  describe('slot props', () => {
    it('should expose zIndex via slot props', () => {
      let slotProps: any

      const wrapper = mount(Portal, {
        slots: {
          default: (props: any) => {
            slotProps = props
            return h('div', 'Content')
          },
        },
      })

      expect(slotProps).toBeDefined()
      expect(typeof slotProps.zIndex).toBe('number')

      wrapper.unmount()
    })

    it('should provide base zIndex from stack', () => {
      let zIndex: number | undefined

      const wrapper = mount(Portal, {
        slots: {
          default: (props: any) => {
            zIndex = props.zIndex
            return h('div', 'Content')
          },
        },
      })

      expect(zIndex).toBe(2000)

      wrapper.unmount()
    })

    it('should provide incrementing zIndex for multiple portals', () => {
      const zIndexes: number[] = []

      const Host = defineComponent({
        setup () {
          return () => [
            h(Portal, null, {
              default: (props: any) => {
                zIndexes[0] = props.zIndex
                return h('div', 'First')
              },
            }),
            h(Portal, null, {
              default: (props: any) => {
                zIndexes[1] = props.zIndex
                return h('div', 'Second')
              },
            }),
          ]
        },
      })

      const wrapper = mount(Host)

      expect(zIndexes[0]).toBe(2000)
      expect(zIndexes[1]).toBe(2010)

      wrapper.unmount()
    })
  })

  describe('disabled reactivity', () => {
    it('should switch between teleported and inline', async () => {
      const Host = defineComponent({
        data: () => ({ disabled: false }),
        render () {
          return h(Portal, { disabled: this.disabled }, {
            default: () => h('div', { class: 'reactive' }, 'Content'),
          })
        },
      })

      const wrapper = mount(Host)

      // Initially teleported
      expect(wrapper.find('.reactive').exists()).toBe(false)
      expect(document.body.querySelector('.reactive')).not.toBeNull()

      // Disable — render inline
      await wrapper.setData({ disabled: true })
      await nextTick()

      expect(wrapper.find('.reactive').exists()).toBe(true)

      // Re-enable — teleport again
      await wrapper.setData({ disabled: false })
      await nextTick()

      expect(wrapper.find('.reactive').exists()).toBe(false)
      expect(document.body.querySelector('.reactive')).not.toBeNull()

      wrapper.unmount()
    })
  })

  describe('cleanup', () => {
    it('should remove content from target on unmount', () => {
      const wrapper = mount(Portal, {
        slots: {
          default: () => h('div', { class: 'cleanup-test' }, 'Gone'),
        },
      })

      expect(document.body.querySelector('.cleanup-test')).not.toBeNull()

      wrapper.unmount()

      expect(document.body.querySelector('.cleanup-test')).toBeNull()
    })
  })
})
