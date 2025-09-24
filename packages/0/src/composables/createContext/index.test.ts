// Factories
import { createContext } from './index'

// Utilities
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { provide, inject } from 'vue'

vi.mock('vue', () => ({
  provide: vi.fn(),
  inject: vi.fn(),
}))

const mockProvide = vi.mocked(provide)
const mockInject = vi.mocked(inject)

describe('createContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return inject and provide functions', () => {
    const [injectContext, provideContext] = createContext('test')

    expect(typeof injectContext).toBe('function')
    expect(typeof provideContext).toBe('function')
  })

  it('should provide context value with string key', () => {
    const [, provideContext] = createContext('test-key')
    const testValue = { data: 'test' }

    provideContext(testValue)

    expect(mockProvide).toHaveBeenCalledWith('test-key', testValue)
  })

  it('should provide context value with InjectionKey', () => {
    const injectionKey = Symbol('test-key') as any
    const [, provideContext] = createContext(injectionKey)
    const testValue = { data: 'test' }

    provideContext(testValue)

    expect(mockProvide).toHaveBeenCalledWith(injectionKey, testValue)
  })

  it('should inject context value successfully', () => {
    const testValue = { data: 'test' }
    mockInject.mockReturnValue(testValue)

    const [injectContext] = createContext('test-key')
    const result = injectContext()

    expect(mockInject).toHaveBeenCalledWith('test-key', undefined)
    expect(result).toBe(testValue)
  })

  it('should throw error when context is not found', () => {
    mockInject.mockReturnValue(undefined)

    const [injectContext] = createContext('missing-key')

    expect(() => injectContext()).toThrow(
      'Context "missing-key" not found. Ensure it\'s provided by an ancestor.',
    )
  })

  it('should handle symbol key in error message', () => {
    const symbolKey = Symbol('symbol-key')
    mockInject.mockReturnValue(undefined)

    const [injectContext] = createContext(symbolKey as any)

    expect(() => injectContext()).toThrow(
      'Context "Symbol(symbol-key)" not found. Ensure it\'s provided by an ancestor.',
    )
  })

  it('should work with typed context', () => {
    interface TestContext {
      name: string
      value: number
    }

    const [injectContext, provideContext] = createContext<TestContext>('typed-test')
    const testValue: TestContext = { name: 'test', value: 42 }

    mockInject.mockReturnValue(testValue)

    provideContext(testValue)
    const result = injectContext()

    expect(mockProvide).toHaveBeenCalledWith('typed-test', testValue)
    expect(result).toEqual(testValue)
  })

  it('should handle null context value (only undefined throws)', () => {
    mockInject.mockReturnValue(null)

    const [injectContext] = createContext('null-test')
    const result = injectContext()

    expect(result).toBe(null)
  })

  it('should handle falsy but defined context values', () => {
    const falsyValues = [false, 0, '', null]

    for (const value of falsyValues) {
      mockInject.mockReturnValue(value)
      const [injectContext] = createContext(`falsy-${value}`)

      expect(injectContext()).toBe(value)
    }
  })
})
