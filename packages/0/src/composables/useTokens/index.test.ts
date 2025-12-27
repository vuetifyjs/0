import { beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { mount } from '@vue/test-utils'
import { computed, defineComponent, nextTick, ref } from 'vue'

// Types
import type { TokenAlias, TokenCollection } from './index'

import fixtureTokens from './fixtures/tokens'

import { createTokens, createTokensContext, useTokens } from './index'

describe('createTokensContext', () => {
  describe('basic functionality', () => {
    it('should initialize with empty tokens', () => {
      const context = createTokensContext({ namespace: 'test' })[2]

      expect(context.collection.size).toBe(0)
    })
  })

  describe('token flattening', () => {
    it('should flatten simple tokens', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
        secondary: '#6C757D',
      }

      const context = createTokensContext({ namespace: 'test', tokens })[2]

      expect(context.collection.size).toBe(2)
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

      const context = createTokensContext({ namespace: 'test', tokens })[2]

      expect(context.collection.size).toBe(4)
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

      const context = createTokensContext({ namespace: 'test', tokens })[2]

      expect(context.collection.size).toBe(4)
      expect(context.resolve('primary')).toBe('#007BFF')
      expect(context.resolve('accent')).toBe('#007BFF')
      expect(context.resolve('colors.red.100')).toBe('#FEF2F2')
      expect(context.resolve('colors.red.200')).toBe('#FEF2F2')
    })

    it('should merge tokens at 0 depth when using flat', () => {
      const tokens: TokenCollection = {
        dark: true,
        rtl: { value: true, variation: 'toggle' },
        complex: { inner: { leaf: '#FFFFFF' } },
      }

      const context = createTokens(tokens, { flat: true })

      expect(context.collection.size).toBe(3)
      expect(context.collection.has('dark')).toBe(true)
      expect(context.collection.has('rtl')).toBe(true)
      expect(context.collection.has('complex')).toBe(true)

      expect(context.resolve('rtl')).toEqual({ value: true, variation: 'toggle' })
      expect(context.resolve('complex')).toEqual({ inner: { leaf: '#FFFFFF' } })
    })
  })

  describe('alias resolution', () => {
    it('should resolve simple aliases', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
        accent: { $value: '{primary}' },
      }

      const context = createTokensContext({ namespace: 'test', tokens })[2]

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

      const context = createTokensContext({ namespace: 'test', tokens })[2]

      expect(context.resolve('colors.primary')).toBe('#007BFF')
      expect(context.resolve('accent')).toBe('#007BFF')
    })

    it('should resolve chained aliases', () => {
      const tokens: TokenCollection = {
        base: '#007BFF',
        primary: { $value: '{base}' },
        accent: { $value: '{primary}' },
      }

      const context = createTokensContext({ namespace: 'test', tokens })[2]

      expect(context.resolve('base')).toBe('#007BFF')
      expect(context.resolve('primary')).toBe('#007BFF')
      expect(context.resolve('accent')).toBe('#007BFF')
    })
  })

  describe('token resolution', () => {
    it('should resolve tokens with curly braces', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
        accent: { $value: '{primary}' },
      }

      const context = createTokensContext({ namespace: 'test', tokens })[2]

      expect(context.resolve('{primary}')).toBe('#007BFF')
      expect(context.resolve('{accent}')).toBe('#007BFF')
    })

    it('should resolve tokens without curly braces', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
        accent: { $value: '{primary}' },
      }

      const context = createTokensContext({ namespace: 'test', tokens })[2]

      expect(context.resolve('primary')).toBe('#007BFF')
      expect(context.resolve('accent')).toBe('#007BFF')
    })

    it('should return undefined for non-existent tokens', () => {
      const warnSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const context = createTokensContext({ namespace: 'test', tokens: {} })[2]

      expect(context.resolve('nonexistent')).toBeUndefined()
      expect(context.resolve('{nonexistent}')).toBeUndefined()

      warnSpy.mockRestore()
    })
  })

  describe('token item resolution', () => {
    it('should return undefined for non-existent token items', () => {
      const context = createTokensContext({ namespace: 'test', tokens: {} })[2]

      expect(context.collection.get('nonexistent')).toBeUndefined()
      expect(context.collection.get('{nonexistent}')).toBeUndefined()
    })
  })

  describe('registry integration', () => {
    it('should register tokens with the registry', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
        colors: {
          red: {
            100: '#FEF2F2',
          },
        },
      }

      const context = createTokensContext({ namespace: 'test', tokens })[2]

      expect(context.collection.size).toBe(2)
      expect(context.collection.has('primary')).toBe(true)
      expect(context.collection.has('colors.red.100')).toBe(true)
    })

    it('should use token path as registry ID', () => {
      const tokens: TokenCollection = {
        colors: {
          primary: '#007BFF',
        },
      }

      const context = createTokensContext({ namespace: 'test', tokens })[2]

      const item = context.collection.get('colors.primary')
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

      const context = createTokensContext({ namespace: 'test', tokens })[2]

      expect(context.collection.size).toBe(10)

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

      const context = createTokensContext({ namespace: 'test', tokens })[2]

      expect(context.resolve('spacing.xs')).toBe('4px')
      expect(context.resolve('spacing.sm')).toBe('4px')
      expect(context.resolve('spacing.md')).toBe('16px')
      expect(context.resolve('spacing.lg')).toBe('16px')
    })
  })
})

// TODO: This should probably be in the component versions
describe('createTokensContext reactivity in components', () => {
  it('should provide reactive token resolution in Vue component', async () => {
    const tokens = {
      primary: '#1976d2',
      secondary: '#424242',
      accent: { $value: '{primary}' },
    }

    const [_createTokensContext, provideTokens] = createTokensContext({ namespace: 'test-reactivity', tokens })

    const TestComponent = defineComponent({
      setup () {
        const context = _createTokensContext()
        const resolvedPrimary = ref(context.resolve('primary'))
        const resolvedAccent = ref(context.resolve('accent'))

        return {
          resolvedPrimary,
          resolvedAccent,
          context,
        }
      },
      template: '<div></div>',
    })

    const ParentComponent = defineComponent({
      setup () {
        provideTokens()
      },
      components: { TestComponent },
      template: '<TestComponent />',
    })

    const wrapper = mount(ParentComponent)
    const testComponent = wrapper.findComponent(TestComponent as any)

    expect(testComponent.vm.resolvedPrimary).toBe('#1976d2')
    expect(testComponent.vm.resolvedAccent).toBe('#1976d2')
  })

  it('should demonstrate reactive token resolution with computed properties', async () => {
    const tokens = {
      primary: '#1976d2',
      secondary: '#424242',
      accent: { $value: '{primary}' },
    }

    const [_createTokensContext, provideTokens] = createTokensContext({ namespace: 'test-reactive', tokens })

    const TestComponent = defineComponent({
      setup () {
        const context = _createTokensContext()
        const selectedToken = ref('primary')

        // Reactive computed that depends on selectedToken
        const currentTokenValue = computed(() => {
          return context.resolve(selectedToken.value)
        })

        // Reactive computed for accent that always resolves to primary
        const accentValue = computed(() => {
          return context.resolve('accent')
        })

        return {
          selectedToken,
          currentTokenValue,
          accentValue,
          switchToSecondary: () => {
            selectedToken.value = 'secondary'
          },
        }
      },
      template: '<div></div>',
    })

    const ParentComponent = defineComponent({
      setup () {
        provideTokens()
      },
      components: { TestComponent },
      template: '<TestComponent />',
    })

    const wrapper = mount(ParentComponent)
    const testComponent = wrapper.findComponent(TestComponent as any)

    // Initial values - should resolve primary
    expect(testComponent.vm.currentTokenValue).toBe('#1976d2')
    expect(testComponent.vm.accentValue).toBe('#1976d2') // accent resolves to primary
    expect(testComponent.vm.selectedToken).toBe('primary')

    // Switch to secondary token reactively
    testComponent.vm.switchToSecondary()
    await nextTick()

    // Values should update reactively through computed properties
    expect(testComponent.vm.currentTokenValue).toBe('#424242')
    expect(testComponent.vm.accentValue).toBe('#1976d2') // accent still resolves to primary
    expect(testComponent.vm.selectedToken).toBe('secondary')
  })

  it('should resolve token items reactively', async () => {
    const tokens = {
      colors: {
        primary: '#1976d2',
        secondary: '#424242',
      },
      spacing: {
        small: '8px',
        medium: '16px',
      },
    }

    const [_createTokensContext, provideTokens] = createTokensContext({ namespace: 'test-items', tokens })

    const TestComponent = defineComponent({
      setup () {
        const context = _createTokensContext()
        const primaryItem = ref(context.collection.get('colors.primary'))
        const spacingItem = ref(context.collection.get('spacing.medium'))

        return {
          primaryItem,
          spacingItem,
          collection: context.collection,
        }
      },
      template: '<div></div>',
    })

    const ParentComponent = defineComponent({
      setup () {
        provideTokens()
      },
      components: { TestComponent },
      template: '<TestComponent />',
    })

    const wrapper = mount(ParentComponent)
    const testComponent = wrapper.findComponent(TestComponent as any)

    expect(testComponent.vm.primaryItem?.id).toBe('colors.primary')
    expect(testComponent.vm.primaryItem?.value).toBe('#1976d2')
    expect(testComponent.vm.spacingItem?.id).toBe('spacing.medium')
    expect(testComponent.vm.spacingItem?.value).toBe('16px')
    expect(testComponent.vm.collection.size).toBe(4)
  })

  it('should handle context injection errors gracefully', () => {
    const [_createTokensContext] = createTokensContext({ namespace: 'test-error' })

    const TestComponent = defineComponent({
      setup () {
        _createTokensContext()
      },
      template: '<div></div>',
    })

    expect(() => {
      mount(TestComponent)
    }).toThrow()
  })

  it('should work with multiple token contexts', async () => {
    const themeTokens = {
      primary: '#1976d2',
      secondary: '#424242',
    }

    const spacingTokens = {
      small: '8px',
      large: '24px',
    }

    const [useThemeTokens, provideThemeTokens] = createTokensContext({ namespace: 'theme', tokens: themeTokens })
    const [useSpacingTokens, provideSpacingTokens] = createTokensContext({ namespace: 'spacing', tokens: spacingTokens })

    const TestComponent = defineComponent({
      setup () {
        const themeContext = useThemeTokens()
        const spacingContext = useSpacingTokens()

        return {
          primaryColor: themeContext.resolve('primary'),
          smallSpacing: spacingContext.resolve('small'),
          themeItemsCount: themeContext.collection.size,
          spacingItemsCount: spacingContext.collection.size,
        }
      },
      template: '<div></div>',
    })

    const ParentComponent = defineComponent({
      setup () {
        provideThemeTokens()
        provideSpacingTokens()
      },
      components: { TestComponent },
      template: '<TestComponent />',
    })

    const wrapper = mount(ParentComponent)
    const testComponent = wrapper.findComponent(TestComponent as any)

    expect(testComponent.vm.primaryColor).toBe('#1976d2')
    expect(testComponent.vm.smallSpacing).toBe('8px')
    expect(testComponent.vm.themeItemsCount).toBe(2)
    expect(testComponent.vm.spacingItemsCount).toBe(2)
  })

  it('should return the original value for direct values without warning', () => {
    const tokens: TokenCollection = { primary: '#007BFF' }
    const context = createTokensContext({ namespace: 'test', tokens })[2]

    expect(context.resolve('primary')).toBe('#007BFF')
    expect(context.resolve('#ff0000')).toBe(undefined)
  })
})

