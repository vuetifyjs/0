import { describe, expect, it } from 'vitest'

// Composables
import {
  getPluginCatalog,
  isSubscriber,
  isValidPlugin,
  keepValidComponents,
  keepValidPlugins,
  parseAssembleResponse,
  validateAssembleResult,
} from './useAssemble'

describe('parseAssembleResponse', () => {
  it('parses plain JSON object', () => {
    const input = '{"plugins": ["useTheme", "useBreakpoints"], "components": ["Button", "Dialog"]}'
    const result = parseAssembleResponse(input)

    expect(result.plugins).toEqual(['useTheme', 'useBreakpoints'])
    expect(result.components).toEqual(['Button', 'Dialog'])
  })

  it('parses JSON wrapped in markdown code fence', () => {
    const input = '```json\n{"plugins": ["useTheme"], "components": ["Button"]}\n```'
    const result = parseAssembleResponse(input)

    expect(result.plugins).toEqual(['useTheme'])
    expect(result.components).toEqual(['Button'])
  })

  it('parses JSON wrapped in generic code fence', () => {
    const input = '```\n{"plugins": ["useStorage"], "components": []}\n```'
    const result = parseAssembleResponse(input)

    expect(result.plugins).toEqual(['useStorage'])
    expect(result.components).toEqual([])
  })

  it('handles missing plugins array', () => {
    const input = '{"components": ["Button"]}'
    const result = parseAssembleResponse(input)

    expect(result.plugins).toEqual([])
    expect(result.components).toEqual(['Button'])
  })

  it('handles missing components array', () => {
    const input = '{"plugins": ["useTheme"]}'
    const result = parseAssembleResponse(input)

    expect(result.plugins).toEqual(['useTheme'])
    expect(result.components).toEqual([])
  })

  it('handles empty object', () => {
    const input = '{}'
    const result = parseAssembleResponse(input)

    expect(result.plugins).toEqual([])
    expect(result.components).toEqual([])
  })

  it('filters out non-string values in arrays', () => {
    const input = '{"plugins": ["useTheme", 123, null, "useStorage"], "components": ["Button", true]}'
    const result = parseAssembleResponse(input)

    expect(result.plugins).toEqual(['useTheme', 'useStorage'])
    expect(result.components).toEqual(['Button'])
  })

  it('handles whitespace around JSON', () => {
    const input = '  \n  {"plugins": ["useTheme"], "components": []}  \n  '
    const result = parseAssembleResponse(input)

    expect(result.plugins).toEqual(['useTheme'])
  })

  it('throws on invalid JSON', () => {
    expect(() => parseAssembleResponse('not json')).toThrow()
  })

  it('throws on non-object JSON', () => {
    expect(() => parseAssembleResponse('"string"')).toThrow('Response is not a valid object')
    expect(() => parseAssembleResponse('null')).toThrow('Response is not a valid object')
    expect(() => parseAssembleResponse('123')).toThrow('Response is not a valid object')
  })
})

describe('isValidPlugin', () => {
  it('returns true for known plugin IDs', () => {
    expect(isValidPlugin('useTheme')).toBe(true)
    expect(isValidPlugin('useBreakpoints')).toBe(true)
    expect(isValidPlugin('useStorage')).toBe(true)
    expect(isValidPlugin('useLocale')).toBe(true)
  })

  it('returns false for unknown plugin IDs', () => {
    expect(isValidPlugin('useUnknown')).toBe(false)
    expect(isValidPlugin('theme')).toBe(false)
    expect(isValidPlugin('')).toBe(false)
  })
})

describe('keepValidPlugins', () => {
  it('filters to only valid plugin IDs', () => {
    const input = ['useTheme', 'useUnknown', 'useBreakpoints', 'invalid']
    const result = keepValidPlugins(input)

    expect(result).toEqual(['useTheme', 'useBreakpoints'])
  })

  it('returns empty array when all invalid', () => {
    const result = keepValidPlugins(['invalid1', 'invalid2'])
    expect(result).toEqual([])
  })

  it('preserves all when all valid', () => {
    const input = ['useTheme', 'useStorage']
    const result = keepValidPlugins(input)
    expect(result).toEqual(['useTheme', 'useStorage'])
  })
})

