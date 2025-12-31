---
title: Group - Checkbox Group with Tri-State Support
meta:
- name: description
  content: Create checkbox groups with tri-state and indeterminate support. Multi-selection with batch operations, select-all patterns, and array-based v-model binding.
- name: keywords
  content: group, checkbox, multi-select, tri-state, indeterminate, select all, Vue 3, headless
features:
  category: Component
  label: 'E: Group'
  github: /components/Group/
  renderless: true
related:
  - /composables/selection/use-group
  - /components/providers/selection
---

<script setup>
import BasicExample from '@/examples/components/group/basic.vue'
import BasicExampleRaw from '@/examples/components/group/basic.vue?raw'
import SelectAllExample from '@/examples/components/group/select-all.vue'
import SelectAllExampleRaw from '@/examples/components/group/select-all.vue?raw'
</script>

# Group

A headless component for managing multi-selection with batch operations and tri-state support.

<DocsPageFeatures :frontmatter />

## Usage

The Group component is a specialization of Selection that enforces multi-selection behavior and supports batch operations on arrays of IDs. It always uses array-based v-model binding.

<DocsExample file="basic.vue" title="Basic Multi-Selection" :code="BasicExampleRaw">
  <BasicExample />
</DocsExample>

## Anatomy

```vue Anatomy
<script setup lang="ts">
  import { Group } from '@vuetify/v0'
</script>

<template>
  <Group.Root v-model="selected" v-slot="{ attrs }">
    <div v-bind="attrs">
      <Group.Item value="apple" v-slot="{ attrs }">
        <button v-bind="attrs">Apple</button>
      </Group.Item>

      <Group.Item value="banana" v-slot="{ attrs }">
        <button v-bind="attrs">Banana</button>
      </Group.Item>
    </div>
  </Group.Root>
</template>
```

## Select All

The Group component exposes select-all helpers through its slot props for implementing "select all" checkbox patterns:

- **`isNoneSelected`**: True when no items are selected
- **`isAllSelected`**: True when all selectable items are selected
- **`isMixed`**: True when some but not all are selected
- **`selectAll`**: Selects all non-disabled items
- **`unselectAll`**: Unselects all items (respects mandatory option)
- **`toggleAll`**: Toggles between all selected and none selected

<DocsExample file="select-all.vue" title="Select All Pattern" :code="SelectAllExampleRaw">
  <SelectAllExample />
</DocsExample>

<DocsApi />
