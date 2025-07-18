// Composables
import { useSingle } from '../useSingle'

// Utilities
import { toRef } from 'vue'

// Types
import type { SingleContext, SingleItem, SingleOptions, SingleTicket } from '../useSingle'
import type { App, Ref } from 'vue'

export interface StepItem extends SingleItem {}

export interface StepTicket extends SingleTicket {}

export interface StepOptions extends SingleOptions {}

export interface StepContext extends SingleContext {
  selectedIndex: Ref<number>
  first: () => void
  last: () => void
  next: () => void
  prev: () => void
  step: (count: number) => void
}

export function useStep<T extends StepContext> (
  namespace: string,
  options?: StepOptions,
) {
  const [
    useGroupContext,
    provideGroupContext,
    group,
  ] = useSingle<T>(namespace, options)

  const selectedIndex = toRef(() => group.selectedItem.value?.index ?? -1)

  function getIdByIndex (index: number) {
    for (const [id, item] of group.tickets) {
      if (item.index === index) return id
    }
    return undefined
  }

  function first () {
    if (group.tickets.size === 0) return

    const firstId = getIdByIndex(0)

    if (firstId === undefined) return

    group.selectedIds.clear()
    group.selectedIds.add(firstId)
  }

  function last () {
    if (group.tickets.size === 0) return

    const lastIndex = group.tickets.size - 1
    const lastId = getIdByIndex(lastIndex)

    if (lastId === undefined) return

    group.selectedIds.clear()
    group.selectedIds.add(lastId)
  }

  function next () {
    step(1)
  }

  function prev () {
    step(group.tickets.size - 1)
  }

  function wrapped (length: number, index: number) {
    return (index + length) % length
  }

  function step (count = 1) {
    const length = group.tickets.size
    if (!length) return

    const direction = Math.sign(count || 1)
    let hops = 0
    let index = wrapped(length, selectedIndex.value + count)
    let id = getIdByIndex(index)

    while (id !== undefined && group.tickets.get(id)?.disabled && hops < length) {
      index = wrapped(length, index + direction)
      id = getIdByIndex(index)
      hops++
    }

    if (id === undefined || hops === length) return

    group.selectedIds.clear()
    group.selectedIds.add(id)
  }

  const context = {
    ...group,
    selectedIndex,
    first,
    last,
    next,
    prev,
    step,
  } as T

  return [
    useGroupContext,
    function (
      model?: Ref<unknown | unknown[]>,
      _context: T = context,
      app?: App,
    ) {
      provideGroupContext(model, _context, app)

      return _context
    },
    context,
  ] as const
}
