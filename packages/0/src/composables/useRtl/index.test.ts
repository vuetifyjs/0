import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: true,
}))

// Utilities
import { effectScope, hasInjectionContext, inject, nextTick, provide, shallowRef } from 'vue'

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    provide: vi.fn(),
    inject: vi.fn(),
    hasInjectionContext: vi.fn(),
  }
})

const mockHasInjectionContext = vi.mocked(hasInjectionContext)

// Adapters
import { Vuetify0RtlAdapter } from './adapters/v0'

describe('vuetify0RtlAdapter', () => {
  it('should set dir attribute on target element', () => {
    const scope = effectScope()
    scope.run(() => {
      const adapter = new Vuetify0RtlAdapter()
      const el = document.createElement('div')
      const isRtl = shallowRef(false)
      const context = { isRtl, toggle: () => {
        isRtl.value = !isRtl.value
      } }

      adapter.setup({} as any, context, el)

      expect(el.dir).toBe('ltr')
    })
    scope.stop()
  })
})
