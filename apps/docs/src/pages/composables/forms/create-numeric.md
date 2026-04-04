---
title: createNumeric - Pure Numeric Math Primitive
meta:
  - name: description
    content: Pure numeric math for bounded values. Snap, step, clamp, percentage conversion, and circular wrapping with floating-point precision handling.
  - name: keywords
    content: createNumeric, numeric, math, clamp, snap, step, composable, Vue 3, headless
features:
  category: Composable
  label: 'E: createNumeric'
  github: /composables/createNumeric/
  level: 2
related:
  - /composables/forms/create-slider
  - /composables/forms/create-number-field
  - /composables/forms/create-rating
---

# createNumeric

Pure numeric math for bounded values. Snap to step, clamp to range, convert between values and percentages, with floating-point precision correction.

<DocsPageFeatures :frontmatter />

## Usage

```ts collapse
import { createNumeric } from '@vuetify/v0'

const numeric = createNumeric({ min: 0, max: 100, step: 5 })

numeric.snap(47)        // 45
numeric.snap(48)        // 50
numeric.up(50)          // 55
numeric.down(50)        // 45
numeric.floor()         // 0
numeric.ceil()          // 100
numeric.fromValue(50)   // 50 (percentage)
numeric.fromPercent(33) // 30 (snapped value)
numeric.canUp(100)      // false
numeric.canDown(0)      // false
```

## Architecture

```mermaid
graph TD
    A[createNumeric] --> B[snap - step snapping + clamp]
    A --> C[up / down - step increment]
    A --> D[floor / ceil - boundary jump]
    A --> E[fromValue / fromPercent - percentage conversion]
    A --> F[canUp / canDown - boundary check]
    B --> G[floating-point correction]
```

## Reactivity

createNumeric is a pure function factory — it returns plain functions, not reactive refs. This makes it composable with any reactive system.

| Method | Returns | Description |
|--------|---------|-------------|
| `snap(value)` | `number` | Round to nearest step, clamp to [min, max] |
| `up(value, multiplier?)` | `number` | Increment by step × multiplier |
| `down(value, multiplier?)` | `number` | Decrement by step × multiplier |
| `floor()` | `number` | Return min value |
| `ceil()` | `number` | Return max value |
| `fromValue(value)` | `number` | Convert value to 0–100 percentage |
| `fromPercent(percent)` | `number` | Convert percentage to snapped value |
| `canUp(value)` | `boolean` | Whether increment is possible |
| `canDown(value)` | `boolean` | Whether decrement is possible |

## Examples

::: example
/composables/create-numeric/basic
:::

::: faq

??? What happens with floating-point steps like 0.1?

createNumeric automatically corrects floating-point artifacts. `snap(0.1 + 0.2)` returns `0.3`, not `0.30000000000000004`. The correction uses `toFixed` based on the decimal places in `step` and `min`.

??? What does wrap do?

When `wrap: true`, incrementing past `max` wraps to `min`, and decrementing past `min` wraps to `max`. Useful for circular values like angles (0–360) or hours (0–23).

??? How does leap differ from step?

`step` is the standard increment (Arrow keys). `leap` defaults to `step * 10` and is intended for larger jumps (PageUp/PageDown). Both are exposed as readonly properties for components to use.

:::

<DocsApi />
