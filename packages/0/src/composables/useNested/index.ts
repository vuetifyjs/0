/**
 * @module useNested
 *
 * @remarks
 * Hierarchical selection composable for tree structures with multiple selection adapters.
 *
 * Key features:
 * - Parent-child relationship tracking
 * - Tri-state selection (on/off/indeterminate)
 * - 6 selection adapters (classic, leaf, independent, trunk, etc.)
 * - Bidirectional propagation (classic adapter)
 * - Path utilities (getPath, getDescendants, getAncestors)
 * - Per-node selection state
 * - Follows the adapter pattern used by Theme, Logger, Storage, Locale
 *
 * Inheritance chain: useRegistry → useNested
 *
 * @see https://0.vuetifyjs.com/composables/selection/use-nested
 */

// Factories
import { createContext, useContext } from '#v0/composables/createContext'
import { createTrinity } from '#v0/composables/createTrinity'

// Composables
import { useRegistry } from '#v0/composables/useRegistry'

// Utilities
import { computed, shallowRef, toValue } from 'vue'
import { genId } from '#v0/utilities'

// Adapters
import { getSelectAdapter } from './adapters'

// Types
import type { App, ComputedRef, MaybeRef, Ref } from 'vue'
import type { ID } from '#v0/types'
import type { RegistryContext, RegistryOptions, RegistryTicket } from '#v0/composables/useRegistry'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { SelectAdapter, SelectAdapterName, SelectionState } from './adapters'

// Re-export adapter types
export type { SelectAdapter, SelectAdapterName, SelectionState } from './adapters'
export * from './adapters'

export interface NestedTicket<V = unknown> extends RegistryTicket<V> {
  /** Parent node ID (undefined for root nodes) */
  parent?: ID
  /** Disabled state of the ticket */
  disabled: MaybeRef<boolean>
  /** Selection state: 'on' | 'off' | 'indeterminate' */
  state: ComputedRef<SelectionState>
  /** Whether this node is a leaf (has no children) */
  isLeaf: ComputedRef<boolean>
  /** Whether this node is selected ('on') */
  isSelected: Readonly<Ref<boolean>>
  /** Whether this node is indeterminate */
  isIndeterminate: ComputedRef<boolean>
  /** Child node IDs */
  children: ComputedRef<ID[]>
  /** Select this node */
  select: () => void
  /** Unselect this node */
  unselect: () => void
  /** Toggle this node */
  toggle: () => void
}

export interface NestedContext<Z extends NestedTicket> extends RegistryContext<Z> {
  /** Child-to-parent relationship map */
  parents: Ref<Map<ID, ID>>
  /** Parent-to-children relationship map */
  childrenMap: Ref<Map<ID, ID[]>>
  /** Selection state per node */
  selectionState: Ref<Map<ID, SelectionState>>
  /** Set of disabled node IDs */
  disabledIds: Ref<Set<ID>>
  /** Current selection adapter */
  adapter: SelectAdapterName | SelectAdapter
  /** Set of selected node IDs (nodes with state 'on') */
  selectedIds: ComputedRef<Set<ID>>
  /** Selected values (output from strategy) */
  selectedValues: ComputedRef<ID[]>
  /** Root nodes (nodes without parent) */
  roots: ComputedRef<Z[]>
  /** Whether no items are selected */
  isNoneSelected: ComputedRef<boolean>
  /** Whether all selectable items are selected */
  isAllSelected: ComputedRef<boolean>
  /** Whether some but not all items are selected */
  isIndeterminate: ComputedRef<boolean>
  /** Select one or more nodes by ID */
  select: (ids: ID | ID[]) => void
  /** Unselect one or more nodes by ID */
  unselect: (ids: ID | ID[]) => void
  /** Toggle one or more nodes by ID */
  toggle: (ids: ID | ID[]) => void
  /** Select all selectable nodes */
  selectAll: () => void
  /** Unselect all nodes */
  unselectAll: () => void
  /** Toggle all nodes */
  toggleAll: () => void
  /** Get selection state for a node */
  getState: (id: ID) => SelectionState
  /** Get path from root to node */
  getPath: (id: ID) => ID[]
  /** Get all descendants of a node */
  getDescendants: (id: ID) => ID[]
  /** Get all ancestors of a node */
  getAncestors: (id: ID) => ID[]
  /** Check if node is a leaf (no children) */
  isLeaf: (id: ID) => boolean
  /** Check if node is a root (no parent) */
  isRoot: (id: ID) => boolean
  /** Reset all state */
  reset: () => void
}

