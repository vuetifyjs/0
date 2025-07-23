// Factories
import { createTrinity } from '#v0/factories/createTrinity'

// Composables
import { useGroup } from '#v0/composables/useGroup'

// Utilities
import { computed } from 'vue'

// Types
import type { GroupContext, GroupOptions, GroupTicket } from '#v0/composables/useGroup'
import type { ID } from '#v0/types'
import type { ComputedRef } from 'vue'

export type SingleTicket = GroupTicket

export type SingleOptions = Omit<GroupOptions, 'multiple'>

export type SingleContext = GroupContext & {
  selectedId: ComputedRef<ID | undefined>
  selectedIndex: ComputedRef<number>
  selectedItem: ComputedRef<SingleTicket | undefined>
  selectedValue: ComputedRef<unknown>
  select: (id: ID) => void
}

/**
 * Creates a single registry for managing single selections within a specific namespace.
 * This function provides a way to register, unregister, and manage single selections,
 * allowing for dynamic single selection management in applications.
 *
 * Built on top of useGroup with multiple=false to eliminate code duplication.
 *
 * @param namespace The namespace for the single context.
 * @param options Optional configuration for the single behavior.
 * @template Z The type of the single items managed by the registry.
 * @template E The type of the single context.
 * @returns A tuple containing the inject function, provide function, and the single context.
 */
export function useSingle<
  Z extends SingleContext,
  E extends SingleTicket,
> (
  namespace: string,
  _options?: SingleOptions,
) {
  // Force multiple to false for single selection behavior
  const options = { ..._options, multiple: false }

  const [useGroupContext, provideGroupContext, registry] = useGroup<Z, E>(namespace, options)

  const selectedId = computed(() => registry.selectedIds.values().next().value)
  const selectedItem = computed(() => selectedId.value ? registry.collection.get(selectedId.value) : undefined)
  const selectedIndex = computed(() => selectedItem.value ? selectedItem.value.index : -1)
  const selectedValue = computed(() => selectedItem.value ? selectedItem.value.value : undefined)

  function select (id: ID) {
    registry.select(id)
  }

  return createTrinity<Z>(useGroupContext, provideGroupContext, {
    ...registry,
    selectedId,
    selectedItem,
    selectedIndex,
    selectedValue,
    select,
  } as Z)
}
