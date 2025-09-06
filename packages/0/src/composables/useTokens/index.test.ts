// Composables
import { createTokensContext, useTokens } from './index'

// Utilities
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref, nextTick, computed } from 'vue'

// Types
import type { TokenCollection } from './index'

describe('createTokensContext', () => {
  describe('basic functionality', () => {
    it('should initialize with empty tokens', () => {
      const context = createTokensContext('test')[2]

      expect(context.collection.size).toBe(0)
    })
  })

  describe('token flattening', () => {
    it('should flatten simple tokens', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
        secondary: '#6C757D',
      }

      const context = createTokensContext('test', tokens)[2]

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

      const context = createTokensContext('test', tokens)[2]

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

      const context = createTokensContext('test', tokens)[2]

      expect(context.collection.size).toBe(4)
      expect(context.resolve('primary')).toBe('#007BFF')
      expect(context.resolve('accent')).toBe('#007BFF')
      expect(context.resolve('colors.red.100')).toBe('#FEF2F2')
      expect(context.resolve('colors.red.200')).toBe('#FEF2F2')
    })

    it('should respect depth option (depth=0 stops flattening)', () => {
      const tokens: TokenCollection = {
        dark: true,
        rtl: { value: true, variation: 'toggle' },
        complex: { inner: { leaf: '#FFFFFF' } },
      }

      const context = useTokens(tokens, { depth: 0 })

      // With depth=0, nested objects remain as values at their base ids
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

      const context = createTokensContext('test', tokens)[2]

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

      const context = createTokensContext('test', tokens)[2]

      expect(context.resolve('colors.primary')).toBe('#007BFF')
      expect(context.resolve('accent')).toBe('#007BFF')
    })

    it('should resolve chained aliases', () => {
      const tokens: TokenCollection = {
        base: '#007BFF',
        primary: { $value: '{base}' },
        accent: { $value: '{primary}' },
      }

      const context = createTokensContext('test', tokens)[2]

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

      const context = createTokensContext('test', tokens)[2]

      expect(context.resolve('{primary}')).toBe('#007BFF')
      expect(context.resolve('{accent}')).toBe('#007BFF')
    })

    it('should resolve tokens without curly braces', () => {
      const tokens: TokenCollection = {
        primary: '#007BFF',
        accent: { $value: '{primary}' },
      }

      const context = createTokensContext('test', tokens)[2]

      expect(context.resolve('primary')).toBe('#007BFF')
      expect(context.resolve('accent')).toBe('#007BFF')
    })

    it('should return undefined for non-existent tokens', () => {
      const context = createTokensContext('test', {})[2]

      expect(context.resolve('nonexistent')).toBeUndefined()
      expect(context.resolve('{nonexistent}')).toBeUndefined()
    })
  })

  describe('token item resolution', () => {
    it('should return undefined for non-existent token items', () => {
      const context = createTokensContext('test', {})[2]

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

      const context = createTokensContext('test', tokens)[2]

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

      const context = createTokensContext('test', tokens)[2]

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

      const context = createTokensContext('test', tokens)[2]

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

      const context = createTokensContext('test', tokens)[2]

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

    const [_createTokensContext, provideTokens] = createTokensContext('test-reactivity', tokens)

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
    const testComponent = wrapper.findComponent(TestComponent)

    expect(testComponent.vm.resolvedPrimary).toBe('#1976d2')
    expect(testComponent.vm.resolvedAccent).toBe('#1976d2')
  })

  it('should demonstrate reactive token resolution with computed properties', async () => {
    const tokens = {
      primary: '#1976d2',
      secondary: '#424242',
      accent: { $value: '{primary}' },
    }

    const [_createTokensContext, provideTokens] = createTokensContext('test-reactive', tokens)

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
    const testComponent = wrapper.findComponent(TestComponent)

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

    const [_createTokensContext, provideTokens] = createTokensContext('test-items', tokens)

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
    const testComponent = wrapper.findComponent(TestComponent)

    expect(testComponent.vm.primaryItem?.id).toBe('colors.primary')
    expect(testComponent.vm.primaryItem?.value).toBe('#1976d2')
    expect(testComponent.vm.spacingItem?.id).toBe('spacing.medium')
    expect(testComponent.vm.spacingItem?.value).toBe('16px')
    expect(testComponent.vm.collection.size).toBe(4)
  })

  it('should handle context injection errors gracefully', () => {
    const [_createTokensContext] = createTokensContext('test-error')

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

    const [useThemeTokens, provideThemeTokens] = createTokensContext('theme', themeTokens)
    const [useSpacingTokens, provideSpacingTokens] = createTokensContext('spacing', spacingTokens)

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
    const testComponent = wrapper.findComponent(TestComponent)

    expect(testComponent.vm.primaryColor).toBe('#1976d2')
    expect(testComponent.vm.smallSpacing).toBe('8px')
    expect(testComponent.vm.themeItemsCount).toBe(2)
    expect(testComponent.vm.spacingItemsCount).toBe(2)
  })

  it('should return the original value for direct values without warning', () => {
    const tokens: TokenCollection = { primary: '#007BFF' }
    const context = createTokensContext('test', tokens)[2]

    expect(context.resolve('primary')).toBe('#007BFF')
    expect(context.resolve('#ff0000')).toBe(undefined)
  })
})
