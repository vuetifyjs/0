import { beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { inject, nextTick, provide } from 'vue'

import { createForm, createFormContext, useForm } from './index'

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

describe('createForm disabled fields', () => {
  it('should register disabled fields', () => {
    const form = createForm()
    const field = form.register({
      id: 'test',
      value: 'test',
      disabled: true,
      rules: [],
    })

    expect(field.disabled).toBe(true)
  })

  it('should default to enabled when disabled is not specified', () => {
    const form = createForm()
    const field = form.register({
      id: 'test',
      value: 'test',
      rules: [],
    })

    expect(field.disabled).toBe(false)
  })
})

describe('createForm integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should validate all fields on submit', async () => {
    const form = createForm()
    const mockRule = vi.fn().mockResolvedValue('Error message')

    const field = form.register({
      id: 'test',
      rules: [mockRule],
      value: 'test-value',
    })

    await form.submit()

    expect(mockRule).toHaveBeenCalledWith('test-value')
    expect(field.errors.value).toEqual(['Error message'])
  })

  it('should correctly compute isValid and isValidating', async () => {
    const form = createForm()
    const mockRule = vi.fn().mockResolvedValue(true)

    form.register({
      id: 'test',
      rules: [mockRule],
      value: 'test-value',
    })

    const submitPromise = form.submit()

    await nextTick()
    expect(form.isValidating.value).toBe(true)

    await submitPromise

    expect(form.isValid.value).toBe(true)
    expect(form.isValidating.value).toBe(false)
  })

  describe('isValid computation', () => {
    it('should return null when no fields are registered', () => {
      const form = createForm()
      expect(form.isValid.value).toBe(null)
    })

    it('should return null when fields have not been validated', () => {
      const form = createForm()
      form.register({
        id: 'field1',
        value: 'test',
        rules: [v => (v as string).length > 0 || 'Required'],
      })

      expect(form.isValid.value).toBe(null)
    })

    it('should return true when all fields are valid', async () => {
      const form = createForm()
      const field1 = form.register({
        id: 'field1',
        value: 'valid',
        rules: [v => (v as string).length > 0 || 'Required'],
      })
      const field2 = form.register({
        id: 'field2',
        value: 'also valid',
        rules: [v => (v as string).length > 3 || 'Min 3 chars'],
      })

      await field1.validate()
      await field2.validate()

      expect(form.isValid.value).toBe(true)
    })

    it('should return false when any field is invalid', async () => {
      const form = createForm()
      const field1 = form.register({
        id: 'field1',
        value: 'valid',
        rules: [v => (v as string).length > 0 || 'Required'],
      })
      const field2 = form.register({
        id: 'field2',
        value: '',
        rules: [v => (v as string).length > 0 || 'Required'],
      })

      await field1.validate()
      await field2.validate()

      expect(form.isValid.value).toBe(false)
    })

    it('should return null when some fields are validated and some are not', async () => {
      const form = createForm()
      const field1 = form.register({
        id: 'field1',
        value: 'valid',
        rules: [v => (v as string).length > 0 || 'Required'],
      })
      form.register({
        id: 'field2',
        value: 'not validated',
        rules: [v => (v as string).length > 0 || 'Required'],
      })

      await field1.validate()

      expect(form.isValid.value).toBe(null)
    })
  })

  it('should reset all fields when form.reset() is called', async () => {
    const form = createForm()
    const field1 = form.register({
      id: 'field1',
      value: 'initial1',
      rules: [v => (v as string).length > 0 || 'Required'],
    })
    const field2 = form.register({
      id: 'field2',
      value: 'initial2',
      rules: [v => (v as string).length > 0 || 'Required'],
    })

    field1.value = 'changed1'
    field2.value = 'changed2'
    await field1.validate()
    await field2.validate()

    form.reset()

    expect(field1.value).toBe('initial1')
    expect(field2.value).toBe('initial2')
    expect(field1.isPristine.value).toBe(true)
    expect(field2.isPristine.value).toBe(true)
    expect(field1.isValid.value).toBe(null)
    expect(field2.isValid.value).toBe(null)
    expect(field1.errors.value).toEqual([])
    expect(field2.errors.value).toEqual([])
  })

  it('should support programmatic register outside component context', () => {
    const form = createForm()

    const field = form.register({
      id: 'programmatic',
      value: 'hello',
      rules: [v => (v as string).length > 0 || 'Required'],
    })

    expect(field.value).toBe('hello')
    expect(field.disabled).toBe(false)
    expect(typeof field.validate).toBe('function')
    expect(typeof field.reset).toBe('function')
  })

  it('should register declarative and programmatic fields in the same registry', () => {
    const form = createForm()

    const field1 = form.register({
      id: 'field-a',
      value: 'a',
    })
    const field2 = form.register({
      id: 'field-b',
      value: 'b',
    })

    expect(form.size).toBe(2)
    expect(form.get('field-a')).toBe(field1)
    expect(form.get('field-b')).toBe(field2)
  })

  describe('isPristine tracking', () => {
    it('should be pristine initially', () => {
      const form = createForm()
      const field = form.register({
        id: 'test',
        value: 'initial',
        rules: [],
      })

      expect(field.isPristine.value).toBe(true)
    })

    it('should be non-pristine after value change', () => {
      const form = createForm()
      const field = form.register({
        id: 'test',
        value: 'initial',
        rules: [],
      })

      field.value = 'changed'

      expect(field.isPristine.value).toBe(false)
    })

    it('should be pristine again after reset', () => {
      const form = createForm()
      const field = form.register({
        id: 'test',
        value: 'initial',
        rules: [],
      })

      field.value = 'changed'
      expect(field.isPristine.value).toBe(false)

      field.reset()
      expect(field.isPristine.value).toBe(true)
      expect(field.value).toBe('initial')
    })

    it('should be pristine when value is changed back to initial', () => {
      const form = createForm()
      const field = form.register({
        id: 'test',
        value: 'initial',
        rules: [],
      })

      field.value = 'changed'
      expect(field.isPristine.value).toBe(false)

      field.value = 'initial'
      expect(field.isPristine.value).toBe(true)
    })
  })

  describe('generation counter race', () => {
    it('should only write state from the latest validation', async () => {
      const form = createForm()
      let callCount = 0
      async function slowRule (v: unknown) {
        const call = ++callCount
        await new Promise(resolve => setTimeout(resolve, call === 1 ? 100 : 10))
        return (v as string).length > 3 || `Error from call ${call}`
      }

      const field = form.register({
        id: 'test',
        value: 'ab',
        rules: [slowRule],
      })

      const first = field.validate()
      const second = field.validate()

      await Promise.all([first, second])

      expect(field.errors.value).toEqual(['Error from call 2'])
    })
  })

  describe('reset during async validation', () => {
    it('should discard in-flight result after reset', async () => {
      const form = createForm()
      let resolve: () => void
      async function asyncRule (_v: unknown) {
        await new Promise<void>(r => {
          resolve = r
        })
        return 'Error'
      }

      const field = form.register({
        id: 'test',
        value: 'test',
        rules: [asyncRule],
      })

      const validatePromise = field.validate()
      await nextTick()
      expect(field.isValidating.value).toBe(true)

      field.reset()
      expect(field.isValidating.value).toBe(false)
      expect(field.isValid.value).toBe(null)
      expect(field.errors.value).toEqual([])

      resolve!()
      await validatePromise

      expect(field.isValid.value).toBe(null)
      expect(field.errors.value).toEqual([])
      expect(field.isValidating.value).toBe(false)
    })
  })

  describe('value defaults', () => {
    it('should default undefined value to empty string', () => {
      const form = createForm()
      const field = form.register({
        id: 'test',
        value: undefined,
      })

      expect(field.value).toBe('')
    })

    it('should default null value to empty string', () => {
      const form = createForm()
      const field = form.register({
        id: 'test',
        value: null,
      })

      expect(field.value).toBe('')
    })
  })
})

