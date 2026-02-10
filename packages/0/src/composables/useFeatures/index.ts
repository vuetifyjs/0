/**
 * @module useFeatures
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-features
 *
 * @remarks
 * Feature flag system with boolean and token-based features.
 *
 * Key features:
 * - Boolean features (true/false activation)
 * - Token features with $variation support
 * - Auto-selection of enabled features
 * - Multi-select support for feature combinations
 * - Perfect for A/B testing, progressive rollout, feature toggles
 * - Adapter pattern for external feature flag services
 *
 * Inheritance chain: useRegistry → createSelection → createGroup → createFeatures
 * Integrates with useTokens for token-based features.
 */

// Foundational
import { createContext, useContext } from '#v0/composables/createContext'
import { createPlugin } from '#v0/composables/createPlugin'
import { createTrinity } from '#v0/composables/createTrinity'

// Composables
import { createGroup } from '#v0/composables/createGroup'
import { createTokens } from '#v0/composables/createTokens'

// Utilities
import { isArray, isBoolean, isFunction, isObject } from '#v0/utilities'

// Types
import type { GroupContext, GroupTicket, GroupTicketInput } from '#v0/composables/createGroup'
import type { RegistryOptions } from '#v0/composables/createRegistry'
import type { TokenCollection } from '#v0/composables/createTokens'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { FeaturesAdapterInterface, FeaturesAdapterFlags } from '#v0/composables/useFeatures/adapters'
import type { ID, MaybeArray } from '#v0/types'
import type { App } from 'vue'

export type { FeaturesAdapterFlags, FeaturesAdapterInterface, FeaturesAdapterValue } from '#v0/composables/useFeatures/adapters'
export { FeaturesAdapter } from '#v0/composables/useFeatures/adapters'

/**
 * Input type for feature tickets - what users provide to register().
 */
export interface FeatureTicketInput extends GroupTicketInput {}

/**
 * Output type for feature tickets - what users receive from get().
 */
export type FeatureTicket<Z extends FeatureTicketInput = FeatureTicketInput> = GroupTicket<Z>

export interface FeatureContext<
  Z extends FeatureTicketInput = FeatureTicketInput,
  E extends FeatureTicket<Z> = FeatureTicket<Z>,
> extends Omit<GroupContext<Z, E>, 'register'> {
  /**
   * Get the variation value of a feature, or a fallback if not set.
   *
   * @param id The feature ID.
   * @param fallback The fallback value if the feature has no variation.
   */
  variation: (id: ID, fallback?: unknown) => unknown
  /**
   * Sync feature flags from an external source.
   *
   * @param flags The flags to sync, typically from an adapter.
   *
   * @remarks This updates existing flags and registers new ones.
   * Use this when adapter flags change to update the registry.
   */
  sync: (flags: FeaturesAdapterFlags) => void
  /** Register a feature (accepts input type, returns output type) */
  register: (registration?: Partial<Z>) => E
}

export interface FeatureOptions extends RegistryOptions {
  /**
   * Static feature flags to register.
   */
  features?: Record<ID, boolean | TokenCollection>
}

export interface FeatureContextOptions extends FeatureOptions {
  namespace?: string
}

export interface FeaturePluginOptions extends FeatureContextOptions {
  /**
   * Feature flag adapter for external services.
   *
   * @remarks Adapters provide dynamic flag values from external services.
   */
  adapter?: MaybeArray<FeaturesAdapterInterface>
}

/**
 * Creates a new features instance.
 *
 * @param options The options for the features instance.
 * @template Z The type of the feature ticket.
 * @template E The type of the feature context.
 * @returns A new features instance.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-features
 *
 * @example
 * ```ts
 * import { createFeatures } from '@vuetify/v0'
 *
 * const [useFeatures, provideFeaturesContext, context] = createFeatures({
 *   namespace: 'v0:features',
 *   features: {
 *     'dark-mode': true,
 *     'theme-color': { $variation: 'blue' },
 *   },
 * })
 * ```
 */
export function createFeatures<
  Z extends FeatureTicketInput = FeatureTicketInput,
  E extends FeatureTicket<Z> = FeatureTicket<Z>,
  R extends FeatureContext<Z, E> = FeatureContext<Z, E>,
