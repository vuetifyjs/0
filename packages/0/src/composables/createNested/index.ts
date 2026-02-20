/**
 * @module createNested
 *
 * @remarks
 * Hierarchical tree management composable extending createGroup with:
 * - Parent-child relationship tracking (children/parents Maps)
 * - Open/close state management
 * - Tree traversal utilities (getPath, getDescendants, etc.)
 * - Pluggable open strategies
 *
 * Inheritance chain: createSelection → createGroup → createNested
 */

// Factories
// Foundational
import { createContext, useContext } from '#v0/composables/createContext'
import { createTrinity } from '#v0/composables/createTrinity'

// Composables
import { createGroup } from '#v0/composables/createGroup'
import { useLogger } from '#v0/composables/useLogger'

// Utilities
import { isUndefined, useId } from '#v0/utilities'
import { computed, shallowReactive, toRef } from 'vue'

// Transformers
import { toArray } from '#v0/composables/toArray'

// Types
import type { GroupTicket, GroupTicketInput } from '#v0/composables/createGroup'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { ID } from '#v0/types'
import type {
  NestedContext,
  NestedContextOptions,
  NestedOpenMode,
  NestedOptions,
  NestedRegistration,
  NestedTicket,
  NestedTicketInput,
} from './types'
import type { App } from 'vue'

// Strategies
import { multipleOpenStrategy, singleOpenStrategy } from './strategies'

// Re-export types

// Re-export strategies

/**
 * Resolves open mode to an OpenStrategy.
 */
function resolveOpenStrategy (open: NestedOpenMode = 'multiple') {
  return open === 'single' ? singleOpenStrategy : multipleOpenStrategy
}

/**
 * Creates a new nested tree instance with hierarchical management.
 *
 * Extends `createGroup` to support parent-child relationships, tree traversal,
 * and open/close state management. Perfect for tree views, nested navigation,
 * and hierarchical data structures.
 *
 * @param options The options for the nested instance.
 * @template Z The type of the nested ticket.
 * @template E The type of the nested context.
 * @returns A new nested instance with tree management capabilities.
 *
 * @remarks
 * **Key Differences from `createGroup`:**
 * - `register()` accepts `parentId` for establishing parent-child relationships
 * - `unregister()` accepts optional `cascade` parameter for cascading deletions
 * - Adds tree traversal methods: `getPath()`, `getAncestors()`, `getDescendants()`
 * - Adds computed properties: `roots`, `leaves`, `isLeaf()`, `getDepth()`
 * - Adds open state management: `open()`, `close()`, `flip()`, `opened()`
 *
 * @see https://0.vuetifyjs.com/composables/selection/use-nested
 *
 * @example
 * ```ts
 * import { createNested } from '@vuetify/v0'
 *
 * const tree = createNested()
 *
 * const root = tree.register({ id: 'root', value: 'Root' })
 * const child1 = tree.register({ id: 'child-1', value: 'Child 1', parentId: 'root' })
 * const child2 = tree.register({ id: 'child-2', value: 'Child 2', parentId: 'root' })
 *
 * console.log(tree.getPath('child-1')) // ['root', 'child-1']
 * console.log(tree.getDescendants('root')) // ['child-1', 'child-2']
 * console.log(tree.isLeaf('child-2')) // true
 *
 * tree.open('root')
 * console.log(tree.opened('root')) // true
 * ```
 */
export function createNested<
  Z extends NestedTicketInput = NestedTicketInput,
  E extends NestedTicket<Z> = NestedTicket<Z>,
  R extends NestedContext<Z, E> = NestedContext<Z, E>,
