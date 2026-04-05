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

::: example
/components/rating/basic

### Star Rating

A 5-star rating with hover preview and filled/empty star display.

:::

## Anatomy

```vue Anatomy playground collapse no-filename
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

::: example
/components/rating/basic

### Basic

Click a star to set the rating. Hover to preview. Keyboard: Arrow keys to adjust, Home for 0, End for max.
:::

::: example
/components/rating/half-stars

### Half Stars

Enable `half` prop for 0.5-step precision. Hover over the left or right half of a star to preview half values.
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
<Rating.Item :index="i" v-slot="{ state }">
  <StarFull v-if="state === 'full'" />
  <StarHalf v-if="state === 'half'" />
  <StarEmpty v-if="state === 'empty'" />
</Rating.Item>
```

??? How do I make it readonly for display?

Use the `readonly` prop. The value displays but cannot be changed:

```vue
<Rating.Root :model-value="3.5" readonly half>
  <Rating.Item v-for="i in 5" :key="i" :index="i" />
</Rating.Root>
```

??? How does form submission work?

Set the `name` prop on Root. A hidden input is auto-rendered with the current value:

```vue
<Rating.Root v-model="rating" name="review-rating">
  <Rating.Item v-for="i in 5" :key="i" :index="i" />
</Rating.Root>
```

:::

<DocsApi />
