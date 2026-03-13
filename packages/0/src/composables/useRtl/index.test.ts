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

  describe('createRtlFallback', () => {
    it('should return default false', () => {
      const fallback = createRtlFallback()
      expect(fallback.isRtl.value).toBe(false)
    })

    it('should have no-op toggle', () => {
      const fallback = createRtlFallback()
      fallback.toggle()
      expect(fallback.isRtl.value).toBe(false)
    })
  })

  describe('createRtlContext', () => {
    it('should return a trinity tuple', () => {
      const trinity = createRtlContext()
      expect(trinity).toHaveLength(3)
      expect(typeof trinity[0]).toBe('function') // use
      expect(typeof trinity[1]).toBe('function') // provide
      expect(trinity[2]).toBeDefined() // default context
    })

    it('should respect default option', () => {
      const [,, context] = createRtlContext({ default: true })
      expect(context.isRtl.value).toBe(true)
    })
  })

  describe('createRtlPlugin', () => {
    it('should return a plugin with install method', () => {
      const plugin = createRtlPlugin()
      expect(typeof plugin.install).toBe('function')
    })
  })

  describe('useRtl (consumer)', () => {
    afterEach(() => {
      vi.clearAllMocks()
    })

    it('should return fallback when no injection context', () => {
      mockHasInjectionContext.mockReturnValue(false)
      const rtl = useRtl()
      expect(rtl.isRtl.value).toBe(false)
    })
  })
})

describe('vuetify0RtlAdapter', () => {
  it('should update dir on isRtl change', async () => {
    const scope = effectScope()
    await scope.run(async () => {
      const adapter = new Vuetify0RtlAdapter()
      const el = document.createElement('div')
      const isRtl = shallowRef(false)
      const context = { isRtl, toggle: () => {
        isRtl.value = !isRtl.value
      } }

      adapter.setup({} as any, context, el)
      expect(el.dir).toBe('ltr')

      isRtl.value = true
      await nextTick()
      expect(el.dir).toBe('rtl')
    })
    scope.stop()
  })

  it('should not set dir when target is null', () => {
    const scope = effectScope()
    scope.run(() => {
      const adapter = new Vuetify0RtlAdapter()
      const isRtl = shallowRef(false)
      const context = { isRtl, toggle: () => {} }

      // Should not throw
      adapter.setup({} as any, context, null)
    })
    scope.stop()
  })
})
