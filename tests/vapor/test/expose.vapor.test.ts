import { afterEach, describe, expect, it } from 'vitest'

import { mountVapor } from './mount'

// Types
import type { VaporMount } from './mount'
import type { Component } from 'vue'

import ExposeChild from '../src/ExposeChild.vue'
import ExposeElChild from '../src/ExposeElChild.vue'
import ExposeHost from '../src/ExposeHost.vue'

// Pins the contract documented in the Vapor guide: a template ref to an
// exposed Vapor component is a proxy over the exposed object with no `$el`,
// so toElement only resolves it when the component exposes `$el` itself.
describe('toElement on exposed vapor component refs', () => {
  let wrapper: VaporMount

  afterEach(() => {
    wrapper?.unmount()
  })

  function resolve (is: Component) {
    let el: Element | undefined
    wrapper = mountVapor(ExposeHost, {
      props: {
        is: () => is,
        onResolve: () => (value: Element | undefined) => {
          el = value
        },
      },
    })
    return el
  }

  it('should resolve undefined when the component exposes no $el', () => {
    expect(resolve(ExposeChild)).toBeUndefined()
  })

  it('should resolve the root element exposed as $el', () => {
    const el = resolve(ExposeElChild)

    expect(el).toBe(wrapper.host.querySelector('section'))
    expect(el?.textContent).toBe('exposed')
  })
})
