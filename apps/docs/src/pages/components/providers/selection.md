---
title: Selection - Headless Selection State for Vue 3
meta:
  - name: description
    content: Manage selection state in Vue 3 collections. Build checkboxes, radio groups, and listboxes with full v-model support, mandatory selection, and item enrollment.
  - name: keywords
    content: selection, checkbox, radio group, listbox, Vue 3, headless, v-model, state management
features:
  category: Component
  label: 'E: Selection'
  github: /components/Selection/
---

<script setup>
import BasicExample from '@/examples/components/selection/basic.vue'
import BasicExampleRaw from '@/examples/components/selection/basic.vue?raw'
import SingleExample from '@/examples/components/selection/single.vue'
import SingleExampleRaw from '@/examples/components/selection/single.vue?raw'
import MandatoryExample from '@/examples/components/selection/mandatory.vue'
import MandatoryExampleRaw from '@/examples/components/selection/mandatory.vue?raw'
import DisabledExample from '@/examples/components/selection/disabled.vue'
import DisabledExampleRaw from '@/examples/components/selection/disabled.vue?raw'
</script>

# Selection

A headless component for managing selection state in collections with support for single and multi-selection patterns.

<DocsPageFeatures :frontmatter />

## Usage

The Selection component provides a wrapper and item pattern for managing selection state in collections. It uses the `useSelection` composable internally and provides full v-model support with automatic state synchronization.

<DocsExample file="basic.vue" title="Multi-selection" :code="BasicExampleRaw">
  <BasicExample />
</DocsExample>

## Anatomy

```vue Anatomy
<script lang="ts" setup>
  import { Selection } from '@vuetify/v0'
</script>

<template>
  <Selection.Root v-model="selected" v-slot="{ attrs }">
    <div v-bind="attrs">
      <Selection.Item value="apple" v-slot="{ attrs }">
        <button v-bind="attrs">Apple</button>
      </Selection.Item>

      <Selection.Item value="banana" v-slot="{ attrs }">
        <button v-bind="attrs">Banana</button>
      </Selection.Item>
    </div>
  </Selection.Root>
</template>
```

## API

| Component | Description |
|---|---|
| [Group](/components/group) | Multi-selection specialization with batch operations |
| [Single](/components/single) | Single-selection specialization |
| [Step](/components/step) | Navigation through items based on Single |

| Composable | Description |
|---|---|
| [useSelection](/composables/selection/use-selection) | The underlying composable used by Selection |

### SelectionRoot

The root component that manages selection state and provides context to items.

- **Props**

  ```ts
  interface SelectionRootProps {
    namespace?: string
    disabled?: boolean
    enroll?: boolean
    mandatory?: boolean | 'force'
    multiple?: boolean
  }
  ```

  - `namespace`: Namespace for dependency injection (default: `'v0:selection'`)
  - `disabled`: Disables the entire selection instance
  - `enroll`: Auto-select non-disabled items on registration
  - `mandatory`: Controls mandatory selection behavior:
    - `false` (default): No mandatory selection enforcement
    - `true`: Prevents deselecting the last selected item
    - `'force'`: Automatically selects the first non-disabled item on registration
  - `multiple`: Enable multi-selection mode (array v-model)

- **v-model**

  ```ts
  v-model: T | T[]
  ```

  Binds to selected value(s). When `multiple` is true, expects an array.

- **Events**

  | Event | Payload | Description |
  |---|---|---|
  | `update:model-value` | `T \| T[]` | Emitted when the selection changes |

- **Slot Props**

  ```ts
  interface SelectionRootSlotProps {
    isDisabled: boolean
    multiple: boolean
    select: (id: ID) => void
    unselect: (id: ID) => void
    toggle: (id: ID) => void
    attrs: {
      'aria-multiselectable': boolean
    }
  }
  ```

  - `isDisabled`: Whether the selection instance is disabled
  - `multiple`: Whether multi-selection mode is enabled
  - `select`: Select an item by ID
  - `unselect`: Unselect an item by ID
  - `toggle`: Toggle an item's selection state by ID
  - `attrs`: Object containing attributes to bind to the root element

