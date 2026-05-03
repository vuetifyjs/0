import { describe, expect, it } from 'vitest'
import { renderToString } from 'vue/server-renderer'

import { AspectRatio } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h } from 'vue'

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

    it('should support renderless mode', () => {
      const wrapper = mount(AspectRatio, {
        props: { renderless: true },
        slots: { default: () => h('figure', { class: 'custom' }, 'Content') },
      })

      expect(wrapper.find('.custom').exists()).toBe(true)
    })
  })

  describe('ratio', () => {
    it('should default to 1 (square)', () => {
      const wrapper = mount(AspectRatio, {
        slots: { default: () => h('span') },
      })

      expect((wrapper.element as HTMLElement).style.aspectRatio).toBe('1 / 1')
    })

    it('should accept a numeric ratio', () => {
      const wrapper = mount(AspectRatio, {
        props: { ratio: 16 / 9 },
        slots: { default: () => h('span') },
      })

      expect((wrapper.element as HTMLElement).style.aspectRatio).toContain('1.77')
    })

    it('should accept a string ratio', () => {
      const wrapper = mount(AspectRatio, {
        props: { ratio: '4 / 3' },
        slots: { default: () => h('span') },
      })

      expect((wrapper.element as HTMLElement).style.aspectRatio).toBe('4 / 3')
    })

    it('should update when ratio changes', async () => {
      const wrapper = mount(AspectRatio, {
        props: { ratio: '1 / 1' },
        slots: { default: () => h('span') },
      })

      expect((wrapper.element as HTMLElement).style.aspectRatio).toBe('1 / 1')

      await wrapper.setProps({ ratio: '16 / 9' })

      expect((wrapper.element as HTMLElement).style.aspectRatio).toBe('16 / 9')
    })
  })

  describe('slot props', () => {
    it('should expose resolved ratio and attrs', () => {
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

  describe('sSR', () => {
    it('should render to string without errors', async () => {
      const app = createSSRApp(defineComponent({
        render: () => h(AspectRatio, { ratio: '16 / 9' }, () => h('span', 'Content')),
      }))

      const html = await renderToString(app)
      expect(html).toBeTruthy()
      expect(html).toContain('aspect-ratio')
    })
  })
})
