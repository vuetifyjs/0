/**
 * @module useDate
 *
 * @remarks
 * Date manipulation composable with adapter pattern for date operations.
 *
 * Key features:
 * - Adapter pattern for date library abstraction
 * - Temporal API as default adapter (modern, immutable dates)
 * - Locale-aware formatting via Intl.DateTimeFormat
 * - Integration with useLocale for automatic locale sync
 *
 * @example
 * ```ts
 * import { createDatePlugin } from '@vuetify/v0'
 *
 * const app = createApp(App)
 * app.use(createDatePlugin())
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
 * const context = createDate({ adapter: new DateFnsAdapter() })
 * ```
 */

// Foundational
import { createContext, useContext } from '#v0/composables/createContext'
import { createPlugin } from '#v0/composables/createPlugin'
import { createTrinity } from '#v0/composables/createTrinity'

// Composables
import { useLocale } from '#v0/composables/useLocale'

// Adapters
import { Vuetify0DateAdapter } from '#v0/composables/useDate/adapters'

// Utilities
import { instanceExists, isNullOrUndefined } from '#v0/utilities'
import { computed, watchEffect, onScopeDispose } from 'vue'

// Types
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { DateAdapter } from '#v0/composables/useDate/adapters'
import type { ID } from '#v0/types'
import type { Temporal } from '@js-temporal/polyfill'
import type { App, ComputedRef, Ref } from 'vue'

// Exports
export type { DateAdapter } from '#v0/composables/useDate/adapters'
export { Vuetify0DateAdapter } from '#v0/composables/useDate/adapters'

/** The default date type when using Vuetify0DateAdapter */
type DefaultDateType = Temporal.PlainDateTime

export interface DateContext<Z = DefaultDateType> {
  /** The date adapter instance */
  adapter: DateAdapter<Z>
  /** Current locale (reactive, synced with useLocale if available) */
  locale: ComputedRef<string | undefined>
}

/** Options for date composables */
export interface DateOptions {
  /** Custom date adapter instance (defaults to Vuetify0DateAdapter) */
  adapter?: DateAdapter
  /** Locale for formatting (defaults to useLocale's selected locale or 'en-US') */
  locale?: string
  /** Short locale codes mapped to full Intl locale strings (e.g., { en: 'en-US' }) */
  locales?: Record<string, string>
}

/** Context options with namespace */
export interface DateContextOptions extends DateOptions {
  namespace?: string
}

/** Plugin options */
export interface DatePluginOptions extends DateContextOptions {}

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
 * @param options Optional adapter and locale configuration.
 * @template E The date context type.
 * @returns A date context.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-date
 *
 * @example
 * ```ts
 * const { adapter } = createDate()
 * const today = adapter.date() // Temporal.PlainDateTime
 *
 * // With locale options
 * const { adapter: deAdapter } = createDate({ locale: 'de-DE' })
 *
 * // With custom adapter
 * const { adapter } = createDate({ adapter: new DateFnsAdapter() })
 * ```
 */
export function createDate<
  E extends DateContext = DateContext,
> (options: DateOptions = {}): E {
  const {
    locales = defaultLocales,
    adapter = new Vuetify0DateAdapter() as DateAdapter,
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
    onScopeDispose(stop, true)
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
 * Creates a fallback date context for when useDate is called outside of a Vue component.
 *
 * @returns A fallback date context with Vuetify0DateAdapter.
 * @internal
 */
export function createDateFallback (): DateContext<DefaultDateType> {
  const adapter = new Vuetify0DateAdapter()

  return {
    adapter,
    locale: computed(() => adapter.locale ?? 'en-US'),
  }
}

/**
 * Creates a new date context trinity.
 *
 * @param options Optional adapter, locale, and namespace configuration.
 * @template E The date context type.
 * @returns A trinity [useContext, provideContext, defaultContext].
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-date
 *
 * @example
 * ```ts
 * const [useAppDate, provideAppDate] = createDateContext({
 *   namespace: 'app:date',
 * })
 *
 * // With custom adapter
 * const [useAppDate, provideAppDate] = createDateContext({
 *   adapter: new DateFnsAdapter(),
 *   namespace: 'app:date',
 * })
 * ```
 */
export function createDateContext<
  E extends DateContext = DateContext,
> (options: DateContextOptions = {}): ContextTrinity<E> {
  const { namespace = 'v0:date', ...dateOptions } = options
  const [useDateContext, _provideDateContext] = createContext<E>(namespace)
  const context = createDate<E>(dateOptions)

  function provideDateContext (_context: E = context, app?: App): E {
    return _provideDateContext(_context, app)
  }

  return createTrinity<E>(useDateContext, provideDateContext, context)
}

/**
 * Creates a new date plugin.
 *
 * @param options Optional adapter, locale, and namespace configuration.
 * @template E The date context type.
 * @returns A Vue plugin.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-date
 *
 * @example
 * ```ts
 * const app = createApp(App)
 * app.use(createDatePlugin())
 *
 * // With options
 * app.use(createDatePlugin({ locale: 'de-DE' }))
 *
 * // With custom adapter
 * app.use(createDatePlugin({ adapter: new DateFnsAdapter() }))
 * ```
 */
export function createDatePlugin<
  E extends DateContext = DateContext,
> (options: DatePluginOptions = {}) {
  const { namespace = 'v0:date', ...dateOptions } = options
  const [, provideDateContext, context] = createDateContext<E>({ namespace, ...dateOptions })

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
 * When called inside a component with a provided date context (via plugin or provider),
 * returns that context. Otherwise, returns a fallback context with Vuetify0DateAdapter.
 *
 * @param namespace The namespace to look up (defaults to 'v0:date').
 * @template E The date context type.
 * @returns The current date context.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-date
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
  E extends DateContext = DateContext,
> (namespace = 'v0:date'): E {
  const fallback = createDateFallback() as E

  if (!instanceExists()) return fallback

  try {
    return useContext<E>(namespace, fallback)
  } catch {
    return fallback
  }
}
