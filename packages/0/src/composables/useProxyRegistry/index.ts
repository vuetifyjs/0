/**
 * @module useProxyRegistry
 *
 * @see https://0.vuetifyjs.com/composables/reactivity/use-proxy-registry
 *
 * @remarks
 * Proxy composable for reactive registry keys, values, entries, and size.
 *
 * Key features:
 * - Reactive proxy for registry data
 * - Deep or shallow reactivity options
 * - Event-based updates
 * - Automatic cleanup on scope disposal
 * - Transforms Map-based registry into reactive refs
 *
 * Perfect for exposing registry data as reactive computed properties.
 *
 * @example
 * ```ts
 * import { createRegistry, useProxyRegistry } from '@vuetify/v0'
 *
 * const registry = createRegistry({ events: true })
 * const proxy = useProxyRegistry(registry)
 * registry.register({ value: 'Item 1' })
 * console.log(proxy.size) // 1
 * ```
 */

// Utilities
import { computed, onScopeDispose, reactive, shallowRef } from 'vue'

// Types
import type { RegistryContext, RegistryTicket, RegistryTicketInput } from '#v0/composables/createRegistry'
import type { ID } from '#v0/types'

export interface ProxyRegistryOptions {
  deep?: boolean
}

export interface ProxyRegistryContext<Z extends RegistryTicket = RegistryTicket> {
  keys: readonly ID[]
  values: readonly Z[]
  entries: readonly [ID, Z][]
  size: number
}

/**
 * Creates a proxy registry that provides reactive objects for registry data.
 *
 * @param registry The registry instance to proxy.
 * @param options The options for the proxy registry.
 * @template Z The input ticket type (what users provide to register).
 * @template E The output ticket type (what users receive from get/values).
 * @returns A proxy registry with reactive objects.
 *
 * @see https://0.vuetifyjs.com/composables/reactivity/use-proxy-registry
 *
 * @example
 * ```ts
 * import { createRegistry, useProxyRegistry } from '@vuetify/v0'
 *
 * const registry = createRegistry({ events: true })
 * const proxy = useProxyRegistry(registry)
 *
 * registry.register({ value: 'Item 1' })
 * console.log(proxy.size) // 1
 * ```
 */
export function useProxyRegistry<
  Z extends RegistryTicketInput = RegistryTicketInput,
  E extends RegistryTicket & Z = RegistryTicket & Z,
> (
  registry: RegistryContext<Z, E>,
  options?: ProxyRegistryOptions,
): ProxyRegistryContext<E> {
  const version = shallowRef(0)

  function wrap<T extends object> (value: T): T {
    return options?.deep ? reactive(value) as T : value
  }

  function update () {
    version.value++
  }

  registry.on('register:ticket', update)
  registry.on('unregister:ticket', update)
  registry.on('update:ticket', update)
  registry.on('clear:registry', update)
  registry.on('reindex:registry', update)

  onScopeDispose(() => {
    registry.off('register:ticket', update)
    registry.off('unregister:ticket', update)
    registry.off('update:ticket', update)
    registry.off('clear:registry', update)
    registry.off('reindex:registry', update)
  }, true)

  return reactive({
    keys: computed(() => {
      void version.value
      return registry.keys()
    }),
    values: computed(() => {
      void version.value
      return wrap(registry.values())
    }),
    entries: computed(() => {
      void version.value
      return wrap(registry.entries())
    }),
    size: computed(() => {
      void version.value
      return registry.size
    }),
  }) as ProxyRegistryContext<E>
}
