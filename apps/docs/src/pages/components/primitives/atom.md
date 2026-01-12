---
title: Atom - Polymorphic Foundation Component for Vue 3
meta:
- name: description
  content: Polymorphic foundation component for dynamic element rendering. Render as any HTML element with the 'as' prop or use renderless mode for zero DOM overhead.
- name: keywords
  content: atom, component, renderless, polymorphic, as prop, Vue 3, headless, dynamic element
features:
  category: Component
  label: 'E: Atom'
  github: /components/Atom/
  renderless: false
  level: 2
related:
  - /guide/fundamentals/components
---

<script setup>
import BasicExample from '@/examples/components/atom/basic.vue'
import BasicExampleRaw from '@/examples/components/atom/basic.vue?raw'
</script>

# Atom

Renders any HTML element or outputs nothing at all—your choice.

<DocsPageFeatures :frontmatter />

## Usage

Use Atom when you need to:
- Render the same component as different elements (e.g., `<button>` vs `<a>`)
- Output slot content without a wrapper element (renderless mode)
- Build higher-level components that inherit polymorphic behavior

The `as` prop accepts any HTML tag name. Set `as` to `null` or use the `renderless` prop to skip the wrapper entirely and render only slot content.

<DocsExample file="basic.vue" :code="BasicExampleRaw">
  <BasicExample />
</DocsExample>

## Anatomy

```vue Anatomy playground
<script setup lang="ts">
  import { Atom } from '@vuetify/v0'
</script>

<template>
  <Atom />
</template>
```

## In Practice

All v0 components use Atom internally with sensible defaults:

| Component | Default `as` | Why |
|-----------|--------------|-----|
| `PaginationItem` | `button` | Interactive by default |
| `AvatarRoot` | `div` | Container element |
| `DialogRoot` | `null` | Pure context provider, no DOM |

```vue
<script setup lang="ts">
  // Inside PaginationItem.vue
  import { Atom } from '@vuetify/v0'

  const { as = 'button', renderless, value } = defineProps<PaginationItemProps>()

  const slotProps = computed(() => ({
    page: value,
    isSelected: isSelected.value,
    select,
    attrs: {
      'aria-label': `Go to page ${value}`,
      'aria-current': isSelected.value ? 'page' : undefined,
      onClick: select,
    },
  }))
</script>

<template>
  <!-- Renders as <button> by default, but consumers can override -->
  <Atom :as :renderless v-bind="slotProps.attrs">
    <slot v-bind="slotProps">
      {{ value }}
    </slot>
  </Atom>
</template>
```

Each component exposes the `as` and `renderless` props, so you can override the default when needed.

<DocsApi />
