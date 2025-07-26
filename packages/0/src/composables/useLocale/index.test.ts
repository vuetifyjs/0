import { describe, it, expect } from 'vitest'
import { createLocale } from './index'
import { Vuetify0LocaleAdapter } from './adapters/v0'

describe('useLocale', () => {
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
  })
})
