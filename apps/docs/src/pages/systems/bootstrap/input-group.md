---
title: BInputGroup - Bootstrap 6 input group for Vue
meta:
- name: description
  content: Bootstrap 6 input group for Vue. A div.input-group that slots controls, plus a span for the text add-on.
- name: keywords
  content: bootstrap 6 input group, vue input group, input-group-text, paper bootstrap
features:
  category: Component
  label: 'C: BInputGroup'
  level: 2
  renderless: false
  group: forms
related:
  - /systems/bootstrap
  - /systems/bootstrap/form-adorn
  - /systems/bootstrap/check
  - /systems/bootstrap/radio
---

# BInputGroup

An input group. The root is `div.input-group`. Text add-ons are `span.input-group-text`. The controls in the middle are yours.

<DocsPageFeatures :frontmatter />

<DocsBootstrapReference
  href="https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/forms/input-group/"
  title="Input group"
/>

## Usage

Slot the add-on and the control in the order they should appear. This component does not restyle the control. An input keeps `form-control`. A button, a select, or a textarea keeps its own classes. Give the text add-on an `id` and point the control's `aria-describedby` at it when the add-on describes the field.

::: ds-example
/systems/bootstrap/input-group/basic
:::

### The markup Bootstrap documents

The text add-on is a span. A label add-on in the pinned page is still the same class on a label you write yourself. This part is the span.

::: code-group no-filename

```html Bootstrap collapse
<div class="input-group">
  <span class="input-group-text" id="basic-addon1">@</span>
  <input type="text" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1">
</div>
```

```vue Vue collapse
<template>
  <BInputGroup>
    <BInputGroup.Text id="basic-addon1">@</BInputGroup.Text>
    <input class="form-control" type="text" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1">
  </BInputGroup>
</template>
```

:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BInputGroup } from '@paper/bootstrap'
</script>

<template>
  <BInputGroup>
    <BInputGroup.Text />
  </BInputGroup>
</template>
```

## Composed on v0

Nothing in v0 owns this markup. The group is a slot wrapper, and the text part is a span. Put a [BCheck](/systems/bootstrap/check) or a [BRadio](/systems/bootstrap/radio) in the add-on when the pinned checkbox and radio examples are what you want. The field label and the help text belong to the form field, which is a different component.

## Props

The root takes no props. Attributes fall through to the div.

| Part | Element | Description |
|------|---------|-------------|
| `BInputGroup` | `div.input-group` | Slots the add-ons and the controls. |
| `BInputGroup.Text` | `span.input-group-text` | Text, or a check or radio, inside the add-on. |

## Accessibility

The group is presentational. The control keeps its own role. If the add-on names or describes the control, give the span an `id` and set `aria-describedby` on the control. Do not put the visible field label inside the group. A label that is the add-on itself is markup you write. This part stays a span.
