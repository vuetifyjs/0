import { beforeEach, describe, expect, it, vi } from 'vitest'

// Adapters
// Internal — imported directly for unit testing
import { toRule } from './adapters/standard'

import {
  createRules,
  createRulesContext,
  isStandardSchema,
  useRules,
} from './index'

// Utilities
import { inject, provide } from 'vue'

// Types
import type { StandardSchemaV1 } from './index'

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
  describe('resolve', () => {
    it('should pass through functions unchanged', () => {
      function custom (v: unknown) {
        return !!v || 'Required'
      }
      const rules = createRules()
      const resolved = rules.resolve([custom])

      expect(resolved).toHaveLength(1)
      expect(resolved[0]).toBe(custom)
    })

    it('should resolve custom string aliases', () => {
      const rules = createRules({
        aliases: {
          phone: (v: unknown) => /^\d{10}$/.test(String(v)) || false,
        },
      })
      const resolved = rules.resolve(['phone'])

      expect(resolved).toHaveLength(1)
      expect(resolved[0]!('1234567890')).toBe(true)
      // false → locale lookup returns key when no locale is set up
      expect(resolved[0]!('abc')).toBe('phone')
    })

    it('should handle mixed arrays of aliases, functions, and schemas', () => {
      const schema = mockSchema(() => ({ value: 'ok' }))
      function custom (v: unknown) {
        return !!v || 'Required'
      }
      const rules = createRules({
        aliases: {
          phone: (v: unknown) => /^\d{10}$/.test(String(v)) || false,
        },
      })
      const resolved = rules.resolve(['phone', custom, schema])

      expect(resolved).toHaveLength(3)
    })

    it('should handle empty rules array', () => {
      const rules = createRules()

      expect(rules.resolve([])).toEqual([])
    })

    it('should skip unknown aliases', () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const rules = createRules()
      const resolved = rules.resolve(['nonexistent'])

      expect(resolved).toHaveLength(0)
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('nonexistent'))

      spy.mockRestore()
    })
  })

  describe('custom aliases', () => {
    it('should accept and call a custom alias predicate', () => {
      const rules = createRules({
        aliases: {
          phone: (v: unknown) => /^\d{10}$/.test(String(v)) || false,
        },
      })

      const predicate = rules.aliases['phone']!
      expect(predicate('1234567890')).toBe(true)
      expect(predicate('abc')).toBe(false)
    })

    it('should resolve custom aliases via resolve()', () => {
      const rules = createRules({
        aliases: {
          phone: (v: unknown) => /^\d{10}$/.test(String(v)) || false,
        },
      })

      const resolved = rules.resolve(['phone'])
      expect(resolved).toHaveLength(1)
      expect(resolved[0]!('1234567890')).toBe(true)
    })

    it('should start with empty aliases when no custom aliases provided', () => {
      const rules = createRules()

      expect(Object.keys(rules.aliases)).toHaveLength(0)
    })

    it('should create independent createRules instances', () => {
      const rules1 = createRules({
        aliases: {
          check: () => false,
        },
      })
      const rules2 = createRules({
        aliases: {
          check: () => true,
        },
      })

      expect(rules1.aliases['check']!('')).toBe(false)
      expect(rules2.aliases['check']!('')).toBe(true)
    })
  })

  describe('wrapAlias', () => {
    it('should return true when predicate returns true', () => {
      const rules = createRules({
        aliases: {
          always: () => true,
        },
      })

      const resolved = rules.resolve(['always'])
      expect(resolved[0]!('any')).toBe(true)
    })

    it('should return locale key when predicate returns false', () => {
      const rules = createRules({
        aliases: {
          required: (v: unknown) => !!v || false,
        },
      })

      const resolved = rules.resolve(['required'])
      expect(resolved[0]!('')).toBe('required')
    })

    it('should pass through string results from predicate', () => {
      const rules = createRules({
        aliases: {
          custom: (v: unknown) => !!v || 'Custom error message',
        },
      })

      const resolved = rules.resolve(['custom'])
      expect(resolved[0]!('')).toBe('Custom error message')
      expect(resolved[0]!('valid')).toBe(true)
    })

    it('should fall back to alias name when no locale and predicate returns false', () => {
      const rules = createRules({
        aliases: {
          required: (v: unknown) => !!v || false,
        },
      })

      const resolved = rules.resolve(['required'])
      expect(resolved[0]!('')).toBe('required')
    })

    it('should handle async predicate returning false', async () => {
      const rules = createRules({
        aliases: {
          asyncCheck: async (v: unknown) => !!v || false,
        },
      })

      const resolved = rules.resolve(['asyncCheck'])
      expect(await resolved[0]!('')).toBe('asyncCheck')
      expect(await resolved[0]!('valid')).toBe(true)
    })

    it('should handle async predicate returning string', async () => {
      const rules = createRules({
        aliases: {
          asyncCheck: async (v: unknown) => !!v || 'Async error',
        },
      })

      const resolved = rules.resolve(['asyncCheck'])
      expect(await resolved[0]!('')).toBe('Async error')
      expect(await resolved[0]!('valid')).toBe(true)
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
    expect(typeof result[0]).toBe('function')
    expect(typeof result[1]).toBe('function')
    expect(result[2]).toBeDefined()
  })

  it('should create context with resolve function', () => {
    const [,, context] = createRulesContext()

    expect(typeof context.resolve).toBe('function')
  })

  it('should call provide with default namespace', () => {
    const [, provideRulesContext, context] = createRulesContext()
    provideRulesContext(context)

    expect(mockProvide).toHaveBeenCalledWith('v0:rules', context)
  })

  it('should call provide with custom namespace', () => {
    const [, provideRulesContext, context] = createRulesContext({ namespace: 'test:my-rules' })
    provideRulesContext(context)

    expect(mockProvide).toHaveBeenCalledWith('test:my-rules', context)
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
        phone: (v: unknown) => /^\d{10}$/.test(String(v)) || false,
      },
    })

    expect(typeof context.aliases['phone']).toBe('function')
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

  it('should have working resolve in fallback', () => {
    function custom (v: unknown) {
      return !!v || 'Required'
    }
    const rules = useRules()
    const resolved = rules.resolve([custom])

    expect(resolved).toHaveLength(1)
    expect(resolved[0]).toBe(custom)
  })

  it('should inject context when inside a component', () => {
    const mockContext = createRules()
    mockInject.mockReturnValue(mockContext)

    const result = useRules()

    expect(typeof result.resolve).toBe('function')
  })
})

