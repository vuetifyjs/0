/**
 * @module useNested/adapters/ClassicAdapter
 *
 * @remarks
 * Classic selection adapter - downward propagation with computed parent state.
 *
 * Key behaviors:
 * - Selecting a parent selects all descendants (downward propagation)
 * - Parent state is computed dynamically (not stored):
 *   - 'on' if all children are selected
 *   - 'off' if no children are selected
 *   - 'indeterminate' if some children are selected
 *
 * Output only includes leaf nodes that are selected.
 * Uses Set<ID> for consistency with useSelection/useGroup.
 */

// Types
import type { ID } from '#v0/types'
import type { SelectAdapter, SelectContext, SelectData } from './SelectAdapter'

/**
 * Creates a classic selection adapter.
 *
 * @param mandatory When true, prevents deselecting all items
 */
export function createClassicAdapter (mandatory = false): SelectAdapter {
  const adapter: SelectAdapter = {
    name: 'classic',

    select: ({ id, value, selected, children, disabled }: SelectData): Set<ID> => {
      const newSelected = new Set(selected)

      // DOWNWARD PROPAGATION: select/unselect all descendants
      const items: ID[] = [id]
      while (items.length > 0) {
        const item = items.shift()!

        if (!disabled.has(item)) {
          if (value) {
            newSelected.add(item)
          } else {
            newSelected.delete(item)
          }
        }

        if (children.has(item)) {
          items.push(...children.get(item)!)
        }
      }

      // Respect mandatory constraint
      if (mandatory && !value && newSelected.size === 0) {
        return selected
      }

      return newSelected
    },

    transformIn: (
      values: readonly ID[] | undefined,
      context: SelectContext,
    ): Set<ID> => {
      let selected = new Set<ID>()

      for (const id of values || []) {
        selected = adapter.select({
          id,
          value: true,
          selected,
          ...context,
        })
      }

      return selected
    },

    transformOut: (
      selected: Set<ID>,
      context: SelectContext,
    ): ID[] => {
      // Only output leaf nodes that are selected
      const arr: ID[] = []

      for (const id of selected) {
        if (!context.children.has(id)) {
          arr.push(id)
        }
      }

      return arr
    },
  }

  return adapter
}
