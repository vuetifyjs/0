---
title: BButton - Bootstrap 6 button for Vue
meta:
- name: description
  content: Bootstrap 6 button for Vue. The face class stands alone. An href renders an anchor with role button. Styled by your CSS.
- name: keywords
  content: bootstrap 6 button, vue button, btn-solid, btn-outline, btn-icon, paper bootstrap
features:
  category: Component
  label: 'C: BButton'
  level: 2
  renderless: false
  group: content
related:
  - /systems/bootstrap
  - /systems/bootstrap/button-group
  - /systems/bootstrap/close
---

# BButton

A button, or a link that acts as one. The face class is the only button class on the element.

<DocsPageFeatures :frontmatter />

<DocsBootstrapReference
  href="https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/components/button/"
  title="Buttons"
/>

## Usage

With no `variant`, the class is `btn`. `solid`, `outline`, `subtle`, `link`, and `text` each stand alone: `btn-solid`, not `btn btn-solid`. On this pin those faces share one selector group with `.btn`.

::: ds-example
/systems/bootstrap/button/basic
:::

### The markup Bootstrap documents

::: code-group no-filename

```html Bootstrap collapse
<button type="button" class="btn">Base</button>
<button type="button" class="btn-solid theme-primary">Solid</button>
<a class="btn-solid theme-primary" href="#save" role="button">Save</a>
```

```vue Vue collapse
<template>
  <BButton>Base</BButton>
  <BButton theme="primary" variant="solid">Solid</BButton>
  <BButton href="#save" theme="primary" variant="solid">Save</BButton>
</template>
```

:::

`icon` with no variant is `btn-icon` alone. `icon` with a variant adds `btn-icon` next to the face. `size` is `btn-xs`, `btn-sm`, or `btn-lg`. `active` adds `.active`.

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BButton } from '@paper/bootstrap'
</script>

<template>
  <BButton>Save</BButton>
</template>
```

## Composed on v0

The host is a native `button` or `a`. v0 Button is not used. Its classes and tag would not match `.btn-solid`.

## Examples

::: ds-example
/systems/bootstrap/button/states

### Size, disabled, and active

`xs`, `sm`, and `lg` add `btn-xs`, `btn-sm`, and `btn-lg`. Default has no size class.

`disabled` on a button is the native attribute. On an anchor it is `.disabled`, `aria-disabled="true"`, and `tabindex="-1"`, and `href` stays. `active` adds `.active`. On the anchor it also sets `aria-current="page"`.
:::

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'solid' \| 'outline' \| 'subtle' \| 'link' \| 'text'` | | The face class, alone. Omitted, the class is `btn`. |
| `theme` | `string` | | Adds `theme-{theme}`. |
| `size` | `'xs' \| 'sm' \| 'lg'` | | Adds `btn-xs`, `btn-sm`, or `btn-lg`. |
| `icon` | `boolean` | `false` | `btn-icon`. Replaces `btn` when there is no variant. |
| `href` | `string` | | Renders `<a role="button">`. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Native type. Ignored on an anchor. |
| `active` | `boolean` | `false` | Adds `.active`. On an anchor, also `aria-current="page"`. |
| `disabled` | `boolean` | `false` | Native `disabled` on a button. |

An anchor does not get a `disabled` attribute. It keeps `href`, gains `.disabled`, `aria-disabled="true"`, and `tabindex="-1"`.

## Accessibility

A button uses the native `disabled` attribute and does not set `aria-disabled`. Enter and Space activate it. An anchor uses Enter, which follows `href`. A disabled anchor stays in the accessibility tree as disabled and is taken out of the tab order. An icon-only button needs a name. Put it on `aria-label`.