> (_options: FeatureOptions = {}): R {
  const { features, ...options } = _options

  const tokens = createTokens(features, { flat: true })
  const registry = createGroup<Z, E>({ ...options, reactive: true })

  for (const [id, { value }] of tokens.entries()) {
    register({ id, value } as unknown as Partial<Z>)
  }

  function variation (id: ID, fallback: unknown = null) {
    const ticket = registry.get(id)

    if (!ticket) return fallback

    return isObject(ticket.value) ? ticket.value.$variation ?? fallback : ticket.value ?? fallback
  }

  function register (registration: Partial<Z> = {} as Partial<Z>): E {
    const item = {
      value: false,
      ...registration,
    }

    const ticket = registry.register(item as unknown as Partial<Z>)

    if (
      (isBoolean(ticket.value) && ticket.value === true) || (
        isObject(ticket.value) && (
          isBoolean(ticket.value.$value) &&
          ticket.value.$value === true
        )
      )
    ) {
      registry.select(ticket.id)
    }

    return ticket
  }

  function sync (flags: FeaturesAdapterFlags): void {
    for (const [id, value] of Object.entries(flags)) {
      const existing = registry.get(id)

      if (existing) {
        const shouldSelect = isBoolean(value)
          ? value === true
          : isObject(value) && isBoolean(value.$value) && value.$value === true

        registry.upsert(id, { value } as unknown as Partial<E>)

        if (shouldSelect) {
          registry.select(id)
        } else {
          registry.unselect(id)
        }
      } else {
        register({ id, value } as Partial<Z>)
      }
    }
  }

  function onboard (registrations: Partial<Z>[]): E[] {
    return registry.batch(() => registrations.map(registration => register(registration)))
  }

  return {
    ...registry,
    variation,
    register,
    onboard,
    sync,
    get size () {
      return registry.size
    },
  } as unknown as R
}

/**
 * Creates a new features context.
 *
 * @param options The options for the features context.
 * @template Z The type of the feature ticket.
 * @template E The type of the feature context.
 * @returns A new features context.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-features
 *
 * @example
 * ```ts
 * import { createFeaturesContext } from '@vuetify/v0'
 *
 * export const [useFeatures, provideFeatures, context] = createFeaturesContext({
 *   namespace: 'app:features',
 *   features: {
 *     'dark-mode': true,
 *     'theme-color': { $variation: 'blue' },
 *   },
 * })
 * ```
 */
export function createFeaturesContext<
  Z extends FeatureTicketInput = FeatureTicketInput,
  E extends FeatureTicket<Z> = FeatureTicket<Z>,
  R extends FeatureContext<Z, E> = FeatureContext<Z, E>,
> (_options: FeatureContextOptions = {}): ContextTrinity<R> {
  const { namespace = 'v0:features', ...options } = _options
  const [useFeaturesContext, _provideFeaturesContext] = createContext<R>(namespace)
  const context = createFeatures<Z, E, R>(options)

  function provideFeaturesContext (_context: R = context, app?: App): R {
    return _provideFeaturesContext(_context, app)
  }

  return createTrinity<R>(useFeaturesContext, provideFeaturesContext, context)
}

/**
 * Creates a new features plugin.
 *
 * @param options The options for the features plugin.
 * @template Z The type of the feature ticket.
 * @template E The type of the feature context.
 * @returns A new features plugin.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-features
 *
 * @example
 * ```ts
 * import { createApp } from 'vue'
 * import { createFeaturesPlugin } from '@vuetify/v0'
 * import App from './App.vue'
 *
 * const app = createApp(App)
 *
 * app.use(
 *   createFeaturesPlugin({
 *     features: {
 *       'dark-mode': true,
 *       'theme-color': { $variation: 'blue' },
 *     },
 *   })
 * )
 *
 * app.mount('#app')
 * ```
 */
export function createFeaturesPlugin<
  Z extends FeatureTicketInput = FeatureTicketInput,
  E extends FeatureTicket<Z> = FeatureTicket<Z>,
  R extends FeatureContext<Z, E> = FeatureContext<Z, E>,
> (_options: FeaturePluginOptions = {}) {
  const { namespace = 'v0:features', adapter, ...options } = _options
  const [, provideFeaturesContext, context] = createFeaturesContext<Z, E, R>({ ...options, namespace })

  return createPlugin({
    namespace,
    provide: (app: App) => {
      provideFeaturesContext(context, app)
    },
    setup: (app: App) => {
      if (!adapter) return

      const adapters = isArray(adapter) ? adapter : [adapter]

      for (const adapter of adapters) {
        const initialFlags = adapter.setup(flags => {
          context.sync(flags)
        })

        context.sync(initialFlags)

        if (isFunction(adapter.dispose)) {
          app.onUnmount(() => adapter.dispose!())
        }
      }
    },
  })
}

/**
 * Returns the current features instance.
 *
 * @param namespace The namespace for the features context. Defaults to `v0:features`.
 * @template Z The type of the feature ticket.
 * @returns The current features instance.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-features
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { useFeatures } from '@vuetify/v0'
 *
 *   const features = useFeatures()
 * </script>
 *
 * <template>
 *   <div>
 *     <p>Features: {{ features.get('dark-mode') }}</p>
 *     <p>Theme Color: {{ features.variation('theme-color') }}</p>
 *   </div>
 * </template>
 * ```
 */
export function useFeatures<
  Z extends FeatureTicketInput = FeatureTicketInput,
  E extends FeatureTicket<Z> = FeatureTicket<Z>,
  R extends FeatureContext<Z, E> = FeatureContext<Z, E>,
> (namespace = 'v0:features'): R {
  return useContext<R>(namespace)
}
