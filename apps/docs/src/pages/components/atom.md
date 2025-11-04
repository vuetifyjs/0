---
meta:
  title: Atom
  description: The foundational building block for dynamic element rendering with renderless capabilities.
  keywords: atom, component, renderless, polymorphic, Vue, headless
features:
  category: Component
  label: 'E: Atom'
  github: /components/Atom/
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