describe('keepValidComponents', () => {
  it('filters to only selectable component IDs', () => {
    const result = keepValidComponents(['Button', 'UnknownComponent', 'Dialog'])
    expect(result).toContain('Button')
    expect(result).toContain('Dialog')
    expect(result).not.toContain('UnknownComponent')
  })

  it('returns empty array for all invalid', () => {
    const result = keepValidComponents(['NotAComponent', 'AlsoNot'])
    expect(result).toEqual([])
  })
})

describe('validateAssembleResult', () => {
  it('separates valid and invalid IDs', () => {
    const input = {
      plugins: ['useTheme', 'useInvalid', 'useBreakpoints'],
      components: ['Button', 'NotReal', 'Dialog'],
    }

    const result = validateAssembleResult(input)

    expect(result.valid.plugins).toEqual(['useTheme', 'useBreakpoints'])
    expect(result.valid.components).toContain('Button')
    expect(result.valid.components).toContain('Dialog')

    expect(result.invalid.plugins).toEqual(['useInvalid'])
    expect(result.invalid.components).toContain('NotReal')
  })

  it('handles all valid input', () => {
    const input = {
      plugins: ['useTheme', 'useStorage'],
      components: ['Button'],
    }

    const result = validateAssembleResult(input)

    expect(result.invalid.plugins).toEqual([])
    expect(result.invalid.components).toEqual([])
  })

  it('handles all invalid input', () => {
    const input = {
      plugins: ['notReal1', 'notReal2'],
      components: ['notReal3'],
    }

    const result = validateAssembleResult(input)

    expect(result.valid.plugins).toEqual([])
    expect(result.valid.components).toEqual([])
  })

  it('handles empty input', () => {
    const input = { plugins: [], components: [] }
    const result = validateAssembleResult(input)

    expect(result.valid.plugins).toEqual([])
    expect(result.valid.components).toEqual([])
    expect(result.invalid.plugins).toEqual([])
    expect(result.invalid.components).toEqual([])
  })
})

describe('isSubscriber', () => {
  it('returns true for sponsor role', () => {
    expect(isSubscriber('sponsor')).toBe(true)
    expect(isSubscriber('Sponsor')).toBe(true)
    expect(isSubscriber('SPONSOR')).toBe(true)
  })

  it('returns true for admin role', () => {
    expect(isSubscriber('admin')).toBe(true)
    expect(isSubscriber('Admin')).toBe(true)
  })

  it('returns true for solo role', () => {
    expect(isSubscriber('solo')).toBe(true)
  })

  it('returns true for team role', () => {
    expect(isSubscriber('team')).toBe(true)
  })

  it('returns false for undefined/null', () => {
    expect(isSubscriber(undefined)).toBe(false)
    expect(isSubscriber(null)).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(isSubscriber('')).toBe(false)
  })

  it('returns false for non-subscriber roles', () => {
    expect(isSubscriber('user')).toBe(false)
    expect(isSubscriber('guest')).toBe(false)
    expect(isSubscriber('member')).toBe(false)
  })
})

describe('getPluginCatalog', () => {
  it('returns array of all plugin IDs', () => {
    const catalog = getPluginCatalog()

    expect(Array.isArray(catalog)).toBe(true)
    expect(catalog.length).toBeGreaterThan(0)
    expect(catalog).toContain('useTheme')
    expect(catalog).toContain('useBreakpoints')
    expect(catalog).toContain('useStorage')
  })

  it('all returned IDs pass isValidPlugin', () => {
    const catalog = getPluginCatalog()

    for (const id of catalog) {
      expect(isValidPlugin(id)).toBe(true)
    }
  })
})
