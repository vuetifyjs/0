import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderToString } from 'vue/server-renderer'

// Composables
import { createStackPlugin } from '#v0/composables/useStack'

import { AlertDialog } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue'

let stackPlugin: ReturnType<typeof createStackPlugin>

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = vi.fn()
  HTMLDialogElement.prototype.close = vi.fn()
  stackPlugin = createStackPlugin()
})

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

describe('alert-dialog', () => {
  describe('root', () => {
    it('should render as renderless by default', () => {
      const wrapper = mountWithStack(AlertDialog.Root, {
        slots: {
          default: () => h('div', { class: 'test-child' }, 'Content'),
        },
      })

      expect(wrapper.find('.test-child').exists()).toBe(true)
      expect(wrapper.element.tagName).toBe('DIV')
    })

    it('should support v-model for open state', async () => {
      const isOpen = ref(false)

      const wrapper = mountWithStack(AlertDialog.Root, {
        props: {
          'modelValue': isOpen.value,
          'onUpdate:modelValue': (v: unknown) => {
            isOpen.value = v as boolean
          },
        },
        slots: {
          default: () => [
            h(AlertDialog.Activator, {}, () => 'Open'),
            h(AlertDialog.Content, {}, () => 'Content'),
          ],
        },
      })

      expect(isOpen.value).toBe(false)

      await wrapper.findComponent(AlertDialog.Activator as any).trigger('click')
      expect(isOpen.value).toBe(true)
    })

    it('should expose isOpen, open, close, isPending, and id in slot props', () => {
      let slotProps: any

      mountWithStack(AlertDialog.Root, {
        slots: {
          default: (props: any) => {
            slotProps = props
            return h('div', 'Content')
          },
        },
      })

      expect(slotProps).toBeDefined()
      expect(typeof slotProps.isOpen).toBe('boolean')
      expect(typeof slotProps.isPending).toBe('boolean')
      expect(typeof slotProps.open).toBe('function')
      expect(typeof slotProps.close).toBe('function')
      expect(typeof slotProps.id).toBe('string')
    })

    it('should default to closed', () => {
      const wrapper = mountWithStack(AlertDialog.Root, {
        slots: {
          default: () => h(AlertDialog.Content, {}, () => 'Content'),
        },
      })

      expect(wrapper.findComponent(AlertDialog.Content as any).exists()).toBe(true)
    })
  })

  describe('activator', () => {
    it('should render as button by default', () => {
      const wrapper = mountWithStack(AlertDialog.Root, {
        slots: {
          default: () => h(AlertDialog.Activator, {}, () => 'Open'),
        },
      })

      const trigger = wrapper.findComponent(AlertDialog.Activator as any)
      expect(trigger.element.tagName).toBe('BUTTON')
    })

    it('should have aria-haspopup=dialog', () => {
      const wrapper = mountWithStack(AlertDialog.Root, {
        slots: {
          default: () => h(AlertDialog.Activator, {}, () => 'Open'),
        },
      })

      const trigger = wrapper.findComponent(AlertDialog.Activator as any)
      expect(trigger.attributes('aria-haspopup')).toBe('dialog')
    })

    it('should have aria-expanded=false when closed', () => {
      const wrapper = mountWithStack(AlertDialog.Root, {
        slots: {
          default: () => h(AlertDialog.Activator, {}, () => 'Open'),
        },
      })

      const trigger = wrapper.findComponent(AlertDialog.Activator as any)
      expect(trigger.attributes('aria-expanded')).toBe('false')
    })

    it('should have aria-expanded=true when open', async () => {
      const wrapper = mountWithStack(AlertDialog.Root, {
        props: { modelValue: true },
        slots: {
          default: () => h(AlertDialog.Activator, {}, () => 'Open'),
        },
      })

      await nextTick()
      const trigger = wrapper.findComponent(AlertDialog.Activator as any)
      expect(trigger.attributes('aria-expanded')).toBe('true')
    })

    it('should open alert dialog on click', async () => {
      const wrapper = mountWithStack(AlertDialog.Root, {
        slots: {
          default: () => [
            h(AlertDialog.Activator, {}, () => 'Open'),
            h(AlertDialog.Content, {}, () => 'Content'),
          ],
        },
      })

      await wrapper.findComponent(AlertDialog.Activator as any).trigger('click')
      await nextTick()

      expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled()
    })
  })

  describe('content', () => {
    it('should render as dialog by default', () => {
      const wrapper = mountWithStack(AlertDialog.Root, {
        slots: {
          default: () => h(AlertDialog.Content, {}, () => 'Content'),
        },
      })

      const content = wrapper.findComponent(AlertDialog.Content as any)
      expect(content.element.tagName).toBe('DIALOG')
    })

    it('should have role=alertdialog', () => {
      const wrapper = mountWithStack(AlertDialog.Root, {
        slots: {
          default: () => h(AlertDialog.Content, {}, () => 'Content'),
        },
      })

      const content = wrapper.findComponent(AlertDialog.Content as any)
      expect(content.attributes('role')).toBe('alertdialog')
    })

    it('should have aria-modal=true', () => {
      const wrapper = mountWithStack(AlertDialog.Root, {
        slots: {
          default: () => h(AlertDialog.Content, {}, () => 'Content'),
        },
      })

      const content = wrapper.findComponent(AlertDialog.Content as any)
      expect(content.attributes('aria-modal')).toBe('true')
    })

    it('should have aria-labelledby pointing to title', () => {
      const wrapper = mountWithStack(AlertDialog.Root, {
        props: { id: 'test-alert' },
        slots: {
          default: () => h(AlertDialog.Content, {}, () => [
            h(AlertDialog.Title, {}, () => 'Title'),
          ]),
        },
      })

      const content = wrapper.findComponent(AlertDialog.Content as any)
      expect(content.attributes('aria-labelledby')).toBe('test-alert-title')
    })

    it('should have aria-describedby pointing to description', () => {
      const wrapper = mountWithStack(AlertDialog.Root, {
        props: { id: 'test-alert' },
        slots: {
          default: () => h(AlertDialog.Content, {}, () => [
            h(AlertDialog.Description, {}, () => 'Description'),
          ]),
        },
      })

      const content = wrapper.findComponent(AlertDialog.Content as any)
      expect(content.attributes('aria-describedby')).toBe('test-alert-description')
    })

    it('should call showModal when opened', async () => {
      mountWithStack(AlertDialog.Root, {
        props: { modelValue: true },
        slots: {
          default: () => h(AlertDialog.Content, {}, () => 'Content'),
        },
      })

      await nextTick()
      expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled()
    })

    it('should call close when closed', async () => {
      const wrapper = mountWithStack(AlertDialog.Root, {
        props: { modelValue: true },
        slots: {
          default: () => h(AlertDialog.Content, {}, () => 'Content'),
        },
      })

      await nextTick()
      await wrapper.setProps({ modelValue: false })
      await nextTick()

      expect(HTMLDialogElement.prototype.close).toHaveBeenCalled()
    })

    it('should NOT close on click outside by default', async () => {
      const isOpen = ref(true)

      const outsideEl = document.createElement('div')
      document.body.append(outsideEl)

      const wrapper = mountWithStack(AlertDialog.Root, {
        props: {
          'modelValue': isOpen.value,
          'onUpdate:modelValue': (v: unknown) => {
            isOpen.value = v as boolean
          },
        },
        attachTo: document.body,
        slots: {
          default: () => h(AlertDialog.Content, {}, () => 'Content'),
        },
      })

      await nextTick()

      outsideEl.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
      outsideEl.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))

      await nextTick()

      expect(isOpen.value).toBe(true)

      wrapper.unmount()
      outsideEl.remove()
    })

    it('should NOT close on escape by default', async () => {
      const isOpen = ref(true)

      const wrapper = mountWithStack(AlertDialog.Root, {
        props: {
          'modelValue': isOpen.value,
          'onUpdate:modelValue': (v: unknown) => {
            isOpen.value = v as boolean
          },
        },
        slots: {
          default: () => h(AlertDialog.Content, {}, () => 'Content'),
        },
      })

      await nextTick()

      const content = wrapper.findComponent(AlertDialog.Content as any)
      const cancelEvent = new Event('cancel', { cancelable: true })
      await content.element.dispatchEvent(cancelEvent)

      await nextTick()

      expect(isOpen.value).toBe(true)
      expect(cancelEvent.defaultPrevented).toBe(true)
    })

    it('should close on escape when closeOnEscape=true', async () => {
      const isOpen = ref(true)

      const wrapper = mountWithStack(AlertDialog.Root, {
        props: {
          'modelValue': isOpen.value,
          'onUpdate:modelValue': (v: unknown) => {
            isOpen.value = v as boolean
          },
        },
        slots: {
          default: () => h(AlertDialog.Content, { closeOnEscape: true }, () => 'Content'),
        },
      })

      await nextTick()

      const content = wrapper.findComponent(AlertDialog.Content as any)
      await content.trigger('cancel')

      await nextTick()

      expect(isOpen.value).toBe(false)
    })

    it('should close on click outside when closeOnClickOutside=true', async () => {
      const isOpen = ref(true)

      const outsideEl = document.createElement('div')
      document.body.append(outsideEl)

      const originalGetBoundingClientRect = HTMLDialogElement.prototype.getBoundingClientRect
      HTMLDialogElement.prototype.getBoundingClientRect = vi.fn(() => ({
        left: 100, right: 300, top: 100, bottom: 300,
        width: 200, height: 200, x: 100, y: 100,
        toJSON: () => ({}),
      }))

      const wrapper = mountWithStack(AlertDialog.Root, {
        props: {
          'modelValue': isOpen.value,
          'onUpdate:modelValue': (v: unknown) => {
            isOpen.value = v as boolean
          },
        },
        attachTo: document.body,
        slots: {
          default: () => h(AlertDialog.Content, { closeOnClickOutside: true }, () => 'Content'),
        },
      })

      await nextTick()

      outsideEl.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 0, clientY: 0 }))
      outsideEl.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, clientX: 0, clientY: 0 }))

      await nextTick()

      expect(isOpen.value).toBe(false)

      wrapper.unmount()
      outsideEl.remove()
      HTMLDialogElement.prototype.getBoundingClientRect = originalGetBoundingClientRect
    })
  })

  describe('title', () => {
    it('should render as h2 by default', () => {
      const wrapper = mountWithStack(AlertDialog.Root, {
        slots: {
          default: () => h(AlertDialog.Content, {}, () => [
            h(AlertDialog.Title, {}, () => 'Title'),
          ]),
        },
      })

      const title = wrapper.findComponent(AlertDialog.Title as any)
      expect(title.element.tagName).toBe('H2')
    })

    it('should have correct id for aria-labelledby', () => {
      const wrapper = mountWithStack(AlertDialog.Root, {
        props: { id: 'test-alert' },
        slots: {
          default: () => h(AlertDialog.Content, {}, () => [
            h(AlertDialog.Title, {}, () => 'Title'),
          ]),
        },
      })

      const title = wrapper.findComponent(AlertDialog.Title as any)
      expect(title.attributes('id')).toBe('test-alert-title')
    })
  })

  describe('description', () => {
    it('should render as p by default', () => {
      const wrapper = mountWithStack(AlertDialog.Root, {
        slots: {
          default: () => h(AlertDialog.Content, {}, () => [
            h(AlertDialog.Description, {}, () => 'Description'),
          ]),
        },
      })

      const description = wrapper.findComponent(AlertDialog.Description as any)
      expect(description.element.tagName).toBe('P')
    })

    it('should have correct id for aria-describedby', () => {
      const wrapper = mountWithStack(AlertDialog.Root, {
        props: { id: 'test-alert' },
        slots: {
          default: () => h(AlertDialog.Content, {}, () => [
            h(AlertDialog.Description, {}, () => 'Description'),
          ]),
        },
      })

      const description = wrapper.findComponent(AlertDialog.Description as any)
      expect(description.attributes('id')).toBe('test-alert-description')
    })
  })

  describe('cancel', () => {
    it('should render as button by default', () => {
      const wrapper = mountWithStack(AlertDialog.Root, {
        slots: {
          default: () => h(AlertDialog.Content, {}, () => [
            h(AlertDialog.Cancel, {}, () => 'Cancel'),
          ]),
        },
      })

      const cancel = wrapper.findComponent(AlertDialog.Cancel as any)
      expect(cancel.element.tagName).toBe('BUTTON')
    })

    it('should set type=button', () => {
      const wrapper = mountWithStack(AlertDialog.Root, {
        slots: {
          default: () => h(AlertDialog.Content, {}, () => [
            h(AlertDialog.Cancel, {}, () => 'Cancel'),
          ]),
        },
      })

      const cancel = wrapper.findComponent(AlertDialog.Cancel as any)
      expect(cancel.attributes('type')).toBe('button')
    })

    it('should close dialog on click', async () => {
      const isOpen = ref(true)

      const wrapper = mountWithStack(AlertDialog.Root, {
        props: {
          'modelValue': isOpen.value,
          'onUpdate:modelValue': (v: unknown) => {
            isOpen.value = v as boolean
          },
        },
        slots: {
          default: () => h(AlertDialog.Content, {}, () => [
            h(AlertDialog.Cancel, {}, () => 'Cancel'),
          ]),
        },
      })

      await nextTick()
      expect(isOpen.value).toBe(true)

      await wrapper.findComponent(AlertDialog.Cancel as any).trigger('click')
      expect(isOpen.value).toBe(false)
    })

    it('should render data-disabled when disabled', () => {
      const wrapper = mountWithStack(AlertDialog.Root, {
        slots: {
          default: () => h(AlertDialog.Content, {}, () => [
            h(AlertDialog.Cancel, { disabled: true }, () => 'Cancel'),
          ]),
        },
      })

      const cancel = wrapper.findComponent(AlertDialog.Cancel as any)
      expect(cancel.attributes('data-disabled')).toBe('')
    })
  })

  describe('close', () => {
    it('should render as button by default', () => {
      const wrapper = mountWithStack(AlertDialog.Root, {
        slots: {
          default: () => h(AlertDialog.Content, {}, () => [
            h(AlertDialog.Close, {}, () => 'X'),
          ]),
        },
      })

      const close = wrapper.findComponent(AlertDialog.Close as any)
      expect(close.element.tagName).toBe('BUTTON')
    })

    it('should set type=button', () => {
      const wrapper = mountWithStack(AlertDialog.Root, {
        slots: {
          default: () => h(AlertDialog.Content, {}, () => [
            h(AlertDialog.Close, {}, () => 'X'),
          ]),
        },
      })

      const close = wrapper.findComponent(AlertDialog.Close as any)
      expect(close.attributes('type')).toBe('button')
    })

    it('should have aria-label=Close', () => {
      const wrapper = mountWithStack(AlertDialog.Root, {
        slots: {
          default: () => h(AlertDialog.Content, {}, () => [
            h(AlertDialog.Close, {}, () => 'X'),
          ]),
        },
      })

      const close = wrapper.findComponent(AlertDialog.Close as any)
      expect(close.attributes('aria-label')).toBeDefined()
    })

    it('should close dialog on click', async () => {
      const isOpen = ref(true)

      const wrapper = mountWithStack(AlertDialog.Root, {
        props: {
          'modelValue': isOpen.value,
          'onUpdate:modelValue': (v: unknown) => {
            isOpen.value = v as boolean
          },
        },
        slots: {
          default: () => h(AlertDialog.Content, {}, () => [
            h(AlertDialog.Close, {}, () => 'X'),
          ]),
        },
      })

      await nextTick()
      expect(isOpen.value).toBe(true)

      await wrapper.findComponent(AlertDialog.Close as any).trigger('click')
      expect(isOpen.value).toBe(false)
    })
  })

  describe('action', () => {
    it('should render as button by default', () => {
      const wrapper = mountWithStack(AlertDialog.Root, {
        slots: {
          default: () => h(AlertDialog.Content, {}, () => [
            h(AlertDialog.Action, {}, () => 'Confirm'),
          ]),
        },
      })

      const action = wrapper.findComponent(AlertDialog.Action as any)
      expect(action.element.tagName).toBe('BUTTON')
    })

    it('should set type=button', () => {
      const wrapper = mountWithStack(AlertDialog.Root, {
        slots: {
          default: () => h(AlertDialog.Content, {}, () => [
            h(AlertDialog.Action, {}, () => 'Confirm'),
          ]),
        },
      })

      const action = wrapper.findComponent(AlertDialog.Action as any)
      expect(action.attributes('type')).toBe('button')
    })

    it('should close immediately when wait() is not called', async () => {
      const isOpen = ref(true)
      const onAction = vi.fn()

      const wrapper = mountWithStack(AlertDialog.Root, {
        props: {
          'modelValue': isOpen.value,
          'onUpdate:modelValue': (v: unknown) => {
            isOpen.value = v as boolean
          },
        },
        slots: {
          default: () => h(AlertDialog.Content, {}, () => [
            h(AlertDialog.Action, { onAction }, () => 'Confirm'),
          ]),
        },
      })

      await nextTick()

      await wrapper.findComponent(AlertDialog.Action as any).trigger('click')
      await nextTick()

      expect(onAction).toHaveBeenCalled()
      expect(isOpen.value).toBe(false)
    })

    it('should stay open when wait() is called', async () => {
      const isOpen = ref(true)
      const onAction = vi.fn((e: { wait: () => void, close: () => void }) => {
        e.wait()
      })

      const wrapper = mountWithStack(AlertDialog.Root, {
        props: {
          'modelValue': isOpen.value,
          'onUpdate:modelValue': (v: unknown) => {
            isOpen.value = v as boolean
          },
        },
        slots: {
          default: () => h(AlertDialog.Content, {}, () => [
            h(AlertDialog.Action, { onAction }, () => 'Confirm'),
          ]),
        },
      })

      await nextTick()

      await wrapper.findComponent(AlertDialog.Action as any).trigger('click')
      await nextTick()

      expect(onAction).toHaveBeenCalled()
      expect(isOpen.value).toBe(true)
    })

    it('should set isPending between wait() and close()', async () => {
      const isOpen = ref(true)
      let closeFn: (() => void) | undefined

      const onAction = vi.fn((e: { wait: () => void, close: () => void }) => {
        e.wait()
        closeFn = e.close
      })

      const wrapper = mountWithStack(AlertDialog.Root, {
        props: {
          'modelValue': isOpen.value,
          'onUpdate:modelValue': (v: unknown) => {
            isOpen.value = v as boolean
          },
        },
        slots: {
          default: () => h(AlertDialog.Content, {}, () => [
            h(AlertDialog.Action, { onAction }, () => 'Confirm'),
          ]),
        },
      })

      await nextTick()

      await wrapper.findComponent(AlertDialog.Action as any).trigger('click')
      await nextTick()

      // isPending should be true after wait()
      const action = wrapper.findComponent(AlertDialog.Action as any)
      expect(action.attributes('data-pending')).toBe('')

      // Call close to resolve
      closeFn!()
      await nextTick()

      expect(isOpen.value).toBe(false)
    })

    it('should expose isPending in slot props', async () => {
      const isOpen = ref(true)
      let slotIsPending = false

      const onAction = vi.fn((e: { wait: () => void, close: () => void }) => {
        e.wait()
      })

      mountWithStack(AlertDialog.Root, {
        props: {
          'modelValue': isOpen.value,
          'onUpdate:modelValue': (v: unknown) => {
            isOpen.value = v as boolean
          },
        },
        slots: {
          default: () => h(AlertDialog.Content, {}, () => [
            h(AlertDialog.Action, { onAction }, {
              default: (props: any) => {
                slotIsPending = props.isPending
                return h('span', slotIsPending ? 'Loading...' : 'Confirm')
              },
            }),
          ]),
        },
      })

      await nextTick()

      expect(slotIsPending).toBe(false)
    })

    it('should render data-disabled when disabled', () => {
      const wrapper = mountWithStack(AlertDialog.Root, {
        slots: {
          default: () => h(AlertDialog.Content, {}, () => [
            h(AlertDialog.Action, { disabled: true }, () => 'Confirm'),
          ]),
        },
      })

      const action = wrapper.findComponent(AlertDialog.Action as any)
      expect(action.attributes('data-disabled')).toBe('')
    })

    it('should not emit action when disabled', async () => {
      const isOpen = ref(true)
      const onAction = vi.fn()

      const wrapper = mountWithStack(AlertDialog.Root, {
        props: {
          'modelValue': isOpen.value,
          'onUpdate:modelValue': (v: unknown) => {
            isOpen.value = v as boolean
          },
        },
        slots: {
          default: () => h(AlertDialog.Content, {}, () => [
            h(AlertDialog.Action, { disabled: true, onAction }, () => 'Confirm'),
          ]),
        },
      })

      await nextTick()

      await wrapper.findComponent(AlertDialog.Action as any).trigger('click')
      await nextTick()

      expect(onAction).not.toHaveBeenCalled()
      expect(isOpen.value).toBe(true)
    })
  })

  describe('integration', () => {
    it('should work as complete alert dialog with all sub-components', async () => {
      let isOpen = false

      const wrapper = mountWithStack(AlertDialog.Root, {
        props: {
          'id': 'complete-alert',
          'modelValue': isOpen,
          'onUpdate:modelValue': (v: unknown) => {
            isOpen = v as boolean
            wrapper.setProps({ modelValue: v as boolean })
          },
        },
        slots: {
          default: () => [
            h(AlertDialog.Activator, {}, () => 'Delete'),
            h(AlertDialog.Content, {}, () => [
              h(AlertDialog.Title, {}, () => 'Are you sure?'),
              h(AlertDialog.Description, {}, () => 'This cannot be undone.'),
              h(AlertDialog.Cancel, {}, () => 'Cancel'),
              h(AlertDialog.Action, {}, () => 'Confirm'),
            ]),
          ],
        },
      })

      // Initially closed
      expect(isOpen).toBe(false)

      // Open via activator
      await wrapper.findComponent(AlertDialog.Activator as any).trigger('click')
      await nextTick()
      expect(isOpen).toBe(true)
      expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled()

      // Close via cancel
      await wrapper.findComponent(AlertDialog.Cancel as any).trigger('click')
      await nextTick()
      expect(isOpen).toBe(false)
    })

    it('should support async confirm flow', async () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const isOpen = ref(true)
      let closeFn: (() => void) | undefined

      const onAction = vi.fn((e: { wait: () => void, close: () => void }) => {
        e.wait()
        closeFn = e.close
      })

      mountWithStack(AlertDialog.Root, {
        props: {
          'modelValue': isOpen.value,
          'onUpdate:modelValue': (v: unknown) => {
            isOpen.value = v as boolean
          },
        },
        slots: {
          default: () => h(AlertDialog.Content, {}, () => [
            h(AlertDialog.Cancel, {}, () => 'Cancel'),
            h(AlertDialog.Action, { onAction }, () => 'Delete'),
          ]),
        },
      })

      await nextTick()

      // Trigger action with wait()
      const wrapper = mountWithStack(AlertDialog.Root, {
        props: {
          'modelValue': isOpen.value,
          'onUpdate:modelValue': (v: unknown) => {
            isOpen.value = v as boolean
          },
        },
        slots: {
          default: () => h(AlertDialog.Content, {}, () => [
            h(AlertDialog.Action, { onAction }, () => 'Delete'),
          ]),
        },
      })

      await nextTick()

      await wrapper.findComponent(AlertDialog.Action as any).trigger('click')
      await nextTick()

      // Dialog stays open
      expect(isOpen.value).toBe(true)

      // Resolve via close()
      closeFn!()
      await nextTick()

      expect(isOpen.value).toBe(false)
      expect(spy).toHaveBeenCalledTimes(1)

      spy.mockRestore()
    })
  })
})

describe('alert-dialog SSR', () => {
  it('should render to string on server without errors', async () => {
    const app = createSSRApp(defineComponent({
      render: () =>
        h(AlertDialog.Root as never, { id: 'test-alert' }, {
          default: () => [
            h(AlertDialog.Activator as never, {}, () => 'Delete'),
            h(AlertDialog.Content as never, {}, () => [
              h(AlertDialog.Title as never, {}, () => 'Are you sure?'),
              h(AlertDialog.Description as never, {}, () => 'This cannot be undone.'),
              h(AlertDialog.Cancel as never, {}, () => 'Cancel'),
              h(AlertDialog.Action as never, {}, () => 'Confirm'),
            ]),
          ],
        }),
    }))

    app.use(createStackPlugin())

    const html = await renderToString(app)

    expect(html).toBeTruthy()
    expect(html).toContain('Delete')
    expect(html).toContain('Are you sure?')
    expect(html).toContain('This cannot be undone.')
  })
})
