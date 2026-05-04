import { describe, expect, it, vi } from 'vitest'

// Composables
import { createRules, useRules } from '#v0/composables/useRules'

import { createValidation } from './index'

// Utilities
import { nextTick, shallowRef } from 'vue'

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
    it('should register a function rule', () => {
      const validation = createValidation()
      function rule (v: unknown) {
        return !!v || 'Required'
      }
      const ticket = validation.register(rule)

      expect(ticket.id).toBeDefined()
      expect(typeof ticket.value).toBe('function')
      expect(validation.size).toBe(1)
    })

    it('should register via options with initial rules', () => {
      const validation = createValidation({
        rules: [
          v => !!v || 'Required',
          v => (v as string).length > 3 || 'Too short',
        ],
      })

      expect(validation.size).toBe(2)
    })

    it('should register via object form', () => {
      function rule (v: unknown) {
        return !!v || 'Required'
      }
      const validation = createValidation()
      const ticket = validation.register({ value: rule, disabled: true })

      expect(ticket.disabled).toBe(true)
      expect(validation.size).toBe(1)
    })

    it('should use noop for unresolvable string aliases', async () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const validation = createValidation()
      validation.register('nonexistent')

      const result = await validation.validate('')
      // Noop rule returns true, so validation passes
      expect(result).toBe(true)
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('nonexistent'))

      spy.mockRestore()
    })
  })

  describe('rule selection', () => {
    it('should enroll rules by default', () => {
      const validation = createValidation({
        rules: [v => !!v || 'Required'],
      })

      expect(validation.selectedIds.size).toBe(1)
    })

    it('should allow disabling enroll', () => {
      const validation = createValidation({
        enroll: false,
        rules: [v => !!v || 'Required'],
      })

      expect(validation.selectedIds.size).toBe(0)
    })

    it('should disable rules via unselect', async () => {
      const validation = createValidation({
        rules: [v => !!v || 'Required'],
      })

      const [rule] = [...validation.values()]
      rule!.unselect()

      const result = await validation.validate('')
      // Rule is disabled, so validation passes
      expect(result).toBe(true)
      expect(validation.errors.value).toEqual([])
    })

    it('should re-enable rules via select', async () => {
      const validation = createValidation({
        rules: [v => !!v || 'Required'],
      })

      const [rule] = [...validation.values()]
      rule!.unselect()
      rule!.select()

      const result = await validation.validate('')
      expect(result).toBe(false)
      expect(validation.errors.value).toEqual(['Required'])
    })

    it('should only run selected rules during validation', async () => {
      const rule1 = vi.fn().mockReturnValue(true)
      const rule2 = vi.fn().mockReturnValue(true)

      const validation = createValidation({ rules: [rule1, rule2] })

      const tickets = [...validation.values()]
      tickets[1]!.unselect()

      await validation.validate('test')

      expect(rule1).toHaveBeenCalledWith('test')
      expect(rule2).not.toHaveBeenCalled()
    })
  })

  describe('validate', () => {
    it('should validate with sync rules', async () => {
      const validation = createValidation({
        rules: [v => (v as string).length > 0 || 'Required'],
      })

      const result = await validation.validate('')

      expect(result).toBe(false)
      expect(validation.errors.value).toEqual(['Required'])
      expect(validation.isValid.value).toBe(false)
    })

    it('should validate with async rules', async () => {
      const mockRule = vi.fn().mockResolvedValue('Error message')
      const validation = createValidation({ rules: [mockRule] })

      await validation.validate('test-value')

      expect(mockRule).toHaveBeenCalledWith('test-value')
      expect(validation.errors.value).toEqual(['Error message'])
    })

    it('should return true when all rules pass', async () => {
      const validation = createValidation({
        rules: [v => (v as string).length > 0 || 'Required'],
      })

      const result = await validation.validate('hello')

      expect(result).toBe(true)
      expect(validation.errors.value).toEqual([])
      expect(validation.isValid.value).toBe(true)
    })

    it('should return true when no rules are registered', async () => {
      const validation = createValidation()

      const result = await validation.validate('hello')

      expect(result).toBe(true)
      expect(validation.isValid.value).toBe(true)
    })

    it('should use stored value source when no value passed', async () => {
      const value = shallowRef('')
      const validation = createValidation({
        value,
        rules: [v => (v as string).length > 0 || 'Required'],
      })

      const result = await validation.validate()

      expect(result).toBe(false)
      expect(validation.errors.value).toEqual(['Required'])

      value.value = 'hello'
      const result2 = await validation.validate()

      expect(result2).toBe(true)
      expect(validation.errors.value).toEqual([])
    })

    it('should use explicit value when passed', async () => {
      const value = shallowRef('stored')
      const validation = createValidation({
        value,
        rules: [v => (v as string).length > 0 || 'Required'],
      })

      const result = await validation.validate('')

      expect(result).toBe(false)
      expect(validation.errors.value).toEqual(['Required'])
    })

    it('should support silent mode', async () => {
      const validation = createValidation({
        rules: [v => (v as string).length > 0 || 'Required'],
      })

      const result = await validation.validate('', true)

      expect(result).toBe(false)
      // Silent mode should not update state
      expect(validation.errors.value).toEqual([])
      expect(validation.isValid.value).toBe(null)
    })

    it('should not set isValidating during silent async validation', async () => {
      const validation = createValidation({
        rules: [async v => (v as string).length > 0 || 'Required'],
      })

      const promise = validation.validate('', true)
      expect(validation.isValidating.value).toBe(false)
      await promise
      expect(validation.isValidating.value).toBe(false)
    })

    it('should catch throwing rules and surface error message', async () => {
      const validation = createValidation({
        rules: [() => {
          throw new Error('Network failure')
        }],
      })

      const result = await validation.validate('test')

      expect(result).toBe(false)
      expect(validation.errors.value).toEqual(['Network failure'])
      expect(validation.isValid.value).toBe(false)
      expect(validation.isValidating.value).toBe(false)
    })
  })

  describe('reset', () => {
    it('should clear errors and validation state', async () => {
      const validation = createValidation({
        rules: [v => (v as string).length > 0 || 'Required'],
      })

      await validation.validate('')
      expect(validation.isValid.value).toBe(false)
      expect(validation.errors.value).toEqual(['Required'])

      validation.reset()

      expect(validation.isValid.value).toBe(null)
      expect(validation.errors.value).toEqual([])
      expect(validation.isValidating.value).toBe(false)
    })

    it('should not affect rule selection', async () => {
      const validation = createValidation({
        rules: [v => !!v || 'Required'],
      })

      const [rule] = [...validation.values()]
      rule!.unselect()

      validation.reset()

      // Rule should still be unselected
      expect(validation.selectedIds.size).toBe(0)
    })
  })

  describe('generation counter race safety', () => {
    it('should only write state from the latest validation', async () => {
      let callCount = 0
      async function slowRule (v: unknown) {
        const call = ++callCount
        await new Promise(resolve => setTimeout(resolve, call === 1 ? 100 : 10))
        return (v as string).length > 3 || `Error from call ${call}`
      }

      const validation = createValidation({ rules: [slowRule] })

      const first = validation.validate('ab')
      const second = validation.validate('ab')

      await Promise.all([first, second])

      expect(validation.errors.value).toEqual(['Error from call 2'])
    })
  })

  describe('reset during async validation', () => {
    it('should discard in-flight result after reset', async () => {
      let resolve: () => void
      async function asyncRule (_v: unknown) {
        await new Promise<void>(r => {
          resolve = r
        })
        return 'Error'
      }

      const validation = createValidation({ rules: [asyncRule] })

      const validatePromise = validation.validate('test')
      await nextTick()
      expect(validation.isValidating.value).toBe(true)

      validation.reset()
      expect(validation.isValidating.value).toBe(false)
      expect(validation.isValid.value).toBe(null)
      expect(validation.errors.value).toEqual([])

      resolve!()
      await validatePromise

      expect(validation.isValid.value).toBe(null)
      expect(validation.errors.value).toEqual([])
      expect(validation.isValidating.value).toBe(false)
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
      const validation = createValidation({ rules: ['required'] })

      const result = await validation.validate('')
      expect(result).toBe(false)
      expect(validation.errors.value).toHaveLength(1)
    })

    it('should pass through functions without rules context', async () => {
      const validation = createValidation({
        rules: [v => (v as string).length > 0 || 'Required'],
      })

      const result = await validation.validate('')
      expect(result).toBe(false)
      expect(validation.errors.value).toEqual(['Required'])
    })

    it('should use noop for string aliases without rules context', async () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const validation = createValidation({ rules: ['required'] })

      // String alias without context uses noop — no rules to fail
      const result = await validation.validate('')
      expect(result).toBe(true)
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('required'))

      spy.mockRestore()
    })
  })

  describe('false rule result', () => {
    it('should map false rule result to fallback error', async () => {
      const validation = createValidation({ rules: [() => false] })

      await validation.validate('')
      expect(validation.isValid.value).toBe(false)
      expect(validation.errors.value).toEqual(['Validation failed'])
    })
  })

  describe('registry operations', () => {
    it('should track size', () => {
      const validation = createValidation({
        rules: [
          v => !!v || 'A',
          v => !!v || 'B',
        ],
      })

      expect(validation.size).toBe(2)
    })

    it('should support onboard for bulk registration', () => {
      const validation = createValidation()
      const tickets = validation.onboard([
        v => !!v || 'A',
        v => !!v || 'B',
      ])

      expect(tickets).toHaveLength(2)
      expect(validation.size).toBe(2)
    })

    it('should support dynamic rule addition', () => {
      const validation = createValidation({
        rules: [v => !!v || 'Required'],
      })

      expect(validation.size).toBe(1)

      validation.register(v => (v as string).length > 3 || 'Too short')

      expect(validation.size).toBe(2)
    })

    it('should support dynamic rule removal', async () => {
      const validation = createValidation({
        rules: [v => !!v || 'Required'],
      })

      const [rule] = [...validation.values()]
      validation.unregister(rule!.id)

      expect(validation.size).toBe(0)

      const result = await validation.validate('')
      expect(result).toBe(true)
    })
  })
})
