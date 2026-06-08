// Globals
import { IN_BROWSER } from '#v0/constants/globals'

import { LocaleAdapter } from './adapter'

// Utilities
import { isString } from '#v0/utilities'

// Types
import type { ID } from '#v0/types'
import type { LocaleAdapterContext } from './adapter'

import { interpolate } from '../interpolate'

/**
 * Default locale adapter for @vuetify/v0.
 *
 * Handles the full translation pipeline: key lookup via tokens,
 * fallback chain, token reference resolution, and placeholder interpolation.
 */
export class V0LocaleAdapter extends LocaleAdapter {
  private context: LocaleAdapterContext

  constructor (context: LocaleAdapterContext) {
    super()
    this.context = context
  }

  t (key: string, ...params: unknown[]): string {
    const locale = this.context.selectedId.value

    if (!locale) return interpolate(key, params)

    const message = this.context.tokens.get(`${locale}.${key}`)?.value

    if (isString(message)) {
      return interpolate(this.resolve(locale, message), params)
    }

    if (this.context.fallbackLocale) {
      const fbMessage = this.context.tokens.get(`${this.context.fallbackLocale}.${key}`)?.value
      if (isString(fbMessage)) {
        return interpolate(this.resolve(this.context.fallbackLocale, fbMessage), params)
      }
    }

    if (this.context.onMissing) {
      const fallback = this.context.onMissing(key, ...params)
      if (isString(fallback)) return fallback
    }

    return interpolate(key, params)
  }

  n (value: number): string {
    const locale = this.context.selectedId.value

    if (!IN_BROWSER || !locale) return value.toString()

    return new Intl.NumberFormat(String(locale)).format(value)
  }

  private resolve (locale: ID, str: string, visited = new Set<string>()): string {
    return str.replace(/{([a-zA-Z0-9.\-_]+)}/g, (match, key) => {
      const [prefix, ...rest] = key.split('.')
      const target = this.context.has(prefix) ? prefix : locale
      const name = this.context.has(prefix) ? rest.join('.') : key

      const path = `${target}.${name}`

      if (visited.has(path)) return match

      visited.add(path)

      const resolved = this.context.tokens.get(path)?.value

      if (isString(resolved)) {
        return this.resolve(target, resolved, visited)
      }

      return match
    })
  }
}
