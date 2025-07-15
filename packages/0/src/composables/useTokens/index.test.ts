import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createTokens } from './index'
import type { TokenCollection } from './index'

describe('createTokens', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  describe('basic functionality', () => {
    it('should return useContext, provideContext, and context', () => {
      const [useTokensContext, provideTokensContext, context] = createTokens('test')

      expect(typeof useTokensContext).toBe('function')
      expect(typeof provideTokensContext).toBe('function')
      expect(context).toHaveProperty('resolve')
      expect(context).toHaveProperty('resolveItem')
      expect(context).toHaveProperty('registeredItems')
    })

    it('should initialize with empty tokens', () => {
      const [, _provideTokensContext, context] = createTokens('test')

      expect(context.registeredItems.size).toBe(0)
    })
  })

  describe('token flattening', () => {
    it('should flatten simple tokens', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
        secondary: '#6C757D',
      }

      const context = createTokens('test', tokens)[2]

      expect(context.registeredItems.size).toBe(2)
      expect(context.resolve('primary')).toBe('#007BFF')
      expect(context.resolve('secondary')).toBe('#6C757D')
    })

    it('should flatten nested tokens', () => {
      const tokens: TokenCollection = {
        colors: {
          primary: '#007BFF',
          secondary: '#6C757D',
          red: {
            100: '#FEF2F2',
            200: '#FEE2E2',
          },
        },
      }

      const context = createTokens('test', tokens)[2]

      expect(context.registeredItems.size).toBe(4)
      expect(context.resolve('colors.primary')).toBe('#007BFF')
      expect(context.resolve('colors.secondary')).toBe('#6C757D')
      expect(context.resolve('colors.red.100')).toBe('#FEF2F2')
      expect(context.resolve('colors.red.200')).toBe('#FEE2E2')
    })

    it('should handle mixed token types', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
        accent: { $value: '{primary}' },
        colors: {
          red: {
            100: '#FEF2F2',
            200: { $value: '{colors.red.100}' },
          },
        },
      }

      const context = createTokens('test', tokens)[2]

      expect(context.registeredItems.size).toBe(4)
      expect(context.resolve('primary')).toBe('#007BFF')
      expect(context.resolve('accent')).toBe('#007BFF')
      expect(context.resolve('colors.red.100')).toBe('#FEF2F2')
      expect(context.resolve('colors.red.200')).toBe('#FEF2F2')
    })
  })

  describe('alias resolution', () => {
    it('should resolve simple aliases', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
        accent: { $value: '{primary}' },
      }

      const context = createTokens('test', tokens)[2]

      expect(context.resolve('primary')).toBe('#007BFF')
      expect(context.resolve('accent')).toBe('#007BFF')
    })

    it('should resolve nested aliases', () => {
      const tokens: TokenCollection = {
        colors: {
          primary: '#007BFF',
        },
        accent: { $value: '{colors.primary}' },
      }

      const context = createTokens('test', tokens)[2]

      expect(context.resolve('colors.primary')).toBe('#007BFF')
      expect(context.resolve('accent')).toBe('#007BFF')
    })

    it('should resolve chained aliases', () => {
      const tokens: TokenCollection = {
        base: '#007BFF',
        primary: { $value: '{base}' },
        accent: { $value: '{primary}' },
      }

      const context = createTokens('test', tokens)[2]

      expect(context.resolve('base')).toBe('#007BFF')
      expect(context.resolve('primary')).toBe('#007BFF')
      expect(context.resolve('accent')).toBe('#007BFF')
    })

    it('should handle missing aliases gracefully', () => {
      const tokens: TokenCollection = {
        primary: { $value: '{missing}' },
      }

      const context = createTokens('test', tokens)[2]

      expect(context.resolve('primary')).toBe('{missing}')
      expect(console.warn).toHaveBeenCalledWith('Alias not found for "primary": missing')
    })

    it('should handle circular references gracefully', () => {
      const tokens: TokenCollection = {
        a: { $value: '{b}' },
        b: { $value: '{a}' },
      }

      const context = createTokens('test', tokens)[2]

      expect(context.resolve('a')).toBe('{b}')
      expect(context.resolve('b')).toBe('{a}')
      expect(console.warn).toHaveBeenCalledWith('Circular reference detected for "a": b')
    })

    it('should handle invalid alias format', () => {
      const tokens: TokenCollection = {
        primary: { $value: 'invalid-format' },
      }

      const context = createTokens('test', tokens)[2]

      expect(context.resolve('primary')).toBe('invalid-format')
      expect(console.warn).toHaveBeenCalledWith('Invalid alias format for "primary": invalid-format')
    })
  })

  describe('token resolution', () => {
    it('should resolve tokens with curly braces', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
        accent: { $value: '{primary}' },
      }

      const context = createTokens('test', tokens)[2]

      expect(context.resolve('{primary}')).toBe('#007BFF')
      expect(context.resolve('{accent}')).toBe('#007BFF')
    })

    it('should resolve tokens without curly braces', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
        accent: { $value: '{primary}' },
      }

      const context = createTokens('test', tokens)[2]

      expect(context.resolve('primary')).toBe('#007BFF')
      expect(context.resolve('accent')).toBe('#007BFF')
    })

    it('should return undefined for non-existent tokens', () => {
      const context = createTokens('test', {})[2]

      expect(context.resolve('nonexistent')).toBeUndefined()
      expect(context.resolve('{nonexistent}')).toBeUndefined()
    })
  })

  describe('token item resolution', () => {
    it('should resolve token items', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
        accent: { $value: '{primary}' },
      }

      const context = createTokens('test', tokens)[2]

      const primaryItem = context.resolveItem('primary')
      const accentItem = context.resolveItem('accent')

      expect(primaryItem).toBeDefined()
      expect(primaryItem?.id).toBe('primary')
      expect(primaryItem?.value).toBe('#007BFF')

      expect(accentItem).toBeDefined()
      expect(accentItem?.id).toBe('accent')
      expect(accentItem?.value).toBe('#007BFF')
    })

    it('should resolve token items with curly braces', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
      }

      const context = createTokens('test', tokens)[2]

      const item = context.resolveItem('{primary}')
      expect(item).toBeDefined()
      expect(item?.id).toBe('primary')
      expect(item?.value).toBe('#007BFF')
    })

    it('should return undefined for non-existent token items', () => {
      const context = createTokens('test', {})[2]

      expect(context.resolveItem('nonexistent')).toBeUndefined()
      expect(context.resolveItem('{nonexistent}')).toBeUndefined()
    })
  })

  describe('registrar integration', () => {
    it('should register tokens with the registrar', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
        colors: {
          red: {
            100: '#FEF2F2',
          },
        },
      }

      const context = createTokens('test', tokens)[2]

      expect(context.registeredItems.size).toBe(2)
      expect(context.registeredItems.has('primary')).toBe(true)
      expect(context.registeredItems.has('colors.red.100')).toBe(true)
    })

    it('should use token path as registrar ID', () => {
      const tokens: TokenCollection = {
        colors: {
          primary: '#007BFF',
        },
      }

      const context = createTokens('test', tokens)[2]

      const item = context.registeredItems.get('colors.primary')
      expect(item).toBeDefined()
      expect(item?.id).toBe('colors.primary')
      expect(item?.value).toBe('#007BFF')
    })
  })

  describe('complex scenarios', () => {
    it('should handle a comprehensive token system', () => {
      const tokens: TokenCollection = {
        base: {
          white: '#FFFFFF',
          black: '#000000',
          gray: {
            50: '#F9FAFB',
            100: '#F3F4F6',
            900: '#111827',
          },
        },
        semantic: {
          primary: { $value: '{base.gray.900}' },
          secondary: { $value: '{base.gray.100}' },
          background: { $value: '{base.white}' },
        },
        components: {
          button: {
            primary: { $value: '{semantic.primary}' },
            secondary: { $value: '{semantic.secondary}' },
          },
        },
      }

      const context = createTokens('test', tokens)[2]

      expect(context.registeredItems.size).toBe(10)

      // Test direct values
      expect(context.resolve('base.white')).toBe('#FFFFFF')
      expect(context.resolve('base.gray.50')).toBe('#F9FAFB')

      // Test single-level aliases
      expect(context.resolve('semantic.primary')).toBe('#111827')
      expect(context.resolve('semantic.background')).toBe('#FFFFFF')

      // Test chained aliases
      expect(context.resolve('components.button.primary')).toBe('#111827')
      expect(context.resolve('components.button.secondary')).toBe('#F3F4F6')
    })

    it('should handle mixed alias and string values in nested structures', () => {
      const tokens: TokenCollection = {
        spacing: {
          xs: '4px',
          sm: { $value: '{spacing.xs}' },
          md: '16px',
          lg: { $value: '{spacing.md}' },
        },
      }

      const context = createTokens('test', tokens)[2]

      expect(context.resolve('spacing.xs')).toBe('4px')
      expect(context.resolve('spacing.sm')).toBe('4px')
      expect(context.resolve('spacing.md')).toBe('16px')
      expect(context.resolve('spacing.lg')).toBe('16px')
    })
  })
})
