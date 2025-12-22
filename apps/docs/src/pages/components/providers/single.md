---
title: Single - Radio Group Pattern for Vue 3
meta:
- name: description
  content: Build radio buttons and single-selection UIs with automatic deselection. Extends Selection composable for tabs, toggles, and exclusive choice patterns in Vue 3.
- name: keywords
  content: single, radio button, single-select, tabs, toggle, Vue 3, headless, exclusive selection
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

## Anatomy

```vue Anatomy
<script setup lang="ts">
  import { Single } from '@vuetify/v0'
</script>

<template>
  <Single.Root v-model="selected" v-slot="{ attrs }">
    <div v-bind="attrs">
      <Single.Item value="option-1" v-slot="{ attrs }">
        <button v-bind="attrs">Option 1</button>
      </Single.Item>

      <Single.Item value="option-2" v-slot="{ attrs }">
        <button v-bind="attrs">Option 2</button>
      </Single.Item>
    </div>
  </Single.Root>
</template>
```

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
  interface SingleRootProps {
    namespace?: string
    disabled?: boolean
    enroll?: boolean
    mandatory?: boolean | 'force'
  }
  ```

  - `namespace`: Namespace for dependency injection (default: `'v0:single'`)
  - `disabled`: Disables the entire single instance
  - `enroll`: Auto-select non-disabled items on registration
  - `mandatory`: Controls mandatory single behavior:
    - `false` (default): No mandatory single enforcement
    - `true`: Prevents deselecting the last selected item
    - `'force'`: Automatically selects the first non-disabled item on registration

- **v-model**

  ```ts
  v-model: T
  ```

  Binds to a single selected value (never an array).

- **Events**

  | Event | Payload | Description |
  |---|---|---|
  | `update:model-value` | `T` | Emitted when the selection changes |

- **Slot Props**

  ```ts
  interface SingleRootSlotProps {
    isDisabled: boolean
    select: (id: ID) => void
    unselect: (id: ID) => void
    toggle: (id: ID) => void
    attrs: {
      'aria-multiselectable': false
    }
  }
  ```

  - `isDisabled`: Whether the single instance is disabled
  - `select`: Select an item by ID
  - `unselect`: Unselect an item by ID
  - `toggle`: Toggle an item's single state by ID
  - `attrs`: Object containing attributes to bind to the root element

- **Example**

  ```vue SingleRoot
  <script setup lang="ts">
    import { Single } from '@vuetify/v0'
  </script>

  <template>
    <Single.Root v-model="selected" v-slot="{ attrs, isDisabled }">
      <div v-bind="attrs" :class="{ 'opacity-50': isDisabled }">
        <!-- SingleItem components -->
      </div>
    </Single.Root>
  </template>
  ```

### SingleItem

Individual selectable items that register with the Single context.

- **Props**

  ```ts
  interface SingleItemProps<V = unknown> {
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
  - `namespace`: Namespace for dependency injection (default: `'v0:single'`)

- **Slot Props**

  ```ts
  interface SingleItemSlotProps<V = unknown> {
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
  - `toggle`: Toggle this item's single state
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

  ```vue SingleItem
  <script setup lang="ts">
    import { Single } from '@vuetify/v0'
  </script>

  <template>
    <!-- Simple usage with attrs spread -->
    <Single.Item value="option-1" v-slot="{ attrs }">
      <button v-bind="attrs">Option 1</button>
    </Single.Item>

    <!-- With slot props for conditional styling -->
    <Single.Item value="option-2" v-slot="{ isSelected, toggle }">
      <button @click="toggle" :class="{ 'bg-blue-500': isSelected }">
        Option 2 {{ isSelected ? '✓' : '' }}
      </button>
    </Single.Item>

    <!-- With data attributes for styling -->
    <Single.Item
      value="option-3"
      class="data-[selected]:bg-blue-500 data-[disabled]:opacity-50"
      v-slot="{ attrs }"
    >
      <button v-bind="attrs">Option 3</button>
    </Single.Item>
  </template>
  ```
