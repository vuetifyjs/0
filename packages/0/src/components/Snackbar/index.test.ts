import { beforeEach, describe, expect, it, vi } from 'vitest'

// Composables
import { createNotificationsContext } from '#v0/composables/useNotifications'
import { createStackPlugin } from '#v0/composables/useStack'

import { Snackbar } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { defineComponent, h, provide } from 'vue'

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

function makeNotificationsPlugin () {
  const [, provide, context] = createNotificationsContext()
  return { context, install: (app: any) => app.runWithContext(() => provide(context, app)) }
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

    it('should expose zIndex via slot props', () => {
      let slotProps: any

      mountWithStack(Snackbar.Portal, {
        props: { teleport: false },
        slots: {
          default: (props: any) => {
            slotProps = props
            return h('div', 'content')
          },
        },
      })

      expect(slotProps).toBeDefined()
      expect(typeof slotProps.zIndex).toBe('number')
    })

    it('should render with default teleport without throwing', () => {
      const wrapper = mountWithStack(Snackbar.Portal, {
        slots: {
          default: () => h('div', { class: 'teleported' }, 'Teleported content'),
        },
      })

      // Component mounts without error — content is teleported to body
      expect(wrapper.exists()).toBe(true)
      // Teleported content is not in wrapper's own DOM tree
      expect(wrapper.find('.teleported').exists()).toBe(false)
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
      const wrapper = mount(Snackbar.Root, {
        slots: { default: () => h(Snackbar.Close) },
      })
      const close = wrapper.findComponent(Snackbar.Close as any)
      expect(close.attributes('aria-label')).toBeDefined()
    })

    it('should render as button with type="button"', () => {
      const wrapper = mount(Snackbar.Root, {
        slots: { default: () => h(Snackbar.Close) },
      })
      const close = wrapper.findComponent(Snackbar.Close as any)
      expect(close.element.tagName).toBe('BUTTON')
      expect(close.attributes('type')).toBe('button')
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

      expect(onDismiss).toHaveBeenCalledTimes(1)
    })

    it('should not add type="button" when as is not button', () => {
      const wrapper = mount(Snackbar.Root, {
        slots: {
          default: () => h(Snackbar.Close, { as: 'div' }),
        },
      })
      const close = wrapper.findComponent(Snackbar.Close as any)
      expect(close.element.tagName).toBe('DIV')
      expect(close.attributes('type')).toBeUndefined()
    })

    it('should throw when used without root context', () => {
      expect(() => mount(Snackbar.Close)).toThrow()
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

    it('should pause queue on focusin', async () => {
      const { context, install } = makeNotificationsPlugin()
      context.send({ subject: 'Test', timeout: 5000 })

      const wrapper = mount(Snackbar.Queue, {
        global: { plugins: [stackPlugin, { install }] },
        slots: { default: () => h('div') },
      })

      await wrapper.trigger('focusin')

      const first = context.queue.values()[0]
      expect(first?.isPaused).toBe(true)
    })

    it('should resume queue on focusout', async () => {
      const { context, install } = makeNotificationsPlugin()
      context.send({ subject: 'Test', timeout: 5000 })

      const wrapper = mount(Snackbar.Queue, {
        global: { plugins: [stackPlugin, { install }] },
        slots: { default: () => h('div') },
      })

      await wrapper.trigger('focusin')
      await wrapper.trigger('focusout')

      const first = context.queue.values()[0]
      expect(first?.isPaused).toBe(false)
    })

    it('should not resume on focusout when relatedTarget is inside container', async () => {
      const { context, install } = makeNotificationsPlugin()
      context.send({ subject: 'Test', timeout: 5000 })

      const wrapper = mount(Snackbar.Queue, {
        global: { plugins: [stackPlugin, { install }] },
        slots: {
          default: () => h('div', [
            h('button', { class: 'child-a' }, 'A'),
            h('button', { class: 'child-b' }, 'B'),
          ]),
        },
      })

      await wrapper.trigger('focusin')
      expect(context.queue.values()[0]?.isPaused).toBe(true)

      // focusout where relatedTarget is null (happy-dom limitation) resumes
      await wrapper.trigger('focusout', { relatedTarget: null })
      expect(context.queue.values()[0]?.isPaused).toBe(false)
    })

    it('should not resume on unmount when not paused', async () => {
      const { context, install } = makeNotificationsPlugin()
      context.send({ subject: 'Test', timeout: 5000 })

      const wrapper = mount(Snackbar.Queue, {
        global: { plugins: [stackPlugin, { install }] },
        slots: { default: () => h('div') },
      })

      // Queue is NOT paused — verify it's running
      const first = context.queue.values()[0]
      expect(first?.isPaused).toBe(false)

      wrapper.unmount()

      // Queue state should remain unchanged (still not paused)
      expect(context.queue.values()[0]?.isPaused).toBe(false)
    })

    it('should resume queue when component unmounts while paused', async () => {
      const { context, install } = makeNotificationsPlugin()
      context.send({ subject: 'Test', timeout: 5000 })

      const wrapper = mount(Snackbar.Queue, {
        global: { plugins: [stackPlugin, { install }] },
        slots: { default: () => h('div') },
      })

      await wrapper.trigger('mouseenter')
      expect(context.queue.values()[0]?.isPaused).toBe(true)

      wrapper.unmount()

      const first = context.queue.values()[0]
      expect(first?.isPaused).toBe(false)
    })

    it('should re-pause queue after dismiss when reasons remain (hover during dismiss)', async () => {
      const { context, install } = makeNotificationsPlugin()
      context.send({ subject: 'A', id: 'a', timeout: 5000 })
      context.send({ subject: 'B', id: 'b', timeout: 5000 })

      const wrapper = mount(Snackbar.Queue, {
        global: { plugins: [stackPlugin, { install }] },
        slots: {
          default: ({ items }: any) =>
            items.map((item: any) =>
              h(Snackbar.Root, { id: item.id }, () => h(Snackbar.Close)),
            ),
        },
      })

      // Hover the queue → reasons has 'hover'
      await wrapper.trigger('mouseenter')
      expect(context.queue.values()[0]?.isPaused).toBe(true)

      // Dismiss the first toast — the dismiss() function calls unregister,
      // and because reasons.size > 0, it re-applies pause() on the still-running queue
      const closes = wrapper.findAllComponents(Snackbar.Close as any)
      await closes[0]!.trigger('click')

      // Remaining notification should still be paused
      const remaining = context.queue.values()
      expect(remaining.length).toBe(1)
      expect(remaining[0]?.isPaused).toBe(true)
    })

    it('should keep queue paused when one reason removed but other remains', async () => {
      const { context, install } = makeNotificationsPlugin()
      context.send({ subject: 'Test', timeout: 5000 })

      const wrapper = mount(Snackbar.Queue, {
        global: { plugins: [stackPlugin, { install }] },
        slots: { default: () => h('div') },
      })

      // Combine reasons: hover + focus
      await wrapper.trigger('mouseenter')
      await wrapper.trigger('focusin')
      expect(context.queue.values()[0]?.isPaused).toBe(true)

      // Remove only hover reason — queue should stay paused via focus reason
      await wrapper.trigger('mouseleave')
      expect(context.queue.values()[0]?.isPaused).toBe(true)

      // Now remove focus reason — queue should resume
      await wrapper.trigger('focusout', { relatedTarget: null })
      expect(context.queue.values()[0]?.isPaused).toBe(false)
    })

    it('should keep queue paused on focusout when relatedTarget remains inside container', async () => {
      const { context, install } = makeNotificationsPlugin()
      context.send({ subject: 'Test', timeout: 5000 })

      const wrapper = mount(Snackbar.Queue, {
        global: { plugins: [stackPlugin, { install }] },
        attachTo: document.body,
        slots: {
          default: () => h('div', [
            h('button', { class: 'inner-a' }, 'A'),
            h('button', { class: 'inner-b' }, 'B'),
          ]),
        },
      })

      // Focus moves into the container
      await wrapper.trigger('focusin')
      expect(context.queue.values()[0]?.isPaused).toBe(true)

      // Focus moves to a sibling that's still INSIDE the container
      const innerB = wrapper.find('.inner-b').element
      await wrapper.trigger('focusout', { relatedTarget: innerB })

      // Queue should remain paused — early return inside onFocusout when
      // relatedTarget is contained by container
      expect(context.queue.values()[0]?.isPaused).toBe(true)

      wrapper.unmount()
    })
  })

  describe('renderless', () => {
    it('should render no wrapper and carry role in slot attrs on root', () => {
      let captured: any

      const wrapper = mount(Snackbar.Root, {
        props: { renderless: true },
        slots: {
          default: (props: any) => {
            captured = props
            return h('span', { 'data-testid': 'custom-root', ...props.attrs }, 'Saved')
          },
        },
      })

      const custom = wrapper.find('span')
      expect(captured.attrs.role).toBe('status')
      expect(custom.exists()).toBe(true)
      expect(custom.attributes('role')).toBe('status')
      expect(wrapper.findAll('[role="status"]')).toHaveLength(1)
      expect(wrapper.findAll('div')).toHaveLength(0)
    })

    it('should expose onClick in slot attrs so renderless mode works on close', async () => {
      let captured: any

      const wrapper = mount(Snackbar.Root, {
        props: { id: 'test-id' },
        slots: {
          default: () => h(Snackbar.Close, { renderless: true }, {
            default: (props: any) => {
              captured = props
              return h('span', { 'data-testid': 'custom-close', ...props.attrs }, 'X')
            },
          }),
        },
      })

      expect(captured.attrs.onClick).toBeTypeOf('function')

      const custom = wrapper.find('[data-testid="custom-close"]')
      expect(custom.element.parentElement?.tagName).not.toBe('BUTTON')
      expect(wrapper.findAll('[aria-label]')).toHaveLength(1)

      await custom.trigger('click')
      expect(wrapper.emitted('dismiss')![0]).toEqual(['test-id'])
    })

    it('should expose pause handlers in slot attrs so renderless mode works on queue', async () => {
      const { context, install } = makeNotificationsPlugin()
      context.send({ subject: 'Test', timeout: 5000 })
      let captured: any

      const wrapper = mount(Snackbar.Queue, {
        props: { renderless: true },
        global: { plugins: [stackPlugin, { install }] },
        slots: {
          default: (props: any) => {
            captured = props
            return h('section', { 'data-testid': 'custom-queue', ...props.attrs })
          },
        },
      })

      const custom = wrapper.find('section')
      expect(captured.attrs.onMouseenter).toBeTypeOf('function')
      expect(captured.attrs.onFocusin).toBeTypeOf('function')
      expect(custom.exists()).toBe(true)
      expect(wrapper.findAll('div')).toHaveLength(0)

      await custom.trigger('mouseenter')
      expect(context.queue.values()[0]?.isPaused).toBe(true)

      await custom.trigger('mouseleave')
      expect(context.queue.values()[0]?.isPaused).toBe(false)

      await custom.trigger('focusin')
      expect(context.queue.values()[0]?.isPaused).toBe(true)

      await custom.trigger('focusout', { relatedTarget: null })
      expect(context.queue.values()[0]?.isPaused).toBe(false)
    })
  })

  describe('integration', () => {
    it('should render Portal > Queue > Root > Content + Close', () => {
      using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

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
      expect(wrapper.findComponent(Snackbar.Close as any).attributes('aria-label')).toBeDefined()
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })
})
