---
meta:
  title: Step
  description: A headless component for navigation through multi-step processes like wizards and forms.
  keywords: step, wizard, stepper, navigation, component, Vue, headless
features:
  category: Component
  label: 'E: Step'
  github: /components/Step/
---

<script setup>
import BasicExample from '@/examples/components/step/basic.vue'
import BasicExampleRaw from '@/examples/components/step/basic.vue?raw'
</script>

# Step

A headless component for navigation through multi-step processes like wizards and forms.

<DocsPageFeatures :frontmatter />

## Usage

The Step component extends Single with navigation methods for moving through a sequence of items. It provides methods for first, last, next, previous, and step-by-count navigation with automatic wrapping and disabled item skipping.

<DocsExample file="basic.vue" title="Wizard Navigation" :code="BasicExampleRaw">
  <BasicExample />
</DocsExample>

## API

| Component | Description |
|---|---|
| [Selection](/components/selection) | Base selection component |
| [Single](/components/single) | Single-selection that Step extends |

| Composable | Description |
|---|---|
| [useStep](/composables/selection/use-step) | The underlying composable used by Step |

### StepRoot

The root component that manages step navigation state.

- **Props**

  ```ts
  interface StepRootProps<T = unknown> {
    namespace?: string
    disabled?: boolean
    enroll?: boolean
    mandatory?: boolean | 'force'
  }
  ```

- **v-model**

  ```ts
  v-model: T
  ```

- **Slots**

  ```ts
  interface StepRootSlots {
    default: (props: {
      disabled: boolean
      ariaMultiselectable: boolean
      first: () => void
      last: () => void
      next: () => void
      prev: () => void
      step: (count: number) => void
      select: (id: ID) => void
      unselect: (id: ID) => void
      toggle: (id: ID) => void
    }) => any
  }
  ```

### StepItem

Individual step items that register with the Step context.

- **Props**

  ```ts
  interface StepItemProps {
    id?: string
    label?: string
    value?: any
    disabled?: MaybeRef<boolean>
    namespace?: string
  }
  ```

- **Slots**

  ```ts
  interface StepItemSlots {
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
