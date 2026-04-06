---
title: Popover - CSS Anchor Positioned Tooltips for Vue 3
meta:
- name: description
  content: Build popovers, tooltips, and dropdowns using the CSS Anchor Positioning API. Zero-JavaScript positioning with v-model state management for Vue 3.
- name: keywords
  content: popover, tooltip, dropdown, CSS anchor positioning, Vue 3, headless, popover API, menu
features:
  category: Component
  label: 'C: Popover'
  github: /components/Popover/
  renderless: true
  level: 2
related:
  - /composables/system/use-popover
  - /components/disclosure/expansion-panel
---

# Popover

A headless component for creating popovers and tooltips using modern CSS anchor positioning.

<DocsPageFeatures :frontmatter />

<DocsBrowserSupport
  feature="CSS Anchor Positioning"
  :versions="{ chrome: '125+', edge: '125+', firefox: '147+ (beta)' }"
  anchor="css-anchor-positioning"
>
  The component works in all browsers, but automatic anchor positioning requires CSS Anchor Positioning support. In unsupported browsers, you'll need to position the popover manually or use [Floating UI](https://floating-ui.com).
</DocsBrowserSupport>

## Usage

The Popover component leverages the CSS Anchor Positioning API to create popovers, tooltips, and dropdown menus without JavaScript-based positioning. It provides v-model support for open/closed state management.

::: example
/components/popover/basic

### Anchored Popover

A simple popover positioned via CSS anchor positioning, opened and closed by a button trigger.

:::

## Features

### Positioning

Use `position-area` on `Popover.Content` to control where the popover appears relative to its anchor. Accepts any [CSS `position-area`](https://developer.mozilla.org/en-US/docs/Web/CSS/position-area) value (default: `'bottom'`):

```vue
<template>
  <Popover.Content position-area="top">
    <!-- Appears above the anchor -->
  </Popover.Content>

  <Popover.Content position-area="end">
    <!-- Appears to the right of the anchor -->
  </Popover.Content>
</template>
```

Use `position-try` to specify fallback positions when the preferred position doesn't fit in the viewport (default: `'most-width bottom'`):

```vue
<template>
  <!-- Try bottom first; fall back to most available width -->
  <Popover.Content position-area="bottom" position-try="most-width bottom">
    Tooltip content
  </Popover.Content>
</template>
```

## Anatomy

```vue Anatomy playground
<script setup lang="ts">
  import { Popover } from '@vuetify/v0'
</script>

<template>
  <Popover.Root>
    <Popover.Activator />

    <Popover.Content />
  </Popover.Root>
</template>
```

<DocsApi />
