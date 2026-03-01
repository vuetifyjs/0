# Treeview Component Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a compound Treeview component wrapping `createNested`, following existing component patterns (Group, ExpansionPanel).

**Architecture:** Compound component (Root + List + Item + Activator + Content + Group + Checkbox). Root creates `createNested` and provides context. Item registers with context and provides its own context for implicit parent-child nesting. All sub-components render default elements with ARIA attributes — no slot props required for basic usage.

**Tech Stack:** Vue 3 SFCs, `createNested` composable, `createContext` for DI, `Atom` for polymorphic rendering, `useProxyModel` for v-model bridging.

**Reference files:**
- Component pattern: `packages/0/src/components/Group/GroupRoot.vue`, `GroupItem.vue`
- Activator pattern: `packages/0/src/components/ExpansionPanel/ExpansionPanelActivator.vue`
- Content pattern: `packages/0/src/components/ExpansionPanel/ExpansionPanelContent.vue`
- Composable: `packages/0/src/composables/createNested/index.ts`
- Atom: `packages/0/src/components/Atom/Atom.vue`
- Test pattern: `packages/0/src/components/Group/index.test.ts`
- Design doc: `docs/plans/2026-03-01-treeview-design.md`

**All files live in:** `packages/0/src/components/Treeview/`

---

### Task 1: TreeviewRoot + TreeviewItem — Core Context Flow

The two tightly-coupled core components. Root creates/provides nested context. Item registers with it and provides its own context for descendant items.

**Files:**
- Create: `packages/0/src/components/Treeview/TreeviewRoot.vue`
- Create: `packages/0/src/components/Treeview/TreeviewItem.vue`

**Step 1: Write TreeviewRoot.vue**

Two `<script>` blocks (pattern from GroupRoot.vue). First block defines types and creates context. Second block is `setup` with generics.

```vue
/**
 * @module TreeviewRoot
 *
 * @remarks
 * Root component for treeview. Creates and provides a createNested context
 * to child TreeviewItem components. Bridges v-model for selection, open,
 * and active state. Renderless — no DOM output.
 */

<script lang="ts">
  // Foundational
  import { createContext } from '#v0/composables/createContext'

  // Types
  import type { NestedActiveMode, NestedContext, NestedOpenMode, NestedSelectionMode, NestedTicket } from '#v0/composables/createNested'
  import type { ID } from '#v0/types'

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

  export const [useTreeviewRoot, provideTreeviewRoot] = createContext<NestedContext<NestedTicket>>()
</script>

<script lang="ts" setup generic="T = unknown">
  // Composables
  import { createNested } from '#v0/composables/createNested'
  import { useProxyModel } from '#v0/composables/useProxyModel'

  // Utilities
  import { toRef, toValue } from 'vue'

  defineOptions({ name: 'TreeviewRoot' })

  defineSlots<{
    default: (props: TreeviewRootSlotProps) => any
  }>()

  defineEmits<{
    'update:model-value': [value: T | T[]]
  }>()

  const {
    namespace = 'v0:treeview',
    disabled = false,
    enroll = false,
    mandatory = false,
    multiple = true,
    open = 'multiple',
    openAll = false,
    reveal = false,
    selection = 'cascade',
    active = 'single',
  } = defineProps<TreeviewRootProps>()

  const model = defineModel<T | T[]>()

  const nested = createNested({
    disabled: toRef(() => disabled),
    enroll,
    mandatory,
    multiple,
    open,
    openAll,
    reveal,
    selection,
    active,
    events: true,
  })

  useProxyModel(nested, model, { multiple: true })

  provideTreeviewRoot(namespace, nested)

  const slotProps = toRef((): TreeviewRootSlotProps => ({
    isDisabled: toValue(nested.disabled),
    isNoneSelected: nested.isNoneSelected.value,
    isAllSelected: nested.isAllSelected.value,
    isMixed: nested.isMixed.value,
    select: nested.select,
    unselect: nested.unselect,
    toggle: nested.toggle,
    selectAll: nested.selectAll,
    unselectAll: nested.unselectAll,
    expandAll: nested.expandAll,
    collapseAll: nested.collapseAll,
  }))
</script>

<template>
  <slot v-bind="slotProps" />
</template>
```

