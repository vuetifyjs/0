// Composables
import { useRegistrar } from '../useRegistrar'

// Utilities
import { computed, getCurrentInstance, nextTick, onMounted, reactive, toRef, toValue, watch } from 'vue'

// Types
import type { ComputedRef, Reactive, Ref } from 'vue'
import type { RegistrarContext, RegistrarItem } from '../useRegistrar'

export interface GroupItemExtension {
  disabled: boolean
  value: unknown
  valueIsIndex: boolean
}

export type GroupItem = RegistrarItem<GroupItemExtension>

export interface GroupTicket {
  isActive: Ref<boolean>
  index: Ref<number>
  toggle: () => void
}

export interface GroupContext extends RegistrarContext<GroupItemExtension> {
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
  const [
    useGroupContext,
    provideGroupContext,
    registrar,
  ] = useRegistrar<GroupItemExtension, GroupContext>(namespace)

  const { registeredItems, register: _register, unregister: _unregister, reindex } = registrar
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

    if (options.mandatory === 'force') {
      const first = registeredItems.values().next().value
      if (first) selectedIds.add(first.id)
      return
    }

    for (const item of registeredItems.values()) {
      if (item.disabled) continue

      selectedIds.add(item.id)
      break
    }
  }

  function reset () {
    selectedIds.clear()
    reindex()
    mandate()
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
    const groupItem = {
      ...item,
      disabled: item?.disabled ?? false,
      value: item?.value ?? registeredItems.size,
      valueIsIndex: item?.valueIsIndex ?? item?.value == null,
    }

    const ticket = _register(groupItem)

    if (initialValue != null) {
      const shouldSelect = Array.isArray(initialValue)
        ? initialValue.includes(ticket.value)
        : initialValue === ticket.value

      if (shouldSelect) selectedIds.add(ticket.id)
    }

    if (options?.mandatory === 'force') mandate()

    return {
      isActive: toRef(() => selectedIds.has(ticket.id)),
      index: toRef(() => registeredItems.get(ticket.id)?.index ?? 0),
      toggle: () => toggle(ticket.id),
    }
  }

  function unregister (id: GroupItem['id']) {
    selectedIds.delete(id)
    _unregister(id)
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
      } as unknown as T

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
