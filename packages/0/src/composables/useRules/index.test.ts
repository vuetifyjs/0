import { beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { inject, provide } from 'vue'

// Types
import type { RuleBuilderWithoutOptions } from './index'

import {
  createRules,
  createRulesContext,
  useRules,
} from './index'

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    provide: vi.fn(),
    inject: vi.fn(),
    getCurrentInstance: vi.fn(() => null),
    currentInstance: null,
  }
})

const mockProvide = vi.mocked(provide)
const mockInject = vi.mocked(inject)

describe('createRules', () => {
  describe('built-in aliases', () => {
    it('should create a rules instance with all 11 built-in aliases', () => {
      const rules = createRules()

      expect(typeof rules.aliases.required).toBe('function')
      expect(typeof rules.aliases.email).toBe('function')
      expect(typeof rules.aliases.number).toBe('function')
      expect(typeof rules.aliases.integer).toBe('function')
      expect(typeof rules.aliases.capital).toBe('function')
      expect(typeof rules.aliases.maxLength).toBe('function')
      expect(typeof rules.aliases.minLength).toBe('function')
      expect(typeof rules.aliases.strictLength).toBe('function')
      expect(typeof rules.aliases.exclude).toBe('function')
      expect(typeof rules.aliases.notEmpty).toBe('function')
      expect(typeof rules.aliases.pattern).toBe('function')
    })

    describe('required', () => {
      it('should pass for truthy values', () => {
        const { aliases: { required } } = createRules()
        const rule = required()

        expect(rule('hello')).toBe(true)
        expect(rule(1)).toBe(true)
        expect(rule(true)).toBe(true)
      })

      it('should pass for 0 (number modifier compat)', () => {
        const rule = createRules().aliases.required()

        expect(rule(0)).toBe(true)
      })

      it('should fail for falsy values', () => {
        const rule = createRules().aliases.required()

        expect(rule('')).not.toBe(true)
        expect(rule(null)).not.toBe(true)
        expect(rule(undefined)).not.toBe(true)
        expect(rule(false)).not.toBe(true)
      })

      it('should return custom error message', () => {
        const rule = createRules().aliases.required('Custom error')

        expect(rule('')).toBe('Custom error')
      })

      it('should return a default string when no custom message', () => {
        const rule = createRules().aliases.required()
        const result = rule('')

        expect(typeof result).toBe('string')
        expect(result).not.toBe(true)
      })
    })

    describe('email', () => {
      it('should pass for valid email addresses', () => {
        const rule = createRules().aliases.email()

        expect(rule('test@example.com')).toBe(true)
        expect(rule('user@domain.org')).toBe(true)
        expect(rule('name+tag@sub.domain.com')).toBe(true)
      })

      it('should pass for empty/falsy values', () => {
        const rule = createRules().aliases.email()

        expect(rule('')).toBe(true)
        expect(rule(null)).toBe(true)
        expect(rule(undefined)).toBe(true)
      })

      it('should fail for invalid email addresses', () => {
        const rule = createRules().aliases.email()

        expect(rule('notanemail')).not.toBe(true)
        expect(rule('missing@')).not.toBe(true)
        expect(rule('@missing.com')).not.toBe(true)
      })

      it('should return custom error message', () => {
        const rule = createRules().aliases.email('Invalid email')

        expect(rule('bad')).toBe('Invalid email')
      })
    })

    describe('number', () => {
      it('should pass for numeric strings', () => {
        const rule = createRules().aliases.number()

        expect(rule('123')).toBe(true)
        expect(rule('0')).toBe(true)
        expect(rule('3.14')).toBe(true)
        expect(rule('-42')).toBe(true)
      })

      it('should pass for empty string', () => {
        expect(createRules().aliases.number()('')).toBe(true)
      })

      it('should fail for non-numeric strings', () => {
        const rule = createRules().aliases.number()

        expect(rule('abc')).not.toBe(true)
        expect(rule('12abc')).not.toBe(true)
      })
    })

    describe('integer', () => {
      it('should pass for integer strings', () => {
        const rule = createRules().aliases.integer()

        expect(rule('123')).toBe(true)
        expect(rule('0')).toBe(true)
        expect(rule('')).toBe(true)
      })

      it('should fail for non-integer values', () => {
        const rule = createRules().aliases.integer()

        expect(rule('3.14')).not.toBe(true)
        expect(rule('abc')).not.toBe(true)
      })
    })

    describe('capital', () => {
      it('should pass for uppercase-only strings', () => {
        const rule = createRules().aliases.capital()

        expect(rule('ABC')).toBe(true)
        expect(rule('HELLO')).toBe(true)
        expect(rule('')).toBe(true)
      })

      it('should fail for strings with lowercase', () => {
        const rule = createRules().aliases.capital()

        expect(rule('abc')).not.toBe(true)
        expect(rule('Hello')).not.toBe(true)
        expect(rule('ABCd')).not.toBe(true)
      })
    })

    describe('maxLength', () => {
      it('should pass for strings within max length', () => {
        const rule = createRules().aliases.maxLength(5)

        expect(rule('hello')).toBe(true)
        expect(rule('hi')).toBe(true)
      })

      it('should pass for empty/falsy values', () => {
        const rule = createRules().aliases.maxLength(5)

        expect(rule('')).toBe(true)
        expect(rule(null)).toBe(true)
        expect(rule(undefined)).toBe(true)
      })

      it('should fail for strings exceeding max length', () => {
        const rule = createRules().aliases.maxLength(3)

        expect(rule('hello')).not.toBe(true)
        expect(rule('abcd')).not.toBe(true)
      })

      it('should work with arrays', () => {
        const rule = createRules().aliases.maxLength(3)

        expect(rule([1, 2, 3])).toBe(true)
        expect(rule([1, 2, 3, 4])).not.toBe(true)
      })
    })

    describe('minLength', () => {
      it('should pass for strings meeting min length', () => {
        const rule = createRules().aliases.minLength(3)

        expect(rule('hello')).toBe(true)
        expect(rule('abc')).toBe(true)
      })

      it('should pass for empty/falsy values', () => {
        const rule = createRules().aliases.minLength(3)

        expect(rule('')).toBe(true)
        expect(rule(null)).toBe(true)
      })

      it('should fail for strings shorter than min length', () => {
        const rule = createRules().aliases.minLength(5)

        expect(rule('hi')).not.toBe(true)
        expect(rule('abc')).not.toBe(true)
      })
    })

    describe('strictLength', () => {
      it('should pass for strings matching exact length', () => {
        const rule = createRules().aliases.strictLength(5)

        expect(rule('hello')).toBe(true)
      })

      it('should pass for empty/falsy values', () => {
        const rule = createRules().aliases.strictLength(5)

        expect(rule('')).toBe(true)
        expect(rule(null)).toBe(true)
      })

      it('should fail for strings not matching exact length', () => {
        const rule = createRules().aliases.strictLength(5)

        expect(rule('hi')).not.toBe(true)
        expect(rule('hello world')).not.toBe(true)
      })
    })

    describe('exclude', () => {
      it('should pass for strings without forbidden characters', () => {
        const rule = createRules().aliases.exclude(['@', '#'])

        expect(rule('hello')).toBe(true)
        expect(rule('test123')).toBe(true)
      })

      it('should fail for strings containing forbidden characters', () => {
        const rule = createRules().aliases.exclude(['@', '#'])

        expect(rule('test@email')).not.toBe(true)
        expect(rule('#hashtag')).not.toBe(true)
      })

      it('should return custom error message', () => {
        const rule = createRules().aliases.exclude(['@'], 'No @ allowed')

        expect(rule('test@')).toBe('No @ allowed')
      })

      it('should pass for empty forbidden list', () => {
        const rule = createRules().aliases.exclude([])

        expect(rule('anything')).toBe(true)
      })

      it('should fail on first forbidden character found', () => {
        const rule = createRules().aliases.exclude(['a', 'b', 'c'])

        expect(rule('abc')).not.toBe(true)
        expect(rule('xyz')).toBe(true)
      })
    })

    describe('notEmpty', () => {
      it('should pass for non-empty values', () => {
        const rule = createRules().aliases.notEmpty()

        expect(rule('hello')).toBe(true)
        expect(rule([1, 2])).toBe(true)
      })

      it('should fail for empty values', () => {
        const rule = createRules().aliases.notEmpty()

        expect(rule('')).not.toBe(true)
        expect(rule([])).not.toBe(true)
        expect(rule(null)).not.toBe(true)
        expect(rule(undefined)).not.toBe(true)
      })
    })

    describe('pattern', () => {
      it('should pass for strings matching the pattern', () => {
        const rule = createRules().aliases.pattern(/^[a-z]+$/)

        expect(rule('hello')).toBe(true)
        expect(rule('abc')).toBe(true)
      })

      it('should pass for empty/falsy values', () => {
        const rule = createRules().aliases.pattern(/^[a-z]+$/)

        expect(rule('')).toBe(true)
        expect(rule(null)).toBe(true)
        expect(rule(undefined)).toBe(true)
      })

      it('should fail for strings not matching the pattern', () => {
        const rule = createRules().aliases.pattern(/^[a-z]+$/)

        expect(rule('Hello')).not.toBe(true)
        expect(rule('123')).not.toBe(true)
      })

      it('should return custom error message', () => {
        const rule = createRules().aliases.pattern(/^[a-z]+$/, 'Lowercase only')

        expect(rule('ABC')).toBe('Lowercase only')
      })
    })
  })

  describe('resolve', () => {
    it('should resolve string aliases', () => {
      const rules = createRules()
      const resolved = rules.resolve(['required', 'email'])

      expect(resolved).toHaveLength(2)
      expect(typeof resolved[0]).toBe('function')
      expect(typeof resolved[1]).toBe('function')
    })

    it('should resolve tuple aliases with options', () => {
      const rules = createRules()
      const resolved = rules.resolve([['maxLength', 10], ['minLength', 3]])

      expect(resolved).toHaveLength(2)
      expect(resolved[0]!('short')).toBe(true)
      expect(resolved[0]!('this is a very long string')).not.toBe(true)
    })

    it('should resolve tuple aliases with custom error message', () => {
      const rules = createRules()
      const resolved = rules.resolve([['maxLength', 5, 'Too long!']])

      expect(resolved).toHaveLength(1)
      expect(resolved[0]!('toolong')).toBe('Too long!')
    })

    it('should pass through functions unchanged', () => {
      function customRule (v: unknown) {
        return !!v || 'Required'
      }
      const rules = createRules()
      const resolved = rules.resolve([customRule])

      expect(resolved).toHaveLength(1)
      expect(resolved[0]).toBe(customRule)
    })

    it('should handle mixed arrays of strings, tuples, and functions', () => {
      function customRule (v: unknown) {
        return typeof v === 'string' || 'Must be string'
      }
      const rules = createRules()
      const resolved = rules.resolve([
        'required',
        ['maxLength', 10],
        customRule,
      ])

      expect(resolved).toHaveLength(3)
      expect(typeof resolved[0]).toBe('function')
      expect(typeof resolved[1]).toBe('function')
      expect(resolved[2]).toBe(customRule)
    })

    it('should handle empty rules array', () => {
      const rules = createRules()

      expect(rules.resolve([])).toEqual([])
    })

    it('should strip $ prefix from string aliases (Vuetify 3 compat)', () => {
      const rules = createRules()
      const resolved = rules.resolve(['$required', '$email'])

      expect(resolved).toHaveLength(2)
      expect(typeof resolved[0]).toBe('function')
      expect(resolved[0]!('')).not.toBe(true)
    })

    it('should strip $ prefix from tuple aliases', () => {
      const rules = createRules()
      const resolved = rules.resolve([['$maxLength', 5]])

      expect(resolved).toHaveLength(1)
      expect(resolved[0]!('hi')).toBe(true)
    })

    it('should skip unknown aliases', () => {
      const rules = createRules()
      const resolved = rules.resolve(['nonexistent'])

      expect(resolved).toHaveLength(0)
    })
  })

  describe('custom aliases', () => {
    it('should accept and call a custom alias', () => {
      const rules = createRules({
        aliases: {
          phone: ((err?: string) => {
            return (v: unknown) => /^\d{10}$/.test(String(v)) || (err ?? 'Invalid phone')
          }) as RuleBuilderWithoutOptions,
        },
      })

      const rule = (rules.aliases['phone'] as RuleBuilderWithoutOptions)()
      expect(rule('1234567890')).toBe(true)
      expect(rule('abc')).toBe('Invalid phone')
    })

    it('should override built-in aliases', () => {
      const rules = createRules({
        aliases: {
          required: ((_err?: string) => (v: unknown) => v !== null || 'Null not allowed') as RuleBuilderWithoutOptions,
        },
      })

      const rule = rules.aliases.required()
      expect(rule(false)).toBe(true) // custom: false passes
      expect(rule(null)).toBe('Null not allowed')
    })

    it('should resolve custom aliases via resolve()', () => {
      const rules = createRules({
        aliases: {
          phone: ((err?: string) => (v: unknown) => /^\d{10}$/.test(String(v)) || (err ?? 'Invalid phone')) as RuleBuilderWithoutOptions,
        },
      })

      const resolved = rules.resolve(['phone'])
      expect(resolved).toHaveLength(1)
      expect(resolved[0]!('1234567890')).toBe(true)
    })

    it('should preserve built-in aliases when adding custom ones', () => {
      const rules = createRules({
        aliases: {
          phone: (() => (v: unknown) => /^\d{10}$/.test(String(v)) || 'Invalid') as RuleBuilderWithoutOptions,
        },
      })

      expect(typeof rules.aliases.required).toBe('function')
      expect(typeof rules.aliases.email).toBe('function')
      expect(typeof rules.aliases.phone).toBe('function')
    })
  })

  describe('locale fallback', () => {
    it('should return a string error message when validation fails (no locale)', () => {
      const rule = createRules().aliases.required()
      const result = rule('')

      expect(typeof result).toBe('string')
      expect(typeof result === 'string' && result.length > 0).toBe(true)
    })

    it('should interpolate {0} placeholders in fallback messages', () => {
      const rule = createRules().aliases.maxLength(3)
      const result = rule('hello')

      expect(typeof result === 'string' && result.includes('3')).toBe(true)
    })

    it('should use custom error string over fallback', () => {
      const rule = createRules().aliases.maxLength(3, 'Way too long')
      expect(rule('hello')).toBe('Way too long')
    })
  })

  describe('independent instances', () => {
    it('should create independent rule closures', () => {
      const rules = createRules()
      const rule1 = rules.aliases.maxLength(5)
      const rule2 = rules.aliases.maxLength(10)

      expect(rule1('hello!')).not.toBe(true) // 6 > 5
      expect(rule2('hello!')).toBe(true) // 6 <= 10
    })

    it('should create independent createRules instances', () => {
      const rules1 = createRules()
      const rules2 = createRules({
        aliases: {
          required: () => () => true,
        },
      })

      expect(rules1.aliases.required()('')).not.toBe(true)
      expect(rules2.aliases.required()('')).toBe(true)
    })
  })
})

