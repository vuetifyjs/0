---
title: Rating - Accessible Star Rating Controls
meta:
  - name: description
    content: Headless rating component with hover preview, half-star support, keyboard navigation, and full ARIA compliance for Vue 3.
  - name: keywords
    content: rating, stars, review, score, form control, accessible, ARIA, Vue 3, headless
features:
  category: Component
  label: 'C: Rating'
  level: 2
  github: /components/Rating/
  renderless: false
related:
  - /composables/forms/create-rating
  - /components/forms/slider
---

# Rating

Headless rating input with hover preview, keyboard navigation, and half-step support.

<DocsPageFeatures :frontmatter />

## Usage

Rating supports whole and half-star modes. Items expose their state via data attributes for CSS-only styling.

::: gn-example
/components/rating/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Rating } from '@vuetify/v0'
</script>

<template>
  <Rating.Root>
    <Rating.Item />
    <Rating.HiddenInput />
  </Rating.Root>
</template>
```

## Examples

::: gn-example
/components/rating/basic

### Basic

A 5-star rating widget driven by `Rating.Root` (which provides `role="slider"` semantics) with five `Rating.Item` children rendered as buttons. Each item receives a `state` slot prop — `"full"`, `"half"`, or `"empty"` — used here to switch between a filled star (★) and an empty star outline (☆) with amber/muted coloring. Hover updates a live preview before committing; clicking commits the value to the `v-model`.

Keyboard users can increment or decrement the rating with arrow keys, jump to 0 with `Home`, and jump to the maximum with `End` — all handled by `Rating.Root` without extra event listeners. The current numeric value is tracked in a `shallowRef` and displayed below the widget.

Reach for this pattern whenever you need a compact, accessible star rating in a review form, product listing, or feedback widget.

:::

::: gn-example
/components/rating/half-stars

### Half Stars

Adds the `half` prop to `Rating.Root`, enabling 0.5-step precision (values like 2.5 or 3.5). Each `Rating.Item` receives three possible states — `"full"`, `"half"`, and `"empty"` — and the half state is rendered by layering a clipped filled star over an empty outline to show the left half filled. Hovering over the left portion of a star previews a half value; the right portion previews the full value.

This pattern is useful for product ratings or reviews where half-star granularity matters. The initial value is set to 2.5, demonstrating that pre-set fractional values render correctly before any user interaction. The step increment/decrement via arrow keys also steps by 0.5 when `half` is enabled.

:::

## Accessibility

### Keyboard

| Key | Action |
|-----|--------|
| ArrowRight / ArrowUp | Increment by step (1 or 0.5) |
| ArrowLeft / ArrowDown | Decrement by step |
| Home | Set to 0 |
| End | Set to size |

### ARIA

Rating.Root provides `role="slider"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, and `aria-valuetext` (e.g. "3 out of 5"). When disabled or readonly, the corresponding `aria-disabled` and `aria-readonly` attributes are set.

### Data Attributes

**Root:**

| Attribute | Description |
|-----------|-------------|
| `data-disabled` | Present when disabled |
| `data-readonly` | Present when readonly |
| `data-hovering` | Present during hover |

**Item:**

| Attribute | Values | Description |
|-----------|--------|-------------|
| `data-state` | `full` \| `half` \| `empty` | Fill state |
| `data-highlighted` | present/absent | Within hover range |
| `data-disabled` | present/absent | Inherited from root |
| `data-readonly` | present/absent | Inherited from root |

::: faq

??? How do I use custom icons instead of text characters?

Slot into Rating.Item and use the `state` slot prop to choose your icon:

```vue
<template>
  <Rating.Item :index="i" v-slot="{ state }">
    <StarFull v-if="state === 'full'" />
    <StarHalf v-if="state === 'half'" />
    <StarEmpty v-if="state === 'empty'" />
  </Rating.Item>
</template>
```

??? How do I make it readonly for display?

Use the `readonly` prop. The value displays but cannot be changed:

```vue
<template>
  <Rating.Root :model-value="3.5" readonly half>
    <Rating.Item v-for="i in 5" :key="i" :index="i" />
  </Rating.Root>
</template>
```

??? How does form submission work?

Set the `name` prop on Root. A hidden input is auto-rendered with the current value:

```vue
<template>
  <Rating.Root v-model="rating" name="review-rating">
    <Rating.Item v-for="i in 5" :key="i" :index="i" />
  </Rating.Root>
</template>
```

:::

<DocsApi />
