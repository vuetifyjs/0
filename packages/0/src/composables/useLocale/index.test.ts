import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Adapters
import { Vuetify0LocaleAdapter } from './adapters/v0'

// Utilities
import { getCurrentInstance, inject, provide } from 'vue'

import { createLocale, createLocaleContext, createLocalePlugin, useLocale } from './index'

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    provide: vi.fn(),
    inject: vi.fn(),
    getCurrentInstance: vi.fn(),
  }
})

const mockProvide = vi.mocked(provide)
const mockInject = vi.mocked(inject)
const mockGetCurrentInstance = vi.mocked(getCurrentInstance)

describe('useLocale', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('createLocale', () => {
    it('should create locale instance with default options', () => {
      const defaultLocale = createLocale()

      expect(defaultLocale).toBeDefined()
      expect(typeof defaultLocale.t).toBe('function')
      expect(typeof defaultLocale.n).toBe('function')
      expect(typeof defaultLocale.register).toBe('function')
      expect(typeof defaultLocale.select).toBe('function')
    })

    it('should register locales from messages option', () => {
      const locale = createLocale({
        messages: {
          en: { hello: 'Hello' },
          es: { hello: 'Hola' },
        },
      })

      expect(locale.size).toBe(2)
      expect(locale.has('en')).toBe(true)
      expect(locale.has('es')).toBe(true)
    })

    it('should select default locale', () => {
      const locale = createLocale({
        default: 'en',
        messages: {
          en: { hello: 'Hello' },
          es: { hello: 'Hola' },
        },
      })

      expect(locale.selectedId.value).toBe('en')
    })

    it('should translate messages', () => {
      const locale = createLocale({
        default: 'en',
        messages: {
          en: { hello: 'Hello', greeting: 'Hello {name}' },
          es: { hello: 'Hola', greeting: 'Hola {name}' },
        },
      })

      expect(locale.t('hello')).toBe('Hello')
      expect(locale.t('greeting', { name: 'John' })).toBe('Hello John')
    })

    it('should return key when translation not found', () => {
      const locale = createLocale({
        default: 'en',
        messages: {
          en: { hello: 'Hello' },
        },
      })

      expect(locale.t('missing')).toBe('missing')
    })

    it('should use fallback when translation not found', () => {
      const locale = createLocale({
        default: 'en',
        messages: {
          en: { hello: 'Hello' },
        },
      })

      expect(locale.t('missing.key', { page: 5 }, 'Go to page 5')).toBe('Go to page 5')
    })

    it('should use translation over fallback when found', () => {
      const locale = createLocale({
        default: 'en',
        messages: {
          en: {
            Pagination: {
              goToPage: 'Navigate to page {page}',
            },
          },
        },
      })

      expect(locale.t('Pagination.goToPage', { page: 5 }, 'Go to page 5')).toBe('Navigate to page 5')
    })

    it('should support nested message structures', () => {
      const locale = createLocale({
        default: 'en',
        messages: {
          en: {
            Pagination: {
              goToPage: 'Navigate to page {page}',
              currentPage: 'Page {page}, current',
            },
          },
        },
      })

      expect(locale.t('Pagination.goToPage', { page: 5 }, 'Go to page 5')).toBe('Navigate to page 5')
      expect(locale.t('Pagination.currentPage', { page: 3 }, 'Page 3')).toBe('Page 3, current')
    })

    it('should switch locale and translate accordingly', () => {
      const locale = createLocale({
        default: 'en',
        messages: {
          en: { hello: 'Hello' },
          es: { hello: 'Hola' },
        },
      })

      expect(locale.t('hello')).toBe('Hello')

      locale.select('es')
      expect(locale.t('hello')).toBe('Hola')
    })

    it('should handle named placeholders', () => {
      const locale = createLocale({
        default: 'en',
        messages: {
          en: { greet: 'Hello {name}, you have {count} messages' },
        },
      })

      expect(locale.t('greet', { name: 'John', count: 5 })).toBe('Hello John, you have 5 messages')
    })

    it('should resolve token references in messages', () => {
      const locale = createLocale({
        default: 'en',
        messages: {
          en: {
            app: 'My App',
            welcome: 'Welcome to {app}',
          },
        },
      })

      expect(locale.t('welcome')).toBe('Welcome to My App')
    })

    it('should format numbers with n()', () => {
      const locale = createLocale({
        default: 'en-US',
        messages: {
          'en-US': {},
        },
      })

      const result = locale.n(1234.56)
      // Result depends on Intl API availability and locale
      expect(typeof result).toBe('string')
    })

    it('should handle cross-locale references', () => {
      const locale = createLocale({
        default: 'en',
        messages: {
          en: { hello: 'Hello' },
          es: { hello: 'Hola' },
        },
      })

      locale.select('en')
      expect(locale.t('hello')).toBe('Hello')

      locale.select('es')
      expect(locale.t('hello')).toBe('Hola')
    })
  })

  describe('vuetify0LocaleAdapter', () => {
    let adapter: Vuetify0LocaleAdapter

    beforeEach(() => {
      adapter = new Vuetify0LocaleAdapter()
    })

    it('should translate simple messages', () => {
      expect(adapter.t('Hello')).toBe('Hello')
    })

    it('should handle numbered placeholders', () => {
      expect(adapter.t('Hello {0}', 'World')).toBe('Hello World')
      expect(adapter.t('Sum: {0} + {1} = {2}', 1, 2, 3)).toBe('Sum: 1 + 2 = 3')
    })

    it('should handle named placeholders', () => {
      expect(adapter.t('Hello {name}', { name: 'World' })).toBe('Hello World')
      expect(adapter.t('Hello {firstName} {lastName}', { firstName: 'John', lastName: 'Doe' }))
        .toBe('Hello John Doe')
    })

    it('should handle mixed placeholders', () => {
      expect(adapter.t('Hello {name}, you have {0} messages', { name: 'John' }, 5))
        .toBe('Hello John, you have 5 messages')
    })

    it('should preserve unresolved placeholders', () => {
      expect(adapter.t('Hello {name}', {})).toBe('Hello {name}')
      expect(adapter.t('Hello {0}')).toBe('Hello {0}')
    })

    it('should handle special characters in named placeholders', () => {
      expect(adapter.t('Hello {name123}', { name123: 'Test' })).toBe('Hello Test')
      expect(adapter.t('Hello {first_name}', { first_name: 'John' })).toBe('Hello John')
    })

    it('should format numbers', () => {
      const result = adapter.n(1234.56, 'en-US')
      expect(typeof result).toBe('string')
    })

    it('should handle undefined locale in n()', () => {
      const result = adapter.n(1234.56, undefined)
      expect(result).toBe('1234.56')
    })

    it('should handle number formatting options', () => {
      const result = adapter.n(1234.56, 'en-US', { style: 'currency', currency: 'USD' })
      expect(typeof result).toBe('string')
    })
  })

  describe('createLocalePlugin', () => {
    it('should create a Vue plugin', () => {
      const plugin = createLocalePlugin()

      expect(plugin).toBeDefined()
      expect(typeof plugin.install).toBe('function')
    })

    it('should accept locale options', () => {
      const plugin = createLocalePlugin({
        default: 'en',
        messages: {
          en: { hello: 'Hello' },
        },
      })

      expect(plugin).toBeDefined()
      expect(typeof plugin.install).toBe('function')
    })

    it('should accept custom adapter', () => {
      const customAdapter = new Vuetify0LocaleAdapter()
      const plugin = createLocalePlugin({
        adapter: customAdapter,
        messages: {
          en: { hello: 'Hello' },
        },
      })

      expect(plugin).toBeDefined()
    })
  })

  describe('locale switching', () => {
    it('should update translations when locale changes', () => {
      const locale = createLocale({
        messages: {
          en: { message: 'English message' },
          fr: { message: 'Message français' },
          de: { message: 'Deutsche Nachricht' },
        },
      })

      locale.select('en')
      expect(locale.t('message')).toBe('English message')

      locale.select('fr')
      expect(locale.t('message')).toBe('Message français')

      locale.select('de')
      expect(locale.t('message')).toBe('Deutsche Nachricht')
    })

    it('should handle missing translations in selected locale', () => {
      const locale = createLocale({
        default: 'en',
        messages: {
          en: { hello: 'Hello', goodbye: 'Goodbye' },
          es: { hello: 'Hola' }, // missing 'goodbye'
        },
      })

      locale.select('es')
      expect(locale.t('hello')).toBe('Hola')
      expect(locale.t('goodbye')).toBe('goodbye') // returns key when not found
    })
  })

  describe('token resolution', () => {
    it('should resolve token references in messages', () => {
      const locale = createLocale({
        default: 'en',
        messages: {
          en: {
            brand: 'Vuetify',
            version: '0.x',
            title: '{brand} {version}',
            welcome: 'Welcome to {title}',
          },
        },
      })

      // The resolve function resolves token references recursively
      expect(locale.t('title')).toBe('Vuetify 0.x')
      // Nested references are also resolved
      expect(locale.t('welcome')).toBe('Welcome to Vuetify 0.x')
    })

    it('should handle self-referencing tokens', () => {
      const locale = createLocale({
        default: 'en',
        messages: {
          en: {
            simple: 'Simple text',
            withRef: 'Text with {simple}',
          },
        },
      })

      expect(locale.t('simple')).toBe('Simple text')
      expect(locale.t('withRef')).toBe('Text with Simple text')
    })
  })
})

