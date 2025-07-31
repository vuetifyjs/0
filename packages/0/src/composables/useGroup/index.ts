// Factories
import { createTrinity } from '#v0/factories/createTrinity'

// Composables
import { useSelection } from '#v0/composables/useSelection'

// Utilities
import { computed, getCurrentInstance, nextTick, onMounted, toValue, watch } from 'vue'
import { genId } from '#v0/utilities/helpers'

// Transformers
import { toArray } from '#v0/transformers'

// Types
import type { App, ComputedRef, Reactive, Ref } from 'vue'
import type { ID } from '#v0/types'
import type { SelectionContext, SelectionOptions, SelectionTicket } from '#v0/composables/useSelection'
import type { ContextTrinity } from '#v0/factories/createTrinity'

export interface GroupTicket extends SelectionTicket {}

export interface GroupContext<Z extends GroupTicket> extends SelectionContext<Z> {
  selectedItems: ComputedRef<Set<Z | undefined>>
  selectedIndexes: ComputedRef<Set<number>>
  selectedValues: ComputedRef<Set<unknown>>
}

export interface GroupOptions extends SelectionOptions {
  multiple?: boolean
}

/**
 * Creates a group registry for managing multi-selection within a specific namespace.
 * This function provides a way to register, unregister, and manage group selections
 * with support for mandatory selection and multiple selection modes.
 *
 * @param namespace The namespace for the group context.
 * @param options Optional configuration for the group behavior.
 * @template Z The type of the group items managed by the registry.
 * @template E The type of the group context.
 * @returns A tuple containing the inject function, provide function, and the group context.
 *
 * @see https://0.vuetifyjs.com/composables/selection/use-group
 */
export function useGroup<
  Z extends GroupTicket = GroupTicket,
  E extends GroupContext<Z> = GroupContext<Z>,
> (
  namespace: string,
  options?: GroupOptions,
): ContextTrinity<E> {
  const [useRegistryContext, provideRegistryContext, registry] = useSelection<Z, E>(namespace)

  const mandatory = options?.mandatory ?? false
  const multiple = options?.multiple ?? false
  const returnObject = options?.returnObject ?? false

  let initialValue: unknown | unknown[] = null

  const selectedIndexes = computed(() => {
    return new Set(
      Array.from(registry.selectedIds).map(id => registry.find(id)?.index),
    )
  })

  const selectedItems = computed(() => {
    return new Set(
      Array.from(registry.selectedIds).map(id => registry.find(id)),
    )
  })

  const selectedValues = computed(() => {
    return new Set(
      Array.from(selectedItems.value).map(item => item?.value),
    )
  })

  function mandate () {
    if (!mandatory || registry.selectedIds.size > 0 || registry.collection.size === 0) return
    for (const item of registry.collection.values()) {
      if (item.disabled) continue
      select(item.id)
      break
    }
  }

  function reset () {
    registry.reset()
    mandate()
  }

  function select (ids: ID | ID[]) {
    for (const id of toArray<ID>(ids)) {
      const item = registry.find(id)

      if (!item || item.disabled) continue

      const hasId = registry.selectedIds.has(id)

      if (hasId) {
        if (mandatory) {
          // For single selection, can't deselect if it's the only one
          if (!multiple) continue
          // For multiple selection, can't deselect if it's the last one
          if (registry.selectedIds.size === 1) continue
        }
        registry.selectedIds.delete(id)
      } else {
        if (!multiple) {
          // Clear all selections first in single selection mode
          registry.selectedIds.clear()
        }
        registry.selectedIds.add(id)
      }
    }
  }

  function register (registrant: Partial<Z>, _id: ID = genId()): Reactive<Z> {
    const id = registrant?.id ?? _id

    const item: Partial<Z> = {
      ...registrant,
      id,
      toggle: () => select(id),
    }

    const ticket = registry.register(item, id) as Reactive<Z>

    if (initialValue != null) {
      const shouldSelect = Array.isArray(initialValue)
        ? initialValue.includes(ticket.value)
        : initialValue === ticket.value

      if (shouldSelect) select(ticket.id)
    }

    if (mandatory === 'force') mandate()

    return ticket
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
    selectedValues,
    register,
    mandate,
    select,
    reset,
  } as E

  function provideGroupContext (
    model?: Ref<unknown | unknown[]>,
    _context: E = context,
    app?: App,
  ): E {
    let isUpdatingModel = false

    if (model) {
      initialValue = toValue(model)

      watch(registry.selectedIds, () => {
        if (isUpdatingModel) return

        const target = returnObject ? selectedItems : selectedValues

        model.value = multiple
          ? Array.from(target.value)
          : target.value.values().next().value
      })

      watch(model, async value => {
        if (isUpdatingModel) return

        const values = new Set(Array.isArray(value) ? value : [value])

        if ((selectedValues.value.symmetricDifference(values)).size === 0) return

        registry.selectedIds.clear()

        for (const value of values) {
          const id = registry.browse(value)

          if (!id) continue

          registry.selectedIds.add(id)
        }
      })

      watch([model, registry.selectedIds], async () => {
        isUpdatingModel = true

        await nextTick()

        isUpdatingModel = false
      })
    }

    return provideRegistryContext(model, _context, app)
  }

  return createTrinity<E>(useRegistryContext, provideGroupContext, context)
}
