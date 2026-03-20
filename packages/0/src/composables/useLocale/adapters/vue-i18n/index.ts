// Utilities
import { isObject } from '#v0/utilities'

// Types
import type { LocaleAdapter } from '../adapter'
import type { Composer } from 'vue-i18n'

/**
 * Locale adapter that delegates to a vue-i18n instance.
 *
 * Composition API mode only (vue-i18n v10+ default).
 * The adapter delegates `t()` and `n()` to `i18n.global`,
 * preserving all vue-i18n features: pluralization, linked
 * messages, datetime/number formatting, etc.
 */
export class VueI18nLocaleAdapter implements LocaleAdapter {
  private composer: Composer

  constructor (i18n: { global: Composer }) {
    this.composer = i18n.global
  }

  t (key: string, ...params: unknown[]): string {
    if (params.length > 0 && isObject(params[0])) {
      return this.composer.t(key, params[0] as Record<string, unknown>)
    }

    return params.length > 0
      ? this.composer.t(key, params)
      : this.composer.t(key)
  }

  n (value: number): string {
    return this.composer.n(value)
  }
}