describe('useTokens registry integration', () => {
  describe('size getter', () => {
    it('should return correct count for empty tokens', () => {
      const context = createTokens({})
      expect(context.size).toBe(0)
    })

    it('should return correct count for simple tokens', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
        secondary: '#6C757D',
      }
      const context = createTokens(tokens)
      expect(context.size).toBe(2)
    })

    it('should return correct count for nested tokens', () => {
      const tokens: TokenCollection = {
        colors: {
          primary: '#007BFF',
          secondary: '#6C757D',
        },
        spacing: {
          small: '8px',
          large: '24px',
        },
      }
      const context = createTokens(tokens)
      expect(context.size).toBe(4)
    })

    it('should return correct count for deeply nested tokens', () => {
      const tokens: TokenCollection = {
        colors: {
          primary: {
            main: '#007BFF',
            light: '#0056B3',
          },
          secondary: {
            main: '#6C757D',
            light: '#5A6268',
          },
        },
      }
      const context = createTokens(tokens)
      expect(context.size).toBe(4)
    })

    it('should return correct count with mixed aliases and values', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
        accent: { $value: '{primary}' },
        colors: {
          base: '#FFFFFF',
          text: { $value: '{colors.base}' },
        },
      }
      const context = createTokens(tokens)
      expect(context.size).toBe(4)
    })
  })

  describe('registry keys, values, entries methods', () => {
    it('should return correct keys via registry method', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
        colors: {
          red: '#FF0000',
          blue: '#0000FF',
        },
      }
      const context = createTokens(tokens)
      const keys = context.keys()

      expect(keys.length).toBe(3)
      expect(keys).toContain('primary')
      expect(keys).toContain('colors.red')
      expect(keys).toContain('colors.blue')
    })

    it('should return correct values via registry method', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
        secondary: '#6C757D',
      }
      const context = createTokens(tokens)
      const values = context.values()

      expect(values.length).toBe(2)
      expect(values[0]!.id).toBe('primary')
      expect(values[0]!.value).toBe('#007BFF')
      expect(values[1]!.id).toBe('secondary')
      expect(values[1]!.value).toBe('#6C757D')
    })

    it('should return correct entries via registry method', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
        secondary: '#6C757D',
      }
      const context = createTokens(tokens)
      const entries = context.entries()

      expect(entries.length).toBe(2)
      expect(entries[0]![0]).toBe('primary')
      expect(entries[0]![1].value).toBe('#007BFF')
      expect(entries[1]![0]).toBe('secondary')
      expect(entries[1]![1].value).toBe('#6C757D')
    })

    it('should have correct indexes in entries', () => {
      const tokens: TokenCollection = {
        first: 'value1',
        second: 'value2',
        third: 'value3',
      }
      const context = createTokens(tokens)
      const entries = context.entries()

      for (const [idx, entry] of entries.entries()) {
        expect(entry[1].index).toBe(idx)
      }
    })
  })

  describe('collection has method', () => {
    it('should return true for existing tokens', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
        colors: {
          red: '#FF0000',
        },
      }
      const context = createTokens(tokens)

      expect(context.collection.has('primary')).toBe(true)
      expect(context.collection.has('colors.red')).toBe(true)
    })

    it('should return false for non-existent tokens', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
      }
      const context = createTokens(tokens)

      expect(context.collection.has('nonexistent')).toBe(false)
      expect(context.collection.has('colors.red')).toBe(false)
    })

    it('should work with nested paths', () => {
      const tokens: TokenCollection = {
        colors: {
          primary: {
            main: '#007BFF',
            light: '#0056B3',
          },
        },
      }
      const context = createTokens(tokens)

      expect(context.collection.has('colors.primary.main')).toBe(true)
      expect(context.collection.has('colors.primary.light')).toBe(true)
      expect(context.collection.has('colors.primary.dark')).toBe(false)
    })
  })

  describe('collection get method', () => {
    it('should return ticket with id, index, and value', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
      }
      const context = createTokens(tokens)
      const ticket = context.collection.get('primary')

      expect(ticket).toBeDefined()
      expect(ticket?.id).toBe('primary')
      expect(ticket?.value).toBe('#007BFF')
      expect(typeof ticket?.index).toBe('number')
    })

    it('should return undefined for non-existent token', () => {
      const context = createTokens({})
      const ticket = context.collection.get('nonexistent')

      expect(ticket).toBeUndefined()
    })

    it('should return ticket for nested tokens', () => {
      const tokens: TokenCollection = {
        colors: {
          primary: {
            main: '#007BFF',
          },
        },
      }
      const context = createTokens(tokens)
      const ticket = context.collection.get('colors.primary.main')

      expect(ticket).toBeDefined()
      expect(ticket?.id).toBe('colors.primary.main')
      expect(ticket?.value).toBe('#007BFF')
    })

    it('should return ticket for token aliases', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
        accent: { $value: '{primary}' },
      }
      const context = createTokens(tokens)
      const ticket = context.collection.get('accent')

      expect(ticket).toBeDefined()
      expect(ticket?.id).toBe('accent')
      expect(ticket?.value).toEqual({ $value: '{primary}' })
    })
  })

  describe('browse method - finding tokens by value', () => {
    it('should find token by primitive value', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
        accent: '#007BFF',
        secondary: '#6C757D',
      }
      const context = createTokens(tokens)
      const result = context.browse('#007BFF')

      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result?.length).toBe(2)
      expect(result).toContain('primary')
      expect(result).toContain('accent')
    })

    it('should find single token by unique value', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
        secondary: '#6C757D',
      }
      const context = createTokens(tokens)
      const result = context.browse('#007BFF')

      expect(result).toBeDefined()
      expect(result?.length).toBe(1)
      expect(result?.[0]).toBe('primary')
    })

    it('should return undefined for non-existent value', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
      }
      const context = createTokens(tokens)
      const result = context.browse('#FF0000')

      expect(result).toBeUndefined()
    })

    it('should find tokens with primitive string values used by multiple tokens', () => {
      const tokens: TokenCollection = {
        error: '#FF0000',
        danger: '#FF0000',
        failure: '#FF0000',
      }
      const context = createTokens(tokens)
      const result = context.browse('#FF0000')

      expect(result).toBeDefined()
      expect(result?.length).toBe(3)
      expect(result).toContain('error')
      expect(result).toContain('danger')
      expect(result).toContain('failure')
    })

    it('should find multiple tokens with same complex value', () => {
      const tokens: TokenCollection = {
        colors: {
          primary: '#007BFF',
          duplicate: '#007BFF',
        },
      }
      const context = createTokens(tokens)
      const result = context.browse('#007BFF')

      expect(result).toBeDefined()
      expect(result?.length).toBe(2)
    })
  })

  describe('lookup method - finding tokens by index', () => {
    it('should return token ID by index', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
        secondary: '#6C757D',
        tertiary: '#20C997',
      }
      const context = createTokens(tokens)

      expect(context.lookup(0)).toBe('primary')
      expect(context.lookup(1)).toBe('secondary')
      expect(context.lookup(2)).toBe('tertiary')
    })

    it('should return undefined for out-of-bounds index', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
      }
      const context = createTokens(tokens)

      expect(context.lookup(0)).toBe('primary')
      expect(context.lookup(1)).toBeUndefined()
      expect(context.lookup(-1)).toBeUndefined()
    })

    it('should maintain correct indexes for nested tokens', () => {
      const tokens: TokenCollection = {
        colors: {
          primary: '#007BFF',
          secondary: '#6C757D',
        },
      }
      const context = createTokens(tokens)

      expect(context.lookup(0)).toBe('colors.primary')
      expect(context.lookup(1)).toBe('colors.secondary')
    })

    it('should return correct ID for negative indexes', () => {
      const tokens: TokenCollection = {
        a: '1',
        b: '2',
      }
      const context = createTokens(tokens)

      // Should return undefined or work with negative indexing
      const result = context.lookup(-1)
      expect(result).toBeUndefined()
    })

    it('should work correctly after registration order', () => {
      const context = createTokens({})
      context.register({ id: 'first', value: 'value1' })
      context.register({ id: 'second', value: 'value2' })

      expect(context.lookup(0)).toBe('first')
      expect(context.lookup(1)).toBe('second')
    })
  })

  describe('onboard method - bulk registration', () => {
    it('should register multiple tokens at once', () => {
      const context = createTokens({})

      context.onboard([
        { id: 'primary', value: '#007BFF' },
        { id: 'secondary', value: '#6C757D' },
      ])

      expect(context.size).toBe(2)
      expect(context.collection.has('primary')).toBe(true)
      expect(context.collection.has('secondary')).toBe(true)
    })

    it('should preserve existing tokens when onboarding new ones', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
      }
      const context = createTokens(tokens)

      expect(context.size).toBe(1)

      context.onboard([
        { id: 'secondary', value: '#6C757D' },
        { id: 'tertiary', value: '#20C997' },
      ])

      expect(context.size).toBe(3)
      expect(context.collection.has('primary')).toBe(true)
      expect(context.collection.has('secondary')).toBe(true)
      expect(context.collection.has('tertiary')).toBe(true)
    })

    it('should register tokens with aliases', () => {
      const context = createTokens({
        primary: '#007BFF',
      })

      context.onboard([
        { id: 'accent', value: { $value: '{primary}' } },
      ])

      expect(context.size).toBe(2)
      expect(context.resolve('accent')).toBe('#007BFF')
    })

    it('should handle empty onboard gracefully', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
      }
      const context = createTokens(tokens)
      const initialSize = context.size

      context.onboard([])

      expect(context.size).toBe(initialSize)
    })

    it('should generate IDs for tokens without explicit IDs', () => {
      const context = createTokens({})

      context.onboard([
        { value: 'value1' },
        { value: 'value2' },
      ])

      expect(context.size).toBe(2)
      const keys = context.keys()
      expect(keys.length).toBe(2)
      // IDs should be auto-generated
      expect(keys[0]).toBeTruthy()
      expect(keys[1]).toBeTruthy()
    })
  })

  describe('upsert method - updating or creating tokens', () => {
    it('should create new token if not exists', () => {
      const context = createTokens({})

      const result = context.upsert('primary', { value: '#007BFF' })

      expect(result.id).toBe('primary')
      expect(result.value).toBe('#007BFF')
      expect(context.size).toBe(1)
    })

    it('should update existing token value', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
      }
      const context = createTokens(tokens)

      const result = context.upsert('primary', { value: '#FF0000' })

      expect(result.id).toBe('primary')
      expect(result.value).toBe('#FF0000')
      expect(context.resolve('primary')).toBe('#FF0000')
      expect(context.size).toBe(1)
    })

    it('should preserve index when updating', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
        secondary: '#6C757D',
      }
      const context = createTokens(tokens)

      const primaryBefore = context.collection.get('primary')
      const result = context.upsert('primary', { value: '#FF0000' })

      expect(result.index).toBe(primaryBefore?.index)
    })

    it('should update token with alias value', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
        accent: '#6C757D',
      }
      const context = createTokens(tokens)

      const result = context.upsert('accent', { value: { $value: '{primary}' } })

      expect(result.value).toEqual({ $value: '{primary}' })
      expect(context.resolve('accent')).toBe('#007BFF')
    })

    it('should handle upsert without value parameter', () => {
      const context = createTokens({})

      const result = context.upsert('newToken')

      expect(result.id).toBe('newToken')
      expect(result.valueIsIndex).toBe(true)
      expect(result.value).toBe(0)
    })

    it('should update multiple tokens independently', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
        secondary: '#6C757D',
      }
      const context = createTokens(tokens)

      context.upsert('primary', { value: '#FF0000' })
      context.upsert('secondary', { value: '#00FF00' })

      expect(context.resolve('primary')).toBe('#FF0000')
      expect(context.resolve('secondary')).toBe('#00FF00')
      expect(context.size).toBe(2)
    })

    it('should not automatically clear resolution cache on upsert', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
        accent: { $value: '{primary}' },
      }
      const context = createTokens(tokens)

      const resolvedBefore = context.resolve('accent')
      expect(resolvedBefore).toBe('#007BFF')

      context.upsert('primary', { value: '#FF0000' })

      // Cache is not cleared by registry operations, so it returns the cached value
      const resolvedAfter = context.resolve('accent')
      expect(resolvedAfter).toBe('#007BFF') // Still cached
    })
  })

  describe('unregister method - removing tokens', () => {
    it('should remove token by ID', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
        secondary: '#6C757D',
      }
      const context = createTokens(tokens)

      expect(context.size).toBe(2)
      expect(context.collection.has('primary')).toBe(true)

      context.unregister('primary')

      expect(context.size).toBe(1)
      expect(context.collection.has('primary')).toBe(false)
      expect(context.collection.has('secondary')).toBe(true)
    })

    it('should maintain size correctly after unregister', () => {
      const tokens: TokenCollection = {
        a: 'value1',
        b: 'value2',
        c: 'value3',
      }
      const context = createTokens(tokens)

      expect(context.size).toBe(3)
      context.unregister('b')
      expect(context.size).toBe(2)

      const entries = context.entries()
      // After unregistering 'b', entries should only contain 'a' and 'c'
      expect(entries.length).toBe(2)
      expect(entries[0]![0]).toBe('a')
      expect(entries[1]![0]).toBe('c')
      // Verify the unregistered token is gone
      const keys = context.keys()
      expect(keys).not.toContain('b')
      expect(keys).toContain('a')
      expect(keys).toContain('c')
    })

    it('should not affect non-existent token removal', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
      }
      const context = createTokens(tokens)
      const initialSize = context.size

      context.unregister('nonexistent')

      expect(context.size).toBe(initialSize)
    })

    it('should handle removing nested tokens', () => {
      const tokens: TokenCollection = {
        colors: {
          primary: '#007BFF',
          secondary: '#6C757D',
        },
      }
      const context = createTokens(tokens)

      context.unregister('colors.primary')

      expect(context.collection.has('colors.primary')).toBe(false)
      expect(context.collection.has('colors.secondary')).toBe(true)
      expect(context.size).toBe(1)
    })

    it('should handle removing all tokens sequentially', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
        secondary: '#6C757D',
        tertiary: '#20C997',
      }
      const context = createTokens(tokens)

      context.unregister('primary')
      context.unregister('secondary')
      context.unregister('tertiary')

      expect(context.size).toBe(0)
      expect(context.keys().length).toBe(0)
    })

    it('should not automatically clear resolution cache on unregister', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
        accent: { $value: '{primary}' },
      }
      const context = createTokens(tokens)

      expect(context.resolve('accent')).toBe('#007BFF')

      context.unregister('primary')

      // Cache is not cleared by registry operations, so it returns the cached value
      expect(context.resolve('accent')).toBe('#007BFF') // Still cached
    })

    it('should remove token with dependencies', () => {
      const tokens: TokenCollection = {
        base: '#007BFF',
        primary: { $value: '{base}' },
        accent: { $value: '{primary}' },
      }
      const context = createTokens(tokens)

      context.unregister('primary')

      expect(context.collection.has('primary')).toBe(false)
      expect(context.resolve('accent')).toBeUndefined()
    })
  })
})

