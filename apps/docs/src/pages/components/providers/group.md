---
title: Group - Checkbox Group with Tri-State Support
meta:
- name: description
  content: Create checkbox groups with tri-state and indeterminate support. Multi-selection with batch operations, select-all patterns, and array-based v-model binding.
- name: keywords
  content: group, checkbox, multi-select, tri-state, indeterminate, select all, Vue 3, headless
features:
  category: Component
  label: 'E: Group'
  github: /components/Group/
  renderless: true
related:
  - /composables/selection/use-group
  - /components/providers/selection
---

<script setup>
import BasicExample from '@/examples/components/group/basic.vue'
import BasicExampleRaw from '@/examples/components/group/basic.vue?raw'
import SelectAllExample from '@/examples/components/group/select-all.vue'
import SelectAllExampleRaw from '@/examples/components/group/select-all.vue?raw'
</script>

# Group

A headless component for managing multi-selection with batch operations and tri-state support.

<DocsPageFeatures :frontmatter />

## Usage

The Group component is a specialization of Selection that enforces multi-selection behavior and supports batch operations on arrays of IDs. It always uses array-based v-model binding.

<DocsExample file="basic.vue" title="Basic Multi-Selection" :code="BasicExampleRaw">
  <BasicExample />
</DocsExample>

## Anatomy

