// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Utilities
import { isObject, isString, isUndefined } from '#v0/utilities'

// Types
import type { ID } from '#v0/types'
import type { LocaleAdapter, LocaleAdapterContext } from './adapter'

/**
 * Default locale adapter for @vuetify/v0.
 *
 * Handles the full translation pipeline: key lookup via tokens,
 * fallback chain, token reference resolution, and placeholder interpolation.
 */
export class Vuetify0LocaleAdapter implements LocaleAdapter {
  private context: LocaleAdapterContext

  constructor (context: LocaleAdapterContext) {
    this.context = context
  }

  t (key: string, ...params: unknown[]): string {
    const locale = this.context.selectedId.value

    if (!locale) return this.interpolate(key, params)

    const message = this.context.tokens.get(`${locale}.${key}`)?.value

    if (isString(message)) {
      return this.interpolate(this.resolve(locale, message), params)
    }

    if (this.context.fallbackLocale) {
      const fbMessage = this.context.tokens.get(`${this.context.fallbackLocale}.${key}`)?.value
      if (isString(fbMessage)) {
        return this.interpolate(this.resolve(this.context.fallbackLocale, fbMessage), params)
      }
    }

    return this.interpolate(key, params)
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

  private interpolate (message: string, args: unknown[]): string {
    let result = message
    let rest = args

    if (rest.length > 0 && isObject(rest[0])) {
      const variables = rest[0] as Record<string, unknown>
      result = result.replace(/{([a-zA-Z][a-zA-Z0-9_]*)}/g, (match, name) => {
        return isUndefined(variables[name]) ? match : String(variables[name])
      })
      rest = rest.slice(1)
    }

    result = result.replace(/\{(\d+)\}/g, (match, index) => {
      const i = Number.parseInt(index, 10)
      if (!isUndefined(rest[i])) {
        return String(rest[i])
      }
      return match
    })

    return result
  }
}