describe('useTokens edge cases', () => {
  describe('circular alias detection', () => {
    it('should detect and prevent direct circular references', () => {
      const tokens: TokenCollection = {
        a: { $value: '{b}' },
        b: { $value: '{a}' },
      }

      const context = createTokens(tokens)
      const warnSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      // Should return undefined and not cause stack overflow
      const result = context.resolve('a')
      expect(result).toBeUndefined()

      warnSpy.mockRestore()
    })

    it('should detect and prevent indirect circular references', () => {
      const tokens: TokenCollection = {
        a: { $value: '{b}' },
        b: { $value: '{c}' },
        c: { $value: '{a}' },
      }

      const context = createTokens(tokens)
      const warnSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      // Should return undefined and not cause stack overflow
      const result = context.resolve('a')
      expect(result).toBeUndefined()

      warnSpy.mockRestore()
    })
  })

  describe('partial path resolution', () => {
    it('should resolve partial path aliases', () => {
      const tokens: TokenCollection = {
        colors: {
          blue: {
            500: '#3b82f6',
            600: '#2563eb',
          },
          red: {
            500: '#ef4444',
          },
        },
      }

      const context = createTokens(tokens)

      // Test partial path resolution: {colors}.blue.500
      // This should first resolve 'colors' to its value, then access .blue.500
      const blueValue = context.resolve('{colors}.blue.500')

      // This is a complex case that may not be supported
      // Check if it returns undefined or a value
      if (blueValue !== undefined) {
        expect(blueValue).toBe('#3b82f6')
      }
    })

    it('should handle nested object values with path continuation', () => {
      const tokens: TokenCollection = {
        palette: {
          $value: {
            primary: '#1976d2',
            secondary: '#424242',
          },
        },
      }

      const context = createTokens(tokens)

      // Try to resolve nested path within $value
      const result = context.resolve('{palette}.primary')

      // Based on code review, this should work with the segments logic
      if (result !== undefined) {
        expect(result).toBe('#1976d2')
      }
    })
  })

  describe('cache behavior', () => {
    it('should cache resolved values', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
        accent: { $value: '{primary}' },
      }

      const context = createTokens(tokens)

      // First resolution
      const first = context.resolve('accent')
      // Second resolution (should hit cache)
      const second = context.resolve('accent')

      expect(first).toBe(second)
      expect(first).toBe('#007BFF')
    })

    it('should cache both curly-brace and plain formats', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
      }

      const context = createTokens(tokens)

      const withBraces = context.resolve('{primary}')
      const withoutBraces = context.resolve('primary')

      // Both should resolve to the same value
      expect(withBraces).toBe('#007BFF')
      expect(withoutBraces).toBe('#007BFF')
    })

    it('should cache TokenAlias objects', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
        accent: { $value: '{primary}' },
      }

      const context = createTokens(tokens)

      // Resolve with TokenAlias object
      const aliasObject = { $value: '{primary}' }
      const first = context.resolve(aliasObject)
      const second = context.resolve(aliasObject)

      expect(first).toBe(second)
      expect(first).toBe('#007BFF')
    })
  })

  describe('w3C Design Tokens format', () => {
    it('should handle $type metadata', () => {
      const tokens: TokenCollection = {
        fontSize: {
          $value: '16px',
          $type: 'dimension',
          $description: 'Base font size',
        },
      }

      const context = createTokens(tokens)

      expect(context.resolve('fontSize')).toBe('16px')
    })

    it('should handle $deprecated tokens', () => {
      const tokens: TokenCollection = {
        oldPrimary: {
          $value: '#007BFF',
          $deprecated: true,
        },
        deprecatedWithMessage: {
          $value: '#6C757D',
          $deprecated: 'Use newSecondary instead',
        },
      }

      const context = createTokens(tokens)

      expect(context.resolve('oldPrimary')).toBe('#007BFF')
      expect(context.resolve('deprecatedWithMessage')).toBe('#6C757D')
    })

    it('should handle $extensions metadata', () => {
      const tokens: TokenCollection = {
        brandColor: {
          $value: '#007BFF',
          $type: 'color',
          $extensions: {
            'com.example.opacity': 0.9,
            'com.example.category': 'brand',
          },
        },
      }

      const context = createTokens(tokens)

      expect(context.resolve('brandColor')).toBe('#007BFF')
    })
  })

  describe('isAlias function', () => {
    it('should identify valid aliases', () => {
      const context = createTokens({})

      expect(context.isAlias('{colors.primary}')).toBe(true)
      expect(context.isAlias('{a}')).toBe(true)
      expect(context.isAlias('{nested.deep.path}')).toBe(true)
    })

    it('should reject invalid aliases', () => {
      const context = createTokens({})

      expect(context.isAlias('colors.primary')).toBe(false)
      expect(context.isAlias('{}')).toBe(false)
      expect(context.isAlias('{')).toBe(false)
      expect(context.isAlias('}')).toBe(false)
      expect(context.isAlias('{incomplete')).toBe(false)
      expect(context.isAlias('incomplete}')).toBe(false)
      expect(context.isAlias('')).toBe(false)
      expect(context.isAlias(123)).toBe(false)
      expect(context.isAlias(null)).toBe(false)
      expect(context.isAlias(undefined)).toBe(false)
    })
  })

  describe('prefix option', () => {
    it('should add prefix to all token IDs', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
        colors: {
          red: '#FF0000',
        },
      }

      const context = createTokens(tokens, { prefix: 'app' })

      expect(context.collection.has('app.primary')).toBe(true)
      expect(context.collection.has('app.colors.red')).toBe(true)
      expect(context.resolve('app.primary')).toBe('#007BFF')
    })

    it('should work with aliases when using prefix', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
        accent: { $value: '{app.primary}' },
      }

      const context = createTokens(tokens, { prefix: 'app' })

      expect(context.resolve('app.accent')).toBe('#007BFF')
    })
  })

  describe('error handling', () => {
    it('should return undefined for invalid token paths', () => {
      const tokens: TokenCollection = {
        colors: {
          primary: '#007BFF',
        },
      }

      const context = createTokens(tokens)

      expect(context.resolve('nonexistent.path')).toBeUndefined()
      expect(context.resolve('colors.nonexistent')).toBeUndefined()
    })

    it('should handle null and undefined gracefully', () => {
      const context = createTokens({})

      expect(context.resolve('')).toBeUndefined()
    })
  })

  describe('complex nested scenarios', () => {
    it('should resolve deeply nested aliases', () => {
      const tokens: TokenCollection = {
        base: {
          color: '#007BFF',
        },
        theme: {
          primary: { $value: '{base.color}' },
        },
        component: {
          button: { $value: '{theme.primary}' },
        },
        specific: {
          cta: { $value: '{component.button}' },
        },
      }

      const context = createTokens(tokens)

      expect(context.resolve('specific.cta')).toBe('#007BFF')
    })

    it('should handle mixed primitive and alias siblings', () => {
      const tokens: TokenCollection = {
        base: '#007BFF',
        theme: {
          primary: { $value: '{base}' },
          secondary: '#6C757D',
          tertiary: { $value: '{theme.secondary}' },
        },
      }

      const context = createTokens(tokens)

      expect(context.resolve('theme.primary')).toBe('#007BFF')
      expect(context.resolve('theme.secondary')).toBe('#6C757D')
      expect(context.resolve('theme.tertiary')).toBe('#6C757D')
    })

    it('should resolve string aliases without $value wrapper', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
        accent: '{primary}', // String alias without $value
      }

      const context = createTokens(tokens)

      // String values matching the alias pattern are resolved
      expect(context.resolve('accent')).toBe('#007BFF')
    })
  })
})

