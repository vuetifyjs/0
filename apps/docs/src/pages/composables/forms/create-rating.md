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

::: example
/composables/create-rating/basic

### Basic

Standalone rating with navigation controls. Click a star or use the prev/next buttons.
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
