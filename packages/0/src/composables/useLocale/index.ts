/**
 * @module useLocale
 *
 * @remarks
 * Internationalization (i18n) composable with adapter pattern for message translation.
 *
 * Key features:
 * - Locale selection with createSingle
 * - Token-based message storage with useTokens
 * - Numbered and named placeholder support ({0}, {name})
 * - Number formatting with Intl.NumberFormat
 * - Adapter pattern for integration with i18n providers
 *
 * Integrates with createSingle for locale selection and useTokens for message resolution.
 */

// Foundational
import { createPluginContext } from '#v0/composables/createPlugin'

// Composables
import { createSingle } from '#v0/composables/createSingle'
import { createTokens } from '#v0/composables/createTokens'

// Adapters
import { Vuetify0LocaleAdapter } from '#v0/composables/useLocale/adapters/v0'

// Utilities
import { isString } from '#v0/utilities'

// Transformers
import { toArray } from '#v0/composables/toArray'

// Types
import type { SingleContext, SingleOptions, SingleTicket, SingleTicketInput } from '#v0/composables/createSingle'
import type { TokenCollection } from '#v0/composables/createTokens'
import type { ID } from '#v0/types'
import type { LocaleAdapter } from './adapters'

// Exports
export { Vuetify0LocaleAdapter } from '#v0/composables/useLocale/adapters'

export type { LocaleAdapter } from '#v0/composables/useLocale/adapters'

export type LocaleRecord = TokenCollection

/**
 * Input type for locale tickets - what users provide to register().
 */
export interface LocaleTicketInput extends SingleTicketInput {}

/**
 * Output type for locale tickets - what users receive from get().
 */
export type LocaleTicket<Z extends LocaleTicketInput = LocaleTicketInput> = SingleTicket<Z>

export interface LocaleContext<
  Z extends LocaleTicketInput = LocaleTicketInput,
  E extends LocaleTicket<Z> = LocaleTicket<Z>,
> extends Omit<SingleContext<Z, E>, 'register'> {
  /**
   * Translate a message key with optional parameters and fallback.
   *
   * @param key - The message key to look up
   * @param params - Optional object with named parameters for interpolation
   * @param fallback - Optional fallback string if key not found in messages
   * @returns The translated and interpolated message
   *
   * @example
   * ```ts
   * // Simple key lookup
   * locale.t('hello') // Returns message for 'hello' or 'hello' if not found
   *
   * // With parameters
   * locale.t('greeting', { name: 'World' }) // 'Hello {name}' → 'Hello World'
   *
   * // With fallback (useful for dynamic keys)
   * locale.t('Pagination.goToPage', { page: 5 }, `Go to page 5`)
   * // If 'pagination.goToPage' exists: uses that message with {page} replaced
   * // If not found: returns 'Go to page 5'
   * ```
   */
  t: (key: string, params?: Record<string, unknown>, fallback?: string) => string
  n: (value: number) => string
  /** Register a locale (accepts input type, returns output type) */
  register: (registration?: Partial<Z>) => E
}

export interface LocaleOptions<Z extends LocaleRecord = LocaleRecord> extends SingleOptions {
  adapter?: LocaleAdapter
  default?: ID
  fallback?: ID
  messages?: Record<ID, Z>
}
export interface LocaleContextOptions extends LocaleOptions {
  namespace?: string
}

export interface LocalePluginOptions extends LocaleContextOptions {}

/**
 * Creates a new locale instance.
 *
 * @param options The options for the locale instance.
 * @template Z The type of the locale ticket.
 * @template E The type of the locale context.
 * @returns A new locale instance.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-locale
 */
export function createLocale<
  Z extends LocaleTicketInput = LocaleTicketInput,
  E extends LocaleTicket<Z> = LocaleTicket<Z>,
  R extends LocaleContext<Z, E> = LocaleContext<Z, E>,
> (_options: LocaleOptions = {}): R {
  const { adapter = new Vuetify0LocaleAdapter(), messages = {}, ...options } = _options
  const tokens = createTokens(messages)
  const registry = createSingle<Z, E>(options)

  for (const id in messages) {
    registry.register({ id } as unknown as Partial<Z>)

    if (id === options.default && !registry.selectedId.value) {
      registry.select(id as ID)
    }
  }

  function t (
    key: string,
    params?: Record<string, unknown>,
    fallback?: string,
  ): string {
    const locale = registry.selectedId.value
    const args = toArray(params)

    if (!locale) return adapter.t(fallback ?? key, ...args)

    // Look up the full flattened path in the token registry
    const path = `${locale}.${key}`
    const message = tokens.get(path)?.value

    // If the key exists in messages, resolve it with token references
    // Otherwise, use the fallback or key itself as a template string
    const template = isString(message) ? resolve(locale, message) : (fallback ?? key)

    return adapter.t(template, ...args)
  }

  function n (value: number, ...params: unknown[]): string {
    return adapter.n(value, registry.selectedId.value, ...params)
  }

  function resolve (locale: ID, str: string, visited = new Set<string>()): string {
    return str.replace(/{([a-zA-Z0-9.-_]+)}/g, (match, key) => {
      const [prefix, ...rest] = key.split('.')
      const target = registry.has(prefix) ? prefix : locale
      const name = registry.has(prefix) ? rest.join('.') : key

      const path = `${target}.${name}`

      if (visited.has(path)) return match

      visited.add(path)

      const resolved = tokens.get(path)?.value

      if (isString(resolved)) {
        return resolve(target, resolved, visited)
      }

      return match
    })
  }

  return {
    ...registry,
    t,
    n,
    get size () {
      return registry.size
    },
  } as unknown as R
}

export function createLocaleFallback<
  Z extends LocaleTicketInput = LocaleTicketInput,
  E extends LocaleTicket<Z> = LocaleTicket<Z>,
  R extends LocaleContext<Z, E> = LocaleContext<Z, E>,
> (): R {
  return {
    size: 0,
    t: (
      key: string,
      _params?: Record<string, unknown>,
      fallback?: string,
    ) => fallback ?? key,
    n: String,
  } as unknown as R
}

export const [createLocaleContext, createLocalePlugin, useLocale] =
  createPluginContext<LocaleContextOptions, LocaleContext>(
    'v0:locale',
    options => createLocale(options),
    { fallback: () => createLocaleFallback() },
  )
