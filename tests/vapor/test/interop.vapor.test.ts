import { afterEach, describe, expect, it } from 'vitest'

import { mountVapor } from './mount'

// Types
import type { VaporMount } from './mount'

import InteropAtom from '../src/InteropAtom.vue'

// v0 components are authored as classic (vdom) SFCs. This proves one renders
// inside a Vapor root through vaporInteropPlugin — the path a real app on a
// Vapor root would hit when consuming v0's component layer.
describe('v0 classic component under a Vapor root (interop)', () => {
  let wrapper: VaporMount

  afterEach(() => {
    wrapper?.unmount()
  })

  it('should render the polymorphic Atom element', () => {
    wrapper = mountVapor(InteropAtom, { interop: true })

    const section = wrapper.host.querySelector('section[data-interop="host"]')
    expect(section).not.toBeNull()
  })

  it('should render slotted content forwarded from the Vapor parent', () => {
    wrapper = mountVapor(InteropAtom, { interop: true })

    expect(wrapper.host.querySelector('[data-child]')?.textContent).toBe('child')
  })
})
