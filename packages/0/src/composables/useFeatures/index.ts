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
import { isBoolean, isObject } from '#v0/utilities'

// Types
import type { GroupContext, GroupTicket, GroupTicketInput } from '#v0/composables/createGroup'
import type { RegistryOptions } from '#v0/composables/createRegistry'
import type { TokenCollection } from '#v0/composables/createTokens'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { ID } from '#v0/types'
import type { App } from 'vue'

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
  /* Get the variation value of a feature, or a fallback if not set */
  variation: (id: ID, fallback?: unknown) => unknown
  /** Register a feature (accepts input type, returns output type) */
  register: (registration?: Partial<Z>) => E
}

export interface FeatureOptions extends RegistryOptions {
  features?: Record<ID, boolean | TokenCollection>
}

export interface FeatureContextOptions extends FeatureOptions {
  namespace?: string
}

export interface FeaturePluginOptions extends FeatureContextOptions {}

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
  const registry = createGroup<Z, E>(options)

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

  return {
    ...registry,
    variation,
    register,
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
  const { namespace = 'v0:features', ...options } = _options
  const [, provideFeaturesContext, context] = createFeaturesContext<Z, E, R>({ ...options, namespace })

  return createPlugin({
    namespace,
    provide: (app: App) => {
      provideFeaturesContext(context, app)
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
