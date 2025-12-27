---
title: ExpansionPanel - Accessible Accordion for Vue 3
meta:
- name: description
  content: Accessible accordion and expansion panels with single or multi-expand modes. WAI-ARIA compliant compound component with Header, Activator, and Content slots.
- name: keywords
  content: expansion panel, accordion, collapsible, Vue 3, headless, accessibility, WAI-ARIA, disclosure
features:
  category: Component
  label: 'E: ExpansionPanel'
  github: /components/ExpansionPanel/
  renderless: false
related:
  - /components/disclosure/popover
---

<script setup>
import BasicExample from '@/examples/components/expansion-panel/basic.vue'
import BasicExampleRaw from '@/examples/components/expansion-panel/basic.vue?raw'
import AccordionExample from '@/examples/components/expansion-panel/accordion.vue'
import AccordionExampleRaw from '@/examples/components/expansion-panel/accordion.vue?raw'
import CollapsibleExample from '@/examples/components/expansion-panel/basic.vue'
import CollapsibleExampleRaw from '@/examples/components/expansion-panel/basic.vue?raw'
</script>

# ExpansionPanel

A component for creating accordion-style expansion panels with proper ARIA support.

<DocsPageFeatures :frontmatter />

## Usage

The ExpansionPanel component provides a wrapper and item pattern for managing expansion state in accordion-style interfaces. It uses the `useSelection` composable internally and provides full v-model support with automatic state synchronization.

<DocsExample file="basic.vue" title="Basic ExpansionPanel" :code="BasicExampleRaw">
  <BasicExample />
</DocsExample>

## Anatomy

```vue Anatomy
<script setup lang="ts">
  import { ExpansionPanel } from '@vuetify/v0'
</script>

<template>
  <ExpansionPanel.Root>
    <ExpansionPanel.Item>
      <ExpansionPanel.Activator />

      <ExpansionPanel.Content />
    </ExpansionPanel.Item>
  </ExpansionPanel.Root>
</template>
```

