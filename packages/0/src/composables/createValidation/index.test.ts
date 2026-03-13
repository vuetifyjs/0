import { describe, expect, it, vi } from 'vitest'

// Composables
import { createRules, useRules } from '#v0/composables/useRules'

// Utilities
import { nextTick } from 'vue'

import { createValidation } from './index'

vi.mock('#v0/composables/useRules', async () => {
  const actual = await vi.importActual('#v0/composables/useRules')
  return {
    ...actual,
    useRules: vi.fn(() => (actual as any).createRulesFallback()),
  }
})

const mockUseRules = vi.mocked(useRules)

describe('createValidation', () => {
  describe('register', () => {
    it('should register a field with default values', () => {
      const validation = createValidation()
      const field = validation.register({
        id: 'test',
        value: 'hello',
      })

      expect(field.id).toBe('test')
      expect(field.value).toBe('hello')
      expect(field.disabled).toBe(false)
      expect(field.isPristine.value).toBe(true)
      expect(field.isValid.value).toBe(null)
      expect(field.isValidating.value).toBe(false)
      expect(field.errors.value).toEqual([])
      expect(typeof field.validate).toBe('function')
      expect(typeof field.reset).toBe('function')
    })

    it('should default undefined value to empty string', () => {
      const validation = createValidation()
      const field = validation.register({
        id: 'test',
        value: undefined,
      })

      expect(field.value).toBe('')
    })

    it('should default null value to empty string', () => {
      const validation = createValidation()
      const field = validation.register({
        id: 'test',
        value: null,
      })

      expect(field.value).toBe('')
    })

    it('should register disabled fields', () => {
      const validation = createValidation()
      const field = validation.register({
        id: 'test',
        value: 'test',
        disabled: true,
        rules: [],
      })

      expect(field.disabled).toBe(true)
    })
  })

  describe('validate', () => {
    it('should validate with sync rules', async () => {
      const validation = createValidation()
      const field = validation.register({
        id: 'test',
        value: '',
        rules: [v => (v as string).length > 0 || 'Required'],
      })

      const result = await field.validate()

      expect(result).toBe(false)
      expect(field.errors.value).toEqual(['Required'])
      expect(field.isValid.value).toBe(false)
    })

    it('should validate with async rules', async () => {
      const validation = createValidation()
      const mockRule = vi.fn().mockResolvedValue('Error message')
      const field = validation.register({
        id: 'test',
        rules: [mockRule],
        value: 'test-value',
      })

      await field.validate()

      expect(mockRule).toHaveBeenCalledWith('test-value')
      expect(field.errors.value).toEqual(['Error message'])
    })

    it('should return true when all rules pass', async () => {
      const validation = createValidation()
      const field = validation.register({
        id: 'test',
        value: 'hello',
        rules: [v => (v as string).length > 0 || 'Required'],
      })

      const result = await field.validate()

      expect(result).toBe(true)
      expect(field.errors.value).toEqual([])
      expect(field.isValid.value).toBe(true)
    })

    it('should return true when no rules are provided', async () => {
      const validation = createValidation()
      const field = validation.register({
        id: 'test',
        value: 'hello',
      })

      const result = await field.validate()

      expect(result).toBe(true)
      expect(field.isValid.value).toBe(true)
    })

    it('should support silent mode', async () => {
      const validation = createValidation()
      const field = validation.register({
        id: 'test',
        value: '',
        rules: [v => (v as string).length > 0 || 'Required'],
      })

      const result = await field.validate(true)

      expect(result).toBe(false)
      // Silent mode should not update state
      expect(field.errors.value).toEqual([])
      expect(field.isValid.value).toBe(null)
      expect(field.isPristine.value).toBe(true)
    })
  })

  describe('reset', () => {
    it('should reset value and state', async () => {
      const validation = createValidation()
      const field = validation.register({
        id: 'test',
        value: 'initial',
        rules: [v => (v as string).length > 0 || 'Required'],
      })

      field.value = 'changed'
      await field.validate()

      field.reset()

      expect(field.value).toBe('initial')
      expect(field.isPristine.value).toBe(true)
      expect(field.isValid.value).toBe(null)
      expect(field.errors.value).toEqual([])
      expect(field.isValidating.value).toBe(false)
    })
  })

  describe('isPristine tracking', () => {
    it('should be pristine initially', () => {
      const validation = createValidation()
      const field = validation.register({
        id: 'test',
        value: 'initial',
      })

      expect(field.isPristine.value).toBe(true)
    })

    it('should be non-pristine after value change', () => {
      const validation = createValidation()
      const field = validation.register({
        id: 'test',
        value: 'initial',
      })

      field.value = 'changed'

      expect(field.isPristine.value).toBe(false)
    })

    it('should be pristine again after reset', () => {
      const validation = createValidation()
      const field = validation.register({
        id: 'test',
        value: 'initial',
      })

      field.value = 'changed'
      expect(field.isPristine.value).toBe(false)

      field.reset()
      expect(field.isPristine.value).toBe(true)
      expect(field.value).toBe('initial')
    })

    it('should be pristine when value is changed back to initial', () => {
      const validation = createValidation()
      const field = validation.register({
        id: 'test',
        value: 'initial',
      })

      field.value = 'changed'
      expect(field.isPristine.value).toBe(false)

      field.value = 'initial'
      expect(field.isPristine.value).toBe(true)
    })
  })

  describe('value setter', () => {
    it('should update isPristine when value changes', () => {
      const validation = createValidation()
      const field = validation.register({
        id: 'test',
        value: 'initial',
        rules: [],
      })

      field.value = 'changed'
      expect(field.isPristine.value).toBe(false)

      field.value = 'initial'
      expect(field.isPristine.value).toBe(true)
    })

    it('should reset isValid to null when value changes', async () => {
      const validation = createValidation()
      const field = validation.register({
        id: 'test',
        value: 'valid',
        rules: [v => (v as string).length > 0 || 'Required'],
      })

      await field.validate()
      expect(field.isValid.value).toBe(true)

      field.value = ''
      expect(field.isValid.value).toBe(null)
    })

    it('should not auto-validate on value change', () => {
      const rule = vi.fn().mockReturnValue(true)
      const validation = createValidation()
      validation.register({
        id: 'test',
        value: 'initial',
        rules: [rule],
      })

      rule.mockClear()
      validation.get('test')!.value = 'changed'
      expect(rule).not.toHaveBeenCalled()
    })
  })

  describe('generation counter race safety', () => {
    it('should only write state from the latest validation', async () => {
      const validation = createValidation()
      let callCount = 0
      async function slowRule (v: unknown) {
        const call = ++callCount
        await new Promise(resolve => setTimeout(resolve, call === 1 ? 100 : 10))
        return (v as string).length > 3 || `Error from call ${call}`
      }

      const field = validation.register({
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
      const validation = createValidation()
      let resolve: () => void
      async function asyncRule (_v: unknown) {
        await new Promise<void>(r => {
          resolve = r
        })
        return 'Error'
      }

      const field = validation.register({
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

  describe('aggregate state', () => {
    it('should return null when no fields are registered', () => {
      const validation = createValidation()
      expect(validation.isValid.value).toBe(null)
    })

    it('should return null when fields have not been validated', () => {
      const validation = createValidation()
      validation.register({
        id: 'field1',
        value: 'test',
        rules: [v => (v as string).length > 0 || 'Required'],
      })

      expect(validation.isValid.value).toBe(null)
    })

    it('should return true when all fields are valid', async () => {
      const validation = createValidation()
      const field1 = validation.register({
        id: 'field1',
        value: 'valid',
        rules: [v => (v as string).length > 0 || 'Required'],
      })
      const field2 = validation.register({
        id: 'field2',
        value: 'also valid',
        rules: [v => (v as string).length > 3 || 'Min 3 chars'],
      })

      await field1.validate()
      await field2.validate()

      expect(validation.isValid.value).toBe(true)
    })

    it('should return false when any field is invalid', async () => {
      const validation = createValidation()
      const field1 = validation.register({
        id: 'field1',
        value: 'valid',
        rules: [v => (v as string).length > 0 || 'Required'],
      })
      const field2 = validation.register({
        id: 'field2',
        value: '',
        rules: [v => (v as string).length > 0 || 'Required'],
      })

      await field1.validate()
      await field2.validate()

      expect(validation.isValid.value).toBe(false)
    })

    it('should return null when some fields are validated and some are not', async () => {
      const validation = createValidation()
      const field1 = validation.register({
        id: 'field1',
        value: 'valid',
        rules: [v => (v as string).length > 0 || 'Required'],
      })
      validation.register({
        id: 'field2',
        value: 'not validated',
        rules: [v => (v as string).length > 0 || 'Required'],
      })

      await field1.validate()

      expect(validation.isValid.value).toBe(null)
    })

    it('should correctly compute isValidating', async () => {
      const validation = createValidation()
      const mockRule = vi.fn().mockResolvedValue(true)

      validation.register({
        id: 'test',
        rules: [mockRule],
        value: 'test-value',
      })

      expect(validation.isValidating.value).toBe(false)
    })

    it('should reset all fields', async () => {
      const validation = createValidation()
      const field1 = validation.register({
        id: 'field1',
        value: 'initial1',
        rules: [v => (v as string).length > 0 || 'Required'],
      })
      const field2 = validation.register({
        id: 'field2',
        value: 'initial2',
        rules: [v => (v as string).length > 0 || 'Required'],
      })

      field1.value = 'changed1'
      field2.value = 'changed2'
      await field1.validate()
      await field2.validate()

      // Reset each field individually
      field1.reset()
      field2.reset()

      expect(field1.value).toBe('initial1')
      expect(field2.value).toBe('initial2')
      expect(field1.isPristine.value).toBe(true)
      expect(field2.isPristine.value).toBe(true)
      expect(field1.isValid.value).toBe(null)
      expect(field2.isValid.value).toBe(null)
      expect(field1.errors.value).toEqual([])
      expect(field2.errors.value).toEqual([])
    })
  })

  describe('rules context integration', () => {
    it('should resolve aliases when rules context is provided', async () => {
      const rulesContext = createRules({
        aliases: {
          required: (v: unknown) => !!v || false,
        },
      })

      mockUseRules.mockReturnValueOnce(rulesContext)
      const validation = createValidation()
      const field = validation.register({
        id: 'test',
        value: '',
        rules: ['required'],
      })

      const result = await field.validate()
      expect(result).toBe(false)
      expect(field.errors.value).toHaveLength(1)
    })

    it('should pass through functions without rules context', async () => {
      const validation = createValidation()
      const field = validation.register({
        id: 'test',
        value: '',
        rules: [v => (v as string).length > 0 || 'Required'],
      })

      const result = await field.validate()
      expect(result).toBe(false)
      expect(field.errors.value).toEqual(['Required'])
    })

    it('should skip string aliases without rules context', async () => {
      const validation = createValidation()
      const field = validation.register({
        id: 'test',
        value: '',
        rules: ['required'],
      })

      // String alias without context is filtered out — no rules to run
      const result = await field.validate()
      expect(result).toBe(true)
    })
  })

  describe('false rule result', () => {
    it('should map false rule result to fallback error', async () => {
      const validation = createValidation()
      const field = validation.register({
        id: 'test', value: '', rules: [() => false],
      })
      await field.validate()
      expect(field.isValid.value).toBe(false)
      expect(field.errors.value).toEqual(['Validation failed'])
    })

    it('should return false when one field is invalid and another is unvalidated', async () => {
      const validation = createValidation()
      const f1 = validation.register({ id: 'f1', value: '', rules: [v => !!v || 'Required'] })
      validation.register({ id: 'f2', value: 'test', rules: [v => !!v || 'Required'] })
      await f1.validate()
      expect(validation.isValid.value).toBe(false)
    })
  })

  describe('registry operations', () => {
    it('should track size', () => {
      const validation = createValidation()

      validation.register({ id: 'a', value: 'a' })
      validation.register({ id: 'b', value: 'b' })

      expect(validation.size).toBe(2)
    })

    it('should get field by id', () => {
      const validation = createValidation()
      const field = validation.register({ id: 'test', value: 'v' })

      expect(validation.get('test')).toBe(field)
    })

    it('should support onboard for bulk registration', () => {
      const validation = createValidation()
      const fields = validation.onboard([
        { id: 'a', value: 'a' },
        { id: 'b', value: 'b' },
      ])

      expect(fields).toHaveLength(2)
      expect(validation.size).toBe(2)
    })
  })
})
