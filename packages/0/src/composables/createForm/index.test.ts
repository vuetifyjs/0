import { beforeEach, describe, expect, it, vi } from 'vitest'

// Composables
import { createValidation } from '#v0/composables/createValidation'

import { createForm, createFormContext, useForm } from './index'

// Utilities
import { inject, nextTick, provide, shallowRef, toValue } from 'vue'

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    provide: vi.fn(),
    inject: vi.fn(),
    hasInjectionContext: vi.fn(() => true),
  }
})

const mockProvide = vi.mocked(provide)
const mockInject = vi.mocked(inject)

describe('createForm', () => {
  it('should register a validation context', () => {
    const form = createForm()
    const validation = createValidation({ rules: [v => !!v || 'Required'] })

    const ticket = form.register({ value: validation })

    expect(form.size).toBe(1)
    expect(ticket.value).toBe(validation)
  })

  it('should unregister a validation context', () => {
    const form = createForm()
    const validation = createValidation()

    const ticket = form.register({ value: validation })
    expect(form.size).toBe(1)

    form.unregister(ticket.id)
    expect(form.size).toBe(0)
  })

  it('should have disabled and readonly options', () => {
    const form = createForm({ disabled: true, readonly: true })

    expect(toValue(form.disabled)).toBe(true)
    expect(toValue(form.readonly)).toBe(true)
  })

  it('should default disabled and readonly to false', () => {
    const form = createForm()

    expect(toValue(form.disabled)).toBe(false)
    expect(toValue(form.readonly)).toBe(false)
  })

  describe('isValid computation', () => {
    it('should return null when no validations are registered', () => {
      const form = createForm()
      expect(form.isValid.value).toBe(null)
    })

    it('should return null when validations have not been validated', () => {
      const form = createForm()
      const validation = createValidation({ rules: [v => !!v || 'Required'] })
      form.register({ value: validation })

      expect(form.isValid.value).toBe(null)
    })

    it('should return true when all validations are valid', async () => {
      const form = createForm()

      const v1 = createValidation({ rules: [v => (v as string).length > 0 || 'Required'] })
      form.register({ value: v1 })

      const v2 = createValidation({ rules: [v => (v as string).length > 3 || 'Min 3'] })
      form.register({ value: v2 })

      await v1.validate('valid')
      await v2.validate('also valid')

      expect(form.isValid.value).toBe(true)
    })

    it('should return false when any validation is invalid', async () => {
      const form = createForm()

      const v1 = createValidation({ rules: [v => (v as string).length > 0 || 'Required'] })
      form.register({ value: v1 })

      const v2 = createValidation({ rules: [v => (v as string).length > 0 || 'Required'] })
      form.register({ value: v2 })

      await v1.validate('valid')
      await v2.validate('')

      expect(form.isValid.value).toBe(false)
    })

    it('should return null when some validations are unvalidated', async () => {
      const form = createForm()

      const v1 = createValidation({ rules: [v => !!v || 'Required'] })
      form.register({ value: v1 })

      const v2 = createValidation({ rules: [v => !!v || 'Required'] })
      form.register({ value: v2 })

      await v1.validate('valid')

      expect(form.isValid.value).toBe(null)
    })
  })

  describe('submit', () => {
    it('should validate all validations', async () => {
      const form = createForm()
      const rule = vi.fn().mockResolvedValue('Error')
      const val = shallowRef('test')

      const v1 = createValidation({ value: val, rules: [rule] })
      form.register({ value: v1 })

      await form.submit()

      expect(rule).toHaveBeenCalledWith('test')
    })

    it('should return false when any validation fails', async () => {
      const form = createForm()
      const val = shallowRef('')

      const v1 = createValidation({ value: val, rules: [v => !!v || 'Required'] })
      form.register({ value: v1 })

      const result = await form.submit()
      expect(result).toBe(false)
    })

    it('should return true when all validations pass', async () => {
      const form = createForm()
      const val = shallowRef('valid')

      const v1 = createValidation({ value: val, rules: [v => !!v || 'Required'] })
      form.register({ value: v1 })

      const result = await form.submit()
      expect(result).toBe(true)
    })

    it('should compute isValidating during submit', async () => {
      const form = createForm()
      const rule = vi.fn().mockResolvedValue(true)
      const val = shallowRef('test')

      const v1 = createValidation({ value: val, rules: [rule] })
      form.register({ value: v1 })

      const promise = form.submit()
      await nextTick()
      expect(form.isValidating.value).toBe(true)

      await promise
      expect(form.isValidating.value).toBe(false)
    })
  })

  describe('targeted submit', () => {
    it('should validate only targeted validation by id', async () => {
      const form = createForm()
      const val1 = shallowRef('')
      const val2 = shallowRef('')

      const v1 = createValidation({ value: val1, rules: [() => 'Error'] })
      const v2 = createValidation({ value: val2, rules: [() => 'Error'] })
      form.register({ id: 'v1', value: v1 })
      form.register({ id: 'v2', value: v2 })

      const result = await form.submit('v1')
      expect(result).toBe(false)
      // v2 should not have been validated
      expect(v2.isValid.value).toBe(null)
    })

    it('should return true when submitting unknown id', async () => {
      const form = createForm()
      const result = await form.submit('nonexistent')
      expect(result).toBe(true)
    })
  })

  describe('reset', () => {
    it('should reset all validations', async () => {
      const form = createForm()
      const val = shallowRef('')

      const v1 = createValidation({ value: val, rules: [v => !!v || 'Required'] })
      form.register({ value: v1 })

      await v1.validate('')
      expect(v1.isValid.value).toBe(false)
      expect(v1.errors.value).toEqual(['Required'])

      form.reset()

      expect(v1.isValid.value).toBe(null)
      expect(v1.errors.value).toEqual([])
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
    const [, provideFormContext, context] = createFormContext({ namespace: 'test:my-form' })
    provideFormContext(context)

    expect(mockProvide).toHaveBeenCalledWith('test:my-form', context)
  })

  it('should create a default form context', () => {
    const [,, context] = createFormContext()

    expect(typeof context.submit).toBe('function')
    expect(typeof context.reset).toBe('function')
  })

  it('should provide context at app level when app is passed', () => {
    const mockApp = { provide: vi.fn() } as any
    const [, provideFormContext, context] = createFormContext()
    provideFormContext(context, mockApp)

    expect(mockApp.provide).toHaveBeenCalledWith('v0:form', context)
  })
})

describe('useForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return form context when provided', () => {
    const mockContext = createForm()
    mockInject.mockReturnValue(mockContext)

    const result = useForm()

    expect(result).toBe(mockContext)
  })

  it('should return undefined when no context is provided', () => {
    mockInject.mockImplementation(() => {
      throw new Error('not found')
    })

    const result = useForm()

    expect(result).toBeUndefined()
  })
})
