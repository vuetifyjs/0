import { afterEach, describe, expect, it } from 'vitest'

import { mountVapor } from './mount'

// Types
import type { VaporMount } from './mount'

import ContextProvider from '../src/ContextProvider.vue'

// createContext is the provide/inject substrate beneath every v0 compound
// component. This proves it carries a value from a Vapor ancestor to a Vapor
// descendant — i.e. the compound-component pattern holds in a pure Vapor tree.
describe('v0 createContext under real Vapor', () => {
  let wrapper: VaporMount

  afterEach(() => {
    wrapper?.unmount()
  })

  it('should inject a value provided by a Vapor ancestor', () => {
    wrapper = mountVapor(ContextProvider)

    expect(wrapper.host.querySelector('[data-greeting]')?.textContent).toBe('hello-vapor')
  })
})
