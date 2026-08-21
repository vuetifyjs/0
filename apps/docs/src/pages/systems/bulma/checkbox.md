---
title: BuCheckbox - Bulma Checkbox for Vue
meta:
- name: description
  content: Bulma's checkbox for Vue — a native checkbox wrapped in label.checkbox, with v-model, the documented label disabled treatment, and Vuetify0 validation.
- name: keywords
  content: bulma checkbox, vue checkbox, label checkbox, native checkbox, bulma vue, paper bulma
features:
  category: Component
  label: 'C: BuCheckbox'
  level: 2
  renderless: false
  order: 16
related:
  - /systems/bulma
  - /systems/bulma/field
  - /systems/bulma/radio
---

# BuCheckbox

<DocsPageFeatures :frontmatter />

A native checkbox wrapped in `label.checkbox`. The default slot is the label text, so the whole row is the click target. `v-model` is a boolean.

> [!NOTE]
> Reference: [Checkbox on bulma.io](https://bulma.io/documentation/form/checkbox/) — classes and visual variants. This page is the JavaScript.

## Usage

The slot is the visible name. Leave it empty and the control has no text — pass content, or the checkbox is an unnamed box. Links and other inline markup are allowed in the slot; that is the nested-link shape Bulma documents.

There are no color modifiers. A failing value sets `aria-invalid` on the input and does not paint `is-danger` — Bulma's checkbox has no color classes.

::: ds-example
/systems/bulma/checkbox/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BuCheckbox } from '@paper/bulma'
</script>

<template>
  <BuCheckbox />
</template>
```

## Composed on v0

`BuCheckbox` calls [createInput](/composables/forms/create-input) for validation, form registration, the generated id and `aria-invalid`. The element is a native `<input type="checkbox">` inside `<label class="checkbox">`.

It does **not** wrap v0's Checkbox compound. That compound is a `role="checkbox"` button with an indicator slot; Bulma styles a visible native checkbox, and a button gets none of your CSS. This is the Ruling 2 deviation: Tier 1 wraps the native where the stylesheet demands it. Do not replace this with v0 Checkbox and expect it to look like Bulma.

Fallthrough is split. `class` and `style` merge onto the wrapping label; every other attribute lands on the native input.

## The markup you know

The Bulma tab is the markup [published on bulma.io](https://bulma.io/documentation/form/checkbox/), captured verbatim in the conformance fixture. The Vue tab is the component that renders it. The conformance suite diffs the two on every test run — element for element, class for class.

::: code-group no-filename

```html Bulma
<label class="checkbox">
  <input type="checkbox" />
  Remember me
</label>
```

```vue Vue
<template>
  <BuCheckbox>Remember me</BuCheckbox>
</template>
```

:::

A list of checkboxes sits in a `.checkboxes` wrapper — a Bulma 1.0 layout class, not a component. There is no checkbox group in Tier 1.

## Examples

::: ds-example
/systems/bulma/checkbox/disabled

### Disabled

`disabled` lands on both the wrapping label and the native input. The input's `disabled` is the real one: it takes the control out of the tab order, blocks the toggle, and keeps it out of form submission. The label's `disabled` is the non-standard attribute Bulma documents and styles — `label.checkbox[disabled]` is what greys the text.

That second attribute is markup fidelity, not a platform feature. HTML does not define `disabled` on `<label>`. Expect axe and validator discussion; the suite keeps it because dropping it would fail the fixture and lose Bulma's label treatment. Assistive technology respects the input, which is also disabled.

The checked state is preserved. A disabled checkbox that was already on stays on — it just cannot change. Reach for this when a preference is locked by a precondition; hide the row entirely when the question will never apply.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with BuCheckbox.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `boolean` | `false` | Checked state |
| `disabled` | `boolean` | `false` | Disables the input **and** puts `disabled` on the wrapping label |
| `error` | `boolean` | `false` | Force the invalid state (`aria-invalid`, no color class) |
| `error-messages` | `string \| string[]` | — | Manual errors, merged with rule errors |
| `form` | `string` | — | Id of the form to associate with. Snapshotted at setup |
| `id` | `string \| number` | auto | Input id; generated when omitted. Snapshotted at setup |
| `name` | `string` | — | Form field name. Snapshotted at setup |
| `required` | `boolean` | — | Marks the field required. Snapshotted at setup; the DOM attr stays reactive |
| `rules` | `ValidationRule[]` | `[]` | Validation rules. Snapshotted at setup |
| `validate-on` | `ValidateOn` | `'blur'` | When validation runs |

The default slot is the label text. Slot props: `errors`, `isChecked`, `isFocused`, `isValid`.

`id`, `name`, `form`, `required` and `rules` are snapshotted at setup because `createInput` takes plain values for those options.

## Accessibility

The widget is a native checkbox. The wrapping `<label>` is both the name and the hit target — clicking the text toggles the box, and the slot content is the accessible name.

### Naming

Put the name in the default slot. An empty slot is an unnamed checkbox. Inline links in the slot are fine; they are part of the name.

### Disabled

Two attributes, one job:

| Where | What it does |
|-------|----------------|
| `input[disabled]` | Native. Not focusable, not submitted, not togglable |
| `label[disabled]` | Non-standard. Bulma's CSS greys the label text |

The label attribute will show up in axe and HTML validators. It is a declared SPEC limitation, kept so the greying matches upstream. Do not strip it in userland to silence the warning — you would desync from `bulma.css`.

### Validation

`aria-invalid` when `isValid === false`. No `is-danger`, no color modifier. A sibling `BuHelp` is not automatically associated; `createInput` on this component is not an `Input.Root` context.
