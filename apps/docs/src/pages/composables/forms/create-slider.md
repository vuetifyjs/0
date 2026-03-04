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
  - /components/forms/slider
---

# createSlider

A composable for managing slider state: value math, step snapping, percentage conversion, and multi-thumb value operations. Designed for single-thumb, range, and multi-thumb sliders.

<DocsPageFeatures :frontmatter />

## Usage

The `createSlider` composable manages a `number[]` of thumb values with configurable min/max/step bounds. It provides pure math functions (`snap`, `percent`, `fromPercent`) and index-based thumb operations (`setValue`, `stepUp`, `stepDown`).

```ts
import { createSlider } from '@vuetify/v0'

// Single thumb
const slider = createSlider({ min: 0, max: 100, step: 5 })
slider.values.value = [50]

slider.stepUp(0)           // [55]
slider.percent(50)         // 50
slider.snap(47)            // 45 (nearest step of 5)

// Range (two thumbs)
slider.values.value = [25, 75]
slider.setValue(0, 30)     // [30, 75]
slider.setValue(1, 60)     // [30, 60]
```

## Reactivity

Slider state is **always reactive**. Values and derived properties update automatically.

| Property/Method | Reactive | Notes |
| - | :-: | - |
| `values` | <AppSuccessIcon /> | Ref — all thumb values |
| `disabled` | <AppSuccessIcon /> | Ref — accepts MaybeRefOrGetter |
| `orientation` | <AppSuccessIcon /> | Ref — accepts MaybeRefOrGetter |
| `inverted` | <AppSuccessIcon /> | Ref — accepts MaybeRefOrGetter |
| `snap` | <AppErrorIcon /> | Pure function — rounds to nearest step |
| `percent` | <AppErrorIcon /> | Pure function — value to percentage |
| `fromPercent` | <AppErrorIcon /> | Pure function — percentage to value |

> [!TIP] Value constraints
> `setValue` automatically clamps to min/max, snaps to the nearest step, and enforces minimum distance between adjacent thumbs via `minStepsBetweenThumbs`.

## Examples

::: example
/composables/create-slider/basic
:::

<DocsApi />
