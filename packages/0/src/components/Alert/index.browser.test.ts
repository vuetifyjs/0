import { describe, expect, it } from 'vitest'

import { Alert } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'

describe('alert', () => {
  describe('root', () => {
    it('should render as div by default', () => {
      const wrapper = mount(Alert.Root, {
        slots: { default: () => h('span', 'Message') },
      })

      expect(wrapper.element.tagName).toBe('DIV')
    })

    it('should have role="alert" by default', () => {
      const wrapper = mount(Alert.Root, {
        slots: { default: () => h('span', 'Message') },
      })

      expect(wrapper.attributes('role')).toBe('alert')
    })

    it('should set role="status" when role prop is status', () => {
      const wrapper = mount(Alert.Root, {
        props: { role: 'status' },
        slots: { default: () => h('span', 'Message') },
      })

      expect(wrapper.attributes('role')).toBe('status')
    })

    it('should expose role in slot attrs', async () => {
      let slotProps: any

      mount(Alert.Root, {
        slots: {
          default: (props: any) => {
            slotProps = props
            return h('span', 'Message')
          },
        },
      })

      await nextTick()

      expect(slotProps).toBeDefined()
      expect(slotProps.attrs.role).toBe('alert')
    })

    it('should render as custom element via as prop', () => {
      const wrapper = mount(Alert.Root, {
        props: { as: 'section' },
        slots: { default: () => h('span', 'Message') },
      })

      expect(wrapper.element.tagName).toBe('SECTION')
    })

    it('should work in renderless mode', () => {
      let slotProps: any

      mount(Alert.Root, {
        props: { renderless: true },
        slots: {
          default: (props: any) => {
            slotProps = props
            return h('div', props.attrs, 'Message')
          },
        },
      })

      expect(slotProps.attrs.role).toBe('alert')
    })
  })

  describe('title', () => {
    it('should render as h5 by default', () => {
      const wrapper = mount(Alert.Root, {
        slots: {
          default: () => h(Alert.Title as any, {}, () => 'Title'),
        },
      })

      expect(wrapper.find('h5').exists()).toBe(true)
    })

    it('should render as custom element via as prop', () => {
      const wrapper = mount(Alert.Root, {
        slots: {
          default: () => h(Alert.Title as any, { as: 'h3' }, () => 'Title'),
        },
      })

      expect(wrapper.find('h3').exists()).toBe(true)
    })
  })

  describe('description', () => {
    it('should render as p by default', () => {
      const wrapper = mount(Alert.Root, {
        slots: {
          default: () => h(Alert.Description as any, {}, () => 'Description'),
        },
      })

      expect(wrapper.find('p').exists()).toBe(true)
    })

    it('should render as custom element via as prop', () => {
      const wrapper = mount(Alert.Root, {
        slots: {
          default: () => h(Alert.Description as any, { as: 'span' }, () => 'Description'),
        },
      })

      expect(wrapper.find('span').exists()).toBe(true)
    })
  })

  describe('integration', () => {
    it('should compose Alert.Root with Title and Description', () => {
      const wrapper = mount(Alert.Root, {
        slots: {
          default: () => [
            h(Alert.Title as any, {}, () => 'Session expiring'),
            h(Alert.Description as any, {}, () => 'You will be signed out in 5 minutes.'),
          ],
        },
      })

      expect(wrapper.attributes('role')).toBe('alert')
      expect(wrapper.find('h5').text()).toBe('Session expiring')
      expect(wrapper.find('p').text()).toBe('You will be signed out in 5 minutes.')
    })
  })

  describe('SSR', () => {
    it('should render to string on server without errors', async () => {
      const { renderToString } = await import('vue/server-renderer')
      const { createSSRApp, h } = await import('vue')

      const app = createSSRApp({
        render () {
          return h(Alert.Root as any, {}, {
            default: () => [
              h(Alert.Title as any, {}, () => 'Alert'),
              h(Alert.Description as any, {}, () => 'A status message.'),
            ],
          })
        },
      })

      const html = await renderToString(app)

      expect(html).toContain('role="alert"')
      expect(html).toContain('Alert')
      expect(html).toContain('A status message.')
    })
  })
})
