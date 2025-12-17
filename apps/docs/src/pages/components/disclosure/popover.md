---
title: Popover Component
meta:
- name: description
  content: A headless component for creating popovers and tooltips using modern CSS
    anchor positioning.
- name: keywords
  content: popover, tooltip, anchor, positioning, component, Vue, headless
features:
  category: Component
  label: 'E: Popover'
  github: /components/Popover/
---

<script setup>
  //
</script>

# Popover

A headless component for creating popovers and tooltips using modern CSS anchor positioning.

<DocsPageFeatures :frontmatter />

## Usage

The Popover component leverages the CSS Anchor Positioning API to create popovers, tooltips, and dropdown menus without JavaScript-based positioning. It provides v-model support for open/closed state management.

## Anatomy

```vue Anatomy
<script lang="ts" setup>
  import { Popover } from '@vuetify/v0'
</script>

<template>
  <Popover.Root v-model="isOpen">
    <Popover.Anchor>
      <button>Toggle Popover</button>
    </Popover.Anchor>

    <Popover.Content>
      <div>Popover content here</div>
    </Popover.Content>
  </Popover.Root>
</template>
```

## API

| Component | Description |
|---|---|
| [Atom](/components/atom) | Foundation component used by Popover components |

| Composable | Description |
|---|---|
| [createContext](/composables/foundation/create-context) | Context system for state sharing |

### PopoverRoot

The root component that manages popover state and provides context.

- **Props**

  ```ts
  interface PopoverRootProps extends AtomProps {
    id?: string
    as?: DOMElement | null
    renderless?: boolean
  }
  ```

  - `id`: Unique identifier for the popover (auto-generated if not provided)
  - `as`: Element to render as (default: `null` / renderless)
  - `renderless`: Render only the slot content without a wrapper element

- **v-model**

  ```ts
  v-model: boolean
  ```

  Binds to the open/closed state of the popover.

- **Slot Props**

  ```ts
  interface PopoverRootSlotProps {
    id: string
    isSelected: boolean
    toggle: () => void
  }
  ```

  - `id`: Unique identifier for this popover
  - `isSelected`: Whether the popover is currently open
  - `toggle`: Toggle the popover open/closed state

- **Example**

  ```vue PopoverRoot
  <script lang="ts" setup>
    import { Popover } from '@vuetify/v0'
    import { ref } from 'vue'

    const isOpen = ref(false)
  </script>

  <template>
    <Popover.Root v-model="isOpen" v-slot="{ isSelected, toggle }">
      <button @click="toggle">
        {{ isSelected ? 'Close' : 'Open' }} Popover
      </button>
      <!-- Anchor and Content components -->
    </Popover.Root>
  </template>
  ```

### PopoverAnchor

The anchor button or element that triggers the popover. Uses the native popover API via `popovertarget`.

- **Props**

  ```ts
  interface PopoverAnchorProps extends AtomProps {
    target?: string
    as?: DOMElement | null
  }
  ```

  - `target`: Target popover ID (defaults to parent PopoverRoot id)
  - `as`: Element to render as (default: `'button'`)

- **Slot Props**

  ```ts
  interface PopoverAnchorSlotProps {
    isOpen: boolean
    attrs: {
      popovertarget: string
      type: 'button' | undefined
      'data-popover-open': '' | undefined
    }
  }
  ```

  - `isOpen`: Whether the popover is currently open
  - `attrs`: Object containing attributes to bind to the anchor element

- **Data Attributes**

  | Attribute | Description |
  |---|---|
  | `data-popover-open` | Present when the popover is open |

- **Example**

  ```vue PopoverAnchor
  <script lang="ts" setup>
    import { Popover } from '@vuetify/v0'
  </script>

  <template>
    <!-- Simple usage -->
    <Popover.Anchor>Click me</Popover.Anchor>

    <!-- Custom element -->
    <Popover.Anchor as="div" v-slot="{ attrs, isOpen }">
      <button v-bind="attrs" :class="{ 'bg-blue-500': isOpen }">
        Toggle
      </button>
    </Popover.Anchor>
  </template>
  ```

### PopoverContent

The popover content container with CSS anchor positioning.

- **Props**

  ```ts
  interface PopoverContentProps extends AtomProps {
    id?: string
    positionArea?: string
    positionTry?: string
  }
  ```

  - `id`: Unique identifier (defaults to parent PopoverRoot id)
  - `positionArea`: CSS position-area value for anchor positioning (default: `'bottom'`)
  - `positionTry`: CSS position-try value for fallback positioning (default: `'most-width bottom'`)

- **Events**

  | Event | Payload | Description |
  |---|---|---|
  | `beforetoggle` | `ToggleEvent` | Emitted before the popover toggles state |

- **Slot Props**

  ```ts
  interface PopoverContentSlotProps {
    isOpen: boolean
    attrs: {
      id: string
      popover: ''
    }
  }
  ```

  - `isOpen`: Whether the popover is currently open
  - `attrs`: Object containing attributes to bind to the content element

- **Example**

  ```vue PopoverContent
  <script lang="ts" setup>
    import { Popover } from '@vuetify/v0'
  </script>

  <template>
    <!-- Basic positioning -->
    <Popover.Content position-area="bottom">
      <div class="p-4 bg-white shadow-lg rounded">
        Content here
      </div>
    </Popover.Content>

    <!-- With slot props -->
    <Popover.Content v-slot="{ isOpen, attrs }">
      <div v-bind="attrs" class="popover-panel">
        <p>Popover is {{ isOpen ? 'open' : 'closed' }}</p>
      </div>
    </Popover.Content>
  </template>
  ```

## Positioning

The Popover component uses the CSS Anchor Positioning API for positioning. The `positionArea` prop accepts standard CSS values:

| Value | Description |
|---|---|
| `top` | Position above the anchor |
| `bottom` | Position below the anchor |
| `left` | Position to the left of the anchor |
| `right` | Position to the right of the anchor |
| `top left` | Position above and to the left |
| `top right` | Position above and to the right |
| `bottom left` | Position below and to the left |
| `bottom right` | Position below and to the right |

The `positionTry` prop provides fallback positioning when the primary position doesn't fit.