export interface NestedOptions extends RegistryOptions {
  /** Selection adapter (name, instance, or factory) */
  adapter?: SelectAdapterName | SelectAdapter | ((mandatory: boolean) => SelectAdapter)
  /** When true, prevents deselecting the last item */
  mandatory?: boolean
  /** Initial selected IDs */
  selected?: ID[]
}

export interface NestedContextOptions extends NestedOptions {
  namespace: string
}

/**
 * Creates a new nested selection instance for hierarchical data.
 *
 * Provides tri-state selection with configurable propagation adapters
 * for tree structures like file explorers, nested checkboxes, and menus.
 *
 * @param options The options for the nested instance.
 * @template Z The type of the nested ticket.
 * @template E The type of the nested context.
 * @returns A new nested instance with hierarchical selection support.
 *
 * @remarks
 * **Selection Adapters:**
 * - `'classic'` (default): Tri-state with bidirectional propagation
 * - `'leaf'`: Only leaf nodes selectable, multi-select
 * - `'single-leaf'`: Only leaf nodes, single selection
 * - `'independent'`: No propagation, any node selectable
 * - `'single-independent'`: No propagation, single selection
 * - `'trunk'`: Classic but outputs highest selected ancestors
 *
 * **Registration with Parent:**
 * ```ts
 * nested.register({ id: 'child', value: 'Child', parent: 'parent-id' })
 * ```
 *
 * **Tri-State Selection:**
 * - `'on'`: Node is selected
 * - `'off'`: Node is not selected
 * - `'indeterminate'`: Some children selected (classic adapter)
 *
 * @see https://0.vuetifyjs.com/composables/selection/use-nested
 *
 * @example
 * ```ts
 * import { createNested } from '@vuetify/v0'
 *
 * const tree = createNested({ adapter: 'classic' })
 *
 * tree.onboard([
 *   { id: 'root', value: 'Root' },
 *   { id: 'folder-1', value: 'Folder 1', parent: 'root' },
 *   { id: 'file-1', value: 'File 1.txt', parent: 'folder-1' },
 *   { id: 'file-2', value: 'File 2.txt', parent: 'folder-1' },
 * ])
 *
 * // Select folder-1 (selects all descendants with classic strategy)
 * tree.select('folder-1')
 *
 * console.log(tree.getState('folder-1')) // 'on'
 * console.log(tree.getState('file-1'))   // 'on'
 * console.log(tree.getState('root'))     // 'on' (all children selected)
 *
 * // Unselect one file
 * tree.unselect('file-1')
 * console.log(tree.getState('folder-1')) // 'indeterminate'
 * console.log(tree.getState('root'))     // 'indeterminate'
 * ```
 */
export function createNested<
  Z extends NestedTicket = NestedTicket,
  E extends NestedContext<Z> = NestedContext<Z>,
