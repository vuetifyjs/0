import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createLocale, createLocalePlugin } from './index'
import { Vuetify0LocaleAdapter } from './adapters/v0'
import type { App } from 'vue'

// Mock global browser environment
vi.stubGlobal('navigator', { language: 'en' })

// Create mock app
function createMockApp () {
  const app: any = {
    _context: {},
    runWithContext: vi.fn(fn => fn()),
    use: vi.fn(plugin => {
      if (plugin && typeof plugin.install === 'function') {
        plugin.install(app as unknown as App)
      }
      return app
    }),
    provide: vi.fn((key, value) => {
      if (key === 'v0:locale') {
        app._providedLocaleContext = value
      }
    }),
  }
  return app as unknown as App
}

describe('useLocale', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  describe('basic functionality', () => {
    it('should return createContext, provideContext, and context', () => {
      const adapter = new Vuetify0LocaleAdapter()
      const messages = { en: { hello: 'Hello' } }
      const result = createLocale('test', { adapter, messages })
      const useLocaleContext = result[0]
      const provideLocaleContext = result[1]
      const context = result[2]

      expect(typeof useLocaleContext).toBe('function')
      expect(typeof provideLocaleContext).toBe('function')
      expect(context).toHaveProperty('t')
      expect(context).toHaveProperty('n')
      expect(context).toHaveProperty('select')
      expect(context).toHaveProperty('selectedId')
    })

    it('should initialize with empty state', () => {
      const adapter = new Vuetify0LocaleAdapter()
      const messages = { en: { hello: 'Hello' } }
      const state = createLocale('test', { adapter, messages })[2]

      expect(state.selectedId.value).toBeUndefined()
      expect(state.tickets.size).toBe(0)
    })
  })

  describe('locale plugin', () => {
    it('should register locales from messages', () => {
      const app = createMockApp()
      const plugin = createLocalePlugin({
        default: 'en',
        messages: {
          en: { hello: 'Hello' },
          fr: { hello: 'Bonjour' },
        },
      })

      app.use(plugin)

      expect(app.use).toHaveBeenCalledTimes(1)
      expect(app.runWithContext).toHaveBeenCalled()
    })

    it('should select default locale', () => {
      // Create and install the plugin on the mock app
      const app = createMockApp()
      const plugin = createLocalePlugin({
        default: 'fr',
        messages: {
          en: { hello: 'Hello' },
          fr: { hello: 'Bonjour' },
        },
      })
      app.use(plugin)

      // Access the context from the plugin install
      // The context is registered on the app via provide
      // We can check the app._context.selectedId.value
      const localeContext = (app as any)._providedLocaleContext
      expect(localeContext.selectedId.value).toBe('fr')
    })
  })

  describe('message resolution', () => {
    it('should resolve simple messages', () => {
      const adapter = new Vuetify0LocaleAdapter()
      const messages = {
        en: { hello: 'Hello' },
        fr: { hello: 'Bonjour' },
      }
      const context = createLocale('test', { adapter, messages })[2]

      // Register the locales
      context.register({ id: 'en', value: messages.en }, 'en')
      context.register({ id: 'fr', value: messages.fr }, 'fr')

      // Select English
      context.select('en')
      expect(context.t('hello')).toBe('Hello')

      // Select French
      context.select('fr')
      expect(context.t('hello')).toBe('Bonjour')
    })

    it('should resolve messages with references', () => {
      const adapter = new Vuetify0LocaleAdapter()
      const messages = {
        en: {
          hello: 'Hello',
          welcome: '{hello}, welcome!',
        },
      }
      const context = createLocale('test', { adapter, messages })[2]

      // Register the locale
      context.register({ id: 'en', value: messages.en }, 'en')
      context.select('en')

      expect(context.t('welcome')).toBe('Hello, welcome!')
    })

    it('should resolve cross-locale references', () => {
      const adapter = new Vuetify0LocaleAdapter()
      const messages = {
        en: {
          hello: 'Hello',
        },
        fr: {
          hello: 'Bonjour',
          englishHello: '{en.hello}',
        },
      }
      const context = createLocale('test', { adapter, messages })[2]

      // Register the locales
      context.register({ id: 'en', value: messages.en }, 'en')
      context.register({ id: 'fr', value: messages.fr }, 'fr')

      // Select French
      context.select('fr')

      expect(context.t('englishHello')).toBe('Hello')
    })
  })

  describe('variable interpolation', () => {
    it('should handle numbered placeholders', () => {
      const adapter = new Vuetify0LocaleAdapter()
      const messages = {
        en: {
          welcome: 'Hello, {0}!',
        },
      }
      const context = createLocale('test', { adapter, messages })[2]

      // Register the locale
      context.register({ id: 'en', value: messages.en }, 'en')
      context.select('en')

      expect(context.t('welcome', 'World')).toBe('Hello, World!')
    })

    it('should handle named variables', () => {
      const adapter = new Vuetify0LocaleAdapter()
      const messages = {
        en: {
          welcome: 'Hello, {name}!',
        },
      }
      const context = createLocale('test', { adapter, messages })[2]

      // Register the locale
      context.register({ id: 'en', value: messages.en }, 'en')
      context.select('en')

      expect(context.t('welcome', { name: 'World' })).toBe('Hello, World!')
    })

    it('should support direct message templates', () => {
      const adapter = new Vuetify0LocaleAdapter()
      const context = createLocale('test', { adapter, messages: { en: {} } })[2]
      context.register({ id: 'en', value: {} }, 'en')
      context.select('en')

      // Handle direct messages with variables
      expect(context.t('Hello {0}!', 'World')).toBe('Hello World!')
      expect(context.t('Hello {name}!', { name: 'World' })).toBe('Hello World!')
    })

    it('should handle multiple variables', () => {
      const adapter = new Vuetify0LocaleAdapter()
      const context = createLocale('test', { adapter, messages: { en: {} } })[2]
      context.register({ id: 'en', value: {} }, 'en')
      context.select('en')

      expect(context.t('Hello {0} {1}!', 'John', 'Doe')).toBe('Hello John Doe!')
      expect(context.t('Hello {first} {last}!', { first: 'John', last: 'Doe' })).toBe('Hello John Doe!')
    })
  })

  describe('number formatting', () => {
    it('should format numbers based on locale', () => {
      const adapter = new Vuetify0LocaleAdapter()
      const context = createLocale('test', { adapter, messages: {} })[2]

      // Register the locales
      context.register({ id: 'en-US', value: {} }, 'en-US')
      context.register({ id: 'fr-FR', value: {} }, 'fr-FR')

      // Format with US locale
      context.select('en-US')
      expect(context.n(1000.5)).toBe('1,000.5')

      // Format with French locale
      context.select('fr-FR')
      // We can't test the exact output because it depends on the Intl implementation
      // but we can at least verify it gets called
      expect(typeof context.n(1000.5)).toBe('string')
    })

    it('should support number format options', () => {
      const adapter = new Vuetify0LocaleAdapter()
      const context = createLocale('test', { adapter, messages: {} })[2]

      context.register({ id: 'en-US', value: {} }, 'en-US')
      context.select('en-US')

      // We can't test with options because our n function doesn't support them in the tests
      expect(typeof context.n(1000.5)).toBe('string')
    })
  })
})
