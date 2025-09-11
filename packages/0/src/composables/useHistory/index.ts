import { useRegistry } from '#v0'
import type { RegistryContext, RegistryTicket } from '#v0'

export interface HistoryOptions {
  size?: number
}

export interface HistoryContext<Z extends HistoryTicket> extends RegistryContext<Z> {
  history: HistoryTicket[]
  size: number
  push: (...items: unknown[]) => void
  undo: () => void
  redo: () => void
}

export interface HistoryTicket extends RegistryTicket {
  id: string
  index: number
  value: unknown
}

export function useHistory<Z extends HistoryTicket = HistoryTicket,
  E extends HistoryContext<Z> = HistoryContext<Z>>
(_options: HistoryOptions = {}) {
  const {
    size = 10,
  } = _options

  const registry = useRegistry<Z, E>()

  const removedValues: Partial<Z>[] = []
  const firstOutValues: Partial<Z>[] = []

  function push (item: Partial<Z>) {
    if (registry.size < size) {
      return registry.register({ ...item })
    }

    const id = registry.lookup(0)
    const itemToRemove = registry.get(id!)
    if (firstOutValues.length === size) {
      firstOutValues.shift()
    }
    firstOutValues.push(itemToRemove as Partial<Z>)

    registry.unregister(id!)

    registry.register({ ...item })
    registry.reindex()
  }

  function redo () {
    if (removedValues.length === 0) return

    registry.register(removedValues.pop() as Partial<Z>)
    registry.reindex()
  }

  function undo () {
    const id = registry.lookup(registry.size - 1)
    if (!id) return

    const removed = registry.get(id!)
    removedValues.push(removed as Partial<Z>)

    registry.unregister(id!)

    restore()
  }

  function restore () {
    const value = firstOutValues.pop()

    const fullArray = value ? [value, ...registry.values()] : [...registry.values()]
    registry.clear()
    for (const item of fullArray) {
      registry.register(item)
    }
    registry.reindex()
  }

  return {
    ...registry,
    get history () {
      return registry.values()
    },
    push,
    undo,
    redo,
    removedValues,
    firstOutValues,
  } as E
}