```vue Anatomy
<script setup lang="ts">
  import { Group } from '@vuetify/v0'
</script>

<template>
  <Group.Root v-model="selected" v-slot="{ attrs }">
    <div v-bind="attrs">
      <Group.Item value="apple" v-slot="{ attrs }">
        <button v-bind="attrs">Apple</button>
      </Group.Item>

      <Group.Item value="banana" v-slot="{ attrs }">
        <button v-bind="attrs">Banana</button>
      </Group.Item>
    </div>
  </Group.Root>
</template>
```

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
  interface GroupRootProps {
    namespace?: string
    disabled?: boolean
    enroll?: boolean
    mandatory?: boolean | 'force'
  }
  ```

  - `namespace`: Namespace for dependency injection (default: `'v0:group'`)
  - `disabled`: Disables the entire group instance
  - `enroll`: Auto-select non-disabled items on registration
  - `mandatory`: Controls mandatory group behavior:
    - `false` (default): No mandatory group enforcement
    - `true`: Prevents deselecting the last selected item
    - `'force'`: Automatically selects the first non-disabled item on registration

- **v-model**

  ```ts
  v-model: T[]
  ```

  Always binds to an array of selected values.

- **Events**

  | Event | Payload | Description |
  |---|---|---|
  | `update:model-value` | `T[]` | Emitted when the selection changes |

- **Slot Props**

  ```ts
  interface GroupRootSlotProps {
    isDisabled: boolean
    isNoneSelected: boolean
    isAllSelected: boolean
    isMixed: boolean
    select: (id: ID | ID[]) => void
    unselect: (id: ID | ID[]) => void
    toggle: (id: ID | ID[]) => void
    selectAll: () => void
    unselectAll: () => void
    toggleAll: () => void
    attrs: {
      'aria-multiselectable': true
    }
  }
  ```

  - `isDisabled`: Whether the group instance is disabled
  - `isNoneSelected`: Whether no items are currently selected
  - `isAllSelected`: Whether all selectable (non-disabled) items are selected
  - `isMixed`: Whether some but not all selectable items are selected
  - `select`: Select item(s) by ID
  - `unselect`: Unselect item(s) by ID
  - `toggle`: Toggle item(s) selection state by ID
  - `selectAll`: Select all selectable (non-disabled) items
  - `unselectAll`: Unselect all items (respects mandatory option)
  - `toggleAll`: Toggle between all selected and none selected
  - `attrs`: Object containing attributes to bind to the root element

- **Example**

  ```vue GroupRoot
  <script setup lang="ts">
    import { Group } from '@vuetify/v0'
  </script>

  <template>
    <Group.Root v-model="selected" v-slot="{ attrs, toggleAll, isMixed, isAllSelected }">
      <div v-bind="attrs">
        <!-- Select all checkbox -->
        <button @click="toggleAll">
          {{ isAllSelected ? '☑' : isMixed ? '☐' : '☐' }} Select All
        </button>

        <!-- GroupItem components -->
      </div>
    </Group.Root>
  </template>
  ```

### GroupItem

Individual group items that register with the Group context. Supports tri-state (selected, unselected, mixed) for checkbox-like behavior.

- **Props**

  ```ts
  interface GroupItemProps<V = unknown> {
    id?: string
    label?: string
    value?: V
    disabled?: MaybeRef<boolean>
    indeterminate?: MaybeRef<boolean>
    namespace?: string
  }
  ```

  - `id`: Unique identifier (auto-generated if not provided)
  - `label`: Optional display label (passed through to slot, not used in registration)
  - `value`: Value associated with this item
  - `disabled`: Disables this specific item
  - `indeterminate`: Sets the indeterminate state (for checkboxes)
  - `namespace`: Namespace for dependency injection (default: `'v0:group'`)

- **Slot Props**

  ```ts
  interface GroupItemSlotProps<V = unknown> {
    id: string
    label?: string
    value: V | undefined
    isSelected: boolean
    isMixed: boolean
    isDisabled: boolean
    select: () => void
    unselect: () => void
    toggle: () => void
    mix: () => void
    unmix: () => void
    attrs: {
      'aria-selected': boolean
      'aria-disabled': boolean
      'data-selected': true | undefined
      'data-disabled': true | undefined
      'data-mixed': true | undefined
    }
  }
  ```

  - `id`: Unique identifier for this item
  - `label`: Optional display label
  - `value`: Value associated with this item
  - `isSelected`: Whether this item is currently selected
  - `isMixed`: Whether this item is in a mixed/indeterminate state
  - `isDisabled`: Whether this item is disabled
  - `select`: Select this item
  - `unselect`: Unselect this item
  - `toggle`: Toggle this item's group state
  - `mix`: Set this item to mixed/indeterminate state
  - `unmix`: Clear mixed/indeterminate state from this item
  - `attrs`: Object containing all bindable attributes including ARIA and data attributes

- **Data Attributes**

  | Attribute | Description |
  |---|---|
  | `data-selected` | Present when this item is selected |
  | `data-disabled` | Present when this item is disabled |
  | `data-mixed` | Present when this item is in mixed/indeterminate state |

- **Accessibility**

  - `aria-selected` reflects selection state
  - `aria-disabled` indicates disabled state

- **Example**

  ```vue GroupItem
  <script setup lang="ts">
    import { Group } from '@vuetify/v0'
  </script>

  <template>
    <!-- Simple usage with attrs spread -->
    <Group.Item value="apple" v-slot="{ attrs }">
      <button v-bind="attrs">Apple</button>
    </Group.Item>

    <!-- With slot props for conditional styling -->
    <Group.Item value="banana" v-slot="{ isSelected, toggle }">
      <button @click="toggle" :class="{ 'bg-blue-500': isSelected }">
        Banana {{ isSelected ? '✓' : '' }}
      </button>
    </Group.Item>

    <!-- With tri-state support -->
    <Group.Item value="orange" v-slot="{ isSelected, isMixed, toggle }">
      <button @click="toggle">
        {{ isSelected ? '☑' : isMixed ? '☐' : '☐' }} Orange
      </button>
    </Group.Item>

    <!-- With data attributes for styling -->
    <Group.Item
      value="grape"
      class="data-[selected]:bg-blue-500 data-[disabled]:opacity-50 data-[mixed]:bg-gray-300"
      v-slot="{ attrs }"
    >
      <button v-bind="attrs">Grape</button>
    </Group.Item>
  </template>
  ```

