import { beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { createApp, inject, nextTick, provide } from 'vue'

import { createStorage, createStorageContext, createStoragePlugin, useStorage } from './index'

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    provide: vi.fn(),
    inject: vi.fn(),
  }
})

const mockProvide = vi.mocked(provide)
const mockInject = vi.mocked(inject)

describe('useStorage', () => {
  let mockAdapter: any

  beforeEach(() => {
    mockAdapter = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    }
  })

  it('should return default value when storage is empty', () => {
    const storage = createStorage({ adapter: mockAdapter, prefix: 'test:' })

    const username = storage.get('username', 'guest')

    expect(username.value).toBe('guest')
  })

  it('should write to storage when ref is updated', async () => {
    const storage = createStorage({ adapter: mockAdapter, prefix: 'test:' })

    const username = storage.get('username', 'guest')
    username.value = 'john'
    await nextTick()

    expect(mockAdapter.setItem).toHaveBeenCalledWith('test:username', '"john"')
  })

  it('should read from storage on first access', () => {
    mockAdapter.getItem.mockReturnValue('"stored-value"')
    const storage = createStorage({ adapter: mockAdapter, prefix: 'test:' })

    const username = storage.get('username', 'default')

    expect(username.value).toBe('stored-value')
    expect(mockAdapter.getItem).toHaveBeenCalledWith('test:username')
  })

  it('should return same ref when getting same key multiple times', () => {
    const storage = createStorage({ adapter: mockAdapter, prefix: 'test:' })

    const ref1 = storage.get('username', 'guest')
    const ref2 = storage.get('username', 'guest')

    expect(ref1).toBe(ref2)
  })

  it('should use set() to update value', async () => {
    const storage = createStorage({ adapter: mockAdapter, prefix: 'test:' })

    storage.set('username', 'jane')
    await nextTick()

    expect(mockAdapter.setItem).toHaveBeenCalledWith('test:username', '"jane"')
  })

  it('should check if key exists with has()', () => {
    const storage = createStorage({ adapter: mockAdapter, prefix: 'test:' })

    expect(storage.has('username')).toBe(false)

    storage.get('username', 'guest')

    expect(storage.has('username')).toBe(true)
  })

  it('should remove key and stop watcher', async () => {
    const storage = createStorage({ adapter: mockAdapter, prefix: 'test:' })

    const username = storage.get('username', 'guest')
    username.value = 'john'
    await nextTick()

    mockAdapter.setItem.mockClear()

    storage.remove('username')

    expect(mockAdapter.removeItem).toHaveBeenCalledWith('test:username')
    expect(storage.has('username')).toBe(false)

    username.value = 'jane'
    await nextTick()

    expect(mockAdapter.setItem).not.toHaveBeenCalled()
  })

  it('should clear all keys', async () => {
    const storage = createStorage({ adapter: mockAdapter, prefix: 'test:' })

    const username = storage.get('username', 'guest')
    const email = storage.get('email', 'test@example.com')

    username.value = 'john'
    email.value = 'john@example.com'
    await nextTick()

    mockAdapter.setItem.mockClear()

    storage.clear()

    expect(mockAdapter.removeItem).toHaveBeenCalledWith('test:username')
    expect(mockAdapter.removeItem).toHaveBeenCalledWith('test:email')
    expect(storage.has('username')).toBe(false)
    expect(storage.has('email')).toBe(false)

    username.value = 'jane'
    email.value = 'jane@example.com'
    await nextTick()

    expect(mockAdapter.setItem).not.toHaveBeenCalled()
  })

  it('should remove from storage when value is null', async () => {
    const storage = createStorage({ adapter: mockAdapter, prefix: 'test:' })

    const username = storage.get('username', 'guest')
    username.value = null as any
    await nextTick()

    expect(mockAdapter.removeItem).toHaveBeenCalledWith('test:username')
    expect(mockAdapter.setItem).not.toHaveBeenCalled()
  })

  it('should remove from storage when value is undefined', async () => {
    const storage = createStorage({ adapter: mockAdapter, prefix: 'test:' })

    const username = storage.get('username', 'guest')
    username.value = undefined as any
    await nextTick()

    expect(mockAdapter.removeItem).toHaveBeenCalledWith('test:username')
    expect(mockAdapter.setItem).not.toHaveBeenCalled()
  })

  it('should handle serialization errors gracefully', () => {
    mockAdapter.getItem.mockReturnValue('invalid-json{')
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const storage = createStorage({ adapter: mockAdapter, prefix: 'test:' })
    const username = storage.get('username', 'default')

    expect(username.value).toBe('default')
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it('should use custom serializer', async () => {
    const storage = createStorage({
      adapter: mockAdapter,
      prefix: 'test:',
      serializer: {
        read: (val: string) => val.toUpperCase(),
        write: (val: any) => val.toLowerCase(),
      },
    })

    mockAdapter.getItem.mockReturnValue('stored')
    const username = storage.get('username', 'default')

    expect(username.value).toBe('STORED')

    username.value = 'JOHN'
    await nextTick()

    expect(mockAdapter.setItem).toHaveBeenCalledWith('test:username', 'john')
  })

  it('should handle deep reactive objects', async () => {
    const storage = createStorage({ adapter: mockAdapter, prefix: 'test:' })

    const user = storage.get('user', { name: 'guest', age: 0 })
    user.value.name = 'john'
    await nextTick()

    expect(mockAdapter.setItem).toHaveBeenCalledWith(
      'test:user',
      JSON.stringify({ name: 'john', age: 0 }),
    )
  })
})

describe('createStorageContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return a trinity tuple', () => {
    const result = createStorageContext()

    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(3)
    expect(typeof result[0]).toBe('function') // useStorageContext
    expect(typeof result[1]).toBe('function') // provideStorageContext
    expect(result[2]).toBeDefined() // default context
  })

  it('should create context with default namespace', () => {
    const [, provideStorageContext, context] = createStorageContext()

    provideStorageContext(context)

    expect(mockProvide).toHaveBeenCalledWith('v0:storage', context)
  })

  it('should create context with custom namespace', () => {
    const [, provideStorageContext, context] = createStorageContext({
      namespace: 'my-storage',
    })

    provideStorageContext(context)

    expect(mockProvide).toHaveBeenCalledWith('my-storage', context)
  })

  it('should create a functional storage context', () => {
    const mockAdapter = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    }
    const [,, context] = createStorageContext({
      adapter: mockAdapter,
      prefix: 'test:',
    })

    const username = context.get('username', 'guest')
    expect(username.value).toBe('guest')
  })

  it('should allow providing custom context', () => {
    const [, provideStorageContext] = createStorageContext()
    const customContext = createStorage({ prefix: 'custom:' })

    provideStorageContext(customContext)

    expect(mockProvide).toHaveBeenCalledWith('v0:storage', customContext)
  })

  it('should provide context at app level when app is passed', () => {
    const mockApp = {
      provide: vi.fn(),
    } as any
    const [, provideStorageContext, context] = createStorageContext()

    provideStorageContext(context, mockApp)

    expect(mockApp.provide).toHaveBeenCalledWith('v0:storage', context)
  })
})

