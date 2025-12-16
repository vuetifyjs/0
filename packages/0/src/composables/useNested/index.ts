/**
 * @module useNested
 *
 * @remarks
 * Hierarchical tree management composable extending useGroup with:
 * - Parent-child relationship tracking (children/parents Maps)
 * - Open/close state management
 * - Tree traversal utilities (getPath, getDescendants, etc.)
 * - Pluggable open strategies
 *
 * Inheritance chain: useRegistry → useSelection → useGroup → useNested
 */

// Factories
import { createContext, useContext } from '#v0/composables/createContext'
import { createTrinity } from '#v0/composables/createTrinity'

// Composables
import { createGroup } from '#v0/composables/useGroup'
import { useLogger } from '#v0/composables/useLogger'

// Utilities
import { computed, shallowReactive, toRef } from 'vue'
import { genId, isUndefined } from '#v0/utilities'

// Transformers
import { toArray } from '#v0/composables/toArray'

// Strategies
import { multipleOpenStrategy } from './strategies'

// Types
import type { App } from 'vue'
import type { ID } from '#v0/types'
import type { GroupContext, GroupTicket } from '#v0/composables/useGroup'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type {
  NestedContext,
  NestedContextOptions,
  NestedOptions,
  NestedTicket,
  OpenStrategy,
} from './types'

// Re-export types
export type {
  NestedContext,
  NestedContextOptions,
  NestedOptions,
  NestedTicket,
  OpenStrategy,
}

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
>(_options: NestedOptions = {}): E {
  const { openStrategy = multipleOpenStrategy, ...options } = _options
  const group = createGroup<GroupTicket, GroupContext<GroupTicket>>(options)
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
        .filter((item): item is Z => !isUndefined(item)) as Z[]
    )
  })

  const roots = computed(() => {
    return group.values().filter(item => isUndefined(parents.get(item.id))) as Z[]
  })

  const leaves = computed(() => {
    return group.values().filter(item => {
      const childList = children.get(item.id)
      return isUndefined(childList) || childList.length === 0
    }) as Z[]
  })

  // Open state methods
  function opened(id: ID): boolean {
    return openedIds.has(id)
  }

  function open(ids: ID | ID[]): void {
    for (const id of toArray(ids)) {
      if (!group.has(id)) continue
      openedIds.add(id)
      openStrategy.onOpen?.(id, context)
    }
  }

  function close(ids: ID | ID[]): void {
    for (const id of toArray(ids)) {
      openedIds.delete(id)
      openStrategy.onClose?.(id, context)
    }
  }

  function toggleOpen(ids: ID | ID[]): void {
    for (const id of toArray(ids)) {
      if (opened(id)) {
        close(id)
      } else {
        open(id)
      }
    }
  }

  // Tree traversal methods (computed on-demand)
  function getPath(id: ID): ID[] {
    const path: ID[] = []
    let currentId: ID | undefined = id

    while (!isUndefined(currentId)) {
      path.unshift(currentId)
      currentId = parents.get(currentId)
    }

    return path
  }

  function getAncestors(id: ID): ID[] {
    const path = getPath(id)
    return path.slice(0, -1)
  }

  function getDescendants(id: ID): ID[] {
    const descendants: ID[] = []
    const queue: ID[] = [...(children.get(id) ?? [])]

    while (queue.length > 0) {
      const currentId = queue.shift()!
      descendants.push(currentId)
      queue.push(...(children.get(currentId) ?? []))
    }

    return descendants
  }

  function isLeaf(id: ID): boolean {
    const childList = children.get(id)
    return isUndefined(childList) || childList.length === 0
  }

  function getDepth(id: ID): number {
    return getAncestors(id).length
  }

  // Registration
  function register(registration: Partial<Z> = {}): Z {
    const id = registration.id ?? genId()
    const parentId = registration.parentId

    // Validate parent exists if provided
    if (!isUndefined(parentId) && !group.has(parentId)) {
      logger.warn(`Parent with id "${parentId}" does not exist. Registering "${id}" without parent.`)
    }

    // Update parent-child relationships
    if (!isUndefined(parentId) && group.has(parentId)) {
      parents.set(id, parentId)

      const childList = children.get(parentId)
      if (childList) {
        childList.push(id)
      } else {
        children.set(parentId, [id])
      }
    } else {
      parents.set(id, undefined)
    }

    // Create ticket with nested-specific properties
    const item: Partial<Z> = {
      ...registration,
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

    const ticket = group.register(item as any) as Z

    return ticket
  }

  // Unregistration with cascade option
  function unregister(id: ID, cascade = false): void {
    if (!group.has(id)) return

    const parentId = parents.get(id)

    // Remove from parent's children array
    if (!isUndefined(parentId)) {
      const childList = children.get(parentId)
      if (childList) {
        const filtered = childList.filter(childId => childId !== id)
        if (filtered.length === 0) {
          children.delete(parentId)
        } else {
          children.set(parentId, filtered)
        }
      }
    }

    // Handle children
    const childList = children.get(id)
    if (childList && childList.length > 0) {
      if (cascade) {
        // Cascade delete to all descendants
        const descendants = getDescendants(id)
        for (const descendantId of descendants) {
          parents.delete(descendantId)
          children.delete(descendantId)
          openedIds.delete(descendantId)
          group.unregister(descendantId)
        }
      } else {
        // Orphan children by setting their parent to undefined
        for (const childId of childList) {
          parents.set(childId, undefined)
        }
      }
    }

    // Clean up
    parents.delete(id)
    children.delete(id)
    openedIds.delete(id)
    group.unregister(id)
  }

  function offboard(ids: ID[], cascade = false): void {
    for (const id of ids) {
      unregister(id, cascade)
    }
  }

  function onboard(registrations: Partial<Z>[]): Z[] {
    return registrations.map(registration => register(registration))
  }

  function reset(): void {
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
    openStrategy,
    register,
    unregister,
    offboard,
    onboard,
    reset,
    get size() {
      return group.size
    },
  } as E

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
>(_options: NestedContextOptions = {}): ContextTrinity<E> {
  const { namespace = 'v0:nested', ...options } = _options
  const [useNestedContext, _provideNestedContext] = createContext<E>(namespace)
  const context = createNested<Z, E>(options)

  function provideNestedContext(_context: E = context, app?: App): E {
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
>(namespace = 'v0:nested'): E {
  return useContext<E>(namespace)
}

/**
 * Default nested trinity export.
 */
export const [defaultUseNested, provideNested, defaultNested] = createNestedContext()
