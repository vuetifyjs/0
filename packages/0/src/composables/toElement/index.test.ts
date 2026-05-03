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
})