describe('createFormContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return a trinity tuple', () => {
    const result = createFormContext()

    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(3)
    expect(typeof result[0]).toBe('function')
    expect(typeof result[1]).toBe('function')
    expect(result[2]).toBeDefined()
  })

  it('should create context with default namespace', () => {
    const [, provideFormContext, context] = createFormContext()

    provideFormContext(context)

    expect(mockProvide).toHaveBeenCalledWith('v0:form', context)
  })

  it('should create context with custom namespace', () => {
    const [, provideFormContext, context] = createFormContext({
      namespace: 'my-form',
    })

    provideFormContext(context)

    expect(mockProvide).toHaveBeenCalledWith('my-form', context)
  })

  it('should create a default form context', () => {
    const [,, context] = createFormContext()

    expect(context).toBeDefined()
    expect(typeof context.submit).toBe('function')
  })

  it('should allow providing custom context', () => {
    const [, provideFormContext] = createFormContext()
    const customContext = createForm()

    provideFormContext(customContext)

    expect(mockProvide).toHaveBeenCalledWith('v0:form', customContext)
  })

  it('should provide context at app level when app is passed', () => {
    const mockApp = {
      provide: vi.fn(),
    } as any
    const [, provideFormContext, context] = createFormContext()

    provideFormContext(context, mockApp)

    expect(mockApp.provide).toHaveBeenCalledWith('v0:form', context)
  })
})

describe('useForm consumer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should inject context with default namespace', () => {
    const mockContext = createForm()
    mockInject.mockReturnValue(mockContext)

    const result = useForm()

    expect(mockInject).toHaveBeenCalledWith('v0:form', undefined)
    expect(result).toBe(mockContext)
  })

  it('should inject context with custom namespace', () => {
    const mockContext = createForm()
    mockInject.mockReturnValue(mockContext)

    const result = useForm('my-form')

    expect(mockInject).toHaveBeenCalledWith('my-form', undefined)
    expect(result).toBe(mockContext)
  })

  it('should throw when context is not provided', () => {
    mockInject.mockReturnValue(undefined)

    expect(() => useForm()).toThrow(
      'Context "v0:form" not found. Ensure it\'s provided by an ancestor.',
    )
  })
})
