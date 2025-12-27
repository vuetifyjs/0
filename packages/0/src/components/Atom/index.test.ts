import { describe, expect, it } from 'vitest'

// Utilities
import { mount } from '@vue/test-utils'
import { type Component, h } from 'vue'

import { Atom } from './index'

describe('atom', () => {
  describe('rendering modes', () => {
    it('renders as div by default', () => {
      const wrapper = mount(Atom, {
        slots: {
          default: 'Content',
        },
      })

      expect(wrapper.find('div').exists()).toBe(true)
      expect(wrapper.text()).toBe('Content')
    })

    it('renders with custom element type', () => {
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

    it('renders as span', () => {
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
    it('renders slot content directly when renderless=true', () => {
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

    it('does not create wrapper element in renderless mode', () => {
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

    it('renders slot content directly when as=null', () => {
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
    it('renders self-closing img tag without children', () => {
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
    })

    it('renders self-closing input tag', () => {
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

    it('renders self-closing br tag', () => {
      const wrapper = mount(Atom, {
        props: {
          as: 'br',
        },
      })

      expect(wrapper.find('br').exists()).toBe(true)
    })

    it('renders self-closing hr tag', () => {
      const wrapper = mount(Atom, {
        props: {
          as: 'hr',
        },
      })

      expect(wrapper.find('hr').exists()).toBe(true)
    })
  })

  describe('attribute forwarding', () => {
    it('forwards class attribute', () => {
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

    it('forwards id attribute', () => {
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

    it('forwards data attributes', () => {
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

    it('forwards aria attributes', () => {
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

    it('forwards event handlers', async () => {
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
    it('passes attributes as slot props', () => {
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

    it('provides slot props in renderless mode', () => {
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
    it('exposes element ref for regular elements', () => {
      const wrapper = mount(Atom, {
        props: {
          as: 'button',
        },
      })

      const exposed = wrapper.vm as any
      expect(exposed.element).toBeDefined()
    })

    it('exposes element ref for self-closing tags', () => {
      const wrapper = mount(Atom, {
        props: {
          as: 'input',
        },
      })

      const exposed = wrapper.vm as any
      expect(exposed.element).toBeDefined()
    })

    it('does not expose element ref in renderless mode', () => {
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
    })
  })

  describe('complex element types', () => {
    it('renders section element', () => {
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

    it('renders article element', () => {
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

    it('renders nav element', () => {
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

    it('renders header element', () => {
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

    it('renders footer element', () => {
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
    it('handles empty slot content', () => {
      const wrapper = mount(Atom, {
        props: {
          as: 'div',
        },
      })

      expect(wrapper.find('div').exists()).toBe(true)
      expect(wrapper.text()).toBe('')
    })

    it('handles multiple root elements in slot', () => {
      const wrapper = mount(Atom, {
        props: {
          as: 'div',
        },
        slots: {
          default: '<span>First</span><span>Second</span>',
        },
      })

      expect(wrapper.findAll('span').length).toBe(2)
    })

    it('handles nested Atom components', () => {
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
    it('accepts valid HTML element names', () => {
      const elements: Array<keyof HTMLElementTagNameMap> = ['div', 'span', 'button', 'input', 'section']

      for (const as of elements) {
        const wrapper = mount(Atom, {
          props: { as },
        })
        expect(wrapper.find(as).exists()).toBe(true)
      }
    })
  })
})
