// Factories
import { createPlugin } from '#v0/factories/createPlugin'
import { createTrinity } from '#v0/factories/createTrinity'

// Composables
import { useContext } from '#v0/factories/createContext'
import { useSingle } from '#v0/composables/useSingle'
import { useTokens } from '#v0/composables/useTokens'

// Adapters
import { Vuetify0LocaleAdapter } from '#v0/composables/useLocale/adapters/v0'

// Types
import type { SingleContext, SingleTicket } from '#v0/composables/useSingle'
import type { ID } from '#v0/types'
import type { TokenCollection, TokenTicket, TokenContext } from '#v0/composables/useTokens'
import type { LocaleAdapter } from './adapters'
import type { App } from 'vue'

export type LocaleTicket = SingleTicket

export type LocaleContext = SingleContext & {
  t: (key: string, ...params: unknown[]) => string
  n: (value: number) => string
}

export interface LocaleOptions extends LocalePluginOptions {}

export interface LocalePluginOptions<Z extends TokenCollection = TokenCollection> {
  adapter?: LocaleAdapter
  default?: ID
  fallback?: ID
  messages?: Record<ID, Z>
}

export interface LocalePlugin {
  install: (app: App, ...options: any[]) => any
}

/**
 * Creates a locale registry for managing locale translations and number formatting.
 *
 * @param namespace The namespace for the locale context.
 * @param options Configuration including adapter and messages.
 * @template Z The type of the locale context.
 * @template E The type of the locale items managed by the registry.
 * @returns An array containing the inject function, provide function, and the locale context.
 */
export function createLocale<
  Z extends LocaleContext,
  E extends LocaleTicket,
> (
  namespace = 'v0:locale',
  options: LocaleOptions = {},
) {
  const { adapter = new Vuetify0LocaleAdapter(), messages = {} } = options
  const [useLocaleContext, provideLocaleContext, registry] = useSingle<Z, E>(namespace)

  for (const id in messages) {
    registry.register({
      id,
      value: messages[id],
    } as Partial<E>, id)

    if (id === options.default && !registry.selectedId.value) {
      registry.select(id as ID)
    }
  }

  function t (key: string, ...params: unknown[]): string {
    const locale = registry.selectedId.value

    if (!locale) return key

    const message = messages[locale]?.[key]

    // If the key exists in messages, resolve it with token references
    // Otherwise, use the key itself as a template string
    const template = typeof message === 'string' ? resolve(locale, message) : key

    return adapter.t(template, ...params)
  }

  function n (value: number, ...params: unknown[]): string {
    return adapter.n(value, registry.selectedId.value, ...params)
  }

  function resolve (locale: ID, str: string): string {
    return str.replace(/{([a-zA-Z0-9.-_]+)}/g, (match, linkedKey) => {
      const [linkedLocale, ...rest] = linkedKey.split('.')
      const keyPath = rest.join('.')
      const targetLocale = messages[linkedLocale] ? linkedLocale : locale
      const targetKey = messages[linkedLocale] ? keyPath : linkedKey
      const resolved = messages[targetLocale]?.[targetKey]

      return typeof resolved === 'string' ? resolve(targetLocale, resolved) : match
    })
  }

  return createTrinity<Z>(useLocaleContext, provideLocaleContext, {
    ...registry,
    t,
    n,
  } as Z)
}

/**
 * Simple hook to access the locale context.
 *
 * @returns The locale context containing translation and formatting functions.
 */
export function useLocale (): LocaleContext {
  return useContext<LocaleContext>('v0:locale')()
}

/**
 * Creates a locale plugin for Vue applications to manage locale translations and number formatting.
 * Uses the universal plugin factory to eliminate boilerplate code.
 *
 * @param options Configuration for adapter, default locale, and messages.
 * @template Z The type of the locale context.
 * @template E The type of the locale items managed by the registry.
 * @template R The type of the token context.
 * @template O The type of the token items managed by the registry.
 * @returns Vue install function for the plugin
 */
export function createLocalePlugin<
  Z extends LocaleContext = LocaleContext,
  E extends LocaleTicket = LocaleTicket,
  R extends TokenContext = TokenContext,
  O extends TokenTicket = TokenTicket,
> (options: LocalePluginOptions = {}): LocalePlugin {
  const { adapter = new Vuetify0LocaleAdapter(), messages = {} } = options
  const [, provideLocaleTokenContext, tokensContext] = useTokens<R, O>('v0:locale:tokens', messages)
  const [, provideLocaleContext, localeContext] = createLocale<Z, E>('v0:locale', { adapter, messages })

  return createPlugin<LocalePlugin>({
    namespace: 'v0:locale',
    provide: (app: App) => {
      provideLocaleContext(undefined, localeContext, app)
      provideLocaleTokenContext(undefined, tokensContext, app)
    },
  })
}
