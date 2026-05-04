import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createStorage, createStorageContext, createStoragePlugin, useStorage } from './index'

// Utilities
import { nextTick, provide } from 'vue'

// Types
import type { createApp } from 'vue'

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    provide: vi.fn(),
    inject: vi.fn(),
  }
})

const mockProvide = vi.mocked(provide)

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

  it('should clone defaultValue to prevent shared reference mutation', () => {
    const storage = createStorage({ adapter: mockAdapter, prefix: 'test:' })
    const defaults = { theme: 'light', flags: [] as string[] }

    const a = storage.get('a', defaults)
    const b = storage.get('b', defaults)

    a.value.theme = 'dark'
    a.value.flags.push('beta')

    expect(b.value.theme).toBe('light')
    expect(b.value.flags).toEqual([])
    expect(defaults.theme).toBe('light')
    expect(defaults.flags).toEqual([])
  })

  it('should preserve empty string values', () => {
    mockAdapter.getItem.mockReturnValue('""')
    const storage = createStorage({ adapter: mockAdapter, prefix: 'test:' })

    const val = storage.get('key', 'fallback')

    expect(val.value).toBe('')
  })

  it('should check adapter for has() even if key was never accessed', () => {
    mockAdapter.getItem.mockReturnValue('"exists"')
    const storage = createStorage({ adapter: mockAdapter, prefix: 'test:' })

    expect(storage.has('key')).toBe(true)
    expect(mockAdapter.getItem).toHaveBeenCalledWith('test:key')
  })

  it('should return false from has() when key is absent from adapter', () => {
    const storage = createStorage({ adapter: mockAdapter, prefix: 'test:' })

    expect(storage.has('missing')).toBe(false)
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

  describe('ttl', () => {
    it('should wrap values with timestamp when ttl is set', async () => {
      const now = 1_000_000
      vi.spyOn(Date, 'now').mockReturnValue(now)

      const storage = createStorage({ adapter: mockAdapter, ttl: 5000 })
      storage.set('key', 'hello')

      await nextTick()

      expect(mockAdapter.setItem).toHaveBeenCalledWith(
        'v0:key',
        JSON.stringify({ __v0: 1, __v: 'hello', __t: now }),
      )
    })

    it('should return value when within ttl', () => {
      const now = 1_000_000
      vi.spyOn(Date, 'now').mockReturnValue(now)

      mockAdapter.getItem.mockReturnValue(
        JSON.stringify({ __v0: 1, __v: 'fresh', __t: now - 3000 }),
      )

      const storage = createStorage({ adapter: mockAdapter, ttl: 5000 })
      const val = storage.get('key', 'default')

      expect(val.value).toBe('fresh')
    })

    it('should return default when ttl expired', () => {
      const now = 1_000_000
      vi.spyOn(Date, 'now').mockReturnValue(now)

      mockAdapter.getItem.mockReturnValue(
        JSON.stringify({ __v0: 1, __v: 'stale', __t: now - 10_000 }),
      )

      const storage = createStorage({ adapter: mockAdapter, ttl: 5000 })
      const val = storage.get('key', 'default')

      expect(val.value).toBe('default')
      expect(mockAdapter.removeItem).toHaveBeenCalledWith('v0:key')
    })

    it('should return false from has() when entry is expired', () => {
      const now = 1_000_000
      vi.spyOn(Date, 'now').mockReturnValue(now)

      mockAdapter.getItem.mockReturnValue(
        JSON.stringify({ __v0: 1, __v: 'stale', __t: now - 10_000 }),
      )

      const storage = createStorage({ adapter: mockAdapter, ttl: 5000 })

      expect(storage.has('key')).toBe(false)
    })

    it('should not wrap values when ttl is not set', async () => {
      const storage = createStorage({ adapter: mockAdapter })
      storage.set('key', 'plain')

      await nextTick()

      expect(mockAdapter.setItem).toHaveBeenCalledWith(
        'v0:key',
        JSON.stringify('plain'),
      )
    })

    it('should read non-ttl values normally even when ttl is set', () => {
      mockAdapter.getItem.mockReturnValue(JSON.stringify('legacy'))

      const storage = createStorage({ adapter: mockAdapter, ttl: 5000 })
      const val = storage.get('key', 'default')

      expect(val.value).toBe('legacy')
    })

    it('should not misinterpret user data with __ttl and __v keys as TTL envelope', () => {
      const userData = { __ttl: 1, __v: 'fake', __t: 0 }
      mockAdapter.getItem.mockReturnValue(JSON.stringify(userData))

      const storage = createStorage({ adapter: mockAdapter, ttl: 5000 })
      const val = storage.get('key', 'default')

      // Should return the full object, not unwrap __v
      expect(val.value).toEqual(userData)
    })
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
      namespace: 'test:my-storage',
    })

    provideStorageContext(context)

    expect(mockProvide).toHaveBeenCalledWith('test:my-storage', context)
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
    const mockApp = { provide: vi.fn(), runWithContext: vi.fn((fn: () => void) => fn()), _context: {} } as unknown as ReturnType<typeof createApp>

    const plugin = createStoragePlugin()
    plugin.install(mockApp)

    expect(mockApp.provide).toHaveBeenCalledWith('v0:storage', expect.objectContaining({
      get: expect.any(Function),
      set: expect.any(Function),
      has: expect.any(Function),
      remove: expect.any(Function),
      clear: expect.any(Function),
    }))
  })
})

