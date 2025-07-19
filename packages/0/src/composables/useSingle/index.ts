// Composables
import { useGroup } from '#v0/composables/useGroup'

// Utilities
import { computed } from 'vue'

// Types
import type { GroupContext, GroupOptions, GroupTicket } from '#v0/composables/useGroup'
import type { ID } from '#v0/types'
import type { App, ComputedRef, Ref } from 'vue'

export type SingleTicket = GroupTicket

export type SingleOptions = Omit<GroupOptions, 'multiple'>

export type SingleContext = GroupContext & {
  selectedId: ComputedRef<ID | undefined>
  selectedItem: ComputedRef<SingleTicket | undefined>
  selectedValue: ComputedRef<unknown>
  select: (id: ID) => void
}

/**
 *  Creates a single registrar for managing single selections within a specific namespace.
 * This function provides a way to register, unregister, and manage single selections,
 * allowing for dynamic single selection management in applications.
 *
 * @param namespace The namespace for the single context.
 * @param options  Optional configuration for the single behavior.
 * @template Z The type of the single tickets managed by the registrar.
 * @template E The type of the single context.
 * @returns  A tuple containing the inject function, provide function, and the single context.
 */
export function useSingle<
  Z extends SingleTicket,
  E extends SingleContext,
> (
  namespace: string,
  options?: SingleOptions,
) {
  const [
    useGroupContext,
    provideGroupContext,
    group,
  ] = useGroup<Z, E>(namespace, options)

  const selectedId = computed(() => group.selectedIds.values().next().value)
  const selectedItem = computed(() => selectedId.value ? group.tickets.get(selectedId.value) : undefined)
  const selectedValue = computed(() => selectedItem.value ? selectedItem.value.value : undefined)

  function select (id: ID) {
    group.select(id)
  }

  const context = {
    ...group,
    selectedId,
    selectedItem,
    selectedValue,
    select,
  } as E

  return [
    useGroupContext,
    function (
      model?: Ref<unknown | unknown[]>,
      _context: E = context,
      app?: App,
    ) {
      provideGroupContext(model, _context, app)

      return _context
    },
    context,
  ] as const
}
