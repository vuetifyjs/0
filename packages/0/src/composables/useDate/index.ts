/**
 * @module useDate
 *
 * @remarks
 * Date manipulation composable with adapter pattern for date operations.
 *
 * Key features:
 * - Adapter pattern for date library abstraction
 * - Locale-aware formatting via Intl.DateTimeFormat
 * - Integration with useLocale for automatic locale sync
 *
 * @example Using the built-in Temporal adapter
 * ```ts
 * import { Vuetify0DateAdapter } from '@vuetify/v0/date'
 * import { createDatePlugin } from '@vuetify/v0'
 *
 * const app = createApp(App)
 * app.use(createDatePlugin({ adapter: new Vuetify0DateAdapter() }))
 *
 * // In a component:
 * const { adapter } = useDate()
 * const today = adapter.date()
 * const formatted = adapter.format(today, 'fullDate')
 * ```
 *
 * @example Custom adapter
 * ```ts
 * import type { DateAdapter } from '@vuetify/v0'
 *
 * class DateFnsAdapter implements DateAdapter<Date> {
 *   // ... implementation
 * }
 *
 * app.use(createDatePlugin({ adapter: new DateFnsAdapter() }))
 * ```
 */

// Foundational
import { createContext, useContext } from '#v0/composables/createContext'
import { createPlugin } from '#v0/composables/createPlugin'
import { createTrinity } from '#v0/composables/createTrinity'

// Composables
import { useLocale } from '#v0/composables/useLocale'

// Utilities
import { instanceExists, isNullOrUndefined } from '#v0/utilities'
import { computed, watchEffect, onScopeDispose } from 'vue'

// Types
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { DateAdapter } from '#v0/composables/useDate/adapters'
import type { ID } from '#v0/types'
import type { App, ComputedRef, Ref } from 'vue'

// Exports
export type { DateAdapter } from '#v0/composables/useDate/adapters'

export interface DateContext<Z> {
  /** The date adapter instance */
  adapter: DateAdapter<Z>
  /** Current locale (reactive, synced with useLocale if available) */
  locale: ComputedRef<string | undefined>
}

/** Options for date composables */
export interface DateOptions<Z> {
  /**
   * Date adapter instance.
   *
   * @example
   * ```ts
   * import { Vuetify0DateAdapter } from '@vuetify/v0/date'
   * createDate({ adapter: new Vuetify0DateAdapter() })
   * ```
   */
  adapter: DateAdapter<Z>
  /** Locale for formatting (defaults to useLocale's selected locale or 'en-US') */
  locale?: string
  /** Short locale codes mapped to full Intl locale strings (e.g., { en: 'en-US' }) */
  locales?: Record<string, string>
}

/** Context options with namespace */
export interface DateContextOptions<Z> extends DateOptions<Z> {
  namespace?: string
}

/** Plugin options */
export interface DatePluginOptions<Z> extends DateContextOptions<Z> {}

/**
 * Default short locale codes mapped to full Intl locale strings.
 * Used when useLocale provides a short code without region (e.g., 'en' instead of 'en-US').
 */
const defaultLocales: Record<string, string> = {
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  it: 'it-IT',
  pt: 'pt-BR',
  ja: 'ja-JP',
  ko: 'ko-KR',
  zh: 'zh-CN',
  ru: 'ru-RU',
  ar: 'ar-SA',
}

/**
 * Creates a new date context.
 *
 * @param options Adapter and locale configuration.
 * @template Z The date type used by the adapter.
 * @template E The date context type.
 * @returns A date context.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-date
 *
 * @example
 * ```ts
 * import { Vuetify0DateAdapter } from '@vuetify/v0/date'
 *
 * const { adapter } = createDate({ adapter: new Vuetify0DateAdapter() })
 * const today = adapter.date()
 *
 * // With locale options
 * const { adapter } = createDate({
 *   adapter: new Vuetify0DateAdapter(),
 *   locale: 'de-DE',
 * })
 * ```
 */
export function createDate<
  Z,
  E extends DateContext<Z> = DateContext<Z>,
