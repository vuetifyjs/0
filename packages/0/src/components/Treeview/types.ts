// Types
import type { AtomProps } from '#v0/components/Atom'
import type { NestedActiveMode, NestedOpenMode, NestedSelectionMode, NestedTicket } from '#v0/composables/createNested'
import type { ID } from '#v0/types'
import type { MaybeRef, Ref } from 'vue'

// TreeviewActivator
export interface TreeviewActivatorProps extends AtomProps {
  namespace?: string
}

export interface TreeviewActivatorSlotProps {
  isOpen: boolean
  isLeaf: boolean
  isDisabled: boolean
  flip: () => void
  attrs: {
    'role': 'button' | undefined
    'tabindex': number
    'aria-expanded': boolean | undefined
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
  namespace?: string
}

export interface TreeviewCheckboxSlotProps {
  isSelected: boolean
  isMixed: boolean
  isDisabled: boolean
  toggle: () => void
  select: () => void
  unselect: () => void
  attrs: {
    'role': 'checkbox'
    'aria-checked': boolean | 'mixed'
    'aria-disabled': boolean
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
  namespace?: string
}

export interface TreeviewCueSlotProps {
  isOpen: boolean
  isLeaf: boolean
  attrs: {
    'data-state': 'open' | 'closed'
    'style': { visibility: 'visible' | 'hidden' }
  }
}

// TreeviewContent
export interface TreeviewContentProps {
  namespace?: string
}

export interface TreeviewContentSlotProps {
  isOpen: boolean
}

// TreeviewGroup
export interface TreeviewGroupProps extends AtomProps {}

export interface TreeviewGroupSlotProps {
  attrs: {
    role: 'group'
  }
}

// TreeviewIndicator
export interface TreeviewIndicatorProps extends AtomProps {
  namespace?: string
}

export interface TreeviewIndicatorSlotProps {
  isSelected: boolean
  isMixed: boolean
  attrs: {
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
  id?: string
  value?: V
  disabled?: MaybeRef<boolean>
  namespace?: string
}

export interface TreeviewItemSlotProps<V = unknown> {
  id: string
  value: V | undefined
  isSelected: boolean
  isMixed: boolean
  isDisabled: boolean
  isOpen: boolean
  isActive: boolean
  isLeaf: boolean
  depth: number
  select: () => void
  unselect: () => void
  toggle: () => void
  flip: () => void
  open: () => void
  close: () => void
  activate: () => void
  deactivate: () => void
}

// TreeviewList
export interface TreeviewListProps extends AtomProps {
  namespace?: string
  multiselectable?: boolean
}

export interface TreeviewListSlotProps {
  attrs: {
    'role': 'tree'
    'aria-multiselectable': boolean
  }
}

// TreeviewRoot
export interface TreeviewRootProps {
  namespace?: string
  disabled?: boolean
  enroll?: boolean
  mandatory?: boolean | 'force'
  multiple?: boolean
  open?: NestedOpenMode
  openAll?: boolean
  reveal?: boolean
  selection?: NestedSelectionMode
  active?: NestedActiveMode
}

export interface TreeviewRootSlotProps {
  isDisabled: boolean
  isNoneSelected: boolean
  isAllSelected: boolean
  isMixed: boolean
  select: (id: ID | ID[]) => void
  unselect: (id: ID | ID[]) => void
  toggle: (id: ID | ID[]) => void
  selectAll: () => void
  unselectAll: () => void
  expandAll: () => void
  collapseAll: () => void
}