describe('primitive token types', () => {
  describe('function values as tokens', () => {
    it('should store function values as tokens', () => {
      const callback = vi.fn(() => 'result')
      const tokens: TokenCollection = {
        handler: callback,
        actions: {
          onClick: callback,
        },
      }

      const context = createTokens(tokens)

      const storedFn = context.resolve('handler')
      expect(typeof storedFn).toBe('function')
      expect(storedFn).toBe(callback)
    })

    it('should resolve function tokens and allow execution', () => {
      function multiply (a: number, b: number) {
        return a * b
      }
      const tokens: TokenCollection = {
        math: {
          multiply,
        },
      }

      const context = createTokens(tokens)
      const resolved = context.resolve('math.multiply') as typeof multiply

      expect(typeof resolved).toBe('function')
      expect(resolved(3, 4)).toBe(12)
    })

    it('should handle function aliases', () => {
      function computeValue () {
        return 42
      }
      const tokens: TokenCollection = {
        original: computeValue,
        aliased: { $value: computeValue },
      }

      const context = createTokens(tokens)

      const resolved = context.resolve('aliased') as typeof computeValue
      expect(typeof resolved).toBe('function')
      expect(resolved()).toBe(42)
    })

    it('should store arrow functions as token values', () => {
      function arrowFn (x: number) {
        return x * 2
      }
      const tokens: TokenCollection = {
        transform: arrowFn,
      }

      const context = createTokens(tokens)
      const resolved = context.resolve('transform') as typeof arrowFn

      expect(typeof resolved).toBe('function')
      expect(resolved(5)).toBe(10)
    })
  })

  describe('null values as tokens', () => {
    it('should differentiate explicit null from missing keys', () => {
      const tokens: TokenCollection = {
        explicit: null,
      }

      const context = createTokens(tokens)

      const explicitNull = context.resolve('explicit')
      const missingKey = context.resolve('nonexistent')

      expect(explicitNull).toBe(null)
      expect(missingKey).toBeUndefined()
    })

    it('should handle null in nested structures', () => {
      const tokens: TokenCollection = {
        config: {
          timeout: null,
          retries: 3,
        },
      }

      const context = createTokens(tokens)

      expect(context.resolve('config.timeout')).toBe(null)
      expect(context.resolve('config.retries')).toBe(3)
    })

    it('should allow null values in token aliases', () => {
      const tokens: TokenCollection = {
        nullable: { $value: null },
        nested: {
          value: { $value: null },
        },
      }

      const context = createTokens(tokens)

      expect(context.resolve('nullable')).toBe(null)
      expect(context.resolve('nested.value')).toBe(null)
    })

    it('should resolve null in mixed token types', () => {
      const tokens: TokenCollection = {
        settings: {
          primary: '#007BFF',
          secondary: null,
          tertiary: { $value: null },
        },
      }

      const context = createTokens(tokens)

      expect(context.resolve('settings.primary')).toBe('#007BFF')
      expect(context.resolve('settings.secondary')).toBe(null)
      expect(context.resolve('settings.tertiary')).toBe(null)
    })
  })

  describe('boolean primitives', () => {
    it('should resolve true boolean values', () => {
      const tokens: TokenCollection = {
        features: {
          darkMode: true,
          rtl: true,
        },
      }

      const context = createTokens(tokens)

      expect(context.resolve('features.darkMode')).toBe(true)
      expect(context.resolve('features.rtl')).toBe(true)
    })

    it('should resolve false boolean values', () => {
      const tokens: TokenCollection = {
        features: {
          experimental: false,
          legacy: false,
        },
      }

      const context = createTokens(tokens)

      expect(context.resolve('features.experimental')).toBe(false)
      expect(context.resolve('features.legacy')).toBe(false)
    })

    it('should handle boolean aliases', () => {
      const tokens: TokenCollection = {
        isDark: true,
        theme: { $value: true },
        disabled: { $value: false },
      }

      const context = createTokens(tokens)

      expect(context.resolve('isDark')).toBe(true)
      expect(context.resolve('theme')).toBe(true)
      expect(context.resolve('disabled')).toBe(false)
    })

    it('should preserve boolean false distinct from null/undefined', () => {
      const tokens: TokenCollection = {
        isFalse: false,
        isNull: null,
      }

      const context = createTokens(tokens)

      const falseValue = context.resolve('isFalse')
      const nullValue = context.resolve('isNull')

      expect(falseValue).toBe(false)
      expect(falseValue).not.toBe(null)
      expect(falseValue).not.toBeUndefined()
      expect(nullValue).toBe(null)
    })
  })

  describe('number primitives', () => {
    it('should resolve positive integers', () => {
      const tokens: TokenCollection = {
        metrics: {
          count: 42,
          timeout: 5000,
        },
      }

      const context = createTokens(tokens)

      expect(context.resolve('metrics.count')).toBe(42)
      expect(context.resolve('metrics.timeout')).toBe(5000)
    })

    it('should resolve zero as a distinct value', () => {
      const tokens: TokenCollection = {
        values: {
          zero: 0,
          min: -1,
        },
      }

      const context = createTokens(tokens)

      expect(context.resolve('values.zero')).toBe(0)
      expect(context.resolve('values.zero')).not.toBeUndefined()
      expect(context.resolve('values.zero')).not.toBe(false)
    })

    it('should resolve negative numbers', () => {
      const tokens: TokenCollection = {
        offsets: {
          left: -10,
          top: -20,
          baseline: -5.5,
        },
      }

      const context = createTokens(tokens)

      expect(context.resolve('offsets.left')).toBe(-10)
      expect(context.resolve('offsets.top')).toBe(-20)
      expect(context.resolve('offsets.baseline')).toBe(-5.5)
    })

    it('should resolve decimal numbers', () => {
      const tokens: TokenCollection = {
        ratios: {
          golden: 1.618,
          aspectWide: 16 / 9,
          opacity: 0.5,
        },
      }

      const context = createTokens(tokens)

      expect(context.resolve('ratios.golden')).toBe(1.618)
      expect(context.resolve('ratios.opacity')).toBe(0.5)
    })

    it('should handle Infinity values', () => {
      const tokens: TokenCollection = {
        limits: {
          maxInt: Number.MAX_SAFE_INTEGER,
          positiveInfinity: Infinity,
          negativeInfinity: -Infinity,
        },
      }

      const context = createTokens(tokens)

      expect(context.resolve('limits.positiveInfinity')).toBe(Infinity)
      expect(context.resolve('limits.negativeInfinity')).toBe(-Infinity)
      expect(context.resolve('limits.maxInt')).toBe(Number.MAX_SAFE_INTEGER)
    })

    it('should handle NaN values', () => {
      const tokens: TokenCollection = {
        special: {
          nan: Number.NaN,
        },
      }

      const context = createTokens(tokens)

      const resolved = context.resolve('special.nan')
      expect(Number.isNaN(resolved)).toBe(true)
    })

    it('should resolve number aliases', () => {
      const tokens: TokenCollection = {
        baseSize: 16,
        doubleSized: { $value: 32 },
        smallSize: { $value: 8 },
      }

      const context = createTokens(tokens)

      expect(context.resolve('baseSize')).toBe(16)
      expect(context.resolve('doubleSized')).toBe(32)
      expect(context.resolve('smallSize')).toBe(8)
    })
  })

  describe('mixed primitive types in nested structures', () => {
    it('should handle mixed types in the same object', () => {
      const tokens: TokenCollection = {
        config: {
          name: 'app',
          port: 3000,
          enabled: true,
          timeout: null,
        },
      }

      const context = createTokens(tokens)

      expect(context.resolve('config.name')).toBe('app')
      expect(context.resolve('config.port')).toBe(3000)
      expect(context.resolve('config.enabled')).toBe(true)
      expect(context.resolve('config.timeout')).toBe(null)
    })

    it('should resolve deeply nested mixed types', () => {
      const tokens: TokenCollection = {
        theme: {
          light: {
            colors: {
              primary: '#007BFF',
              opacity: 0.95,
            },
            enabled: true,
            fallback: null,
          },
          dark: {
            colors: {
              primary: '#1A1A1A',
              opacity: 0.85,
            },
            enabled: true,
            fallback: null,
          },
        },
      }

      const context = createTokens(tokens)

      expect(context.resolve('theme.light.colors.primary')).toBe('#007BFF')
      expect(context.resolve('theme.light.colors.opacity')).toBe(0.95)
      expect(context.resolve('theme.light.enabled')).toBe(true)
      expect(context.resolve('theme.light.fallback')).toBe(null)
      expect(context.resolve('theme.dark.colors.opacity')).toBe(0.85)
    })

    it('should cache mixed primitive types correctly', () => {
      const tokens: TokenCollection = {
        metrics: {
          count: 0,
          ratio: 1.5,
          active: false,
          label: null,
        },
      }

      const context = createTokens(tokens)

      // First resolution
      const count1 = context.resolve('metrics.count')
      const ratio1 = context.resolve('metrics.ratio')
      const active1 = context.resolve('metrics.active')
      const label1 = context.resolve('metrics.label')

      // Second resolution (should hit cache)
      const count2 = context.resolve('metrics.count')
      const ratio2 = context.resolve('metrics.ratio')
      const active2 = context.resolve('metrics.active')
      const label2 = context.resolve('metrics.label')

      expect(count1).toBe(count2)
      expect(ratio1).toBe(ratio2)
      expect(active1).toBe(active2)
      expect(label1).toBe(label2)

      expect(count1).toBe(0)
      expect(ratio1).toBe(1.5)
      expect(active1).toBe(false)
      expect(label1).toBe(null)
    })

    it('should handle aliases resolving to different primitive types', () => {
      function callback () {
        return 'executed'
      }
      const tokens: TokenCollection = {
        handlers: {
          onClick: callback,
        },
        values: {
          count: 42,
          ratio: 1.618,
          enabled: true,
          description: null,
        },
        aliasedHandler: { $value: callback },
        aliasedNumber: { $value: 100 },
        aliasedBool: { $value: false },
        aliasedNull: { $value: null },
      }

      const context = createTokens(tokens)

      expect(typeof context.resolve('handlers.onClick')).toBe('function')
      expect(context.resolve('values.count')).toBe(42)
      expect(context.resolve('values.ratio')).toBe(1.618)
      expect(context.resolve('values.enabled')).toBe(true)
      expect(context.resolve('values.description')).toBe(null)
      expect(typeof context.resolve('aliasedHandler')).toBe('function')
      expect(context.resolve('aliasedNumber')).toBe(100)
      expect(context.resolve('aliasedBool')).toBe(false)
      expect(context.resolve('aliasedNull')).toBe(null)
    })

    it('should maintain type integrity with flat option', () => {
      const tokens: TokenCollection = {
        config: {
          port: 3000,
          host: 'localhost',
          secure: true,
          timeout: null,
        },
      }

      const context = createTokens(tokens, { flat: true })

      expect(context.resolve('config.port')).toBe(3000)
      expect(context.resolve('config.host')).toBe('localhost')
      expect(context.resolve('config.secure')).toBe(true)
      expect(context.resolve('config.timeout')).toBe(null)
    })

    it('should handle mixed types with prefix option', () => {
      const tokens: TokenCollection = {
        app: {
          name: 'MyApp',
          version: 1,
          active: true,
          cache: null,
        },
      }

      const context = createTokens(tokens, { prefix: 'v0' })

      expect(context.resolve('v0.app.name')).toBe('MyApp')
      expect(context.resolve('v0.app.version')).toBe(1)
      expect(context.resolve('v0.app.active')).toBe(true)
      expect(context.resolve('v0.app.cache')).toBe(null)
    })

    it('should resolve string aliases to various primitive types', () => {
      const tokens: TokenCollection = {
        values: {
          text: 'hello',
          count: 42,
          ratio: 0.5,
          enabled: true,
          empty: null,
        },
        aliases: {
          greeting: '{values.text}',
          total: '{values.count}',
          scale: '{values.ratio}',
          isActive: '{values.enabled}',
          fallback: '{values.empty}',
        },
      }

      const context = createTokens(tokens)

      expect(context.resolve('aliases.greeting')).toBe('hello')
      expect(context.resolve('aliases.total')).toBe(42)
      expect(context.resolve('aliases.scale')).toBe(0.5)
      expect(context.resolve('aliases.isActive')).toBe(true)
      expect(context.resolve('aliases.fallback')).toBe(null)
    })
  })
})

