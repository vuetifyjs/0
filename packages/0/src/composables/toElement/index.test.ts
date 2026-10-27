import { describe, expect, it } from 'vitest'

import { toElement } from './index'

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

  // Vue 3.6 Vapor: a template ref to a Vapor component is the raw instance,
  // with no $el and its DOM in `block`. These fakes mirror the runtime shapes
  // (VaporComponentInstance.block, VaporFragment.nodes); tests/vapor covers
  // real renders.
  describe('vapor component instances', () => {
    function vapor (block: unknown) {
      return { vapor: true, uid: 0, block } as unknown as MaybeElementRef
    }

    function fragment (nodes: unknown) {
      return { __vf: 1, nodes }
    }

    it('should resolve a single-root block', () => {
      const el = document.createElement('section')

      expect(toElement(vapor(el))).toBe(el)
    })

    it('should resolve the first element of a multi-root block', () => {
      const first = document.createElement('header')
      const second = document.createElement('footer')

      expect(toElement(vapor([first, second]))).toBe(first)
    })

    it('should skip text and comment nodes', () => {
      const el = document.createElement('span')
      const block = [document.createTextNode('text'), document.createComment('anchor'), el]

      expect(toElement(vapor(block))).toBe(el)
    })

    it('should descend into fragments in document order', () => {
      const el = document.createElement('p')
      const later = document.createElement('div')
      const block = [fragment([document.createTextNode(''), fragment(el)]), later]

      expect(toElement(vapor(block))).toBe(el)
    })

    it('should descend into a nested vapor instance', () => {
      const el = document.createElement('nav')

      expect(toElement(vapor(vapor(fragment([el]))))).toBe(el)
    })

    it('should resolve through a ref-like wrapper', () => {
      const el = document.createElement('div')

      expect(toElement({ value: vapor(el) } as unknown as MaybeElementRef)).toBe(el)
    })

    it('should return undefined when the block has no element', () => {
      expect(toElement(vapor(fragment([document.createComment('v-if')])))).toBeUndefined()
      expect(toElement(vapor([]))).toBeUndefined()
      expect(toElement(vapor(null))).toBeUndefined()
    })

    it('should ignore objects that only look partly like an instance', () => {
      const el = document.createElement('div')

      expect(toElement({ vapor: 'yes', block: el } as unknown as MaybeElementRef)).toBeUndefined()
      expect(toElement({ block: el } as unknown as MaybeElementRef)).toBeUndefined()
    })
  })
})
