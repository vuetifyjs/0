// Composables
import { useGroup } from '../useGroup'

// Utilities
import { toRef } from 'vue'

// Types
import type { GroupContext, GroupItem, GroupOptions, GroupTicket } from '../useGroup'
import type { App, Ref } from 'vue'
import type { RegisterCallback } from '../useRegistrar'

export interface StepItem extends GroupItem {}

export interface StepTicket extends GroupTicket {}

export interface StepOptions extends Omit<GroupOptions, 'multiple'> {}

export interface StepContext extends GroupContext {
  currentItem: Ref<any>
  register: RegisterCallback<StepItem, StepTicket>
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
  ] = useGroup<T>(namespace, options)

  const currentItem = toRef(() => group.selectedItems.value.values().next().value)
  const currentIndex = toRef(() => currentItem.value?.index ?? -1)

  function getIdByIndex (index: number) {
    for (const [id, item] of group.registeredItems) {
      if (item.index === index) return id
    }
    return undefined
  }

  function first () {
    if (group.registeredItems.size === 0) return

    const firstId = getIdByIndex(0)

    if (firstId === undefined) return

    group.selectedIds.clear()
    group.selectedIds.add(firstId)
  }

  function last () {
    if (group.registeredItems.size === 0) return

    const lastIndex = group.registeredItems.size - 1
    const lastId = getIdByIndex(lastIndex)

    if (lastId === undefined) return

    group.selectedIds.clear()
    group.selectedIds.add(lastId)
  }

  function next () {
    step(1)
  }

  function prev () {
    step(group.registeredItems.size - 1)
  }

  function wrapped (length: number, index: number) {
    return (index + length) % length
  }

  function step (count = 1) {
    const length = group.registeredItems.size
    if (!length) return

    const direction = Math.sign(count || 1)
    let hops = 0
    let index = wrapped(length, currentIndex.value + count)
    let id = getIdByIndex(index)

    while (id !== undefined && group.registeredItems.get(id)?.disabled && hops < length) {
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
    currentItem,
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
