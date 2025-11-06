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

The Step component extends Single with navigation methods for moving through a sequence of items. It provides methods for first, last, next, previous, and step-by-count navigation with configurable circular (wrapping) or bounded (stopping at edges) behavior and automatic disabled item skipping.

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
    circular?: boolean
  }
  ```

  - `namespace`: Namespace for dependency injection (default: `'v0:step'`)
  - `disabled`: Disables the entire step instance
  - `enroll`: Auto-select non-disabled items on registration
  - `mandatory`: Controls mandatory selection behavior:
    - `false` (default): No mandatory selection
    - `true`: Prevents deselecting the last selected item
    - `'force'`: Automatically selects the first non-disabled item
  - `circular`: Enable circular navigation (default: `false`)
    - `false`: Navigation stops at boundaries (bounded mode)
    - `true`: Navigation wraps around at boundaries (carousel mode)

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

## Navigation Modes

The Step component supports two navigation modes via the `circular` prop:

### Bounded Navigation (`circular: false`, default)

Navigation stops at boundaries - ideal for wizards, forms, and linear processes:
- `next()` on the last item does nothing
- `prev()` on the first item does nothing
- `step(5)` beyond the last item does nothing

```vue
<Step.Root v-model="currentStep" :circular="false">
  <!-- Wizard-style navigation -->
</Step.Root>
```

### Circular Navigation (`circular: true`)

Navigation wraps around at boundaries - ideal for carousels, theme switchers, slideshows:
- `next()` on the last item goes to the first item
- `prev()` on the first item goes to the last item
- `step(5)` wraps around using modulo arithmetic

```vue
<Step.Root v-model="currentSlide" :circular="true">
  <!-- Carousel-style navigation -->
</Step.Root>
```

## Components

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
