import { afterEach, describe, expect, it } from 'vitest'

import { mountVapor } from './mount'

// Utilities
import { nextTick } from 'vue'

// Types
import type { VaporMount } from './mount'

import SelectionProbe from '../src/SelectionProbe.vue'

// Proves a registry-backed v0 composable (createSelection) runs correctly when
// instantiated inside a Vapor component setup, and that its reactive state
// drives Vapor DOM updates.
describe('v0 createSelection under real Vapor', () => {
  let wrapper: VaporMount

  afterEach(() => {
    wrapper?.unmount()
  })

  it('should register tickets and start unselected', () => {
    wrapper = mountVapor(SelectionProbe)

    expect(wrapper.host.querySelector('[data-alpha-selected]')!.textContent).toBe('false')
    expect(wrapper.host.querySelector('[data-selected-count]')!.textContent).toBe('0')
  })

  it('should reactively update Vapor DOM when a ticket is toggled', async () => {
    wrapper = mountVapor(SelectionProbe)

    wrapper.host.querySelector<HTMLButtonElement>('[data-toggle]')!.click()
    await nextTick()

    expect(wrapper.host.querySelector('[data-alpha-selected]')!.textContent).toBe('true')
    expect(wrapper.host.querySelector('[data-selected-count]')!.textContent).toBe('1')
  })
})
