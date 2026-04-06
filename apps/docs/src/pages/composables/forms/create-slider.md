---
title: createSlider - Slider State Management for Vue 3
meta:
- name: description
  content: Manage slider state with value math, step snapping, percentage conversion, and multi-thumb support. Build single sliders, range sliders, and color pickers.
- name: keywords
  content: createSlider, slider, range, composable, Vue 3, step snapping, percentage, multi-thumb
features:
  category: Composable
  label: 'E: createSlider'
  github: /composables/createSlider/
  level: 2
related:
  - /composables/forms/create-numeric
  - /composables/forms/create-rating
  - /components/forms/slider
---

# createSlider

Slider state composable for single-thumb, range, and multi-thumb sliders. Handles value math, step snapping, and percentage conversion.

<DocsPageFeatures :frontmatter />

## Usage

The `createSlider` composable manages a `number[]` of thumb values with configurable min/max/step bounds. It provides pure math functions (`snap`, `fromValue`, `fromPercent`) and index-based thumb operations (`set`, `up`, `down`).

```ts collapse
import { createSlider } from '@vuetify/v0'

const slider = createSlider({ min: 0, max: 100, step: 5 })

// Each thumb is a registered ticket with a shallowRef<number> value
const thumb = slider.register({ value: 50 })

slider.up(0)               // values: [55]
slider.fromValue(50)       // 50
slider.snap(47)            // 45 (nearest step of 5)

// Range — register two thumbs individually
const slider2 = createSlider({ min: 0, max: 100, step: 1 })
slider2.register({ value: 25 })
slider2.register({ value: 75 })

// Or register multiple thumbs at once with onboard()
const slider3 = createSlider({ min: 0, max: 100, step: 1 })
slider3.onboard([{ value: 0 }, { value: 50 }, { value: 100 }])

slider2.set(0, 30)         // values: [30, 75]
slider2.set(1, 60)         // values: [30, 60]
```

## Reactivity

Slider state is **always reactive**. Values and derived properties update automatically.

| Property/Method | Reactive | Notes |
| - | :-: | - |
| `values` | <AppSuccessIcon /> | Ref — all thumb values |
| `disabled` | <AppSuccessIcon /> | Ref — accepts MaybeRefOrGetter; blocks all mutations |
| `readonly` | <AppSuccessIcon /> | Ref — accepts MaybeRefOrGetter; thumbs remain focusable but `set`, `up`, `down`, `floor`, `ceil` are no-ops |
| `orientation` | <AppSuccessIcon /> | Ref — accepts MaybeRefOrGetter |
| `inverted` | <AppSuccessIcon /> | Ref — accepts MaybeRefOrGetter |
| `snap` | <AppErrorIcon /> | Pure function — rounds to nearest step with decimal precision correction |
| `fromValue` | <AppErrorIcon /> | Pure function — value to percentage |
| `fromPercent` | <AppErrorIcon /> | Pure function — percentage to value |

> [!TIP] Value constraints
> `set` automatically clamps to min/max, snaps to the nearest step, and enforces minimum distance between adjacent thumbs via `minStepsBetweenThumbs`.

> [!TIP] Decimal precision
> `snap` uses `toFixed` to correct floating-point artifacts. The number of decimal places is derived from `step` and `min`, so `snap(3 * 0.1)` returns `0.3` — not `0.30000000000000004`.

## Examples

::: example
/composables/create-slider/context.ts 2
/composables/create-slider/ScrubberProvider.vue 3
/composables/create-slider/ScrubberConsumer.vue 4
/composables/create-slider/scrubber.vue 1

### Media Scrubber

A music player scrubber built entirely with `createSlider` — no `Slider.*` components needed. Demonstrates how the composable's math functions power custom pointer interactions.

Every pointer interaction follows the same loop: **pointer → `fromPercent()` → `set()` → `fromValue()` → UI**. The provider converts raw `clientX` into a track percentage, `fromPercent` snaps it to the nearest 0.1-second step, and the consumer reads `values[0]` back through `fromValue()` to position the playhead and color the waveform bars.

| File | Role |
|------|------|
| `context.ts` | Typed context with `createContext`, shared constants |
| `ScrubberProvider.vue` | Creates slider, owns pointer logic, provides via slot |
| `ScrubberConsumer.vue` | Injects context, renders waveform and playhead |
| `scrubber.vue` | Entry point wiring provider to consumer |

**Key patterns:**

- Provider owns all pointer math — the consumer never touches `PointerEvent`
- `fromPercent` + `set` handle step snapping and clamping automatically
- `scrubbing` ref drives CSS transitions — instant updates while dragging, smooth otherwise

Click and drag across the waveform to scrub through the track.
:::

::: example
/composables/create-slider/useCompare.ts 2
/composables/create-slider/CompareDisplay.vue 3
/composables/create-slider/compare.vue 1

### Theme Comparison

A before/after theme comparison tool — the same `fromPercent` → `set` pointer math as the scrubber, applied to a completely different visual metaphor. The slider never renders as a traditional slider control.

> [!TIP] Same math, different metaphor
> This uses the exact same `fromPercent` → `set` → `fromValue` loop as the scrubber above, proving `createSlider` is a reusable math primitive — not a UI widget.

Two identical UI panels are stacked with `position: absolute`. The bottom layer has `data-theme="light"`, the top has `data-theme="dark"` with `clip-path: inset(0 0 0 X%)` where X comes from `slider.fromValue()`. Dragging the handle clips the dark panel from the left, revealing the light panel underneath.

| File | Role |
|------|------|
| `useCompare.ts` | Creates slider, exposes reactive `split` and pointer handlers |
| `CompareDisplay.vue` | Renders light/dark panels with `clip-path` driven by `split` |
| `compare.vue` | Entry point wiring the composable to the display |

**Key patterns:**

- `createSlider` as a math primitive — no form input, no `Slider.*` components
- `data-theme` scoping — two theme contexts coexist in the same DOM tree
- Same pointer math pattern as the scrubber, proving the composable is reusable across visual metaphors

Drag the divider handle left and right to compare themes.
:::

<DocsApi />