> (_options: NestedOptions = {}): E {
  const {
    adapter: adapterOption = 'classic',
    mandatory = false,
    selected: initialSelected = [],
    ...options
  } = _options

  const registry = useRegistry<Z, E>(options)

  // Parent-child relationships
  const parents = shallowRef(new Map<ID, ID>())
  const childrenMap = shallowRef(new Map<ID, ID[]>())

  // Selection state
  const selectionState = shallowRef(new Map<ID, SelectionState>())
  const disabledIds = shallowRef(new Set<ID>())

  // Get the adapter
  const resolvedAdapter = typeof adapterOption === 'function'
    ? adapterOption(mandatory)
    : (typeof adapterOption === 'object'
        ? adapterOption
        : getSelectAdapter(adapterOption, mandatory))

  // Computed: selected IDs (nodes with 'on' state)
  const selectedIds = computed(() => {
    const ids = new Set<ID>()
    for (const [id, state] of selectionState.value.entries()) {
      if (state === 'on') ids.add(id)
    }
    return ids
  })

  // Computed: selected values (adapter output)
  const selectedValues = computed(() => {
    return resolvedAdapter.transformOut(
      selectionState.value,
      {
        children: childrenMap.value,
        parents: parents.value,
        disabled: disabledIds.value,
      },
    )
  })

  // Computed: root nodes
  const roots = computed(() => {
    return Array.from(registry.values()).filter(
      item => !parents.value.has(item.id),
    )
  })

  // Computed: leaf nodes (for all selected calculation)
  const leafIds = computed(() => {
    const leaves: ID[] = []
    for (const item of registry.values()) {
      if (!childrenMap.value.has(item.id) && !toValue(item.disabled)) {
        leaves.push(item.id)
      }
    }
    return leaves
  })

  // Computed: selection summary states
  const isNoneSelected = computed(() => selectedIds.value.size === 0)

  const isAllSelected = computed(() => {
    const leaves = leafIds.value
    if (leaves.length === 0) return false
    return leaves.every(id => selectionState.value.get(id) === 'on')
  })

  const isIndeterminate = computed(() => {
    return !isNoneSelected.value && !isAllSelected.value
  })

  // Get selection state for a node
  function getState (id: ID): SelectionState {
    return selectionState.value.get(id) ?? 'off'
  }

  // Check if a node is selected
  function isSelected (id: ID): boolean {
    return getState(id) === 'on'
  }

  // Check if a node is a leaf
  function isLeafNode (id: ID): boolean {
    return !childrenMap.value.has(id)
  }

  // Check if a node is a root
  function isRoot (id: ID): boolean {
    return !parents.value.has(id)
  }

  // Get path from root to node
  function getPath (id: ID): ID[] {
    const path: ID[] = []
    let current: ID | undefined = id

    while (current != null) {
      path.unshift(current)
      current = parents.value.get(current)
    }

    return path
  }

  // Get all descendants of a node
  function getDescendants (id: ID): ID[] {
    const descendants: ID[] = []
    const stack = childrenMap.value.get(id)?.slice() ?? []

    while (stack.length > 0) {
      const childId = stack.pop()!
      descendants.push(childId)
      const grandchildren = childrenMap.value.get(childId)
      if (grandchildren) {
        stack.push(...grandchildren)
      }
    }

    return descendants
  }

  // Get all ancestors of a node
  function getAncestors (id: ID): ID[] {
    const ancestors: ID[] = []
    let parent = parents.value.get(id)

    while (parent != null) {
      ancestors.push(parent)
      parent = parents.value.get(parent)
    }

    return ancestors
  }

  // Apply selection using adapter
  function applySelection (id: ID, value: boolean) {
    const newState = resolvedAdapter.select({
      id,
      value,
      selected: new Map(selectionState.value),
      children: childrenMap.value,
      parents: parents.value,
      disabled: disabledIds.value,
    })
    selectionState.value = newState
  }

  // Select one or more nodes
  function select (ids: ID | ID[]) {
    const idArray = Array.isArray(ids) ? ids : [ids]
    for (const id of idArray) {
      if (!registry.has(id)) continue
      applySelection(id, true)
    }
  }

  // Unselect one or more nodes
  function unselect (ids: ID | ID[]) {
    const idArray = Array.isArray(ids) ? ids : [ids]
    for (const id of idArray) {
      if (!registry.has(id)) continue
      applySelection(id, false)
    }
  }

  // Toggle one or more nodes
  function toggle (ids: ID | ID[]) {
    const idArray = Array.isArray(ids) ? ids : [ids]
    for (const id of idArray) {
      if (!registry.has(id)) continue
      const currentState = getState(id)
      applySelection(id, currentState !== 'on')
    }
  }

  // Select all selectable nodes
  function selectAll () {
    for (const id of leafIds.value) {
      applySelection(id, true)
    }
  }

  // Unselect all nodes
  function unselectAll () {
    if (mandatory && selectedIds.value.size > 0) {
      // Keep only the first selected leaf
      const firstSelected = Array.from(selectedIds.value)[0]
      selectionState.value = new Map<ID, SelectionState>()
      if (firstSelected != null) {
        applySelection(firstSelected, true)
      }
    } else {
      selectionState.value = new Map<ID, SelectionState>()
    }
  }

  // Toggle all nodes
  function toggleAll () {
    if (isAllSelected.value) {
      unselectAll()
    } else {
      selectAll()
    }
  }

  // Register a node with optional parent
  function register (registration: Partial<Z> = {}): Z {
    const id = registration.id ?? genId()
    const parentId = registration.parent
    const isDisabled = toValue(registration.disabled ?? false)

    // Create the ticket
    const item: Partial<Z> = {
      disabled: false,
      ...registration,
      id,
      state: computed(() => getState(id)),
      isLeaf: computed(() => isLeafNode(id)),
      isSelected: computed(() => isSelected(id)),
      isIndeterminate: computed(() => getState(id) === 'indeterminate'),
      children: computed(() => childrenMap.value.get(id) ?? []),
      select: () => select(id),
      unselect: () => unselect(id),
      toggle: () => toggle(id),
    }

    const ticket = registry.register(item) as Z

    // Track parent relationship
    if (parentId != null && registry.has(parentId)) {
      parents.value = new Map(parents.value).set(id, parentId)

      // Add to parent's children list
      const currentChildren = childrenMap.value.get(parentId) ?? []
      childrenMap.value = new Map(childrenMap.value).set(parentId, [...currentChildren, id])
    }

    // Track disabled state
    if (isDisabled) {
      disabledIds.value = new Set(disabledIds.value).add(id)
    }

    return ticket
  }

  // Unregister a node and clean up relationships
  function unregister (id: ID) {
    // Remove from parent's children list
    const parentId = parents.value.get(id)
    if (parentId != null) {
      const siblings = childrenMap.value.get(parentId) ?? []
      childrenMap.value = new Map(childrenMap.value).set(
        parentId,
        siblings.filter(childId => childId !== id),
      )
    }

    // Remove this node's children list
    const newChildrenMap = new Map(childrenMap.value)
    newChildrenMap.delete(id)
    childrenMap.value = newChildrenMap

    // Remove parent relationship
    const newParents = new Map(parents.value)
    newParents.delete(id)
    parents.value = newParents

    // Remove from disabled set
    const newDisabled = new Set(disabledIds.value)
    newDisabled.delete(id)
    disabledIds.value = newDisabled

    // Remove selection state
    const newState = new Map(selectionState.value)
    newState.delete(id)
    selectionState.value = newState

    registry.unregister(id)
  }

  // Onboard multiple nodes
  function onboard (registrations: Partial<Z>[]): Z[] {
    return registrations.map(registration => register(registration))
  }

  // Offboard multiple nodes
  function offboard (ids: ID[]) {
    for (const id of ids) {
      unregister(id)
    }
  }

  // Reset the nested state
  function reset () {
    registry.clear()
    parents.value = new Map()
    childrenMap.value = new Map()
    selectionState.value = new Map()
    disabledIds.value = new Set()
  }

  // Initialize with initial selected values
  if (initialSelected.length > 0) {
    const initialState = resolvedAdapter.transformIn(
      initialSelected,
      {
        children: childrenMap.value,
        parents: parents.value,
        disabled: disabledIds.value,
      },
    )
    selectionState.value = initialState
  }

  return {
    ...registry,
    parents,
    childrenMap,
    selectionState,
    disabledIds,
    adapter: adapterOption,
    selectedIds,
    selectedValues,
    roots,
    isNoneSelected,
    isAllSelected,
    isIndeterminate,
    register,
    unregister,
    onboard,
    offboard,
    reset,
    select,
    unselect,
    toggle,
    selectAll,
    unselectAll,
    toggleAll,
    getState,
    getPath,
    getDescendants,
    getAncestors,
    isLeaf: isLeafNode,
    isRoot,
    get size () {
      return registry.size
    },
  } as E
}

