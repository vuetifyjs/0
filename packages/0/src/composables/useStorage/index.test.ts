import { beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { nextTick } from 'vue'

import { createStorage } from './index'

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
