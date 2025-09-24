// Factories
import { createApp } from 'vue'
import { createPlugin } from './index'

// Utilities
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Types
import type { App } from 'vue'
import type { PluginOptions } from './index'

describe('createPlugin', () => {
  let mockApp: App
  let mockRunWithContext: ReturnType<typeof vi.fn>
  let mockProvide: ReturnType<typeof vi.fn>
  let mockSetup: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockRunWithContext = vi.fn(callback => callback())
    mockApp = {
      runWithContext: mockRunWithContext,
    } as any

    mockProvide = vi.fn()
    mockSetup = vi.fn()
  })

  it('should return a plugin object with install method', () => {
    const options: PluginOptions = {
      namespace: 'test',
      provide: mockProvide,
    }

    const plugin = createPlugin(options)

    expect(plugin).toHaveProperty('install')
    expect(typeof plugin.install).toBe('function')
  })

  it('should call app.runWithContext when installing', () => {
    const options: PluginOptions = {
      namespace: 'test',
      provide: mockProvide,
    }

    const plugin = createPlugin(options)
    plugin.install(mockApp)

    expect(mockRunWithContext).toHaveBeenCalledOnce()
    expect(mockRunWithContext).toHaveBeenCalledWith(expect.any(Function))
  })

  it('should call provide function during installation', () => {
    const options: PluginOptions = {
      namespace: 'test',
      provide: mockProvide,
    }

    const plugin = createPlugin(options)
    plugin.install(mockApp)

    expect(mockProvide).toHaveBeenCalledOnce()
    expect(mockProvide).toHaveBeenCalledWith(mockApp)
  })

  it('should call setup function when provided', () => {
    const options: PluginOptions = {
      namespace: 'test',
      provide: mockProvide,
      setup: mockSetup,
    }

    const plugin = createPlugin(options)
    plugin.install(mockApp)

    expect(mockSetup).toHaveBeenCalledOnce()
    expect(mockSetup).toHaveBeenCalledWith(mockApp)
  })

  it('should not call setup function when not provided', () => {
    const options: PluginOptions = {
      namespace: 'test',
      provide: mockProvide,
    }

    const plugin = createPlugin(options)
    plugin.install(mockApp)

    expect(mockSetup).not.toHaveBeenCalled()
  })

  it('should handle async setup function', async () => {
    const asyncSetup = vi.fn().mockResolvedValue(undefined)
    const options: PluginOptions = {
      namespace: 'test',
      provide: mockProvide,
      setup: asyncSetup,
    }

    const plugin = createPlugin(options)
    plugin.install(mockApp)

    expect(asyncSetup).toHaveBeenCalledOnce()
    expect(asyncSetup).toHaveBeenCalledWith(mockApp)
  })

  it('should work with different namespace values', () => {
    const namespaces = ['my-plugin', 'custom-namespace', 'vuetify-component']

    for (const namespace of namespaces) {
      const options: PluginOptions = {
        namespace,
        provide: mockProvide,
      }

      const plugin = createPlugin(options)

      expect(plugin).toHaveProperty('install')
      expect(typeof plugin.install).toBe('function')
    }
  })

  it('should maintain execution order: provide then setup', () => {
    const executionOrder: string[] = []

    const orderTrackingProvide = vi.fn(() => {
      executionOrder.push('provide')
    })

    const orderTrackingSetup = vi.fn(() => {
      executionOrder.push('setup')
    })

    const options: PluginOptions = {
      namespace: 'test',
      provide: orderTrackingProvide,
      setup: orderTrackingSetup,
    }

    const plugin = createPlugin(options)
    plugin.install(mockApp)

    expect(executionOrder).toEqual(['provide', 'setup'])
  })

  it('should work with generic type parameter', () => {
    interface CustomPlugin {
      install: (app: App) => void
      customMethod?: () => string
    }

    const options: PluginOptions = {
      namespace: 'typed-plugin',
      provide: mockProvide,
    }

    const plugin = createPlugin<CustomPlugin>(options)

    // TypeScript should understand this as CustomPlugin type
    expect(plugin).toHaveProperty('install')
    expect(typeof plugin.install).toBe('function')
  })

  it('should integrate with real Vue app', () => {
    const realApp = createApp({})
    const realProvide = vi.fn()
    const realSetup = vi.fn()

    const options: PluginOptions = {
      namespace: 'real-test',
      provide: realProvide,
      setup: realSetup,
    }

    const plugin = createPlugin(options)

    expect(() => {
      plugin.install(realApp)
    }).not.toThrow()

    expect(realProvide).toHaveBeenCalledWith(realApp)
    expect(realSetup).toHaveBeenCalledWith(realApp)
  })
})