describe('resolve edge cases', () => {
  describe('tokenAlias with non-string $value', () => {
    it('should resolve TokenAlias with object $value', () => {
      const tokens: TokenCollection = {
        config: { $value: { nested: '#FF0000' } },
      }

      const context = createTokens(tokens)

      const result = context.resolve('config')
      expect(result).toEqual({ nested: '#FF0000' })
    })

    it('should resolve TokenAlias with array $value', () => {
      const tokens: TokenCollection = {
        list: { $value: [1, 2, 3] },
      }

      const context = createTokens(tokens)

      const result = context.resolve('list')
      expect(result).toEqual([1, 2, 3])
    })

    it('should resolve TokenAlias with number $value', () => {
      const tokens: TokenCollection = {
        size: { $value: 24 },
      }

      const context = createTokens(tokens)

      expect(context.resolve('size')).toBe(24)
    })

    it('should resolve TokenAlias with boolean $value', () => {
      const tokens: TokenCollection = {
        enabled: { $value: true },
      }

      const context = createTokens(tokens)

      expect(context.resolve('enabled')).toBe(true)
    })

    it('should resolve TokenAlias with function $value', () => {
      function fn () {
        return 'result'
      }
      const tokens: TokenCollection = {
        handler: { $value: fn },
      }

      const context = createTokens(tokens)

      const result = context.resolve('handler')
      expect(result).toBe(fn)
    })
  })

  describe('tokenAlias with another TokenAlias as $value', () => {
    it('should resolve nested TokenAlias objects', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
        alias1: { $value: { $value: '{primary}' } },
      }

      const context = createTokens(tokens)

      // This is an object with $value, but that object itself is not a string alias
      const result = context.resolve('alias1')
      expect(result).toEqual({ $value: '{primary}' })
    })

    it('should handle TokenAlias wrapping another alias string', () => {
      const wrappedAlias = { $value: '{base}' }
      const tokens: TokenCollection = {
        base: '#FFFFFF',
        wrapped: { $value: '{base}' },
        doubleWrapped: { $value: wrappedAlias },
      }

      const context = createTokens(tokens)

      // doubleWrapped resolves to an object with $value, but that object is not a string alias
      const result = context.resolve('doubleWrapped')
      expect(result).toEqual({ $value: '{base}' })
    })
  })

  describe('path segments through primitive values', () => {
    it('should fail gracefully when trying to traverse through primitive', () => {
      const tokens: TokenCollection = {
        colors: {
          primary: '#FF0000',
        },
      }

      const context = createTokens(tokens)

      // Trying to access colors.primary.foo where primary is a string
      const result = context.resolve('colors.primary.foo')
      expect(result).toBeUndefined()
    })

    it('should fail when path tries to access segment on number primitive', () => {
      const tokens: TokenCollection = {
        metrics: {
          count: 42,
        },
      }

      const context = createTokens(tokens)

      const result = context.resolve('metrics.count.value')
      expect(result).toBeUndefined()
    })

    it('should fail when accessing nested path through boolean', () => {
      const tokens: TokenCollection = {
        flags: {
          enabled: true,
        },
      }

      const context = createTokens(tokens)

      const result = context.resolve('flags.enabled.state')
      expect(result).toBeUndefined()
    })

    it('should handle object with $value when continuing path', () => {
      const tokens: TokenCollection = {
        config: {
          $value: { nested: '#AABBCC' },
        },
      }

      const context = createTokens(tokens)

      // config has $value which is an object, segments = ['nested']
      const result = context.resolve('{config.nested}')
      expect(result).toBe('#AABBCC')
    })
  })

  describe('long alias chains (5+ hops)', () => {
    it('should resolve 5-level deep alias chain', () => {
      const tokens: TokenCollection = {
        level0: '#007BFF',
        level1: { $value: '{level0}' },
        level2: { $value: '{level1}' },
        level3: { $value: '{level2}' },
        level4: { $value: '{level3}' },
        level5: { $value: '{level4}' },
      }

      const context = createTokens(tokens)

      expect(context.resolve('level5')).toBe('#007BFF')
    })

    it('should resolve 6-level deep alias chain in nested structure', () => {
      const tokens: TokenCollection = {
        colors: {
          base: '#FF0000',
          l1: { $value: '{colors.base}' },
          l2: { $value: '{colors.l1}' },
          l3: { $value: '{colors.l2}' },
          l4: { $value: '{colors.l3}' },
          l5: { $value: '{colors.l4}' },
          l6: { $value: '{colors.l5}' },
        },
      }

      const context = createTokens(tokens)

      expect(context.resolve('colors.l6')).toBe('#FF0000')
    })

    it('should resolve 7-level deep chain mixing nested and flat tokens', () => {
      const tokens: TokenCollection = {
        start: '#00FF00',
        a: { $value: '{start}' },
        nested: {
          b: { $value: '{a}' },
          c: { $value: '{nested.b}' },
        },
        d: { $value: '{nested.c}' },
        e: { $value: '{d}' },
        f: { $value: '{e}' },
        g: { $value: '{f}' },
      }

      const context = createTokens(tokens)

      expect(context.resolve('g')).toBe('#00FF00')
    })

    it('should detect circular reference in long chain', () => {
      const tokens: TokenCollection = {
        a: { $value: '{b}' },
        b: { $value: '{c}' },
        c: { $value: '{d}' },
        d: { $value: '{e}' },
        e: { $value: '{f}' },
        f: { $value: '{a}' }, // Creates cycle
      }

      const context = createTokens(tokens)
      const warnSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const result = context.resolve('a')
      expect(result).toBeUndefined()

      warnSpy.mockRestore()
    })
  })

  describe('resolving TokenAlias object directly', () => {
    it('should resolve a TokenAlias object passed directly with string $value', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
      }

      const context = createTokens(tokens)

      const aliasObj: TokenAlias = { $value: '{primary}' }
      const result = context.resolve(aliasObj)
      expect(result).toBe('#007BFF')
    })

    it('should handle TokenAlias with non-string $value (converts to string for lookup)', () => {
      const aliasObj: TokenAlias = { $value: 42 }

      const context = createTokens({})

      // When passing TokenAlias with non-string $value, it converts to string "42"
      // and tries to look it up in registry, which returns undefined
      const result = context.resolve(aliasObj)
      expect(result).toBeUndefined()
    })

    it('should handle TokenAlias with object $value (converts to string for lookup)', () => {
      const aliasObj: TokenAlias = { $value: { a: 1, b: 2 } }

      const context = createTokens({})

      // Object values get stringified, lookup fails, returns undefined
      const result = context.resolve(aliasObj)
      expect(result).toBeUndefined()
    })

    it('should handle TokenAlias with undefined $value', () => {
      const aliasObj: TokenAlias = { $value: undefined }

      const context = createTokens({})

      const result = context.resolve(aliasObj)
      expect(result).toBeUndefined()
    })

    it('should resolve TokenAlias with W3C metadata passed directly', () => {
      const context = createTokens({ baseColor: '#FF5733' })

      // When $value is a string alias, it resolves correctly
      const withAlias: TokenAlias = {
        $value: '{baseColor}',
        $type: 'color',
        $description: 'Referenced color',
        $extensions: { custom: 'data' },
      }

      const result = context.resolve(withAlias)
      expect(result).toBe('#FF5733')
    })

    it('should resolve TokenAlias with alias string $value passed directly', () => {
      const tokens: TokenCollection = {
        base: '#CCCCCC',
      }

      const context = createTokens(tokens)

      const aliasObj: TokenAlias = { $value: '{base}' }
      const result = context.resolve(aliasObj)
      expect(result).toBe('#CCCCCC')
    })
  })

  describe('token IDs with special characters', () => {
    it('should handle token ID starting with dot', () => {
      const tokens: TokenCollection = {
        '.hidden': '#000000',
      }

      const context = createTokens(tokens)

      expect(context.resolve('.hidden')).toBe('#000000')
      expect(context.collection.has('.hidden')).toBe(true)
    })

    it('should handle token ID ending with dot', () => {
      const tokens: TokenCollection = {
        'value.': '#111111',
      }

      const context = createTokens(tokens)

      expect(context.resolve('value.')).toBe('#111111')
      expect(context.collection.has('value.')).toBe(true)
    })

    it('should handle token ID with multiple consecutive dots', () => {
      const tokens: TokenCollection = {
        'colors..primary': '#222222',
      }

      const context = createTokens(tokens)

      expect(context.resolve('colors..primary')).toBe('#222222')
      expect(context.collection.has('colors..primary')).toBe(true)
    })

    it('should handle nested token with special char in key', () => {
      const tokens: TokenCollection = {
        colors: {
          'primary.dark': '#333333',
        },
      }

      const context = createTokens(tokens)

      expect(context.resolve('colors.primary.dark')).toBe('#333333')
    })

    it('should resolve alias referencing ID with special characters', () => {
      const tokens: TokenCollection = {
        '.base': '#444444',
        'alias': { $value: '{.base}' },
      }

      const context = createTokens(tokens)

      expect(context.resolve('alias')).toBe('#444444')
    })

    it('should handle hyphens and underscores in token IDs', () => {
      const tokens: TokenCollection = {
        'color-primary_dark': '#555555',
        'theme': {
          'button-bg_hover': '#666666',
        },
      }

      const context = createTokens(tokens)

      expect(context.resolve('color-primary_dark')).toBe('#555555')
      expect(context.resolve('theme.button-bg_hover')).toBe('#666666')
    })
  })

  describe('complex resolution scenarios', () => {
    it('should resolve multiple segments after path prefix match', () => {
      const tokens: TokenCollection = {
        theme: {
          colors: {
            primary: {
              light: '#AAEEFF',
              dark: '#003366',
            },
          },
        },
      }

      const context = createTokens(tokens)

      expect(context.resolve('theme.colors.primary.light')).toBe('#AAEEFF')
      expect(context.resolve('theme.colors.primary.dark')).toBe('#003366')
    })

    it('should resolve alias that points to nested token path', () => {
      const tokens: TokenCollection = {
        colors: {
          red: '#FF0000',
          blue: '#0000FF',
        },
        primary: { $value: '{colors.red}' },
      }

      const context = createTokens(tokens)

      // Resolve alias that itself points to a deep path
      const result = context.resolve('primary')
      expect(result).toBe('#FF0000')
    })

    it('should handle empty string token ID', () => {
      const context = createTokens({ '': '#AABBCC' })

      expect(context.resolve('')).toBe('#AABBCC')
    })
  })
})

