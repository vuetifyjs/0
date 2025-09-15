// Factories
import { createContext, createPlugin, createTrinity, useContext } from '#v0/factories'

// Composables
import { useGroup } from '#v0/composables/useGroup'
import { useTokens } from '#v0/composables/useTokens'

// Utilities
import { isBoolean, isObject } from '#v0/utilities'

// Types
import type { ContextTrinity } from '#v0/factories'
import type { GroupContext, GroupTicket } from '#v0/composables/useGroup'
import type { ID } from '#v0/types'
import type { App } from 'vue'
import type { TokenCollection, TokenValue } from '#v0/composables/useTokens'

export interface FeatureTicket extends GroupTicket {
  value: TokenValue
}

export interface FeatureContext<Z extends FeatureTicket = FeatureTicket> extends GroupContext<Z> {
  /* Get the variation value of a feature, or a fallback if not set */
  variation: (id: ID, fallback?: any) => any
}

export interface FeatureOptions extends FeaturePluginOptions {}

export interface FeaturePluginOptions {
  features?: Record<ID, boolean | TokenCollection>
}

/**
 *
 * @param namespace The namespace for the feature context
 * @param options Configure initial features to register
 * @template Z The type of feature ticket
 * @template E The type of feature context
 * @returns A context trinity for the features context
 *
 * @see https://0.vuetifyjs.com/composables/plugins/create-features
 */
export function createFeatures<
  Z extends FeatureTicket = FeatureTicket,
  E extends FeatureContext<Z> = FeatureContext<Z>,
> (
  namespace = 'v0:features',
  options: FeatureOptions = {},
): ContextTrinity<E> {
  const [useFeaturesContext, _provideFeaturesContext] = createContext<E>(namespace)
  const tokens = useTokens(options.features, { flat: true })
  const registry = useGroup<Z, E>()

  for (const [id, { value }] of tokens.entries()) {
    register({ id, value } as Partial<Z>)
  }

  function variation (id: ID, fallback: any = null) {
    const ticket = registry.get(id)

    if (!ticket) return fallback

    return isObject(ticket.value) ? ticket.value.$variation ?? fallback : fallback
  }

  function register (registration: Partial<Z> = {}): Z {
    const item: Partial<Z> = {
      value: false,
      ...registration,
    }

    const ticket = registry.register(item)

    if (
      isBoolean(ticket.value) || (
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

  const context = {
    ...registry,
    variation,
    register,
  } as E

  function provideFeaturesContext (_context: E = context, app?: App) {
    return _provideFeaturesContext(_context, app)
  }

  return createTrinity<E>(useFeaturesContext, provideFeaturesContext, context)
}

/**
 * Simple hook to access the theme context.
 *
 * @returns The features context containing current theme state and utilities.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/create-features
 */
export function useFeatures<Z extends FeatureTicket = FeatureTicket> (): FeatureContext<Z> {
  return useContext<FeatureContext<Z>>('v0:features')
}

/**
 * Creates a Vue plugin for feature management with variation support.
 *
 * @param options Configuration for initial features to register.
 * @template Z The type of feature ticket.
 * @template E The type of feature context.
 * @returns A Vue plugin object with install method.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/create-features
 */
export function createFeaturesPlugin<
  Z extends FeatureTicket = FeatureTicket,
  E extends FeatureContext<Z> = FeatureContext<Z>,
> (options: FeaturePluginOptions = {}) {
  const [, provideFeaturesContext, context] = createFeatures<Z, E>('v0:features', options)

  return createPlugin({
    namespace: 'v0:features',
    provide: (app: App) => {
      provideFeaturesContext(context, app)
    },
  })
}
