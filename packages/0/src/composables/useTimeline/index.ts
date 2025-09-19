import { useRegistry } from '#v0'
import type { RegistryContext, RegistryTicket } from '#v0'

export interface TimelineContext<Z extends TimelineTicket> extends RegistryContext<Z> {
  timeline: TimelineTicket[]
  size: number
  register: (item?: Partial<Z>) => Z
  undo: () => void
  redo: () => void
}

export interface TimelineTicket extends RegistryTicket {
  id: string
  index: number
  value: unknown
}

export function useTimeline<Z extends TimelineTicket = TimelineTicket,
  E extends TimelineContext<Z> = TimelineContext<Z>> (size = 10) {
  const registry = useRegistry<Z, E>()

  const removedValues: Partial<Z>[] = []
  const firstOutValues: Partial<Z>[] = []

  function register (item: Partial<Z>) {
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

    const ticket = registry.register({ ...item })
    registry.reindex()

    return ticket
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
    registry.onboard(fullArray)
    registry.reindex()
  }

  return {
    ...registry,
    get timeline () {
      return registry.values()
    },
    register,
    undo,
    redo,
  } as E
}
