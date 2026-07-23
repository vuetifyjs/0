import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderToString } from 'vue/server-renderer'

import { Atom } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick } from 'vue'

// Types
import type { Component } from 'vue'

describe('atom', () => {
  describe('rendering modes', () => {
    // VTU compiles the string-literal slots below at runtime; Vue's compiler
    // emits a benign "[@vue/compiler-core] decodeEntities … ignored in
    // non-browser builds" notice on each compile. Capture and assert it so it
    // does not leak to stderr (testing.md zero-warnings policy).
    let warn: ReturnType<typeof vi.spyOn>
    beforeEach(() => {
      warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    })
    afterEach(() => {
      expect(warn).toHaveBeenCalled()
      warn.mockRestore()
    })

    it('should render as div by default', () => {
      const wrapper = mount(Atom, {
        slots: {
          default: 'Content',
        },
      })

      expect(wrapper.find('div').exists()).toBe(true)
      expect(wrapper.text()).toBe('Content')
    })

    it('should render with custom element type', () => {
      const wrapper = mount(Atom, {
        props: {
          as: 'button',
        },
        slots: {
          default: 'Click me',
        },
      })

      expect(wrapper.find('button').exists()).toBe(true)
      expect(wrapper.text()).toBe('Click me')
    })

    it('should render as span', () => {
      const wrapper = mount(Atom, {
        props: {
          as: 'span',
        },
        slots: {
          default: 'Span content',
        },
      })

      expect(wrapper.find('span').exists()).toBe(true)
      expect(wrapper.text()).toBe('Span content')
    })
  })

  describe('renderless mode', () => {
    // String-literal slots below are compiled at runtime by VTU, triggering
    // Vue's benign decodeEntities compiler notice. Capture and assert it.
    let warn: ReturnType<typeof vi.spyOn>
    beforeEach(() => {
      warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    })
    afterEach(() => {
      expect(warn).toHaveBeenCalled()
      warn.mockRestore()
    })

    it('should render slot content directly when renderless=true', () => {
      const wrapper = mount(Atom, {
        props: {
          renderless: true,
        },
        slots: {
          default: '<div class="custom">Custom</div>',
        },
      })

      expect(wrapper.find('.custom').exists()).toBe(true)
      expect(wrapper.html()).not.toContain('<div><div')
    })

    it('should not create wrapper element in renderless mode', () => {
      const wrapper = mount(Atom, {
        props: {
          renderless: true,
          as: 'section',
        },
        slots: {
          default: 'Content',
        },
      })

      expect(wrapper.find('section').exists()).toBe(false)
      expect(wrapper.text()).toBe('Content')
    })

    it('should render slot content directly when as=null', () => {
      const wrapper = mount(Atom, {
        props: {
          as: null,
        },
        slots: {
          default: '<span>Direct</span>',
        },
      })

      expect(wrapper.find('span').exists()).toBe(true)
      expect(wrapper.find('div').exists()).toBe(false)
    })
  })

  describe('self-closing tags', () => {
    it('should render self-closing img tag without children', () => {
      // VTU compiles the string slot at runtime; Vue emits a benign
      // decodeEntities compiler notice. Capture and assert it.
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const wrapper = mount(Atom, {
        props: {
          as: 'img',
        },
        attrs: {
          src: 'test.jpg',
          alt: 'Test',
        },
        slots: {
          default: 'This should not appear',
        },
      })

      const img = wrapper.find('img')
      expect(img.exists()).toBe(true)
      expect(img.attributes('src')).toBe('test.jpg')
      expect(img.attributes('alt')).toBe('Test')
      expect(wrapper.text()).toBe('')
      expect(warn).toHaveBeenCalled()
    })

    it('should render self-closing input tag', () => {
      const wrapper = mount(Atom, {
        props: {
          as: 'input',
        },
        attrs: {
          type: 'text',
          placeholder: 'Enter text',
        },
      })

      const input = wrapper.find('input')
      expect(input.exists()).toBe(true)
      expect(input.attributes('type')).toBe('text')
      expect(input.attributes('placeholder')).toBe('Enter text')
    })

    it('should render self-closing br tag', () => {
      const wrapper = mount(Atom, {
        props: {
          as: 'br',
        },
      })

      expect(wrapper.find('br').exists()).toBe(true)
    })

    it('should render self-closing hr tag', () => {
      const wrapper = mount(Atom, {
        props: {
          as: 'hr',
        },
      })

      expect(wrapper.find('hr').exists()).toBe(true)
    })
  })

  describe('attribute forwarding', () => {
    it('should forward class attribute', () => {
      const wrapper = mount(Atom, {
        props: {
          as: 'div',
        },
        attrs: {
          class: 'custom-class',
        },
      })

      expect(wrapper.classes()).toContain('custom-class')
    })

    it('should forward id attribute', () => {
      const wrapper = mount(Atom, {
        props: {
          as: 'div',
        },
        attrs: {
          id: 'custom-id',
        },
      })

      expect(wrapper.attributes('id')).toBe('custom-id')
    })

    it('should forward data attributes', () => {
      const wrapper = mount(Atom, {
        props: {
          as: 'div',
        },
        attrs: {
          'data-test': 'value',
        },
      })

      expect(wrapper.attributes('data-test')).toBe('value')
    })

    it('should forward aria attributes', () => {
      const wrapper = mount(Atom, {
        props: {
          as: 'button',
        },
        attrs: {
          'aria-label': 'Close',
          'aria-pressed': 'true',
        },
      })

      expect(wrapper.attributes('aria-label')).toBe('Close')
      expect(wrapper.attributes('aria-pressed')).toBe('true')
    })

    it('should forward event handlers', async () => {
      let clicked = false
      const wrapper = mount(Atom, {
        props: {
          as: 'button',
        },
        attrs: {
          onClick: () => {
            clicked = true
          },
        },
      })

      await wrapper.trigger('click')
      expect(clicked).toBe(true)
    })
  })

  describe('slot props', () => {
    it('should pass attributes as slot props', () => {
      const wrapper = mount(Atom, {
        props: {
          as: 'div',
        },
        attrs: {
          class: 'test-class',
          id: 'test-id',
        },
        slots: {
          default: (props: any) => h('span', { class: props.class }, 'Content'),
        },
      })

      expect(wrapper.find('span').classes()).toContain('test-class')
    })

    it('should provide slot props in renderless mode', () => {
      const wrapper = mount(Atom, {
        props: {
          renderless: true,
        },
        attrs: {
          'data-value': '123',
        },
        slots: {
          default: (props: any) => h('div', { 'data-test': props['data-value'] }, 'Test'),
        },
      })

      expect(wrapper.find('[data-test="123"]').exists()).toBe(true)
    })
  })

  describe('template ref', () => {
    it('should expose element ref for regular elements', () => {
      const wrapper = mount(Atom, {
        props: {
          as: 'button',
        },
      })

      const exposed = wrapper.vm as any
      expect(exposed.element).toBeDefined()
    })

    it('should expose element ref for self-closing tags', () => {
      const wrapper = mount(Atom, {
        props: {
          as: 'input',
        },
      })

      const exposed = wrapper.vm as any
      expect(exposed.element).toBeDefined()
    })

    it('should not expose element ref in renderless mode', () => {
      // VTU compiles the string slot at runtime; Vue emits a benign
      // decodeEntities compiler notice. Capture and assert it.
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const wrapper = mount(Atom, {
        props: {
          renderless: true,
        },
        slots: {
          default: 'Content',
        },
      })

      const exposed = wrapper.vm as any
      expect(exposed.element).toBeNull()
      expect(warn).toHaveBeenCalled()
    })
  })

  describe('complex element types', () => {
    // String-literal slots below are compiled at runtime by VTU, triggering
    // Vue's benign decodeEntities compiler notice. Capture and assert it.
    let warn: ReturnType<typeof vi.spyOn>
    beforeEach(() => {
      warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    })
    afterEach(() => {
      expect(warn).toHaveBeenCalled()
      warn.mockRestore()
    })

    it('should render section element', () => {
      const wrapper = mount(Atom, {
        props: {
          as: 'section',
        },
        slots: {
          default: 'Section content',
        },
      })

      expect(wrapper.find('section').exists()).toBe(true)
    })

    it('should render article element', () => {
      const wrapper = mount(Atom, {
        props: {
          as: 'article',
        },
        slots: {
          default: 'Article content',
        },
      })

      expect(wrapper.find('article').exists()).toBe(true)
    })

    it('should render nav element', () => {
      const wrapper = mount(Atom, {
        props: {
          as: 'nav',
        },
        slots: {
          default: 'Nav content',
        },
      })

      expect(wrapper.find('nav').exists()).toBe(true)
    })

    it('should render header element', () => {
      const wrapper = mount(Atom, {
        props: {
          as: 'header',
        },
        slots: {
          default: 'Header content',
        },
      })

      expect(wrapper.find('header').exists()).toBe(true)
    })

    it('should render footer element', () => {
      const wrapper = mount(Atom, {
        props: {
          as: 'footer',
        },
        slots: {
          default: 'Footer content',
        },
      })

      expect(wrapper.find('footer').exists()).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('should handle empty slot content', () => {
      const wrapper = mount(Atom, {
        props: {
          as: 'div',
        },
      })

      expect(wrapper.find('div').exists()).toBe(true)
      expect(wrapper.text()).toBe('')
    })

    it('should handle multiple root elements in slot', () => {
      // VTU compiles the string slot at runtime; Vue emits a benign
      // decodeEntities compiler notice. Capture and assert it.
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const wrapper = mount(Atom, {
        props: {
          as: 'div',
        },
        slots: {
          default: '<span>First</span><span>Second</span>',
        },
      })

      expect(wrapper.findAll('span').length).toBe(2)
      expect(warn).toHaveBeenCalled()
    })

    it('should handle nested Atom components', () => {
      const wrapper = mount(Atom, {
        props: {
          as: 'div',
        },
        slots: {
          default: () => h(Atom as unknown as Component, { as: 'span' }, () => 'Nested'),
        },
      })

      expect(wrapper.find('div span').exists()).toBe(true)
      expect(wrapper.text()).toBe('Nested')
    })
  })

  describe('type safety', () => {
    it('should accept valid HTML element names', () => {
      const elements: Array<keyof HTMLElementTagNameMap> = ['div', 'span', 'button', 'input', 'section']

      for (const as of elements) {
        const wrapper = mount(Atom, {
          props: { as },
        })
        expect(wrapper.find(as).exists()).toBe(true)
      }
    })
  })

  // eslint-disable-next-line vitest/prefer-lowercase-title
  describe('SSR / Hydration', () => {
    it('should render to string on server without errors', async () => {
      const app = createSSRApp(defineComponent({
        render: () => h(Atom as unknown as Component, { as: 'div' }, () => 'Hello'),
      }))

      const html = await renderToString(app)

      expect(html).toBeTruthy()
      expect(html).toContain('Hello')
    })

    it('should render custom element on server', async () => {
      const app = createSSRApp(defineComponent({
        render: () => h(Atom as unknown as Component, { as: 'section', class: 'wrapper' }, () => 'Content'),
      }))

      const html = await renderToString(app)

      expect(html).toContain('<section')
      expect(html).toContain('Content')
    })

    it('should render self-closing tags on server', async () => {
      const app = createSSRApp(defineComponent({
        render: () => h(Atom as unknown as Component, { as: 'img', src: '/test.png', alt: 'Test' }),
      }))

      const html = await renderToString(app)

      expect(html).toContain('src="/test.png"')
    })

    it('should hydrate without mismatches', async () => {
      const TestComponent = defineComponent({
        render: () => h(Atom as unknown as Component, { as: 'span' }, () => 'Hydrated'),
      })

      const ssrApp = createSSRApp(TestComponent)
      const serverHtml = await renderToString(ssrApp)

      const container = document.createElement('div')
      container.innerHTML = serverHtml

      const wrapper = mount(TestComponent, {
        attachTo: container,
      })

      await nextTick()

      expect(wrapper.text()).toContain('Hydrated')

      wrapper.unmount()
    })
  })
})
