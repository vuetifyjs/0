import { describe, it, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { useValidation } from './index'

describe('useValidation', () => {
  describe('basic validation', () => {
    it('should successfully validate when no rules are provided', async () => {
      const validation = useValidation({
        value: 'test-value',
      })

      await validation.validate()

      expect(validation.isValid.value).toBe(true)
      expect(validation.errors.value).toEqual([])
    })

    it('should fail validation when a rule returns an error message', async () => {
      const validation = useValidation({
        value: 'test-value',
        rules: [
          value => value === 'valid-value' || 'Invalid value provided',
        ],
      })

      await validation.validate()

      expect(validation.isValid.value).toBe(false)
      expect(validation.errors.value).toEqual(['Invalid value provided'])
    })

    it('should pass validation when rule returns true', async () => {
      const validation = useValidation({
        value: 'valid',
        rules: [v => v.length > 0 || 'Required'],
      })

      await validation.validate()

      expect(validation.isValid.value).toBe(true)
      expect(validation.errors.value).toEqual([])
    })

    it('should collect all error messages from failing rules', async () => {
      const validation = useValidation({
        value: 'ab',
        rules: [
          v => v.length > 3 || 'Must be longer than 3 characters',
          v => v.length < 10 || 'Must be shorter than 10 characters',
          v => /^[a-z]+$/.test(v) || 'Must contain only lowercase letters',
        ],
      })

      await validation.validate()

      expect(validation.isValid.value).toBe(false)
      expect(validation.errors.value).toEqual(['Must be longer than 3 characters'])
    })

    it('should return true when all rules pass', async () => {
      const validation = useValidation({
        value: 'valid',
        rules: [
          v => v.length > 3 || 'Must be longer than 3 characters',
          v => v.length < 10 || 'Must be shorter than 10 characters',
          v => /^[a-z]+$/.test(v) || 'Must contain only lowercase letters',
        ],
      })

      await validation.validate()

      expect(validation.isValid.value).toBe(true)
      expect(validation.errors.value).toEqual([])
    })
  })

  describe('default values', () => {
    it('should default to submit validation only', () => {
      const validation = useValidation()
      expect(validation.validateOn).toBe('submit')
    })

    it('should default to empty string value', () => {
      const validation = useValidation()
      expect(validation.value).toBe('')
    })

    it('should default to enabled (disabled = false)', () => {
      const validation = useValidation()
      expect(validation.disabled).toBe(false)
    })

    it('should default to empty rules array', () => {
      const validation = useValidation()
      expect(validation.rules).toEqual([])
    })
  })

  describe('options', () => {
    it('should accept custom validateOn option', () => {
      const validation = useValidation({ validateOn: 'change' })
      expect(validation.validateOn).toBe('change')
    })

    it('should support multiple triggers', () => {
      const validation = useValidation({ validateOn: 'submit change' })
      expect(validation.validateOn).toBe('submit change')
    })

    it('should register disabled fields', () => {
      const validation = useValidation({
        value: 'test',
        disabled: true,
      })

      expect(validation.disabled).toBe(true)
    })
  })

  describe('isValid state', () => {
    it('should be null initially', () => {
      const validation = useValidation({
        value: 'test',
        rules: [v => v.length > 0 || 'Required'],
      })

      expect(validation.isValid.value).toBe(null)
    })

    it('should be true after successful validation', async () => {
      const validation = useValidation({
        value: 'valid',
        rules: [v => v.length > 0 || 'Required'],
      })

      await validation.validate()

      expect(validation.isValid.value).toBe(true)
    })

    it('should be false after failed validation', async () => {
      const validation = useValidation({
        value: '',
        rules: [v => v.length > 0 || 'Required'],
      })

      await validation.validate()

      expect(validation.isValid.value).toBe(false)
    })

    it('should reset to null after value change', async () => {
      const validation = useValidation({
        value: 'test',
        rules: [v => v.length > 0 || 'Required'],
      })

      await validation.validate()
      expect(validation.isValid.value).toBe(true)

      validation.value = 'changed'
      expect(validation.isValid.value).toBe(null)
    })
  })

  describe('isPristine tracking', () => {
    it('should be pristine initially', () => {
      const validation = useValidation({
        value: 'initial',
      })

      expect(validation.isPristine.value).toBe(true)
    })

    it('should be non-pristine after value change', () => {
      const validation = useValidation({
        value: 'initial',
      })

      validation.value = 'changed'

      expect(validation.isPristine.value).toBe(false)
    })

    it('should be pristine again after reset', () => {
      const validation = useValidation({
        value: 'initial',
      })

      validation.value = 'changed'
      expect(validation.isPristine.value).toBe(false)

      validation.reset()
      expect(validation.isPristine.value).toBe(true)
      expect(validation.value).toBe('initial')
    })

    it('should be pristine when value is changed back to initial', () => {
      const validation = useValidation({
        value: 'initial',
      })

      validation.value = 'changed'
      expect(validation.isPristine.value).toBe(false)

      validation.value = 'initial'
      expect(validation.isPristine.value).toBe(true)
    })
  })

  describe('reset', () => {
    it('should reset value to initial', () => {
      const validation = useValidation({
        value: 'initial',
      })

      validation.value = 'changed'
      validation.reset()

      expect(validation.value).toBe('initial')
    })

    it('should clear errors', async () => {
      const validation = useValidation({
        value: '',
        rules: [v => v.length > 0 || 'Required'],
      })

      await validation.validate()
      expect(validation.errors.value).toEqual(['Required'])

      validation.reset()
      expect(validation.errors.value).toEqual([])
    })

    it('should reset isValid to null', async () => {
      const validation = useValidation({
        value: 'valid',
        rules: [v => v.length > 0 || 'Required'],
      })

      await validation.validate()
      expect(validation.isValid.value).toBe(true)

      validation.reset()
      expect(validation.isValid.value).toBe(null)
    })

    it('should reset isPristine to true', () => {
      const validation = useValidation({
        value: 'initial',
      })

      validation.value = 'changed'
      expect(validation.isPristine.value).toBe(false)

      validation.reset()
      expect(validation.isPristine.value).toBe(true)
    })
  })

  describe('async validation', () => {
    it('should handle async validation rules', async () => {
      async function asyncRule (v: string) {
        await new Promise(resolve => setTimeout(resolve, 10))
        return v.length > 5 || 'Must be longer than 5 characters'
      }

      const validation = useValidation({
        value: 'short',
        rules: [asyncRule],
      })

      await validation.validate()

      expect(validation.isValid.value).toBe(false)
      expect(validation.errors.value).toEqual(['Must be longer than 5 characters'])
    })

    it('should handle mixed sync and async rules', async () => {
      function syncRule (v: string) {
        return v.length > 0 || 'Required'
      }
      async function asyncRule (v: string) {
        await new Promise(resolve => setTimeout(resolve, 10))
        return v.length > 5 || 'Must be longer than 5 characters'
      }

      const validation = useValidation({
        value: 'test',
        rules: [syncRule, asyncRule],
      })

      await validation.validate()

      expect(validation.isValid.value).toBe(false)
      expect(validation.errors.value).toEqual(['Must be longer than 5 characters'])
    })

    it('should track isValidating state during async validation', async () => {
      async function asyncRule (_v: string) {
        await new Promise(resolve => setTimeout(resolve, 50))
        return true as const
      }

      const validation = useValidation({
        value: 'test',
        rules: [asyncRule],
      })

      expect(validation.isValidating.value).toBe(false)

      const validatePromise = validation.validate()
      await nextTick()

      expect(validation.isValidating.value).toBe(true)

      await validatePromise

      expect(validation.isValidating.value).toBe(false)
    })
  })

  describe('silent validation', () => {
    it('should not update errors when silent is true', async () => {
      const validation = useValidation({
        value: '',
        rules: [v => v.length > 0 || 'Required'],
      })

      const result = await validation.validate(true)

      expect(result).toBe(false)
      expect(validation.errors.value).toEqual([])
      expect(validation.isValid.value).toBe(null)
    })

    it('should not update isValid when silent is true', async () => {
      const validation = useValidation({
        value: 'valid',
        rules: [v => v.length > 0 || 'Required'],
      })

      const result = await validation.validate(true)

      expect(result).toBe(true)
      expect(validation.errors.value).toEqual([])
      expect(validation.isValid.value).toBe(null)
    })

    it('should return correct result without modifying state', async () => {
      const validation = useValidation({
        value: 'short',
        rules: [v => v.length > 10 || 'Too short'],
      })

      // Silent check
      const silentResult = await validation.validate(true)
      expect(silentResult).toBe(false)
      expect(validation.errors.value).toEqual([])
      expect(validation.isValid.value).toBe(null)

      // Normal validation
      const normalResult = await validation.validate()
      expect(normalResult).toBe(false)
      expect(validation.errors.value).toEqual(['Too short'])
      expect(validation.isValid.value).toBe(false)
    })
  })

  describe('validateOn change mode', () => {
    it('should trigger validation on value change', async () => {
      const validation = useValidation({
        value: 'initial',
        validateOn: 'change',
        rules: [v => v.length > 10 || 'Must be longer than 10 characters'],
      })

      validation.value = 'short'
      // Wait for the async validation to complete
      await vi.waitFor(() => {
        expect(validation.isValid.value).toBe(false)
      })
      expect(validation.errors.value).toEqual(['Must be longer than 10 characters'])
    })

    it('should update validation on subsequent changes', async () => {
      const validation = useValidation({
        value: 'initial',
        validateOn: 'change',
        rules: [v => v.length > 10 || 'Must be longer than 10 characters'],
      })

      validation.value = 'short'
      await vi.waitFor(() => {
        expect(validation.isValid.value).toBe(false)
      })

      validation.value = 'long enough value'
      await vi.waitFor(() => {
        expect(validation.isValid.value).toBe(true)
      })
      expect(validation.errors.value).toEqual([])
    })

    it('should not validate on change when validateOn is submit', async () => {
      const mockRule = vi.fn().mockResolvedValue(true)

      const validation = useValidation({
        value: 'initial',
        validateOn: 'submit',
        rules: [mockRule],
      })

      validation.value = 'changed'
      await nextTick()

      expect(mockRule).not.toHaveBeenCalled()
    })
  })

  describe('combined validation modes', () => {
    it('should support space-separated triggers', () => {
      const validation = useValidation({ validateOn: 'submit change' })
      expect(validation.validateOn).toBe('submit change')
    })

    it('should validate on change when combined', async () => {
      const mockRule = vi.fn(v => v.length > 5 || 'Too short')

      const validation = useValidation({
        value: 'test',
        validateOn: 'submit change',
        rules: [mockRule],
      })

      // Should validate on change
      validation.value = 'new'
      await nextTick()
      expect(mockRule).toHaveBeenCalledWith('new')
    })

    it('should be case insensitive', async () => {
      const mockRule = vi.fn().mockResolvedValue(true)

      const validation = useValidation({
        value: 'initial',
        validateOn: 'CHANGE',
        rules: [mockRule],
      })

      validation.value = 'changed'
      await nextTick()

      expect(mockRule).toHaveBeenCalledWith('changed')
    })

    it('should support custom string triggers', () => {
      const validation = useValidation({ validateOn: 'blur focus custom' })
      expect(validation.validateOn).toBe('blur focus custom')
    })
  })

  describe('standalone usage', () => {
    it('should work independently without a form', async () => {
      const email = useValidation({
        value: 'user@example.com',
        rules: [
          v => v.length > 0 || 'Email is required',
          v => /@/.test(v) || 'Invalid email format',
        ],
        validateOn: 'change',
      })

      // Valid email
      expect(email.value).toBe('user@example.com')

      // Change to invalid
      email.value = 'invalid'
      await vi.waitFor(() => {
        expect(email.isValid.value).toBe(false)
      })
      expect(email.errors.value).toEqual(['Invalid email format'])

      // Change to valid
      email.value = 'valid@test.com'
      await vi.waitFor(() => {
        expect(email.isValid.value).toBe(true)
      })
      expect(email.errors.value).toEqual([])
    })

    it('should allow building custom validation composables', async () => {
      // Example of composing useValidation into a custom composable
      function useEmailValidation (initialValue = '') {
        const validation = useValidation({
          value: initialValue,
          rules: [
            v => v.length > 0 || 'Email is required',
            v => /@/.test(v) || 'Invalid email format',
          ],
          validateOn: 'change',
        })

        return {
          validation,
          isEmail: () => /@/.test(validation.value),
        }
      }

      const email = useEmailValidation('test@example.com')
      expect(email.isEmail()).toBe(true)
      expect(email.validation.value).toBe('test@example.com')

      email.validation.value = 'notanemail'
      await vi.waitFor(() => {
        expect(email.validation.isValid.value).toBe(false)
      })
      expect(email.isEmail()).toBe(false)
    })
  })
})
