/**
 * @module useNested/strategies
 *
 * @remarks
 * Selection strategies for hierarchical/nested data structures.
 * Ported from Vuetify 3's nested composable with adaptations for Vuetify 0.
 *
 * Strategies control how selection propagates through parent-child relationships:
 * - independent: No propagation, any node selectable
 * - independentSingle: No propagation, single selection
 * - leaf: Only leaf nodes selectable, multi-select
 * - leafSingle: Only leaf nodes selectable, single selection
 * - classic: Tri-state with bidirectional propagation
 * - trunk: Classic but outputs highest selected ancestors
 */

// Types
import type { ID } from '#v0/types'

/** Selection state for a node */
export type SelectionState = 'on' | 'off' | 'indeterminate'

/** Data passed to selection strategy functions */
export interface SelectStrategyData {
  /** ID of the node being selected/unselected */
  id: ID
  /** Whether to select (true) or unselect (false) */
  value: boolean
  /** Current selection state map */
  selected: Map<ID, SelectionState>
  /** Parent-to-children relationship map */
  children: Map<ID, ID[]>
  /** Child-to-parent relationship map */
  parents: Map<ID, ID>
  /** Set of disabled node IDs */
  disabled: Set<ID>
}

/** Function that performs selection logic */
export type SelectStrategyFunction = (data: SelectStrategyData) => Map<ID, SelectionState>

/** Function that transforms input array to selection map */
export type SelectStrategyTransformInFunction = (
  v: readonly ID[] | undefined,
  children: Map<ID, ID[]>,
  parents: Map<ID, ID>,
  disabled: Set<ID>,
) => Map<ID, SelectionState>

/** Function that transforms selection map to output array */
export type SelectStrategyTransformOutFunction = (
  v: Map<ID, SelectionState>,
  children: Map<ID, ID[]>,
  parents: Map<ID, ID>,
) => ID[]

/** Complete selection strategy interface */
export interface SelectStrategy {
  /** Handle individual selection action */
  select: SelectStrategyFunction
  /** Transform input array to selection map */
  in: SelectStrategyTransformInFunction
  /** Transform selection map to output array */
  out: SelectStrategyTransformOutFunction
}

/** Available built-in strategy names */
export type SelectStrategyProp =
  | 'independent'
  | 'single-independent'
  | 'leaf'
  | 'single-leaf'
  | 'classic'
  | 'trunk'

/**
 * Independent selection strategy - no parent-child propagation.
 *
 * Each node can be selected/unselected independently without affecting
 * parent or child nodes. Supports multi-selection.
 *
 * @param mandatory When true, prevents deselecting the last selected item
 */
export function independentSelectStrategy (mandatory?: boolean): SelectStrategy {
  const strategy: SelectStrategy = {
    select: ({ id, value, selected }) => {
      // Respect mandatory constraint
      if (mandatory && !value) {
        const on = Array.from(selected.entries())
          .filter(([, v]) => v === 'on')
          .map(([k]) => k)
        if (on.length === 1 && on[0] === id) return selected
      }

      selected.set(id, value ? 'on' : 'off')
      return selected
    },

    in: (v, children, parents, disabled) => {
      const map = new Map<ID, SelectionState>()

      for (const id of v || []) {
        strategy.select({
          id,
          value: true,
          selected: map,
          children,
          parents,
          disabled,
        })
      }

      return map
    },

    out: v => {
      const arr: ID[] = []

      for (const [key, value] of v.entries()) {
        if (value === 'on') arr.push(key)
      }

      return arr
    },
  }

  return strategy
}

/**
 * Independent single selection strategy - no propagation, single selection.
 *
 * Like independent but only allows one item to be selected at a time.
 *
 * @param mandatory When true, prevents deselecting the last selected item
 */
export function independentSingleSelectStrategy (mandatory?: boolean): SelectStrategy {
  const parentStrategy = independentSelectStrategy(mandatory)

  const strategy: SelectStrategy = {
    select: ({ selected, id, ...rest }) => {
      // Keep only this item's previous state (if any) for single selection
      const singleSelected = selected.has(id)
        ? new Map<ID, SelectionState>([[id, selected.get(id)!]])
        : new Map<ID, SelectionState>()
      return parentStrategy.select({ ...rest, id, selected: singleSelected })
    },

    in: (v, children, parents, disabled) => {
      // Only take the first item for single selection
      if (v?.length) {
        return parentStrategy.in(v.slice(0, 1), children, parents, disabled)
      }
      return new Map<ID, SelectionState>()
    },

    out: (v, children, parents) => {
      return parentStrategy.out(v, children, parents)
    },
  }

  return strategy
}

/**
 * Leaf selection strategy - only leaf nodes can be selected.
 *
 * Nodes with children (branches/folders) cannot be selected.
 * Supports multi-selection of leaf nodes.
 *
 * @param mandatory When true, prevents deselecting the last selected item
 */
