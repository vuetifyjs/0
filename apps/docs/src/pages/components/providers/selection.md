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
related:
  - /composables/selection/use-selection
  - /components/providers/single
  - /components/providers/group
---

<script setup>
import BasicExample from '@/examples/components/selection/basic.vue'
import BasicExampleRaw from '@/examples/components/selection/basic.vue?raw'
import SingleExample from '@/examples/components/selection/single.vue'
import SingleExampleRaw from '@/examples/components/selection/single.vue?raw'
import MandatoryExample from '@/examples/components/selection/mandatory.vue'
import MandatoryExampleRaw from '@/examples/components/selection/mandatory.vue?raw'
import DisabledExample from '@/examples/components/selection/disabled.vue'
import DisabledExampleRaw from '@/examples/components/selection/disabled.vue?raw'
</script>

# Selection

A headless component for managing selection state in collections with support for single and multi-selection patterns.

<DocsPageFeatures :frontmatter />

## Usage

The Selection component provides a wrapper and item pattern for managing selection state in collections. It uses the `useSelection` composable internally and provides full v-model support with automatic state synchronization.

<DocsExample file="basic.vue" title="Multi-selection" :code="BasicExampleRaw">
  <BasicExample />
</DocsExample>

## Anatomy

```vue Anatomy playground
<script setup lang="ts">
  import { Selection } from '@vuetify/v0'
</script>

<template>
  <Selection.Root v-model="selected" v-slot="{ attrs }">
    <div v-bind="attrs">
      <Selection.Item value="apple" v-slot="{ attrs }">
        <button v-bind="attrs">Apple</button>
      </Selection.Item>

      <Selection.Item value="banana" v-slot="{ attrs }">
        <button v-bind="attrs">Banana</button>
      </Selection.Item>
    </div>
  </Selection.Root>
</template>
```

<DocsApi />

## Examples

### Single Selection

<DocsExample file="single.vue" :code="SingleExampleRaw">
  <SingleExample />
</DocsExample>

### Mandatory Selection

<DocsExample file="mandatory.vue" :code="MandatoryExampleRaw">
  <MandatoryExample />
</DocsExample>

### Disabled Items

<DocsExample file="disabled.vue" :code="DisabledExampleRaw">
  <DisabledExample />
</DocsExample>