describe('useStorage consumer', () => {
  it('should return fallback when no context is provided', () => {
    const result = useStorage()

    expect(typeof result.get).toBe('function')
    expect(typeof result.set).toBe('function')
    expect(typeof result.has).toBe('function')
    expect(typeof result.remove).toBe('function')
    expect(typeof result.clear).toBe('function')
  })
})

describe('useStorage edge cases', () => {
  it('should log error when writeStored fails', async () => {
    const failAdapter = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(() => {
        throw new Error('Storage full')
      }),
      removeItem: vi.fn(),
    }
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const storage = createStorage({ adapter: failAdapter, prefix: 'test:' })
    const val = storage.get('key', 'default')
    val.value = 'new-value'
    await nextTick()
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[v0:storage] Failed to write key'),
      expect.any(Error),
    )
    consoleSpy.mockRestore()
  })

  it('should no-op when removing a key that was never created', () => {
    const noopAdapter = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    }
    const storage = createStorage({ adapter: noopAdapter, prefix: 'test:' })
    storage.remove('nonexistent')
    expect(noopAdapter.removeItem).not.toHaveBeenCalled()
  })

  it('should no-op clear when no keys were ever accessed', () => {
    const noopAdapter = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    }
    const storage = createStorage({ adapter: noopAdapter, prefix: 'test:' })

    // Clear on empty storage should not throw or call removeItem
    storage.clear()
    expect(noopAdapter.removeItem).not.toHaveBeenCalled()
  })

  it('should handle has() returning true from cache without hitting adapter', () => {
    const adapter = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    }
    const storage = createStorage({ adapter, prefix: 'test:' })

    // Access the key to put it in cache
    storage.get('cached', 'value')

    // Reset to check if adapter is called
    adapter.getItem.mockClear()

    // has() should return true from cache without calling adapter
    expect(storage.has('cached')).toBe(true)
    expect(adapter.getItem).not.toHaveBeenCalled()
  })
})