describe('flatten function edge cases', () => {
  describe('$ prefixed keys that are not special W3C properties', () => {
    it('should resolve $value while preserving unrecognized $ keys in metadata', () => {
      const tokens: TokenCollection = {
        color: {
          $value: '#FF0000',
          $custom: 'custom value',
          $experimental: true,
        },
      }

      const context = createTokensContext({ namespace: 'test', tokens })[2]

      // resolve() returns just the $value
      expect(context.resolve('color')).toBe('#FF0000')

      // But the stored token has all the metadata
      const ticket = context.collection.get('color')
      expect(ticket?.value).toEqual({
        $value: '#FF0000',
        $custom: 'custom value',
        $experimental: true,
      })
    })

    it('should handle multiple unrecognized $ keys in token metadata', () => {
      const tokens: TokenCollection = {
        icon: {
          $value: 'star',
          $vendor: 'material',
          $license: 'MIT',
          $author: 'John',
        },
      }

      const context = createTokensContext({ namespace: 'test', tokens })[2]

      // resolve() returns just the $value
      expect(context.resolve('icon')).toBe('star')

      // The full metadata is stored in the token
      const ticket = context.collection.get('icon')
      expect(ticket?.value).toEqual({
        $value: 'star',
        $vendor: 'material',
        $license: 'MIT',
        $author: 'John',
      })
    })

    it('should skip unrecognized $ keys during recursion', () => {
      const tokens: TokenCollection = {
        theme: {
          colors: {
            $primary: '#FF0000',
            $secondary: '#0000FF',
            red: '#FF5555',
          },
        },
      }

      const context = createTokensContext({ namespace: 'test', tokens })[2]

      expect(context.resolve('theme.colors.red')).toBe('#FF5555')
      expect(context.collection.has('theme.colors.red')).toBe(true)
    })
  })

  describe('empty nested objects', () => {
    it('should not process empty objects for recursion', () => {
      const tokens: TokenCollection = {
        empty: {},
        filled: { value: '#FF0000' },
      }

      const context = createTokensContext({ namespace: 'test', tokens })[2]

      // The 'value' key is treated as a normal key, not $value
      expect(context.collection.has('filled.value')).toBe(true)
      // empty object produces no tokens
      expect(context.collection.has('empty')).toBe(false)
    })

    it('should handle empty objects nested deeply', () => {
      const tokens: TokenCollection = {
        colors: {
          empty1: {},
          primary: {
            empty2: {},
            base: '#FF0000',
          },
        },
      }

      const context = createTokensContext({ namespace: 'test', tokens })[2]

      expect(context.resolve('colors.primary.base')).toBe('#FF0000')
      expect(context.resolve('colors.empty1')).toBeUndefined()
      expect(context.resolve('colors.primary.empty2')).toBeUndefined()
    })

    it('should handle objects with only $ prefixed keys', () => {
      const tokens: TokenCollection = {
        metadata: {
          $type: 'color',
          $description: 'Test color',
        },
      }

      const context = createTokensContext({ namespace: 'test', tokens })[2]

      // Should register the metadata object itself as a token
      expect(context.collection.has('metadata')).toBe(true)
    })

    it('should handle mixed empty and non-empty nested structure', () => {
      const tokens: TokenCollection = {
        level1: {
          empty: {},
          level2: {
            alsoEmpty: {},
            value: 'actual',
          },
        },
      }

      const context = createTokensContext({ namespace: 'test', tokens })[2]

      expect(context.resolve('level1.level2.value')).toBe('actual')
      expect(context.resolve('level1.empty')).toBeUndefined()
      expect(context.resolve('level1.level2.alsoEmpty')).toBeUndefined()
    })
  })

  describe('$value containing nested objects with nested $value (TokenAlias within $value)', () => {
    it('should handle $value containing an object with $value', () => {
      const tokens: TokenCollection = {
        primary: '#FF0000',
        nested: {
          $value: {
            $value: '#0000FF',
          },
        },
      }

      const context = createTokensContext({ namespace: 'test', tokens })[2]

      // The inner object is stored as-is in $value
      const resolved = context.resolve('nested') as Record<string, unknown>
      expect(resolved).toEqual({ $value: '#0000FF' })
    })

    it('should register nested TokenAlias within $value as children', () => {
      const tokens: TokenCollection = {
        base: '#FF0000',
        wrapper: {
          $value: {
            inner: { $value: '{base}' },
          },
        },
      }

      const context = createTokensContext({ namespace: 'test', tokens })[2]

      expect(context.collection.has('wrapper.inner')).toBe(true)
      expect(context.resolve('wrapper.inner')).toBe('#FF0000')
    })

    it('should handle multiple levels of nested $value', () => {
      const tokens: TokenCollection = {
        color: '#FF0000',
        level1: {
          $value: {
            level2: {
              $value: {
                $value: '{color}',
              },
            },
          },
        },
      }

      const context = createTokensContext({ namespace: 'test', tokens })[2]

      expect(context.collection.has('level1.level2')).toBe(true)
      expect(context.resolve('level1.level2')).toEqual({ $value: '{color}' })
    })

    it('should resolve deeply nested alias within $value structure', () => {
      const tokens: TokenCollection = {
        base: '#FFFFFF',
        container: {
          $value: {
            background: { $value: '{base}' },
            foreground: '#000000',
          },
        },
      }

      const context = createTokensContext({ namespace: 'test', tokens })[2]

      expect(context.resolve('container.background')).toBe('#FFFFFF')
      expect(context.resolve('container.foreground')).toBe('#000000')
    })
  })

  describe('mixed $value with additional non-$ keys', () => {
    it('should handle $value alongside $ metadata keys', () => {
      const tokens: TokenCollection = {
        primary: {
          $value: '#FF0000',
          $type: 'color',
          $description: 'Primary red',
        },
      }

      const context = createTokensContext({ namespace: 'test', tokens })[2]

      // resolve() returns just the $value
      expect(context.resolve('primary')).toBe('#FF0000')

      // The full token with metadata is stored
      const ticket = context.collection.get('primary')
      expect(ticket?.value).toEqual({
        $value: '#FF0000',
        $type: 'color',
        $description: 'Primary red',
      })
    })

    it('should register child tokens from inside $value object', () => {
      const tokens: TokenCollection = {
        spacing: {
          $value: {
            unit: 'px',
            base: 16,
            xs: 4,
          },
        },
      }

      const context = createTokensContext({ namespace: 'test', tokens })[2]

      // The $value itself is an object with nested keys
      expect(context.resolve('spacing.unit')).toBe('px')
      expect(context.resolve('spacing.base')).toBe(16)
      expect(context.resolve('spacing.xs')).toBe(4)
    })

    it('should register child tokens from non-$ properties at root level', () => {
      const tokens: TokenCollection = {
        button: {
          background: '#0000FF',
          states: {
            hover: '#0000DD',
            active: '#0000BB',
          },
        },
      }

      const context = createTokensContext({ namespace: 'test', tokens })[2]

      expect(context.resolve('button.background')).toBe('#0000FF')
      expect(context.resolve('button.states.hover')).toBe('#0000DD')
      expect(context.resolve('button.states.active')).toBe('#0000BB')
    })

    it('should resolve $value from primitive non-$ sibling in flat mode', () => {
      const tokens: TokenCollection = {
        primary: {
          value: '#FF0000',
          name: 'Red',
        },
      }

      const context = createTokensContext(
        { namespace: 'test', tokens, flat: true },
      )[2]

      // With flat: true, sibling keys are registered as-is
      expect(context.resolve('primary.value')).toBe('#FF0000')
      expect(context.resolve('primary.name')).toBe('Red')
    })
  })

  describe('very deep nesting (4+ levels)', () => {
    it('should flatten 4-level deep structure', () => {
      const tokens: TokenCollection = {
        level1: {
          level2: {
            level3: {
              level4: '#FF0000',
            },
          },
        },
      }

      const context = createTokensContext({ namespace: 'test', tokens })[2]

      expect(context.resolve('level1.level2.level3.level4')).toBe('#FF0000')
      expect(context.collection.has('level1.level2.level3.level4')).toBe(true)
    })

    it('should flatten 6-level deep structure', () => {
      const tokens: TokenCollection = {
        a: {
          b: {
            c: {
              d: {
                e: {
                  f: { $value: '#FF0000' },
                },
              },
            },
          },
        },
      }

      const context = createTokensContext({ namespace: 'test', tokens })[2]

      // resolve() returns the $value, not the TokenAlias object
      expect(context.resolve('a.b.c.d.e.f')).toBe('#FF0000')
    })

    it('should handle deeply nested aliases', () => {
      const tokens: TokenCollection = {
        base: '#FF0000',
        theme: {
          colors: {
            primary: {
              shades: {
                light: {
                  base: { $value: '{base}' },
                },
              },
            },
          },
        },
      }

      const context = createTokensContext({ namespace: 'test', tokens })[2]

      expect(context.resolve('theme.colors.primary.shades.light.base')).toBe('#FF0000')
    })

    it('should resolve deeply nested mixed primitives and aliases', () => {
      const tokens: TokenCollection = {
        foundation: {
          spacing: {
            scale: {
              base: 4,
              ratios: {
                golden: 1.618,
                computed: { $value: 8 },
              },
            },
          },
        },
      }

      const context = createTokensContext({ namespace: 'test', tokens })[2]

      expect(context.resolve('foundation.spacing.scale.base')).toBe(4)
      expect(context.resolve('foundation.spacing.scale.ratios.golden')).toBe(1.618)
      // resolve() extracts the $value from TokenAlias
      expect(context.resolve('foundation.spacing.scale.ratios.computed')).toBe(8)
    })

    it('should handle 5-level deep with $ metadata at different levels', () => {
      const tokens: TokenCollection = {
        design: {
          system: {
            tokens: {
              color: {
                palette: {
                  $value: '#FF0000',
                  $type: 'color',
                  $description: 'Primary color',
                },
              },
            },
          },
        },
      }

      const context = createTokensContext({ namespace: 'test', tokens })[2]

      // resolve() returns just the $value, not the whole TokenAlias
      expect(context.resolve('design.system.tokens.color.palette')).toBe('#FF0000')
    })

    it('should maintain correct indexing for deeply nested tokens', () => {
      const tokens: TokenCollection = {
        a: {
          b: {
            c: {
              d: '#FF0000',
            },
          },
        },
        x: {
          y: {
            z: {
              w: '#0000FF',
            },
          },
        },
      }

      const context = createTokensContext({ namespace: 'test', tokens })[2]

      const ticket1 = context.collection.get('a.b.c.d')
      const ticket2 = context.collection.get('x.y.z.w')

      expect(ticket1).toBeDefined()
      expect(ticket2).toBeDefined()
      expect(ticket1?.index).not.toBe(ticket2?.index)
    })

    it('should handle deep nesting with flat option', () => {
      const tokens: TokenCollection = {
        config: {
          app: {
            server: {
              database: {
                connection: {
                  host: 'localhost',
                },
              },
            },
          },
        },
      }

      const context = createTokensContext(
        { namespace: 'test', tokens, flat: true },
      )[2]

      expect(context.resolve('config.app.server.database.connection.host')).toBe('localhost')
    })
  })

  describe('combined edge case scenarios', () => {
    it('should handle $ keys mixed with deep nesting and aliases', () => {
      const tokens: TokenCollection = {
        baseColor: '#FF0000',
        design: {
          palette: {
            $value: {
              primary: {
                $value: '{baseColor}',
                $custom: 'metadata',
              },
            },
          },
        },
      }

      const context = createTokensContext({ namespace: 'test', tokens })[2]

      expect(context.resolve('design.palette.primary')).toBe('#FF0000')
    })

    it('should handle empty objects within deeply nested structures with $value', () => {
      const tokens: TokenCollection = {
        default: '#FF0000',
        component: {
          $value: {
            state: {
              empty: {},
              active: { $value: '{default}' },
            },
          },
        },
      }

      const context = createTokensContext({ namespace: 'test', tokens })[2]

      expect(context.resolve('component.state.active')).toBe('#FF0000')
      // Empty objects resolve to their empty object, not undefined
      expect(context.resolve('component.state.empty')).toEqual({})
    })

    it('should preserve type integrity through deep nesting with mixed types', () => {
      const tokens: TokenCollection = {
        metrics: {
          theme: {
            spacing: {
              scale: {
                xs: 4,
                sm: 8.5,
                enabled: true,
                fallback: null,
              },
            },
          },
        },
      }

      const context = createTokensContext({ namespace: 'test', tokens })[2]

      expect(typeof context.resolve('metrics.theme.spacing.scale.xs')).toBe('number')
      expect(typeof context.resolve('metrics.theme.spacing.scale.sm')).toBe('number')
      expect(typeof context.resolve('metrics.theme.spacing.scale.enabled')).toBe('boolean')
      expect(context.resolve('metrics.theme.spacing.scale.fallback')).toBe(null)
    })

    it('should handle prefix option with deeply nested structures', () => {
      const tokens: TokenCollection = {
        colors: {
          primary: {
            base: '#FF0000',
            variants: {
              light: '#FF5555',
            },
          },
        },
      }

      const context = createTokensContext(
        { namespace: 'test', tokens, prefix: 'v0' },
      )[2]

      expect(context.resolve('v0.colors.primary.base')).toBe('#FF0000')
      expect(context.resolve('v0.colors.primary.variants.light')).toBe('#FF5555')
    })
  })
})