> (options: DateOptions<Z>): E {
  const {
    locales = defaultLocales,
    adapter,
    locale: initialLocale,
  } = options

  // Try to get selected locale from useLocale if available
  let selectedId: Ref<ID | undefined> | undefined

  try {
    if (instanceExists()) {
      selectedId = useLocale().selectedId
    }
  } catch {
    // useLocale not available, use default
  }

  // Resolve locale: useLocale selection > initial option > adapter default
  const locale = computed(() => {
    const selected = selectedId?.value

    if (!isNullOrUndefined(selected)) {
      const str = String(selected)
      // Full Intl locales (with region) used directly, short codes mapped
      return str.includes('-') ? str : (locales[str] ?? str)
    }

    const fallback = initialLocale ?? adapter.locale ?? 'en-US'
    return fallback.includes('-') ? fallback : (locales[fallback] ?? fallback)
  })

  // Keep adapter locale in sync (only when in component scope)
  if (instanceExists()) {
    const stop = watchEffect(() => {
      const loc = locale.value

      if (loc && adapter.locale !== loc) {
        adapter.locale = loc
      }
    })
    onScopeDispose(stop)
  } else {
    // Outside component: sync once, no reactive watch
    const loc = locale.value
    if (loc && adapter.locale !== loc) {
      adapter.locale = loc
    }
  }

  return { adapter, locale } as E
}

/**
 * Creates a new date context trinity.
 *
 * @param options Adapter, locale, and namespace configuration.
 * @template Z The date type used by the adapter.
 * @template E The date context type.
 * @returns A trinity [useContext, provideContext, defaultContext].
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-date
 *
 * @example
 * ```ts
 * import { Vuetify0DateAdapter } from '@vuetify/v0/date'
 *
 * const [useAppDate, provideAppDate] = createDateContext({
 *   adapter: new Vuetify0DateAdapter(),
 *   namespace: 'app:date',
 * })
 * ```
 */
export function createDateContext<
  Z,
  E extends DateContext<Z> = DateContext<Z>,
> (options: DateContextOptions<Z>): ContextTrinity<E> {
  const { namespace = 'v0:date', ...dateOptions } = options
  const [useDateContext, _provideDateContext] = createContext<E>(namespace)
  const context = createDate<Z, E>(dateOptions)

  function provideDateContext (_context: E = context, app?: App): E {
    return _provideDateContext(_context, app)
  }

  return createTrinity<E>(useDateContext, provideDateContext, context)
}

/**
 * Creates a new date plugin.
 *
 * @param options Adapter, locale, and namespace configuration.
 * @template Z The date type used by the adapter.
 * @template E The date context type.
 * @returns A Vue plugin.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-date
 *
 * @example
 * ```ts
 * import { Vuetify0DateAdapter } from '@vuetify/v0/date'
 *
 * const app = createApp(App)
 * app.use(createDatePlugin({ adapter: new Vuetify0DateAdapter() }))
 *
 * // With locale options
 * app.use(createDatePlugin({
 *   adapter: new Vuetify0DateAdapter(),
 *   locale: 'de-DE',
 * }))
 * ```
 */
export function createDatePlugin<
  Z,
  E extends DateContext<Z> = DateContext<Z>,
> (options: DatePluginOptions<Z>) {
  const { namespace = 'v0:date', ...dateOptions } = options
  const [, provideDateContext, context] = createDateContext<Z, E>({ namespace, ...dateOptions })

  return createPlugin({
    namespace,
    provide: (app: App) => {
      provideDateContext(context, app)
    },
  })
}

/**
 * Returns the current date context.
 *
 * Requires `createDatePlugin` to be installed with an adapter.
 *
 * @param namespace The namespace to look up (defaults to 'v0:date').
 * @template Z The date type used by the adapter.
 * @template E The date context type.
 * @returns The current date context.
 * @throws If called outside a component or without a date plugin installed.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-date
 *
 * @example
 * ```ts
 * // main.ts
 * import { Vuetify0DateAdapter } from '@vuetify/v0/date'
 * import { createDatePlugin } from '@vuetify/v0'
 *
 * app.use(createDatePlugin({ adapter: new Vuetify0DateAdapter() }))
 * ```
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useDate } from '@vuetify/v0'
 *
 * const { adapter, locale } = useDate()
 * const today = adapter.date()
 * </script>
 * ```
 */
export function useDate<
  Z,
  E extends DateContext<Z> = DateContext<Z>,
> (namespace = 'v0:date'): E {
  if (!instanceExists()) {
    throw new Error(
      '[v0] useDate() must be called inside a Vue component with createDatePlugin installed.\n\n' +
      'Example:\n' +
      '  import { Vuetify0DateAdapter } from \'@vuetify/v0/date\'\n' +
      '  import { createDatePlugin } from \'@vuetify/v0\'\n\n' +
      '  app.use(createDatePlugin({ adapter: new Vuetify0DateAdapter() }))',
    )
  }

  return useContext<E>(namespace)
}