Key points:
- Renderless (no Atom wrapper, just `<slot>`) — same as GroupRoot
- `multiple` defaults to `true` (tree = multi-select by default)
- `selection` defaults to `'cascade'` (parent-child cascading)
- `events: true` required for useProxyModel to work

**Step 2: Write TreeviewItem.vue**

Two `<script>` blocks. First defines types + two contexts: one for consuming parent item, one for providing to children. Item registers with nested context using parentId from ancestor item context.

```vue
/**
 * @module TreeviewItem
 *
 * @remarks
 * Tree node component. Registers with the parent TreeviewRoot's nested context.
 * Injects parent ID from nearest ancestor TreeviewItem via context injection
 * (implicit nesting). Provides its own context for descendant items.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useTreeviewRoot } from './TreeviewRoot.vue'

  // Foundational
  import { createContext } from '#v0/composables/createContext'

  // Utilities
  import { onBeforeUnmount, toRef, toValue } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { NestedTicket } from '#v0/composables/createNested'
  import type { ID } from '#v0/types'
  import type { MaybeRef } from 'vue'

  export interface TreeviewItemContext {
    ticket: NestedTicket
    isDisabled: Readonly<Ref<boolean>>
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

  // Parent item context — optional inject for implicit nesting
  export const [useTreeviewItem, provideTreeviewItem] = createContext<TreeviewItemContext>({ suffix: 'item' })
</script>

<script lang="ts" setup generic="V = unknown">
  // Need Ref type for interface above
  import type { Ref } from 'vue'

  defineOptions({ name: 'TreeviewItem' })

  defineSlots<{
    default: (props: TreeviewItemSlotProps<V>) => any
  }>()

  const {
    as = 'li',
    renderless,
    id,
    value,
    disabled,
    namespace = 'v0:treeview',
  } = defineProps<TreeviewItemProps<V>>()

  const nested = useTreeviewRoot(namespace)

  // Try to get parent item context for implicit nesting
  let parentId: ID | undefined
  try {
    const parent = useTreeviewItem(namespace)
    parentId = parent.ticket.id
  } catch {
    // No parent item — this is a root-level item
  }

  const ticket = nested.register({ id, value, disabled, parentId })
  const isDisabled = toRef(() => toValue(ticket.disabled) || toValue(nested.disabled))

  onBeforeUnmount(() => nested.unregister(ticket.id))

  // Provide own context for descendant items
  provideTreeviewItem(namespace, { ticket, isDisabled })

  const slotProps = toRef((): TreeviewItemSlotProps<V> => ({
    id: String(ticket.id),
    value,
    isSelected: toValue(ticket.isSelected),
    isMixed: toValue(ticket.isMixed),
    isDisabled: toValue(isDisabled),
    isOpen: toValue(ticket.isOpen),
    isActive: toValue(ticket.isActive),
    isLeaf: toValue(ticket.isLeaf),
    depth: toValue(ticket.depth),
    select: ticket.select,
    unselect: ticket.unselect,
    toggle: ticket.toggle,
    flip: ticket.flip,
    open: ticket.open,
    close: ticket.close,
    activate: ticket.activate,
    deactivate: ticket.deactivate,
  }))
</script>

<template>
  <Atom
    v-bind="slotProps.attrs"
    role="treeitem"
    :aria-expanded="slotProps.isLeaf ? undefined : slotProps.isOpen"
    :aria-selected="slotProps.isSelected"
    :aria-disabled="slotProps.isDisabled"
    :aria-level="slotProps.depth + 1"
    :aria-setsize="ticket.siblings().length"
    :aria-posinset="ticket.position()"
    :data-selected="slotProps.isSelected || undefined"
    :data-disabled="slotProps.isDisabled || undefined"
    :data-active="slotProps.isActive || undefined"
    :data-open="slotProps.isOpen || undefined"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
```

