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
import { genId, isUndefined } from '#v0/utilities'
import { computed, shallowReactive, toRef } from 'vue'

// Transformers
import { toArray } from '#v0/composables/toArray'

// Types
import type { GroupContext } from '#v0/composables/createGroup'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { ID } from '#v0/types'
import type {
  NestedContext,
  NestedContextOptions,
  NestedOptions,
  NestedRegistration,
  NestedTicket,
} from './types'
import type { App } from 'vue'

// Strategies
import { multipleOpenStrategy } from './strategies'

// Re-export types

// Re-export strategies
export { multipleOpenStrategy, singleOpenStrategy } from './strategies'

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
 * - Adds open state management: `open()`, `close()`, `toggleOpen()`, `opened()`
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
  Z extends NestedTicket = NestedTicket,
  E extends NestedContext<Z> = NestedContext<Z>,
> (_options: NestedOptions = {}): E {
  const { openStrategy = multipleOpenStrategy, ...options } = _options
  const group = createGroup<Z, GroupContext<Z>>(options)
  const logger = useLogger()

  // Tree structure - use shallowReactive for proper reactivity
  const children = shallowReactive(new Map<ID, ID[]>())
  const parents = shallowReactive(new Map<ID, ID | undefined>())
  const openedIds = shallowReactive(new Set<ID>())

  // Computed collections
  const openedItems = computed(() => {
    return new Set(
      Array.from(openedIds)
        .map(id => group.get(id))
        .filter((item): item is Z => !isUndefined(item)),
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
      openedIds.add(id)
      openStrategy.onOpen?.(id, context)
    }
  }

  function close (ids: ID | ID[]): void {
    for (const id of toArray(ids)) {
      openedIds.delete(id)
      openStrategy.onClose?.(id, context)
    }
  }

  function toggleOpen (ids: ID | ID[]): void {
    for (const id of toArray(ids)) {
      if (opened(id)) {
        close(id)
      } else {
        open(id)
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

    while (queue.length > 0) {
      const currentId = queue.shift()!
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

  // Cascading selection helpers
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

  function select (ids: ID | ID[]): void {
    for (const id of toArray(ids)) {
      if (!group.has(id)) continue

      // Select this item and all descendants
      group.unmix(id)
      group.select(id)
      for (const did of getDescendants(id)) {
        group.unmix(did)
        group.select(did)
      }

      // Update ancestor states
      updateAncestors(id)
    }
  }

  function unselect (ids: ID | ID[]): void {
    for (const id of toArray(ids)) {
      if (!group.has(id)) continue

      // Unselect this item and all descendants
      group.unmix(id)
      group.unselect(id)
      for (const did of getDescendants(id)) {
        group.unmix(did)
        group.unselect(did)
      }

      // Update ancestor states
      updateAncestors(id)
    }
  }

  function toggle (ids: ID | ID[]): void {
    for (const id of toArray(ids)) {
      if (group.selected(id) || group.mixed(id)) {
        unselect(id)
      } else {
        select(id)
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
  function register (registration: NestedRegistration = {}): Z {
    const id = registration.id ?? genId()
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
    } else {
      parents.set(id, undefined)
    }

    // Create ticket with nested-specific properties (exclude children from spreading)
    const { children: _, ...rest } = registration
    const item: Partial<Z> = {
      ...rest,
      id,
      parentId: parents.get(id),
      isOpen: toRef(() => opened(id)),
      isLeaf: toRef(() => isLeaf(id)),
      depth: toRef(() => getDepth(id)),
      open: () => open(id),
      close: () => close(id),
      toggleOpen: () => toggleOpen(id),
      getPath: () => getPath(id),
      getAncestors: () => getAncestors(id),
      getDescendants: () => getDescendants(id),
    } as Partial<Z>

    const ticket = group.register(item)

    // Recursively register nested children
    if (nested?.length) {
      for (const child of nested) {
        register({ ...child, parentId: id })
      }
    }

    return ticket as Z
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
          group.unregister(did)
        }
      } else {
        // Orphan children by setting their parent to undefined
        for (const cid of list) {
          openedIds.delete(cid)
          parents.set(cid, undefined)
        }
      }
    }

    // Clean up
    parents.delete(id)
    children.delete(id)
    openedIds.delete(id)
    group.unregister(id)
  }

  function offboard (ids: ID[], cascade = false): void {
    for (const id of ids) {
      unregister(id, cascade)
    }
  }

  function onboard (registrations: NestedRegistration[]): Z[] {
    return registrations.map(registration => register(registration))
  }

  function reset (): void {
    children.clear()
    parents.clear()
    openedIds.clear()
    group.reset()
  }

  const context = {
    ...group,
    children,
    parents,
    openedIds,
    openedItems,
    roots,
    leaves,
    getPath,
    getAncestors,
    getDescendants,
    isLeaf,
    getDepth,
    open,
    close,
    toggleOpen,
    opened,
    expandAll,
    collapseAll,
    toFlat,
    openStrategy,
    select,
    unselect,
    toggle,
    register,
    unregister,
    offboard,
    onboard,
    reset,
    get size () {
      return group.size
    },
  } as unknown as E

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
  Z extends NestedTicket = NestedTicket,
  E extends NestedContext<Z> = NestedContext<Z>,
> (_options: NestedContextOptions = {}): ContextTrinity<E> {
  const { namespace = 'v0:nested', ...options } = _options
  const [useNestedContext, _provideNestedContext] = createContext<E>(namespace)
  const context = createNested<Z, E>(options)

  function provideNestedContext (_context: E = context, app?: App): E {
    return _provideNestedContext(_context, app)
  }

  return createTrinity<E>(useNestedContext, provideNestedContext, context)
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
  Z extends NestedTicket = NestedTicket,
  E extends NestedContext<Z> = NestedContext<Z>,
> (namespace = 'v0:nested'): E {
  return useContext<E>(namespace)
}

export { type NestedContext, type NestedContextOptions, type NestedOptions, type NestedRegistration, type NestedTicket, type OpenStrategy, type OpenStrategyContext } from './types'
