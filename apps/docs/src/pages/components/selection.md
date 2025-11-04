---
meta:
  title: Selection
  description: A headless component for managing selection state in collections with support for single and multi-selection patterns.
  keywords: selection, component, Vue, headless, accessibility
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
  interface SelectionRootProps<T = unknown> {
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
    - `false` (default): No mandatory selection
    - `true`: Prevents deselecting the last selected item
    - `'force'`: Automatically selects the first non-disabled item
  - `multiple`: Enable multi-selection mode (array v-model)

- **v-model**

  ```ts
  v-model: T | T[]
  ```

  Binds to selected value(s). When `multiple` is true, expects an array.

- **Slots**

  ```ts
  interface SelectionRootSlots {
    default: (props: {
      disabled: boolean
      multiple: boolean
      select: (id: ID) => void
      unselect: (id: ID) => void
      toggle: (id: ID) => void
      ariaMultiselectable: boolean
    }) => any
  }
  ```

- **Example**

  ```vue
  <SelectionRoot v-model="selected" mandatory="force">
    <template #default="{ ariaMultiselectable }">
      <div :aria-multiselectable="ariaMultiselectable">
        <!-- SelectionItem components -->
      </div>
    </template>
  </SelectionRoot>
  ```

### SelectionItem

Individual selectable items that register with the Selection context.

- **Props**

  ```ts
  interface SelectionItemProps {
    id?: string
    label?: string
    value?: any
    disabled?: MaybeRef<boolean>
    namespace?: string
  }
  ```

  - `id`: Unique identifier (auto-generated if not provided)
  - `label`: Optional display label (passed to slot, not used in registration)
  - `value`: Value associated with this item
  - `disabled`: Disables this specific item
  - `namespace`: Must match SelectionRoot namespace (default: `'v0:selection'`)

- **Slots**

  ```ts
  interface SelectionItemSlots {
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

- **Example**

  ```vue
  <SelectionItem value="apple" :disabled="false">
    <template #default="{ isSelected, toggle, ariaSelected }">
      <button @click="toggle" :aria-selected="ariaSelected">
        Apple {{ isSelected ? '✓' : '' }}
      </button>
    </template>
  </SelectionItem>
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
