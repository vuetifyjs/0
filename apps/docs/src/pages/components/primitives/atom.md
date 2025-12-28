---
title: Atom - Polymorphic Foundation Component for Vue 3
meta:
- name: description
  content: Polymorphic foundation component for dynamic element rendering. Render as any HTML element with the 'as' prop and support renderless mode for full flexibility.
- name: keywords
  content: atom, component, renderless, polymorphic, as prop, Vue 3, headless, dynamic element
features:
  category: Component
  label: 'E: Atom'
  github: /components/Atom/
  renderless: false
related:
  - /guide/components
---

<script setup>
import BasicExample from '@/examples/components/atom/basic.vue'
import BasicExampleRaw from '@/examples/components/atom/basic.vue?raw'
</script>

# Atom

The foundational building block for dynamic element rendering with renderless capabilities.

<DocsPageFeatures :frontmatter />

## Usage

The Atom component provides dynamic element rendering and is used as the foundation for all other components in Vuetify0. It supports polymorphic rendering through the `as` prop and can render as any HTML element or Vue component.

<DocsExample file="basic.vue" title="Dynamic Element Rendering" :code="BasicExampleRaw">
  <BasicExample />
</DocsExample>

## API

### Atom

The base component for dynamic element rendering.

- **Props**

  ```ts
  interface AtomProps {
    as?: DOMElement | null
    renderless?: boolean
  }
  ```

  - `as`: Element or component to render as (default: `'div'`)
  - `renderless`: Render only slot content without wrapper (default: `false`)

- **Slots**

  ```ts
  interface AtomSlots<T> {
    default: (props: T) => any
  }
  ```

- **Expose**

  ```ts
  interface AtomExpose {
    element: TemplateRef<HTMLElement | null>
  }
  ```

- **Details**

  - Automatically handles self-closing tags (img, input, hr, br, etc.)
  - Forwards all attributes using `v-bind`
  - Slot props include all passed attributes
  - Used as the foundation for Avatar, Popover, and other components

<DocsApi />
