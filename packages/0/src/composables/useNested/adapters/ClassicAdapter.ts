/**
 * @module useNested/adapters/ClassicAdapter
 *
 * @remarks
 * Classic selection adapter - tri-state with bidirectional propagation.
 *
 * The most feature-rich adapter implementing checkbox tree behavior:
 * - Selecting a parent selects all descendants (downward propagation)
 * - Parent state is calculated from children (upward propagation):
 *   - 'on' if all children are selected
 *   - 'off' if no children are selected
 *   - 'indeterminate' if some children are selected
 *
 * Output only includes leaf nodes that are 'on'.
 */

// Types
import type { ID } from '#v0/types'
import type { SelectAdapter, SelectContext, SelectData, SelectionState } from './SelectAdapter'

/**
 * Creates a classic selection adapter.
 *
 * @param mandatory When true, prevents deselecting all items
 */
export function createClassicAdapter (mandatory = false): SelectAdapter {
  const adapter: SelectAdapter = {
    name: 'classic',

    select: ({ id, value, selected, children, parents, disabled }: SelectData): Map<ID, SelectionState> => {
      const original = new Map(selected)

      // DOWNWARD PROPAGATION: select/unselect all descendants
      const items: ID[] = [id]
      while (items.length > 0) {
        const item = items.shift()!

        if (!disabled.has(item)) {
          selected.set(item, value ? 'on' : 'off')
        }

        if (children.has(item)) {
          items.push(...children.get(item)!)
        }
      }

      // UPWARD PROPAGATION: recalculate ancestor states
      let parent = parents.get(id)
      while (parent != null) {
        let everySelected = true
        let noneSelected = true

        for (const child of children.get(parent)!) {
          if (disabled.has(child)) continue

          if (selected.get(child) !== 'on') everySelected = false
          if (selected.has(child) && selected.get(child) !== 'off') noneSelected = false

          if (!everySelected && !noneSelected) break
        }

        if (everySelected) {
          selected.set(parent, 'on')
        } else if (noneSelected) {
          selected.set(parent, 'off')
        } else {
          selected.set(parent, 'indeterminate')
        }

        parent = parents.get(parent)
      }

      // Respect mandatory constraint
      if (mandatory && !value) {
        const on = Array.from(selected.entries())
          .filter(([, v]) => v === 'on')
          .map(([k]) => k)
        if (on.length === 0) return original
      }

      return selected
    },

    transformIn: (
      values: readonly ID[] | undefined,
      context: SelectContext,
    ): Map<ID, SelectionState> => {
      let map = new Map<ID, SelectionState>()

      for (const id of values || []) {
        map = adapter.select({
          id,
          value: true,
          selected: map,
          ...context,
        })
      }

      return map
    },

    transformOut: (
      state: Map<ID, SelectionState>,
      context: SelectContext,
    ): ID[] => {
      // Only output leaf nodes that are 'on'
      const arr: ID[] = []

      for (const [key, value] of state.entries()) {
        if (value === 'on' && !context.children.has(key)) arr.push(key)
      }

      return arr
    },
  }

  return adapter
}
