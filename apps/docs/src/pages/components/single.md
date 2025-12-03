---
title: Single Component
meta:
- name: description
  content: A headless component for managing single-selection with automatic deselection
    of previous items.
- name: keywords
  content: single, single-select, component, Vue, headless, accessibility
features:
  category: Component
  label: 'E: Single'
  github: /components/Single/
---

<script setup>
import BasicExample from '@/examples/components/single/basic.vue'
import BasicExampleRaw from '@/examples/components/single/basic.vue?raw'
</script>

# Single

A headless component for managing single-selection with automatic deselection of previous items.

<DocsPageFeatures :frontmatter />

## Usage

The Single component is a specialization of Selection that enforces single-selection behavior. When an item is selected, any previously selected item is automatically deselected.

<DocsExample file="basic.vue" title="Radio Group Pattern" :code="BasicExampleRaw">
  <BasicExample />
</DocsExample>

## API

| Component | Description |
|---|---|
| [Selection](/components/selection) | Base selection component with single/multi modes |
| [Group](/components/group) | Multi-selection specialization |
| [Step](/components/step) | Adds navigation methods to Single |

| Composable | Description |
|---|---|
| [useSingle](/composables/selection/use-single) | The underlying composable used by Single |

### SingleRoot

The root component that manages single-selection state.

- **Props**

  ```ts
  interface SingleRootProps<T = unknown> {
    namespace?: string
    disabled?: boolean
    enroll?: boolean
    mandatory?: boolean | 'force'
  }
  ```

  - `namespace`: Namespace for dependency injection (default: `'v0:single'`)
  - `disabled`: Disables the entire single instance
  - `enroll`: Auto-select non-disabled items on registration
  - `mandatory`: Controls mandatory selection behavior

- **v-model**

  ```ts
  v-model: T
  ```

  Binds to a single selected value (never an array).

- **Slots**

  ```ts
  interface SingleRootSlots {
    default: (props: {
      disabled: boolean
      select: (id: ID) => void
      unselect: (id: ID) => void
      toggle: (id: ID) => void
      ariaMultiselectable: boolean
    }) => any
  }
  ```

### SingleItem

Individual selectable items that register with the Single context.

- **Props**

  ```ts
  interface SingleItemProps {
    id?: string
    label?: string
    value?: any
    disabled?: MaybeRef<boolean>
    namespace?: string
  }
  ```

- **Slots**

  ```ts
  interface SingleItemSlots {
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
