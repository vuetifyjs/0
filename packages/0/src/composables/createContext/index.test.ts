import { beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { inject, provide } from 'vue'

import { createContext, provideContext, useContext } from './index'

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

  describe('static key mode', () => {
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

    it('should handle falsy but defined context values', () => {
      const falsyValues = [false, 0, '', null]

      for (const value of falsyValues) {
        mockInject.mockReturnValue(value)
        const [injectContext] = createContext(`falsy-${value}`)

        expect(injectContext()).toBe(value)
      }
    })

    it('should provide context at app level when app is provided', () => {
      const mockApp = {
        provide: vi.fn().mockReturnValue(true),
      } as any

      const [, provideContext] = createContext('app-level-test')
      const testValue = { data: 'app-level' }

      mockProvide.mockClear()
      provideContext(testValue, mockApp)

      expect(mockApp.provide).toHaveBeenCalledWith('app-level-test', testValue)
      expect(mockProvide).not.toHaveBeenCalled()
    })

    it('should provide context at component level when app is not provided', () => {
      const [, provideContext] = createContext('component-level-test')
      const testValue = { data: 'component-level' }

      provideContext(testValue)

      expect(mockProvide).toHaveBeenCalledWith('component-level-test', testValue)
    })
  })

  describe('dynamic key mode', () => {
    it('should return inject and provide functions', () => {
      const [injectContext, provideContext] = createContext()

      expect(typeof injectContext).toBe('function')
      expect(typeof provideContext).toBe('function')
    })

    it('should provide context with runtime key', () => {
      const [, provideContext] = createContext()
      const testValue = { data: 'test' }

      provideContext('runtime-key', testValue)

      expect(mockProvide).toHaveBeenCalledWith('runtime-key', testValue)
    })

    it('should inject context with runtime key', () => {
      const testValue = { data: 'test' }
      mockInject.mockReturnValue(testValue)

      const [injectContext] = createContext()
      const result = injectContext('runtime-key')

      expect(mockInject).toHaveBeenCalledWith('runtime-key', undefined)
      expect(result).toBe(testValue)
    })

    it('should append suffix to runtime key when provided', () => {
      const [, provideContext] = createContext({ suffix: 'item' })
      const testValue = { data: 'test' }

      provideContext('v0:panel', testValue)

      expect(mockProvide).toHaveBeenCalledWith('v0:panel:item', testValue)
    })

    it('should inject with suffix appended to runtime key', () => {
      const testValue = { data: 'test' }
      mockInject.mockReturnValue(testValue)

      const [injectContext] = createContext({ suffix: 'item' })
      const result = injectContext('v0:panel')

      expect(mockInject).toHaveBeenCalledWith('v0:panel:item', undefined)
      expect(result).toBe(testValue)
    })

    it('should throw error when context is not found', () => {
      mockInject.mockReturnValue(undefined)

      const [injectContext] = createContext()

      expect(() => injectContext('missing-key')).toThrow(
        'Context "missing-key" not found. Ensure it\'s provided by an ancestor.',
      )
    })

    it('should provide context at app level when app is provided', () => {
      const mockApp = {
        provide: vi.fn().mockReturnValue(true),
      } as any

      const [, provideContext] = createContext()
      const testValue = { data: 'app-level' }

      mockProvide.mockClear()
      provideContext('app-key', testValue, mockApp)

      expect(mockApp.provide).toHaveBeenCalledWith('app-key', testValue)
      expect(mockProvide).not.toHaveBeenCalled()
    })
  })
})

describe('useContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should inject context with string key', () => {
    const testValue = { data: 'test' }
    mockInject.mockReturnValue(testValue)

    const result = useContext('my-key')

    expect(mockInject).toHaveBeenCalledWith('my-key', undefined)
    expect(result).toBe(testValue)
  })

  it('should inject context with symbol key', () => {
    const symbolKey = Symbol('my-key')
    const testValue = { data: 'test' }
    mockInject.mockReturnValue(testValue)

    const result = useContext(symbolKey as any)

    expect(mockInject).toHaveBeenCalledWith(symbolKey, undefined)
    expect(result).toBe(testValue)
  })

  it('should throw when context is not found and no default provided', () => {
    mockInject.mockReturnValue(undefined)

    expect(() => useContext('missing-key')).toThrow(
      'Context "missing-key" not found. Ensure it\'s provided by an ancestor.',
    )
  })

  it('should use default value when context is not found', () => {
    const defaultValue = { data: 'default' }
    mockInject.mockImplementation((_key, def) => def)

    const result = useContext('missing-key', defaultValue)

    expect(result).toBe(defaultValue)
  })

  it('should return context even when default is provided and context exists', () => {
    const contextValue = { data: 'context' }
    const defaultValue = { data: 'default' }
    mockInject.mockReturnValue(contextValue)

    const result = useContext('my-key', defaultValue)

    expect(result).toBe(contextValue)
  })

  it('should handle falsy context values correctly', () => {
    // Test that 0, '', false, null are valid contexts
    mockInject.mockReturnValue(0)
    expect(useContext('zero-key')).toBe(0)

    mockInject.mockReturnValue('')
    expect(useContext('empty-string-key')).toBe('')

    mockInject.mockReturnValue(false)
    expect(useContext('false-key')).toBe(false)

    mockInject.mockReturnValue(null)
    expect(useContext('null-key')).toBe(null)
  })

  it('should stringify symbol in error message', () => {
    const symbolKey = Symbol('test-symbol')
    mockInject.mockReturnValue(undefined)

    expect(() => useContext(symbolKey as any)).toThrow(
      'Context "Symbol(test-symbol)" not found.',
    )
  })
})

describe('provideContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should provide context with string key', () => {
    const testValue = { data: 'test' }

    const result = provideContext('my-key', testValue)

    expect(mockProvide).toHaveBeenCalledWith('my-key', testValue)
    expect(result).toBe(testValue)
  })

  it('should provide context with symbol key', () => {
    const symbolKey = Symbol('my-key')
    const testValue = { data: 'test' }

    const result = provideContext(symbolKey as any, testValue)

    expect(mockProvide).toHaveBeenCalledWith(symbolKey, testValue)
    expect(result).toBe(testValue)
  })

  it('should return the provided context', () => {
    const testValue = { data: 'test', nested: { value: 42 } }

    const result = provideContext('my-key', testValue)

    expect(result).toBe(testValue)
    expect(result.nested.value).toBe(42)
  })

  it('should provide context at app level when app is passed', () => {
    const mockApp = {
      provide: vi.fn(),
    } as any
    const testValue = { data: 'test' }

    provideContext('app-key', testValue, mockApp)

    expect(mockApp.provide).toHaveBeenCalledWith('app-key', testValue)
    expect(mockProvide).not.toHaveBeenCalled()
  })

  it('should provide context at component level when app is not passed', () => {
    const testValue = { data: 'test' }

    provideContext('component-key', testValue)

    expect(mockProvide).toHaveBeenCalledWith('component-key', testValue)
  })

  it('should handle falsy context values', () => {
    provideContext('zero', 0 as any)
    expect(mockProvide).toHaveBeenCalledWith('zero', 0)

    provideContext('empty', '' as any)
    expect(mockProvide).toHaveBeenCalledWith('empty', '')

    provideContext('false', false as any)
    expect(mockProvide).toHaveBeenCalledWith('false', false)

    provideContext('null', null as any)
    expect(mockProvide).toHaveBeenCalledWith('null', null)
  })
})
