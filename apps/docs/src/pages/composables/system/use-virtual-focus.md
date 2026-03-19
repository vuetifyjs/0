---
title: useVirtualFocus - Keyboard Navigation Without Moving DOM Focus
meta:
- name: description
  content: Virtual focus composable for keyboard navigation where DOM focus stays on a control element. Powers combobox, autocomplete, and select patterns with aria-activedescendant.
- name: keywords
  content: useVirtualFocus, virtual focus, aria-activedescendant, combobox, autocomplete, composable, Vue 3, keyboard navigation, listbox
features:
  category: Composable
  label: 'E: useVirtualFocus'
  github: /composables/useVirtualFocus/
  level: 2
related:
  - /composables/system/use-roving-focus
  - /composables/system/use-event-listener
  - /composables/selection/create-single
---

# useVirtualFocus

A composable for keyboard navigation where DOM focus stays on a single control element while a visual highlight moves across items.

<DocsPageFeatures :frontmatter />

## Usage

`useVirtualFocus` manages a virtual highlight across a list of items — DOM focus never leaves the control element (typically an `<input>`). Arrow keys move the highlight, `aria-activedescendant` on the control references the active item, and `data-highlighted` is set on the highlighted element. This is the standard pattern for comboboxes, autocompletes, and searchable selects.

```vue collapse no-filename useVirtualFocus
<script setup lang="ts">
  import { useVirtualFocus } from '@vuetify/v0'
  import { useTemplateRef } from 'vue'

  const input = useTemplateRef('input')
  const list = useTemplateRef('list')

  const options = [
    { id: 'opt-1', label: 'Option 1' },
    { id: 'opt-2', label: 'Option 2' },
    { id: 'opt-3', label: 'Option 3', disabled: true },
    { id: 'opt-4', label: 'Option 4' },
  ]

  const { highlightedId } = useVirtualFocus(
    () => options.map(item => ({
      id: item.id,
      el: () => list.value?.querySelector(`[data-id="${item.id}"]`),
      disabled: item.disabled,
    })),
    { control: input, orientation: 'vertical' },
  )
</script>

<template>
  <div>
    <input
      ref="input"
      aria-controls="listbox"
      aria-expanded="true"
      role="combobox"
    />

    <ul id="listbox" ref="list" role="listbox">
      <li
        v-for="item in options"
        :id="item.id"
        :key="item.id"
        :data-id="item.id"
        role="option"
      >
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>
```

## Architecture

`useVirtualFocus` shares its traversal kernel with `useRovingFocus` — both build on `createFocusTraversal`. The difference: roving focus moves real DOM focus between items, while virtual focus keeps DOM focus on a control and moves a data attribute highlight.

```mermaid "Virtual Focus Architecture"
flowchart TD
  createFocusTraversal --> useVirtualFocus
  useVirtualFocus --> Select["Select / Listbox"]
  useVirtualFocus --> Combobox["Combobox / Autocomplete"]
```

## Reactivity

| Property/Method | Reactive | Notes |
| - | :-: | - |
| `highlightedId` | <AppSuccessIcon /> | ShallowRef, tracks the currently highlighted item |
| `highlight(id)` | - | Programmatically highlight an item by ID |
| `clear()` | - | Remove the highlight |
| `next()` | - | Move highlight to next enabled item |
| `prev()` | - | Move highlight to previous enabled item |
| `first()` | - | Move highlight to first enabled item |
| `last()` | - | Move highlight to last enabled item |
| `onKeydown` | - | Keydown handler — auto-bound to `target` or `control` |

## Examples

::: example
/composables/use-virtual-focus/Listbox.vue 1
/composables/use-virtual-focus/listbox.vue 2

### Searchable Fruit Picker

A searchable listbox where the input keeps DOM focus. Arrow keys navigate filtered results, Enter selects the highlighted item, and disabled items are skipped.

| File | Role |
|------|------|
| `Listbox.vue` | Reusable listbox component using useVirtualFocus |
| `listbox.vue` | Entry point with a fruit list |
:::

<DocsApi />