/** Helper to create a mock Standard Schema object */
function mockSchema (validate: (value: unknown) => { value?: unknown, issues?: ReadonlyArray<{ message: string }> }): StandardSchemaV1 {
  return {
    '~standard': {
      version: 1,
      vendor: 'test',
      validate,
    },
  }
}

describe('standard Schema integration', () => {
  describe('isStandardSchema', () => {
    it('should return true for objects with ~standard property', () => {
      const schema = mockSchema(() => ({}))
      expect(isStandardSchema(schema)).toBe(true)
    })

    it('should return false for non-objects', () => {
      expect(isStandardSchema('required')).toBe(false)
      expect(isStandardSchema(42)).toBe(false)
      expect(isStandardSchema(null)).toBe(false)
      expect(isStandardSchema(undefined)).toBe(false)
    })

    it('should return false for objects without ~standard', () => {
      expect(isStandardSchema({})).toBe(false)
      expect(isStandardSchema({ validate: () => ({}) })).toBe(false)
    })

    it('should return false for functions', () => {
      expect(isStandardSchema(() => true)).toBe(false)
    })
  })

  describe('toRule', () => {
    it('should return true for valid sync schema', async () => {
      const schema = mockSchema(() => ({ value: 'ok' }))
      const rule = toRule(schema)

      expect(await rule('anything')).toBe(true)
    })

    it('should return first issue message for invalid sync schema', async () => {
      const schema = mockSchema(() => ({
        issues: [{ message: 'Must be a string' }],
      }))
      const rule = toRule(schema)

      expect(await rule(42)).toBe('Must be a string')
    })

    it('should handle async validation', async () => {
      const schema: StandardSchemaV1 = {
        '~standard': {
          version: 1,
          vendor: 'test',
          validate: async () => ({
            issues: [{ message: 'Async error' }],
          }),
        },
      }
      const rule = toRule(schema)

      expect(await rule('test')).toBe('Async error')
    })

    it('should return true for valid async schema', async () => {
      const schema: StandardSchemaV1 = {
        '~standard': {
          version: 1,
          vendor: 'test',
          validate: async () => ({ value: 'ok' }),
        },
      }
      const rule = toRule(schema)

      expect(await rule('test')).toBe(true)
    })

    it('should return first issue when multiple issues exist', async () => {
      const schema = mockSchema(() => ({
        issues: [
          { message: 'Error one' },
          { message: 'Error two' },
        ],
      }))
      const rule = toRule(schema)

      expect(await rule('')).toBe('Error one')
    })
  })

  describe('resolve', () => {
    it('should auto-detect Standard Schema objects', () => {
      const schema = mockSchema(() => ({ value: 'ok' }))
      const rules = createRules()
      const resolved = rules.resolve([schema])

      expect(resolved).toHaveLength(1)
      expect(typeof resolved[0]).toBe('function')
    })

    it('should handle mixed arrays of aliases, functions, and schemas', () => {
      const schema = mockSchema(() => ({ value: 'ok' }))
      function custom (v: unknown) {
        return !!v || 'Required'
      }
      const rules = createRules({
        aliases: {
          check: () => true,
        },
      })
      const resolved = rules.resolve(['check', custom, schema])

      expect(resolved).toHaveLength(3)
    })

    it('should produce working rules from auto-detected schemas', async () => {
      const schema = mockSchema(value => {
        if (typeof value === 'string' && value.length > 0) return { value }
        return { issues: [{ message: 'Required' }] }
      })
      const rules = createRules()
      const resolved = rules.resolve([schema])

      expect(await resolved[0]!('hello')).toBe(true)
      expect(await resolved[0]!('')).toBe('Required')
    })
  })
})