export function leafSelectStrategy (mandatory?: boolean): SelectStrategy {
  const parentStrategy = independentSelectStrategy(mandatory)

  const strategy: SelectStrategy = {
    select: ({ id, selected, children, ...rest }) => {
      // Skip if this node has children (is a branch)
      if (children.has(id)) return selected

      return parentStrategy.select({ id, selected, children, ...rest })
    },

    in: parentStrategy.in,
    out: parentStrategy.out,
  }

  return strategy
}

/**
 * Leaf single selection strategy - only leaf nodes, single selection.
 *
 * Combines leaf-only restriction with single selection constraint.
 *
 * @param mandatory When true, prevents deselecting the last selected item
 */
export function leafSingleSelectStrategy (mandatory?: boolean): SelectStrategy {
  const parentStrategy = independentSingleSelectStrategy(mandatory)

  const strategy: SelectStrategy = {
    select: ({ id, selected, children, ...rest }) => {
      // Skip if this node has children (is a branch)
      if (children.has(id)) return selected

      return parentStrategy.select({ id, selected, children, ...rest })
    },

    in: parentStrategy.in,
    out: parentStrategy.out,
  }

  return strategy
}

/**
 * Classic selection strategy - tri-state with bidirectional propagation.
 *
 * The most feature-rich strategy implementing checkbox tree behavior:
 * - Selecting a parent selects all descendants (downward propagation)
 * - Parent state is calculated from children (upward propagation):
 *   - 'on' if all children are selected
 *   - 'off' if no children are selected
 *   - 'indeterminate' if some children are selected
 *
 * Output only includes leaf nodes that are 'on'.
 *
 * @param mandatory When true, prevents deselecting all items
 */
export function classicSelectStrategy (mandatory?: boolean): SelectStrategy {
  const strategy: SelectStrategy = {
    select: ({ id, value, selected, children, parents, disabled }) => {
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

        selected.set(
          parent,
          everySelected ? 'on' : (noneSelected ? 'off' : 'indeterminate'),
        )

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

    in: (v, children, parents, disabled) => {
      let map = new Map<ID, SelectionState>()

      for (const id of v || []) {
        map = strategy.select({
          id,
          value: true,
          selected: map,
          children,
          parents,
          disabled,
        })
      }

      return map
    },

    out: (v, children) => {
      // Only output leaf nodes that are 'on'
      const arr: ID[] = []

      for (const [key, value] of v.entries()) {
        if (value === 'on' && !children.has(key)) arr.push(key)
      }

      return arr
    },
  }

  return strategy
}

/**
 * Trunk selection strategy - classic propagation with trunk output.
 *
 * Uses the same selection logic as classic strategy, but the output
 * only includes the "highest" selected ancestors, filtering out
 * items whose parent is also fully selected.
 *
 * Useful when you want to know which "folders" are selected rather
 * than listing all individual "files".
 *
 * @param mandatory When true, prevents deselecting all items
 */
export function trunkSelectStrategy (mandatory?: boolean): SelectStrategy {
  const parentStrategy = classicSelectStrategy(mandatory)

  const strategy: SelectStrategy = {
    select: parentStrategy.select,
    in: parentStrategy.in,

    out: (v, _children, parents) => {
      const arr: ID[] = []

      for (const [key, value] of v.entries()) {
        if (value === 'on') {
          // Skip if parent is also fully selected
          if (parents.has(key)) {
            const parent = parents.get(key)!
            if (v.get(parent) === 'on') continue
          }
          arr.push(key)
        }
      }

      return arr
    },
  }

  return strategy
}

/**
 * Get a selection strategy by name or return a custom strategy.
 *
 * @param strategy Strategy name or custom strategy object
 * @param mandatory Whether selection is mandatory
 */
export function getSelectStrategy (
  strategy: SelectStrategyProp | SelectStrategy | ((mandatory: boolean) => SelectStrategy),
  mandatory: boolean,
): SelectStrategy {
  if (typeof strategy === 'function') {
    return strategy(mandatory)
  }

  if (typeof strategy === 'object') {
    return strategy
  }

  switch (strategy) {
    case 'independent': {
      return independentSelectStrategy(mandatory)
    }
    case 'single-independent': {
      return independentSingleSelectStrategy(mandatory)
    }
    case 'leaf': {
      return leafSelectStrategy(mandatory)
    }
    case 'single-leaf': {
      return leafSingleSelectStrategy(mandatory)
    }
    case 'classic': {
      return classicSelectStrategy(mandatory)
    }
    case 'trunk': {
      return trunkSelectStrategy(mandatory)
    }
    default: {
      return classicSelectStrategy(mandatory)
    }
  }
}
