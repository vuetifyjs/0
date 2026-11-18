// Composables
import { useLogger } from '#v0/composables/useLogger'

// Adapters
import { LocaleAdapter } from './adapter'

// Utilities
import { isObject, isString, isUndefined } from '#v0/utilities'

// Types
import type { ID } from '#v0/types'
import type { LocaleAdapterContext } from './adapter'

// Locale ids already warned about, so a server that creates a locale per
// request warns once.
const REJECTED = /* @__PURE__ */ new Set<ID>()

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
    const found = this.lookup(key, params)

    return isUndefined(found) ? this.interpolate(key, params) : found
  }

  ti (key: string, ...params: unknown[]): string | undefined {
    return this.lookup(key, params)
  }

  n (value: number): string {
    const locale = this.context.selectedId.value

    if (!locale) return value.toString()

    // A locale id is any registry key, so it may not be a language tag Intl
    // accepts. The bare number is the same on the server and the client.
    try {
      return new Intl.NumberFormat(String(locale)).format(value)
    } catch {
      if (__DEV__ && !REJECTED.has(locale)) {
        REJECTED.add(locale)
        useLogger().warn(`useLocale: locale "${String(locale)}" is not a language tag Intl.NumberFormat accepts; n() returns the number unformatted`)
      }

      return value.toString()
    }
  }

  private lookup (key: string, params: unknown[]): string | undefined {
    const locale = this.context.selectedId.value

    if (!locale) return undefined

    const message = this.context.tokens.get(`${locale}.${key}`)?.value

    if (isString(message)) return this.interpolate(this.resolve(locale, message), params)

    if (this.context.fallbackLocale) {
      const fb = this.context.tokens.get(`${this.context.fallbackLocale}.${key}`)?.value
      if (isString(fb)) return this.interpolate(this.resolve(this.context.fallbackLocale, fb), params)
    }

    return undefined
  }

  private resolve (locale: ID, str: string, visited = new Set<string>()): string {
    return str.replace(/{([a-zA-Z0-9.\-_]+)}/g, (match, key) => {
      const [prefix, ...rest] = key.split('.')
      const target = this.context.has(prefix) ? prefix : locale
      const name = this.context.has(prefix) ? rest.join('.') : key

      const path = `${target}.${name}`

      if (visited.has(path)) return match

      const resolved = this.context.tokens.get(path)?.value

      if (isString(resolved)) {
        // Branch with a copy of `visited` so sibling references to the same
        // token resolve independently; only ancestor paths (carried down the
        // copy) count as cycles. A shared, mutated set would drop the second
        // `{app}` in `'{app} loves {app}'`.
        return this.resolve(target, resolved, new Set(visited).add(path))
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
