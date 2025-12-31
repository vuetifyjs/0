---
title: Popover - CSS Anchor Positioned Tooltips for Vue 3
meta:
- name: description
  content: Build popovers, tooltips, and dropdowns using the CSS Anchor Positioning API. Zero-JavaScript positioning with v-model state management for Vue 3.
- name: keywords
  content: popover, tooltip, dropdown, CSS anchor positioning, Vue 3, headless, popover API, menu
features:
  category: Component
  label: 'E: Popover'
  github: /components/Popover/
  renderless: true
related:
  - /components/disclosure/expansion-panel
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
<script setup lang="ts">
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

<DocsApi />

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

