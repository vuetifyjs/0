---
title: createRating - Bounded Rating Value Management
meta:
  - name: description
    content: Headless composable for discrete star ratings with half-step support, value clamping, and computed item states for Vue 3.
  - name: keywords
    content: rating, stars, review, score, composable, bounded, Vue 3, headless
features:
  category: Composable
  label: 'E: createRating'
  level: 2
  github: /composables/createRating/
related:
  - /composables/forms/create-numeric
  - /composables/forms/create-slider
  - /components/forms/rating
  - /composables/data/create-pagination
---

# createRating

Bounded number with discrete items. Give it a size, get items to iterate with full/half/empty state. Half-step support for 0.5 increments.

<DocsPageFeatures :frontmatter />

## Usage

```ts collapse
import { createRating } from '@vuetify/v0'
import { shallowRef } from 'vue'

// Basic — standalone
const rating = createRating({ size: 5 })
rating.select(3)
rating.items.value
// [
//   { value: 1, state: 'full' },
//   { value: 2, state: 'full' },
//   { value: 3, state: 'full' },
//   { value: 4, state: 'empty' },
//   { value: 5, state: 'empty' },
// ]

// With half-step support
const half = createRating({ size: 5, half: true })
half.select(2.5)
half.items.value[2].state // 'half'

// With v-model (pass a ref)
const value = shallowRef(0)
const bound = createRating({ value, size: 5 })
bound.select(4)
value.value // 4
```

## Context / DI

Use `createRatingContext` to share a rating instance across a component tree:

```ts
import { createRatingContext } from '@vuetify/v0'

export const [useProductRating, provideProductRating, productRating] =
  createRatingContext({ namespace: 'my:rating', max: 5 })

// In parent component
provideProductRating()

// In child component
const rating = useProductRating()
rating.select(4)
```

## Reactivity

| Property | Type | Reactive | Description |
|----------|------|----------|-------------|
| `value` | `WritableComputedRef<number>` | Yes | Current rating, clamped 0–size |
| `size` | `number` | Getter | Total items |
| `half` | `boolean` | Getter | Half-step enabled |
| `items` | `ComputedRef<RatingItem[]>` | Yes | Items with `full`/`half`/`empty` state |
| `isFirst` | `Readonly<Ref<boolean>>` | Yes | Value is 0 |
| `isLast` | `Readonly<Ref<boolean>>` | Yes | Value equals size |
| `select(v)` | `(value: number) => void` | — | Set rating |
| `next()` | `() => void` | — | Increment by step |
| `prev()` | `() => void` | — | Decrement by step |
| `first()` | `() => void` | — | Set to 0 |
| `last()` | `() => void` | — | Set to size |

## Examples

::: gn-example
/composables/create-rating/useStarRating.ts 1
/composables/create-rating/StarRating.vue 2
/composables/create-rating/star-rating.vue 3

### Star Rating With Hover Preview

A half-star review widget built directly on `createRating` — no Rating component. It demonstrates the three things the composable gives you for free: an `items` array whose `state` is already resolved to `full`, `half`, or `empty`; half-step values via `half: true` (so `select(2.5)` is valid and the mid-point star renders half-filled); and `isFirst` / `isLast` boundary guards that disable the step buttons at 0 and 5. The component reads `state` per star and clips a filled glyph over an outline to draw the half, while `select` and the `next` / `prev` steppers commit the value.

The interesting detail is how hover preview stays honest without any hand-rolled math. The composable holds two `createRating` instances: one for the committed value, and a second whose `value` is bound to a `hover` ref. While the pointer is over the stars, `display` reads the preview instance's `items`; on `mouseleave` it falls back to the committed instance's `items`. Both renderings come straight from `createRating`, so the full/half/empty logic is never duplicated. DOM events (`mouseenter`, `click`, `mouseleave`) live in the component; the value math lives in the composable, keeping the composable headless.

Reach for `createRating` over a plain reactive number whenever you want per-item state, half steps, and clamped boundaries handed to you. It has no DOM dependencies, so the same instance backs an editable widget, a compact read-only display, or a server-submitted score. For the fully accessible spin-button treatment, see the [Rating component](/components/forms/rating); for related bounded-value math, see [createNumeric](/composables/forms/create-numeric) and [createSlider](/composables/forms/create-slider).

| File | Role |
|------|------|
| `useStarRating.ts` | Owns two createRating instances (committed + hover preview), exposes display, label, and submit/reset |
| `StarRating.vue` | Renders the half-clippable stars and step buttons; binds hover and click events |
| `star-rating.vue` | Entry point — creates the composable, wires the view, and shows the submitted score |
:::

::: faq

??? What determines the step size?

When `half` is `false` (default), `next()` and `prev()` change the value by 1. When `half` is `true`, the step is 0.5.

??? How does item state derivation work?

Each item's state is derived from the current value:
- **full**: item value <= floor of rating value
- **half**: item value equals the ceiling of a non-integer value
- **empty**: item value > rating value

??? Can I use this without the Rating component?

Yes. `createRating` is a pure composable with no DOM dependencies. Build your own UI with the `items` array and navigation methods.

:::

<DocsApi />
