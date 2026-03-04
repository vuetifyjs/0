// Types
import type { AtomProps } from '#v0/components/Atom'
import type { NestedActiveMode, NestedOpenMode, NestedSelectionMode, NestedTicket } from '#v0/composables/createNested'
import type { ID } from '#v0/types'
import type { MaybeRef, Ref } from 'vue'

// TreeviewActivator
export interface TreeviewActivatorProps extends AtomProps {
  /** Namespace for dependency injection */
  namespace?: string
}

export interface TreeviewActivatorSlotProps {
  /** Whether the parent item is expanded */
  isOpen: boolean
  /** Whether the parent item is a leaf node (no children) */
  isLeaf: boolean
  /** Whether the parent item is disabled */
  isDisabled: boolean
  /** Toggle the parent item's open/closed state */
  flip: () => void
  /** Attributes to bind to the activator element */
  attrs: {
    'role': 'button' | undefined
    'tabindex': number
    'aria-disabled': boolean
    'data-disabled': true | undefined
    'data-open': true | undefined
    'disabled': boolean | undefined
    'type': 'button' | undefined
    'onClick': () => void
    'onKeydown': (e: KeyboardEvent) => void
  }
}

// TreeviewCheckbox
export interface TreeviewCheckboxProps extends AtomProps {
  /** Namespace for dependency injection */
  namespace?: string
}

export interface TreeviewCheckboxSlotProps {
  /** Whether the item is selected */
  isSelected: boolean
  /** Whether the item is in a mixed/indeterminate state (some descendants selected) */
  isMixed: boolean
  /** Whether the item is disabled */
  isDisabled: boolean
  /** Toggle selection state */
  toggle: () => void
  /** Select this item */
  select: () => void
  /** Unselect this item */
  unselect: () => void
  /** Attributes to bind to the checkbox element */
  attrs: {
    'role': 'checkbox'
    'aria-checked': boolean | 'mixed'
    'aria-disabled': true | undefined
    'tabindex': number
    'data-selected': true | undefined
    'data-disabled': true | undefined
    'data-mixed': true | undefined
    'onClick': () => void
    'onKeydown': (e: KeyboardEvent) => void
  }
}

// TreeviewCue
export interface TreeviewCueProps extends AtomProps {
  /** Namespace for dependency injection */
  namespace?: string
}

export interface TreeviewCueSlotProps {
  /** Whether the parent item is expanded */
  isOpen: boolean
  /** Whether the parent item is a leaf node (no children) */
  isLeaf: boolean
  /** Attributes to bind to the cue element */
  attrs: {
    'aria-hidden': true
    'data-state': 'open' | 'closed'
    'style': { visibility: 'visible' | 'hidden' }
  }
}

// TreeviewContent
export interface TreeviewContentProps {
  /** Namespace for dependency injection */
  namespace?: string
}

export interface TreeviewContentSlotProps {
  /** Whether the parent item is expanded */
  isOpen: boolean
}

// TreeviewGroup
export interface TreeviewGroupProps extends AtomProps {}

export interface TreeviewGroupSlotProps {
  /** Attributes to bind to the group element */
  attrs: {
    role: 'group'
  }
}

// TreeviewIndicator
export interface TreeviewIndicatorProps extends AtomProps {
  /** Namespace for dependency injection */
  namespace?: string
}

export interface TreeviewIndicatorSlotProps {
  /** Whether the item is selected */
  isSelected: boolean
  /** Whether the item is in a mixed/indeterminate state */
  isMixed: boolean
  /** Attributes to bind to the indicator element */
  attrs: {
    'aria-hidden': true
    'data-state': 'checked' | 'unchecked' | 'indeterminate'
    'style': { visibility: 'visible' | 'hidden' }
  }
}

// TreeviewItem
export interface TreeviewItemContext {
  ticket: NestedTicket
  isDisabled: Readonly<Ref<boolean>>
  hasContent: Ref<boolean>
}

