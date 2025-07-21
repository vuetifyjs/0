// Factories
import { createTrinity } from '#v0/factories/createTrinity'

// Composables
import { useRegistrar } from '#v0/composables/useRegistrar'

// Utilities
import { computed, getCurrentInstance, nextTick, onMounted, reactive, toRef, toValue, watch } from 'vue'
import { genId } from '#v0/utilities/helpers'

// Types
import type { App, ComputedGetter, ComputedRef, Reactive, Ref } from 'vue'
import type { RegistrarContext, RegistrarTicket } from '#v0/composables/useRegistrar'
import type { ID } from '#v0/types'

export type GroupTicket = RegistrarTicket & {
  disabled: boolean
  value: unknown
  valueIsIndex: boolean
  isActive: Readonly<ComputedGetter<boolean>>
  toggle: () => void
}

export type GroupContext = RegistrarContext & {
  selectedItems: ComputedRef<Set<GroupTicket | undefined>>
  selectedIndexes: ComputedRef<Set<number>>
  selectedIds: Reactive<Set<ID>>
  selectedValues: ComputedRef<Set<unknown>>
  register: (item?: Partial<GroupTicket>, id?: ID) => Reactive<GroupTicket>
  mandate: () => void
  select: (ids: ID | ID[]) => void
  reset: () => void
  lookup: (index: number) => ID | undefined
}

export type GroupOptions = {
  mandatory?: boolean | 'force'
  multiple?: boolean
  returnObject?: boolean
}

/**
 *  Creates a group registrar for managing group tickets within a specific namespace.
 * This function provides a way to register, unregister, and manage group selections,
 * allowing for dynamic group management in applications.
 *
 * @param namespace The namespace for the group context.
 * @param options  Optional configuration for the group behavior.
 * @template Z The type of the group tickets managed by the registrar.
 * @template E The type of the group context.
 * @returns  A tuple containing the inject function, provide function, and the group context.
 */
export function useGroup<
  Z extends GroupTicket,
  E extends GroupContext,
> (
  namespace: string,
  options?: GroupOptions,
) {
  const [useRegistrarContext, provideRegistrarContext, registrar] = useRegistrar<Z, E>(namespace)

  const selectedIds = reactive(new Set<ID>())
  let initialValue: unknown | unknown[] = null

  const selectedItems = computed(() => {
    return new Set(
      Array.from(selectedIds).map(id => registrar.tickets.get(id)),
    )
  })

  const selectedIndexes = computed(() => {
    return new Set(
      Array.from(selectedItems.value).map(item => item?.index),
    )
  })

  const selectedValues = computed(() => {
    return new Set(
      Array.from(selectedItems.value).map(item => item?.value),
    )
  })

  function mandate () {
    if (!options?.mandatory || selectedIds.size > 0 || registrar.tickets.size === 0) return

    if (options.mandatory === 'force') {
      const first = registrar.tickets.values().next().value
      if (first) selectedIds.add(first.id)
      return
    }

    for (const item of registrar.tickets.values()) {
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

      const item = registrar.tickets.get(id)

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

  function register (registrant: Partial<Z>, id: ID = genId()): Reactive<Z> {
    const item: Partial<Z> = {
      disabled: false,
      value: registrant?.value ?? registrar.tickets.size,
      valueIsIndex: registrant?.value == null,
      ...registrant,
    }

    const ticket = registrar.register(item, id)

    // Reactivity was being lost unless done this way, revisit
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
    selectedIndexes,
    selectedIds,
    selectedValues,
    register,
    unregister,
    reset,
    reindex,
    mandate,
    select,
  } as E

  function provideGroupContext (model?: Ref<unknown | unknown[]>, _context: E = context, app?: App): E {
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
          for (const [id, item] of registrar.tickets) {
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

    provideRegistrarContext(model, _context, app)

    return _context
  }

  return createTrinity<E>(useRegistrarContext, provideGroupContext, context)
}