/**
 * Creates a new nested context with dependency injection support.
 *
 * @param options The options including namespace for the context.
 * @template Z The type of the nested ticket.
 * @template E The type of the nested context.
 * @returns A context trinity [useContext, provideContext, defaultContext].
 *
 * @example
 * ```ts
 * const [useFileTree, provideFileTree, fileTree] = createNestedContext({
 *   namespace: 'file-tree',
 *   adapter: 'classic',
 * })
 *
 * // In parent component:
 * provideFileTree()
 *
 * // In child component:
 * const tree = useFileTree()
 * tree.select('file-1')
 * ```
 */
export function createNestedContext<
  Z extends NestedTicket = NestedTicket,
  E extends NestedContext<Z> = NestedContext<Z>,
> (_options: NestedContextOptions): ContextTrinity<E> {
  const { namespace, ...options } = _options
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
 * @param namespace The namespace for the context. Defaults to `'v0:nested'`.
 * @returns The current nested instance.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { useNested } from '@vuetify/v0'
 *
 *   const nested = useNested()
 * </script>
 *
 * <template>
 *   <div>
 *     <p>Selected: {{ nested.selectedValues.value.length }}</p>
 *   </div>
 * </template>
 * ```
 */
export function useNested<
  Z extends NestedTicket = NestedTicket,
  E extends NestedContext<Z> = NestedContext<Z>,
> (namespace = 'v0:nested'): E {
  return useContext<E>(namespace)
}
