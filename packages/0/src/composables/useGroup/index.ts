// Composables
import { useRegistrar } from '../useRegistrar'

// Utilities
import { computed, getCurrentInstance, nextTick, onMounted, reactive, toRef, toValue, watch } from 'vue'

// Types
import type { App, ComputedGetter, ComputedRef, Reactive, Ref } from 'vue'
import type { RegistrarContext, RegistrarTicket } from '../useRegistrar'
import type { ID } from '#v0/types'
import { genId } from '#v0/utils/helpers'

export type GroupTicket = RegistrarTicket & {
  disabled: boolean
  value: unknown
  valueIsIndex: boolean
  isActive: Readonly<ComputedGetter<boolean>>
  toggle: () => void
}

export type GroupContext = RegistrarContext & {
  selectedItems: ComputedRef<Set<GroupTicket | undefined>>
  selectedIds: Reactive<Set<ID>>
  selectedValues: ComputedRef<Set<unknown>>
  register: (item?: Partial<GroupTicket>, id?: ID) => Reactive<GroupTicket>
  mandate: () => void
  select: (ids: ID | ID[]) => void
  reset: () => void
}

export type GroupOptions = {
  mandatory?: boolean | 'force'
  multiple?: boolean
  returnObject?: boolean
}

export function useGroup<
  T extends GroupTicket,
  U extends GroupContext,
> (
  namespace: string,
  options?: GroupOptions,
) {
  const [
    useRegistrarContext,
    provideRegistrarContext,
    registrar,
  ] = useRegistrar<T, U>(namespace)

  const selectedIds = reactive(new Set<ID>())
  let initialValue: unknown | unknown[] = null

  const selectedItems = computed(() => {
    return new Set(
      Array.from(selectedIds).map(id => registrar.registeredItems.get(id)),
    )
  })

  const selectedValues = computed(() => {
    return new Set(
      Array.from(selectedItems.value).map(item => item?.value),
    )
  })

  function mandate () {
    if (!options?.mandatory || selectedIds.size > 0 || registrar.registeredItems.size === 0) return

    if (options.mandatory === 'force') {
      const first = registrar.registeredItems.values().next().value
      if (first) selectedIds.add(first.id)
      return
    }

    for (const item of registrar.registeredItems.values()) {
      if (item.disabled) continue

      selectedIds.add(item.id)
      break
    }
  }

  function reindex () {
    registrar.reindex()
  }

  function reset () {
    selectedIds.clear()
    reindex()
    mandate()
  }

  function select (ids: ID | ID[]) {
    toggle(ids)
  }

  function toggle (ids: ID | ID[]) {
    for (const id of Array.isArray(ids) ? ids : [ids]) {
      if (!id) continue

      const item = registrar.registeredItems.get(id)

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

  function register (registrant: Partial<T>, id: ID = genId()): Reactive<T> {
    const groupItem: Partial<T> = {
      disabled: false,
      value: registrant?.value ?? registrar.registeredItems.size,
      valueIsIndex: registrant?.value == null,
      ...registrant,
    }

    const ticket = registrar.register(groupItem, id)

    Object.assign(ticket, {
      isActive: toRef(() => selectedIds.has(ticket.id)),
      toggle: () => toggle(ticket.id),
    })

    if (initialValue != null) {
      const shouldSelect = Array.isArray(initialValue)
        ? initialValue.includes(ticket.value)
        : initialValue === ticket.value

      if (shouldSelect) selectedIds.add(ticket.id)
    }

    if (options?.mandatory === 'force') mandate()

    return ticket
  }

  function unregister (id: ID) {
    selectedIds.delete(id)
    registrar.unregister(id)
  }

  if (getCurrentInstance()) {
    onMounted(() => {
      initialValue = undefined
    })
  }

  const context = {
    ...registrar,
    selectedItems,
    selectedIds,
    selectedValues,
    register,
    unregister,
    reset,
    reindex,
    mandate,
    select,
  } as U

  return [
    useRegistrarContext,
    function (
      model?: Ref<unknown | unknown[]>,
      _context: U = context,
      app?: App,
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
            for (const [id, item] of registrar.registeredItems) {
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

      provideRegistrarContext(_context, app)

      return _context
    },
    context,
  ] as const
}
