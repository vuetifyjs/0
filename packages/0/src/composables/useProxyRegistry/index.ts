// Utilities
import { ref, shallowRef, nextTick, onScopeDispose } from 'vue'

// Types
import type { RegistryContext, RegistryTicket } from '#v0/composables/useRegistry'
import type { ID } from '#v0/types'
import type { ShallowRef, Ref } from 'vue'

export interface ProxyRegistryOptions {
  deep?: boolean
}

export interface ProxyRegistryContext<Z extends RegistryTicket = RegistryTicket, D extends boolean = false> {
  keys: D extends true ? Ref<ID[]> : ShallowRef<ID[]>
  values: D extends true ? Ref<Z[]> : ShallowRef<Z[]>
  entries: D extends true ? Ref<[ID, Z][]> : ShallowRef<[ID, Z][]>
  size: D extends true ? Ref<number> : ShallowRef<number>
}

/**
 * Creates a proxy registry that provides reactive refs for registry data.
 *
 * @param registry The registry instance to proxy.
 * @param options The options for the proxy registry.
 * @template Z The type of the registry ticket.
 * @returns A proxy registry with reactive refs.
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
 * console.log(proxy.size.value) // 1
 * ```
 */
export function useProxyRegistry<
  Z extends RegistryTicket = RegistryTicket,
  D extends boolean = false,
> (
  registry: RegistryContext<Z>,
  options?: ProxyRegistryOptions & { deep?: D },
): ProxyRegistryContext<Z, D> {
  const reactivity = options?.deep ? ref : shallowRef

  const keys = reactivity<ID[]>(registry.keys())
  const values = reactivity<Z[]>(registry.values())
  const entries = reactivity<[ID, Z][]>(registry.entries())
  const size = reactivity<number>(registry.size)

  function update () {
    keys.value = registry.keys()
    values.value = registry.values()
    entries.value = registry.entries()
    size.value = registry.size
  }

  registry.on('register', update)
  registry.on('unregister', update)

  onScopeDispose(() => {
    registry.off('register', update)
    registry.off('unregister', update)
  }, true)

  return {
    keys,
    values,
    entries,
    size,
  } as ProxyRegistryContext<Z, D>
}
