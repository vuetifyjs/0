---
title: BCombobox - Bootstrap 6 Combobox for Vue
meta:
- name: description
  content: Bootstrap 6 combobox markup with Vuetify0 selection — a form-control toggle, a menu of options, and a hidden input, styled by your own Bootstrap CSS.
- name: keywords
  content: bootstrap 6 combobox, vue combobox, select, menu, createCombobox, bootstrap vue, paper bootstrap
features:
  category: Component
  label: 'C: BCombobox'
  level: 2
  renderless: false
  group: forms
related:
  - /systems/bootstrap
  - /systems/bootstrap/menu
  - /composables/forms/create-combobox
  - /composables/system/use-popover
---

# BCombobox

A form control that opens a menu of options. The selected value is `v-model`. The menu opens even when there are no options.

<DocsPageFeatures :frontmatter />

> [!NOTE]
> Reference: [Combobox on the Bootstrap 6 preview](https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/forms/combobox/). Classes and visual variants. This page is Vue.

## Usage

`v-model` is the selected value. `.show` on `.menu` is the open state, and it is not a prop.

::: ds-example
/systems/bootstrap/combobox/basic
:::

### The markup Bootstrap documents

The HTML tab is the control the v6 plugin enhances. The Vue tab renders the same toggle, caret, and menu items. `data-bs-toggle` and `data-bs-value` are the bundle's behavior. This package does not emit them.

::: code-group no-filename

```html Bootstrap collapse
<button class="form-control combobox-toggle" type="button">
  <span class="combobox-value">Pick a country…</span>
  <svg class="combobox-caret" width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.46967 5.46967C0.762563 5.17678 1.23744 5.17678 1.53033 5.46967L5 8.93934L8.46967 5.46967C8.76256 5.17678 9.23744 5.17678 9.53033 5.46967C9.82322 5.76256 9.82322 6.23744 9.53033 6.53033L5.53033 10.5303C5.23744 10.8232 4.76256 10.8232 4.46967 10.5303L0.46967 6.53033C0.176777 6.23744 0.176777 5.76256 0.46967 5.46967Z" fill="currentcolor"/></svg>
</button>
<div class="menu">
  <button class="menu-item" type="button">United States</button>
  <button class="menu-item selected" type="button" aria-selected="true">United Kingdom</button>
</div>
```

```vue Vue collapse
<template>
  <BCombobox v-model="country" name="country" placeholder="Pick a country…" :items="items" />
</template>
```

:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BCombobox } from '@paper/bootstrap'
</script>

<template>
  <BCombobox />
</template>
```

## Composed on v0

Options are onboarded into [createCombobox](/composables/forms/create-combobox). The menu renders that registry's filtered set, so an empty query shows every option. This component draws the toggle and the items itself.

The panel is positioned with [usePopover](/composables/system/use-popover), the same way [BMenu](/systems/bootstrap/menu) is. The placement is bottom-start. `data-bs-placement` is that token, which the menu stylesheet uses for `transform-origin`. The menu does not use the native `popover` attribute. That would put it in the top layer and fight `.menu { position: absolute }`.

`createCombobox` also builds a popover. It is not attached. Attaching it would call `showPopover` on this menu.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `string` | | Selected value. |
| `items` | `{ value: string, text: string }[]` | `[]` | Options. An empty list still opens the menu. |
| `placeholder` | `string` | `''` | Text in `.combobox-value` when nothing is selected. |
| `name` | `string` | | Renders a hidden input with this name. |
| `disabled` | `boolean` | `false` | Disables the toggle. |
| `size` | `'sm' \| 'lg'` | | Adds `form-control-sm` or `form-control-lg`. |

## Accessibility

The toggle is a `button` with `aria-expanded` and `aria-haspopup="listbox"`. `aria-controls` points at the menu. The selected item has `.selected` and `aria-selected="true"`. Escape closes the menu and returns focus to the toggle. Arrow Down opens it. A click outside closes it.
