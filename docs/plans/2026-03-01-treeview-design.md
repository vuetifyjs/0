# Treeview Component Design

Component representation of the `createNested` composable. Follows the same pattern as Group/`createGroup`, Single/`createSingle`, etc.

## Approach

**Implicit parent-child via context injection.** TreeviewItem provides its own ID as context. Nested TreeviewItems auto-detect their parent from the nearest ancestor TreeviewItem — no `parentId` prop needed. Template structure _is_ the tree structure.

## Sub-components

| Component | Default `as` | ARIA | Purpose |
|-----------|-------------|------|---------|
| **Root** | renderless | — | Creates `createNested`, provides context, bridges v-model |
| **List** | `<ul>` | `role="tree"` | Top-level list container |
| **Item** | `<li>` | `role="treeitem"` | Tree node, registers with nested context |
| **Activator** | `<button>` | `aria-expanded` | Click-to-toggle, renders children as content |
| **Content** | renderless | — | Collapse gate (v-if on parent item's `isOpen`) |
| **Group** | `<ul>` | `role="group"` | Nested children container |
| **Checkbox** | `<div>` | `role="checkbox"`, `aria-checked` | Optional tri-state selection control |

## Usage

### Minimal — no slot props needed

```vue
<Treeview.Root v-model="selected">
  <Treeview.List>
    <Treeview.Item>
      <Treeview.Activator>Documents</Treeview.Activator>
      <Treeview.Content>
        <Treeview.Group>
          <Treeview.Item>
            <Treeview.Activator>Resume.pdf</Treeview.Activator>
          </Treeview.Item>
          <Treeview.Item>
            <Treeview.Activator>Cover Letter.pdf</Treeview.Activator>
          </Treeview.Item>
        </Treeview.Group>
      </Treeview.Content>
    </Treeview.Item>
  </Treeview.List>
</Treeview.Root>
```

### With selection checkboxes

```vue
<Treeview.Root v-model="selected" selection="cascade">
  <Treeview.List>
    <Treeview.Item>
      <Treeview.Checkbox />
      <Treeview.Activator>Images</Treeview.Activator>
      <Treeview.Content>
        <Treeview.Group>
          <Treeview.Item>
            <Treeview.Checkbox />
            <Treeview.Activator>Photo.jpg</Treeview.Activator>
          </Treeview.Item>
        </Treeview.Group>
      </Treeview.Content>
    </Treeview.Item>
  </Treeview.List>
</Treeview.Root>
```

### Customized via scoped slots

```vue
<Treeview.Item>
  <template #default="{ isOpen, isSelected, depth }">
    <Treeview.Activator>
      <template #default="{ flip }">
        <span :style="{ paddingLeft: `${depth * 16}px` }">
          {{ isOpen ? '▼' : '▶' }} Custom Node
        </span>
      </template>
    </Treeview.Activator>
  </template>
</Treeview.Item>
```

## TreeviewRoot

Creates and provides `createNested` context. Renderless — no DOM output.

### Props

| Prop | Type | Default | Maps to |
|------|------|---------|---------|
| `namespace` | `string` | `'v0:treeview'` | DI key |
| `disabled` | `boolean` | `false` | `createNested({ disabled })` |
| `enroll` | `boolean` | `false` | Auto-select on register |
| `mandatory` | `boolean \| 'force'` | `false` | Prevent deselecting last |
| `multiple` | `boolean` | `true` | Multi-select |
| `open` | `NestedOpenMode` | `'multiple'` | `'single'` \| `'multiple'` |
| `openAll` | `boolean` | `false` | Auto-open parents on register |
| `reveal` | `boolean` | `false` | Open ancestors when opening |
| `selection` | `NestedSelectionMode` | `'cascade'` | cascade / independent / leaf |
| `active` | `NestedActiveMode` | `'single'` | Active/highlight mode |

### v-model

- `v-model` — selection (array of values)
- `v-model:opened` — open state (array of IDs)
- `v-model:active` — active state (array of IDs)

### Slot props

```ts
interface TreeviewRootSlotProps {
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
```

## TreeviewList

Top-level list container. Renders `<ul role="tree">`.

### Props

Extends `AtomProps` (`as`, `renderless`). Default `as = 'ul'`.

| Prop | Type | Default |
|------|------|---------|
| `namespace` | `string` | `'v0:treeview'` |

### Automatic ARIA

```html
<ul role="tree" aria-multiselectable="true|false">
```

## TreeviewItem

Tree node. Registers with nearest `createNested` context. Injects parent ID from nearest ancestor TreeviewItem context (implicit nesting). Provides its own ID as context for descendants.

### Props

Extends `AtomProps`. Default `as = 'li'`.

| Prop | Type | Default |
|------|------|---------|
| `id` | `string` | auto-generated |
| `value` | `V` | — |
| `disabled` | `MaybeRef<boolean>` | `false` |
| `namespace` | `string` | `'v0:treeview'` |

### Context flow

1. Injects parent item context (optional — root items won't have one)
2. Registers: `nested.register({ id, value, disabled, parentId: parent?.id })`
3. Provides own item context `{ id, ticket }` for descendant items

### Automatic ARIA

```html
<li
  role="treeitem"
  aria-expanded="true|false"   <!-- undefined for leaves -->
  aria-selected="true|false"
  aria-disabled="true|false"
  aria-level="1"               <!-- depth + 1 -->
  aria-setsize="3"             <!-- sibling count -->
  aria-posinset="1"            <!-- position among siblings -->
  data-selected
  data-disabled
  data-active
  data-open
>
```

### Slot props

```ts
interface TreeviewItemSlotProps<V> {
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
```

## TreeviewActivator

Click-to-toggle trigger. Consumes TreeviewItem context. Calls `ticket.flip()` on click.

### Props

Extends `AtomProps`. Default `as = 'button'`.

| Prop | Type | Default |
|------|------|---------|
| `namespace` | `string` | `'v0:treeview'` |

### Default rendering

Renders `<button>` with children as content. Click calls `flip()`.

### Automatic ARIA

```html
<button
  aria-expanded="true|false"  <!-- undefined for leaves -->
  tabindex="0"
>
  <!-- default slot content -->
</button>
```

### Slot props

```ts
interface TreeviewActivatorSlotProps {
  isOpen: boolean
  isLeaf: boolean
  isDisabled: boolean
  flip: () => void
}
```

## TreeviewContent

Collapse gate. Conditionally renders children based on parent item's `isOpen` state. Renderless — no DOM output, just v-if logic.

### Props

| Prop | Type | Default |
|------|------|---------|
| `namespace` | `string` | `'v0:treeview'` |

### Behavior

Renders default slot only when parent TreeviewItem's `isOpen` is true.

### Slot props

```ts
interface TreeviewContentSlotProps {
  isOpen: boolean
}
```

## TreeviewGroup

Nested children container. Renders `<ul role="group">`.

### Props

Extends `AtomProps`. Default `as = 'ul'`.

| Prop | Type | Default |
|------|------|---------|
| `namespace` | `string` | `'v0:treeview'` |

### Automatic ARIA

```html
<ul role="group">
```

## TreeviewCheckbox

Optional tri-state checkbox for selection. Consumes TreeviewItem context. Calls `ticket.toggle()` on click. Shows mixed state for partially-selected parents.

### Props

Extends `AtomProps`. Default `as = 'div'`.

| Prop | Type | Default |
|------|------|---------|
| `namespace` | `string` | `'v0:treeview'` |

### Automatic ARIA

```html
<div
  role="checkbox"
  aria-checked="true|false|mixed"
  aria-disabled="true|false"
  tabindex="0"
  data-selected
  data-disabled
  data-mixed
>
```

### Slot props

```ts
interface TreeviewCheckboxSlotProps {
  isSelected: boolean
  isMixed: boolean
  isDisabled: boolean
  toggle: () => void
  select: () => void
  unselect: () => void
}
```

## Context Architecture

```
TreeviewRoot
  └─ provides: NestedContext (namespace: 'v0:treeview')
  └─ provides: TreeviewRootContext { multiple }

TreeviewList
  └─ consumes: NestedContext (for aria-multiselectable)

TreeviewItem
  └─ consumes: NestedContext (to register)
  └─ consumes: TreeviewItemContext (optional — from parent item, for parentId)
  └─ provides: TreeviewItemContext { id, ticket }

TreeviewActivator
  └─ consumes: TreeviewItemContext (for ticket.flip, isOpen, isLeaf)

TreeviewContent
  └─ consumes: TreeviewItemContext (for ticket.isOpen)

TreeviewGroup
  └─ (no context consumed beyond Atom)

TreeviewCheckbox
  └─ consumes: TreeviewItemContext (for ticket selection state)
```

## File Structure

```
packages/0/src/components/Treeview/
├── index.ts
├── TreeviewRoot.vue
├── TreeviewList.vue
├── TreeviewItem.vue
├── TreeviewActivator.vue
├── TreeviewContent.vue
├── TreeviewGroup.vue
└── TreeviewCheckbox.vue
```

## Barrel Exports (index.ts)

```ts
export { default as TreeviewRoot } from './TreeviewRoot.vue'
export { default as TreeviewList } from './TreeviewList.vue'
export { default as TreeviewItem } from './TreeviewItem.vue'
export { default as TreeviewActivator } from './TreeviewActivator.vue'
export { default as TreeviewContent } from './TreeviewContent.vue'
export { default as TreeviewGroup } from './TreeviewGroup.vue'
export { default as TreeviewCheckbox } from './TreeviewCheckbox.vue'

// Type exports
export type { TreeviewRootProps, TreeviewRootSlotProps } from './TreeviewRoot.vue'
export type { TreeviewListProps } from './TreeviewList.vue'
export type { TreeviewItemProps, TreeviewItemSlotProps } from './TreeviewItem.vue'
export type { TreeviewActivatorProps, TreeviewActivatorSlotProps } from './TreeviewActivator.vue'
export type { TreeviewContentSlotProps } from './TreeviewContent.vue'
export type { TreeviewGroupProps } from './TreeviewGroup.vue'
export type { TreeviewCheckboxProps, TreeviewCheckboxSlotProps } from './TreeviewCheckbox.vue'

// Compound export
import Root from './TreeviewRoot.vue'
import List from './TreeviewList.vue'
import Item from './TreeviewItem.vue'
import Activator from './TreeviewActivator.vue'
import Content from './TreeviewContent.vue'
import Group from './TreeviewGroup.vue'
import Checkbox from './TreeviewCheckbox.vue'

export const Treeview = { Root, List, Item, Activator, Content, Group, Checkbox }
```
