// Composables
import { useGroup } from '../useGroup'

// Utilities
import { toRef } from 'vue'

// Types
import type { GroupContext, GroupItem, GroupOptions, GroupTicket } from '../useGroup'
import type { Ref } from 'vue'

export interface StepItem extends GroupItem {}

export interface StepTicket extends GroupTicket {}

export interface StepOptions extends Omit<GroupOptions, 'multiple'> {}

export interface StepContext extends GroupContext {
  currentItem: Ref<any>
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

  function step (count: number) {
    if (group.registeredItems.size === 0) return

    const current = currentIndex.value
    const newIndex = ((current + count) % group.registeredItems.size + group.registeredItems.size) % group.registeredItems.size
    const newId = getIdByIndex(newIndex)

    if (newId === undefined) return

    group.selectedIds.clear()
    group.selectedIds.add(newId)
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
    ) {
      provideGroupContext(model, _context)

      return _context
    },
    context,
  ] as const
}
