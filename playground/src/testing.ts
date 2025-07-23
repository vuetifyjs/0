import { inject, provide } from 'vue'

import type { App, InjectionKey, Reactive } from 'vue'

export function createContext<T> (key: InjectionKey<T> | string) {
  function provideContext (value: T, app?: App) {
    app ? app.provide(key, value) : provide(key, value)
  }

  function injectContext (): T {
    const contextValue = inject<T>(key)

    if (contextValue === undefined) {
      throw new Error(`Context "${String(key)}" not found. Ensure it's provided by an ancestor component.`)
    }

    return contextValue
  }

  return [injectContext, provideContext] as const
}

interface RegistryTicket {
  id: string
  index: number
  value: unknown
}

interface RegistryContext {
  collection: Map<string, Reactive<RegistryTicket>>
  register: (id: string, item: unknown) => void
  unregister: (id: string) => void
  reset: () => void
}

export function useRegistry<T extends RegistryContext> (namespace: string) {
  const [injectContext, provideContext] = createContext<T>(namespace)

  function register (id: string, item: unknown) {
    //
  }

  function unregister (id: string) {
    //
  }

  const context = {
    collection: new Map<string, RegistryTicket>(),
    reset: () => context.collection.clear(),
    register,
    unregister,
  } as T

  return [
    injectContext,
    function (
      _context = context,
      app?: App,
    ) {
      provideContext(_context, app)

      return _context
    },
    context,
  ]
}

interface GroupTicket extends RegistryTicket {
  disabled: boolean
  valueIsIndex: boolean
  toggle: () => void
}

interface GroupContext extends RegistryContext {
  selectedIds: Set<string>
  selectedItems: Map<string, GroupTicket>
  collection: Map<string, GroupTicket>
  select: (id: string) => void
}

export function useGroup<T extends GroupContext> (
  namespace: string,
  options?: any,
) {
  const [injectRegistry, provideRegistry, registry] = useRegistry<T>(namespace)
}
