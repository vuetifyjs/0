import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: true,
}))

// Utilities
import { effectScope, hasInjectionContext, nextTick, shallowRef } from 'vue'

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

      isRtl.value = false
      await nextTick()
      expect(el.dir).toBe('ltr')
    })
    scope.stop()
  })

  it('should resolve string selector as target', () => {
    const scope = effectScope()
    scope.run(() => {
      const adapter = new Vuetify0RtlAdapter()
      const el = document.createElement('div')
      el.id = 'rtl-target'
      document.body.append(el)
      const isRtl = shallowRef(true)
      adapter.setup({} as any, { isRtl, toggle: () => {} }, '#rtl-target')
      expect(el.dir).toBe('rtl')
      el.remove()
    })
    scope.stop()
  })

  it('should use documentElement when target is undefined', () => {
    const scope = effectScope()
    scope.run(() => {
      const adapter = new Vuetify0RtlAdapter()
      const isRtl = shallowRef(false)
      adapter.setup({} as any, { isRtl, toggle: () => {} }, undefined)
      expect(document.documentElement.dir).toBe('ltr')
    })
    scope.stop()
  })

  it('should bail out when string selector does not match', () => {
    const scope = effectScope()
    scope.run(() => {
      const adapter = new Vuetify0RtlAdapter()
      const isRtl = shallowRef(false)
      expect(() => adapter.setup({} as any, { isRtl, toggle: () => {} }, '#nonexistent')).not.toThrow()
    })
    scope.stop()
  })

  it('should not set dir when target is null', () => {
    const scope = effectScope()
    scope.run(() => {
      const adapter = new Vuetify0RtlAdapter()
      const el = document.createElement('div')
      const isRtl = shallowRef(false)
      const context = { isRtl, toggle: () => {} }

      adapter.setup({} as any, context, null)

      expect(el.dir).toBe('')
    })
    scope.stop()
  })
})