> (_options: NestedOptions = {}): R {
  const {
    open: openMode = 'multiple',
    openAll = false,
    reveal: revealOnOpen = false,
    selection: selectionMode = 'cascade',
    active: activeMode = 'single',
    openStrategy,
    ...options
  } = _options

  // Resolve open strategy: explicit openStrategy takes precedence over open mode
  const resolvedOpenStrategy = openStrategy ?? resolveOpenStrategy(openMode)

  const group = createGroup<GroupTicketInput, GroupTicket>(options)
  const logger = useLogger()

  const children = shallowReactive(new Map<ID, ID[]>())
  const parents = shallowReactive(new Map<ID, ID | undefined>())
  const openedIds = shallowReactive(new Set<ID>())
  const activeIds = shallowReactive(new Set<ID>())

  // Computed collections
  const activeItems = computed(() => {
    return new Set(
      Array.from(activeIds)
        .map(id => group.get(id))
        .filter((item): item is E => !isUndefined(item)),
    )
  })

  const activeIndexes = computed(() => {
    return new Set(
      Array.from(activeItems.value)
        .map(item => item?.index)
        .filter((index): index is number => !isUndefined(index)),
    )
  })

  const openedItems = computed(() => {
    return new Set(
      Array.from(openedIds)
        .map(id => group.get(id))
        .filter((item): item is E => !isUndefined(item)),
    )
  })

  const roots = computed(() => {
    return group.values().filter(item => isUndefined(parents.get(item.id)))
  })

  const leaves = computed(() => {
    return group.values().filter(item => {
      const childList = children.get(item.id)
      return isUndefined(childList) || childList.length === 0
    })
  })

  // Open state methods
  function opened (id: ID): boolean {
    return openedIds.has(id)
  }

  function open (ids: ID | ID[]): void {
    for (const id of toArray(ids)) {
      if (!group.has(id)) continue

      // Auto-reveal ancestors when opening (if enabled)
      if (revealOnOpen) {
        let parentId = parents.get(id)
        while (!isUndefined(parentId)) {
          openedIds.add(parentId)
          parentId = parents.get(parentId)
        }
      }

      openedIds.add(id)
      resolvedOpenStrategy.onOpen?.(id, context)
    }
  }

  function close (ids: ID | ID[]): void {
    for (const id of toArray(ids)) {
      if (!group.has(id)) continue
      openedIds.delete(id)
      resolvedOpenStrategy.onClose?.(id, context)
    }
  }

  function flip (ids: ID | ID[]): void {
    for (const id of toArray(ids)) {
      if (!group.has(id)) continue
      if (opened(id)) {
        close(id)
      } else {
        open(id)
      }
    }
  }

  /**
   * Open node(s) and their immediate non-leaf children.
   * Useful for expanding a section with its immediate subcategories.
   */
  function unfold (ids: ID | ID[]): void {
    for (const id of toArray(ids)) {
      if (!group.has(id)) continue
      open(id)
      const childIds = children.get(id) ?? []
      for (const childId of childIds) {
        if (!isLeaf(childId)) {
          open(childId)
        }
      }
    }
  }

  /**
   * Reveal a node by opening all its ancestors.
   * Makes the node visible in a collapsed tree without opening the node itself.
   */
  function reveal (ids: ID | ID[]): void {
    for (const id of toArray(ids)) {
      if (!group.has(id)) continue
      const ancestorIds = getAncestors(id)
      if (ancestorIds.length > 0) {
        open(ancestorIds)
      }
    }
  }

  /**
   * Fully expand a node and all its non-leaf descendants.
   * Opens the entire subtree rooted at the given node.
   */
  function expand (ids: ID | ID[]): void {
    for (const id of toArray(ids)) {
      if (!group.has(id)) continue
      if (!isLeaf(id)) {
        open(id)
      }
      for (const descendantId of getDescendants(id)) {
        if (!isLeaf(descendantId)) {
          open(descendantId)
        }
      }
    }
  }

  function expandAll (): void {
    for (const id of group.keys()) {
      if (!isLeaf(id)) {
        openedIds.add(id)
      }
    }
  }

  function collapseAll (): void {
    openedIds.clear()
  }

  function activated (id: ID): boolean {
    return activeIds.has(id)
  }

  function activate (ids: ID | ID[]): void {
    for (const id of toArray(ids)) {
      if (!group.has(id)) continue

      // In single mode, clear other active items first
      if (activeMode === 'single') {
        for (const activeId of activeIds) {
          if (activeId !== id) {
            activeIds.delete(activeId)
          }
        }
      }

      activeIds.add(id)
    }
  }

  function deactivate (ids: ID | ID[]): void {
    for (const id of toArray(ids)) {
      activeIds.delete(id)
    }
  }

  function deactivateAll (): void {
    activeIds.clear()
  }

  // Tree traversal methods (computed on-demand)
  function getPath (id: ID): ID[] {
    const path: ID[] = []
    let currentId: ID | undefined = id

    while (!isUndefined(currentId)) {
      path.unshift(currentId)
      currentId = parents.get(currentId)
    }

    return path
  }

  function getAncestors (id: ID): ID[] {
    const path = getPath(id)
    return path.slice(0, -1)
  }

  function getDescendants (id: ID): ID[] {
    const descendants: ID[] = []
    const queue: ID[] = [...(children.get(id) ?? [])]
    let index = 0

    while (index < queue.length) {
      const currentId = queue[index++]!
      descendants.push(currentId)
      queue.push(...(children.get(currentId) ?? []))
    }

    return descendants
  }

  function isLeaf (id: ID): boolean {
    const childList = children.get(id)
    return isUndefined(childList) || childList.length === 0
  }

  function getDepth (id: ID): number {
    return getAncestors(id).length
  }

  /**
   * Check if `ancestorId` is an ancestor of `descendantId`.
   * Returns false if either ID doesn't exist in the tree.
   */
  function isAncestorOf (ancestorId: ID, descendantId: ID): boolean {
    if (!group.has(ancestorId) || !group.has(descendantId)) return false
    if (ancestorId === descendantId) return false

    let currentId: ID | undefined = parents.get(descendantId)
    while (!isUndefined(currentId)) {
      if (currentId === ancestorId) return true
      currentId = parents.get(currentId)
    }
    return false
  }

  /**
   * Check if `id` has `ancestorId` as an ancestor.
   * Semantic alias for isAncestorOf(ancestorId, id).
   */
  function hasAncestor (id: ID, ancestorId: ID): boolean {
    return isAncestorOf(ancestorId, id)
  }

  /**
   * Get siblings of a node (including self).
   * For root nodes, returns all root IDs.
   */
  function siblings (id: ID): ID[] {
    if (!group.has(id)) return []
    const parentId = parents.get(id)
    if (isUndefined(parentId)) {
      // Root node - siblings are other roots
      return group.values()
        .filter(item => isUndefined(parents.get(item.id)))
        .map(item => item.id)
    }
    return children.get(parentId) ?? []
  }

  /**
   * Get 1-indexed position among siblings (for aria-posinset).
   * Returns 0 if node not found.
   */
  function position (id: ID): number {
    const sibs = siblings(id)
    const index = sibs.indexOf(id)
    return index === -1 ? 0 : index + 1
  }

  // Cascading selection helpers (used when selectionMode === 'cascade')
  function updateAncestors (id: ID): void {
    // Process from immediate parent up to root
    const ancestorIds = getAncestors(id).toReversed()
    for (const aid of ancestorIds) {
      const childIds = children.get(aid) ?? []
      if (childIds.length === 0) continue

      const allSelected = childIds.every(cid => group.selected(cid))
      const someSelected = childIds.some(cid => group.selected(cid) || group.mixed(cid))

      if (allSelected) {
        group.unmix(aid)
        group.select(aid)
      } else if (someSelected) {
        group.unselect(aid)
        group.mix(aid)
      } else {
        group.unmix(aid)
        group.unselect(aid)
      }
    }
  }

  // Get all leaf descendants of a node (used when selectionMode === 'leaf')
  function getLeafDescendants (id: ID): ID[] {
    return getDescendants(id).filter(did => isLeaf(did))
  }

  function select (ids: ID | ID[]): void {
    for (const id of toArray(ids)) {
      if (!group.has(id)) continue

      if (selectionMode === 'independent') {
        // Independent: just select this node, no cascading
        group.select(id)
      } else if (selectionMode === 'leaf') {
        // Leaf: only select leaf nodes; if parent, select all leaf descendants
        if (isLeaf(id)) {
          group.select(id)
        } else {
          for (const lid of getLeafDescendants(id)) {
            group.select(lid)
          }
        }
      } else {
        // Cascade (default): select this item and all descendants
        group.unmix(id)
        group.select(id)
        for (const did of getDescendants(id)) {
          group.unmix(did)
          group.select(did)
        }
        updateAncestors(id)
      }
    }
  }

  function unselect (ids: ID | ID[]): void {
    for (const id of toArray(ids)) {
      if (!group.has(id)) continue

      if (selectionMode === 'independent') {
        // Independent: just unselect this node, no cascading
        group.unselect(id)
      } else if (selectionMode === 'leaf') {
        // Leaf: only unselect leaf nodes; if parent, unselect all leaf descendants
        if (isLeaf(id)) {
          group.unselect(id)
        } else {
          for (const lid of getLeafDescendants(id)) {
            group.unselect(lid)
          }
        }
      } else {
        // Cascade (default): unselect this item and all descendants
        group.unmix(id)
        group.unselect(id)
        for (const did of getDescendants(id)) {
          group.unmix(did)
          group.unselect(did)
        }
        updateAncestors(id)
      }
    }
  }

  function toggle (ids: ID | ID[]): void {
    for (const id of toArray(ids)) {
      if (selectionMode === 'independent') {
        // Independent: just toggle this node
        group.toggle(id)
      } else if (selectionMode === 'leaf') {
        // Leaf: toggle leaf nodes; if parent, toggle all leaf descendants
        if (isLeaf(id)) {
          group.toggle(id)
        } else {
          const leafIds = getLeafDescendants(id)
          const allSelected = leafIds.every(lid => group.selected(lid))
          if (allSelected) {
            for (const lid of leafIds) {
              group.unselect(lid)
            }
          } else {
            for (const lid of leafIds) {
              group.select(lid)
            }
          }
        }
      } else {
        // Cascade (default): toggle with mixed state handling
        if (group.selected(id) || group.mixed(id)) {
          unselect(id)
        } else {
          select(id)
        }
      }
    }
  }

  /**
   * Converts the tree to a flat array with parentId references.
   * Useful for serialization or sending to APIs/AI systems.
   */
  function toFlat (): Array<{ id: ID, parentId: ID | undefined, value: unknown }> {
    return group.values().map(item => ({
      id: item.id,
      parentId: parents.get(item.id),
      value: item.value,
    }))
  }

  // Registration
  function register (registration: NestedRegistration<Z> = {} as NestedRegistration<Z>): E {
    const id = registration.id ?? useId()
    const parentId = registration.parentId
    const nested = registration.children

    // Validate parent exists if provided
    if (!isUndefined(parentId) && !group.has(parentId)) {
      logger.warn(`Parent with id "${parentId}" does not exist. Registering "${id}" without parent.`)
    }

    // Update parent-child relationships
    if (!isUndefined(parentId) && group.has(parentId)) {
      parents.set(id, parentId)

      const list = children.get(parentId)
      if (list) {
        list.push(id)
      } else {
        children.set(parentId, [id])
      }

      // Auto-open parent when child registers (if openAll enabled)
      if (openAll) {
        openedIds.add(parentId)
      }
    } else {
      parents.set(id, undefined)
    }

    // Create ticket with nested-specific properties (exclude children from spreading)
    const { children: _, ...rest } = registration
    const item = {
      ...rest,
      id,
      parentId: parents.get(id),
      isOpen: toRef(() => opened(id)),
      isActive: toRef(() => activated(id)),
      isLeaf: toRef(() => isLeaf(id)),
      depth: toRef(() => getDepth(id)),
      open: () => open(id),
      close: () => close(id),
      flip: () => flip(id),
      reveal: () => reveal(id),
      activate: () => activate(id),
      deactivate: () => deactivate(id),
      getPath: () => getPath(id),
      getAncestors: () => getAncestors(id),
      getDescendants: () => getDescendants(id),
      isAncestorOf: (descendantId: ID) => isAncestorOf(id, descendantId),
      hasAncestor: (ancestorId: ID) => hasAncestor(id, ancestorId),
      siblings: () => siblings(id),
      position: () => position(id),
    }

    const ticket = group.register(item as Partial<GroupTicketInput>) as unknown as E

    if (registration.active) {
      activate(id)
    }

    // Recursively register nested children
    if (nested?.length) {
      for (const child of nested) {
        register({ ...child, parentId: id } as NestedRegistration<Z>)
      }
    }

    return ticket
  }

  // Unregistration with cascade option
  function unregister (id: ID, cascade = false): void {
    if (!group.has(id)) return

    const parentId = parents.get(id)

    // Remove from parent's children array
    if (!isUndefined(parentId)) {
      const siblings = children.get(parentId)
      if (siblings) {
        const filtered = siblings.filter(sid => sid !== id)
        if (filtered.length === 0) {
          children.delete(parentId)
        } else {
          children.set(parentId, filtered)
        }
      }
    }

    // Handle children
    const list = children.get(id)
    if (list?.length) {
      if (cascade) {
        // Cascade delete to all descendants
        for (const did of getDescendants(id)) {
          parents.delete(did)
          children.delete(did)
          openedIds.delete(did)
          activeIds.delete(did)
          group.unregister(did)
        }
      } else {
        // Orphan children by setting their parent to undefined
        // Clear open and active state for ALL descendants to prevent memory leaks
        for (const did of getDescendants(id)) {
          openedIds.delete(did)
          activeIds.delete(did)
        }
        for (const cid of list) {
          parents.set(cid, undefined)
        }
      }
    }

    // Clean up
    parents.delete(id)
    children.delete(id)
    openedIds.delete(id)
    activeIds.delete(id)
    group.unregister(id)
  }

  function offboard (ids: ID[], cascade = false): void {
    for (const id of ids) {
      unregister(id, cascade)
    }
  }

  function onboard (registrations: NestedRegistration<Z>[]): E[] {
    return group.batch(() => registrations.map(registration => register(registration)))
  }

  function clear (): void {
    children.clear()
    parents.clear()
    openedIds.clear()
    activeIds.clear()
    group.reset()
  }

  function reset (): void {
    clear()
  }

  const context = {
    ...group,
    children: children as ReadonlyMap<ID, readonly ID[]>,
    parents: parents as ReadonlyMap<ID, ID | undefined>,
    openedIds,
    openedItems,
    activeIds,
    activeItems,
    activeIndexes,
    roots,
    leaves,
    getPath,
    getAncestors,
    getDescendants,
    isLeaf,
    getDepth,
    isAncestorOf,
    hasAncestor,
    siblings,
    position,
    open,
    close,
    flip,
    opened,
    unfold,
    reveal,
    expand,
    expandAll,
    collapseAll,
    activate,
    deactivate,
    activated,
    deactivateAll,
    toFlat,
    openStrategy: resolvedOpenStrategy,
    select,
    unselect,
    toggle,
    register,
    unregister,
    offboard,
    onboard,
    clear,
    reset,
    get size () {
      return group.size
    },
  } as R

  return context
}

