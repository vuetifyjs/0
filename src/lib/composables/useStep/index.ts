import type { GroupContext, GroupOptions, GroupState } from '@/lib/composables/useGroup'
import type { Ref } from 'vue'

export interface StepOptions extends Omit<GroupOptions, 'multiple'> {}

export interface StepContext extends GroupContext {
  first: () => void
  last: () => void
  next: () => void
  prev: () => void
  step: (count: number) => void
}

export interface StepState extends GroupState {
  currentItem: Ref<any>
}

export function useStep<T extends StepContext> (
  namespace: string,
  options?: StepOptions,
) {
  const [
    useGroupContext,
    provideGroupContext,
    groupState,
  ] = useGroup<StepContext>(namespace, options)

  const currentItem = toRef(() => groupState.selectedItems.value.values().next().value)
  const currentIndex = toRef(() => currentItem.value?.index ?? -1)

  const registeredIds = computed(() => {
    return new Map(
      Array.from(groupState.registeredItems).map(([id, item]) => [item.index, id]),
    )
  })

  function first () {
    if (registeredIds.value.size === 0) return

    const firstId = registeredIds.value.get(0)

    if (firstId === undefined) return

    groupState.selectedIds.clear()
    groupState.selectedIds.add(firstId)
  }

  function last () {
    if (registeredIds.value.size === 0) return

    const lastIndex = groupState.registeredItems.size - 1
    const lastId = registeredIds.value.get(lastIndex)

    if (lastId === undefined) return

    groupState.selectedIds.clear()
    groupState.selectedIds.add(lastId)
  }

  function next () {
    step(1)
  }

  function prev () {
    step(groupState.registeredItems.size - 1)
  }

  function step (count: number) {
    if (groupState.registeredItems.size === 0) return

    const current = currentIndex.value
    const newIndex = ((current + count) % groupState.registeredItems.size + groupState.registeredItems.size) % groupState.registeredItems.size
    const newId = registeredIds.value.get(newIndex)

    if (newId === undefined) return

    groupState.selectedIds.clear()
    groupState.selectedIds.add(newId)
  }

  return [
    useGroupContext,
    function (model?: Ref<unknown | unknown[]>) {
      const group = provideGroupContext(model, {
        next,
        prev,
        step,
        first,
        last,
      }) as T

      return group
    },
    {
      ...groupState,
      currentItem,
    } as StepState,
  ] as const
}
