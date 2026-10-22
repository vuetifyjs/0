---
title: BFormAdorn - Bootstrap 6 form adorn for Vue
meta:
- name: description
  content: Bootstrap 6 form adorn for Vue. A label with form-control and form-adorn around an icon or text and a ghost input.
- name: keywords
  content: bootstrap 6 form adorn, vue input adornment, form-ghost, form-adorn-icon, paper bootstrap
features:
  category: Component
  label: 'C: BFormAdorn'
  level: 2
  renderless: false
  group: forms
related:
  - /systems/bootstrap
  - /systems/bootstrap/input-group
  - /systems/bootstrap/check
---

# BFormAdorn

A field with an icon or a text prefix inside the control. The root is a label with `form-control` and `form-adorn`. The input is `form-ghost`.

<DocsPageFeatures :frontmatter />

> [!NOTE]
> Reference: [Form adorn on the Bootstrap 6 preview](https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/forms/form-adorn/). Classes and visual variants. This page is Vue.

## Usage

Put the adornment first in the slot, then the control. Clicking the icon, the text, or the padding focuses the input, because the root is a label. `end` flips the adornment to the trailing side without changing that order.

::: ds-example
/systems/bootstrap/form-adorn/basic
:::

### The markup Bootstrap documents

The icon wrapper is `div.form-adorn-icon` and is hidden from the accessibility tree. A wrapping label plus a separate `label for` the input's id are both allowed. Do not put a button inside the label.

::: code-group no-filename

```html Bootstrap collapse
<label class="form-control form-adorn">
  <div class="form-adorn-icon" aria-hidden="true">
    <svg class="bi" width="16" height="16"><use href="#search" /></svg>
  </div>
  <input type="search" class="form-ghost" placeholder="Search...">
</label>
```

```vue Vue collapse
<template>
  <BFormAdorn>
    <BFormAdorn.Icon>
      <svg class="bi" width="16" height="16"><use href="#search" /></svg>
    </BFormAdorn.Icon>
    <BFormAdorn.Control type="search" placeholder="Search..." />
  </BFormAdorn>
</template>
```

:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BFormAdorn } from '@paper/bootstrap'
</script>

<template>
  <BFormAdorn>

    <BFormAdorn.Icon />

    <BFormAdorn.Text />

    <BFormAdorn.Control />

  </BFormAdorn>
</template>
```

## Composed on v0

Nothing in v0 owns this markup. The root is the label from the snippet, the icon and the text are presentational, and the control is a native input with `form-ghost`. Its id comes from `useId` when you do not pass one. A second label outside the adornment can still point at that id.

## Examples

::: ds-example
/systems/bootstrap/form-adorn/text

### Text

`BFormAdorn.Text` is `span.form-adorn-text`. Use it for a currency symbol, a unit, or a domain suffix. It is `aria-hidden`, same as the icon, so it does not join the input's accessible name. `end` adds `form-adorn-end` and keeps the adornment before the input in the DOM.
:::

::: ds-example
/systems/bootstrap/form-adorn/sizes

### Sizes

`sm` adds `form-control-sm`. `lg` adds `form-control-lg`. Both sit on the label with `form-control` and `form-adorn`. The pin's prose names `form-adorn-sm` and `form-adorn-lg`, and those selectors are not in the stylesheet. The rendered example uses the `form-control` size classes.
:::

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `end` | `boolean` | `false` | `form-adorn-end` on the label. |
| `size` | `'sm' \| 'lg'` | — | `form-control-sm` or `form-control-lg` on the label. |

`BFormAdorn.Control` is the ghost input.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `string` | `''` | The input value. |
| `type` | `string` | `'text'` | Native type. `search` and `email` are the usual ones. |
| `placeholder` | `string` | — | Native placeholder. |
| `disabled` | `boolean` | `false` | Native `disabled`. |
| `id` | `string` | generated | For an outside label's `for`. |
| `name` | `string` | — | Native name. |

`BFormAdorn.Icon` and `BFormAdorn.Text` take no props. Both set `aria-hidden="true"`.

## Accessibility

The root label focuses the ghost input when the adornment or the padding is clicked. The icon and the text are `aria-hidden`, so a screen reader does not announce "$" as part of the name. Put the real name on a label outside the adornment, pointed at the control's `id`, or on `aria-label` on the control. Do not put another interactive control inside the label. A label must not contain one.
