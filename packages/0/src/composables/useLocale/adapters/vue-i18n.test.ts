import { beforeEach, describe, expect, it, vi } from 'vitest'

import { VueI18nLocaleAdapter } from './vue-i18n'

// Types
import type { Composer } from 'vue-i18n'

function createMockI18n (): { global: Composer } {
  const composer = {
    t: vi.fn((key: string, ..._params: unknown[]) => key),
    n: vi.fn(String),
  } as unknown as Composer

  return { global: composer }
}

describe('vueI18nLocaleAdapter', () => {
  let i18n: { global: Composer }

  beforeEach(() => {
    i18n = createMockI18n()
  })

  describe('instantiation', () => {
    it('should construct from an i18n instance with a global Composer', () => {
      const adapter = new VueI18nLocaleAdapter(i18n)

      expect(adapter).toBeInstanceOf(VueI18nLocaleAdapter)
      expect(typeof adapter.t).toBe('function')
      expect(typeof adapter.n).toBe('function')
    })
  })

  describe('t()', () => {
    it('should delegate key-only translation to composer.t', () => {
      const adapter = new VueI18nLocaleAdapter(i18n)

      adapter.t('hello')

      expect(i18n.global.t).toHaveBeenCalledTimes(1)
      expect(i18n.global.t).toHaveBeenCalledWith('hello')
    })

    it('should pass an object first param straight through to composer.t', () => {
      const adapter = new VueI18nLocaleAdapter(i18n)

      adapter.t('greet', { name: 'World' })

      expect(i18n.global.t).toHaveBeenCalledTimes(1)
      expect(i18n.global.t).toHaveBeenCalledWith('greet', { name: 'World' })
    })

    it('should pass non-object params as a positional array to composer.t', () => {
      const adapter = new VueI18nLocaleAdapter(i18n)

      adapter.t('sum', 1, 2, 3)

      expect(i18n.global.t).toHaveBeenCalledTimes(1)
      expect(i18n.global.t).toHaveBeenCalledWith('sum', [1, 2, 3])
    })

    it('should return the value produced by composer.t', () => {
      const composer = {
        t: vi.fn(() => 'translated'),
        n: vi.fn(),
      } as unknown as Composer
      const adapter = new VueI18nLocaleAdapter({ global: composer })

      const result = adapter.t('hello')

      expect(result).toBe('translated')
    })

    it('should treat a single string param as positional, not named', () => {
      const adapter = new VueI18nLocaleAdapter(i18n)

      adapter.t('hello', 'value')

      expect(i18n.global.t).toHaveBeenCalledWith('hello', ['value'])
    })

    it('should not unwrap object params from a multi-arg call', () => {
      const adapter = new VueI18nLocaleAdapter(i18n)

      // First param is an object → object path takes precedence
      adapter.t('greet', { name: 'World' }, 'extra')

      expect(i18n.global.t).toHaveBeenCalledWith('greet', { name: 'World' })
    })
  })

  describe('n()', () => {
    it('should delegate to composer.n', () => {
      const adapter = new VueI18nLocaleAdapter(i18n)

      adapter.n(1234.56)

      expect(i18n.global.n).toHaveBeenCalledTimes(1)
      expect(i18n.global.n).toHaveBeenCalledWith(1234.56)
    })

    it('should return the value produced by composer.n', () => {
      const composer = {
        t: vi.fn(),
        n: vi.fn(() => '1,234.56'),
      } as unknown as Composer
      const adapter = new VueI18nLocaleAdapter({ global: composer })

      const result = adapter.n(1234.56)

      expect(result).toBe('1,234.56')
    })
  })
})
