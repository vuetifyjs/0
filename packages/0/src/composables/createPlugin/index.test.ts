// Factories
import { createPlugin } from './index'

// Utilities
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Types
import type { App } from 'vue'
import type { PluginOptions } from './index'

describe('createPlugin', () => {
  let mockApp: App
  let mockRunWithContext: ReturnType<typeof vi.fn>
  let mockProvide: (app: App) => void
  let mockSetup: (app: App) => void

  beforeEach(() => {
    mockRunWithContext = vi.fn(callback => callback())
    mockApp = {
      runWithContext: mockRunWithContext,
    } as any

    mockProvide = vi.fn() as (app: App) => void
    mockSetup = vi.fn() as (app: App) => void
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
    const asyncSetup = vi.fn().mockResolvedValue(undefined) as (app: App) => Promise<void>
    const options: PluginOptions = {
      namespace: 'test',
      provide: mockProvide,
      setup: asyncSetup,
    }

    const plugin = createPlugin(options)
    await plugin.install(mockApp)

    expect(asyncSetup).toHaveBeenCalledOnce()
    expect(asyncSetup).toHaveBeenCalledWith(mockApp)
  })

  it('should maintain execution order: provide then setup', () => {
    const executionOrder: string[] = []

    const orderTrackingProvide = vi.fn(() => {
      executionOrder.push('provide')
    }) as (app: App) => void

    const orderTrackingSetup = vi.fn(() => {
      executionOrder.push('setup')
    }) as (app: App) => void

    const options: PluginOptions = {
      namespace: 'test',
      provide: orderTrackingProvide,
      setup: orderTrackingSetup,
    }

    const plugin = createPlugin(options)
    plugin.install(mockApp)

    expect(executionOrder).toEqual(['provide', 'setup'])
  })
})