For instances where you need to wrap the activator in a heading element **(h3)** for semantic purposes and WAI-ARIA, use the [ExpansionPanel.Header](#expansionpanelheader) component:

```vue AnatomyWithHeader
<script setup lang="ts">
  import { ExpansionPanel } from '@vuetify/v0'
</script>

<template>
  <ExpansionPanel.Root>
    <ExpansionPanel.Item>
      <ExpansionPanel.Header>
        <ExpansionPanel.Activator />
      </ExpansionPanel.Header>

      <ExpansionPanel.Content />
    </ExpansionPanel.Item>
  </ExpansionPanel.Root>
</template>
```

## API

| Composable | Description |
|---|---|
| [useSelection](/composables/selection/use-selection) | The underlying composable used by ExpansionPanel |

### ExpansionPanelRoot

The root component that manages expansion state and provides context to items.

- **Props**

  Extends `AtomProps` for maximum flexibility:

  ```ts
  interface ExpansionPanelRootProps extends AtomProps {
    as?: DOMElement | null
    renderless?: boolean
    namespace?: string
    disabled?: boolean
    enroll?: boolean
    mandatory?: boolean | 'force'
    multiple?: boolean
  }
  ```

  - `as`: The element type to render (default: `null` - no wrapper)
  - `renderless`: If true, renders no wrapper element
  - `namespace`: Namespace for dependency injection (default: `'v0:expansion-panel'`)
  - `disabled`: Disables the entire expansion panel instance and all items
  - `enroll`: Auto-expand non-disabled items when registered
  - `mandatory`: Controls mandatory expansion behavior:
    - `false` (default): All panels can be collapsed
    - `true`: Prevents collapsing the last expanded panel
    - `'force'`: Automatically expands the first non-disabled panel
  - `multiple`: Enable multi-expansion mode
    - `false` (default): Single panel expanded at a time (accordion mode)
    - `true`: Multiple panels can be expanded simultaneously (changes v-model type from `T` to `T[]`)

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

  ```vue ExpansionPanelRoot
  <template>
    <ExpansionPanel.Root
      v-model="model"
      @update:model-value="onModelChange"
    >
      <!-- panels -->
    </ExpansionPanel.Root>
  </template>
  ```

- **Slot Props**

  ```ts
  interface ExpansionPanelRootSlotProps {
    isDisabled: Readonly<Ref<boolean>>
    select: (id: ID) => void
    unselect: (id: ID) => void
    toggle: (id: ID) => void
  }
  ```

  - `isDisabled`: Reactive ref indicating if the expansion panel is disabled
  - `select`: Expand a panel by ID
  - `unselect`: Collapse a panel by ID
  - `toggle`: Toggle a panel's expansion state by ID

### ExpansionPanelItem

Individual expansion panel items that register with the ExpansionPanel context and provide context to child components.

- **Props**

  Extends `AtomProps` for maximum flexibility:

  ```ts
  interface ExpansionPanelItemProps<V = unknown> extends AtomProps {
    as?: DOMElement | null
    renderless?: boolean
    id?: string
    value?: V
    disabled?: MaybeRef<boolean>
    namespace?: string
  }
  ```

  - `as`: The element type to render (default: `null` - no wrapper)
  - `renderless`: If true, renders no wrapper element
  - `id`: Unique identifier for the panel item (auto-generated if not provided)
  - `value`: Value associated with this panel item for v-model binding
  - `disabled`: Disables this specific panel item
  - `namespace`: Namespace to retrieve the parent ExpansionPanelRoot context (default: `'v0:expansion-panel'`)

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

- **Slot Props**

  ```ts
  interface ExpansionPanelItemSlotProps {
    isSelected: boolean
    isDisabled: boolean
    attrs: {
      'data-selected': true | undefined
    }
  }
  ```

  - `isSelected`: Whether this panel is currently expanded
  - `isDisabled`: Combined disabled state from item and parent
  - `attrs`: Object containing data attributes to bind to the root element

- **Data Attributes**

  | Attribute | Values | Description |
  |---|---|---|
  | `data-selected` | `true` \| (absent) | Whether the panel is expanded. Useful for styling selected states. |

- **Example**

  ```vue ExpansionPanelItem
  <script setup lang="ts">
    import { ExpansionPanel } from '@vuetify/v0'
  </script>

  <template>
    <ExpansionPanel.Item value="panel-1" v-slot="{ isSelected }">
      <ExpansionPanel.Header class="data-[selected]:bg-surface-tint">
        <ExpansionPanel.Activator>
          Panel Title {{ isSelected ? '▲' : '▼' }}
        </ExpansionPanel.Activator>
      </ExpansionPanel.Header>

      <ExpansionPanel.Content>
        <p>Panel content goes here</p>
      </ExpansionPanel.Content>
    </ExpansionPanel.Item>
  </template>
  ```

### ExpansionPanelHeader

Semantic heading wrapper for the expansion panel activator. Per WAI-ARIA accordion pattern, accordion triggers should be wrapped in heading elements to enable heading-based navigation for screen reader users.

- **Props**

  Extends `AtomProps` for maximum flexibility:

  ```ts
  interface ExpansionPanelHeaderProps extends AtomProps {
    as?: DOMElement | null
    renderless?: boolean
    namespace?: string
  }
  ```

  - `as`: The heading element type to render (default: `'h3'`)
  - `renderless`: If true, renders no wrapper element
  - `namespace`: Namespace for retrieving the parent ExpansionPanelItem context (default: `'v0:expansion-panel'`)

- **Slot Props**

  ```ts
  interface ExpansionPanelHeaderSlotProps {
    isSelected: boolean
    attrs: {
      'data-selected': true | undefined
    }
  }
  ```

  - `isSelected`: Whether this panel is currently expanded
  - `attrs`: Object containing data attributes to bind to the root element

- **Data Attributes**

  | Attribute | Values | Description |
  |---|---|---|
  | `data-selected` | `true` \| (absent) | Whether the panel is expanded |

- **Example**

  ```vue ExpansionPanelHeader
  <script setup lang="ts">
    import { ExpansionPanel } from '@vuetify/v0'
  </script>

  <template>
    <!-- Default h3 heading -->
    <ExpansionPanel.Header>
      <ExpansionPanel.Activator>Panel Title</ExpansionPanel.Activator>
    </ExpansionPanel.Header>

    <!-- Custom heading level -->
    <ExpansionPanel.Header as="h2">
      <ExpansionPanel.Activator>Panel Title</ExpansionPanel.Activator>
    </ExpansionPanel.Header>
  </template>
  ```

### ExpansionPanelActivator

The activator component that triggers the expansion/collapse of a panel. Should be used within `ExpansionPanelHeader` for proper accessibility.

- **Props**

  Extends `AtomProps` for maximum flexibility:

  ```ts
  interface ExpansionPanelActivatorProps extends AtomProps {
    as?: DOMElement | null
    renderless?: boolean
    namespace?: string
  }
  ```

  - `as`: The element type to render (default: `'button'`)
  - `renderless`: If true, renders no wrapper element
  - `namespace`: Namespace for retrieving the parent ExpansionPanelItem context (default: `'v0:expansion-panel'`)

- **Context Requirements**

  - Must be used within `ExpansionPanelItem`
  - Automatically inherits panel state from parent item context
  - Generates appropriate ARIA attributes for accessibility

- **Slot Props**

  ```ts
  interface ExpansionPanelActivatorSlotProps {
    isDisabled: boolean
    isSelected: boolean
    toggle: () => void
    attrs: {
      id: string
      role: 'button' | undefined
      tabindex: number
      'aria-expanded': boolean
      'aria-controls': string
      'aria-disabled': boolean
      'data-disabled': true | undefined
      'data-selected': true | undefined
      disabled: boolean | undefined
      type: 'button' | undefined
      onClick: () => void
      onKeydown: (e: KeyboardEvent) => void
    }
  }
  ```

  - `isDisabled`: Whether the activator is disabled
  - `isSelected`: Whether this panel is currently expanded
  - `toggle`: Function to toggle the panel's expansion state
  - `attrs`: Object containing all bindable attributes including ARIA attributes and event handlers

- **Data Attributes**

  | Attribute | Values | Description |
  |---|---|---|
  | `data-selected` | `true` \| (absent) | Whether the panel is expanded |
  | `data-disabled` | `true` \| (absent) | Whether the activator is disabled |

- **Accessibility Features**

  - `role="button"` added only for non-button elements
  - `aria-expanded` reflects panel state
  - `aria-controls` links to associated content region
  - `aria-disabled` indicates disabled state
  - Native `disabled` attribute for button elements
  - `tabindex` managed for keyboard navigation (-1 when disabled, 0 when enabled)
  - Built-in keyboard handling (Enter/Space keys trigger toggle)

- **Example**

  ```vue ExpansionPanelActivator
  <script setup lang="ts">
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

    <!-- Renderless mode with attrs spread -->
    <ExpansionPanel.Activator renderless v-slot="{ attrs }">
      <MyCustomButton v-bind="attrs">
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

The content container for an expansion panel. Must be used within `ExpansionPanelItem`. Visibility is controlled automatically via the `hidden` attribute.

- **Props**

  Extends `AtomProps` for maximum flexibility:

  ```ts
  interface ExpansionPanelContentProps extends AtomProps {
    as?: DOMElement | null
    renderless?: boolean
    namespace?: string
  }
  ```

  - `as`: The element type to render (default: `'div'`)
  - `renderless`: If true, renders no wrapper element
  - `namespace`: Namespace for retrieving the parent ExpansionPanelItem context (default: `'v0:expansion-panel'`)

- **Context Requirements**

  - Must be used within `ExpansionPanelItem`
  - Automatically inherits panel state from parent item context

- **Slot Props**

  ```ts
  interface ExpansionPanelContentSlotProps {
    isSelected: boolean
    attrs: {
      'data-selected': boolean
      id: string
      role: 'region'
      'aria-labelledby': string
      hidden: boolean
    }
  }
  ```

  - `isSelected`: Whether this panel is currently expanded
  - `attrs`: Object containing all bindable attributes including ARIA attributes and `hidden` state

- **Data Attributes**

  | Attribute | Values | Description |
  |---|---|---|
  | `data-selected` | `true` \| `false` | Whether the panel is expanded |

- **Accessibility Features**

  - Automatic `role="region"` for screen reader navigation
  - `aria-labelledby` links to associated activator for proper labeling
  - Content ID matches the `aria-controls` attribute from the activator
  - Native `hidden` attribute controls visibility

- **Example**

  ```vue ExpansionPanelContent
  <script setup lang="ts">
    import { ExpansionPanel } from '@vuetify/v0'
  </script>

  <template>
    <!-- Simple usage (visibility controlled via hidden attribute) -->
    <ExpansionPanel.Content>
      Content here
    </ExpansionPanel.Content>

    <!-- With transitions (use isSelected for custom visibility) -->
    <ExpansionPanel.Content v-slot="{ isSelected, attrs }">
      <div v-bind="attrs">
        <Transition name="expand">
          <div v-show="isSelected">
            Animated content
          </div>
        </Transition>
      </div>
    </ExpansionPanel.Content>

    <!-- Renderless mode with attrs spread -->
    <ExpansionPanel.Content renderless v-slot="{ attrs }">
      <MyCustomContent v-bind="attrs">
        Custom content
      </MyCustomContent>
    </ExpansionPanel.Content>
  </template>
  ```

## Examples

<DocsExample file="collapsible.vue" title="Collapsible (Multi Panel)" :code="CollapsibleExampleRaw">
  <CollapsibleExample />
</DocsExample>

<DocsExample file="accordion.vue" title="Accordion (Single Panel)" :code="AccordionExampleRaw">
  <AccordionExample />
</DocsExample>

<DocsRelated :frontmatter />