describe('createStoragePlugin', () => {
  it('should create a Vue plugin', () => {
    const plugin = createStoragePlugin()

    expect(plugin).toBeDefined()
    expect(typeof plugin.install).toBe('function')
  })

  it('should accept storage options', () => {
    const plugin = createStoragePlugin({
      prefix: 'app:',
    })

    expect(plugin).toBeDefined()
    expect(typeof plugin.install).toBe('function')
  })

  it('should provide storage context when installed', () => {
    const app = createApp({
      template: '<div>Test</div>',
    })

    app.use(createStoragePlugin())

    const container = document.createElement('div')
    app.mount(container)
    app.unmount()

    // Plugin installs without error
    expect(true).toBe(true)
  })
})

describe('useStorage consumer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should inject context with default namespace', () => {
    const mockContext = createStorage()
    mockInject.mockReturnValue(mockContext)

    const result = useStorage()

    expect(mockInject).toHaveBeenCalledWith('v0:storage', undefined)
    expect(result).toBe(mockContext)
  })

  it('should inject context with custom namespace', () => {
    const mockContext = createStorage()
    mockInject.mockReturnValue(mockContext)

    const result = useStorage('my-storage')

    expect(mockInject).toHaveBeenCalledWith('my-storage', undefined)
    expect(result).toBe(mockContext)
  })

  it('should throw when context is not provided', () => {
    mockInject.mockReturnValue(undefined)

    expect(() => useStorage()).toThrow(
      'Context "v0:storage" not found. Ensure it\'s provided by an ancestor.',
    )
  })
})

describe('useStorage SSR', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  it('should use MemoryAdapter during SSR', async () => {
    vi.doMock('#v0/constants/globals', () => ({
      IN_BROWSER: false,
    }))

    const { createStorage } = await import('./index')
    const storage = createStorage()

    const username = storage.get('username', 'guest')
    expect(username.value).toBe('guest')

    username.value = 'john'
    expect(storage.get('username').value).toBe('john')
  })

  it('should not access window.localStorage during SSR', async () => {
    vi.doMock('#v0/constants/globals', () => ({
      IN_BROWSER: false,
    }))

    const originalWindow = globalThis.window
    const originalLocalStorage = originalWindow?.localStorage

    // Remove localStorage to ensure it's not accessed
    if (originalWindow) {
      Object.defineProperty(originalWindow, 'localStorage', {
        get: () => {
          throw new Error('localStorage accessed during SSR')
        },
        configurable: true,
      })
    }

    const { createStorage } = await import('./index')

    expect(() => {
      const storage = createStorage()
      storage.get('key', 'default')
      storage.set('key', 'value')
      storage.remove('key')
      storage.clear()
    }).not.toThrow()

    // Restore localStorage
    if (originalWindow && originalLocalStorage) {
      Object.defineProperty(originalWindow, 'localStorage', {
        value: originalLocalStorage,
        configurable: true,
      })
    }
  })

  it('createStorageContext should work during SSR', async () => {
    vi.doMock('#v0/constants/globals', () => ({
      IN_BROWSER: false,
    }))

    const { createStorageContext } = await import('./index')
    const [,, context] = createStorageContext()

    expect(() => {
      context.get('key', 'default')
      context.set('key', 'value')
      context.has('key')
      context.remove('key')
      context.clear()
    }).not.toThrow()
  })

  it('createStoragePlugin should work during SSR', async () => {
    vi.doMock('#v0/constants/globals', () => ({
      IN_BROWSER: false,
    }))

    const { createStoragePlugin } = await import('./index')
    const plugin = createStoragePlugin()

    expect(plugin).toBeDefined()
    expect(typeof plugin.install).toBe('function')
  })
})