describe('vuetify0RtlAdapter SSR', () => {
  it('should use unhead push in SSR mode', async () => {
    vi.resetModules()

    vi.doMock('#v0/constants/globals', () => ({
      IN_BROWSER: false,
    }))

    const { Vuetify0RtlAdapter: SSRAdapter } = await import('./adapters/v0')
    const { shallowRef: ssrShallowRef } = await import('vue')

    const pushFn = vi.fn()
    const mockApp = {
      _context: {
        provides: {
          usehead: { push: pushFn },
        },
      },
    } as any

    const adapter = new SSRAdapter()
    const isRtl = ssrShallowRef(true)
    adapter.setup(mockApp, { isRtl, toggle: () => {} }, undefined)

    expect(pushFn).toHaveBeenCalledWith({
      htmlAttrs: { dir: 'rtl' },
    })
  })

  it('should not throw when no unhead in SSR', async () => {
    vi.resetModules()

    vi.doMock('#v0/constants/globals', () => ({
      IN_BROWSER: false,
    }))

    const { Vuetify0RtlAdapter: SSRAdapter } = await import('./adapters/v0')
    const { shallowRef: ssrShallowRef } = await import('vue')

    const mockApp = {
      _context: { provides: {} },
    } as any

    const adapter = new SSRAdapter()
    const isRtl = ssrShallowRef(false)
    expect(() => adapter.setup(mockApp, { isRtl, toggle: () => {} }, undefined)).not.toThrow()
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

  describe('createRtlPlugin (integration)', () => {
    it('should install and exercise setup callback with default adapter', async () => {
      const { createApp, nextTick: nt } = await import('vue')

      const plugin = createRtlPlugin({ default: true })
      const app = createApp({ template: '<div />' })

      app.use(plugin)

      const container = document.createElement('div')
      app.mount(container)

      await nt()

      expect(document.documentElement.dir).toBe('rtl')

      app.unmount()
      document.documentElement.dir = ''
    })

    it('should install with custom adapter', async () => {
      const { createApp, nextTick: nt } = await import('vue')

      const setupFn = vi.fn()
      const customAdapter = { setup: setupFn }

      const plugin = createRtlPlugin({ adapter: customAdapter as any })
      const app = createApp({ template: '<div />' })

      app.use(plugin)

      const container = document.createElement('div')
      app.mount(container)

      await nt()

      expect(setupFn).toHaveBeenCalledTimes(1)

      app.unmount()
    })

    it('should install with a target element', async () => {
      const { createApp, nextTick: nt } = await import('vue')

      const el = document.createElement('div')
      el.id = 'rtl-plugin-target'
      document.body.append(el)

      const plugin = createRtlPlugin({ default: true, target: el })
      const app = createApp({ template: '<div />' })

      app.use(plugin)

      const container = document.createElement('div')
      app.mount(container)

      await nt()

      expect(el.dir).toBe('rtl')

      app.unmount()
      el.remove()
    })

    it('should not install twice on the same app', async () => {
      const { createApp, nextTick: nt } = await import('vue')

      const setupFn = vi.fn()
      const customAdapter = { setup: setupFn }

      const plugin = createRtlPlugin({ adapter: customAdapter as any })
      const app = createApp({ template: '<div />' })

      app.use(plugin)
      app.use(plugin)

      const container = document.createElement('div')
      app.mount(container)

      await nt()

      expect(setupFn).toHaveBeenCalledTimes(1)

      app.unmount()
    })
  })

  describe('persist / restore', () => {
    it('should call restore when persisted value exists', async () => {
      vi.resetModules()

      vi.doMock('#v0/constants/globals', () => ({
        IN_BROWSER: true,
      }))

      // Mock the storage context to return a persisted value
      const storedRef = { value: true }
      vi.doMock('#v0/composables/createContext', async () => {
        const actual = await vi.importActual('#v0/composables/createContext')
        return {
          ...actual,
          useContext: (ns: string) => {
            if (ns === 'v0:storage') {
              return { get: () => storedRef }
            }
            return (actual as any).useContext(ns)
          },
        }
      })

      const { createRtlPlugin: freshPlugin } = await import('./index')
      const { createApp, nextTick: nt } = await import('vue')

      const plugin = freshPlugin({ persist: true })
      const app = createApp({ template: '<div />' })

      app.use(plugin)

      const container = document.createElement('div')
      app.mount(container)

      await nt()

      // The restore callback should have set isRtl to true from storage
      expect(document.documentElement.dir).toBe('rtl')

      app.unmount()
      document.documentElement.dir = ''
    })

    it('should not restore when persisted value is null', async () => {
      vi.resetModules()

      vi.doMock('#v0/constants/globals', () => ({
        IN_BROWSER: true,
      }))

      const storedRef = { value: null }
      vi.doMock('#v0/composables/createContext', async () => {
        const actual = await vi.importActual('#v0/composables/createContext')
        return {
          ...actual,
          useContext: (ns: string) => {
            if (ns === 'v0:storage') {
              return { get: () => storedRef }
            }
            return (actual as any).useContext(ns)
          },
        }
      })

      const { createRtlPlugin: freshPlugin } = await import('./index')
      const { createApp, nextTick: nt } = await import('vue')

      const plugin = freshPlugin({ persist: true, default: false })
      const app = createApp({ template: '<div />' })

      app.use(plugin)

      const container = document.createElement('div')
      app.mount(container)

      await nt()

      expect(document.documentElement.dir).toBe('ltr')

      app.unmount()
      document.documentElement.dir = ''
    })
  })
})

describe('vuetify0RtlAdapter SSR (additional branches)', () => {
  it('should use ltr in SSR when isRtl is false', async () => {
    vi.resetModules()

    vi.doMock('#v0/constants/globals', () => ({
      IN_BROWSER: false,
    }))

    const { Vuetify0RtlAdapter: SSRAdapter } = await import('./adapters/v0')
    const { shallowRef: ssrShallowRef } = await import('vue')

    const pushFn = vi.fn()
    const mockApp = {
      _context: {
        provides: {
          usehead: { push: pushFn },
        },
      },
    } as any

    const adapter = new SSRAdapter()
    const isRtl = ssrShallowRef(false)
    adapter.setup(mockApp, { isRtl, toggle: () => {} }, undefined)

    expect(pushFn).toHaveBeenCalledWith({
      htmlAttrs: { dir: 'ltr' },
    })
  })

  it('should resolve head from provides.head fallback', async () => {
    vi.resetModules()

    vi.doMock('#v0/constants/globals', () => ({
      IN_BROWSER: false,
    }))

    const { Vuetify0RtlAdapter: SSRAdapter } = await import('./adapters/v0')
    const { shallowRef: ssrShallowRef } = await import('vue')

    const pushFn = vi.fn()
    const mockApp = {
      _context: {
        provides: {
          head: { push: pushFn },
        },
      },
    } as any

    const adapter = new SSRAdapter()
    const isRtl = ssrShallowRef(true)
    adapter.setup(mockApp, { isRtl, toggle: () => {} }, undefined)

    expect(pushFn).toHaveBeenCalledWith({
      htmlAttrs: { dir: 'rtl' },
    })
  })

  it('should prefer usehead over head when both are present', async () => {
    vi.resetModules()

    vi.doMock('#v0/constants/globals', () => ({
      IN_BROWSER: false,
    }))

    const { Vuetify0RtlAdapter: SSRAdapter } = await import('./adapters/v0')
    const { shallowRef: ssrShallowRef } = await import('vue')

    const useheadPush = vi.fn()
    const headPush = vi.fn()
    const mockApp = {
      _context: {
        provides: {
          usehead: { push: useheadPush },
          head: { push: headPush },
        },
      },
    } as any

    const adapter = new SSRAdapter()
    const isRtl = ssrShallowRef(false)
    adapter.setup(mockApp, { isRtl, toggle: () => {} }, undefined)

    expect(useheadPush).toHaveBeenCalledTimes(1)
    expect(headPush).not.toHaveBeenCalled()
  })

  it('should handle missing _context gracefully', async () => {
    vi.resetModules()

    vi.doMock('#v0/constants/globals', () => ({
      IN_BROWSER: false,
    }))

    const { Vuetify0RtlAdapter: SSRAdapter } = await import('./adapters/v0')
    const { shallowRef: ssrShallowRef } = await import('vue')

    const mockApp = {} as any

    const adapter = new SSRAdapter()
    const isRtl = ssrShallowRef(false)
    expect(() => adapter.setup(mockApp, { isRtl, toggle: () => {} }, undefined)).not.toThrow()
  })
})