export interface TreeviewItemProps<V = unknown> extends AtomProps {
  /** Unique identifier (auto-generated if not provided) */
  id?: string
  /**
   * Value associated with this item
   *
   * @example
   * ```vue
   * <template>
   *   <Treeview.Item value="settings">
   *     <Treeview.Activator>Settings</Treeview.Activator>
   *   </Treeview.Item>
   * </template>
   * ```
   */
  value?: V
  /**
   * Disables this item
   *
   * @example
   * ```vue
   * <template>
   *   <Treeview.Item disabled>
   *     <Treeview.Activator>Locked</Treeview.Activator>
   *   </Treeview.Item>
   * </template>
   * ```
   */
  disabled?: MaybeRef<boolean>
  /** Namespace for dependency injection */
  namespace?: string
}

export interface TreeviewItemSlotProps<V = unknown> {
  /** Unique identifier of this item */
  id: string
  /** Value associated with this item */
  value: V | undefined
  /** Whether this item is selected */
  isSelected: boolean
  /** Whether this item is in a mixed/indeterminate state */
  isMixed: boolean
  /** Whether this item is disabled */
  isDisabled: boolean
  /** Whether this item is expanded */
  isOpen: boolean
  /** Whether this item is active/highlighted */
  isActive: boolean
  /** Whether this item is a leaf node (no children) */
  isLeaf: boolean
  /** Depth level in the tree (0 = root) */
  depth: number
  /** Select this item */
  select: () => void
  /** Unselect this item */
  unselect: () => void
  /** Toggle selection state */
  toggle: () => void
  /** Toggle open/closed state */
  flip: () => void
  /** Expand this item */
  open: () => void
  /** Collapse this item */
  close: () => void
  /** Activate/highlight this item */
  activate: () => void
  /** Deactivate/unhighlight this item */
  deactivate: () => void
}

// TreeviewList
export interface TreeviewListProps extends AtomProps {
  /** Namespace for dependency injection */
  namespace?: string
  /** Whether multiple items can be selected (sets aria-multiselectable) */
  multiselectable?: boolean
}

export interface TreeviewListSlotProps {
  /** Attributes to bind to the list element */
  attrs: {
    'role': 'tree'
    'aria-multiselectable': boolean
  }
}

// TreeviewSelectAll
export interface TreeviewSelectAllProps extends AtomProps {
  /**
   * Optional display label (passed through to slot and aria-label)
   *
   * @example
   * ```vue
   * <template>
   *   <Treeview.SelectAll label="Select all items" />
   * </template>
   * ```
   */
  label?: string
  /** Disables this checkbox */
  disabled?: boolean
  /** Namespace for dependency injection */
  namespace?: string
}

export interface TreeviewSelectAllSlotProps {
  /** Optional display label */
  label?: string
  /** Whether all items are selected */
  isAllSelected: boolean
  /** Whether some but not all items are selected */
  isMixed: boolean
  /** Whether this checkbox is disabled */
  isDisabled: boolean
  /** Select all items */
  selectAll: () => void
  /** Unselect all items */
  unselectAll: () => void
  /** Toggle between all selected and none selected */
  toggleAll: () => void
  /** Attributes to bind to the select-all element */
  attrs: {
    'role': 'checkbox'
    'aria-checked': boolean | 'mixed'
    'aria-disabled': boolean | undefined
    'aria-label': string | undefined
    'tabindex': 0 | undefined
    'data-state': 'checked' | 'unchecked' | 'indeterminate'
    'data-disabled': true | undefined
  }
}

