import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { toSingleton } from '../index'

describe('toSingleton', () => {
  it('should create a singleton with use, provide, and context', () => {
    const mockContext = { value: 'test' }
    const mockUseContext = vi.fn(() => mockContext)
    const mockProvideContext = vi.fn((_model, context) => context)

    const singleton = toSingleton(mockUseContext, mockProvideContext, mockContext)

    expect(singleton).toHaveLength(3)
    expect(typeof singleton[0]).toBe('function') // useContext
    expect(typeof singleton[1]).toBe('function') // provideContext wrapper
    expect(singleton[2]).toBe(mockContext) // context
  })

  it('should call the original useContext function', () => {
    const mockContext = { value: 'test' }
    const mockUseContext = vi.fn(() => mockContext)
    const mockProvideContext = vi.fn((_model, context) => context)

    const [useContext] = toSingleton(mockUseContext, mockProvideContext, mockContext)

    const result = useContext()

    expect(mockUseContext).toHaveBeenCalledOnce()
    expect(result).toBe(mockContext)
  })

  it('should wrap provideContext with model and default context handling', () => {
    const mockContext = { value: 'test' }
    const customContext = { value: 'custom' }
    const mockModel = ref('model-value')
    const mockUseContext = vi.fn(() => mockContext)
    const mockProvideContext = vi.fn((_model, context) => context)

    const [, provideContext] = toSingleton(mockUseContext, mockProvideContext, mockContext)

    // Call with default context and no model
    const result1 = provideContext()
    expect(mockProvideContext).toHaveBeenCalledWith(undefined, mockContext, undefined)
    expect(result1).toBe(mockContext)

    // Call with model and custom context
    const result2 = provideContext(mockModel, customContext)
    expect(mockProvideContext).toHaveBeenCalledWith(mockModel, customContext, undefined)
    expect(result2).toBe(customContext)
  })

  it('should pass app parameter to provideContext', () => {
    const mockContext = { value: 'test' }
    const mockApp = { version: '3.0.0' } as any
    const mockModel = ref('model-value')
    const mockUseContext = vi.fn(() => mockContext)
    const mockProvideContext = vi.fn((_model, context) => context)

    const [, provideContext] = toSingleton(mockUseContext, mockProvideContext, mockContext)

    provideContext(mockModel, undefined, mockApp)

    expect(mockProvideContext).toHaveBeenCalledWith(mockModel, mockContext, mockApp)
  })

  it('should handle model parameter correctly', () => {
    const mockContext = { value: 'test', selectedValue: null }
    const mockModel = ref('selected-item')
    const mockUseContext = vi.fn(() => mockContext)
    const mockProvideContext = vi.fn((model, context) => {
      if (model) {
        return { ...context, selectedValue: model.value }
      }
      return context
    })

    const [, provideContext] = toSingleton(mockUseContext, mockProvideContext, mockContext)

    const result = provideContext(mockModel)

    expect(mockProvideContext).toHaveBeenCalledWith(mockModel, mockContext, undefined)
    expect(result).toEqual({ value: 'test', selectedValue: 'selected-item' })
  })

  it('should return readonly tuple', () => {
    const mockContext = { value: 'test' }
    const mockUseContext = vi.fn(() => mockContext)
    const mockProvideContext = vi.fn((_model, context) => context)

    const singleton = toSingleton(mockUseContext, mockProvideContext, mockContext)

    // Should be read-only, but we can't directly test this in runtime
    // The type system ensures it's readonly
    expect(Array.isArray(singleton)).toBe(true)
    expect(Object.isFrozen(singleton)).toBe(false) // as const doesn't freeze, just makes readonly at type level
  })
})