/**
 * Creates a new nested context with provide/inject pattern.
 *
 * @param options The options for the nested context.
 * @returns A trinity tuple [useNested, provideNested, defaultNested]
 *
 * @see https://0.vuetifyjs.com/composables/selection/use-nested
 *
 * @example
 * ```ts
 * import { createNestedContext } from '@vuetify/v0'
 *
 * export const [useTree, provideTree, tree] = createNestedContext()
 *
 * // In parent: provideTree()
 * // In child: const tree = useTree()
 * ```
 */
export function createNestedContext<
  Z extends NestedTicketInput = NestedTicketInput,
  E extends NestedTicket<Z> = NestedTicket<Z>,
  R extends NestedContext<Z, E> = NestedContext<Z, E>,
> (_options: NestedContextOptions = {}): ContextTrinity<R> {
  const { namespace = 'v0:nested', ...options } = _options
  const [useNestedContext, _provideNestedContext] = createContext<R>(namespace)
  const context = createNested<Z, E, R>(options)

  function provideNestedContext (_context: R = context, app?: App): R {
    return _provideNestedContext(_context, app)
  }

  return createTrinity<R>(useNestedContext, provideNestedContext, context)
}

/**
 * Returns the current nested instance from context.
 *
 * @param namespace The namespace for the nested context. Defaults to `'v0:nested'`.
 * @returns The current nested instance.
 *
 * @see https://0.vuetifyjs.com/composables/selection/use-nested
 */
export function useNested<
  Z extends NestedTicketInput = NestedTicketInput,
  E extends NestedTicket<Z> = NestedTicket<Z>,
  R extends NestedContext<Z, E> = NestedContext<Z, E>,
> (namespace = 'v0:nested'): R {
  return useContext<R>(namespace)
}

export { type NestedActiveMode, type NestedContext, type NestedContextOptions, type NestedOpenMode, type NestedOptions, type NestedRegistration, type NestedSelectionMode, type NestedTicket, type NestedTicketInput, type OpenStrategy, type OpenStrategyContext } from './types'

export { multipleOpenStrategy, singleOpenStrategy } from './strategies'
