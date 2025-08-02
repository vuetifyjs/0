// Composables
import { useSelection } from '#v0/composables/useSelection'

// Transformers
import { toArray } from '#v0/transformers'

// Types
import type { ID } from '#v0/types'
import type { SelectionContext, SelectionOptions, SelectionTicket } from '#v0/composables/useSelection'

export interface GroupTicket extends SelectionTicket {}

export interface GroupContext<Z extends GroupTicket> extends SelectionContext<Z> {
  select: (ids: ID | ID[]) => void
}

export interface GroupOptions extends SelectionOptions {}

export function useGroup<
  Z extends GroupTicket = GroupTicket,
  E extends GroupContext<Z> = GroupContext<Z>,
> (options?: GroupOptions): E {
  const registry = useSelection<Z, E>(options)
  const mandatory = options?.mandatory ?? false

  function select (ids: ID | ID[]) {
    for (const id of toArray(ids)) {
      const item = registry.find(id)
      if (!item || item.disabled) continue

      const hasId = registry.selectedIds.has(id)

      if (hasId) {
        if (mandatory && registry.selectedIds.size === 1) {
          continue
        }

        registry.selectedIds.delete(id)
      } else {
        registry.selectedIds.clear()
        registry.selectedIds.add(id)
      }
    }
  }

  const context: E = {
    ...registry,
    select,
  }

  return context
}