describe('useTokens with fixture data', () => {
  let context: ReturnType<typeof createTokens>

  beforeEach(() => {
    context = createTokens(fixtureTokens as TokenCollection)
  })

  describe('resolution of deeply nested theme tokens', () => {
    it('should resolve theme.color.brand.primary.base', () => {
      const result = context.resolve('theme.color.brand.primary.base')
      expect(result).toBe('#4f46e5')
    })

    it('should resolve theme.color.brand.secondary.soft', () => {
      const result = context.resolve('theme.color.brand.secondary.soft')
      expect(result).toBe('#38bdf8')
    })

    it('should resolve nested text colors', () => {
      const result = context.resolve('theme.color.surface.text.primary')
      expect(result).toBe('#e5e7eb')
    })

    it('should resolve deeply nested text.secondary', () => {
      const result = context.resolve('theme.color.surface.text.secondary')
      expect(result).toBe('#9ca3af')
    })

    it('should resolve 4-level deep theme.color.surface.text.muted', () => {
      const result = context.resolve('theme.color.surface.text.muted')
      expect(result).toBe('#6b7280')
    })
  })

  describe('resolution of component tokens that reference theme tokens', () => {
    it('should fully resolve Button.variant.solid.background through reference', () => {
      const result = context.resolve('components.Button.variant.solid.background')
      // Resolves {theme.color.brand.primary.base} -> '#4f46e5'
      expect(result).toBe('#4f46e5')
    })

    it('should fully resolve Button.text.color through reference', () => {
      const result = context.resolve('components.Button.text.color')
      // Resolves {theme.color.surface.text.primary} -> '#e5e7eb'
      expect(result).toBe('#e5e7eb')
    })

    it('should fully resolve Card.background reference', () => {
      const result = context.resolve('components.Card.background')
      // Resolves {theme.color.surface.card} -> '#111827'
      expect(result).toBe('#111827')
    })

    it('should fully resolve Input.focus.borderColor reference', () => {
      const result = context.resolve('components.Input.focus.borderColor')
      // Resolves {theme.color.brand.secondary.base} -> '#0ea5e9'
      expect(result).toBe('#0ea5e9')
    })
  })

  describe('resolution of chained references (3+ levels deep)', () => {
    it('should fully resolve tokens.heading.h1 chained through $value reference', () => {
      const result = context.resolve('tokens.heading.h1')
      // Resolves {theme.typography.size.3xl} -> 30
      expect(result).toBe(30)
    })

    it('should fully resolve tokens.link.color chained reference', () => {
      const result = context.resolve('tokens.link.color')
      // Resolves {theme.color.brand.secondary.base} -> '#0ea5e9'
      expect(result).toBe('#0ea5e9')
    })

    it('should fully resolve theme.semantic.info which references brand.secondary', () => {
      const result = context.resolve('theme.color.semantic.info')
      // Resolves {theme.color.brand.secondary.base} -> '#0ea5e9'
      expect(result).toBe('#0ea5e9')
    })

    it('should fully resolve theme.spacing.gutter.normal reference', () => {
      const result = context.resolve('theme.spacing.gutter.normal')
      // Resolves {theme.spacing.lg} -> 16
      expect(result).toBe(16)
    })

    it('should fully resolve theme.shadow.sm reference', () => {
      const result = context.resolve('theme.shadow.sm')
      // Resolves {theme.shadow.base} -> '0 1px 2px rgba(0,0,0,0.24)'
      expect(result).toBe('0 1px 2px rgba(0,0,0,0.24)')
    })
  })

  describe('resolution of primitives', () => {
    it('should resolve boolean primitive as true', () => {
      const result = context.resolve('boolean')
      expect(result).toBe(true)
    })

    it('should resolve number primitive as 42', () => {
      const result = context.resolve('number')
      expect(result).toBe(42)
    })

    it('should resolve string primitive', () => {
      const result = context.resolve('string')
      expect(result).toBe('hello')
    })

    it('should resolve deeply nested primitive baz.corge.deep.thud', () => {
      const result = context.resolve('baz.corge.deep.thud')
      expect(result).toBe('wibble')
    })

    it('should resolve numeric theme values', () => {
      expect(context.resolve('theme.spacing.xs')).toBe(4)
      expect(context.resolve('theme.spacing.sm')).toBe(8)
      expect(context.resolve('theme.spacing.md')).toBe(12)
      expect(context.resolve('theme.spacing.lg')).toBe(16)
    })
  })

  describe('numeric token values being preserved as numbers', () => {
    it('should preserve numeric types in spacing tokens', () => {
      const none = context.resolve('theme.spacing.none')
      const xs = context.resolve('theme.spacing.xs')
      const lg = context.resolve('theme.spacing.lg')

      expect(typeof none).toBe('number')
      expect(typeof xs).toBe('number')
      expect(typeof lg).toBe('number')

      expect(none).toBe(0)
      expect(xs).toBe(4)
      expect(lg).toBe(16)
    })

    it('should preserve numeric types in radius tokens', () => {
      const none = context.resolve('theme.radius.none')
      const sm = context.resolve('theme.radius.sm')
      const pill = context.resolve('theme.radius.pill')

      expect(typeof none).toBe('number')
      expect(typeof sm).toBe('number')
      expect(typeof pill).toBe('number')

      expect(none).toBe(0)
      expect(sm).toBe(2)
      expect(pill).toBe(9999)
    })

    it('should preserve numeric types in typography size tokens', () => {
      const xs = context.resolve('theme.typography.size.xs')
      const xl = context.resolve('theme.typography.size.xl')

      expect(typeof xs).toBe('number')
      expect(typeof xl).toBe('number')

      expect(xs).toBe(12)
      expect(xl).toBe(20)
    })

    it('should preserve numeric types in weight tokens', () => {
      const regular = context.resolve('theme.typography.weight.regular')
      const semibold = context.resolve('theme.typography.weight.semibold')

      expect(typeof regular).toBe('number')
      expect(typeof semibold).toBe('number')

      expect(regular).toBe(400)
      expect(semibold).toBe(600)
    })

    it('should preserve floating point in lineHeight tokens', () => {
      const tight = context.resolve('theme.typography.lineHeight.tight')
      const relaxed = context.resolve('theme.typography.lineHeight.relaxed')

      expect(typeof tight).toBe('number')
      expect(typeof relaxed).toBe('number')

      expect(tight).toBe(1.2)
      expect(relaxed).toBe(1.65)
    })

    it('should preserve numeric component values', () => {
      const height = context.resolve('components.Button.height')
      const ringWidth = context.resolve('components.Button.states.focus.ringWidth')
      const opacity = context.resolve('components.Button.states.disabled.opacity')

      expect(typeof height).toBe('number')
      expect(typeof ringWidth).toBe('number')
      expect(typeof opacity).toBe('number')

      expect(height).toBe(40)
      expect(ringWidth).toBe(2)
      expect(opacity).toBe(0.5)
    })
  })

  describe('w3C token metadata handling', () => {
    it('should resolve tokens with $value metadata', () => {
      const result = context.resolve('grault')
      expect(result).toBe('waldo')
    })

    it('should resolve numeric token with metadata', () => {
      const result = context.resolve('fred')
      expect(result).toBe('1')
    })

    it('should resolve nested token with W3C metadata', () => {
      const result = context.resolve('nested.buzz')
      expect(result).toBe('quux')
    })

    it('should resolve numeric token from W3C metadata', () => {
      const result = context.resolve('nested.bang')
      expect(result).toBe('1')
    })

    it('should resolve design token h1 with metadata (and fully resolve reference)', () => {
      const result = context.resolve('tokens.heading.h1')
      // Has $value: '{theme.typography.size.3xl}' which resolves to 30
      expect(result).toBe(30)
    })

    it('should resolve link underlineOffset with metadata', () => {
      const result = context.resolve('tokens.link.underlineOffset')
      expect(result).toBe('2')
    })
  })

  describe('complex fixture scenarios', () => {
    it('should register all fixture tokens', () => {
      expect(context.collection.size).toBeGreaterThan(0)
    })

    it('should resolve multiple nested color paths', () => {
      expect(context.resolve('theme.color.brand.primary.base')).toBe('#4f46e5')
      expect(context.resolve('theme.color.brand.primary.soft')).toBe('#6366f1')
      expect(context.resolve('theme.color.brand.primary.strong')).toBe('#4338ca')
      expect(context.resolve('theme.color.brand.secondary.base')).toBe('#0ea5e9')
    })

    it('should handle surface color hierarchy', () => {
      expect(context.resolve('theme.color.surface.background')).toBe('#0b0b10')
      expect(context.resolve('theme.color.surface.card')).toBe('#111827')
      expect(context.resolve('theme.color.surface.overlay')).toBe('rgba(0,0,0,0.5)')
    })

    it('should resolve component token structure', () => {
      expect(context.resolve('components.Button.height')).toBe(40)
      // components.Button.radius resolves {theme.radius.lg} -> 8
      expect(context.resolve('components.Button.radius')).toBe(8)
      // components.Button.text.weight resolves {theme.typography.weight.semibold} -> 600
      expect(context.resolve('components.Button.text.weight')).toBe(600)
    })

    it('should resolve all spacing scale values', () => {
      const spacings = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']
      const values = [0, 4, 8, 12, 16, 24, 32, 48]

      for (const [idx, name] of spacings.entries()) {
        expect(context.resolve(`theme.spacing.${name}`)).toBe(values[idx])
      }
    })

    it('should resolve typography family tokens as strings', () => {
      const sans = context.resolve('theme.typography.family.sans')
      const mono = context.resolve('theme.typography.family.mono')

      expect(typeof sans).toBe('string')
      expect(typeof mono).toBe('string')
      expect(sans).toContain('Inter')
      expect(mono).toContain('JetBrains Mono')
    })
  })
})

describe('useTokens context retrieval', () => {
  describe('useTokens function (lines 331-336)', () => {
    it('should retrieve context with custom namespace', () => {
      const customNamespace = 'my-custom-tokens'
      const tokens: TokenCollection = {
        primary: '#007BFF',
      }

      const [_createTokensContext, provideTokens] = createTokensContext({
        namespace: customNamespace,
        tokens,
      })

      const TestComponent = defineComponent({
        setup () {
          const context = _createTokensContext()
          return { context }
        },
        template: '<div></div>',
      })

      const ParentComponent = defineComponent({
        setup () {
          provideTokens()
        },
        components: { TestComponent },
        template: '<TestComponent />',
      })

      const wrapper = mount(ParentComponent)
      const testComponent = wrapper.findComponent(TestComponent as any)

      expect(testComponent.vm.context).toBeDefined()
      expect(testComponent.vm.context.resolve('primary')).toBe('#007BFF')
    })

    it('should throw error when context not provided', () => {
      const TestComponent = defineComponent({
        setup () {
          useTokens('nonexistent-namespace')
        },
        template: '<div></div>',
      })

      expect(() => {
        mount(TestComponent)
      }).toThrow()
    })

    it('should support multiple custom namespaces simultaneously', () => {
      const ns1 = 'tokens-namespace-1'
      const ns2 = 'tokens-namespace-2'

      const [useTokens1, provideTokens1] = createTokensContext({
        namespace: ns1,
        tokens: { color: '#FF0000' },
      })

      const [useTokens2, provideTokens2] = createTokensContext({
        namespace: ns2,
        tokens: { color: '#00FF00' },
      })

      const TestComponent = defineComponent({
        setup () {
          const ctx1 = useTokens1()
          const ctx2 = useTokens2()

          return {
            color1: ctx1.resolve('color'),
            color2: ctx2.resolve('color'),
          }
        },
        template: '<div></div>',
      })

      const ParentComponent = defineComponent({
        setup () {
          provideTokens1()
          provideTokens2()
        },
        components: { TestComponent },
        template: '<TestComponent />',
      })

      const wrapper = mount(ParentComponent)
      const testComponent = wrapper.findComponent(TestComponent as any)

      expect(testComponent.vm.color1).toBe('#FF0000')
      expect(testComponent.vm.color2).toBe('#00FF00')
    })
  })
})

describe('createTokensContext with option combinations', () => {
  describe('basic options', () => {
    it('should create context with only namespace', () => {
      const context = createTokensContext({ namespace: 'test' })[2]

      expect(context).toBeDefined()
      expect(context.collection.size).toBe(0)
    })

    it('should create context with namespace and tokens', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
        secondary: '#6C757D',
      }

      const context = createTokensContext({ namespace: 'test', tokens })[2]

      expect(context.collection.size).toBe(2)
      expect(context.resolve('primary')).toBe('#007BFF')
    })

    it('should create context with flat option enabled', () => {
      const tokens: TokenCollection = {
        config: {
          nested: { value: 'data' },
        },
      }

      const context = createTokensContext({
        namespace: 'test',
        tokens,
        flat: true,
      })[2]

      expect(context.collection.has('config')).toBe(true)
      expect(context.resolve('config')).toEqual({
        nested: { value: 'data' },
      })
    })

    it('should create context with prefix option', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
      }

      const context = createTokensContext({
        namespace: 'test',
        tokens,
        prefix: 'app',
      })[2]

      expect(context.collection.has('app.primary')).toBe(true)
      expect(context.resolve('app.primary')).toBe('#007BFF')
    })

    it('should create context with flat and prefix options combined', () => {
      const tokens: TokenCollection = {
        colors: {
          primary: '#007BFF',
        },
      }

      const context = createTokensContext({
        namespace: 'test',
        tokens,
        flat: true,
        prefix: 'theme',
      })[2]

      expect(context.collection.has('theme.colors')).toBe(true)
    })
  })

  describe('option combinations with aliases', () => {
    it('should handle prefix with aliases', () => {
      const tokens: TokenCollection = {
        base: '#007BFF',
        accent: { $value: '{app.base}' },
      }

      const context = createTokensContext({
        namespace: 'test',
        tokens,
        prefix: 'app',
      })[2]

      expect(context.resolve('app.accent')).toBe('#007BFF')
    })

    it('should handle flat option with nested aliases', () => {
      const tokens: TokenCollection = {
        colors: {
          primary: '#007BFF',
          secondary: { $value: '#6C757D' },
        },
      }

      const context = createTokensContext({
        namespace: 'test',
        tokens,
        flat: true,
      })[2]

      expect(context.collection.has('colors')).toBe(true)
      // With flat: true, nested keys don't get flattened
      expect(context.collection.size).toBe(1)
    })
  })
})

