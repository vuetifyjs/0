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
related:
  - /composables/selection/use-single
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

<DocsExample file="basic.vue" title="Radio Group Pattern" :code="BasicExampleRaw">
  <BasicExample />
</DocsExample>

## Anatomy

```vue Anatomy
<script setup lang="ts">
  import { Single } from '@vuetify/v0'
</script>

<template>
  <Single.Root v-model="selected" v-slot="{ attrs }">
    <div v-bind="attrs">
      <Single.Item value="option-1" v-slot="{ attrs }">
        <button v-bind="attrs">Option 1</button>
      </Single.Item>

      <Single.Item value="option-2" v-slot="{ attrs }">
        <button v-bind="attrs">Option 2</button>
      </Single.Item>
    </div>
  </Single.Root>
</template>
```

<DocsApi />
