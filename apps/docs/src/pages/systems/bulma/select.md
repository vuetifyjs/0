---
title: BuSelect - Bulma Select for Vue
meta:
- name: description
  content: Bulma's native select for Vue — a .select wrapping a real select element, with v-model, multiple, color and size modifiers, and Vuetify0 validation.
- name: keywords
  content: bulma select, vue select, native select, is-multiple, bulma vue, paper bulma
features:
  category: Component
  label: 'C: BuSelect'
  level: 2
  renderless: false
  order: 15
related:
  - /systems/bulma
  - /systems/bulma/field
  - /composables/forms/create-input
---

# BuSelect

<DocsPageFeatures :frontmatter />

Bulma's `.select` wrapping a real `<select>`. Native options go in the default slot; `v-model` is a string, or a string array when `multiple` is set.

> [!NOTE]
> Reference: [Select on bulma.io](https://bulma.io/documentation/form/select/) — classes and visual variants. This page is the JavaScript.

## Usage

This is a styled native select, not a listbox. Put `<option>` (and `<optgroup>`) elements in the default slot the way you would in HTML. Color, size, rounded, multiple and loading land on the `.select` wrapper.

`v-model` is `string | string[] | undefined`. Bind a `shallowRef` for a single select and a `ref([])` for `multiple`. An uncontrolled multiple select is healed to `[]` at setup so Vue does not warn on mount.

::: ds-example
/systems/bulma/select/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BuSelect } from '@paper/bulma'
</script>

<template>
  <BuSelect />
</template>
```

## Composed on Vuetify0

`BuSelect` calls [createInput](/composables/forms/create-input) for validation, form registration, the generated id and `aria-invalid`. The element is a native `<select>` inside `div.select`.

It does **not** wrap v0's [Select](/components/forms/select) compound. That compound is a listbox — `role="listbox"`, virtual focus, a popover of items — and none of that is an element Bulma's `.select` CSS can paint. A non-native `BuSelect` would get none of your stylesheet. This is the Ruling 2 deviation: Tier 1 form controls wrap the native where Bulma's CSS demands it.

Fallthrough is split. `class` and `style` merge onto the wrapper; every other attribute (`aria-*`, `autofocus`, `data-*`, …) lands on the native select. `inheritAttrs` is false, so nothing double-applies.

## The markup you know

The Bulma tab is the markup [published on bulma.io](https://bulma.io/documentation/form/select/), captured verbatim in the conformance fixture. The Vue tab is the component that renders it. The conformance suite diffs the two on every test run — element for element, class for class.

::: code-group no-filename

```html Bulma
<div class="select">
  <select>
    <option>Select dropdown</option>
    <option>With options</option>
  </select>
</div>
```

```vue Vue
<template>
  <BuSelect>
    <option>Select dropdown</option>
    <option>With options</option>
  </BuSelect>
</template>
```

:::

Icons wrap the select, they do not go on it. A `BuControl` with `icons="left"` around `BuSelect` is the documented pairing; the icon size tracks the select size.

`loading` is the exception to the input family's rule: `is-loading` goes on the `.select` wrapper here, where it replaces the dropdown arrow, not on a wrapping control.

## Examples

::: ds-example
/systems/bulma/select/multiple

### Multiple

`multiple` does two things at once: `is-multiple` on the wrapper, and the native `multiple` attribute on the select. `v-model` becomes a `string[]`. Bind a `ref([])` — arrays get `ref`, primitives get `shallowRef`.

`rows` is the native `size` attribute, not a CSS size. It is how many option rows are visible; it pairs with `multiple` the way Bulma documents it. CSS `size` (`is-small` and friends) is the `size` prop, and it still lands on the wrapper.

A failed value paints `is-danger` on the wrapper, same as color. There is no listbox keyboard map to document — the UA owns arrow keys, typeahead and space. If you need filtering, multi-select chips, or a trigger that is not a native select, that is v0's Select (or Combobox), and it will not look like Bulma's.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with BuSelect.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `string \| string[] \| undefined` | — | Selected value. Array when `multiple` |
| `color` | `'primary' \| 'link' \| 'info' \| 'success' \| 'warning' \| 'danger'` | — | `is-{color}` on the wrapper |
| `disabled` | `boolean` | `false` | Disables the native select |
| `error` | `boolean` | `false` | Force the invalid state — paints `is-danger` on the wrapper |
| `error-messages` | `string \| string[]` | — | Manual errors, merged with rule errors |
| `form` | `string` | — | Id of the form to associate with. Snapshotted at setup |
| `id` | `string \| number` | auto | Select id; generated when omitted. Snapshotted at setup |
| `loading` | `boolean` | `false` | `is-loading` on the wrapper — replaces the dropdown arrow |
| `multiple` | `boolean` | `false` | `is-multiple` on the wrapper plus the native `multiple` attr |
| `name` | `string` | — | Form field name. Snapshotted at setup |
| `required` | `boolean` | — | Marks the field required. Snapshotted at setup; the DOM attr stays reactive |
| `rounded` | `boolean` | `false` | `is-rounded` on the wrapper |
| `rows` | `number \| string` | — | Native `size` attribute — visible option rows |
| `rules` | `ValidationRule[]` | `[]` | Validation rules. Snapshotted at setup |
| `size` | `'small' \| 'normal' \| 'medium' \| 'large'` | — | `is-{size}` on the wrapper — omitted until passed |
| `validate-on` | `ValidateOn` | `'blur'` | When validation runs |

The default slot is the native `<select>` content. Slot props: `errors`, `isFocused`, `isValid`.

`id`, `name`, `form`, `required` and `rules` are snapshotted at setup because `createInput` takes plain values for those options.

## Accessibility

The widget is a native `<select>`. The UA provides the accessible name (a sibling `BuLabel` with `for`, or a wrapping label), the list of options, and the keyboard map. `BuSelect` adds `aria-invalid` when `isValid === false`.

### Naming

Point a `BuLabel` at the select's id, or wrap the field the way Bulma does. The wrapper `div.select` is presentational; it does not name the control.

### Keyboard

Arrow keys, Home / End, typeahead and Space are native. There is no roving tabindex and no `aria-activedescendant`. Do not reach for Vuetify0 Select to "upgrade" this — you would lose the markup your CSS is written for.

### Validation

`aria-invalid` is the only extra state. There is no `is-danger` on the native element; the class lands on `.select`. A sibling `BuHelp validation` still needs an ambient `Input.Root` to wire `aria-errormessage` — `createInput` on `BuSelect` is not that context.
