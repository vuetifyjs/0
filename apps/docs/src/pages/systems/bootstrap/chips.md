---
title: BChips - Bootstrap 6 Chips for Vue
meta:
- name: description
  content: Bootstrap 6 chip markup with Vuetify0 selection — choice chips or a chip input that commits on Enter and comma, styled by your own Bootstrap CSS.
- name: keywords
  content: bootstrap 6 chips, vue chips, tags, chip input, createSelection, bootstrap vue, paper bootstrap
features:
  category: Component
  label: 'C: BChips'
  level: 2
  renderless: false
  group: forms
related:
  - /systems/bootstrap
  - /composables/selection/create-selection
---

# BChips

Choice chips, or a field that turns typed text into chips. `v-model` is a list of strings either way.

<DocsPageFeatures :frontmatter />

<DocsBootstrapReference
  href="https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/forms/chips/"
  title="Chips"
/>

## Usage

The row is one `BChips` with four items: a plain chip, one with an avatar, one with an icon, and a dismissible chip. `dismissible` is one switch for the whole component, so each chip has a remove button. The row is locked to the chip height. When the last chip is removed, Reset restores the four, in that same height. Without `input`, each choice item is a `span.chip` and Click, Enter, or Space toggles `.active`. With `input`, the root is `div.chip-input`. Enter or a comma commits a chip. Backspace on an empty field selects the last chip, and Backspace again removes it.

::: ds-example
/systems/bootstrap/chips/basic
:::

### The markup Bootstrap documents

The HTML tab is the pin. The Vue tab is the choice face. `data-bs-chips` is the bundle's behavior. This package does not emit it.

::: code-group no-filename

```html Bootstrap collapse
<span class="chip theme-primary">Default</span>
<span class="chip theme-primary active">Active</span>
```

```vue Vue collapse
<template>
  <BChips v-model="picked" theme="primary" :items="items" />
</template>
```

:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BChips } from '@paper/bootstrap'
</script>

<template>
  <BChips />
</template>
```

## Composed on v0

Choice chips are a [createSelection](/composables/selection/create-selection) with `multiple`. Click, Enter, or Space toggles a chip. There is no `createChips`.

The input face does not use that selection. The model is the list. Enter, `separator` (a comma, unless you change it), and leaving the field commit a trimmed string. A duplicate is ignored. Backspace or Delete on an empty field selects the last chip. The same key on a selected chip removes it. Arrow keys move between the chips and the field. Home and End move to the first and last chip. Escape clears that selection and focuses the field. A dismiss button removes that string and emits `dismiss`.

An item `src` renders `img.chip-img`. `icon` renders `span.chip-icon` with the pin's person glyph. `theme` adds `theme-{theme}` on each choice chip, or on the input root.

## Examples

::: ds-example
/systems/bootstrap/chips/input

### Input

`input` switches to the field. The model starts as the chips already shown. Enter and comma add a trimmed string. A duplicate is ignored. Backspace on an empty field selects the last chip, and Backspace again removes it. Dismiss removes one entry. The choice selection is not involved.
:::

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `string[]` | `[]` | Selected values, or the input-face chip list. |
| `input` | `boolean` | `false` | `div.chip-input` instead of choice chips. |
| `items` | `{ value, text, src?, icon? }[]` | `[]` | Choice-face chips. Ignored when `input` is set. |
| `placeholder` | `string` | `''` | Ghost input placeholder. |
| `separator` | `string` | `','` | Also commits the field. Enter always commits. |
| `dismissible` | `boolean` | on for input, off for choice | Shows `button.chip-dismiss`. |
| `theme` | `string` | | Adds `theme-{theme}`. |
| `label` | `string` | | `label.chip-input-label` on the input face. |
| `disabled` | `boolean` | `false` | Blocks toggle, commit, and dismiss. |

## Accessibility

Choice chips are `role="button"` with `aria-pressed`, and they are in the tab order. A `class` on `BChips` lands on each choice chip. Input chips are focusable. Home and End move to the ends. Escape leaves them. The dismiss button is named `Chips.remove`, or Remove. It is `type="button"`, and it stays out of the tab order. The ghost input is a text field. Pass `label` so the input has a name, or label it from outside with the generated id.
