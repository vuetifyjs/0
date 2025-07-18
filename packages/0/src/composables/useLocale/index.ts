// Composables
import { useContext } from '#v0/composables/useContext'
import { useSingle } from '#v0/composables/useSingle'
import { createTokens } from '#v0/composables/useTokens'

// Adapters
import { Vuetify0LocaleAdapter } from '#v0/composables/useLocale/adapters/v0'

// Types
import type { SingleContext, SingleTicket } from '#v0/composables/useSingle'
import type { ID } from '#v0/types'
import type { TokenCollection, TokenTicket, TokenContext } from '#v0/composables/useTokens'
import type { LocaleAdapter } from './adapters'
import type { App, Ref } from 'vue'

export type LocaleTicket = SingleTicket

export type LocaleContext = SingleContext & {
  t: (key: string, ...params: unknown[]) => string
  n: (value: number) => string
}

export interface LocalePluginOptions<T extends TokenCollection = TokenCollection> {
  adapter?: LocaleAdapter
  default?: ID
  fallback?: ID
  messages?: Record<ID, T>
}

/**
 * Creates a locale registrar for managing locale translations and number formatting.
 *
 * @param namespace The namespace for the locale context.
 * @param options
 * @template T The type of the locale tickets managed by the registrar.
 * @template U The type of the locale context.
 * @returns An array containing the inject function, provide function, and the locale context.
 */
export function createLocale<
  T extends LocaleTicket,
  U extends LocaleContext,
> (
  namespace: string,
  options: {
    adapter: LocaleAdapter
    messages: Record<ID, TokenCollection>
  },
) {
  const [
    useLocaleContext,
    provideLocaleContext,
    registrar,
  ] = useSingle<T, U>(namespace)

  function resolve (str: string, locale: ID): string {
    return str.replace(/{([a-zA-Z0-9.-_]+)}/g, (match, linkedKey) => {
      const [linkedLocale, ...rest] = linkedKey.split('.')
      const keyPath = rest.join('.')
      const targetLocale = options.messages[linkedLocale] ? linkedLocale : locale
      const targetKey = options.messages[linkedLocale] ? keyPath : linkedKey
      const resolved = options.messages[targetLocale]?.[targetKey]

      return typeof resolved === 'string' ? resolve(resolved, targetLocale) : match
    })
  }

  function t (key: string, ...params: unknown[]): string {
    const locale = registrar.selectedId.value

    if (!locale) return key

    const message = options.messages[locale]?.[key]

    // If the key exists in messages, resolve it with token references
    // Otherwise, use the key itself as a template string
    const template = typeof message === 'string' ? resolve(message, locale) : key

    return options.adapter.t(template, ...params)
  }

  function n (value: number, ...params: unknown[]): string {
    return options.adapter.n(value, registrar.selectedId.value, ...params)
  }

  const context = {
    ...registrar,
    t,
    n,
  } as U

  return [
    useLocaleContext,
    function (
      model?: Ref<ID>,
      _context: U = context,
      app?: App,
    ) {
      provideLocaleContext(model, _context, app)

      return _context
    },
    context,
  ] as const
}

/**
 * Creates a locale registrar for managing locale translations and number formatting.
 *
 * @returns A tuple containing the inject function, provide function, and the locale context.
 */
export function useLocale (): LocaleContext {
  return useContext<LocaleContext>('v0:locale')[0]()
}

/**
 * Creates a locale plugin for Vue applications to manage locale translations and number formatting.
 *
 * @param options
 * @template T The type of the locale tickets managed by the registrar.
 * @template U The type of the locale context.
 * @template R The type of the token tickets managed by the registrar.
 * @template F The type of the token context.
 * @returns Vue install function for the plugin
 */
export function createLocalePlugin<
  T extends LocaleTicket = LocaleTicket,
  U extends LocaleContext = LocaleContext,
  R extends TokenTicket = TokenTicket,
  F extends TokenContext = TokenContext,
> (options: LocalePluginOptions = {}) {
  return {
    install (app: App) {
      const adapter = options.adapter ?? new Vuetify0LocaleAdapter()
      const messages = options.messages ?? {}
      const [, provideLocaleContext, localeContext] = createLocale<T, U>('v0:locale', { adapter, messages })
      const [, provideLocaleTokenContext, tokensContext] = createTokens<R, F>('v0:locale:tokens', messages)

      if (options.messages) {
        for (const id in options.messages) {
          localeContext.register({
            id,
            value: options.messages[id],
          } as Partial<T>, id)

          if (id === options.default && !localeContext.selectedId.value) {
            localeContext.select(id as ID)
          }
        }
      }

      app.runWithContext(() => {
        provideLocaleContext(undefined, localeContext, app)
        provideLocaleTokenContext(tokensContext, app)
      })
    },
  }
}
