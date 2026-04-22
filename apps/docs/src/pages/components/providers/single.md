---
title: Single - Radio Group Pattern for Vue 3
meta:
- name: description
  content: Build radio buttons and single-selection UIs with automatic deselection. Extends Selection composable for tabs, toggles, and exclusive choice patterns in Vue 3.
- name: keywords
  content: single, radio button, single-select, tabs, toggle, Vue 3, headless, exclusive selection
features:
  category: Component
  label: 'C: Single'
  github: /components/Single/
  renderless: true
  level: 2
related:
  - /composables/selection/create-single
  - /components/providers/selection
---

# Single

A headless component for managing single-selection with automatic deselection of previous items.

<DocsPageFeatures :frontmatter />

## Usage

The Single component is a specialization of Selection that enforces single-selection behavior. When an item is selected, any previously selected item is automatically deselected.

::: example
/components/single/basic

### Single-Select Group

Radio-button-style single selection with size options that automatically deselects the previous choice.

:::

## Features

### Auto-Enrollment

Set `enroll` to automatically select the first registered item. Useful when items are rendered dynamically:

```vue
<template>
  <!-- First item to register is selected automatically -->
  <Single.Root enroll v-model="selected">
    <Single.Item v-for="opt in options" :key="opt" :value="opt">
      {{ opt }}
    </Single.Item>
  </Single.Root>
</template>
```

### Mandatory Selection

Use `mandatory` to prevent deselecting the currently selected item. Use `mandatory="force"` to also auto-select the first item on mount:

```vue
<template>
  <!-- User cannot deselect — at least one item must remain selected -->
  <Single.Root mandatory v-model="selected">
    <Single.Item value="a">Option A</Single.Item>
    <Single.Item value="b">Option B</Single.Item>
  </Single.Root>
</template>
```

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
