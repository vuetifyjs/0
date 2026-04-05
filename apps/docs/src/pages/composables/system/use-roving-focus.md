---
title: useRovingFocus - Keyboard Navigation for Composite Widgets
meta:
- name: description
  content: Roving tabindex composable for keyboard navigation within toolbars, listboxes, grids, and other composite widgets. Supports orientation, grid mode, circular navigation, and disabled item skipping.
- name: keywords
  content: useRovingFocus, roving tabindex, keyboard navigation, composable, Vue 3, toolbar, grid, listbox, aria
features:
  category: Composable
  label: 'E: useRovingFocus'
  github: /composables/useRovingFocus/
  level: 2
related:
  - /components/disclosure/treeview
  - /composables/system/use-hotkey
  - /composables/system/use-event-listener
  - /composables/selection/create-step
---

# useRovingFocus

A composable for keyboard navigation within composite widgets using the roving tabindex pattern.

<DocsPageFeatures :frontmatter />

## Usage

`useRovingFocus` manages focus across a group of items — only the active item has `tabindex="0"`, all others have `tabindex="-1"`. Arrow keys move focus between items, automatically skipping disabled ones. Supports linear (horizontal/vertical) and grid (2D) navigation modes.

```vue collapse no-filename useRovingFocus
<script setup lang="ts">
  import { useRovingFocus } from '@vuetify/v0'
  import { useTemplateRef } from 'vue'

  const toolbar = useTemplateRef('toolbar')

  const items = [
    { id: 'bold', label: 'Bold' },
    { id: 'italic', label: 'Italic' },
    { id: 'underline', label: 'Underline', disabled: true },
    { id: 'strike', label: 'Strikethrough' },
  ]

  const { focusedId, isTabbable } = useRovingFocus(
    () => items.map(item => ({
      id: item.id,
      el: () => toolbar.value?.querySelector(`[data-id="${item.id}"]`),
      disabled: item.disabled,
    })),
    { target: toolbar, orientation: 'horizontal' },
  )
</script>

<template>
  <div ref="toolbar" role="toolbar" aria-label="Formatting">
    <button
      v-for="item in items"
      :key="item.id"
      :data-id="item.id"
      :tabindex="isTabbable(item.id) ? 0 : -1"
      :disabled="item.disabled"
    >
      {{ item.label }}
    </button>
  </div>
</template>
```

## Architecture

`useRovingFocus` builds on `useEventListener` for keydown handling. It is a standalone composable — not part of the registry/selection hierarchy — making it composable alongside `createSingle` or `createSelection` for widgets that separate focus from selection (e.g., listboxes, selects).

```mermaid "Roving Focus Architecture"
flowchart TD
  useEventListener --> useRovingFocus
  useRovingFocus --> Linear["Linear: toolbar, menu, tabs"]
  useRovingFocus --> Grid["Grid: calendar, color picker, data table"]
  useRovingFocus --> Composed["+ createSingle = listbox/select"]
```

## Reactivity

| Property/Method | Reactive | Notes |
| - | :-: | - |
| `focusedId` | <AppSuccessIcon /> | ShallowRef, tracks currently focused item |
| `isTabbable(id)` | - | Returns `true` for the one item that should have `tabindex="0"` |
| `focus(id)` | - | Programmatically focus an item by ID |
| `next()` | - | Move focus to next enabled item |
| `prev()` | - | Move focus to previous enabled item |
| `first()` | - | Move focus to first enabled item |
| `last()` | - | Move focus to last enabled item |
| `onKeydown` | - | Keydown handler — auto-bound when `target` is provided |

## Examples

::: example
/composables/use-roving-focus/Grid.vue 1
/composables/use-roving-focus/grid.vue 2

### Color Grid

2D grid navigation with the `columns` option. Arrow keys navigate in two dimensions, Home/End are row-scoped, Ctrl+Home/End jump to absolute first/last.

| File | Role |
|------|------|
| `Grid.vue` | Color swatch grid with 2D keyboard navigation |
| `grid.vue` | Entry point rendering a material color palette |
:::

<DocsApi />
