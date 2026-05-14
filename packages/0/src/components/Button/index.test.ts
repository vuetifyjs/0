import { describe, expect, it, vi } from 'vitest'

import { Button } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref, shallowRef } from 'vue'

// Types
import type { VueWrapper } from '@vue/test-utils'

// ============================================================================
// Test Helpers
// ============================================================================

interface MountResult {
  wrapper: VueWrapper
  props: () => any
  wait: () => Promise<void>
}

/**
 * Mount a standalone Button.Root with slot prop capture
 */
function mountButton (options: {
  props?: Record<string, unknown>
  slots?: Record<string, any>
} = {}): MountResult {
  let capturedProps: any

  const wrapper = mount(Button.Root, {
    props: options.props,
    slots: {
      default: options.slots?.default ?? ((props: any) => {
        capturedProps = props
        return h('span', 'Click me')
      }),
    },
  })

  return {
    wrapper: wrapper.find(options.props?.as as string || 'button') as unknown as VueWrapper,
    props: () => capturedProps,
    wait: () => nextTick(),
  }
}

/**
 * Mount a Button.Group with items and slot prop capture
 */
function mountGroup (options: {
  props?: Record<string, unknown>
  model?: ReturnType<typeof ref<string | string[] | undefined>>
  items?: Array<{ value: string, disabled?: boolean }>
} = {}) {
  const items = options.items ?? [{ value: 'bold' }, { value: 'italic' }]
  const itemProps: Record<string, any> = {}

  const wrapper = mount(Button.Group, {
    props: {
      ...(options.model && {
        'modelValue': options.model.value,
        'onUpdate:modelValue': (v: unknown) => {
          (options.model as any).value = v
        },
      }),
      ...options.props,
    },
    slots: {
      default: () => items.map(item =>
        h(Button.Root as any, {
          value: item.value,
          disabled: item.disabled,
        }, {
          default: (p: any) => {
            itemProps[item.value] = p
            return h('span', item.value)
          },
        }),
      ),
    },
  })

  return {
    wrapper,
    itemProps: (key: string) => itemProps[key],
    wait: () => nextTick(),
  }
}

// ============================================================================
// Tests
// ============================================================================

