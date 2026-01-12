---
title: Single - Radio Group Pattern for Vue 3
meta:
- name: description
  content: Build radio buttons and single-selection UIs with automatic deselection. Extends Selection composable for tabs, toggles, and exclusive choice patterns in Vue 3.
- name: keywords
  content: single, radio button, single-select, tabs, toggle, Vue 3, headless, exclusive selection
features:
  category: Component
  label: 'E: Single'
  github: /components/Single/
  renderless: true
  level: 2
related:
  - /composables/selection/create-single
  - /components/providers/selection
---

<script setup>
import BasicExample from '@/examples/components/single/basic.vue'
import BasicExampleRaw from '@/examples/components/single/basic.vue?raw'
</script>

# Single

A headless component for managing single-selection with automatic deselection of previous items.

<DocsPageFeatures :frontmatter />

## Usage

The Single component is a specialization of Selection that enforces single-selection behavior. When an item is selected, any previously selected item is automatically deselected.

<DocsExample file="basic.vue" :code="BasicExampleRaw">
  <BasicExample />
</DocsExample>

## Anatomy

```vue Anatomy playground
<script setup lang="ts">
  import { Single } from '@vuetify/v0'
</script>

<template>
  <Single.Root>
    <Single.Item value="option-1" />

    <Single.Item value="option-2" />
  </Single.Root>
</template>
```

<DocsApi />