Key points:
- `useTreeviewItem` is wrapped in try/catch — root items have no parent context
- `parentId` is read from the nearest ancestor item's ticket ID
- Provides its own `TreeviewItemContext` for descendants
- ARIA attributes bound directly on Atom (not in slotProps.attrs) so they render automatically
- `aria-expanded` is `undefined` for leaf nodes (WAI-ARIA spec)
- `aria-level` is `depth + 1` (1-indexed per spec)

**Step 3: Verify the core flow compiles**

Run: `pnpm typecheck`
Expected: Should pass (components are standalone SFCs, no barrel yet).

Note: If typecheck complains about the try/catch for optional context, we may need to use `inject` with a default instead. The `createContext` pattern throws on missing context — check if it accepts an `optional` parameter. If not, use Vue's `inject` directly with a default of `undefined`.

**Step 4: Commit**

```bash
git add packages/0/src/components/Treeview/TreeviewRoot.vue packages/0/src/components/Treeview/TreeviewItem.vue
git commit -m "feat(Treeview): add TreeviewRoot and TreeviewItem components"
```

---

### Task 2: TreeviewList + TreeviewGroup — Structural Wrappers

Simple Atom wrappers that render `<ul>` with the correct ARIA role.

**Files:**
- Create: `packages/0/src/components/Treeview/TreeviewList.vue`
- Create: `packages/0/src/components/Treeview/TreeviewGroup.vue`

**Step 1: Write TreeviewList.vue**

```vue
/**
 * @module TreeviewList
 *
 * @remarks
 * Top-level list container for the treeview. Renders <ul role="tree">.
 * Consumes TreeviewRoot context for aria-multiselectable.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useTreeviewRoot } from './TreeviewRoot.vue'

  // Utilities
  import { toRef, toValue } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface TreeviewListProps extends AtomProps {
    namespace?: string
  }

  export interface TreeviewListSlotProps {
    attrs: {
      'role': 'tree'
      'aria-multiselectable': boolean
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'TreeviewList' })

  defineSlots<{
    default: (props: TreeviewListSlotProps) => any
  }>()

  const {
    as = 'ul',
    renderless,
    namespace = 'v0:treeview',
  } = defineProps<TreeviewListProps>()

  const nested = useTreeviewRoot(namespace)

  const slotProps = toRef((): TreeviewListSlotProps => ({
    attrs: {
      'role': 'tree',
      'aria-multiselectable': toValue(nested.multiple),
    },
  }))
</script>

<template>
  <Atom
    v-bind="slotProps.attrs"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
```

Note: `nested.multiple` is the reactive multiple option from createNested (inherited from createGroup). Check if it's exposed — if not, we need to provide it from Root via a separate context or read it from the nested context options. Verify by checking `GroupContext` type for a `multiple` property. If unavailable, provide a separate `TreeviewOptions` context from Root that includes `multiple`.

**Step 2: Write TreeviewGroup.vue**

```vue
/**
 * @module TreeviewGroup
 *
 * @remarks
 * Nested children container. Renders <ul role="group">.
 * Semantic wrapper for child items within a tree node.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface TreeviewGroupProps extends AtomProps {
    namespace?: string
  }

  export interface TreeviewGroupSlotProps {
    attrs: {
      role: 'group'
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'TreeviewGroup' })

  defineSlots<{
    default: (props: TreeviewGroupSlotProps) => any
  }>()

  const {
    as = 'ul',
    renderless,
  } = defineProps<TreeviewGroupProps>()

  const slotProps = toRef((): TreeviewGroupSlotProps => ({
    attrs: {
      role: 'group',
    },
  }))
</script>

<template>
  <Atom
    v-bind="slotProps.attrs"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
```

Key: TreeviewGroup is intentionally simple — just ARIA semantics, no context.

**Step 3: Verify typecheck passes**

Run: `pnpm typecheck`

**Step 4: Commit**

