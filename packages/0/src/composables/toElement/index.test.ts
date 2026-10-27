import { describe, expect, it } from 'vitest'

import { toElement } from './index'

// Utilities
import { createApp, defineComponent, h, shallowRef } from 'vue'

// Types
import type { MaybeElementRef } from './index'

describe('toElement', () => {
  describe('raw elements', () => {
    it('should return an HTMLElement as-is', () => {
      const el = document.createElement('div')

      expect(toElement(el)).toBe(el)
    })

    it('should return an SVGElement as-is', () => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')

      expect(toElement(svg)).toBe(svg)
    })

    // Regression: elements that own a `value` property (HTMLLIElement,
    // HTMLButtonElement, HTMLInputElement, HTMLSelectElement, HTMLOptionElement,
    // …) used to be misread as a ref-like { value: T } and have their
    // attribute value extracted, then short-circuit to undefined.
    it('should return an HTMLLIElement as-is', () => {
      const li = document.createElement('li')

      expect(toElement(li)).toBe(li)
    })

    it('should return an HTMLButtonElement as-is', () => {
      const button = document.createElement('button')

      expect(toElement(button)).toBe(button)
    })

    it('should return an HTMLInputElement as-is', () => {
      const input = document.createElement('input')
      input.value = 'typed text'

      expect(toElement(input)).toBe(input)
    })
  })

  describe('ref-like objects', () => {
    it('should unwrap { value: Element }', () => {
      const el = document.createElement('div')
      const ref = { value: el }

      expect(toElement(ref)).toBe(el)
    })

    it('should return undefined for { value: null }', () => {
      const ref = { value: null }

      expect(toElement(ref)).toBeUndefined()
    })

    it('should return undefined for { value: undefined }', () => {
      const ref = { value: undefined }

      expect(toElement(ref as MaybeElementRef)).toBeUndefined()
    })
  })

  describe('getter functions', () => {
    it('should call getter and return element', () => {
      const el = document.createElement('span')

      expect(toElement(() => el)).toBe(el)
    })

    it('should return undefined when getter returns null', () => {
      expect(toElement(() => null)).toBeUndefined()
    })

    it('should return undefined when getter returns undefined', () => {
      expect(toElement((() => undefined) as () => undefined)).toBeUndefined()
    })
  })

  describe('component instances', () => {
    it('should extract $el from component instance', () => {
      const el = document.createElement('div')
      const component = { $el: el } as any

      expect(toElement({ value: component })).toBe(el)
    })

    it('should return undefined when $el is undefined', () => {
      const component = { $el: undefined } as any

      expect(toElement({ value: component })).toBeUndefined()
    })
  })

  describe('mounted component roots', () => {
    function mount (root: ReturnType<typeof defineComponent>) {
      const host = document.createElement('div')
      const target = shallowRef<any>()
      const app = createApp({ render: () => [h(root, { ref: target }), h('aside')] })
      app.mount(host)
      return { host, target, app }
    }

    it('should resolve a single-element root to $el', () => {
      const Single = defineComponent({ render: () => h('div', { id: 'single' }) })
      const { host, target, app } = mount(Single)

      expect(toElement(target)).toBe(host.querySelector('#single'))
      app.unmount()
    })

    it('should resolve a fragment root to its first element', () => {
      const Multi = defineComponent({ render: () => [h('span', { id: 'first' }), h('span')] })
      const { host, target, app } = mount(Multi)

      expect(target.value.$el).not.toBeInstanceOf(Element)
      expect(toElement(target)).toBe(host.querySelector('#first'))
      app.unmount()
    })

    it('should skip leading text and comment nodes in a fragment root', () => {
      const Leading = defineComponent({ render: () => ['text', null, h('span', { id: 'first' })] })
      const { host, target, app } = mount(Leading)

      expect(toElement(target)).toBe(host.querySelector('#first'))
      app.unmount()
    })

    it('should resolve through a nested component with a fragment root', () => {
      const Multi = defineComponent({ render: () => ['text', h('span', { id: 'first' })] })
      const Wrapper = defineComponent({ render: () => h(Multi) })
      const { host, target, app } = mount(Wrapper)

      expect(toElement(target)).toBe(host.querySelector('#first'))
      app.unmount()
    })

    it('should not escape an element-less fragment into a sibling', () => {
      const Empty = defineComponent({ render: () => ['text', null] })
      const { target, app } = mount(Empty)

      expect(toElement(target)).toBeUndefined()
      app.unmount()
    })

    it('should return undefined for a comment root (v-if false)', () => {
      const Hidden = defineComponent({ render: () => null })
      const { target, app } = mount(Hidden)

      expect(target.value.$el).toBeInstanceOf(Comment)
      expect(toElement(target)).toBeUndefined()
      app.unmount()
    })

    it('should return undefined for a text root', () => {
      const Text = defineComponent({ render: () => 'text' })
      const { target, app } = mount(Text)

      expect(toElement(target)).toBeUndefined()
      app.unmount()
    })
  })

  describe('non-element objects', () => {
    it('should return undefined for plain object without $el', () => {
      const obj = { someProperty: 'value' } as unknown as MaybeElementRef
      expect(toElement(obj)).toBeUndefined()
    })
  })

  describe('null and undefined', () => {
    it('should return undefined for null', () => {
      expect(toElement(null)).toBeUndefined()
    })

    it('should return undefined for undefined', () => {
      expect(toElement(undefined)).toBeUndefined()
    })
  })

  describe('non-element ref-like objects without $el', () => {
    it('should return undefined for ref-like object with non-element, non-$el value', () => {
      // Covers line 68: raw is truthy, not instanceof Element, and no '$el' property
      const obj = { value: { someProperty: 'value' } } as unknown as MaybeElementRef
      expect(toElement(obj)).toBeUndefined()
    })
  })
})