- **Example**

  ```vue SelectionRoot
  <script lang="ts" setup>
    import { Selection } from '@vuetify/v0'
  </script>

  <template>
    <!-- Simple usage with attrs -->
    <Selection.Root v-model="selected" v-slot="{ attrs }">
      <div v-bind="attrs">
        <!-- SelectionItem components -->
      </div>
    </Selection.Root>

    <!-- With slot props for conditional rendering -->
    <Selection.Root v-model="selected" v-slot="{ isDisabled, multiple }">
      <div :class="{ 'opacity-50': isDisabled }">
        <p v-if="multiple">Select multiple items</p>
        <!-- SelectionItem components -->
      </div>
    </Selection.Root>
  </template>
  ```

### SelectionItem

Individual selectable items that register with the Selection context.

- **Props**

  ```ts
  interface SelectionItemProps<V = unknown> {
    id?: string
    label?: string
    value?: V
    disabled?: MaybeRef<boolean>
    namespace?: string
  }
  ```

  - `id`: Unique identifier (auto-generated if not provided)
  - `label`: Optional display label (passed through to slot, not used in registration)
  - `value`: Value associated with this item
  - `disabled`: Disables this specific item
  - `namespace`: Namespace for dependency injection (default: `'v0:selection'`)

- **Slot Props**

  ```ts
  interface SelectionItemSlotProps<V = unknown> {
    id: string
    label?: string
    value: V | undefined
    isSelected: boolean
    isDisabled: boolean
    select: () => void
    unselect: () => void
    toggle: () => void
    attrs: {
      'aria-selected': boolean
      'aria-disabled': boolean
      'data-selected': true | undefined
      'data-disabled': true | undefined
    }
  }
  ```

  - `id`: Unique identifier for this item
  - `label`: Optional display label
  - `value`: Value associated with this item
  - `isSelected`: Whether this item is currently selected
  - `isDisabled`: Whether this item is disabled
  - `select`: Select this item
  - `unselect`: Unselect this item
  - `toggle`: Toggle this item's selection state
  - `attrs`: Object containing all bindable attributes including ARIA and data attributes

- **Data Attributes**

  | Attribute | Description |
  |---|---|
  | `data-selected` | Present when this item is selected |
  | `data-disabled` | Present when this item is disabled |

- **Accessibility**

  - `aria-selected` reflects selection state
  - `aria-disabled` indicates disabled state

- **Example**

  ```vue SelectionItem
  <script lang="ts" setup>
    import { Selection } from '@vuetify/v0'
  </script>

  <template>
    <!-- Simple usage with attrs spread -->
    <Selection.Item value="apple" v-slot="{ attrs }">
      <button v-bind="attrs">Apple</button>
    </Selection.Item>

    <!-- With slot props for conditional styling -->
    <Selection.Item value="banana" v-slot="{ isSelected, toggle }">
      <button @click="toggle" :class="{ 'bg-blue-500': isSelected }">
        Banana {{ isSelected ? '✓' : '' }}
      </button>
    </Selection.Item>

    <!-- With data attributes for styling -->
    <Selection.Item
      value="orange"
      class="data-[selected]:bg-blue-500 data-[disabled]:opacity-50"
      v-slot="{ attrs }"
    >
      <button v-bind="attrs">Orange</button>
    </Selection.Item>
  </template>
  ```

## Examples

### Single Selection

<DocsExample file="single.vue" :code="SingleExampleRaw">
  <SingleExample />
</DocsExample>

### Mandatory Selection

<DocsExample file="mandatory.vue" :code="MandatoryExampleRaw">
  <MandatoryExample />
</DocsExample>

### Disabled Items

<DocsExample file="disabled.vue" :code="DisabledExampleRaw">
  <DisabledExample />
</DocsExample>
