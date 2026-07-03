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

::: gn-example
/components/group/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Group } from '@vuetify/v0'
</script>

<template>
  <Group.Root>
    <Group.Item />
  </Group.Root>
</template>
```

## Recipes

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

## FAQ

::: faq

??? When should I use Group instead of [Selection](/components/providers/selection)?

Group is a specialization of Selection that always binds an array and enforces multi-selection, adding batch operations (`selectAll`, `unselectAll`, `toggleAll`) and tri-state aggregate state. Reach for Selection when you want the general wrapper; reach for Group for a checkbox group with select-all.

??? How do I drive an indeterminate checkbox from the group's state?

Bind `isAllSelected` to the checkbox's `checked` and `isMixed` to its `indeterminate`, then call `toggleAll` on change — all three are exposed on the default slot.

??? Can I bind a single value instead of an array?

No — Group always uses array-based v-model. For single-choice state use [Single](/components/providers/single) instead.

:::

<DocsApi />
