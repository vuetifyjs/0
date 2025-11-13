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

- **Events**

  | Event | Payload | Description |
  |---|---|---|
  | `update:model-value` | `T \| T[]` | Emitted when the expanded panels change. Type depends on the `multiple` prop: single value `T` when `multiple=false`, or array `T[]` when `multiple=true` |

  **Example:**

  ```vue
  <template>
    <ExpansionPanel.Root
      v-model="model"
      @update:model-value="onModelChange"
    >
      <!-- panels -->
    </ExpansionPanel.Root>
  </template>
  ```

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

Individual expansion panel items that register with the ExpansionPanel context and provide context to child components.

- **Props**

  ```ts
    interface ExpansionPanelItemProps {
      id?: string
      value?: any
      disabled?: MaybeRef<boolean>
      namespace?: string
      itemNamespace?: string
    }
  ```

  - `id`: Unique identifier (auto-generated if not provided)
  - `value`: Value associated with this panel for v-model binding
  - `disabled`: Disables this specific panel
  - `namespace`: Must match ExpansionPanelRoot namespace (default: `'v0:expansion-panel'`)
  - `itemNamespace`: Namespace for providing context to child components (default: `'v0:expansion-panel-item'`)

- **Context Provided**

  ExpansionPanelItem provides context to child components (Activator/Content) via dependency injection:

  ```ts
    interface ExpansionPanelItemContext {
      ticket: SelectionTicket
      headerId: Readonly<Ref<string>>
      contentId: Readonly<Ref<string>>
      isDisabled: Readonly<Ref<boolean>>
    }
  ```

- **Slots**

  ```ts
    interface ExpansionPanelItemSlots {
      default: () => any
    }
  ```

- **Example**

  ```vue
    <script lang="ts" setup>
      import { ExpansionPanel } from '@vuetify/v0'
    </script>

    <template>
      <ExpansionPanel.Item value="panel-1">
        <ExpansionPanel.Activator v-slot="{ toggle, isSelected }">
          <button @click="toggle">
            Panel Title {{ isSelected ? '▲' : '▼' }}
          </button>
        </ExpansionPanel.Activator>

        <ExpansionPanel.Content v-slot="{ isSelected }">
          <div v-show="isSelected">
            <p>Panel content goes here</p>
          </div>
        </ExpansionPanel.Content>
      </ExpansionPanel.Item>
    </template>
  ```

### ExpansionPanelActivator

The activator component that triggers the expansion/collapse of a panel. Must be used within `ExpansionPanelItem`.

- **Props**

  Extends `AtomProps` for maximum flexibility:

  ```ts
    interface ExpansionPanelActivatorProps extends AtomProps {
      as?: DOMElement | null
      renderless?: boolean
      itemNamespace?: string
    }
  ```

  - `as`: The element type to render (default: `'button'`)
  - `renderless`: If true, renders no wrapper element
  - `itemNamespace`: Namespace for retrieving the parent ExpansionPanelItem context (default: `'v0:expansion-panel-item'`)

- **Context Requirements**

  - Must be used within `ExpansionPanelItem`
  - Automatically inherits panel state from parent item context
  - Generates appropriate ARIA attributes for accessibility

- **Slot Props**

  ```ts
    interface ExpansionPanelActivatorSlotProps {
      id: string
      role: 'button'
      tabindex: number
      'aria-expanded': boolean
      'aria-controls': string
      'aria-disabled': boolean
      isSelected: boolean
      toggle: () => void
      onClick: () => void
      onKeydown: (e: KeyboardEvent) => void
    }
  ```

  All ARIA attributes are automatically provided via `bindableProps`. When using the default slot, these props are available for custom implementations.

- **Accessibility Features**

  - Automatic `role="button"` for keyboard interaction
  - `aria-expanded` reflects panel state
  - `aria-controls` links to associated content region
  - `aria-disabled` when parent is disabled
  - `tabindex` managed for keyboard navigation (-1 when disabled, 0 when enabled)
  - Built-in keyboard handling (Enter/Space keys trigger toggle)

- **Example**

  ```vue
    <script lang="ts" setup>
      import { ExpansionPanel } from '@vuetify/v0'
    </script>

    <template>
      <!-- Simple usage (automatic ARIA binding) -->
      <ExpansionPanel.Activator>
        Click to expand
      </ExpansionPanel.Activator>

      <!-- Custom implementation with slot props -->
      <ExpansionPanel.Activator v-slot="{ toggle, isSelected }">
        <button @click="toggle" class="custom-button">
          {{ isSelected ? '−' : '+' }} Custom Header
        </button>
      </ExpansionPanel.Activator>

      <!-- Renderless mode -->
      <ExpansionPanel.Activator renderless v-slot="props">
        <MyCustomButton v-bind="props">
          Advanced Custom Header
        </MyCustomButton>
      </ExpansionPanel.Activator>

      <!-- Custom element type -->
      <ExpansionPanel.Activator as="div">
        Custom div activator
      </ExpansionPanel.Activator>
    </template>
  ```

### ExpansionPanelContent

The content container for an expansion panel. Must be used within `ExpansionPanelItem`.

- **Props**

  Extends `AtomProps` for maximum flexibility:

  ```ts
    interface ExpansionPanelContentProps extends AtomProps {
      as?: DOMElement | null
      renderless?: boolean
      itemNamespace?: string
    }
  ```

  - `as`: The element type to render (default: `'div'`)
  - `renderless`: If true, renders no wrapper element
  - `itemNamespace`: Namespace for retrieving the parent ExpansionPanelItem context (default: `'v0:expansion-panel-item'`)

- **Context Requirements**

  - Must be used within `ExpansionPanelItem`
  - Automatically inherits panel state from parent item context
  - Visibility is NOT automatically controlled - consumer must implement `v-show` or similar based on slot props

- **Slot Props**

  ```ts
    interface ExpansionPanelContentSlotProps {
      id: string
      role: 'region'
      'aria-labelledby': string
      isSelected: boolean
    }
  ```

  All ARIA attributes are automatically provided via `bindableProps`.

- **Accessibility Features**

  - Automatic `role="region"` for screen reader navigation
  - `aria-labelledby` links to associated activator for proper labeling
  - Content ID matches the `aria-controls` attribute from the activator

- **Example**

  ```vue
    <script lang="ts" setup>
      import { ExpansionPanel } from '@vuetify/v0'
    </script>

    <template>
      <!-- Simple usage with manual visibility control -->
      <ExpansionPanel.Content v-slot="{ isSelected }">
        <div v-show="isSelected">
          Content here
        </div>
      </ExpansionPanel.Content>

      <!-- With transitions -->
      <ExpansionPanel.Content v-slot="{ isSelected }">
        <Transition name="expand">
          <div v-show="isSelected">
            Animated content
          </div>
        </Transition>
      </ExpansionPanel.Content>

      <!-- Renderless mode -->
      <ExpansionPanel.Content renderless v-slot="{ isSelected, ...props }">
        <MyCustomContent v-show="isSelected" v-bind="props">
          Custom content
        </MyCustomContent>
      </ExpansionPanel.Content>
    </template>
  ```
