---
title: BPlaceholder - Bootstrap 6 Placeholder for Vue
meta:
- name: description
  content: Bootstrap 6 placeholder markup for Vue. A placeholder span whose width is your class, with wave, pulse, and glow left on the parent.
- name: keywords
  content: bootstrap 6 placeholder, vue placeholder, placeholder-wave, placeholder-glow, paper bootstrap
features:
  category: Component
  label: 'C: BPlaceholder'
  level: 2
  renderless: false
  group: content
related:
  - /systems/bootstrap
  - /systems/bootstrap/card
  - /systems/bootstrap/spinner
  - /systems/bootstrap/progress
---

# BPlaceholder

A placeholder span. Width is a class you pass in. Wave, pulse, and glow sit on the parent.

<DocsPageFeatures :frontmatter />

> [!NOTE]
> Reference: [Placeholders on the Bootstrap 6 preview](https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/components/placeholders/). Classes and visual variants. This page is Vue.

## Usage

The component is `span.placeholder`. Pass `col-6`, `w-75`, or another width class yourself. `size` adds `placeholder-xs`, `placeholder-sm`, or `placeholder-lg` on that span. Put `placeholder-wave` or `placeholder-pulse` on the parent. `placeholder-glow` is the same animation as pulse. A `bg-*` class replaces `currentColor`.

::: ds-example
/systems/bootstrap/placeholder/basic
:::

### The markup Bootstrap documents

The HTML tab is the Bootstrap 6 preview, which wraps the span in a paragraph. The example uses a div. The column class stays in the example.

::: code-group no-filename

```html Bootstrap collapse
<p class="placeholder-wave" aria-hidden="true">
  <span class="placeholder col-6"></span>
</p>
```

```vue Vue collapse
<template>
  <div class="placeholder-wave d-flex gap-2" aria-hidden="true">
    <BPlaceholder class="col-6" />
  </div>
</template>
```

:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BPlaceholder } from '@paper/bootstrap'
</script>

<template>
  <BPlaceholder />
</template>
```

## Composed on v0

This is markup. The host is `span.placeholder`. There is no placeholder primitive in v0.

Width is a class on the span (`col-6`, `w-75`). It is not a prop. `size` adds `placeholder-xs`, `placeholder-sm`, or `placeholder-lg`. Leave it off for the default height.

`placeholder-wave` and `placeholder-pulse` go on the parent. `placeholder-glow` is the pin's alias for pulse, so it is the same parent class and the same animation. Wave is a mask on that parent. Pulse fades the span. Color is `currentColor` unless a `bg-*` class overrides it.

## Examples

::: ds-example
/systems/bootstrap/placeholder/card

### Loading card

`aria-hidden="true"` is on the card. `placeholder-wave` is on the title and the text. Each bar is a `BPlaceholder` with a column class.

The button is an anchor, not `BPlaceholder`. The pin puts `placeholder` on that anchor, along with `btn-solid`, `theme-primary`, `disabled`, and `col-6`. It has `aria-disabled` and no `href`.
:::

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'lg'` | — | `placeholder-xs`, `placeholder-sm`, or `placeholder-lg` on the span. |

## Accessibility

The span is visual. Put `aria-hidden="true"` on the loading region, the parent or the card, not on the span. The span has no role. The stylesheet sets `cursor: wait`. Reduced motion removes the wave mask and the pulse animation. A button skeleton is the anchor described above. It is not in the tab order, because it has no `href`. There is no `data-bs-toggle`.
