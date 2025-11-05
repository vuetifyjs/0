---
meta:
  title: ExpansionPanel
  description: A headless component for creating accordion-style expansion panels with proper ARIA support.
  keywords: expansion panel, accordion, component, Vue, headless, accessibility
features:
  category: Component
  label: 'E: ExpansionPanel'
  github: /components/ExpansionPanel/
---

<script setup>
import BasicExample from '@/examples/components/expansion-panel/basic.vue'
import BasicExampleRaw from '@/examples/components/expansion-panel/basic.vue?raw'
</script>

# ExpansionPanel

A headless component for creating accordion-style expansion panels with proper ARIA support.

<DocsPageFeatures :frontmatter />

## Usage

The ExpansionPanel component provides a wrapper and item pattern for managing expansion state in accordion-style interfaces. It uses the `useSelection` composable internally and provides full v-model support with automatic state synchronization.

<DocsExample file="basic.vue" title="Basic Expansion Panel" :code="BasicExampleRaw">
  <BasicExample />
</DocsExample>

## API

| Composable | Description |
|---|---|
| [useSelection](/composables/selection/use-selection) | The underlying composable used by ExpansionPanel |

### ExpansionPanelRoot

The root component that manages expansion state and provides context to items.

- **Props**

  ```ts
  interface ExpansionPanelRootProps<T = unknown> {
    namespace?: string
    disabled?: boolean
    enroll?: boolean
    mandatory?: boolean | 'force'
    multiple?: boolean
  }
  ```

  - `namespace`: Namespace for dependency injection (default: `'v0:expansion-panel'`)
  - `disabled`: Disables the entire expansion panel instance
  - `enroll`: Auto-expand non-disabled items on registration
  - `mandatory`: Controls mandatory expansion behavior:
    - `false` (default): All panels can be collapsed
    - `true`: Prevents collapsing the last expanded panel
    - `'force'`: Automatically expands the first non-disabled panel
  - `multiple`: Enable multi-expansion mode
    - `false` (default): Single panel expanded at a time (accordion mode)
    - `true`: Multiple panels can be expanded simultaneously

- **v-model**

  ```ts
  v-model: T | T[]
  ```

  Binds to expanded value(s). When `multiple` is true, expects an array.

- **Slots**

  ```ts
  interface ExpansionPanelRootSlots {
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

### ExpansionPanelItem

Individual expansion panel items that register with the ExpansionPanel context.

- **Props**

  ```ts
  interface ExpansionPanelItemProps {
    id?: string
    title?: string
    value?: any
    disabled?: MaybeRef<boolean>
    namespace?: string
  }
  ```

  - `id`: Unique identifier (auto-generated if not provided)
  - `title`: Optional display title (passed to slot, not used in registration)
  - `value`: Value associated with this panel
  - `disabled`: Disables this specific panel
  - `namespace`: Must match ExpansionPanelRoot namespace (default: `'v0:expansion-panel'`)

- **Slots**

  ```ts
  interface ExpansionPanelItemSlots {
    default: (props: {
      id: string
      title?: string
      value: any
      isSelected: boolean
      disabled: boolean
      ariaExpanded: boolean
      ariaDisabled: boolean
      select: () => void
      unselect: () => void
      toggle: () => void
    }) => any

    header: (props: {
      id: string
      title?: string
      isSelected: boolean
      disabled: boolean
      toggle: () => void
      ariaExpanded: boolean
      ariaControls: string
      ariaDisabled: boolean
      role: 'button'
      tabindex: number
    }) => any

    content: (props: {
      id: string
      isSelected: boolean
      ariaLabelledby: string
      role: 'region'
    }) => any
  }
  ```

- **Example**

  ```html
  <ExpansionPanel.Item value="panel-1" title="Panel Title">
    <template #header="{ toggle, ariaExpanded }">
      <button @click="toggle">
        Panel Title {{ ariaExpanded ? '▲' : '▼' }}
      </button>
    </template>

    <template #content>
      <p>Panel content goes here</p>
    </template>
  </ExpansionPanel.Item>
  ```
