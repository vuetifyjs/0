import { afterEach, describe, expect, it } from 'vitest'

import { mountVapor } from './mount'

// Utilities
import { nextTick } from 'vue'

// Types
import type { VaporMount } from './mount'

import Counter from '../src/Counter.vue'

// Smoke test: proves the beta toolchain (vue@3.6 + @vue/runtime-vapor +
// @vitejs/plugin-vue) can compile a <script setup vapor> SFC, mount it, and
// observe reactive DOM updates. Nothing v0-specific here — if this fails, the
// harness is broken, not v0.
describe('smoke', () => {
  let wrapper: VaporMount

  afterEach(() => {
    wrapper?.unmount()
  })

  it('should compile and mount a vapor SFC', () => {
    wrapper = mountVapor(Counter)

    const button = wrapper.host.querySelector('button')
    expect(button).not.toBeNull()
    expect(button!.textContent).toContain('Count: 0')
  })

  it('should update the DOM on reactive change', async () => {
    wrapper = mountVapor(Counter)

    const button = wrapper.host.querySelector('button')!
    button.click()
    await nextTick()

    expect(button.textContent).toContain('Count: 1')
  })
})
