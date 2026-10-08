import { afterEach, describe, expect, it } from 'vitest'

import { Virtualizer } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, shallowRef, Transition, useTemplateRef } from 'vue'

// Types
import type { VirtualizerRootExpose } from './index'
import type { VueWrapper } from '@vue/test-utils'
import type { Component, ShallowRef } from 'vue'

const wrappers: VueWrapper[] = []

afterEach(() => {
  while (wrappers.length > 0) {
    wrappers.pop()!.unmount()
  }
})

function frame () {
  return new Promise(resolve => requestAnimationFrame(resolve))
}

async function settle () {
  await nextTick()
  await frame()
  await frame()
  await nextTick()
}

function mountVirtualizer (options: {
  count?: number
  props?: Record<string, unknown>
  attrs?: Record<string, unknown>
  item?: Record<string, unknown>
} = {}) {
  const items = Array.from({ length: options.count ?? 1000 }, (_, i) => ({ id: i }))

  const wrapper = mount(Virtualizer.Root as unknown as Component, {
    props: { items, itemHeight: 40, height: 400, ...options.props },
    attrs: options.attrs,
    slots: {
      default: (props: { items: { index: number }[] }) =>
        props.items.map(item =>
          h(Virtualizer.Item as Component, {
            key: item.index,
            index: item.index,
            style: { height: '40px', margin: 0 },
            ...options.item,
          }, () => `Item ${item.index}`),
        ),
    },
    attachTo: document.body,
  })

  wrappers.push(wrapper)

  return wrapper
}

function spacer (wrapper: VueWrapper, edge: 'start' | 'end') {
  return (wrapper.find(`[data-spacer="${edge}"]`).element as HTMLElement).offsetHeight
}

function buttonRows (props: { items: { index: number }[] }) {
  return props.items.map(item =>
    h(Virtualizer.Item as Component, { key: item.index, index: item.index, style: { height: '40px' } }, () =>
      h('button', { type: 'button' }, `Item ${item.index}`),
    ),
  )
}

function focusLog (events: string[]) {
  return {
    onFocus: () => events.push('focus'),
    onFocusin: (event: FocusEvent) => events.push(`focusin:${(event.target as HTMLElement).tagName}`),
  }
}

