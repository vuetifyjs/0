import { beforeEach, describe, expect, it, vi } from 'vitest'

// Composables
import { createValidation } from '#v0/composables/createValidation'

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

describe('createForm', () => {
  it('should register a validation context', () => {
    const form = createForm()
    const validation = createValidation()
    validation.register({ id: 'email', value: '', rules: [v => !!v || 'Required'] })

    const ticket = form.register({ value: validation })

    expect(form.size).toBe(1)
    expect(ticket.value).toBe(validation)
  })

  it('should unregister a validation context', () => {
    const form = createForm()
    const validation = createValidation()
    validation.register({ id: 'email', value: '' })

    const ticket = form.register({ value: validation })
    expect(form.size).toBe(1)

    form.unregister(ticket.id)
    expect(form.size).toBe(0)
  })

  it('should have disabled and readonly refs', () => {
    const form = createForm({ disabled: true, readonly: true })

    expect(form.disabled.value).toBe(true)
    expect(form.readonly.value).toBe(true)
  })

  it('should default disabled and readonly to false', () => {
    const form = createForm()

    expect(form.disabled.value).toBe(false)
    expect(form.readonly.value).toBe(false)
  })

  describe('isValid computation', () => {
    it('should return null when no validations are registered', () => {
      const form = createForm()
      expect(form.isValid.value).toBe(null)
    })

    it('should return null when validations have not been validated', () => {
      const form = createForm()
      const validation = createValidation()
      validation.register({ id: 'f1', value: 'test', rules: [v => !!v || 'Required'] })
      form.register({ value: validation })

      expect(form.isValid.value).toBe(null)
    })

    it('should return true when all validations are valid', async () => {
      const form = createForm()

      const v1 = createValidation()
      const f1 = v1.register({ id: 'f1', value: 'valid', rules: [v => (v as string).length > 0 || 'Required'] })
      form.register({ value: v1 })

      const v2 = createValidation()
      const f2 = v2.register({ id: 'f2', value: 'also valid', rules: [v => (v as string).length > 3 || 'Min 3'] })
      form.register({ value: v2 })

      await f1.validate()
      await f2.validate()

      expect(form.isValid.value).toBe(true)
    })

    it('should return false when any validation is invalid', async () => {
      const form = createForm()

      const v1 = createValidation()
      const f1 = v1.register({ id: 'f1', value: 'valid', rules: [v => (v as string).length > 0 || 'Required'] })
      form.register({ value: v1 })

      const v2 = createValidation()
      const f2 = v2.register({ id: 'f2', value: '', rules: [v => (v as string).length > 0 || 'Required'] })
      form.register({ value: v2 })

      await f1.validate()
      await f2.validate()

      expect(form.isValid.value).toBe(false)
    })

    it('should return null when some validations are unvalidated', async () => {
      const form = createForm()

      const v1 = createValidation()
      const f1 = v1.register({ id: 'f1', value: 'valid', rules: [v => !!v || 'Required'] })
      form.register({ value: v1 })

      const v2 = createValidation()
      v2.register({ id: 'f2', value: 'test', rules: [v => !!v || 'Required'] })
      form.register({ value: v2 })

      await f1.validate()

      expect(form.isValid.value).toBe(null)
    })
  })

  describe('submit', () => {
    it('should validate all fields across all validations', async () => {
      const form = createForm()
      const rule = vi.fn().mockResolvedValue('Error')

      const v1 = createValidation()
      v1.register({ id: 'f1', value: 'test', rules: [rule] })
      form.register({ value: v1 })

      await form.submit()

      expect(rule).toHaveBeenCalledWith('test')
    })

    it('should return false when any field fails validation', async () => {
      const form = createForm()

      const v1 = createValidation()
      v1.register({ id: 'f1', value: '', rules: [v => !!v || 'Required'] })
      form.register({ value: v1 })

      const result = await form.submit()
      expect(result).toBe(false)
    })

    it('should return true when all fields pass', async () => {
      const form = createForm()

      const v1 = createValidation()
      v1.register({ id: 'f1', value: 'valid', rules: [v => !!v || 'Required'] })
      form.register({ value: v1 })

      const result = await form.submit()
      expect(result).toBe(true)
    })

    it('should compute isValidating during submit', async () => {
      const form = createForm()
      const rule = vi.fn().mockResolvedValue(true)

      const v1 = createValidation()
      v1.register({ id: 'f1', value: 'test', rules: [rule] })
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
      const v1 = createValidation()
      v1.register({ id: 'f1', value: '', rules: [() => 'Error'] })
      const v2 = createValidation()
      v2.register({ id: 'f2', value: '', rules: [() => 'Error'] })
      form.register({ id: 'v1', value: v1 })
      form.register({ id: 'v2', value: v2 })

      const result = await form.submit('v1')
      expect(result).toBe(false)
      // v2's fields should not have been validated
      expect([...v2.values()][0]!.isValid.value).toBe(null)
    })

    it('should return true when submitting unknown id', async () => {
      const form = createForm()
      const result = await form.submit('nonexistent')
      expect(result).toBe(true)
    })
  })

  describe('reset', () => {
    it('should reset all fields across all validations', async () => {
      const form = createForm()

      const v1 = createValidation()
      const f1 = v1.register({ id: 'f1', value: 'initial', rules: [v => !!v || 'Required'] })
      form.register({ value: v1 })

      f1.value = 'changed'
      await f1.validate()

      form.reset()

      expect(f1.value).toBe('initial')
      expect(f1.isPristine.value).toBe(true)
      expect(f1.isValid.value).toBe(null)
      expect(f1.errors.value).toEqual([])
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
    const [, provideFormContext, context] = createFormContext({ namespace: 'my-form' })
    provideFormContext(context)

    expect(mockProvide).toHaveBeenCalledWith('my-form', context)
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
