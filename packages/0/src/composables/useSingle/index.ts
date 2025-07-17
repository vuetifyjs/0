// Composables
import { useGroup } from '#v0/composables/useGroup'

// Utilities
import { computed } from 'vue'

// Types
import type { GroupContext, GroupOptions, GroupTicket } from '#v0/composables/useGroup'
import type { ID } from '#v0/types'
import type { App, ComputedRef, Ref } from 'vue'

export interface SingleTicket extends GroupTicket {}

export interface SingleOptions extends Omit<GroupOptions, 'multiple'> {}

export type SingleContext = GroupContext & {
  selectedId: ComputedRef<ID | undefined>
  selectedItem: ComputedRef<SingleTicket | undefined>
  selectedValue: ComputedRef<unknown>
  select: (id: ID) => void
}

export function useSingle<T extends SingleContext> (
  namespace: string,
  options?: SingleOptions,
) {
  const [
    useGroupContext,
    provideGroupContext,
    group,
  ] = useGroup<T>(namespace, options)

  const selectedId = computed(() => group.selectedIds.values().next().value)
  const selectedItem = computed(() => selectedId.value ? group.registeredItems.get(selectedId.value) : undefined)
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
  } as T

  return [
    useGroupContext,
    function (
      model?: Ref<unknown | unknown[]>,
      _context: T = context,
      app?: App,
    ) {
      provideGroupContext(model, _context, app)

      return _context
    },
    context,
  ] as const
}
