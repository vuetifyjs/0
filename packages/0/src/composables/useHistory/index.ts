import { useRegistry } from '#v0'
import type { RegistryContext, RegistryTicket } from '#v0'

import { watch, unref, ref } from 'vue'
import type { MaybeRef, Ref } from 'vue'

export interface HistoryOptions {
  size?: number
  deep?: boolean
}

export interface HistoryContext<Z extends HistoryTicket> extends RegistryContext<Z> {
  buffer: HistoryTicket[]
  size: number
  deep: boolean
  push: (...items: unknown[]) => void
  undo: () => void
  redo: () => void
  canUndo: Ref<boolean>
}

export interface HistoryTicket extends RegistryTicket {
  id: string
  index: number
  value: unknown
}

export function useHistory<Z extends HistoryTicket = HistoryTicket,
  E extends HistoryContext<Z> = HistoryContext<Z>>
(userRef: MaybeRef, _options: HistoryOptions = {}) {
  const {
    size = 10,
    deep = true,
  } = _options

  const registry = useRegistry<Z, E>()
  let removed: Partial<Z>
  let recentlyRemoved = false

  const canUndo = ref(false)
  const canRedo = ref(false)

  const removedValues: Partial<Z>[] = []

  watch(userRef, () => updateRef(userRef))

  function push (item: Partial<Z>) {
    if (registry.size < size) {
      canUndo.value = true
      return registry.register({ ...item })
    }

    const id = registry.lookup(0)
    registry.unregister(id!)

    registry.register({ ...item })
    registry.reindex()

    canUndo.value = true
  }

  function redo () {
    userRef.value = removedValues.pop()?.value
    canRedo.value = false
  }

  function undo () {
    const id = registry.lookup(registry.size - 1)
    if (!id) return

    removed = registry.get(id!) as Partial<Z>
    removedValues.push(removed)

    registry.unregister(id!)

    const newLastId = registry.lookup(-1)
    userRef.value = registry.get(newLastId!)?.value

    recentlyRemoved = true
    canRedo.value = true
  }

  function updateRef (ref: MaybeRef) {
    if (recentlyRemoved) recentlyRemoved = false
    else push({ value: unref(ref.value) } as Partial<Z>)
  }

  return {
    ...registry,
    get buffer () {
      return registry.values()
    },
    deep,
    push,
    undo,
    redo,
    canUndo,
  } as E
}
