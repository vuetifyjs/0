---
title: BStrength - Bootstrap 6 Password strength for Vue
meta:
- name: description
  content: Bootstrap 6 strength markup as a presentational meter — four segments or a bar from a value you pass, with no password scoring, styled by your own Bootstrap CSS.
- name: keywords
  content: bootstrap 6 password strength, vue strength meter, segments, strength bar, bootstrap vue, paper bootstrap
features:
  category: Component
  label: 'C: BStrength'
  level: 2
  renderless: false
  group: forms
related:
  - /systems/bootstrap
---

# BStrength

A meter for a level you already computed. It does not read a password and it does not score one.

<DocsPageFeatures :frontmatter />

<DocsBootstrapReference
  href="https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/forms/password-strength/"
  title="Password strength"
/>

## Usage

`value` from 0 to 4 lights that many segments. A number above 4 is a percentage of 100, mapped onto the same four. The example counts characters, up to 4. The component still does not score a password.

::: ds-example
/systems/bootstrap/strength/basic
:::

### The markup Bootstrap documents

The HTML tab is the pin's static meter. `data-bs-strength="weak"` is the color. A bare `data-bs-strength` is the bundle's scorer. This component sets the level and does not score.

::: code-group no-filename

```html Bootstrap collapse
<div class="strength" data-bs-strength="weak">
  <div class="strength-segment active"></div>
  <div class="strength-segment"></div>
  <div class="strength-segment"></div>
  <div class="strength-segment"></div>
</div>
```

```vue Vue collapse
<template>
  <BStrength :value="1" />
</template>
```

:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BStrength } from '@paper/bootstrap'
</script>

<template>
  <BStrength />
</template>
```

## Composed on v0

Nothing behavioral. The level is a prop. [createRating](/composables/forms/create-rating) is a different control, and a scoring library is out of scope.

`value` 1–4 sets `data-bs-strength` to `weak`, `fair`, `good`, or `strong`. That is the pin's color. `variant="bar"` writes `--bs-strength-width` on `div.strength-bar`. The track stays full width. `text` renders `span.strength-text` after the meter.

## Examples

::: ds-example
/systems/bootstrap/strength/bar

### Bar

`variant="bar"` replaces the four segments with one bar. `75` is above 4, so the fill is 75% of the track. `2` is half, because 2 of 4 segments is the same ratio. The color is the level those segments would light.
:::

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | `0` | `0`–`4` segment count, or a percentage when above 4. |
| `variant` | `'segments' \| 'bar'` | `'segments'` | Four segments, or one bar. |
| `text` | `string` | | `span.strength-text` after the meter. |

## Accessibility

The meter is presentational. Put the level in text next to it, or pass `text`, so the score is not only a color. This component does not claim a password is strong.
