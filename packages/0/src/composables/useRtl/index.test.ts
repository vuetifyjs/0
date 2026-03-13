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

import { createRtl, createRtlContext, createRtlFallback, createRtlPlugin, useRtl } from './index'

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

describe('useRtl', () => {
  describe('createRtl', () => {
    it('should create rtl instance with default options', () => {
      const rtl = createRtl()

      expect(rtl).toBeDefined()
      expect(rtl.isRtl.value).toBe(false)
      expect(typeof rtl.toggle).toBe('function')
    })

    it('should respect default option', () => {
      const rtl = createRtl({ default: true })

      expect(rtl.isRtl.value).toBe(true)
    })

    it('should toggle isRtl', () => {
      const rtl = createRtl()

      expect(rtl.isRtl.value).toBe(false)
      rtl.toggle()
      expect(rtl.isRtl.value).toBe(true)
      rtl.toggle()
      expect(rtl.isRtl.value).toBe(false)
    })

    it('should allow direct assignment', () => {
      const rtl = createRtl()

      rtl.isRtl.value = true
      expect(rtl.isRtl.value).toBe(true)
    })
  })
})
