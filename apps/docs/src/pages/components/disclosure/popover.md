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
import BasicExample from '@/examples/components/popover/basic.vue'
import BasicExampleRaw from '@/examples/components/popover/basic.vue?raw'
</script>

# Popover

A headless component for creating popovers and tooltips using modern CSS anchor positioning.

<DocsPageFeatures :frontmatter />

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