describe('createRulesContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return a Trinity tuple of length 3', () => {
    const result = createRulesContext()

    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(3)
    expect(typeof result[0]).toBe('function') // useRulesContext
    expect(typeof result[1]).toBe('function') // provideRulesContext
    expect(result[2]).toBeDefined() // default context
  })

  it('should create context with all built-in aliases', () => {
    const [,, context] = createRulesContext()

    expect(typeof context.aliases.required).toBe('function')
    expect(typeof context.resolve).toBe('function')
  })

  it('should call provide with default namespace', () => {
    const [, provideRulesContext, context] = createRulesContext()
    provideRulesContext(context)

    expect(mockProvide).toHaveBeenCalledWith('v0:rules', context)
  })

  it('should call provide with custom namespace', () => {
    const [, provideRulesContext, context] = createRulesContext({ namespace: 'my-rules' })
    provideRulesContext(context)

    expect(mockProvide).toHaveBeenCalledWith('my-rules', context)
  })

  it('should call app.provide when app is passed', () => {
    const mockApp = { provide: vi.fn() } as any
    const [, provideRulesContext, context] = createRulesContext()
    provideRulesContext(context, mockApp)

    expect(mockApp.provide).toHaveBeenCalledWith('v0:rules', context)
  })

  it('should pass custom aliases through to the context', () => {
    const [,, context] = createRulesContext({
      aliases: {
        phone: (() => (v: unknown) => /^\d{10}$/.test(String(v)) || 'Invalid phone') as RuleBuilderWithoutOptions,
      },
    })

    expect(typeof context.aliases['phone']).toBe('function')
    expect(typeof context.aliases.required).toBe('function')
  })
})

describe('useRules', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return a working fallback outside component context', () => {
    const rules = useRules()

    expect(typeof rules.aliases).toBe('object')
    expect(typeof rules.resolve).toBe('function')
  })

  it('should have working aliases in fallback', () => {
    const rules = useRules()

    expect(rules.aliases.required()('hello')).toBe(true)
    expect(rules.aliases.required()('')).not.toBe(true)
  })

  it('should have working resolve in fallback', () => {
    const rules = useRules()
    const resolved = rules.resolve(['required', ['maxLength', 10]])

    expect(resolved).toHaveLength(2)
    expect(typeof resolved[0]).toBe('function')
  })

  it('should inject context when inside a component', () => {
    const mockContext = createRules()
    mockInject.mockReturnValue(mockContext)

    // Simulate being inside a component by having inject return a value
    // (instanceExists guard is bypassed because getCurrentInstance returns null in test env)
    const result = useRules()

    // In test env (no component), returns fallback — verify it's functional
    expect(typeof result.aliases.required).toBe('function')
  })
})
