import { afterEach, describe, expect, it } from 'vitest'

// Context
// Fixtures
import AtomProbe from './AtomProbe.vue'
import MixedProvider from './MixedProvider.vue'

// Utilities
import { nextTick } from 'vue'

// Types
import type { VaporMount } from '../test/mount'

import { mountVapor } from '../test/mount'

// Spike: the REAL packages/0 Atom.vue force-compiled in Vapor mode via
// plugin-vue `features.vapor` (see vitest.spike.config.ts). Proves the
// vapor-native Atom contract before any build infrastructure exists.
describe('vapor-compiled Atom (spike)', () => {
  let wrapper: VaporMount

  afterEach(() => {
    wrapper?.unmount()
  })

  it('should compile and mount the generic Atom SFC under a vapor root', () => {
    wrapper = mountVapor(AtomProbe)

    expect(wrapper.host.querySelector('[data-probe]')).not.toBeNull()
    expect(wrapper.host.querySelector('button[data-atom="host"]')).not.toBeNull()
  })

  it('should forward attrs onto the rendered element and into slotProps', () => {
    wrapper = mountVapor(AtomProbe)

    const host = wrapper.host.querySelector('button[data-atom="host"]')!
    expect(host.classList.contains('alpha')).toBe(true)

    const keys = wrapper.host.querySelector('[data-slot-keys]')!.textContent!
    expect(keys).toContain('data-atom')
    expect(keys).toContain('class')
  })

  it('should update the element reactively through useAttrs', async () => {
    wrapper = mountVapor(AtomProbe)

    const swap = wrapper.host.querySelector('[data-swap]') as HTMLButtonElement
    swap.click()
    await nextTick()

    const host = wrapper.host.querySelector('button[data-atom="host"]')!
    expect(host.classList.contains('beta')).toBe(true)
    expect(host.classList.contains('alpha')).toBe(false)
  })

  it('should expose the element via defineExpose to a vapor parent', async () => {
    wrapper = mountVapor(AtomProbe)
    await nextTick()

    const probe = wrapper.host.querySelector('[data-probe]')!
    expect(probe.dataset.exposeTag).toBe('BUTTON')
  })

  it('should report the expose unwrapping shape', async () => {
    wrapper = mountVapor(AtomProbe)
    await nextTick()

    const probe = wrapper.host.querySelector('[data-probe]')!
    // vdom defineExpose auto-unwraps refs; record whether vapor matches
    console.log(`expose auto-unwrapped like vdom: ${probe.dataset.exposeUnwrapped}`)
    expect(['true', 'false']).toContain(probe.dataset.exposeUnwrapped)
  })

  it('should render slot content directly in renderless mode with attrs as slotProps', () => {
    wrapper = mountVapor(AtomProbe)

    const renderless = wrapper.host.querySelector('[data-renderless]')!
    expect(renderless.dataset.forwarded).toBe('yes')
  })

  it('should render self-closing tags without children', () => {
    wrapper = mountVapor(AtomProbe)

    const img = wrapper.host.querySelector('img[data-img]')!
    expect(img).not.toBeNull()
    expect(img.childNodes.length).toBe(0)
  })

  it('should share v0 context from a vapor provider into a classic consumer', () => {
    wrapper = mountVapor(MixedProvider, { interop: true })

    expect(wrapper.host.querySelector('output[data-vapor-atom]')).not.toBeNull()
    expect(wrapper.host.querySelector('section[data-classic-host]')).not.toBeNull()
    expect(wrapper.host.querySelector('[data-mixed-greeting]')?.textContent).toBe('hello-mixed')
  })
})