describe('createLocaleContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return a trinity tuple', () => {
    const result = createLocaleContext()

    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(3)
    expect(typeof result[0]).toBe('function') // useLocaleContext
    expect(typeof result[1]).toBe('function') // provideLocaleContext
    expect(result[2]).toBeDefined() // default context
  })

  it('should create context with default namespace', () => {
    const [, provideLocaleContext, context] = createLocaleContext()

    provideLocaleContext(context)

    expect(mockProvide).toHaveBeenCalledWith('v0:locale', context)
  })

  it('should create context with custom namespace', () => {
    const [, provideLocaleContext, context] = createLocaleContext({
      namespace: 'my-locale',
    })

    provideLocaleContext(context)

    expect(mockProvide).toHaveBeenCalledWith('my-locale', context)
  })

  it('should create a functional locale context', () => {
    const [,, context] = createLocaleContext({
      messages: {
        en: { hello: 'Hello' },
        es: { hello: 'Hola' },
      },
      default: 'en',
    })

    expect(context.t('hello')).toBe('Hello')
    context.select('es')
    expect(context.t('hello')).toBe('Hola')
  })

  it('should allow providing custom context', () => {
    const [, provideLocaleContext] = createLocaleContext()
    const customContext = createLocale()

    provideLocaleContext(customContext)

    expect(mockProvide).toHaveBeenCalledWith('v0:locale', customContext)
  })

  it('should provide context at app level when app is passed', () => {
    const mockApp = {
      provide: vi.fn(),
    } as any
    const [, provideLocaleContext, context] = createLocaleContext()

    provideLocaleContext(context, mockApp)

    expect(mockApp.provide).toHaveBeenCalledWith('v0:locale', context)
  })
})

describe('useLocale consumer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return fallback when not in component instance', () => {
    mockGetCurrentInstance.mockReturnValue(null)

    const result = useLocale()

    // Should return fallback without calling inject
    expect(result).toBeDefined()
    expect(typeof result.t).toBe('function')
    expect(mockInject).not.toHaveBeenCalled()
  })

  it('should inject context when in component instance', () => {
    const mockContext = createLocale()
    mockGetCurrentInstance.mockReturnValue({} as any)
    mockInject.mockReturnValue(mockContext)

    const result = useLocale()

    expect(result).toBe(mockContext)
  })

  it('should inject context with custom namespace', () => {
    const mockContext = createLocale()
    mockGetCurrentInstance.mockReturnValue({} as any)
    mockInject.mockReturnValue(mockContext)

    const result = useLocale('my-locale')

    expect(result).toBe(mockContext)
  })

  it('should return fallback when context is not provided', () => {
    mockGetCurrentInstance.mockReturnValue({} as any)
    mockInject.mockReturnValue(undefined)

    // useLocale uses useContext with fallback, so it returns the fallback instead of throwing
    const result = useLocale()
    expect(result).toBeDefined()
    expect(typeof result.t).toBe('function')
  })
})
