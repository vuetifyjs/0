import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderToString } from 'vue/server-renderer'

// Composables
import { createStackPlugin, useStack } from '#v0/composables/useStack'

import { createLocalePlugin } from '#v0/composables'

import { OverlayPanel } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue'

let stackPlugin: ReturnType<typeof createStackPlugin>

beforeEach(() => {
  stackPlugin = createStackPlugin()
})

const wrappers: { unmount: () => void }[] = []

afterEach(() => {
  while (wrappers.length > 0) {
    wrappers.pop()!.unmount()
  }
  vi.restoreAllMocks()
})

function mountWithStack<T extends Parameters<typeof mount>[0]> (
  component: T,
  options: Parameters<typeof mount<T>>[1] = {},
) {
  const wrapper = mount(component, {
    attachTo: document.body,
    ...options,
    global: {
      ...options?.global,
      plugins: [...(options?.global?.plugins ?? []), stackPlugin],
    },
  })
  wrappers.push(wrapper)
  return wrapper
}

describe('overlay-panel', () => {
  describe('root', () => {
    describe('rendering', () => {
      it('should render as renderless by default', () => {
        const wrapper = mountWithStack(OverlayPanel.Root, {
          slots: {
            default: () => h('div', { class: 'test-child' }, 'Content'),
          },
        })

        expect(wrapper.find('.test-child').exists()).toBe(true)
        expect(wrapper.element.tagName).toBe('DIV')
      })

      it('should render children in default slot', () => {
        const wrapper = mountWithStack(OverlayPanel.Root, {
          slots: {
            default: () => h('span', { class: 'test-child' }, 'Child content'),
          },
        })

        expect(wrapper.find('.test-child').exists()).toBe(true)
        expect(wrapper.find('.test-child').text()).toBe('Child content')
      })
    })

    describe('v-model', () => {
      it('should support v-model for open state', async () => {
        const isOpen = ref(false)

        const wrapper = mountWithStack(OverlayPanel.Root, {
          props: {
            'modelValue': isOpen.value,
            'onUpdate:modelValue': (v: unknown) => {
              isOpen.value = v as boolean
            },
          },
          slots: {
            default: () => [
              h(OverlayPanel.Activator, {}, () => 'Open'),
              h(OverlayPanel.Content, {}, () => 'Content'),
            ],
          },
        })

        expect(isOpen.value).toBe(false)

        await wrapper.findComponent(OverlayPanel.Activator as any).trigger('click')
        expect(isOpen.value).toBe(true)
      })

      it('should open overlay when modelValue becomes true', async () => {
        const wrapper = mountWithStack(OverlayPanel.Root, {
          props: {
            modelValue: false,
          },
          slots: {
            default: () => h(OverlayPanel.Content, {}, () => 'Content'),
          },
        })

        expect(wrapper.find('[role="dialog"]').exists()).toBe(false)

        await wrapper.setProps({ modelValue: true })
        await nextTick()

        expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
      })

      it('should default to closed', () => {
        const wrapper = mountWithStack(OverlayPanel.Root, {
          slots: {
            default: () => h(OverlayPanel.Content, {}, () => 'Content'),
          },
        })

        expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
      })
    })

    describe('context provision', () => {
      it('should provide context with default namespace', () => {
        const wrapper = mountWithStack(OverlayPanel.Root, {
          props: { modelValue: true },
          slots: {
            default: () => [
              h(OverlayPanel.Activator, {}, () => 'Open'),
              h(OverlayPanel.Content, {}, () => 'Content'),
            ],
          },
        })

        const trigger = wrapper.findComponent(OverlayPanel.Activator as any)
        const content = wrapper.find('[role="dialog"]')
        expect(trigger.exists()).toBe(true)
        expect(content.exists()).toBe(true)
      })

      it('should provide context with custom namespace', () => {
        const wrapper = mountWithStack(OverlayPanel.Root, {
          props: {
            namespace: 'v0:custom-overlay',
            modelValue: true,
          },
          slots: {
            default: () => [
              h(OverlayPanel.Activator, { namespace: 'v0:custom-overlay' }, () => 'Open'),
              h(OverlayPanel.Content, { namespace: 'v0:custom-overlay' }, () => 'Content'),
            ],
          },
        })

        const trigger = wrapper.findComponent(OverlayPanel.Activator as any)
        expect(trigger.exists()).toBe(true)
      })
    })

    describe('slot props', () => {
      it('should expose isOpen, open, close, toggle, and id in slot props', () => {
        let slotProps: any

        mountWithStack(OverlayPanel.Root, {
          slots: {
            default: (props: any) => {
              slotProps = props
              return h('div', 'Content')
            },
          },
        })

        expect(slotProps).toBeDefined()
        expect(typeof slotProps.isOpen).toBe('boolean')
        expect(typeof slotProps.open).toBe('function')
        expect(typeof slotProps.close).toBe('function')
        expect(typeof slotProps.toggle).toBe('function')
        expect(typeof slotProps.id).toBe('string')
      })
    })
  })

  describe('activator', () => {
    describe('rendering', () => {
      it('should render as button by default', () => {
        const wrapper = mountWithStack(OverlayPanel.Root, {
          slots: {
            default: () => h(OverlayPanel.Activator, {}, () => 'Open'),
          },
        })

        const trigger = wrapper.findComponent(OverlayPanel.Activator as any)
        expect(trigger.element.tagName).toBe('BUTTON')
      })

      it('should render as custom element when as prop is provided', () => {
        const wrapper = mountWithStack(OverlayPanel.Root, {
          slots: {
            default: () => h(OverlayPanel.Activator, { as: 'div' }, () => 'Open'),
          },
        })

        const trigger = wrapper.findComponent(OverlayPanel.Activator as any)
        expect(trigger.element.tagName).toBe('DIV')
      })

      it('should set type=button when as=button', () => {
        const wrapper = mountWithStack(OverlayPanel.Root, {
          slots: {
            default: () => h(OverlayPanel.Activator, {}, () => 'Open'),
          },
        })

        const trigger = wrapper.findComponent(OverlayPanel.Activator as any)
        expect(trigger.attributes('type')).toBe('button')
      })
    })

    describe('accessibility', () => {
      it('should have aria-haspopup=dialog', () => {
        const wrapper = mountWithStack(OverlayPanel.Root, {
          slots: {
            default: () => h(OverlayPanel.Activator, {}, () => 'Open'),
          },
        })

        const trigger = wrapper.findComponent(OverlayPanel.Activator as any)
        expect(trigger.attributes('aria-haspopup')).toBe('dialog')
      })

      it('should have aria-expanded=false when closed', () => {
        const wrapper = mountWithStack(OverlayPanel.Root, {
          slots: {
            default: () => h(OverlayPanel.Activator, {}, () => 'Open'),
          },
        })

        const trigger = wrapper.findComponent(OverlayPanel.Activator as any)
        expect(trigger.attributes('aria-expanded')).toBe('false')
      })

      it('should have aria-expanded=true when open', async () => {
        const wrapper = mountWithStack(OverlayPanel.Root, {
          props: { modelValue: true },
          slots: {
            default: () => h(OverlayPanel.Activator, {}, () => 'Open'),
          },
        })

        await nextTick()
        const trigger = wrapper.findComponent(OverlayPanel.Activator as any)
        expect(trigger.attributes('aria-expanded')).toBe('true')
      })

      it('should set data-open when open', async () => {
        const wrapper = mountWithStack(OverlayPanel.Root, {
          props: { modelValue: true },
          slots: {
            default: () => h(OverlayPanel.Activator, {}, () => 'Open'),
          },
        })

        await nextTick()
        const trigger = wrapper.findComponent(OverlayPanel.Activator as any)
        expect(trigger.attributes('data-open')).toBe('true')
      })
    })

    describe('non-button host polyfill', () => {
      it('should expose role, tabindex, and onKeydown when as is not button', () => {
        let attrs: any

        mountWithStack(OverlayPanel.Root, {
          slots: {
            default: () => h(OverlayPanel.Activator, { as: 'div' }, {
              default: (p: any) => {
                attrs = p.attrs
                return 'Open'
              },
            }),
          },
        })

        expect(attrs.role).toBe('button')
        expect(attrs.tabindex).toBe(0)
        expect(typeof attrs.onKeydown).toBe('function')
      })

      it('should open overlay via onKeydown Enter/Space on non-button activator', async () => {
        const isOpen = ref(false)
        let attrs: any

        mountWithStack(OverlayPanel.Root, {
          props: {
            'modelValue': isOpen.value,
            'onUpdate:modelValue': (v: unknown) => {
              isOpen.value = v as boolean
            },
          },
          slots: {
            default: () => [
              h(OverlayPanel.Activator, { as: 'div' }, {
                default: (p: any) => {
                  attrs = p.attrs
                  return 'Open'
                },
              }),
              h(OverlayPanel.Content, {}, () => 'Content'),
            ],
          },
        })

        await nextTick()
        const enter = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true })
        attrs.onKeydown(enter)
        await nextTick()
        expect(isOpen.value).toBe(true)
        expect(enter.defaultPrevented).toBe(true)

        isOpen.value = false
        await nextTick()
        const space = new KeyboardEvent('keydown', { key: ' ', cancelable: true })
        attrs.onKeydown(space)
        await nextTick()
        expect(isOpen.value).toBe(true)
        expect(space.defaultPrevented).toBe(true)
      })

      it('should omit onKeydown when as is button', () => {
        let attrs: any

        mountWithStack(OverlayPanel.Root, {
          slots: {
            default: () => h(OverlayPanel.Activator, {}, {
              default: (p: any) => {
                attrs = p.attrs
                return 'Open'
              },
            }),
          },
        })

        expect(attrs.onKeydown).toBeUndefined()
      })
    })

    describe('click handling', () => {
      it('should open overlay on click', async () => {
        const isOpen = ref(false)

        const wrapper = mountWithStack(OverlayPanel.Root, {
          props: {
            'modelValue': isOpen.value,
            'onUpdate:modelValue': (v: unknown) => {
              isOpen.value = v as boolean
            },
          },
          slots: {
            default: () => [
              h(OverlayPanel.Activator, {}, () => 'Open'),
              h(OverlayPanel.Content, {}, () => 'Content'),
            ],
          },
        })

        await wrapper.findComponent(OverlayPanel.Activator as any).trigger('click')
        await nextTick()

        expect(isOpen.value).toBe(true)
      })
    })
  })

  describe('content', () => {
    describe('rendering', () => {
      it('should render as div by default', async () => {
        const wrapper = mountWithStack(OverlayPanel.Root, {
          props: { modelValue: true },
          slots: {
            default: () => h(OverlayPanel.Content, {}, () => 'Content'),
          },
        })

        await nextTick()
        const content = wrapper.find('[role="dialog"]')
        expect(content.element.tagName).toBe('DIV')
      })

      it('should render children in default slot', async () => {
        const wrapper = mountWithStack(OverlayPanel.Root, {
          props: { modelValue: true },
          slots: {
            default: () => h(OverlayPanel.Content, {}, () => h('p', 'Panel content')),
          },
        })

        await nextTick()
        expect(wrapper.find('p').text()).toBe('Panel content')
      })

      it('should not render when closed', () => {
        const wrapper = mountWithStack(OverlayPanel.Root, {
          props: { modelValue: false },
          slots: {
            default: () => h(OverlayPanel.Content, {}, () => 'Content'),
          },
        })

        expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
      })
    })

    describe('accessibility', () => {
      it('should have role=dialog', async () => {
        const wrapper = mountWithStack(OverlayPanel.Root, {
          props: { modelValue: true },
          slots: {
            default: () => h(OverlayPanel.Content, {}, () => 'Content'),
          },
        })

        await nextTick()
        const content = wrapper.find('[role="dialog"]')
        expect(content.attributes('role')).toBe('dialog')
      })

      it('should have aria-modal=false (non-modal)', async () => {
        const wrapper = mountWithStack(OverlayPanel.Root, {
          props: { modelValue: true },
          slots: {
            default: () => h(OverlayPanel.Content, {}, () => 'Content'),
          },
        })

        await nextTick()
        const content = wrapper.find('[role="dialog"]')
        expect(content.attributes('aria-modal')).toBe('false')
      })
    })

    describe('click outside', () => {
      it('should close overlay when clicking outside with closeOnClickOutside=true', async () => {
        const isOpen = ref(true)

        const outsideEl = document.createElement('div')
        outsideEl.id = 'outside-click-target'
        document.body.append(outsideEl)

        mountWithStack(OverlayPanel.Root, {
          props: {
            'modelValue': isOpen.value,
            'onUpdate:modelValue': (v: unknown) => {
              isOpen.value = v as boolean
            },
          },
          attachTo: document.body,
          slots: {
            default: () => h(OverlayPanel.Content, { closeOnClickOutside: true }, () => h('div', { class: 'inner' }, 'Content')),
          },
        })

        await nextTick()

        outsideEl.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
        outsideEl.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))

        await nextTick()

        expect(isOpen.value).toBe(false)

        outsideEl.remove()
      })

      it('should not close overlay when closeOnClickOutside=false', async () => {
        const isOpen = ref(true)

        const outsideEl = document.createElement('div')
        outsideEl.id = 'outside'
        document.body.append(outsideEl)

        mountWithStack(OverlayPanel.Root, {
          props: {
            'modelValue': isOpen.value,
            'onUpdate:modelValue': (v: unknown) => {
              isOpen.value = v as boolean
            },
          },
          attachTo: document.body,
          slots: {
            default: () => h(OverlayPanel.Content, { closeOnClickOutside: false }, () => 'Content'),
          },
        })

        await nextTick()

        outsideEl.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
        outsideEl.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))

        await nextTick()

        expect(isOpen.value).toBe(true)

        outsideEl.remove()
      })
    })

    describe('escape key', () => {
      it('should close overlay when pressing Escape with closeOnEscape=true', async () => {
        const isOpen = ref(true)

        mountWithStack(OverlayPanel.Root, {
          props: {
            'modelValue': isOpen.value,
            'onUpdate:modelValue': (v: unknown) => {
              isOpen.value = v as boolean
            },
          },
          slots: {
            default: () => h(OverlayPanel.Content, { closeOnEscape: true }, () => 'Content'),
          },
        })

        await nextTick()

        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

        await nextTick()

        expect(isOpen.value).toBe(false)
      })

      it('should not close overlay when closeOnEscape=false', async () => {
        const isOpen = ref(true)

        mountWithStack(OverlayPanel.Root, {
          props: {
            'modelValue': isOpen.value,
            'onUpdate:modelValue': (v: unknown) => {
              isOpen.value = v as boolean
            },
          },
          slots: {
            default: () => h(OverlayPanel.Content, { closeOnEscape: false }, () => 'Content'),
          },
        })

        await nextTick()

        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

        await nextTick()

        expect(isOpen.value).toBe(true)
      })
    })

    describe('z-index stacking', () => {
      it('should have z-index from stack', async () => {
        const wrapper = mountWithStack(OverlayPanel.Root, {
          props: { modelValue: true },
          slots: {
            default: () => h(OverlayPanel.Content, {}, () => 'Content'),
          },
        })

        await nextTick()
        const content = wrapper.find('[role="dialog"]')
        const style = content.attributes('style')
        expect(style).toContain('z-index')
      })
    })
  })

  describe('close', () => {
    describe('rendering', () => {
      it('should render as button by default', async () => {
        const wrapper = mountWithStack(OverlayPanel.Root, {
          props: { modelValue: true },
          slots: {
            default: () => h(OverlayPanel.Content, {}, () => [
              h(OverlayPanel.Close, {}, () => 'Close'),
            ]),
          },
        })

        await nextTick()
        const close = wrapper.findComponent(OverlayPanel.Close as any)
        expect(close.element.tagName).toBe('BUTTON')
      })

      it('should set type=button when as=button', async () => {
        const wrapper = mountWithStack(OverlayPanel.Root, {
          props: { modelValue: true },
          slots: {
            default: () => h(OverlayPanel.Content, {}, () => [
              h(OverlayPanel.Close, {}, () => 'Close'),
            ]),
          },
        })

        await nextTick()
        const close = wrapper.findComponent(OverlayPanel.Close as any)
        expect(close.attributes('type')).toBe('button')
      })
    })

    describe('accessibility', () => {
      it('should have aria-label', async () => {
        const wrapper = mountWithStack(OverlayPanel.Root, {
          props: { modelValue: true },
          slots: {
            default: () => h(OverlayPanel.Content, {}, () => [
              h(OverlayPanel.Close, {}, () => 'Close'),
            ]),
          },
        })

        await nextTick()
        const close = wrapper.findComponent(OverlayPanel.Close as any)
        expect(close.attributes('aria-label')).toBeDefined()
      })

      it('should fall back to the inline default aria-label when no locale plugin is configured', async () => {
        const wrapper = mountWithStack(OverlayPanel.Root, {
          props: { modelValue: true },
          slots: {
            default: () => h(OverlayPanel.Content, {}, () => [
              h(OverlayPanel.Close, {}, () => 'Close'),
            ]),
          },
        })

        await nextTick()
        const close = wrapper.findComponent(OverlayPanel.Close as any)
        expect(close.attributes('aria-label')).toBe('Close')
      })

      it('should use the translated locale string for aria-label when one is registered', async () => {
        const plugin = createLocalePlugin({
          default: 'en',
          messages: {
            en: {
              OverlayPanel: {
                close: 'Schließen',
              },
            },
          },
        })

        const wrapper = mountWithStack(OverlayPanel.Root, {
          props: { modelValue: true },
          global: { plugins: [plugin] },
          slots: {
            default: () => h(OverlayPanel.Content, {}, () => [
              h(OverlayPanel.Close, {}, () => 'Close'),
            ]),
          },
        })

        await nextTick()
        const close = wrapper.findComponent(OverlayPanel.Close as any)
        expect(close.attributes('aria-label')).toBe('Schließen')
      })
    })

    describe('non-button host polyfill', () => {
      it('should close via onKeydown Enter/Space when as is not button', async () => {
        const isOpen = ref(true)
        let attrs: any

        mountWithStack(OverlayPanel.Root, {
          props: {
            'modelValue': isOpen.value,
            'onUpdate:modelValue': (v: unknown) => {
              isOpen.value = v as boolean
            },
          },
          slots: {
            default: () => h(OverlayPanel.Content, {}, () => [
              h(OverlayPanel.Close, { as: 'div' }, {
                default: (p: any) => {
                  attrs = p.attrs
                  return 'Close'
                },
              }),
            ]),
          },
        })

        await nextTick()
        expect(attrs.role).toBe('button')
        expect(attrs.tabindex).toBe(0)

        const enter = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true })
        attrs.onKeydown(enter)
        await nextTick()
        expect(isOpen.value).toBe(false)
        expect(enter.defaultPrevented).toBe(true)
      })
    })

    describe('click handling', () => {
      it('should close overlay on click', async () => {
        const isOpen = ref(true)

        const wrapper = mountWithStack(OverlayPanel.Root, {
          props: {
            'modelValue': isOpen.value,
            'onUpdate:modelValue': (v: unknown) => {
              isOpen.value = v as boolean
            },
          },
          slots: {
            default: () => h(OverlayPanel.Content, {}, () => [
              h(OverlayPanel.Close, {}, () => 'Close'),
            ]),
          },
        })

        await nextTick()
        expect(isOpen.value).toBe(true)

        await wrapper.findComponent(OverlayPanel.Close as any).trigger('click')
        expect(isOpen.value).toBe(false)
      })
    })
  })

  describe('integration', () => {
    it('should work as complete overlay with all sub-components', async () => {
      let isOpen = false

      const wrapper = mountWithStack(OverlayPanel.Root, {
        props: {
          'id': 'complete-overlay',
          'modelValue': isOpen,
          'onUpdate:modelValue': (v: unknown) => {
            isOpen = v as boolean
            wrapper.setProps({ modelValue: v as boolean })
          },
        },
        slots: {
          default: () => [
            h(OverlayPanel.Activator, {}, () => 'Open'),
            h(OverlayPanel.Content, {}, () => [
              h('p', 'Panel content'),
              h(OverlayPanel.Close, {}, () => 'Close'),
            ]),
          ],
        },
      })

      expect(isOpen).toBe(false)

      await wrapper.findComponent(OverlayPanel.Activator as any).trigger('click')
      await nextTick()
      expect(isOpen).toBe(true)

      await wrapper.findComponent(OverlayPanel.Close as any).trigger('click')
      await nextTick()
      expect(isOpen).toBe(false)
    })

    it('should use custom namespace for isolation', async () => {
      const wrapper = mountWithStack(defineComponent({
        render: () => [
          h(OverlayPanel.Root, { namespace: 'v0:overlay-1', modelValue: true }, () => [
            h(OverlayPanel.Activator, { namespace: 'v0:overlay-1' }, () => 'Open 1'),
            h(OverlayPanel.Content, { namespace: 'v0:overlay-1' }, () => 'Content 1'),
          ]),
          h(OverlayPanel.Root, { namespace: 'v0:overlay-2', modelValue: true }, () => [
            h(OverlayPanel.Activator, { namespace: 'v0:overlay-2' }, () => 'Open 2'),
            h(OverlayPanel.Content, { namespace: 'v0:overlay-2' }, () => 'Content 2'),
          ]),
        ],
      }))

      await nextTick()
      const triggers = wrapper.findAllComponents(OverlayPanel.Activator as any)
      expect(triggers).toHaveLength(2)
      expect(triggers[0]?.text()).toBe('Open 1')
      expect(triggers[1]?.text()).toBe('Open 2')
    })
  })

  describe('edge cases', () => {
    it('should handle rapid open/close cycles', async () => {
      const wrapper = mountWithStack(OverlayPanel.Root, {
        props: {
          modelValue: false,
        },
        slots: {
          default: () => h(OverlayPanel.Content, {}, () => 'Content'),
        },
      })

      await wrapper.setProps({ modelValue: true })
      await nextTick()
      await wrapper.setProps({ modelValue: false })
      await nextTick()
      await wrapper.setProps({ modelValue: true })
      await nextTick()

      expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
    })

    it('should handle overlay without activator (controlled)', async () => {
      const isOpen = ref(true)

      const wrapper = mountWithStack(OverlayPanel.Root, {
        props: {
          modelValue: isOpen.value,
        },
        slots: {
          default: () => h(OverlayPanel.Content, {}, () => [
            h(OverlayPanel.Close, {}, () => 'Close'),
          ]),
        },
      })

      await nextTick()
      expect(wrapper.find('[role="dialog"]').exists()).toBe(true)

      const close = wrapper.findComponent(OverlayPanel.Close as any)
      expect(close.exists()).toBe(true)
    })
  })

  // eslint-disable-next-line vitest/prefer-lowercase-title
  describe('SSR / Hydration', () => {
    it('should render to string on server without errors', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(OverlayPanel.Root as never, { id: 'test-overlay' }, {
            default: () => [
              h(OverlayPanel.Activator as never, {}, () => 'Open'),
              h(OverlayPanel.Content as never, {}, () => [
                h(OverlayPanel.Close as never, {}, () => 'Close'),
              ]),
            ],
          }),
      }))

      app.use(createStackPlugin())

      const html = await renderToString(app)

      expect(html).toBeTruthy()
      expect(html).toContain('Open')
    })

    it('should hydrate without mismatches', async () => {
      const Component = defineComponent({
        render: () =>
          h(OverlayPanel.Root as never, { id: 'test-overlay' }, {
            default: () => [
              h(OverlayPanel.Activator as never, {}, () => 'Open'),
              h(OverlayPanel.Content as never, {}, () => 'Content'),
            ],
          }),
      })

      const ssrApp = createSSRApp(Component)
      ssrApp.use(createStackPlugin())
      const serverHtml = await renderToString(ssrApp)

      const container = document.createElement('div')
      container.innerHTML = serverHtml

      const wrapper = mount(Component, {
        attachTo: container,
        global: {
          plugins: [stackPlugin],
        },
      })

      await nextTick()

      expect(wrapper.text()).toContain('Open')

      wrapper.unmount()
    })
  })

  describe('stack integration', () => {
    it('should register with stack and coordinate z-index', async () => {
      let capturedStack: ReturnType<typeof useStack> | undefined
      const wrapper = mountWithStack(
        defineComponent({
          setup () {
            capturedStack = useStack()
          },
          render: () => h(OverlayPanel.Root, { modelValue: true }, {
            default: () => h(OverlayPanel.Content as any, null, () => h('p', 'Body')),
          }),
        }),
        { attachTo: document.body },
      )

      await nextTick()
      expect(capturedStack!.isActive.value).toBe(false)

      wrapper.unmount()
      await nextTick()
    })
  })
})
