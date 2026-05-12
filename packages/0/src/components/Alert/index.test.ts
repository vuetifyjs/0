import { describe, expect, it } from 'vitest'
import { renderToString } from 'vue/server-renderer'

// Utilities
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, ref } from 'vue'

import { Alert } from './index'

describe('alert', () => {
  describe('root', () => {
    it('should render as div by default', () => {
      const wrapper = mount(Alert.Root)
      expect(wrapper.element.tagName).toBe('DIV')
    })

    it('should have role=alert', () => {
      const wrapper = mount(Alert.Root)
      expect(wrapper.attributes('role')).toBe('alert')
    })

    it('should have aria-labelledby pointing to title', () => {
      const wrapper = mount(Alert.Root, { props: { id: 'test-alert' } })
      expect(wrapper.attributes('aria-labelledby')).toBe('test-alert-title')
    })

    it('should have aria-describedby pointing to description', () => {
      const wrapper = mount(Alert.Root, { props: { id: 'test-alert' } })
      expect(wrapper.attributes('aria-describedby')).toBe('test-alert-description')
    })

    it('should expose isDismissed=false and dismiss in slot props', () => {
      let slotProps: any

      mount(Alert.Root, {
        slots: {
          default: (props: any) => {
            slotProps = props
            return h('span', 'content')
          },
        },
      })

      expect(slotProps.isDismissed).toBe(false)
      expect(typeof slotProps.dismiss).toBe('function')
      expect(typeof slotProps.id).toBe('string')
    })

    it('should expose attrs with role, id, aria-labelledby, aria-describedby, data-state', () => {
      let slotProps: any

      mount(Alert.Root, {
        props: { id: 'my-alert' },
        slots: {
          default: (props: any) => {
            slotProps = props
            return h('span', 'content')
          },
        },
      })

      expect(slotProps.attrs.role).toBe('alert')
      expect(slotProps.attrs.id).toBe('my-alert')
      expect(slotProps.attrs['aria-labelledby']).toBe('my-alert-title')
      expect(slotProps.attrs['aria-describedby']).toBe('my-alert-description')
      expect(slotProps.attrs['data-state']).toBe('visible')
    })

    it('should have data-state=visible by default', () => {
      const wrapper = mount(Alert.Root)
      expect(wrapper.attributes('data-state')).toBe('visible')
    })

    it('should have data-state=dismissed after dismiss', async () => {
      const wrapper = mount(Alert.Root, {
        slots: {
          default: (props: any) => h('button', { onClick: props.dismiss }, 'Dismiss'),
        },
      })
      await wrapper.find('button').trigger('click')
      expect(wrapper.attributes('data-state')).toBe('dismissed')
    })

    it('should support v-model for visibility', async () => {
      const visible = ref(true)

      mount(Alert.Root, {
        props: {
          'modelValue': visible.value,
          'onUpdate:modelValue': (v: unknown) => {
            visible.value = v as boolean
          },
        },
        slots: {
          default: (props: any) => h('button', { onClick: props.dismiss }, 'Dismiss'),
        },
      })

      expect(visible.value).toBe(true)
    })

    it('should set isDismissed=true and emit update:model-value=false when dismiss is called', async () => {
      const visible = ref(true)

      const wrapper = mount(Alert.Root, {
        props: {
          'modelValue': visible.value,
          'onUpdate:modelValue': (v: unknown) => {
            visible.value = v as boolean
          },
        },
        slots: {
          default: (props: any) => h('button', { onClick: props.dismiss }, 'Dismiss'),
        },
      })

      await wrapper.find('button').trigger('click')
      expect(visible.value).toBe(false)
    })
  })

  describe('title', () => {
    it('should render as p by default', () => {
      const wrapper = mount(Alert.Root, {
        slots: { default: () => h(Alert.Title, {}, () => 'Title') },
      })
      expect(wrapper.findComponent(Alert.Title as any).element.tagName).toBe('P')
    })

    it('should have correct id for aria-labelledby', () => {
      const wrapper = mount(Alert.Root, {
        props: { id: 'test-alert' },
        slots: { default: () => h(Alert.Title, {}, () => 'Title') },
      })
      expect(wrapper.findComponent(Alert.Title as any).attributes('id')).toBe('test-alert-title')
    })
  })

  describe('description', () => {
    it('should render as p by default', () => {
      const wrapper = mount(Alert.Root, {
        slots: { default: () => h(Alert.Description, {}, () => 'Desc') },
      })
      expect(wrapper.findComponent(Alert.Description as any).element.tagName).toBe('P')
    })

    it('should have correct id for aria-describedby', () => {
      const wrapper = mount(Alert.Root, {
        props: { id: 'test-alert' },
        slots: { default: () => h(Alert.Description, {}, () => 'Desc') },
      })
      expect(wrapper.findComponent(Alert.Description as any).attributes('id')).toBe('test-alert-description')
    })
  })

  describe('icon', () => {
    it('should render as span by default', () => {
      const wrapper = mount(Alert.Root, {
        slots: { default: () => h(Alert.Icon, {}, () => '⚠') },
      })
      expect(wrapper.findComponent(Alert.Icon as any).element.tagName).toBe('SPAN')
    })

    it('should have aria-hidden=true', () => {
      const wrapper = mount(Alert.Root, {
        slots: { default: () => h(Alert.Icon, {}, () => '⚠') },
      })
      expect(wrapper.findComponent(Alert.Icon as any).attributes('aria-hidden')).toBe('true')
    })
  })

  describe('action', () => {
    it('should render as button by default', () => {
      const wrapper = mount(Alert.Root, {
        slots: { default: () => h(Alert.Action, {}, () => '✕') },
      })
      expect(wrapper.findComponent(Alert.Action as any).element.tagName).toBe('BUTTON')
    })

    it('should have type=button', () => {
      const wrapper = mount(Alert.Root, {
        slots: { default: () => h(Alert.Action, {}, () => '✕') },
      })
      expect(wrapper.findComponent(Alert.Action as any).attributes('type')).toBe('button')
    })

    it('should have aria-label', () => {
      const wrapper = mount(Alert.Root, {
        slots: { default: () => h(Alert.Action, {}, () => '✕') },
      })
      expect(wrapper.findComponent(Alert.Action as any).attributes('aria-label')).toBeDefined()
    })

    it('should call dismiss on click', async () => {
      const visible = ref(true)

      const wrapper = mount(Alert.Root, {
        props: {
          'modelValue': visible.value,
          'onUpdate:modelValue': (v: unknown) => {
            visible.value = v as boolean
          },
        },
        slots: { default: () => h(Alert.Action, {}, () => '✕') },
      })

      await wrapper.findComponent(Alert.Action as any).trigger('click')
      expect(visible.value).toBe(false)
    })
  })

  describe('integration', () => {
    it('should wire title, description, icon, and action together', () => {
      const wrapper = mount(Alert.Root, {
        props: { id: 'full-alert' },
        slots: {
          default: () => [
            h(Alert.Icon, {}, () => '⚠'),
            h(Alert.Title, {}, () => 'Warning'),
            h(Alert.Description, {}, () => 'Something needs attention.'),
            h(Alert.Action, {}, () => '✕'),
          ],
        },
      })

      expect(wrapper.attributes('role')).toBe('alert')
      expect(wrapper.attributes('aria-labelledby')).toBe('full-alert-title')
      expect(wrapper.attributes('aria-describedby')).toBe('full-alert-description')
      expect(wrapper.findComponent(Alert.Title as any).attributes('id')).toBe('full-alert-title')
      expect(wrapper.findComponent(Alert.Description as any).attributes('id')).toBe('full-alert-description')
    })
  })
})

describe('alert SSR', () => {
  it('should render to string on server without errors', async () => {
    const app = createSSRApp(defineComponent({
      render: () =>
        h(Alert.Root as never, { id: 'ssr-alert' }, {
          default: () => [
            h(Alert.Icon as never, {}, () => '⚠'),
            h(Alert.Title as never, {}, () => 'Server-side alert'),
            h(Alert.Description as never, {}, () => 'This was rendered on the server.'),
            h(Alert.Action as never, {}, () => '✕'),
          ],
        }),
    }))

    const html = await renderToString(app)

    expect(html).toBeTruthy()
    expect(html).toContain('role="alert"')
    expect(html).toContain('Server-side alert')
    expect(html).toContain('This was rendered on the server.')
  })
})
