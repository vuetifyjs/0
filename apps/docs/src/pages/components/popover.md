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

- **v-model**

  ```ts
  v-model: boolean
  ```

- **Slots**

  ```ts
  interface PopoverRootSlots {
    default: (props: {
      id: string
      isSelected: boolean
      toggle: () => void
    }) => any
  }
  ```

### PopoverAnchor

The anchor button or element that triggers the popover.

- **Props**

  ```ts
  interface PopoverAnchorProps extends AtomProps {
    target?: string
    as?: DOMElement | null
  }
  ```

### PopoverContent

The popover content container with positioning.

- **Props**

  ```ts
  interface PopoverContentProps extends AtomProps {
    id?: string
    positionArea?: string
    positionTry?: string
  }
  ```

- **Emits**

  ```ts
  interface PopoverContentEmits {
    beforetoggle: [e: ToggleEvent]
  }
  ```
