---
title: Selection - Headless Selection State for Vue 3
meta:
  - name: description
    content: Manage selection state in Vue 3 collections. Build checkboxes, radio groups, and listboxes with full v-model support, mandatory selection, and item enrollment.
  - name: keywords
    content: selection, checkbox, radio group, listbox, Vue 3, headless, v-model, state management
features:
  category: Component
  label: 'E: Selection'
  github: /components/Selection/
  renderless: true
  level: 2
related:
  - /composables/selection/create-selection
  - /components/providers/single
  - /components/providers/group
---

<script setup>
import BasicExample from '@/examples/components/selection/basic.vue'
import BasicExampleRaw from '@/examples/components/selection/basic.vue?raw'
</script>

# Selection

A headless component for managing selection state in collections with support for single and multi-selection patterns.

<DocsPageFeatures :frontmatter />

## Usage

The Selection component provides a wrapper and item pattern for managing selection state in collections. It uses the `createSelection` composable internally and provides full v-model support with automatic state synchronization.

<DocsExample file="basic.vue" :code="BasicExampleRaw">
  <BasicExample />
</DocsExample>

## Anatomy

```vue Anatomy playground
<script setup lang="ts">
  import { Selection } from '@vuetify/v0'
</script>

<template>
  <Selection.Root>
    <Selection.Item value="apple" />

    <Selection.Item value="banana" />
  </Selection.Root>
</template>
```

<DocsApi />
