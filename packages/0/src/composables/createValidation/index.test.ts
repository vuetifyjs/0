import { describe, expect, it, vi } from 'vitest'

// Composables
import { createForm, useForm } from '#v0/composables/createForm'
import { createRules, useRules } from '#v0/composables/useRules'

import { createValidation } from './index'

// Utilities
import { effectScope, nextTick, shallowRef } from 'vue'

vi.mock('#v0/composables/useRules', async () => {
  const actual = await vi.importActual('#v0/composables/useRules')
  return {
    ...actual,
    useRules: vi.fn(() => (actual as any).createRulesFallback()),
  }
})

vi.mock('#v0/composables/createForm', async () => {
  const actual = await vi.importActual('#v0/composables/createForm')
  return {
    ...actual,
    useForm: vi.fn(() => undefined),
  }
})

const mockUseRules = vi.mocked(useRules)
const mockUseForm = vi.mocked(useForm)

interface RuleCall {
  value: unknown
  resolve: (result: boolean | string) => void
}

function createRule () {
  const calls: RuleCall[] = []

  function rule (value: unknown): Promise<boolean | string> {
    return new Promise(resolve => {
      calls.push({ value, resolve })
    })
  }

  return { calls, rule }
}

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
      using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const validation = createValidation()
      validation.register('nonexistent')

      const result = await validation.validate('')
      // Noop rule returns true, so validation passes
      expect(result).toBe(true)
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('nonexistent'))
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

    it('should not mutate state in silent mode when no rules', async () => {
      const validation = createValidation({})
      validation.errors.value = ['existing']
      validation.isValid.value = false

      const result = await validation.validate('test', true)

      expect(result).toBe(true)
      // Silent mode preserves prior state
      expect(validation.errors.value).toEqual(['existing'])
      expect(validation.isValid.value).toBe(false)
    })

    it('should not mutate state in silent mode when rules throw', async () => {
      const validation = createValidation({
        rules: [() => {
          throw new Error('boom')
        }],
      })
      validation.isValid.value = true

      const result = await validation.validate('test', true)

      expect(result).toBe(false)
      // Silent mode preserves prior state on throw
      expect(validation.isValid.value).toBe(true)
    })

    it('should surface non-Error throws as generic message', async () => {
      const validation = createValidation({
        rules: [() => {
          // Throw a non-Error to hit the ternary's right-hand path

          throw 'plain string'
        }],
      })

      const result = await validation.validate('test')

      expect(result).toBe(false)
      expect(validation.errors.value).toEqual(['Validation error'])
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

    // Regression: stale callers must not read `isValid.value` because that can
    // leak unrelated state. They now wait for the latest generation's result.
    it('should return the latest result from a stale call when the newer call passed', async () => {
      const { calls, rule } = createRule()
      const validation = createValidation({ rules: [rule] })

      const first = validation.validate('ab')
      const second = validation.validate('ab')

      calls[1]!.resolve(true)
      const secondResult = await second

      calls[0]!.resolve('Error from call 1')
      const firstResult = await first

      expect(secondResult).toBe(true)
      expect(firstResult).toBe(true)
      expect(validation.isValid.value).toBe(true)
      expect(validation.errors.value).toEqual([])
    })

    it('should return false from stale and winning calls when the newer call failed', async () => {
      const { calls, rule } = createRule()
      const validation = createValidation({ rules: [rule] })

      const first = validation.validate('ab')
      const second = validation.validate('ab')

      calls[1]!.resolve('Error from call 2')
      const secondResult = await second

      calls[0]!.resolve(true)
      const firstResult = await first

      expect(secondResult).toBe(false)
      expect(firstResult).toBe(false)
      expect(validation.isValid.value).toBe(false)
      expect(validation.errors.value).toEqual(['Error from call 2'])
    })

    it('should follow a superseded middle validation to the latest result', async () => {
      const { calls, rule } = createRule()
      const validation = createValidation({ rules: [rule] })

      const first = validation.validate('ab')
      const second = validation.validate('ab')

      calls[0]!.resolve('Error from call 1')
      await Promise.resolve()

      const third = validation.validate('ab')

      calls[2]!.resolve(true)
      const thirdResult = await third

      calls[1]!.resolve('Error from call 2')
      const [firstResult, secondResult] = await Promise.all([first, second])

      expect(thirdResult).toBe(true)
      expect(secondResult).toBe(true)
      expect(firstResult).toBe(true)
      expect(validation.isValid.value).toBe(true)
      expect(validation.errors.value).toEqual([])
    })

    it('should follow the winner when a stale call\'s rules throw', async () => {
      let reject: (error: Error) => void
      let calls = 0
      async function rule (_v: unknown) {
        calls++
        if (calls === 1) {
          return new Promise<boolean>((_, r) => {
            reject = r
          })
        }
        return true
      }

      const validation = createValidation({ rules: [rule] })

      const stale = validation.validate('first')
      const winner = validation.validate('second')

      reject!(new Error('boom'))

      expect(await winner).toBe(true)
      // The stale call's rejection routes through the catch-path reroute and
      // resolves to the winning generation's outcome.
      expect(await stale).toBe(true)
      expect(validation.isValid.value).toBe(true)
      expect(validation.errors.value).toEqual([])
    })

    it('should re-await when the winner it followed was itself superseded', async () => {
      const gates: Array<(v: boolean) => void> = []
      async function rule (_v: unknown) {
        return new Promise<boolean>(resolve => {
          gates.push(resolve)
        })
      }

      const validation = createValidation({ rules: [rule] })

      const first = validation.validate('a')
      const second = validation.validate('b')

      // Let the first call settle its rules and start following the second.
      gates[0](true)
      await new Promise(resolve => setTimeout(resolve, 0))

      const third = validation.validate('c')
      gates[1](true)
      gates[2](true)

      expect(await third).toBe(true)
      // The second call defers to the third; the first call awaited the
      // second, found it superseded, and re-awaited the third.
      expect(await second).toBe(true)
      expect(await first).toBe(true)
      expect(validation.isValid.value).toBe(true)
    })

    it('should not let an in-flight validate overwrite state set by a later no-rules call', async () => {
      let resolveSlow: ((val: string | boolean) => void) | undefined
      function slowRule (_v: unknown) {
        return new Promise<string | boolean>(r => {
          resolveSlow = r
        })
      }

      const validation = createValidation()
      const ticket = validation.register(slowRule)

      // Step 1: kick off a validate that will be slow to resolve.
      const slow = validation.validate('test')

      // Step 2: unselect the rule so a subsequent validate sees no active rules.
      ticket.unselect()

      // Step 3: a fresh validate with no active rules should land at isValid=true
      // and that state should NOT be overwritten when (1) finally resolves.
      const fast = await validation.validate('test')
      expect(fast).toBe(true)
      expect(validation.isValid.value).toBe(true)

      // Step 4: resolve the original slow rule with a failure. Without
      // generation invalidation in the empty-rules path, this would reach the
      // `gen === generation` branch and overwrite isValid back to false.
      resolveSlow!('failed')
      await slow

      expect(validation.isValid.value).toBe(true)
      expect(validation.errors.value).toEqual([])
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
      using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const validation = createValidation({ rules: ['required'] })

      // String alias without context uses noop — no rules to fail
      const result = await validation.validate('')
      expect(result).toBe(true)
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('required'))
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

  describe('form auto-registration', () => {
    it('should register with parent form on creation', () => {
      const form = createForm()
      using spy = vi.spyOn(form, 'register')
      mockUseForm.mockReturnValueOnce(form as any)

      const validation = createValidation()

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith({ value: validation })
    })

    it('should unregister from parent form on scope dispose', () => {
      const form = createForm()
      using unregisterSpy = vi.spyOn(form, 'unregister')
      mockUseForm.mockReturnValueOnce(form as any)

      const scope = effectScope()
      scope.run(() => {
        createValidation()
      })

      expect(form.size).toBe(1)
      scope.stop()

      expect(unregisterSpy).toHaveBeenCalledTimes(1)
      expect(form.size).toBe(0)
    })

    it('should not throw on dispose when no form was provided', () => {
      mockUseForm.mockReturnValueOnce(undefined as any)

      const scope = effectScope()
      scope.run(() => {
        createValidation()
      })

      expect(() => scope.stop()).not.toThrow()
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
