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
/components/rating/useReview.ts 1
/components/rating/ReviewForm.vue 2
/components/rating/review-form.vue 3

### Product review form

A "leave a review" widget that pairs a half-star `Rating.Root` with a validated comment field inside a single [Form](/components/forms/form). The rating runs in `renderless` mode, so the slot `attrs` (which carry `role="slider"` plus the `aria-value*` and keyboard bundle) bind to your own wrapper element, and each `Rating.Item` renders a star from its `state` slot prop — layering a clipped filled star over an outline for the `"half"` state. The `half` prop unlocks 0.5-step precision, and a live label translates the hovered or committed value ("Good", "Excellent") so the reader always sees what they are about to submit.

Form submission is where the two controls diverge. The comment is an [Input](/components/forms/input) field, so it auto-registers with the `Form` validation registry and the `@submit` payload's `valid` flag already reflects its rules. The rating is not a validation field, so it cannot ride that flag — the component keeps a local `starsError` and only forwards a successful submit when both the Form is valid and a rating was chosen. The `name="review-rating"` prop on `Rating.Root` auto-renders the hidden input, so the star value posts with the form without ever placing a `Rating.HiddenInput` by hand.

Reach for this triad when a rating is one part of a larger form rather than a standalone control: the composable owns the submitted-review state and reset, the reusable component owns the v0 surface and styling, and the entry wires them together with a summary panel. The trade-off is the manual rating-required guard — acceptable here because mixing a slider-style control with text validation in one submit is a common real-world shape. Related: [createRating](/composables/forms/create-rating), [Slider](/components/forms/slider).

| File | Role |
|------|------|
| `useReview.ts` | Owns the review state (`stars`, `comment`, `submitted`) plus submit/reset behavior |
| `ReviewForm.vue` | Renders the Rating + Input inside a Form and guards the rating-required rule |
| `review-form.vue` | Wires the composable to the form and shows the submitted-review summary |
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

## FAQ

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
