---
title: Step - Wizard and Stepper Navigation for Vue 3
meta:
- name: description
  content: Navigate multi-step processes with first, last, next, and prev methods. Build form wizards and steppers with automatic disabled item skipping for Vue 3.
- name: keywords
  content: step, wizard, stepper, multi-step form, navigation, carousel, Vue 3, headless
features:
  category: Component
  label: 'E: Step'
  github: /components/Step/
  renderless: true
related:
  - /composables/selection/use-step
  - /components/providers/single
---

<script setup>
import BasicExample from '@/examples/components/step/basic.vue'
import BasicExampleRaw from '@/examples/components/step/basic.vue?raw'
</script>

# Step

A headless component for navigation through multi-step processes like wizards and forms.

<DocsPageFeatures :frontmatter />

## Usage

The Step component extends Single with navigation methods for moving through a sequence of items. It provides methods for first, last, next, previous, and step-by-count navigation with automatic disabled item skipping.

<DocsExample file="basic.vue" title="Wizard Navigation" :code="BasicExampleRaw">
  <BasicExample />
</DocsExample>

## Anatomy

```vue Anatomy
<script setup lang="ts">
  import { Step } from '@vuetify/v0'
</script>

<template>
  <Step.Root v-model="currentStep" v-slot="{ prev, next, attrs }">
    <div v-bind="attrs">
      <Step.Item value="step-1" v-slot="{ isSelected, attrs }">
        <div v-bind="attrs" v-show="isSelected">
          Step 1 Content
        </div>
      </Step.Item>

      <Step.Item value="step-2" v-slot="{ isSelected, attrs }">
        <div v-bind="attrs" v-show="isSelected">
          Step 2 Content
        </div>
      </Step.Item>

      <button @click="prev">Previous</button>
      <button @click="next">Next</button>
    </div>
  </Step.Root>
</template>
```

## API

| Component | Description |
|---|---|
| [Selection](/components/selection) | Base selection component |
| [Single](/components/single) | Single-selection that Step extends |

| Composable | Description |
|---|---|
| [useStep](/composables/selection/use-step) | The underlying composable used by Step |

### Step.Root

The root component that manages step navigation state.

- **Props**

  ```ts
  interface StepRootProps {
    namespace?: string
    disabled?: boolean
    enroll?: boolean
    mandatory?: boolean | 'force'
  }
  ```

  - `namespace`: Namespace for dependency injection (default: `'v0:step'`)
  - `disabled`: Disables the entire step instance
  - `enroll`: Auto-select non-disabled items on registration
  - `mandatory`: Controls mandatory step behavior:
    - `false` (default): No mandatory step enforcement
    - `true`: Prevents deselecting the last selected item
    - `'force'`: Automatically selects the first non-disabled item on registration

- **v-model**

  ```ts
  v-model: T
  ```

  Binds to the currently selected step value.

- **Events**

  | Event | Payload | Description |
  |---|---|---|
  | `update:model-value` | `T` | Emitted when the current step changes |

- **Slot Props**

  ```ts
  interface StepRootSlotProps {
    isDisabled: boolean
    first: () => void
    last: () => void
    next: () => void
    prev: () => void
    step: (count: number) => void
    select: (id: ID) => void
    unselect: (id: ID) => void
    toggle: (id: ID) => void
    attrs: {
      'aria-multiselectable': false
    }
  }
  ```

  - `isDisabled`: Whether the step instance is disabled
  - `first`: Select the first item
  - `last`: Select the last item
  - `next`: Select the next item
  - `prev`: Select the previous item
  - `step`: Step forward or backward by a specific count
  - `select`: Select an item by ID
  - `unselect`: Unselect an item by ID
  - `toggle`: Toggle an item's step state by ID
  - `attrs`: Object containing attributes to bind to the root element

- **Example**

  ```vue Step.Root
  <script setup lang="ts">
    import { Step } from '@vuetify/v0'
  </script>

  <template>
    <Step.Root v-model="currentStep" v-slot="{ attrs, prev, next, first, last }">
      <div v-bind="attrs">
        <!-- Navigation buttons -->
        <button @click="first">First</button>
        <button @click="prev">Previous</button>
        <button @click="next">Next</button>
        <button @click="last">Last</button>

        <!-- Step.Item components -->
      </div>
    </Step.Root>
  </template>
  ```

### Step.Item

Individual step items that register with the Step context.

- **Props**

  ```ts
  interface StepItemProps<V = unknown> {
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
  - `namespace`: Namespace for dependency injection (default: `'v0:step'`)

- **Slot Props**

  ```ts
  interface StepItemSlotProps<V = unknown> {
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
  - `toggle`: Toggle this item's step state
  - `attrs`: Object containing all bindable attributes including ARIA and data attributes

- **Data Attributes**

  | Attribute | Description |
  |---|---|
  | `data-selected` | Present when this step is selected |
  | `data-disabled` | Present when this step is disabled |

- **Accessibility**

  - `aria-selected` reflects selection state
  - `aria-disabled` indicates disabled state

- **Example**

  ```vue Step.Item
  <script setup lang="ts">
    import { Step } from '@vuetify/v0'
  </script>

  <template>
    <!-- Step indicator with attrs spread -->
    <Step.Item value="step-1" v-slot="{ attrs, isSelected }">
      <div v-bind="attrs" :class="{ 'bg-blue-500': isSelected }">
        Step 1
      </div>
    </Step.Item>

    <!-- Step content with conditional rendering -->
    <Step.Item value="step-2" v-slot="{ isSelected }">
      <div v-show="isSelected">
        Step 2 Content
      </div>
    </Step.Item>

    <!-- With data attributes for styling -->
    <Step.Item
      value="step-3"
      class="data-[selected]:bg-blue-500 data-[disabled]:opacity-50"
      v-slot="{ attrs }"
    >
      <div v-bind="attrs">Step 3</div>
    </Step.Item>
  </template>
  ```

## Navigation

The Step component provides several navigation methods:

| Method | Description |
|---|---|
| `first()` | Go to the first non-disabled item |
| `last()` | Go to the last non-disabled item |
| `next()` | Go to the next non-disabled item |
| `prev()` | Go to the previous non-disabled item |
| `step(count)` | Step forward (positive) or backward (negative) by count |

All navigation methods automatically skip disabled items.