```bash
git add packages/0/src/components/Treeview/TreeviewList.vue packages/0/src/components/Treeview/TreeviewGroup.vue
git commit -m "feat(Treeview): add TreeviewList and TreeviewGroup components"
```

---

### Task 3: TreeviewActivator — Interactive Toggle

Handles click-to-toggle for expanding/collapsing tree nodes. Follows ExpansionPanelActivator pattern.

**Files:**
- Create: `packages/0/src/components/Treeview/TreeviewActivator.vue`

**Step 1: Write TreeviewActivator.vue**

```vue
/**
 * @module TreeviewActivator
 *
 * @remarks
 * Click-to-toggle trigger for a treeview item. Consumes TreeviewItem context
 * and calls ticket.flip() on click. Renders <button> by default with ARIA
 * attributes for expand/collapse state.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useTreeviewItem } from './TreeviewItem.vue'

  // Utilities
  import { toRef, toValue } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

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
</script>

<script setup lang="ts">
  defineOptions({ name: 'TreeviewActivator' })

  defineSlots<{
    default: (props: TreeviewActivatorSlotProps) => any
  }>()

  const {
    as = 'button',
    renderless,
    namespace = 'v0:treeview',
  } = defineProps<TreeviewActivatorProps>()

  const item = useTreeviewItem(namespace)

  function onKeydown (e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      item.ticket.flip()
    }
  }

  const slotProps = toRef((): TreeviewActivatorSlotProps => ({
    isOpen: toValue(item.ticket.isOpen),
    isLeaf: toValue(item.ticket.isLeaf),
    isDisabled: item.isDisabled.value,
    flip: item.ticket.flip,
    attrs: {
      'role': as === 'button' ? undefined : 'button',
      'tabindex': item.isDisabled.value ? -1 : 0,
      'aria-expanded': toValue(item.ticket.isLeaf) ? undefined : toValue(item.ticket.isOpen),
      'aria-disabled': item.isDisabled.value,
      'data-disabled': item.isDisabled.value || undefined,
      'data-open': toValue(item.ticket.isOpen) || undefined,
      'disabled': as === 'button' ? item.isDisabled.value : undefined,
      'type': as === 'button' ? 'button' : undefined,
      'onClick': item.ticket.flip,
      onKeydown,
    },
  }))
</script>

<template>
  <Atom
    v-bind="slotProps.attrs"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
```

Key: Follows ExpansionPanelActivator exactly — role, tabindex, keyboard handling, disabled attribute for native buttons.

**Step 2: Verify typecheck passes**

Run: `pnpm typecheck`

**Step 3: Commit**

```bash
git add packages/0/src/components/Treeview/TreeviewActivator.vue
git commit -m "feat(Treeview): add TreeviewActivator component"
```

---

### Task 4: TreeviewContent — Collapse Gate

Conditionally renders children based on parent item's open state.

**Files:**
- Create: `packages/0/src/components/Treeview/TreeviewContent.vue`

**Step 1: Write TreeviewContent.vue**

```vue
/**
 * @module TreeviewContent
 *
 * @remarks
 * Collapse gate for tree node children. Conditionally renders default slot
 * based on parent TreeviewItem's isOpen state. Renderless — no DOM output.
 */

<script lang="ts">
  // Components
  import { useTreeviewItem } from './TreeviewItem.vue'

  // Utilities
  import { toValue } from 'vue'

  // Types
  export interface TreeviewContentProps {
    namespace?: string
  }

  export interface TreeviewContentSlotProps {
    isOpen: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'TreeviewContent' })

  defineSlots<{
    default: (props: TreeviewContentSlotProps) => any
  }>()

  const {
    namespace = 'v0:treeview',
  } = defineProps<TreeviewContentProps>()

  const item = useTreeviewItem(namespace)
</script>

<template>
  <slot
    v-if="toValue(item.ticket.isOpen)"
    :is-open="toValue(item.ticket.isOpen)"
  />
</template>
```

Key: Renderless — just v-if on `isOpen`. No Atom wrapper needed.

