---
title: BToggler - Bootstrap 6 Toggler for Vue
meta:
- name: description
  content: Bootstrap 6 toggler markup with a click handler — toggle a class or an attribute on the root or on an element id, styled by your own Bootstrap CSS.
- name: keywords
  content: bootstrap 6 toggler, vue class toggle, aria-pressed, attribute toggle, bootstrap vue, paper bootstrap
features:
  category: Component
  label: 'C: BToggler'
  level: 2
  renderless: false
  group: forms
related:
  - /systems/bootstrap
---

# BToggler

A click toggles a class, or some other attribute, on this element or on one you name by id. It is not a checkbox.

<DocsPageFeatures :frontmatter />

<DocsBootstrapReference
  href="https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/components/toggler/"
  title="Toggler"
/>

## Usage

`value` is the class token. Omit `target` and the click toggles it on the root. `aria-pressed` follows the class.

::: ds-example
/systems/bootstrap/toggler/basic
:::

### The markup Bootstrap documents

The HTML tab is the pin. The Vue tab is the same idea without the bundle's data attributes. `data-bs-toggle`, `data-bs-value`, `data-bs-attribute`, and `data-bs-target` are the bundle's behavior. This package does not emit them.

::: code-group no-filename

```html Bootstrap collapse
<div class="w-100 p-3 rounded border">
  Click to toggle fg-danger
</div>
```

```vue Vue collapse
<template>
  <BToggler class="w-100 p-3 rounded border" value="fg-danger">
    Click to toggle fg-danger
  </BToggler>
</template>
```

:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BToggler } from '@paper/bootstrap'
</script>

<template>
  <BToggler>
    <span />
  </BToggler>
</template>
```

## Composed on v0

The click handler is on this component. A composable that binds DOM events is the wrong place for it, and [Toggle](/components/actions/toggle) is a checkbox. Neither is used.

`attribute` defaults to `class`, which toggles one token. Any other name toggles that attribute: the first click sets it to `value`, the next removes it. `aria-pressed` is only set when the attribute is `class`.

`target` is an element id. A leading `#` is stripped. The pin can point a button at every element of a class. This component addresses one id.

## Examples

::: ds-example
/systems/bootstrap/toggler/target

### Target

`as="button"` renders a button. `target` is the other element's id, and `value` is the class toggled there. `aria-pressed` stays on the button.
:::

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `''` | Class token, or the attribute value when turning it on. |
| `attribute` | `string` | `'class'` | `class`, or the attribute name to toggle. |
| `target` | `string` | | Element id to toggle. Omit to toggle the root. |
| `as` | `string` | `'div'` | Root tag. |

## Accessibility

When `attribute` is `class`, the root exposes `aria-pressed`. A button root is `type="button"`, so it does not submit a form. Toggling `hidden` removes the element from the accessibility tree. That is the attribute, not a second widget.