describe('virtualizer (browser)', () => {
  describe('windowing', () => {
    it('should render only the viewport plus overscan', async () => {
      const wrapper = mountVirtualizer({ props: { overscan: 3 } })
      await settle()

      // 400px viewport / 40px rows = 10 visible, +1 boundary row, +3 overscan below
      const rendered = wrapper.findAll('[data-index]')
      expect(rendered.length).toBeGreaterThanOrEqual(10)
      expect(rendered.length).toBeLessThanOrEqual(10 + 1 + 2 * 3)
      expect(rendered[0]!.attributes('data-index')).toBe('0')
    })

    it('should reserve the full list height through the spacers', async () => {
      const wrapper = mountVirtualizer()
      await settle()

      const el = wrapper.element as HTMLElement
      expect(el.scrollHeight).toBe(1000 * 40)
      expect(spacer(wrapper, 'start')).toBe(0)
      expect(spacer(wrapper, 'end')).toBeGreaterThan(0)
    })

    it('should move the window when the container scrolls', async () => {
      const wrapper = mountVirtualizer({ props: { overscan: 2 } })
      await settle()

      const el = wrapper.element as HTMLElement
      el.scrollTop = 20_000
      el.dispatchEvent(new Event('scroll'))
      await settle()

      const rendered = wrapper.findAll('[data-index]')
      const first = Number(rendered[0]!.attributes('data-index'))
      // Row 500 sits at the top of the viewport; overscan keeps two above it
      expect(first).toBe(498)
      expect(spacer(wrapper, 'start')).toBe(first * 40)
      expect(el.scrollHeight).toBe(1000 * 40)
    })

    it('should scroll to an index through the slot', async () => {
      let scrollTo: ((index: number) => void) | undefined
      const items = Array.from({ length: 1000 }, (_, i) => ({ id: i }))
      const wrapper = mount(Virtualizer.Root as unknown as Component, {
        props: { items, itemHeight: 40, height: 400 },
        slots: {
          default: (props: { items: { index: number }[], scrollTo: (index: number) => void }) => {
            scrollTo = props.scrollTo
            return props.items.map(item =>
              h(Virtualizer.Item as Component, { key: item.index, index: item.index, style: { height: '40px' } }),
            )
          },
        },
        attachTo: document.body,
      })
      wrappers.push(wrapper)
      await settle()

      scrollTo!(300)
      await settle()

      expect((wrapper.element as HTMLElement).scrollTop).toBe(300 * 40)
      expect(wrapper.find('[data-index="300"]').exists()).toBe(true)
    })
  })

  describe('expose', () => {
    it('should scroll to an index through a template ref', async () => {
      const items = Array.from({ length: 1000 }, (_, i) => ({ id: i }))
      let list: Readonly<ShallowRef<VirtualizerRootExpose | null>> | undefined
      const wrapper = mount(defineComponent({
        setup () {
          list = useTemplateRef<VirtualizerRootExpose>('list')
          return () => h(Virtualizer.Root as unknown as Component, { ref: 'list', items, itemHeight: 40, height: 400 }, { default: buttonRows })
        },
      }), { attachTo: document.body })
      wrappers.push(wrapper)
      await settle()

      list!.value!.scrollTo(300)
      await settle()

      expect((wrapper.element as HTMLElement).scrollTop).toBe(300 * 40)
      expect(wrapper.find('[data-index="300"]').exists()).toBe(true)
    })
  })

  describe('measurement', () => {
    it('should size spacers by the measured border box', async () => {
      // Rows render 40px content + 10px padding + 2px border = 52px border box.
      // Without itemHeight the first measurement becomes the estimate for every
      // unmeasured row, so the whole list sizes off the border box.
      const wrapper = mountVirtualizer({
        props: { itemHeight: undefined },
        item: { style: { height: '40px', padding: '5px 0', borderBottom: '2px solid', boxSizing: 'content-box' } },
      })
      await settle()

      const el = wrapper.element as HTMLElement
      expect(el.scrollHeight).toBe(1000 * 52)

      el.scrollTop = 52 * 100
      el.dispatchEvent(new Event('scroll'))
      await settle()

      const first = Number(wrapper.findAll('[data-index]')[0]!.attributes('data-index'))
      expect(spacer(wrapper, 'start')).toBe(first * 52)
    })
  })

  describe('sizing', () => {
    it('should keep a consumer inline height when the height prop is omitted', async () => {
      const wrapper = mountVirtualizer({
        props: { height: undefined },
        attrs: { style: { height: '300px' } },
      })
      await settle()

      expect((wrapper.element as HTMLElement).clientHeight).toBe(300)
      expect(wrapper.findAll('[data-index]').length).toBeLessThan(30)
    })
  })

  describe('accessibility', () => {
    it('should make the scroll container keyboard focusable', () => {
      const wrapper = mountVirtualizer()

      expect(wrapper.attributes('tabindex')).toBe('0')
    })

    it('should move focus to the container when a focused row scrolls out', async () => {
      const items = Array.from({ length: 1000 }, (_, i) => ({ id: i }))
      const wrapper = mount(Virtualizer.Root as unknown as Component, {
        props: { items, itemHeight: 40, height: 400, overscan: 2 },
        slots: {
          default: (props: { items: { index: number }[] }) =>
            props.items.map(item =>
              h(Virtualizer.Item as Component, { key: item.index, index: item.index, style: { height: '40px' } }, () =>
                h('button', { type: 'button' }, `Item ${item.index}`),
              ),
            ),
        },
        attachTo: document.body,
      })
      wrappers.push(wrapper)
      await settle()

      const button = wrapper.find('[data-index="0"] button').element as HTMLButtonElement
      button.focus()
      expect(document.activeElement).toBe(button)

      // Focus moves while the row is still attached, so ancestors that close
      // when focus leaves them see the container, not a hop through <body>
      let related: EventTarget | null | undefined
      button.addEventListener('focusout', event => {
        related = event.relatedTarget
      })

      const el = wrapper.element as HTMLElement
      el.scrollTop = 20_000
      el.dispatchEvent(new Event('scroll'))
      await settle()

      expect(wrapper.find('[data-index="0"]').exists()).toBe(false)
      expect(document.activeElement).toBe(el)
      expect(related).toBe(el)
    })

    it('should not focus the container when the whole root unmounts', async () => {
      const show = shallowRef(true)
      const events: string[] = []
      const items = Array.from({ length: 1000 }, (_, i) => ({ id: i }))
      const wrapper = mount(defineComponent({
        setup () {
          return () => show.value
            ? h(Virtualizer.Root as unknown as Component, {
                items,
                itemHeight: 40,
                height: 400,
                onFocus: () => events.push('focus'),
                onFocusin: (event: FocusEvent) => events.push(`focusin:${(event.target as HTMLElement).tagName}`),
              }, {
                default: (props: { items: { index: number }[] }) =>
                  props.items.map(item =>
                    h(Virtualizer.Item as Component, { key: item.index, index: item.index, style: { height: '40px' } }, () =>
                      h('button', { type: 'button' }, `Item ${item.index}`),
                    ),
                  ),
              })
            : h('div')
        },
      }), { attachTo: document.body })
      wrappers.push(wrapper)
      await settle()

      ;(wrapper.find('[data-index="1"] button').element as HTMLButtonElement).focus()
      events.length = 0

      show.value = false
      await settle()

      expect(events).toEqual([])
    })

    it('should not focus a root that is leaving through a transition', async () => {
      const style = document.createElement('style')
      style.textContent = '.v-leave-active { transition: opacity 300ms linear } .v-leave-to { opacity: 0 }'
      document.head.append(style)

      const show = shallowRef(true)
      const events: string[] = []
      const items = Array.from({ length: 1000 }, (_, i) => ({ id: i }))
      const wrapper = mount(defineComponent({
        setup () {
          return () => h(Transition, null, () => show.value
            ? h(Virtualizer.Root as unknown as Component, { items, itemHeight: 40, height: 400, ...focusLog(events) }, { default: buttonRows })
            : null)
        },
      }), { attachTo: document.body, global: { stubs: { transition: false } } })
      wrappers.push(wrapper)
      await settle()

      ;(wrapper.find('[data-index="1"] button').element as HTMLButtonElement).focus()
      events.length = 0

      show.value = false
      await settle()

      // The container is still in the DOM while it fades out
      expect(document.querySelector('[data-spacer]')?.isConnected).toBe(true)
      expect(events).toEqual([])
      style.remove()
    })

    it('should move focus to the container when the list renders inside a shadow root', async () => {
      const host = document.createElement('div')
      document.body.append(host)
      const shadow = host.attachShadow({ mode: 'open' })
      const target = document.createElement('div')
      shadow.append(target)

      const items = Array.from({ length: 1000 }, (_, i) => ({ id: i }))
      const wrapper = mount(Virtualizer.Root as unknown as Component, {
        props: { items, itemHeight: 40, height: 400, overscan: 2 },
        slots: { default: buttonRows },
        attachTo: target,
      })
      wrappers.push(wrapper)
      await settle()

      ;(shadow.querySelector('[data-index="0"] button') as HTMLButtonElement).focus()

      const el = wrapper.element as HTMLElement
      el.scrollTop = 20_000
      el.dispatchEvent(new Event('scroll'))
      await settle()

      expect(shadow.querySelector('[data-index="0"]')).toBeNull()
      expect(shadow.activeElement).toBe(el)
      host.remove()
    })

    it('should move focus to the container when focus sat inside a shadow root', async () => {
      const name = 'v0-virtualizer-shadow-input'
      if (!customElements.get(name)) {
        customElements.define(name, class extends HTMLElement {
          constructor () {
            super()
            this.attachShadow({ mode: 'open' }).append(document.createElement('input'))
          }
        })
      }

      const items = Array.from({ length: 1000 }, (_, i) => ({ id: i }))
      const wrapper = mount(Virtualizer.Root as unknown as Component, {
        props: { items, itemHeight: 40, height: 400, overscan: 2 },
        slots: {
          default: (props: { items: { index: number }[] }) =>
            props.items.map(item =>
              h(Virtualizer.Item as Component, { key: item.index, index: item.index, style: { height: '40px' } }, () => h(name)),
            ),
        },
        attachTo: document.body,
      })
      wrappers.push(wrapper)
      await settle()

      const host = wrapper.find('[data-index="0"]').element.firstElementChild as HTMLElement
      host.shadowRoot!.querySelector('input')!.focus()
      expect(document.activeElement).toBe(host)

      const el = wrapper.element as HTMLElement
      el.scrollTop = 20_000
      el.dispatchEvent(new Event('scroll'))
      await settle()

      expect(wrapper.find('[data-index="0"]').exists()).toBe(false)
      expect(document.activeElement).toBe(el)
    })
  })
})