**Step 2: Verify typecheck passes**

Run: `pnpm typecheck`

**Step 3: Commit**

```bash
git add packages/0/src/components/Treeview/TreeviewContent.vue
git commit -m "feat(Treeview): add TreeviewContent component"
```

---

### Task 5: TreeviewCheckbox — Tri-state Selection

Optional checkbox for tree selection with mixed/indeterminate state.

**Files:**
- Create: `packages/0/src/components/Treeview/TreeviewCheckbox.vue`

**Step 1: Write TreeviewCheckbox.vue**

```vue
/**
 * @module TreeviewCheckbox
 *
 * @remarks
 * Optional tri-state checkbox for treeview selection. Consumes TreeviewItem
 * context. Toggles selection on click. Shows mixed state for partially-selected
 * parent nodes (cascade mode).
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useTreeviewItem } from './TreeviewItem.vue'

  // Utilities
  import { toRef, toValue } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

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
</script>

<script setup lang="ts">
  defineOptions({ name: 'TreeviewCheckbox' })

  defineSlots<{
    default: (props: TreeviewCheckboxSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:treeview',
  } = defineProps<TreeviewCheckboxProps>()

  const item = useTreeviewItem(namespace)

  function onKeydown (e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      item.ticket.toggle()
    }
  }

  const slotProps = toRef((): TreeviewCheckboxSlotProps => ({
    isSelected: toValue(item.ticket.isSelected),
    isMixed: toValue(item.ticket.isMixed),
    isDisabled: item.isDisabled.value,
    toggle: item.ticket.toggle,
    select: item.ticket.select,
    unselect: item.ticket.unselect,
    attrs: {
      'role': 'checkbox',
      'aria-checked': toValue(item.ticket.isMixed) ? 'mixed' : toValue(item.ticket.isSelected),
      'aria-disabled': item.isDisabled.value,
      'tabindex': item.isDisabled.value ? -1 : 0,
      'data-selected': toValue(item.ticket.isSelected) || undefined,
      'data-disabled': item.isDisabled.value || undefined,
      'data-mixed': toValue(item.ticket.isMixed) || undefined,
      'onClick': item.ticket.toggle,
      onKeydown,
    },
  }))
</script>

<template>
  <Atom
    v-bind="slotProps.attrs"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
```

**Step 2: Verify typecheck passes**

Run: `pnpm typecheck`

**Step 3: Commit**

```bash
git add packages/0/src/components/Treeview/TreeviewCheckbox.vue
git commit -m "feat(Treeview): add TreeviewCheckbox component"
```

---

### Task 6: Barrel Exports + Registration

Wire up index.ts and register in the components barrel.

**Files:**
- Create: `packages/0/src/components/Treeview/index.ts`
- Modify: `packages/0/src/components/index.ts`

**Step 1: Write index.ts barrel**

Follow the ExpansionPanel barrel pattern exactly. Named exports for each component + types, then compound object.