describe('useStorage cross-tab sync', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  it('should handle cross-tab storage events for cached keys', async () => {
    vi.doMock('#v0/constants/globals', () => ({
      IN_BROWSER: true,
    }))

    // Mock window.localStorage
    const mockStorage = {
      getItem: vi.fn((): string | null => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    }
    Object.defineProperty(globalThis.window, 'localStorage', {
      value: mockStorage,
      configurable: true,
      writable: true,
    })

    const { createStorage } = await import('./index')
    const storage = createStorage({ prefix: 'test:' })

    // Create a cached key
    const ref = storage.get('username', 'guest')
    expect(ref.value).toBe('guest')

    // Simulate a cross-tab storage event for a cached key
    const storageEvent = new StorageEvent('storage', {
      key: 'test:username',
      newValue: '"updated-from-other-tab"',
      storageArea: window.localStorage,
    })

    mockStorage.getItem.mockReturnValue('"updated-from-other-tab"')

    window.dispatchEvent(storageEvent)
    await nextTick()

    expect(ref.value).toBe('updated-from-other-tab')
  })

  it('should ignore storage events for keys without matching prefix', async () => {
    vi.doMock('#v0/constants/globals', () => ({
      IN_BROWSER: true,
    }))

    const mockStorage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    }
    Object.defineProperty(globalThis.window, 'localStorage', {
      value: mockStorage,
      configurable: true,
      writable: true,
    })

    const { createStorage } = await import('./index')
    const storage = createStorage({ prefix: 'test:' })

    const ref = storage.get('username', 'guest')

    // Dispatch event with different prefix
    const storageEvent = new StorageEvent('storage', {
      key: 'other:username',
      newValue: '"wrong"',
      storageArea: window.localStorage,
    })

    window.dispatchEvent(storageEvent)
    await nextTick()

    expect(ref.value).toBe('guest')
  })

  it('should ignore storage events for non-cached keys', async () => {
    vi.doMock('#v0/constants/globals', () => ({
      IN_BROWSER: true,
    }))

    const mockStorage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    }
    Object.defineProperty(globalThis.window, 'localStorage', {
      value: mockStorage,
      configurable: true,
      writable: true,
    })

    const { createStorage } = await import('./index')
    createStorage({ prefix: 'test:' })

    // Dispatch event for a key that was never accessed
    const storageEvent = new StorageEvent('storage', {
      key: 'test:unknown',
      newValue: '"something"',
      storageArea: window.localStorage,
    })

    // Should not throw
    expect(() => window.dispatchEvent(storageEvent)).not.toThrow()
  })

  it('should re-sync to storage when value changes after cross-tab event', async () => {
    vi.doMock('#v0/constants/globals', () => ({
      IN_BROWSER: true,
    }))

    const mockStorage = {
      getItem: vi.fn((): string | null => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    }
    Object.defineProperty(globalThis.window, 'localStorage', {
      value: mockStorage,
      configurable: true,
      writable: true,
    })

    const { createStorage } = await import('./index')
    const storage = createStorage({ prefix: 'test:' })

    const ref = storage.get('key', 'initial')

    // Simulate cross-tab update
    mockStorage.getItem.mockReturnValue('"from-other-tab"')
    const storageEvent = new StorageEvent('storage', {
      key: 'test:key',
      newValue: '"from-other-tab"',
      storageArea: window.localStorage,
    })
    window.dispatchEvent(storageEvent)
    await nextTick()

    expect(ref.value).toBe('from-other-tab')

    // Now change the value locally — the re-created watcher should sync it back
    mockStorage.setItem.mockClear()
    ref.value = 'local-change'
    await nextTick()

    expect(mockStorage.setItem).toHaveBeenCalledWith('test:key', '"local-change"')
  })

  it('should remove from storage when value set to null after cross-tab event', async () => {
    vi.doMock('#v0/constants/globals', () => ({
      IN_BROWSER: true,
    }))

    const mockStorage = {
      getItem: vi.fn((): string | null => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    }
    Object.defineProperty(globalThis.window, 'localStorage', {
      value: mockStorage,
      configurable: true,
      writable: true,
    })

    const { createStorage } = await import('./index')
    const storage = createStorage({ prefix: 'test:' })

    const ref = storage.get('key', 'initial')

    // Simulate cross-tab update
    mockStorage.getItem.mockReturnValue('"synced"')
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'test:key',
      newValue: '"synced"',
      storageArea: window.localStorage,
    }))
    await nextTick()

    // Set to null — should trigger removeItem via the re-created watcher
    ref.value = null as any
    await nextTick()

    expect(mockStorage.removeItem).toHaveBeenCalledWith('test:key')
  })

  it('should set value to undefined when storage event newValue is null', async () => {
    vi.doMock('#v0/constants/globals', () => ({
      IN_BROWSER: true,
    }))

    const mockStorage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    }
    Object.defineProperty(globalThis.window, 'localStorage', {
      value: mockStorage,
      configurable: true,
      writable: true,
    })

    const { createStorage } = await import('./index')
    const storage = createStorage({ prefix: 'test:' })

    const ref = storage.get('username', 'guest')
    expect(ref.value).toBe('guest')

    // Simulate key removal from another tab (newValue is null)
    const storageEvent = new StorageEvent('storage', {
      key: 'test:username',
      newValue: null,
      storageArea: window.localStorage,
    })

    window.dispatchEvent(storageEvent)
    await nextTick()

    expect(ref.value).toBeUndefined()
  })
})

describe('useStorage SSR safety', () => {
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
