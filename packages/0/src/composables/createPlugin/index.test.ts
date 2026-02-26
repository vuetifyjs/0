import { beforeEach, describe, expect, it, vi } from 'vitest'

// Types
import type { PluginOptions } from './index'
import type { App } from 'vue'

import { createPlugin, createPluginContext } from './index'

describe('createPlugin', () => {
  let mockApp: App
  let mockRunWithContext: ReturnType<typeof vi.fn>
  let mockProvide: (app: App) => void
  let mockSetup: (app: App) => void

  beforeEach(() => {
    mockRunWithContext = vi.fn(callback => callback())
    mockApp = {
      _context: {},
      runWithContext: mockRunWithContext,
    } as unknown as App

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

  it('should only call setup once when installed twice on the same app', () => {
    const options: PluginOptions = {
      namespace: 'duplicate-guard',
      provide: mockProvide,
      setup: mockSetup,
    }

    const plugin = createPlugin(options)
    plugin.install(mockApp)
    plugin.install(mockApp)

    expect(mockSetup).toHaveBeenCalledOnce()
    expect(mockProvide).toHaveBeenCalledTimes(2)
  })
})

describe('createPluginContext', () => {
  let mockApp: App
  let mockRunWithContext: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    mockRunWithContext = vi.fn(callback => callback())
    mockApp = {
      _context: {},
      provide: vi.fn(),
      runWithContext: mockRunWithContext,
    } as unknown as App
  })

  it('should return a tuple of [createXContext, createXPlugin, useX]', () => {
    const [createXContext, createXPlugin, useX] = createPluginContext(
      'v0:test',
      () => ({ value: 'default' }),
    )

    expect(typeof createXContext).toBe('function')
    expect(typeof createXPlugin).toBe('function')
    expect(typeof useX).toBe('function')
  })

  it('should use default namespace', () => {
    const [createXContext] = createPluginContext(
      'v0:my-feature',
      () => ({ data: 42 }),
    )

    const [, , context] = createXContext()

    expect(context).toEqual({ data: 42 })
  })

  it('should use custom namespace', () => {
    const [createXContext] = createPluginContext(
      'v0:default-ns',
      () => ({ data: 'custom' }),
    )

    const [, , context] = createXContext({ namespace: 'custom-ns' })

    expect(context).toEqual({ data: 'custom' })
  })

  it('should invoke factory with options', () => {
    const factory = vi.fn((opts: { prefix: string }) => ({ prefix: opts.prefix }))

    const [createXContext] = createPluginContext<{ namespace?: string, prefix: string }, { prefix: string }>(
      'v0:test',
      factory,
    )

    createXContext({ prefix: 'my-prefix' })

    expect(factory).toHaveBeenCalledWith({ prefix: 'my-prefix' })
  })

  it('should call setup callback on plugin install', () => {
    const setup = vi.fn()

    const [, createXPlugin] = createPluginContext(
      'v0:setup-test',
      () => ({ value: 'test' }),
      { setup },
    )

    const plugin = createXPlugin()
    plugin.install(mockApp)

    expect(setup).toHaveBeenCalledOnce()
  })

  it('should return fallback when fallback is configured and no instance exists', () => {
    const fallback = vi.fn(() => ({ fallback: true }))

    const [, , useX] = createPluginContext(
      'v0:fallback-test',
      () => ({ fallback: false }),
      { fallback },
    )

    const result = useX()

    expect(result).toEqual({ fallback: true })
    expect(fallback).toHaveBeenCalledWith('v0:fallback-test')
  })
})