```ts
export { provideTreeviewItem, useTreeviewItem } from './TreeviewItem.vue'
export { provideTreeviewRoot, useTreeviewRoot } from './TreeviewRoot.vue'

export { default as TreeviewActivator } from './TreeviewActivator.vue'
export { default as TreeviewCheckbox } from './TreeviewCheckbox.vue'
export { default as TreeviewContent } from './TreeviewContent.vue'
export { default as TreeviewGroup } from './TreeviewGroup.vue'
export { default as TreeviewItem } from './TreeviewItem.vue'
export { default as TreeviewList } from './TreeviewList.vue'
export { default as TreeviewRoot } from './TreeviewRoot.vue'

export type { TreeviewActivatorProps, TreeviewActivatorSlotProps } from './TreeviewActivator.vue'
export type { TreeviewCheckboxProps, TreeviewCheckboxSlotProps } from './TreeviewCheckbox.vue'
export type { TreeviewContentProps, TreeviewContentSlotProps } from './TreeviewContent.vue'
export type { TreeviewGroupProps, TreeviewGroupSlotProps } from './TreeviewGroup.vue'
export type { TreeviewItemContext, TreeviewItemProps, TreeviewItemSlotProps } from './TreeviewItem.vue'
export type { TreeviewListProps, TreeviewListSlotProps } from './TreeviewList.vue'
export type { TreeviewRootProps, TreeviewRootSlotProps } from './TreeviewRoot.vue'

// Components
import Activator from './TreeviewActivator.vue'
import Checkbox from './TreeviewCheckbox.vue'
import Content from './TreeviewContent.vue'
import Group from './TreeviewGroup.vue'
import Item from './TreeviewItem.vue'
import List from './TreeviewList.vue'
import Root from './TreeviewRoot.vue'

/**
 * Treeview component with sub-components for hierarchical data.
 *
 * @see https://0.vuetifyjs.com/components/treeview
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { Treeview } from '@vuetify/v0'
 * </script>
 *
 * <template>
 *   <Treeview.Root>
 *     <Treeview.List>
 *       <Treeview.Item>
 *         <Treeview.Activator>Documents</Treeview.Activator>
 *         <Treeview.Content>
 *           <Treeview.Group>
 *             <Treeview.Item>
 *               <Treeview.Activator>Resume.pdf</Treeview.Activator>
 *             </Treeview.Item>
 *           </Treeview.Group>
 *         </Treeview.Content>
 *       </Treeview.Item>
 *     </Treeview.List>
 *   </Treeview.Root>
 * </template>
 * ```
 */
export const Treeview = { Root, List, Item, Activator, Content, Group, Checkbox }
```

**Step 2: Add to components/index.ts**

Add `export * from './Treeview'` to `packages/0/src/components/index.ts` (alphabetical order — after Step).

**Step 3: Verify full build**

Run: `pnpm typecheck`
Run: `pnpm build:0`

**Step 4: Commit**

```bash
git add packages/0/src/components/Treeview/index.ts packages/0/src/components/index.ts
git commit -m "feat(Treeview): add barrel exports and register component"
```

---

### Task 7: Tests — Core Functionality

Write tests following the Group test pattern. Test rendering, context flow, selection, open/close, and nesting.

**Files:**
- Create: `packages/0/src/components/Treeview/index.test.ts`

**Step 1: Write the test file**

Tests use `@vue/test-utils` mount with render functions. Follow the Group test structure exactly: describe blocks for root, item, integration, SSR.

```ts
import { describe, expect, it } from 'vitest'

import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'

import { Treeview } from './index'

// Helper: mount a basic tree with Root > List > Items
function mountTree (options: {
  props?: Record<string, any>
  items?: Array<{ id?: string, value?: string, children?: Array<{ id?: string, value?: string }> }>
  captureRoot?: (props: any) => void
  captureItems?: (id: string, props: any) => void
} = {}) {
  const items = options.items ?? [
    { id: 'parent', value: 'parent', children: [
      { id: 'child-1', value: 'child-1' },
      { id: 'child-2', value: 'child-2' },
    ] },
  ]

  const rootSlotCapture = options.captureRoot
  const itemCaptures = options.captureItems

  return mount(Treeview.Root as any, {
    props: options.props,
    slots: {
      default: (rootProps: any) => {
        rootSlotCapture?.(rootProps)
        return h(Treeview.List as any, {}, () =>
          items.map(item =>
            h(Treeview.Item as any, { id: item.id, value: item.value }, {
              default: (itemProps: any) => {
                itemCaptures?.(item.id!, itemProps)
                const children = item.children
                  ? [
                      h(Treeview.Activator as any, {}, () => item.id),
                      h(Treeview.Content as any, {}, () =>
                        h(Treeview.Group as any, {}, () =>
                          children.map(child =>
                            h(Treeview.Item as any, { id: child.id, value: child.value }, {
                              default: (childProps: any) => {
                                itemCaptures?.(child.id!, childProps)
                                return h(Treeview.Activator as any, {}, () => child.id)
                              },
                            }),
                          ),
                        ),
                      ),
                    ]
                  : [h(Treeview.Activator as any, {}, () => item.id)]
                return children
              },
            }),
          ),
        )
      },
    },
  })
}

