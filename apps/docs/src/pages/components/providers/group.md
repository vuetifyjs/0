---
title: Group - Checkbox Group with Tri-State Support
meta:
- name: description
  content: Create checkbox groups with tri-state and indeterminate support. Multi-selection with batch operations, select-all patterns, and array-based v-model binding.
- name: keywords
  content: group, checkbox, multi-select, tri-state, indeterminate, select all, Vue 3, headless
features:
  category: Component
  label: 'C: Group'
  github: /components/Group/
  renderless: true
  level: 2
related:
  - /composables/selection/create-group
  - /components/providers/selection
---

<script setup>
import BasicExample from '@/examples/components/group/basic.vue'
import BasicExampleRaw from '@/examples/components/group/basic.vue?raw'
</script>

# Group

A headless component for managing multi-selection with batch operations and tri-state support.

<DocsPageFeatures :frontmatter />

## Usage

The Group component is a specialization of Selection that enforces multi-selection behavior and supports batch operations on arrays of IDs. It always uses array-based v-model binding.

<DocsExample file="basic.vue" :code="BasicExampleRaw" peek>
  <BasicExample />
</DocsExample>

## Anatomy

```vue Anatomy playground
<script setup lang="ts">
  import { Group } from '@vuetify/v0'
</script>

<template>
  <Group.Root>
    <Group.Item />
  </Group.Root>
</template>
```

<DocsApi />
