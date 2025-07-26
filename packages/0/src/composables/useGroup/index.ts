// Factories
import { createTrinity } from '#v0/factories/createTrinity'

// Composables
import { useRegistry } from '#v0/composables/useRegistry'

// Transformers
import { toArray } from '#v0/transformers'

// Utilities
import { computed, getCurrentInstance, nextTick, onMounted, reactive, toRef, toValue, watch } from 'vue'
import { genId } from '#v0/utilities/helpers'

// Types
import type { App, ComputedGetter, ComputedRef, Reactive, Ref } from 'vue'
import type { RegistryContext, RegistryTicket } from '#v0/composables/useRegistry'
import type { ID } from '#v0/types'

export type GroupTicket = RegistryTicket & {
  disabled: boolean
  value: unknown
  valueIsIndex: boolean
  isActive: Readonly<ComputedGetter<boolean>>
  /** Toggle self on and off */
  toggle: () => void
}

export type BaseGroupContext = {
  selectedItems: ComputedRef<Set<GroupTicket | undefined>>
  selectedIndexes: ComputedRef<Set<number>>
  selectedIds: Reactive<Set<ID>>
  selectedValues: ComputedRef<Set<unknown>>
  /** Register a new item */
  register: (item?: Partial<GroupTicket>, id?: ID) => Reactive<GroupTicket>
  /** Select the first available value */
  mandate: () => void
  /** Select item(s) by ID(s) */
  select: (ids: ID | ID[]) => void
  /** Clear all selected IDs, reindex, and mandate a value */
  reset: () => void
  /** Browse for an ID by value */
  browse: (value: unknown) => ID | undefined
}

export type GroupContext = RegistryContext<GroupTicket> & BaseGroupContext

export type GroupOptions = {
  mandatory?: boolean | 'force'
  multiple?: boolean
  returnObject?: boolean
}

/**
 * Creates a group registry for managing group items within a specific namespace.
 * This function provides a way to register, unregister, and manage group selections,
 * allowing for dynamic group management in applications.
 *
 * @param namespace The namespace for the group context.
 * @param options  Optional configuration for the group behavior.
 * @template Z The type of the group items managed by the registry.
 * @template E The type of the group context.
 * @returns A tuple containing the inject function, provide function, and the group context.
 *
 * @see https://0.vuetifyjs.com/composables/selection/use-group
 */
export function useGroup<
  Z extends GroupTicket = GroupTicket,
  E extends GroupContext = GroupContext,
> (
  namespace: string,
  options?: GroupOptions,
) {
  const [useRegistryContext, provideRegistryContext, registry] = useRegistry<Z, E>(namespace)

  const catalog = new Map<unknown, ID>()
  const selectedIds = reactive(new Set<ID>())
  let initialValue: unknown | unknown[] = null

  const mandatory = options?.mandatory ?? false
  const multiple = options?.multiple ?? false

  const selectedItems = computed(() => {
    return new Set(
      Array.from(selectedIds).map(id => registry.collection.get(id)),
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

  function browse (value: unknown): ID | undefined {
    return catalog.get(value)
  }

  function mandate () {
    if (!mandatory || selectedIds.size > 0 || registry.collection.size === 0) return

    if (mandatory === 'force') {
      const first = registry.collection.values().next().value

      if (first) selectedIds.add(first.id)

      return
    }

    for (const item of registry.collection.values()) {
      if (item.disabled) continue
      selectedIds.add(item.id)

      break
    }
  }

  function reindex () {
    registry.reindex()
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
    for (const id of toArray<ID>(ids)) {
      const item = registry.collection.get(id)

      if (!item || item.disabled) continue

      const hasId = selectedIds.has(id)

      if (hasId) {
        if (mandatory) {
          // For single selection, can't deselect if it's the only one
          if (!multiple) continue
          // For multiple selection, can't deselect if it's the last one
          if (selectedIds.size === 1) continue
        }
        selectedIds.delete(id)
      } else {
        if (!multiple && selectedIds.size > 0) selectedIds.clear()
        selectedIds.add(id)
      }
    }
  }

  function register (registrant: Partial<Z>, id: ID = genId()): Reactive<Z> {
    const item: Partial<Z> = {
      disabled: false,
      value: registrant?.value ?? registry.collection.size,
      valueIsIndex: registrant?.value == null,
      isActive: toRef(() => selectedIds.has(ticket.id)),
      toggle: () => toggle(ticket.id),
      ...registrant,
    }

    const ticket = registry.register(item, id)

    catalog.set(ticket.value, ticket.id)

    if (initialValue != null) {
      const shouldSelect = Array.isArray(initialValue)
        ? initialValue.includes(ticket.value)
        : initialValue === ticket.value

      if (shouldSelect) selectedIds.add(ticket.id)
    }

    if (mandatory === 'force') mandate()

    return ticket as Reactive<Z>
  }

  function unregister (id: ID) {
    selectedIds.delete(id)
    registry.unregister(id)
  }

  if (getCurrentInstance()) {
    onMounted(() => {
      initialValue = undefined
    })
  }

  const context = {
    ...registry,
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
    browse,
  } as unknown as E

  function provideGroupContext (
    model?: Ref<unknown | unknown[]>,
    _context: E = context,
    app?: App,
  ): E {
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

        for (const value of values) {
          const id = browse(value)

          if (!id) continue

          selectedIds.add(id)
        }
      })

      watch([model, selectedIds], async () => {
        isUpdatingModel = true

        await nextTick()

        isUpdatingModel = false
      })
    }

    return provideRegistryContext(model, _context, app)
  }

  return createTrinity<E>(useRegistryContext, provideGroupContext, context)
}
