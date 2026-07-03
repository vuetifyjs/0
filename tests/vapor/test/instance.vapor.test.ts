import { afterEach, describe, expect, it } from 'vitest'

import { mountVapor } from './mount'

// Types
import type { VaporMount } from './mount'

import InstanceProbe from '../src/InstanceProbe.vue'

// The payoff test. instance.test.ts proves the shim's branch logic with a
// mocked `currentInstance`; this proves it against a REAL Vapor render where
// getCurrentInstance() genuinely returns null but the component is live.
describe('v0 instance shim under real Vapor', () => {
  let wrapper: VaporMount

  afterEach(() => {
    wrapper?.unmount()
  })

  function probe () {
    wrapper = mountVapor(InstanceProbe)
    return wrapper.host.firstElementChild as HTMLElement
  }

  it('should confirm we are genuinely in Vapor mode (getCurrentInstance is null)', () => {
    expect(probe().dataset.rawNull).toBe('true')
  })

  it('should detect the active instance via the currentInstance shim', () => {
    // This is the assertion the mock can only fake: under a live Vapor
    // component, instanceExists() must return true.
    expect(probe().dataset.shimDetects).toBe('true')
  })

  it('should resolve a usable id through useId() without throwing', () => {
    const el = probe()
    expect(el.dataset.idError).toBe('')
    expect(el.dataset.id).toBeTruthy()
  })
})
