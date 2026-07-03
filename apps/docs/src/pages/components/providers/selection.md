---
title: Selection - Headless Selection State for Vue 3
meta:
  - name: description
    content: Manage selection state in Vue 3 collections. Build checkboxes, radio groups, and listboxes with full v-model support, mandatory selection, and item enrollment.
  - name: keywords
    content: selection, checkbox, radio group, listbox, Vue 3, headless, v-model, state management
features:
  category: Component
  label: 'C: Selection'
  github: /components/Selection/
  renderless: true
  level: 2
related:
  - /composables/selection/create-selection
  - /components/providers/single
  - /components/providers/group
---

# Selection

A headless component for managing selection state in collections with support for single and multi-selection patterns.

<DocsPageFeatures :frontmatter />

## Usage

The Selection component provides a wrapper and item pattern for managing selection state in collections. It uses the `createSelection` composable internally and provides full v-model support with automatic state synchronization.

::: gn-example
/components/selection/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Selection } from '@vuetify/v0'
</script>

<template>
  <Selection.Root>
    <Selection.Item />
  </Selection.Root>
</template>
```

## FAQ

::: faq

??? When should I use Selection vs Single or Group?

Selection is the shared base for collection selection. Use [Single](/components/providers/single) to enforce exactly one choice, and [Group](/components/providers/group) for multi-selection with batch operations and tri-state — both specialize Selection.

??? Is the Selection component the same as the createSelection composable?

The component wraps [createSelection](/composables/selection/create-selection) internally, exposing the same logic through a compound `Selection.Root` / `Selection.Item` template API. Reach for the composable directly when you need state without the component surface.

??? How do I read or set the selection from outside?

Bind `v-model` on `Selection.Root` — it provides full v-model support with automatic synchronization between the model and the selected items.

:::

<DocsApi />
