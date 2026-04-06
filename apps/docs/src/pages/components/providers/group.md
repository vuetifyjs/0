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

# Group

A headless component for managing multi-selection with batch operations and tri-state support.

<DocsPageFeatures :frontmatter />

## Usage

The Group component is a specialization of Selection that enforces multi-selection behavior and supports batch operations on arrays of IDs. It always uses array-based v-model binding.

::: example
/components/group/basic

### Multi-Selection Group

Button items in a group with shared multi-selection state — toggling any item updates the shared selection.

:::

## Features

### Batch Operations

The default slot exposes `selectAll`, `unselectAll`, and `toggleAll` methods for operating on all items at once:

```vue
<template>
  <Group.Root v-model="selected">
    <template #default="{ selectAll, unselectAll, toggleAll, isAllSelected, isMixed }">
      <button @click="toggleAll">
        {{ isAllSelected ? 'Deselect All' : 'Select All' }}
      </button>

      <Group.Item v-for="item in items" :key="item" :value="item">
        {{ item }}
      </Group.Item>
    </template>
  </Group.Root>
</template>
```

### Tri-State

The slot props `isAllSelected`, `isNoneSelected`, and `isMixed` reflect the aggregate selection state — useful for driving an "indeterminate" checkbox:

```vue
<template>
  <Group.Root v-model="selected">
    <template #default="{ isAllSelected, isMixed, toggleAll }">
      <input
        type="checkbox"
        :checked="isAllSelected"
        :indeterminate="isMixed"
        @change="toggleAll"
      />
    </template>
  </Group.Root>
</template>
```

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
