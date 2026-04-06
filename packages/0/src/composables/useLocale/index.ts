/**
 * @module useLocale
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-locale
 *
 * @remarks
 * Internationalization (i18n) composable with adapter pattern for message translation.
 *
 * Key features:
 * - Locale selection with createSingle
 * - Token-based message storage with createTokens
 * - Numbered and named placeholder support ({0}, {name})
 * - Number formatting with Intl.NumberFormat
 * - Adapter pattern for integration with i18n providers (VueI18nLocaleAdapter included)
 *
 * Integrates with createSingle for locale selection and createTokens for message resolution.
 */

// Composables
import { createPluginContext } from '#v0/composables/createPlugin'
import { createSingle } from '#v0/composables/createSingle'
import { createTokens, flatten } from '#v0/composables/createTokens'

// Adapters
import { Vuetify0LocaleAdapter } from '#v0/composables/useLocale/adapters/v0'

// Types
import type { SingleContext, SingleOptions, SingleTicket, SingleTicketInput } from '#v0/composables/createSingle'
import type { TokenCollection } from '#v0/composables/createTokens'
import type { ID } from '#v0/types'
import type { LocaleAdapter } from './adapters'

// Exports
export { Vuetify0LocaleAdapter } from '#v0/composables/useLocale/adapters'

export type { LocaleAdapter, LocaleAdapterContext } from '#v0/composables/useLocale/adapters'

export type LocaleRecord = TokenCollection

/**
 * Input type for locale tickets - what users provide to register().
 */
export interface LocaleTicketInput extends SingleTicketInput {
  messages?: LocaleRecord
}

/**
 * Output type for locale tickets - what users receive from get().
 */
export type LocaleTicket<Z extends LocaleTicketInput = LocaleTicketInput> = SingleTicket<Z>

export interface LocaleContext<
  Z extends LocaleTicketInput = LocaleTicketInput,
  E extends LocaleTicket<Z> = LocaleTicket<Z>,
> extends Omit<SingleContext<Z, E>, 'register'> {
  /**
   * Translate a message key with optional parameters.
   *
   * @param key - The message key to look up
   * @param params - Optional named params object, followed by positional params
   * @returns The translated and interpolated message
   *
   * @example
   * ```ts
   * // Simple key lookup
   * locale.t('hello') // Returns message for 'hello' or 'hello' if not found
   *
   * // With named parameters
   * locale.t('greeting', { name: 'World' }) // 'Hello {name}' → 'Hello World'
   *
   * // With positional parameters
   * locale.t('sum', 1, 2, 3) // 'Sum: {0} + {1} = {2}' → 'Sum: 1 + 2 = 3'
   * ```
   */
  t: (key: string, ...params: unknown[]) => string
  n: (value: number) => string
  /**
   * Register a locale with optional messages.
   *
   * When `messages` is provided, flattens them to dot-notation tokens
   * and onboards them into the token registry before registering the
   * locale for selection.
   *
   * @example
   * ```ts
   * const locale = createLocale({ messages: { en }, default: 'en' })
   *
   * // Lazy-load Dutch at runtime
   * const nl = await import('./locales/nl')
   * locale.register({ id: 'nl', messages: nl.default })
   * locale.select('nl')
   * ```
   */
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

export interface LocalePluginOptions extends LocaleContextOptions {
  persist?: boolean
}

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
  const { adapter: externalAdapter, messages = {}, fallback: fallbackLocale, ...options } = _options
  const tokens = createTokens(messages)
  const registry = createSingle<Z, E>(options)

  for (const id in messages) {
    registry.register({ id } as unknown as Partial<Z>)

    if (id === options.default && !registry.selectedId.value) {
      registry.select(id as ID)
    }
  }

  const adapter = externalAdapter ?? new Vuetify0LocaleAdapter({
    tokens,
    selectedId: registry.selectedId,
    fallbackLocale,
    has: id => registry.has(id),
  })

  function t (key: string, ...params: unknown[]): string {
    return adapter.t(key, ...params)
  }

  function n (value: number): string {
    return adapter.n(value)
  }

  function register (registration: Partial<Z> = {} as Partial<Z>): E {
    const { messages: msgs, ...rest } = registration as Partial<Z> & { messages?: LocaleRecord }

    if (msgs && rest.id && !registry.has(rest.id)) {
      tokens.onboard(flatten({ [rest.id]: msgs }))
    }

    return registry.register(rest as unknown as Partial<Z>)
  }

  return {
    ...registry,
    t,
    n,
    register,
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
    t: (key: string) => key,
    n: String,
  } as unknown as R
}

export const [createLocaleContext, createLocalePlugin, useLocale] =
  createPluginContext<LocalePluginOptions, LocaleContext>(
    'v0:locale',
    options => createLocale(options),
    {
      fallback: () => createLocaleFallback(),
      persist: ctx => ctx.selectedId.value,
      restore: (ctx, saved) => ctx.select(saved as ID),
    },
  )
