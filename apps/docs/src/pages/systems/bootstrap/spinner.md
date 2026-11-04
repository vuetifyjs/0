---
title: BSpinner - Bootstrap 6 Spinner for Vue
meta:
- name: description
  content: Bootstrap 6 spinner markup for Vue. Border and grow spinners, a small size, and the separate rotate icon, each with a visually hidden loading label.
- name: keywords
  content: bootstrap 6 spinner, vue spinner, spinner-border, spinner-grow, spinner-rotate, paper bootstrap
features:
  category: Component
  label: 'C: BSpinner'
  level: 2
  renderless: false
  group: content
related:
  - /systems/bootstrap
  - /systems/bootstrap/progress
  - /systems/bootstrap/placeholder
---

# BSpinner

A border or grow spinner, or the separate rotate icon, with a visually hidden loading label.

<DocsPageFeatures :frontmatter />

<DocsBootstrapReference
  href="https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/components/spinner/"
  title="Spinners"
/>

## Usage

The default is `div.spinner-border` with `role="status"`. The hidden label is the default slot, and it reads "Loading" when you leave it empty. `grow` uses `spinner-grow` instead of `spinner-border`. `small` adds `spinner-sm`. Color is a class you add, such as `fg-primary`.

::: ds-example
/systems/bootstrap/spinner/basic
:::

### The markup Bootstrap documents

The HTML tab is the Bootstrap 6 preview. The Vue tab is the component that renders the same tree.

::: code-group no-filename

```html Bootstrap collapse
<div class="spinner-border" role="status">
  <span class="visually-hidden">Loading</span>
</div>
```

```vue Vue collapse
<template>
  <BSpinner />
  <BSpinner grow />
  <BSpinner small />
  <BSpinner variant="rotate" width="1em" height="1em" />
</template>
```

:::

`variant="rotate"` is the pin's standalone `svg.spinner-rotate`, not a class added to the border spinner. The pin does not set its size. Pass `width` and `height` — `1em` matches the border spinner.

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BSpinner } from '@paper/bootstrap'
</script>

<template>
  <BSpinner />
</template>
```

## Composed on v0

There is no spinner primitive. Border and grow are the pin's CSS animation. This does not use a timer.

The hidden word comes from [useLocale](/composables/plugins/use-locale). The key is `Spinner.label`. With no message registered, the text is "Loading".

`grow` replaces `spinner-border` with `spinner-grow`. Those two classes are never on the same element. `small` adds `spinner-sm`. `variant="rotate"` is the separate `svg.bi.spinner-rotate`. It is not a class on the border spinner. The default slot is the hidden label on the div. The svg has only the eight paths, so that same word is `aria-label` on the svg. A custom slot does not rename the icon. The pin's svg has no width. `width` and `height` fall through to it.

Color stays a class on the component. There is no package CSS and no `--paper-*` token.

## Examples

::: ds-example
/systems/bootstrap/spinner/color

### Color

`fg-primary` is on each spinner. The component does not set a color. Border, grow, and small still hide "Loading". Rotate is the same eight-spoke icon, named with that word, at `1em`.
:::

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `grow` | `boolean` | `false` | Uses `spinner-grow` instead of `spinner-border`. |
| `small` | `boolean` | `false` | Adds `spinner-sm`. |
| `variant` | `'rotate'` | — | Renders `svg.spinner-rotate` instead of the div. |

## Accessibility

Border and grow are `role="status"`. The name is the visually hidden slot. It reads "Loading" unless you replace the slot or register `Spinner.label`. Rotate is also `role="status"`. Its name is `aria-label` with that same string, because the pin's svg has only path children. A custom slot does not rename it. None of these are controls, and none are in the tab order. Border and grow animate for 1s. Reduced motion slows those two to 1.5s and leaves them running. Rotate stays at 1s. There is no `data-bs-toggle`.
