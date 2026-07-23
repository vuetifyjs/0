import { describe, expect, it } from 'vitest'
import { renderToString } from 'vue/server-renderer'

import { AspectRatio } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick } from 'vue'

describe('aspectRatio', () => {
  describe('rendering', () => {
    it('should render as div by default', () => {
      const wrapper = mount(AspectRatio, {
        slots: { default: () => h('span', 'Content') },
      })

      expect(wrapper.element.tagName).toBe('DIV')
    })

    it('should render as custom element when as prop is provided', () => {
      const wrapper = mount(AspectRatio, {
        props: { as: 'section' },
        slots: { default: () => h('span', 'Content') },
      })

      expect(wrapper.element.tagName).toBe('SECTION')
    })

    it('should render slot content into the reserved frame', () => {
      const wrapper = mount(AspectRatio, {
        slots: { default: () => h('span', { class: 'inner' }, 'Content') },
      })

      const inner = wrapper.find('.inner')
      expect(inner.exists()).toBe(true)
      expect(inner.text()).toBe('Content')
    })

    it('should support renderless mode by rendering only the slot root', () => {
      const wrapper = mount(AspectRatio, {
        props: { renderless: true },
        slots: { default: () => h('figure', { class: 'custom' }, 'Content') },
      })

      expect(wrapper.find('.custom').exists()).toBe(true)
      expect(wrapper.find('.custom').text()).toBe('Content')
    })
  })

  describe('ratio', () => {
    it('should default to a square (1 / 1)', () => {
      const wrapper = mount(AspectRatio, {
        slots: { default: () => h('span') },
      })

      expect((wrapper.element as HTMLElement).style.aspectRatio).toBe('1 / 1')
    })

    it('should apply a numeric ratio as inline style', () => {
      const wrapper = mount(AspectRatio, {
        props: { ratio: 16 / 9 },
        slots: { default: () => h('span') },
      })

      expect((wrapper.element as HTMLElement).style.aspectRatio).toContain('1.77')
    })

    it('should apply a string ratio as inline style', () => {
      const wrapper = mount(AspectRatio, {
        props: { ratio: '4 / 3' },
        slots: { default: () => h('span') },
      })

      expect((wrapper.element as HTMLElement).style.aspectRatio).toBe('4 / 3')
    })

    it('should resolve to a real computed aspect-ratio in the browser', () => {
      const wrapper = mount(AspectRatio, {
        attachTo: document.body,
        props: { ratio: '16 / 9' },
        slots: { default: () => h('span') },
      })

      const computed = getComputedStyle(wrapper.element).aspectRatio
      expect(computed).not.toBe('auto')
      expect(computed).toBeTruthy()

      wrapper.unmount()
    })

    it('should update reactively when the ratio changes', async () => {
      const wrapper = mount(AspectRatio, {
        props: { ratio: '1 / 1' },
        slots: { default: () => h('span') },
      })

      expect((wrapper.element as HTMLElement).style.aspectRatio).toBe('1 / 1')

      await wrapper.setProps({ ratio: '16 / 9' })
      await nextTick()

      expect((wrapper.element as HTMLElement).style.aspectRatio).toBe('16 / 9')
    })

    it('should not reserve a ratio for an invalid ratio string', () => {
      const wrapper = mount(AspectRatio, {
        attachTo: document.body,
        props: { ratio: 'not-a-ratio' },
        slots: { default: () => h('span') },
      })

      // Chromium rejects the invalid declaration, so no ratio is reserved,
      // but mounting must not throw.
      expect(getComputedStyle(wrapper.element).aspectRatio).toBe('auto')

      wrapper.unmount()
    })
  })

  describe('slot props', () => {
    it('should expose the resolved ratio and bindable attrs', () => {
      let captured: any
      mount(AspectRatio, {
        props: { ratio: '16 / 9' },
        slots: {
          default: (props: any) => {
            captured = props
            return h('span')
          },
        },
      })

      expect(captured.ratio).toBe('16 / 9')
      expect(captured.attrs.style.aspectRatio).toBe('16 / 9')
    })

    it('should coerce a numeric ratio to a string in slot props', () => {
      let captured: any
      mount(AspectRatio, {
        props: { ratio: 2 },
        slots: {
          default: (props: any) => {
            captured = props
            return h('span')
          },
        },
      })

      expect(captured.ratio).toBe('2')
    })
  })

  describe('fallthrough', () => {
    it('should propagate class to the root element', () => {
      const wrapper = mount(AspectRatio, {
        attrs: { class: 'custom-class' },
        slots: { default: () => h('span') },
      })

      expect(wrapper.classes()).toContain('custom-class')
    })
  })

  // eslint-disable-next-line vitest/prefer-lowercase-title
  describe('SSR', () => {
    it('should render to string without errors', async () => {
      const app = createSSRApp(defineComponent({
        render: () => h(AspectRatio, { ratio: '16 / 9' }, () => h('span', 'Content')),
      }))

      const html = await renderToString(app)
      expect(html).toBeTruthy()
      expect(html).toContain('aspect-ratio')
      expect(html).toContain('Content')
    })
  })
})
