import { afterEach, describe, expect, it } from 'vitest'

import { mountVapor } from './mount'

// Types
import type { VaporMount } from './mount'
import type { Component } from 'vue'

import ClassicSingle from '../src/to-element/ClassicSingle.vue'
import ToElementHost from '../src/to-element/ToElementHost.vue'
import VaporExposed from '../src/to-element/VaporExposed.vue'
import VaporHidden from '../src/to-element/VaporHidden.vue'
import VaporMulti from '../src/to-element/VaporMulti.vue'
import VaporNested from '../src/to-element/VaporNested'
import VaporSingle from '../src/to-element/VaporSingle.vue'
import VaporText from '../src/to-element/VaporText.vue'

// A template ref to a Vapor component is the raw VaporComponentInstance: it has
// no `$el`, and its DOM lives in `.block`. Every toElement consumer (popover
// anchors, click-outside, focus trap, observers) depends on resolving it.
describe('toElement under vapor', () => {
  let wrapper: VaporMount

  afterEach(() => {
    wrapper?.unmount()
  })

  function resolve (is: Component, interop = false) {
    let el: Element | undefined
    let raw: unknown
    wrapper = mountVapor(ToElementHost, {
      interop,
      props: {
        is: () => is,
        onResolve: () => (value: Element | undefined, target: unknown) => {
          el = value
          raw = target
        },
      },
    })
    return { el, raw }
  }

  it('should receive a raw Vapor instance from the template ref', () => {
    const { raw } = resolve(VaporSingle)

    expect(raw).toMatchObject({ vapor: true })
    expect(raw).not.toHaveProperty('$el')
  })

  it('should resolve a single-root Vapor component to its root element', () => {
    const { el } = resolve(VaporSingle)

    expect(el).toBe(wrapper.host.querySelector('[data-target]'))
  })

  it('should resolve a multi-root Vapor component to its first element', () => {
    const { el } = resolve(VaporMulti)

    expect(el?.tagName).toBe('HEADER')
  })

  it('should skip leading text to reach the first element', () => {
    const { el } = resolve(VaporText)

    expect(el?.tagName).toBe('SPAN')
  })

  it('should descend into a nested Vapor component root', () => {
    const { el } = resolve(VaporNested)

    expect(el?.tagName).toBe('HEADER')
  })

  it('should return undefined when the root renders no element', () => {
    const { el, raw } = resolve(VaporHidden)

    expect(raw).toMatchObject({ vapor: true })
    expect(el).toBeUndefined()
  })

  // Known limit: once a Vapor component calls expose() (defineExpose, or the
  // implicit __expose() of a <script setup> compiled for the dev server), its
  // template ref is a proxy over the exposed object with no path back to the
  // instance or its block. Nothing structural is left to resolve.
  it('should return undefined for an exposed Vapor component', () => {
    const { el, raw } = resolve(VaporExposed)

    expect(raw).not.toHaveProperty('vapor')
    expect(el).toBeUndefined()
  })

  it('should still resolve a classic component inside a Vapor app', () => {
    const { el } = resolve(ClassicSingle, true)

    expect(el?.tagName).toBe('ARTICLE')
  })
})
