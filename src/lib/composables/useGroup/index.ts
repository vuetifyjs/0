import { useContext } from '@/lib/composables/useContext'

import type { ComputedRef, Reactive, Ref } from 'vue'

export interface GroupItem {
  id: string | number
  disabled: boolean
  index: number
  value: unknown
  valueIsIndex: boolean
}

export interface GroupTicket {
  isActive: Ref<boolean>
  index: Ref<number>
  toggle: () => void
}

export interface GroupContext {
  register: (item?: Partial<GroupItem>) => GroupTicket
  unregister: (id: GroupItem['id']) => void
  reset: () => void
  mandate: () => void
  select: (ids: GroupItem['id'] | GroupItem['id'][]) => void
}

export interface GroupState {
  selectedIds: Reactive<Set<GroupItem['id']>>
  selectedItems: ComputedRef<Set<GroupItem>>
  selectedValues: ComputedRef<Set<unknown>>
  registeredItems: Reactive<Map<GroupItem['id'], GroupItem>>
}

export type GroupOptions = {
  mandatory?: boolean | 'force'
  multiple?: boolean
  returnObject?: boolean
}

export function useGroup<T extends GroupContext> (
  namespace: string,
  options?: GroupOptions,
) {
  const [useGroupContext, provideGroupContext] = useContext<T>(namespace)

  const registeredItems = reactive(new Map<GroupItem['id'], GroupItem>())
  const selectedIds = reactive(new Set<GroupItem['id']>())
  let initialValue: unknown | unknown[] = null

  const selectedItems = computed(() => {
    return new Set(
      Array.from(selectedIds).map(id => registeredItems.get(id)),
    )
  })

  const selectedValues = computed(() => {
    return new Set(
      Array.from(selectedItems.value).map(item => item?.value),
    )
  })

  function mandate () {
    if (!options?.mandatory || selectedIds.size > 0 || registeredItems.size === 0) return

    let first = registeredItems.values().next().value

    while (first?.disabled) {
      const next = registeredItems.values().next().value
      if (next === first) break
      first = next
    }

    if (first) selectedIds.add(first.id)
  }

  function reset () {
    selectedIds.clear()
    reindex()
    mandate()
  }

  function reindex () {
    let index = 0

    for (const [, value] of registeredItems) {
      value.index = index++

      if (value.valueIsIndex) {
        value.value = value.index
      }
    }
  }

  function select (ids: GroupItem['id'] | GroupItem['id'][]) {
    toggle(ids)
  }

  function toggle (ids: GroupItem['id'] | GroupItem['id'][]) {
    for (const id of Array.isArray(ids) ? ids : [ids]) {
      if (!id) continue

      const item = registeredItems.get(id)

      if (!item || item.disabled) continue

      const hasId = selectedIds.has(id)

      if (hasId && options?.mandatory) {
        // For single selection, can't deselect if it's the only one
        if (!options?.multiple) continue
        // For multiple selection, can't deselect if it's the last one
        if (selectedIds.size === 1) continue
      }

      if (hasId) {
        selectedIds.delete(id)
      } else {
        // For single selection, clear others first
        if (!options?.multiple) selectedIds.clear()

        selectedIds.add(id)
      }
    }
  }

  function register (item?: Partial<GroupItem>): GroupTicket {
    const index = registeredItems.size

    const registrant: GroupItem = reactive({
      id: item?.id ?? crypto.randomUUID(),
      disabled: item?.disabled ?? false,
      index,
      value: item?.value ?? index,
      valueIsIndex: item?.valueIsIndex ?? item?.value == null,
    })

    registeredItems.set(registrant.id, registrant)

    if (initialValue != null) {
      const shouldSelect = Array.isArray(initialValue)
        ? initialValue.includes(registrant.value)
        : initialValue === registrant.value

      if (shouldSelect) {
        selectedIds.add(registrant.id)
      }
    }

    if (options?.mandatory === 'force') mandate()

    return {
      isActive: toRef(() => selectedIds.has(registrant.id)),
      index: toRef(() => registrant.index),
      toggle: () => toggle(registrant.id),
    }
  }

  function unregister (id: GroupItem['id']) {
    registeredItems.delete(id)
    selectedIds.delete(id)

    reindex()
  }

  if (getCurrentInstance()) {
    onMounted(() => {
      initialValue = undefined
    })
  }

  return [
    useGroupContext,
    function (
      model?: Ref<unknown | unknown[]>,
      context?: Omit<T, keyof GroupContext>,
    ) {
      let isUpdatingModel = false

      if (model) {
        initialValue = toValue(model)

        watch(selectedIds, () => {
          if (isUpdatingModel) return

          const returnObject = options?.returnObject
          const target = returnObject ? selectedItems : selectedValues

          model.value = options?.multiple
            ? Array.from(target.value)
            : target.value.values().next().value
        })

        watch(model, async value => {
          if (isUpdatingModel) return

          const values = new Set(Array.isArray(value) ? value : [value])

          if ((selectedValues.value.symmetricDifference(values)).size === 0) return

          selectedIds.clear()

          for (const val of values) {
            for (const [id, item] of registeredItems) {
              if (item.value !== val) continue

              selectedIds.add(id)

              break
            }
          }
        })

        watch([model, selectedIds], async () => {
          isUpdatingModel = true

          await nextTick()

          isUpdatingModel = false
        })
      }

      const group = {
        register,
        unregister,
        reset,
        mandate,
        select,

        ...context,
      } as T

      provideGroupContext(group)

      return group
    },
    {
      selectedItems,
      selectedIds,
      selectedValues,
      registeredItems,
    } as GroupState,
  ] as const
}
