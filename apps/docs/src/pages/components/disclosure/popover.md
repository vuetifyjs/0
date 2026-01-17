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
  - /components/disclosure/expansion-panel
---

<script setup>
import BasicExample from '@/examples/components/popover/basic.vue'
import BasicExampleRaw from '@/examples/components/popover/basic.vue?raw'
</script>

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

<DocsExample file="basic.vue" :code="BasicExampleRaw">
  <BasicExample />
</DocsExample>

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