// TreeviewRoot
export interface TreeviewRootProps {
  /** Namespace for dependency injection */
  namespace?: string
  /**
   * Disables the entire tree
   *
   * @example
   * ```vue
   * <template>
   *   <Treeview.Root disabled>
   *     <Treeview.List>
   *       <Treeview.Item>
   *         <Treeview.Activator>Disabled item</Treeview.Activator>
   *       </Treeview.Item>
   *     </Treeview.List>
   *   </Treeview.Root>
   * </template>
   * ```
   */
  disabled?: boolean
  /**
   * Auto-select non-disabled items on registration
   *
   * @example
   * ```vue
   * <template>
   *   <Treeview.Root enroll multiple>
   *     <Treeview.List>
   *       <Treeview.Item value="a">A</Treeview.Item>
   *       <Treeview.Item value="b">B</Treeview.Item>
   *     </Treeview.List>
   *   </Treeview.Root>
   * </template>
   * ```
   */
  enroll?: boolean
  /**
   * Prevents deselecting the last selected item
   *
   * @example
   * ```vue
   * <template>
   *   <Treeview.Root mandatory>
   *     <Treeview.List>
   *       <Treeview.Item value="a">Always one selected</Treeview.Item>
   *       <Treeview.Item value="b">Can't deselect last</Treeview.Item>
   *     </Treeview.List>
   *   </Treeview.Root>
   * </template>
   * ```
   */
  mandatory?: boolean | 'force'
  /**
   * Allows selecting multiple items
   *
   * @example
   * ```vue
   * <template>
   *   <Treeview.Root multiple>
   *     <Treeview.List>
   *       <Treeview.Item value="a">
   *         <Treeview.Checkbox />
   *         Option A
   *       </Treeview.Item>
   *       <Treeview.Item value="b">
   *         <Treeview.Checkbox />
   *         Option B
   *       </Treeview.Item>
   *     </Treeview.List>
   *   </Treeview.Root>
   * </template>
   * ```
   */
  multiple?: boolean
  /**
   * Controls how nodes expand: 'multiple' (default) or 'single' (accordion)
   *
   * @example
   * ```vue
   * <template>
   *   <Treeview.Root open="single">
   *     <Treeview.List>
   *       <Treeview.Item>
   *         <Treeview.Activator>Only one open at a time</Treeview.Activator>
   *       </Treeview.Item>
   *     </Treeview.List>
   *   </Treeview.Root>
   * </template>
   * ```
   */
  open?: NestedOpenMode
  /**
   * Auto-expand all nodes on registration
   *
   * @example
   * ```vue
   * <template>
   *   <Treeview.Root open-all>
   *     <Treeview.List>
   *       <Treeview.Item>
   *         <Treeview.Activator>Parent</Treeview.Activator>
   *         <Treeview.Content>
   *           <Treeview.Item>
   *             <Treeview.Activator>Child (visible on mount)</Treeview.Activator>
   *           </Treeview.Item>
   *         </Treeview.Content>
   *       </Treeview.Item>
   *     </Treeview.List>
   *   </Treeview.Root>
   * </template>
   * ```
   */
  openAll?: boolean
  /**
   * Opening a node also opens all its ancestors
   *
   * @example
   * ```vue
   * <template>
   *   <Treeview.Root reveal>
   *     <Treeview.List>...</Treeview.List>
   *   </Treeview.Root>
   * </template>
   * ```
   */
  reveal?: boolean
  /**
   * Controls how selection cascades: 'cascade' (default), 'independent', or 'leaf'
   *
   * @example
   * ```vue
   * <template>
   *   <!-- Parent selection selects all descendants -->
   *   <Treeview.Root selection="cascade" multiple>...</Treeview.Root>
   *
   *   <!-- Each node selected independently -->
   *   <Treeview.Root selection="independent" multiple>...</Treeview.Root>
   *
   *   <!-- Only leaf nodes can be selected -->
   *   <Treeview.Root selection="leaf" multiple>...</Treeview.Root>
   * </template>
   * ```
   */
  selection?: NestedSelectionMode
  /**
   * Controls active/highlight mode: 'single' (default) or 'multiple'
   *
   * @example
   * ```vue
   * <template>
   *   <Treeview.Root active="multiple">
   *     <Treeview.List>...</Treeview.List>
   *   </Treeview.Root>
   * </template>
   * ```
   */
  active?: NestedActiveMode
}

export interface TreeviewRootSlotProps {
  /** Whether the tree is disabled */
  isDisabled: boolean
  /** Whether no items are selected */
  isNoneSelected: boolean
  /** Whether all items are selected */
  isAllSelected: boolean
  /** Whether some but not all items are selected */
  isMixed: boolean
  /** Select one or more items by ID */
  select: (id: ID | ID[]) => void
  /** Unselect one or more items by ID */
  unselect: (id: ID | ID[]) => void
  /** Toggle selection of one or more items by ID */
  toggle: (id: ID | ID[]) => void
  /** Select all items */
  selectAll: () => void
  /** Unselect all items */
  unselectAll: () => void
  /** Expand all non-leaf nodes */
  expandAll: () => void
  /** Collapse all nodes */
  collapseAll: () => void
}
