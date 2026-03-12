import { beforeEach, describe, expect, it } from 'vitest'

// Composables
import { createStackPlugin } from '#v0/composables/useStack'

// Utilities
import { mount } from '@vue/test-utils'
import { h } from 'vue'

import { Snackbar } from './index'

// Create fresh stack plugin for each test to avoid "Ticket already exists" warnings
let stackPlugin: ReturnType<typeof createStackPlugin>

beforeEach(() => {
  stackPlugin = createStackPlugin()
})

// Helper to mount with stack plugin
function mountWithStack<T extends Parameters<typeof mount>[0]> (
  component: T,
  options: Parameters<typeof mount<T>>[1] = {},
) {
  return mount(component, {
    ...options,
    global: {
      ...options?.global,
      plugins: [...(options?.global?.plugins ?? []), stackPlugin],
    },
  })
}

describe('snackbar', () => {
  describe('portal', () => {
    it('should render content inline when teleport=false', () => {
      const wrapper = mountWithStack(Snackbar.Portal, {
        props: { teleport: false },
        slots: {
          default: () => h('div', { class: 'snackbar-child' }, 'Portal content'),
        },
      })

      expect(wrapper.find('.snackbar-child').exists()).toBe(true)
      expect(wrapper.find('.snackbar-child').text()).toBe('Portal content')
    })
  })

  describe('root', () => {
    describe('aria role', () => {
      it('should render role="status" for default severity (info)', () => {
        const wrapper = mount(Snackbar.Root, {
          slots: { default: () => h('span', 'Message') },
        })

        expect(wrapper.attributes('role')).toBe('status')
      })

      it('should render role="status" for success severity', () => {
        const wrapper = mount(Snackbar.Root, {
          props: { severity: 'success' },
          slots: { default: () => h('span', 'Message') },
        })

        expect(wrapper.attributes('role')).toBe('status')
      })

      it('should render role="alert" for error severity', () => {
        const wrapper = mount(Snackbar.Root, {
          props: { severity: 'error' },
          slots: { default: () => h('span', 'Message') },
        })

        expect(wrapper.attributes('role')).toBe('alert')
      })

      it('should render role="alert" for warning severity', () => {
        const wrapper = mount(Snackbar.Root, {
          props: { severity: 'warning' },
          slots: { default: () => h('span', 'Message') },
        })

        expect(wrapper.attributes('role')).toBe('alert')
      })
    })

    describe('slot props', () => {
      it('should expose severity in slot props', () => {
        let slotProps: any

        mount(Snackbar.Root, {
          props: { severity: 'error' },
          slots: {
            default: (props: any) => {
              slotProps = props
              return h('div', 'Content')
            },
          },
        })

        expect(slotProps).toBeDefined()
        expect(slotProps.severity).toBe('error')
      })
    })
  })

  describe('close', () => {
    it('should render aria-label="Close" by default', () => {
      const wrapper = mount(Snackbar.Close)

      expect(wrapper.attributes('aria-label')).toBe('Close')
    })

    it('should render custom label via label prop', () => {
      const wrapper = mount(Snackbar.Close, {
        props: { label: 'Dismiss notification' },
      })

      expect(wrapper.attributes('aria-label')).toBe('Dismiss notification')
    })
  })

  describe('action', () => {
    it('should render as button with type="button"', () => {
      const wrapper = mount(Snackbar.Action, {
        slots: { default: () => 'Undo' },
      })

      expect(wrapper.element.tagName).toBe('BUTTON')
      expect(wrapper.attributes('type')).toBe('button')
    })
  })

  describe('content', () => {
    it('should render slot content', () => {
      const wrapper = mount(Snackbar.Content, {
        slots: { default: () => 'Saved successfully' },
      })

      expect(wrapper.text()).toBe('Saved successfully')
    })
  })

  describe('integration', () => {
    it('should render Portal > Root > Content + Action + Close', () => {
      const wrapper = mountWithStack(Snackbar.Portal, {
        props: { teleport: false },
        slots: {
          default: () => h(Snackbar.Root, { severity: 'success' }, () => [
            h(Snackbar.Content, {}, () => 'File uploaded'),
            h(Snackbar.Action, {}, () => 'View'),
            h(Snackbar.Close),
          ]),
        },
      })

      const root = wrapper.findComponent(Snackbar.Root as any)
      expect(root.exists()).toBe(true)
      expect(root.attributes('role')).toBe('status')

      const content = wrapper.findComponent(Snackbar.Content as any)
      expect(content.exists()).toBe(true)
      expect(content.text()).toContain('File uploaded')

      const action = wrapper.findComponent(Snackbar.Action as any)
      expect(action.exists()).toBe(true)
      expect(action.attributes('type')).toBe('button')
      expect(action.text()).toBe('View')

      const close = wrapper.findComponent(Snackbar.Close as any)
      expect(close.exists()).toBe(true)
      expect(close.attributes('aria-label')).toBe('Close')
    })
  })
})
