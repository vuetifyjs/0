import { beforeEach, describe, expect, it, vi } from 'vitest'

// Composables
import { createNotificationsContext } from '#v0/composables/useNotifications'
import { createStackPlugin } from '#v0/composables/useStack'

// Utilities
import { mount } from '@vue/test-utils'
import { defineComponent, h, provide } from 'vue'

import { Snackbar } from './index'

let stackPlugin: ReturnType<typeof createStackPlugin>

beforeEach(() => {
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
    it('should auto-generate id when not provided', () => {
      let slotProps: any

      mount(Snackbar.Root, {
        slots: {
          default: (props: any) => {
            slotProps = props
            return h('div', 'Content')
          },
        },
      })

      expect(slotProps.id).toBeTruthy()
      expect(typeof slotProps.id).toBe('string')
    })

    it('should use provided id', () => {
      let slotProps: any

      mount(Snackbar.Root, {
        props: { id: 'my-toast' },
        slots: {
          default: (props: any) => {
            slotProps = props
            return h('div', 'Content')
          },
        },
      })

      expect(slotProps.id).toBe('my-toast')
    })

    it('should emit dismiss with id when no queue context', async () => {
      const wrapper = mount(Snackbar.Root, {
        props: { id: 'test-id' },
        slots: {
          default: () => h(Snackbar.Close),
        },
      })

      await wrapper.findComponent(Snackbar.Close as any).trigger('click')

      expect(wrapper.emitted('dismiss')).toBeTruthy()
      expect(wrapper.emitted('dismiss')![0]).toEqual(['test-id'])
    })

    it('should call queue dismiss when inside queue context', async () => {
      const dismiss = vi.fn()

      const wrapper = mount(
        defineComponent({
          setup () {
            provide('v0:notifications:queue', { dismiss })
          },
          render () {
            return h(Snackbar.Root, { id: 'test-id' }, () => h(Snackbar.Close))
          },
        }),
      )

      await wrapper.findComponent(Snackbar.Close as any).trigger('click')

      expect(dismiss).toHaveBeenCalledWith('test-id')
    })

    it('should pass role attribute through to element', () => {
      const wrapper = mount(Snackbar.Root, {
        attrs: { role: 'alert' },
        slots: { default: () => h('span', 'Message') },
      })

      expect(wrapper.attributes('role')).toBe('alert')
    })
  })

  describe('close', () => {
    it('should render aria-label="Close"', () => {
      const wrapper = mount(Snackbar.Close)
      expect(wrapper.attributes('aria-label')).toBe('Close')
    })

    it('should render as button with type="button"', () => {
      const wrapper = mount(Snackbar.Close)
      expect(wrapper.element.tagName).toBe('BUTTON')
      expect(wrapper.attributes('type')).toBe('button')
    })

    it('should call onDismiss from root context on click', async () => {
      const onDismiss = vi.fn()

      const wrapper = mount(
        defineComponent({
          setup () {
            provide('v0:notifications:root', { id: 'x', onDismiss })
          },
          render () {
            return h(Snackbar.Close)
          },
        }),
      )

      await wrapper.findComponent(Snackbar.Close as any).trigger('click')

      expect(onDismiss).toHaveBeenCalledOnce()
    })

    it('should be a no-op when used without root context', async () => {
      const wrapper = mount(Snackbar.Close)
      // Should not throw
      await wrapper.trigger('click')
      expect(true).toBe(true)
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

  describe('queue', () => {
    function makeNotificationsPlugin () {
      const [, provide, context] = createNotificationsContext()
      return { context, install: (app: any) => app.runWithContext(() => provide(context, app)) }
    }

    it('should expose items via slot', async () => {
      const { context, install } = makeNotificationsPlugin()
      let slotProps: any

      const wrapper = mount(Snackbar.Queue, {
        global: { plugins: [stackPlugin, { install }] },
        slots: {
          default: (props: any) => {
            slotProps = props
            return h('div')
          },
        },
      })

      expect(slotProps).toBeDefined()
      expect(Array.isArray(slotProps.items)).toBe(true)
      expect(slotProps.items).toHaveLength(0)

      context.send({ subject: 'Test' })
      await wrapper.vm.$nextTick()

      expect(slotProps.items).toHaveLength(1)
      expect(slotProps.items[0].subject).toBe('Test')
    })

    it('should provide queue dismiss context', async () => {
      const { context, install } = makeNotificationsPlugin()

      context.send({ subject: 'Test', id: 'abc' })

      const wrapper = mount(Snackbar.Queue, {
        global: { plugins: [stackPlugin, { install }] },
        slots: {
          default: ({ items }: any) =>
            items.map((item: any) =>
              h(Snackbar.Root, { id: item.id }, () => h(Snackbar.Close)),
            ),
        },
      })

      await wrapper.findComponent(Snackbar.Close as any).trigger('click')

      expect(context.values()).toHaveLength(0)
    })

    it('should pause queue on mouseenter', async () => {
      const { context, install } = makeNotificationsPlugin()
      context.send({ subject: 'Test', timeout: 5000 })

      const wrapper = mount(Snackbar.Queue, {
        global: { plugins: [stackPlugin, { install }] },
        slots: { default: () => h('div') },
      })

      await wrapper.trigger('mouseenter')

      const first = context.queue.values()[0]
      expect(first?.isPaused).toBe(true)
    })

    it('should resume queue on mouseleave', async () => {
      const { context, install } = makeNotificationsPlugin()
      context.send({ subject: 'Test', timeout: 5000 })

      const wrapper = mount(Snackbar.Queue, {
        global: { plugins: [stackPlugin, { install }] },
        slots: { default: () => h('div') },
      })

      await wrapper.trigger('mouseenter')
      await wrapper.trigger('mouseleave')

      const first = context.queue.values()[0]
      expect(first?.isPaused).toBe(false)
    })
  })

  describe('integration', () => {
    it('should render Portal > Queue > Root > Content + Close', () => {
      const [, provide, context] = createNotificationsContext()
      context.send({ subject: 'File uploaded', id: 'upload-1' })

      const wrapper = mountWithStack(Snackbar.Portal, {
        props: { teleport: false },
        global: {
          plugins: [
            stackPlugin,
            {
              install: (app: any) => app.runWithContext(() => provide(context, app)),
            },
          ],
        },
        slots: {
          default: () =>
            h(Snackbar.Queue, {}, {
              default: ({ items }: any) =>
                items.map((item: any) =>
                  h(Snackbar.Root, { id: item.id }, () => [
                    h(Snackbar.Content, {}, () => item.subject),
                    h(Snackbar.Close),
                  ]),
                ),
            }),
        },
      })

      expect(wrapper.findComponent(Snackbar.Root as any).exists()).toBe(true)
      expect(wrapper.findComponent(Snackbar.Content as any).text()).toBe('File uploaded')
      expect(wrapper.findComponent(Snackbar.Close as any).attributes('aria-label')).toBe('Close')
    })
  })
})
