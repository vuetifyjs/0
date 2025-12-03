---
title: Group Component
meta:
- name: description
  content: A headless component for managing multi-selection with batch operations.
- name: keywords
  content: group, multi-select, component, Vue, headless, accessibility
features:
  category: Component
  label: 'E: Group'
  github: /components/Group/
---

<script setup>
import BasicExample from '@/examples/components/group/basic.vue'
import BasicExampleRaw from '@/examples/components/group/basic.vue?raw'
import SelectAllExample from '@/examples/components/group/select-all.vue'
import SelectAllExampleRaw from '@/examples/components/group/select-all.vue?raw'
</script>

# Group

A headless component for managing multi-selection with batch operations.

<DocsPageFeatures :frontmatter />

## Usage

The Group component is a specialization of Selection that enforces multi-selection behavior and supports batch operations on arrays of IDs. It always uses array-based v-model binding.

<DocsExample file="basic.vue" title="Basic Multi-Selection" :code="BasicExampleRaw">
  <BasicExample />
</DocsExample>

## Select All

The Group component exposes select-all helpers through its slot props for implementing "select all" checkbox patterns:

- **`isNoneSelected`**: True when no items are selected
- **`isAllSelected`**: True when all selectable items are selected
- **`isMixed`**: True when some but not all are selected
- **`selectAll`**: Selects all non-disabled items
- **`unselectAll`**: Unselects all items (respects mandatory option)
- **`toggleAll`**: Toggles between all selected and none selected

<DocsExample file="select-all.vue" title="Select All Pattern" :code="SelectAllExampleRaw">
  <SelectAllExample />
</DocsExample>

## API

| Component | Description |
|---|---|
| [Selection](/components/selection) | Base selection component with single/multi modes |
| [Single](/components/single) | Single-selection specialization |

| Composable | Description |
|---|---|
| [useGroup](/composables/selection/use-group) | The underlying composable used by Group |

### GroupRoot

The root component that manages multi-selection state with batch operations.

- **Props**

  ```ts
  interface GroupRootProps<T = unknown> {
    namespace?: string
    disabled?: boolean
    enroll?: boolean
    mandatory?: boolean | 'force'
  }
  ```

  - `namespace`: Namespace for dependency injection (default: `'v0:group'`)
  - `disabled`: Disables the entire group instance
  - `enroll`: Auto-select non-disabled items on registration
  - `mandatory`: Controls mandatory selection behavior

- **v-model**

  ```ts
  v-model: T[]
  ```

  Always binds to an array of selected values.

- **Slots**

  ```ts
  interface GroupRootSlots {
    default: (props: {
      disabled: boolean
      select: (id: ID | ID[]) => void
      unselect: (id: ID | ID[]) => void
      toggle: (id: ID | ID[]) => void
      ariaMultiselectable: boolean
    }) => any
  }
  ```

### GroupItem

Individual group items that register with the Group context.

- **Props**

  ```ts
  interface GroupItemProps {
    id?: string
    label?: string
    value?: any
    disabled?: MaybeRef<boolean>
    namespace?: string
  }
  ```

- **Slots**

  ```ts
  interface GroupItemSlots {
    default: (props: {
      id: string
      label?: string
      value: any
      isSelected: boolean
      disabled: boolean
      ariaSelected: boolean
      ariaDisabled: boolean
      select: () => void
      unselect: () => void
      toggle: () => void
    }) => any
  }
  ```