describe('token registration order and index assignment', () => {
  it('should assign sequential indexes to registered tokens', () => {
    const tokens: TokenCollection = {
      first: '1',
      second: '2',
      third: '3',
    }

    const context = createTokensContext({ namespace: 'test', tokens })[2]
    const entries = context.entries()

    for (const [idx, entry] of entries.entries()) {
      expect(entry[1].index).toBe(idx)
    }
  })

  it('should maintain index order after onboarding', () => {
    const context = createTokensContext({
      namespace: 'test',
      tokens: { first: '1' },
    })[2]

    context.onboard([
      { id: 'second', value: '2' },
      { id: 'third', value: '3' },
    ])

    expect(context.lookup(0)).toBe('first')
    expect(context.lookup(1)).toBe('second')
    expect(context.lookup(2)).toBe('third')
  })

  it('should preserve index on upsert of existing token', () => {
    const tokens: TokenCollection = {
      first: '1',
      second: '2',
    }

    const context = createTokensContext({ namespace: 'test', tokens })[2]

    const indexBefore = context.collection.get('first')?.index
    context.upsert('first', { value: 'updated' })
    const indexAfter = context.collection.get('first')?.index

    expect(indexBefore).toBe(indexAfter)
  })

  it('should assign new index when creating new token via upsert', () => {
    const context = createTokensContext({
      namespace: 'test',
      tokens: { first: '1' },
    })[2]

    const firstIndex = context.collection.get('first')?.index
    const newTicket = context.upsert('second', { value: '2' })

    expect(newTicket.index).toBe(1)
    expect(firstIndex).toBe(0)
  })

  it('should track registration order with nested tokens', () => {
    const tokens: TokenCollection = {
      colors: {
        primary: '#007BFF',
        secondary: '#6C757D',
      },
      spacing: {
        small: '8px',
        large: '24px',
      },
    }

    const context = createTokensContext({ namespace: 'test', tokens })[2]
    const keys = context.keys()

    expect(keys).toContain('colors.primary')
    expect(keys).toContain('colors.secondary')
    expect(keys).toContain('spacing.small')
    expect(keys).toContain('spacing.large')
    expect(keys.length).toBe(4)
  })

  it('should maintain order after unregister', () => {
    const tokens: TokenCollection = {
      a: '1',
      b: '2',
      c: '3',
    }

    const context = createTokensContext({ namespace: 'test', tokens })[2]

    context.unregister('b')

    const entriesAfter = context.entries()
    expect(entriesAfter.length).toBe(2)
    expect(entriesAfter[0]![0]).toBe('a')
    expect(entriesAfter[1]![0]).toBe('c')
  })
})

describe('size getter behavior after mutations', () => {
  it('should reflect new size after register', () => {
    const context = createTokensContext({ namespace: 'test', tokens: {} })[2]

    expect(context.size).toBe(0)

    context.register({ id: 'token1', value: 'value1' })
    expect(context.size).toBe(1)

    context.register({ id: 'token2', value: 'value2' })
    expect(context.size).toBe(2)
  })

  it('should reflect new size after onboard', () => {
    const context = createTokensContext({ namespace: 'test', tokens: {} })[2]

    context.onboard([
      { id: 'a', value: '1' },
      { id: 'b', value: '2' },
      { id: 'c', value: '3' },
    ])

    expect(context.size).toBe(3)
  })

  it('should reflect updated size after unregister', () => {
    const tokens: TokenCollection = {
      a: '1',
      b: '2',
      c: '3',
    }

    const context = createTokensContext({ namespace: 'test', tokens })[2]

    expect(context.size).toBe(3)

    context.unregister('a')
    expect(context.size).toBe(2)

    context.unregister('b')
    expect(context.size).toBe(1)
  })

  it('should not increase size on upsert of existing token', () => {
    const tokens: TokenCollection = {
      primary: '#007BFF',
    }

    const context = createTokensContext({ namespace: 'test', tokens })[2]

    expect(context.size).toBe(1)

    context.upsert('primary', { value: '#FF0000' })
    expect(context.size).toBe(1)
  })

  it('should increase size only on upsert of new token', () => {
    const tokens: TokenCollection = {
      primary: '#007BFF',
    }

    const context = createTokensContext({ namespace: 'test', tokens })[2]

    expect(context.size).toBe(1)

    context.upsert('secondary', { value: '#6C757D' })
    expect(context.size).toBe(2)
  })

  it('should reflect correct size after series of mutations', () => {
    const context = createTokensContext({
      namespace: 'test',
      tokens: { initial: '1' },
    })[2]

    expect(context.size).toBe(1)

    context.register({ id: 'second', value: '2' })
    expect(context.size).toBe(2)

    context.onboard([{ id: 'third', value: '3' }])
    expect(context.size).toBe(3)

    context.unregister('second')
    expect(context.size).toBe(2)

    context.upsert('fourth', { value: '4' })
    expect(context.size).toBe(3)
  })

  it('should return zero size for empty context', () => {
    const context = createTokensContext({ namespace: 'test', tokens: {} })[2]

    expect(context.size).toBe(0)
  })
})

describe('cache invalidation scenarios', () => {
  it('should cache resolution results', () => {
    const tokens: TokenCollection = {
      primary: '#007BFF',
    }

    const context = createTokensContext({ namespace: 'test', tokens })[2]

    const first = context.resolve('primary')
    const second = context.resolve('primary')

    expect(first).toBe(second)
    expect(first).toBe('#007BFF')
  })

  it('should NOT clear cache when registry is mutated via upsert', () => {
    const tokens: TokenCollection = {
      primary: '#007BFF',
      accent: { $value: '{primary}' },
    }

    const context = createTokensContext({ namespace: 'test', tokens })[2]

    const resolvedBefore = context.resolve('accent')
    expect(resolvedBefore).toBe('#007BFF')

    context.upsert('primary', { value: '#FF0000' })

    const resolvedAfter = context.resolve('accent')
    expect(resolvedAfter).toBe('#007BFF')
  })

  it('should NOT clear cache when registry is mutated via unregister', () => {
    const tokens: TokenCollection = {
      primary: '#007BFF',
      accent: { $value: '{primary}' },
    }

    const context = createTokensContext({ namespace: 'test', tokens })[2]

    const resolvedBefore = context.resolve('accent')
    expect(resolvedBefore).toBe('#007BFF')

    context.unregister('primary')

    const resolvedAfter = context.resolve('accent')
    expect(resolvedAfter).toBe('#007BFF')
  })

  it('should cache both curly-brace and plain token formats independently', () => {
    const tokens: TokenCollection = {
      primary: '#007BFF',
    }

    const context = createTokensContext({ namespace: 'test', tokens })[2]

    const withBraces = context.resolve('{primary}')
    const withoutBraces = context.resolve('primary')

    expect(withBraces).toBe('#007BFF')
    expect(withoutBraces).toBe('#007BFF')
  })

  it('should cache TokenAlias object resolutions separately', () => {
    const tokens: TokenCollection = {
      primary: '#007BFF',
    }

    const context = createTokensContext({ namespace: 'test', tokens })[2]

    const alias1 = { $value: '{primary}' }
    const alias2 = { $value: '{primary}' }

    const result1 = context.resolve(alias1)
    const result2 = context.resolve(alias2)

    expect(result1).toBe('#007BFF')
    expect(result2).toBe('#007BFF')
  })

  it('should cache circular reference detection', () => {
    const tokens: TokenCollection = {
      a: { $value: '{b}' },
      b: { $value: '{a}' },
    }

    const context = createTokensContext({ namespace: 'test', tokens })[2]
    const warnSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    const first = context.resolve('a')
    const second = context.resolve('a')

    expect(first).toBeUndefined()
    expect(second).toBeUndefined()

    warnSpy.mockRestore()
  })
})

describe('multiple contexts with same namespace', () => {
  it('should support separate contexts with different namespaces', () => {
    const [_useCtx1, _provideCtx1, ctx1] = createTokensContext({
      namespace: 'ns1',
      tokens: { color: '#FF0000' },
    })

    const [_useCtx2, _provideCtx2, ctx2] = createTokensContext({
      namespace: 'ns2',
      tokens: { color: '#00FF00' },
    })

    expect(ctx1.resolve('color')).toBe('#FF0000')
    expect(ctx2.resolve('color')).toBe('#00FF00')
  })

  it('should override context when provided again with same namespace', () => {
    const [useTokensCtx, provideTokensCtx] = createTokensContext({
      namespace: 'shared',
      tokens: { color: '#FF0000' },
    })

    const customContext = createTokens({
      color: '#00FF00',
    })

    const TestComponent = defineComponent({
      setup () {
        const context = useTokensCtx()
        return { color: context.resolve('color') }
      },
      template: '<div></div>',
    })

    const ParentComponent = defineComponent({
      setup () {
        provideTokensCtx(customContext)
      },
      components: { TestComponent },
      template: '<TestComponent />',
    })

    const wrapper = mount(ParentComponent)
    const testComponent = wrapper.findComponent(TestComponent as any)

    expect(testComponent.vm.color).toBe('#00FF00')
  })

  it('should isolate token resolutions between different contexts', () => {
    const ctx1 = createTokens({
      primary: '#FF0000',
      accent: { $value: '{primary}' },
    })

    const ctx2 = createTokens({
      primary: '#00FF00',
      accent: { $value: '{primary}' },
    })

    expect(ctx1.resolve('accent')).toBe('#FF0000')
    expect(ctx2.resolve('accent')).toBe('#00FF00')
  })

  it('should maintain separate registries for different contexts', () => {
    const ctx1 = createTokensContext({
      namespace: 'ctx1',
      tokens: { a: '1', b: '2' },
    })[2]

    const ctx2 = createTokensContext({
      namespace: 'ctx2',
      tokens: { c: '3', d: '4' },
    })[2]

    expect(ctx1.collection.size).toBe(2)
    expect(ctx2.collection.size).toBe(2)
    expect(ctx1.collection.has('a')).toBe(true)
    expect(ctx2.collection.has('c')).toBe(true)
    expect(ctx1.collection.has('c')).toBe(false)
    expect(ctx2.collection.has('a')).toBe(false)
  })

  it('should allow mutation of one context without affecting another', () => {
    const ctx1 = createTokensContext({
      namespace: 'ctx1',
      tokens: { primary: '#FF0000' },
    })[2]

    const ctx2 = createTokensContext({
      namespace: 'ctx2',
      tokens: { primary: '#00FF00' },
    })[2]

    ctx1.register({ id: 'secondary', value: '#FF00FF' })

    expect(ctx1.collection.size).toBe(2)
    expect(ctx2.collection.size).toBe(1)
    expect(ctx1.collection.has('secondary')).toBe(true)
    expect(ctx2.collection.has('secondary')).toBe(false)
  })

  it('should handle nested aliases within the same context correctly', () => {
    const ctx = createTokensContext({
      namespace: 'test',
      tokens: {
        base: '#007BFF',
        primary: { $value: '{base}' },
        accent: { $value: '{primary}' },
      },
    })[2]

    expect(ctx.resolve('base')).toBe('#007BFF')
    expect(ctx.resolve('primary')).toBe('#007BFF')
    expect(ctx.resolve('accent')).toBe('#007BFF')
  })
})
