---
title: BClose - Bootstrap 6 close button for Vue
meta:
- name: description
  content: Bootstrap 6 close button for Vue. A button.btn-close with an accessible name. It does not dismiss anything by itself.
- name: keywords
  content: bootstrap 6 close button, vue close, btn-close, paper bootstrap
features:
  category: Component
  label: 'C: BClose'
  level: 2
  renderless: false
  group: content
related:
  - /systems/bootstrap
  - /systems/bootstrap/alert
  - /systems/bootstrap/dialog
  - /systems/bootstrap/toast
---

# BClose

The dismiss icon. It is a button. You wire the click.

<DocsPageFeatures :frontmatter />

> [!NOTE]
> Reference: [Close button on the Bootstrap 6 preview](https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/components/close-button/). Classes and visual variants. This page is the markup.

## Usage

The accessible name comes from the locale key `Close.label`, and falls back to "Close". There is no icon in the slot. The pin draws the glyph from `.btn-close`.

::: ds-example
/systems/bootstrap/close/basic
:::

### The markup Bootstrap documents

::: code-group no-filename

```html Bootstrap collapse
<button type="button" class="btn-close" aria-label="Close"></button>
```

```vue Vue collapse
<template>
  <BClose @click="open = false" />
</template>
```

:::

Dialog, drawer, and toast ship their own close buttons, and those buttons also close the overlay. This one does not. Use it in an alert or anywhere else the pin shows `.btn-close`.

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BClose } from '@paper/bootstrap'
</script>

<template>
  <BClose />
</template>
```

## Composed on v0

The name is [useLocale](/composables/plugins/use-locale). The button does not call into a parent. [BDialog.Close](/systems/bootstrap/dialog) is the one that closes a dialog.

## Examples

::: ds-example
/systems/bootstrap/close/dismiss

### Wired click

The button does not read the alert. The click sets the model to `false`, and the alert runs its hide. Show puts the alert back.
:::

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Native `disabled`. |

## Accessibility

The host is `button type="button"` with an accessible name. It does not set `data-bs-dismiss`. Disabled uses the native attribute.