describe('treeview', () => {
  describe('root', () => {
    it('should be renderless by default', () => {
      const wrapper = mount(Treeview.Root as any, {
        slots: { default: () => h('div', { class: 'test' }, 'Content') },
      })
      expect(wrapper.find('.test').exists()).toBe(true)
    })

    it('should expose slot props', () => {
      let slotProps: any
      mount(Treeview.Root as any, {
        slots: {
          default: (props: any) => {
            slotProps = props
            return h('div')
          },
        },
      })
      expect(typeof slotProps.isDisabled).toBe('boolean')
      expect(typeof slotProps.isNoneSelected).toBe('boolean')
      expect(typeof slotProps.isAllSelected).toBe('boolean')
      expect(typeof slotProps.expandAll).toBe('function')
      expect(typeof slotProps.collapseAll).toBe('function')
    })
  })

  describe('item', () => {
    it('should register with nested context', async () => {
      const captured: Record<string, any> = {}
      mountTree({ captureItems: (id, props) => { captured[id] = props } })
      await nextTick()

      expect(captured['parent']).toBeDefined()
      expect(captured['parent'].id).toBe('parent')
    })

    it('should detect leaf nodes', async () => {
      const captured: Record<string, any> = {}
      mountTree({ captureItems: (id, props) => { captured[id] = props } })
      await nextTick()

      expect(captured['parent'].isLeaf).toBe(false)
      expect(captured['child-1'].isLeaf).toBe(true)
    })

    it('should report correct depth', async () => {
      const captured: Record<string, any> = {}
      mountTree({ captureItems: (id, props) => { captured[id] = props } })
      await nextTick()

      expect(captured['parent'].depth).toBe(0)
      expect(captured['child-1'].depth).toBe(1)
    })

    it('should infer parent from context (implicit nesting)', async () => {
      const captured: Record<string, any> = {}
      mountTree({ captureItems: (id, props) => { captured[id] = props } })
      await nextTick()

      // child-1 is a child of parent — depth confirms nesting
      expect(captured['child-1'].depth).toBe(1)
    })
  })

  describe('selection', () => {
    it('should update v-model when items are selected', async () => {
      const selected = ref<string[]>([])
      const captured: Record<string, any> = {}

      mountTree({
        props: {
          'modelValue': selected.value,
          'onUpdate:modelValue': (v: unknown) => { selected.value = v as string[] },
        },
        captureItems: (id, props) => { captured[id] = props },
      })
      await nextTick()

      captured['child-1'].select()
      await nextTick()

      expect(selected.value).toContain('child-1')
    })

    it('should cascade selection from parent to children', async () => {
      const captured: Record<string, any> = {}

      mountTree({
        props: { selection: 'cascade' },
        captureItems: (id, props) => { captured[id] = props },
      })
      await nextTick()

      captured['parent'].select()
      await nextTick()

      expect(captured['parent'].isSelected).toBe(true)
      expect(captured['child-1'].isSelected).toBe(true)
      expect(captured['child-2'].isSelected).toBe(true)
    })

    it('should show mixed state when some children selected', async () => {
      const captured: Record<string, any> = {}

      mountTree({
        props: { selection: 'cascade' },
        captureItems: (id, props) => { captured[id] = props },
      })
      await nextTick()

      captured['child-1'].select()
      await nextTick()

      expect(captured['parent'].isMixed).toBe(true)
      expect(captured['parent'].isSelected).toBe(false)
    })
  })

  describe('open/close', () => {
    it('should toggle open state with flip()', async () => {
      const captured: Record<string, any> = {}
      mountTree({ captureItems: (id, props) => { captured[id] = props } })
      await nextTick()

      expect(captured['parent'].isOpen).toBe(false)

      captured['parent'].flip()
      await nextTick()

      expect(captured['parent'].isOpen).toBe(true)
    })

    it('should open with open() and close with close()', async () => {
      const captured: Record<string, any> = {}
      mountTree({ captureItems: (id, props) => { captured[id] = props } })
      await nextTick()

      captured['parent'].open()
      await nextTick()
      expect(captured['parent'].isOpen).toBe(true)

      captured['parent'].close()
      await nextTick()
      expect(captured['parent'].isOpen).toBe(false)
    })
  })

  describe('list', () => {
    it('should render ul with role="tree"', () => {
      const wrapper = mount(Treeview.Root as any, {
        slots: {
          default: () => h(Treeview.List as any, {}, () => 'Content'),
        },
      })

      const ul = wrapper.find('ul')
      expect(ul.exists()).toBe(true)
      expect(ul.attributes('role')).toBe('tree')
    })
  })

  describe('group', () => {
    it('should render ul with role="group"', () => {
      // Mount Group standalone (no context needed)
      const wrapper = mount(Treeview.Group as any, {
        slots: { default: () => 'Children' },
      })

      const ul = wrapper.find('ul')
      expect(ul.exists()).toBe(true)
      expect(ul.attributes('role')).toBe('group')
    })
  })

  describe('content', () => {
    it('should hide content when item is closed', async () => {
      const wrapper = mountTree()
      await nextTick()

      // Content is hidden by default (items start closed)
      // The child items should not be rendered
      expect(wrapper.text()).not.toContain('child-1')
    })

    it('should show content when item is opened', async () => {
      const captured: Record<string, any> = {}
      const wrapper = mountTree({
        captureItems: (id, props) => { captured[id] = props },
      })
      await nextTick()

      captured['parent'].open()
      await nextTick()

      expect(wrapper.text()).toContain('child-1')
    })
  })

  describe('activator', () => {
    it('should render button by default', async () => {
      const wrapper = mountTree()
      await nextTick()

      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)
    })
  })

  describe('checkbox', () => {
    it('should toggle selection on click', async () => {
      const captured: Record<string, any> = {}

      mount(Treeview.Root as any, {
        slots: {
          default: () => h(Treeview.List as any, {}, () =>
            h(Treeview.Item as any, { id: 'item', value: 'item' }, {
              default: (props: any) => {
                captured['item'] = props
                return h(Treeview.Checkbox as any)
              },
            }),
          ),
        },
      })
      await nextTick()

      const wrapper = document.querySelector('[role="checkbox"]')
      expect(wrapper).toBeTruthy()
    })
  })
})
```

**Step 2: Run the tests**

Run: `pnpm vitest run packages/0/src/components/Treeview/index.test.ts`

Fix any failures. The most likely issues:
1. Optional context injection in TreeviewItem (try/catch might not work with createContext — may need to use Vue's `inject` with default)
2. `nested.multiple` not being exposed (may need separate context)
3. TreeviewContent v-if not working because child items only render inside Content

**Step 3: Fix any issues and re-run tests**

Run: `pnpm vitest run packages/0/src/components/Treeview/index.test.ts`
Expected: All tests pass.

**Step 4: Run full test suite**

Run: `pnpm test:run`
Expected: All 2895+ tests pass (no regressions).

**Step 5: Commit**

```bash
git add packages/0/src/components/Treeview/index.test.ts
git commit -m "feat(Treeview): add component tests"
```

---

### Task 8: Validation — Full Build + Lint + Typecheck

Run the full validation suite to ensure everything is clean.

**Step 1: Run validation**

Run: `pnpm validate`

This runs lint:fix + typecheck + test:run.

**Step 2: Run repo health check**

Run: `pnpm repo:check`

This runs knip (unused exports) + sherif (workspace consistency).

**Step 3: Fix any issues**

Common issues:
- knip may flag unused exports → verify they're needed for the public API
- Lint may want different formatting → auto-fixed by lint:fix

**Step 4: Final commit if needed**

```bash
git add -A
git commit -m "chore(Treeview): fix lint and validation issues"
```
