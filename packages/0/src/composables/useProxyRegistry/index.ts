// Utilities
import { reactive, shallowReactive, onScopeDispose } from 'vue'

// Types
import type { RegistryContext, RegistryTicket } from '#v0/composables/useRegistry'
import type { ID } from '#v0/types'

export interface ProxyRegistryOptions {
  deep?: boolean
}

export interface ProxyRegistryContext<Z extends RegistryTicket = RegistryTicket> {
  keys: ID[]
  values: Z[]
  entries: [ID, Z][]
  size: number
}

/**
 * Creates a proxy registry that provides reactive objects for registry data.
 *
 * @param registry The registry instance to proxy.
 * @param options The options for the proxy registry.
 * @template Z The type of the registry ticket.
 * @returns A proxy registry with reactive objects.
 *
 * @see https://0.vuetifyjs.com/composables/registration/use-proxy-registry
 *
 * @example
 * ```ts
 * import { useRegistry, useProxyRegistry } from '@vuetify/v0'
 *
 * const registry = useRegistry({ events: true })
 * const proxy = useProxyRegistry(registry)
 *
 * registry.register({ value: 'Item 1' })
 * console.log(proxy.size) // 1
 * ```
 */
export function useProxyRegistry<
  Z extends RegistryTicket = RegistryTicket,
> (
  registry: RegistryContext<Z>,
  options?: ProxyRegistryOptions,
): ProxyRegistryContext<Z> {
  const reactivity = options?.deep ? reactive : shallowReactive

  const state = reactivity({
    keys: registry.keys(),
    values: registry.values(),
    entries: registry.entries(),
    size: registry.size,
  })

  function update () {
    state.keys = registry.keys()
    state.values = registry.values()
    state.entries = registry.entries()
    state.size = registry.size
  }

  registry.on('register:ticket', update)
  registry.on('unregister:ticket', update)
  registry.on('update:ticket', update)
  registry.on('clear:registry', update)

  onScopeDispose(() => {
    registry.off('register:item', update)
    registry.off('unregister:ticket', update)
    registry.off('update:ticket', update)
    registry.off('clear:registry', update)
  }, true)

  return state as ProxyRegistryContext<Z>
}
