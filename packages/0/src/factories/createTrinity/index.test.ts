import { describe, it, expect, vi } from 'vitest'
import { createTrinity } from '../index'

describe('createTrinity', () => {
  it('should create a singleton with use, provide, and context', () => {
    const mockContext = { value: 'test' }
    const mockUseContext = vi.fn(() => mockContext)
    const mockProvideContext = vi.fn(context => context)

    const singleton = createTrinity(mockUseContext, mockProvideContext, mockContext)

    expect(singleton).toHaveLength(3)
    expect(typeof singleton[0]).toBe('function') // createContext
    expect(typeof singleton[1]).toBe('function') // provideContext wrapper
    expect(singleton[2]).toBe(mockContext) // context
  })

  it('should call the original createContext function', () => {
    const mockContext = { value: 'test' }
    const mockUseContext = vi.fn(() => mockContext)
    const mockProvideContext = vi.fn(context => context)

    const [createContext] = createTrinity(mockUseContext, mockProvideContext, mockContext)

    const result = createContext()

    expect(mockUseContext).toHaveBeenCalledOnce()
    expect(result).toBe(mockContext)
  })

  it('should wrap provideContext with default context handling', () => {
    const mockContext = { value: 'test' }
    const customContext = { value: 'custom' }
    const mockUseContext = vi.fn(() => mockContext)
    const mockProvideContext = vi.fn(context => context)

    const [, provideContext] = createTrinity(mockUseContext, mockProvideContext, mockContext)

    // Call with default context
    const result1 = provideContext()
    expect(mockProvideContext).toHaveBeenCalledWith(mockContext, undefined)
    expect(result1).toBe(mockContext)

    // Call with custom context
    const result2 = provideContext(customContext)
    expect(mockProvideContext).toHaveBeenCalledWith(customContext, undefined)
    expect(result2).toBe(customContext)
  })

  it('should pass app parameter to provideContext', () => {
    const mockContext = { value: 'test' }
    const mockApp = { version: '3.0.0' } as any
    const mockUseContext = vi.fn(() => mockContext)
    const mockProvideContext = vi.fn(context => context)

    const [, provideContext] = createTrinity(mockUseContext, mockProvideContext, mockContext)

    provideContext(undefined, mockApp)

    expect(mockProvideContext).toHaveBeenCalledWith(mockContext, mockApp)
  })

  it('should return readonly tuple', () => {
    const mockContext = { value: 'test' }
    const mockUseContext = vi.fn(() => mockContext)
    const mockProvideContext = vi.fn(context => context)

    const singleton = createTrinity(mockUseContext, mockProvideContext, mockContext)

    // Should be read-only, but we can't directly test this in runtime
    // The type system ensures it's readonly
    expect(Array.isArray(singleton)).toBe(true)
    expect(Object.isFrozen(singleton)).toBe(false) // as const doesn't freeze, just makes readonly at type level
  })
})