describe('button', () => {
  describe('root', () => {
    describe('rendering', () => {
      it('should render as button by default', () => {
        const { wrapper } = mountButton()
        expect(wrapper.element.tagName).toBe('BUTTON')
      })

      it('should render as anchor with as="a"', () => {
        const { wrapper } = mountButton({ props: { as: 'a' } })
        expect(wrapper.element.tagName).toBe('A')
      })

      it('should set type="button" when rendering as button', () => {
        const { wrapper } = mountButton()
        expect(wrapper.attributes('type')).toBe('button')
      })

      it('should not set type when rendering as non-button element', () => {
        const { wrapper } = mountButton({ props: { as: 'div' } })
        expect(wrapper.attributes('type')).toBeUndefined()
      })

      it('should set role="button"', () => {
        const { wrapper } = mountButton()
        expect(wrapper.attributes('role')).toBe('button')
      })
    })

    describe('disabled state', () => {
      it('should set native disabled attribute', () => {
        const { wrapper } = mountButton({ props: { disabled: true } })
        expect(wrapper.attributes('disabled')).toBe('')
      })

      it('should set data-disabled attribute', () => {
        const { wrapper } = mountButton({ props: { disabled: true } })
        expect(wrapper.attributes('data-disabled')).toBe('true')
      })

      it('should set tabindex to -1', () => {
        const { wrapper } = mountButton({ props: { disabled: true } })
        expect(wrapper.attributes('tabindex')).toBe('-1')
      })

      it('should expose isDisabled in slot props', () => {
        const { props } = mountButton({ props: { disabled: true } })
        expect(props().isDisabled).toBe(true)
      })

      it('should block click events', async () => {
        const clicked = vi.fn()
        const wrapper = mount(Button.Root, {
          props: { disabled: true },
          attrs: { onClick: clicked },
          slots: { default: () => h('span', 'Click') },
        })
        await wrapper.trigger('click')
        expect(clicked).not.toHaveBeenCalled()
      })
    })

    describe('readonly state', () => {
      it('should not set native disabled attribute', () => {
        const { wrapper } = mountButton({ props: { readonly: true } })
        expect(wrapper.attributes('disabled')).toBeUndefined()
      })

      it('should set data-readonly attribute', () => {
        const { wrapper } = mountButton({ props: { readonly: true } })
        expect(wrapper.attributes('data-readonly')).toBe('true')
      })

      it('should remain focusable (tabindex=0)', () => {
        const { wrapper } = mountButton({ props: { readonly: true } })
        expect(wrapper.attributes('tabindex')).toBe('0')
      })

      it('should expose isReadonly in slot props', () => {
        const { props } = mountButton({ props: { readonly: true } })
        expect(props().isReadonly).toBe(true)
      })

      it('should not toggle in group when readonly', async () => {
        const model = ref<string | undefined>(undefined)
        const { wrapper } = mountGroup({ model, items: [{ value: 'a' }, { value: 'b' }] })
        const buttons = wrapper.findAll('button')

        await buttons[0].trigger('click')
        await nextTick()
        expect(model.value).toBe('a')

        // Re-mount with readonly — click should not change selection
        const wrapper2 = mount(Button.Group, {
          props: { 'modelValue': 'a', 'onUpdate:modelValue': (v: unknown) => {
            model.value = v as string
          } },
          slots: {
            default: () => [
              h(Button.Root as any, { value: 'a', readonly: true }, { default: () => h('span', 'A') }),
              h(Button.Root as any, { value: 'b' }, { default: () => h('span', 'B') }),
            ],
          },
        })
        await wrapper2.findAll('button')[0].trigger('click')
        await nextTick()
        expect(model.value).toBe('a')
      })
    })

    describe('passive state', () => {
      it('should set aria-disabled="true"', () => {
        const { wrapper } = mountButton({ props: { passive: true } })
        expect(wrapper.attributes('aria-disabled')).toBe('true')
      })

      it('should set data-passive attribute', () => {
        const { wrapper } = mountButton({ props: { passive: true } })
        expect(wrapper.attributes('data-passive')).toBe('true')
      })

      it('should not set native disabled attribute', () => {
        const { wrapper } = mountButton({ props: { passive: true } })
        expect(wrapper.attributes('disabled')).toBeUndefined()
      })

      it('should remain focusable (tabindex=0)', () => {
        const { wrapper } = mountButton({ props: { passive: true } })
        expect(wrapper.attributes('tabindex')).toBe('0')
      })

      it('should expose isPassive in slot props', () => {
        const { props } = mountButton({ props: { passive: true } })
        expect(props().isPassive).toBe(true)
      })

      it('should not toggle in group when passive', async () => {
        const model = ref<string | undefined>('a')
        const wrapper = mount(Button.Group, {
          props: { 'modelValue': 'a', 'onUpdate:modelValue': (v: unknown) => {
            model.value = v as string
          } },
          slots: {
            default: () => [
              h(Button.Root as any, { value: 'a', passive: true }, { default: () => h('span', 'A') }),
              h(Button.Root as any, { value: 'b' }, { default: () => h('span', 'B') }),
            ],
          },
        })
        await wrapper.findAll('button')[0].trigger('click')
        await nextTick()
        expect(model.value).toBe('a')
      })
    })

    describe('loading state', () => {
      it('should not toggle in group while loading', async () => {
        const model = ref<string | undefined>('a')
        const wrapper = mount(Button.Group, {
          props: { 'modelValue': 'a', 'onUpdate:modelValue': (v: unknown) => {
            model.value = v as string
          } },
          slots: {
            default: () => [
              h(Button.Root as any, { value: 'a', loading: true }, { default: () => h('span', 'A') }),
              h(Button.Root as any, { value: 'b' }, { default: () => h('span', 'B') }),
            ],
          },
        })
        await wrapper.findAll('button')[0].trigger('click')
        await nextTick()
        expect(model.value).toBe('a')
      })

      it('should show isLoading immediately with default grace', () => {
        const { props } = mountButton({ props: { loading: true } })
        expect(props().isLoading).toBe(true)
      })

      it('should not show isLoading before grace period', () => {
        vi.useFakeTimers()
        const { props } = mountButton({ props: { loading: true, grace: 1000 } })
        expect(props().isLoading).toBe(false)
        vi.useRealTimers()
      })

      it('should activate isLoading after grace period', async () => {
        vi.useFakeTimers()
        const { props } = mountButton({ props: { loading: true, grace: 1000 } })

        expect(props().isLoading).toBe(false)

        vi.advanceTimersByTime(1000)
        await nextTick()

        expect(props().isLoading).toBe(true)
        vi.useRealTimers()
      })

      it('should never show loading UI for fast operations', async () => {
        vi.useFakeTimers()

        const loading = shallowRef(true)
        const Component = defineComponent({
          setup () {
            return () => h(Button.Root as any, {
              loading: loading.value,
              grace: 1000,
            }, {
              default: (p: any) => h('span', { 'data-loading': p.isLoading }, 'Click'),
            })
          },
        })

        const wrapper = mount(Component)

        // Loading finishes before grace period
        vi.advanceTimersByTime(500)
        loading.value = false
        await nextTick()

        const span = wrapper.find('span')
        expect(span.attributes('data-loading')).toBe('false')

        vi.useRealTimers()
      })

      it('should set data-loading after grace period', async () => {
        vi.useFakeTimers()
        const { wrapper } = mountButton({ props: { loading: true, grace: 1000 } })

        expect(wrapper.attributes('data-loading')).toBeUndefined()

        vi.advanceTimersByTime(1000)
        await nextTick()

        expect(wrapper.attributes('data-loading')).toBe('true')
        vi.useRealTimers()
      })

      it('should set aria-busy after grace period', async () => {
        vi.useFakeTimers()
        const { wrapper } = mountButton({ props: { loading: true, grace: 1000 } })

        expect(wrapper.attributes('aria-busy')).toBeUndefined()

        vi.advanceTimersByTime(1000)
        await nextTick()

        expect(wrapper.attributes('aria-busy')).toBe('true')
        vi.useRealTimers()
      })

      it('should stop timer on unmount', async () => {
        vi.useFakeTimers()

        const show = shallowRef(true)
        const Component = defineComponent({
          setup () {
            return () => show.value
              ? h(Button.Root as any, { loading: true, grace: 1000 }, {
                  default: () => h('span', 'Click'),
                })
              : null
          },
        })

        mount(Component)

        // Unmount before grace period fires
        show.value = false
        await nextTick()

        // Advancing should not throw
        vi.advanceTimersByTime(2000)
        await nextTick()

        expect(true).toBe(true)
        vi.useRealTimers()
      })
    })

    describe('standalone mode', () => {
      it('should not set aria-pressed when standalone', () => {
        const { wrapper } = mountButton()
        expect(wrapper.attributes('aria-pressed')).toBeUndefined()
      })

      it('should not be selected when standalone', () => {
        const { props } = mountButton()
        expect(props().isSelected).toBe(false)
      })
    })
  })

  describe('loading/content visibility', () => {
    it('should show content by default', () => {
      let contentProps: any

      const wrapper = mount(Button.Root, {
        slots: {
          default: () => [
            h(Button.Loading as any, {}, {
              default: () => h('span', 'Loading...'),
            }),
            h(Button.Content as any, {}, {
              default: (p: any) => {
                contentProps = p
                return h('span', 'Content')
              },
            }),
          ],
        },
      })

      expect(contentProps.isSelected).toBe(true)
      expect(wrapper.text()).toContain('Content')
      expect(wrapper.text()).not.toContain('Loading...')
    })

    it('should switch to loading after grace period', async () => {
      vi.useFakeTimers()

      let contentProps: any
      let loadingProps: any

      const wrapper = mount(Button.Root, {
        props: { loading: true, grace: 1000 },
        slots: {
          default: () => [
            h(Button.Loading as any, {}, {
              default: (p: any) => {
                loadingProps = p
                return h('span', 'Loading...')
              },
            }),
            h(Button.Content as any, {}, {
              default: (p: any) => {
                contentProps = p
                return h('span', 'Content')
              },
            }),
          ],
        },
      })

      // Before grace period — content visible, loading not rendered
      expect(contentProps.isSelected).toBe(true)
      expect(wrapper.find('span[style*="visible"]').exists()).toBe(true)
      expect(wrapper.text()).not.toContain('Loading...')

      vi.advanceTimersByTime(1000)
      await nextTick()

      // After grace period — loading rendered, content hidden
      expect(loadingProps.isSelected).toBe(true)
      expect(wrapper.text()).toContain('Loading...')
      expect(wrapper.find('span[style*="hidden"]').exists()).toBe(true)

      vi.useRealTimers()
    })
  })

  describe('group', () => {
    it('should render as div by default', () => {
      const { wrapper } = mountGroup()
      expect(wrapper.element.tagName).toBe('DIV')
    })

    it('should set role="group"', () => {
      const { wrapper } = mountGroup()
      expect(wrapper.attributes('role')).toBe('group')
    })

    it('should set aria-pressed on child buttons', () => {
      const { wrapper } = mountGroup()
      const buttons = wrapper.findAll('button')
      expect(buttons.length).toBe(2)
      // Initially no selection
      expect(buttons[0].attributes('aria-pressed')).toBe('false')
      expect(buttons[1].attributes('aria-pressed')).toBe('false')
    })

    it('should toggle selection on click', async () => {
      const { wrapper, itemProps } = mountGroup()
      const buttons = wrapper.findAll('button')

      await buttons[0].trigger('click')
      await nextTick()

      expect(itemProps('bold').isSelected).toBe(true)
      expect(itemProps('italic').isSelected).toBe(false)
    })

    it('should sync with v-model', async () => {
      const model = ref<string | undefined>(undefined)
      const { wrapper } = mountGroup({ model })
      const buttons = wrapper.findAll('button')

      await buttons[0].trigger('click')
      await nextTick()

      expect(model.value).toBe('bold')
    })

    it('should support multiple selection', async () => {
      const model = ref<string[]>([])
      const { wrapper } = mountGroup({
        model,
        props: { multiple: true },
      })
      const buttons = wrapper.findAll('button')

      await buttons[0].trigger('click')
      await nextTick()
      await buttons[1].trigger('click')
      await nextTick()

      expect(model.value).toEqual(expect.arrayContaining(['bold', 'italic']))
    })

    it('should respect mandatory selection', async () => {
      const model = ref<string | undefined>(undefined)
      mountGroup({
        model,
        props: { mandatory: 'force' },
      })

      await nextTick()

      // mandatory: 'force' auto-selects first item
      expect(model.value).toBe('bold')
    })

    it('should disable child buttons when group is disabled', () => {
      const { itemProps } = mountGroup({
        props: { disabled: true },
      })

      expect(itemProps('bold').isDisabled).toBe(true)
      expect(itemProps('italic').isDisabled).toBe(true)
    })
  })

  describe('icon', () => {
    it('should set aria-hidden on the icon element', () => {
      const wrapper = mount(Button.Root, {
        slots: {
          default: () => [
            h(Button.Icon as any, {}, { default: () => h('span', '✕') }),
            h('span', 'Close'),
          ],
        },
      })

      const icon = wrapper.find('span[aria-hidden]')
      expect(icon.exists()).toBe(true)
      expect(icon.attributes('aria-hidden')).toBe('true')
    })

    it('should set data-solo when icon is alone', async () => {
      const wrapper = mount(Button.Root, {
        props: { ariaLabel: 'Close' },
        slots: {
          default: () => h(Button.Icon as any, {}, {
            default: () => h('span', '✕'),
          }),
        },
      })

      await nextTick()
      expect(wrapper.find('button').attributes('data-solo')).toBe('true')
    })

    it('should not set data-solo when Content is present', async () => {
      const wrapper = mount(Button.Root, {
        slots: {
          default: () => [
            h(Button.Icon as any, {}, { default: () => h('span', '✕') }),
            h(Button.Content as any, {}, { default: () => h('span', 'Close') }),
          ],
        },
      })

      await nextTick()
      expect(wrapper.attributes('data-solo')).toBeUndefined()
    })

    it('should expose isSolo in slot props', async () => {
      let captured: any

      mount(Button.Root, {
        props: { ariaLabel: 'Close' },
        slots: {
          default: () => h(Button.Icon as any, {}, {
            default: (p: any) => {
              captured = p
              return h('span', '✕')
            },
          }),
        },
      })

      await nextTick()
      expect(captured.isSolo).toBe(true)
    })

    it('should provide default aria-label when solo and none given', async () => {
      const wrapper = mount(Button.Root, {
        slots: {
          default: () => h(Button.Icon as any, {}, {
            default: () => h('span', '✕'),
          }),
        },
      })

      await nextTick()
      expect(wrapper.find('button').attributes('aria-label')).toBeDefined()
    })

    it('should use explicit aria-label over default', async () => {
      const wrapper = mount(Button.Root, {
        props: { ariaLabel: 'Close' },
        slots: {
          default: () => h(Button.Icon as any, {}, {
            default: () => h('span', '✕'),
          }),
        },
      })

      await nextTick()
      expect(wrapper.find('button').attributes('aria-label')).toBe('Close')
    })
  })

  describe('hidden input', () => {
    it('should render hidden input with name and value', () => {
      const wrapper = mount(Button.Root, {
        slots: {
          default: () => [
            h('span', 'Click'),
            h(Button.HiddenInput as any, { name: 'action', value: 'submit' }),
          ],
        },
      })

      const input = wrapper.find('input')
      expect(input.exists()).toBe(true)
      expect(input.attributes('name')).toBe('action')
      expect(input.attributes('value')).toBe('submit')
      expect(input.attributes('type')).toBe('checkbox')
      expect(input.attributes('tabindex')).toBe('-1')
      expect(input.attributes('inert')).toBe('')
    })

    it('should default value to "on" when not provided', () => {
      const wrapper = mount(Button.Root, {
        slots: {
          default: () => h(Button.HiddenInput as any, { name: 'toggle' }),
        },
      })

      expect(wrapper.find('input').attributes('value')).toBe('on')
    })

    it('should serialize object values to JSON', () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const wrapper = mount(Button.Root, {
        slots: {
          default: () => h(Button.HiddenInput as any, { name: 'data', value: { foo: 'bar' } }),
        },
      })

      expect(wrapper.find('input').attributes('value')).toBe('{"foo":"bar"}')
      expect(spy).toHaveBeenCalledTimes(1)

      spy.mockRestore()
    })
  })
})
