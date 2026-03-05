---
title: Splitter - Resizable Panel Layout with Drag Handles
meta:
- name: description
  content: Headless splitter component with resizable panels and draggable handles. Supports keyboard navigation, orientation control, and nested layouts for Vue 3.
- name: keywords
  content: splitter, resizable, panels, drag handle, resize, layout, Vue 3, headless, accessible
features:
  category: Component
  label: 'C: Splitter'
  github: /components/Splitter/
  renderless: false
  level: 2
related:
  - /components/primitives/atom
---

# Splitter

A headless component for building resizable panel layouts with drag handles and full keyboard support.

<DocsPageFeatures :frontmatter />

## Usage

The Splitter provides resizable panels separated by draggable handles. Panel sizes are specified as percentages and must sum to 100.

::: example
/components/splitter/basic
:::

## Anatomy

```vue Anatomy playground
<script setup lang="ts">
  import { Splitter } from '@vuetify/v0'
</script>

<template>
  <Splitter.Root>
    <Splitter.Panel />

    <Splitter.Handle />

    <Splitter.Panel />
  </Splitter.Root>
</template>
```

## Examples

### Nested Layouts

Splitters compose naturally — place a `Splitter.Root` inside any panel to build complex layouts. Each nested splitter operates independently with its own sizes, handles, and orientation, while the outer splitter manages the top-level split.

This IDE-style workspace demonstrates the pattern with two levels of nesting: a horizontal splitter divides the sidebar from the main content area, and a vertical splitter inside the content panel separates the code editor from a live preview.

::: example
/components/splitter/resize-handle.vue 1
/components/splitter/playground.vue 2

### Playground Layout

An IDE workspace split across two files — the layout composition and a reusable handle component:

| File | Role |
|------|------|
| `playground.vue` | Composes the nested layout — horizontal sidebar split with a vertical editor/preview split inside |
| `resize-handle.vue` | Reusable styled handle that accepts an `horizontal` prop to adapt its cursor, dimensions, and grip indicator direction |

**Key patterns:**

- The outer `Splitter.Root` uses the default horizontal orientation for the sidebar/content split
- The inner `Splitter.Root` sets `orientation="vertical"` to stack the editor above the preview
- `min-size` and `max-size` constraints on the sidebar panel (15–30%) prevent it from collapsing or dominating the layout
- `ResizeHandle` is a thin wrapper around `Splitter.Handle` — it takes a `horizontal` prop rather than reading context, making it portable across any splitter without coupling to a specific root
:::

## Recipes

### Orientation

Set `orientation` on the root to control layout direction. Defaults to `horizontal`.

```vue
<template>
  <Splitter.Root orientation="vertical">
    <Splitter.Panel :default-size="50">Top</Splitter.Panel>
    <Splitter.Handle />
    <Splitter.Panel :default-size="50">Bottom</Splitter.Panel>
  </Splitter.Root>
</template>
```

### Disabled State

Disable all resize interactions via the `disabled` prop on the root, or disable individual handles.

```vue
<template>
  <!-- Disable all handles -->
  <Splitter.Root disabled>
    ...
  </Splitter.Root>

  <!-- Disable a single handle -->
  <Splitter.Root>
    <Splitter.Panel :default-size="33" />
    <Splitter.Handle disabled />
    <Splitter.Panel :default-size="34" />
    <Splitter.Handle />
    <Splitter.Panel :default-size="33" />
  </Splitter.Root>
</template>
```

## Accessibility

The Splitter implements the [WAI-ARIA Window Splitter](https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/) pattern.

- Each handle has `role="separator"` with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`
- `aria-orientation` is set **perpendicular** to the layout direction (a horizontal layout produces vertical separators)
- `aria-controls` links each handle to the panel it precedes
- Disabled handles set `tabindex="-1"` and `aria-disabled="true"`

### Keyboard Navigation

| Key | Action |
| - | - |
| Arrow Left / Arrow Up | Shrink preceding panel by 1% |
| Arrow Right / Arrow Down | Grow preceding panel by 1% |
| Page Up | Shrink preceding panel by 10% |
| Page Down | Grow preceding panel by 10% |
| Home | Collapse preceding panel to minimum |
| End | Expand preceding panel to maximum |

Arrow direction follows the layout orientation — horizontal splitters use Left/Right, vertical splitters use Up/Down.

<DocsApi />
