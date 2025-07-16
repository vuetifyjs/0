// Composables
import { useGroup } from '#v0/composables/useGroup'

// Utilities
import { computed, type App, type ComputedRef, type Ref } from 'vue'

// Types
import type { GroupContext, GroupItem, GroupOptions, GroupTicket } from '#v0/composables/useGroup'
import type { ID } from '#v0/types'

export interface SingleItem extends GroupItem {}

export interface SingleTicket extends GroupTicket {}

export interface SingleOptions extends Omit<GroupOptions, 'multiple'> {}

export interface SingleContext extends GroupContext {
  selectedId: ComputedRef<ID | undefined>
  selectedItem: ComputedRef<SingleTicket | undefined>
  selectedValue: ComputedRef<unknown>
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

  // TODO: can't figure out how to type this properly
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
