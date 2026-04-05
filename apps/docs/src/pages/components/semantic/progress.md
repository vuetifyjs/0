---
title: Progress - Headless Progress Bar for Vue 3
meta:
- name: description
  content: Headless progress bar component with multi-segment, buffer, and indeterminate support.
- name: keywords
  content: progress bar, loading indicator, headless, vue 3
features:
  category: Component
  label: 'C: Progress'
  level: 2
  github: /components/Progress/
  renderless: true
related:
  - /composables/semantic/create-progress
---

# Progress

A headless progress bar component for building determinate, indeterminate, and buffered loading indicators. Uses `createProgress` internally, which delegates segment tracking to `createModel`.

<DocsPageFeatures :frontmatter />

## Usage

The Progress supports single-value and multi-segment modes. Bind a number for a single bar, or an array for multiple segments.

::: example
/components/progress/basic
:::

## Anatomy

```vue Anatomy playground
<script setup lang="ts">
  import { Progress } from '@vuetify/v0'
</script>

<template>
  <Progress.Root>
    <Progress.Label />
    <Progress.Track>
      <Progress.Fill />
    </Progress.Track>
    <Progress.Value />
  </Progress.Root>
</template>
```

## Examples

::: example
/components/progress/StorageBar.vue 1
/components/progress/storage.vue 2

### Storage Usage

Multi-segment progress bar showing disk usage by category. Each `Progress.Fill` registers as a segment with its own value, and Root aggregates them into a total.

**File breakdown:**

| File | Role |
|------|------|
| `StorageBar.vue` | Reusable component — renders a multi-segment bar with category colors and a total label |
| `storage.vue` | Demo — wires category data with interactive sliders to adjust values |

**Key patterns:**

- Multiple `Progress.Fill` components register segments via the internal model registry — their values sum to the total
- `Progress.Value v-slot="{ total }"` provides the aggregate for custom formatting
- `:max="128"` on Root sets the upper bound so percentages compute against 128 GB instead of the default 100

:::

::: example
/components/progress/MediaProgress.vue 1
/components/progress/media.vue 2

### Media Player

A media player progress bar with buffer indicator. The buffer shows pre-loaded content while the fill tracks playback position.

**File breakdown:**

| File | Role |
|------|------|
| `MediaProgress.vue` | Reusable component — thin bar with buffer and fill layers |
| `media.vue` | Demo — simulates playback with play/pause/reset controls |

**Key patterns:**

- `Progress.Buffer` is independent of the segment registry — it reads `value` directly and computes its own percentage against Root's min/max
- Buffer and Fill are both `absolute inset-y-0 left-0` so they layer correctly, with Fill rendering on top via DOM order
- The timer increments both values at different rates to simulate realistic buffering ahead of playback

:::

## Recipes

### Indeterminate State

When no value is provided (or all segment values are 0), the progress is indeterminate. Use `data-state` to apply CSS animations:

```vue
<template>
  <Progress.Root>
    <Progress.Track class="relative h-2 w-full overflow-hidden rounded-full bg-neutral-200">
      <Progress.Fill class="h-full rounded-full bg-blue-500 data-[state=indeterminate]:animate-pulse data-[state=indeterminate]:w-full" />
    </Progress.Track>
  </Progress.Root>
</template>
```

### Custom Value Format

Override the default `${percent}%` display via the scoped slot:

```vue
<template>
  <Progress.Value v-slot="{ total, percent }">
    {{ total }} of 100 ({{ Math.round(percent) }}%)
  </Progress.Value>
</template>
```

### Form Integration

Set `name` on Root to auto-render a hidden input for form submission:

```vue
<template>
  <Progress.Root v-model="value" name="upload-progress">
    <Progress.Track>
      <Progress.Fill />
    </Progress.Track>
  </Progress.Root>
</template>
```

### Data Attributes

Style states without slot props:

```vue
<template>
  <Progress.Fill class="data-[state=indeterminate]:animate-pulse transition-all" />
</template>
```

| Attribute | Values | Components |
|-----------|--------|------------|
| `data-state` | `determinate`, `indeterminate` | Root, Track, Fill, Buffer |
| `data-complete` | `true` | Root |
| `data-buffer` | `true` | Buffer |
| `data-index` | number | Fill |

## Accessibility

The Root component manages ARIA attributes automatically.

### ARIA Attributes

| Attribute | Value | Notes |
|-----------|-------|-------|
| `role` | `progressbar` | Applied to Root |
| `aria-valuenow` | Current total | Omitted when indeterminate |
| `aria-valuemin` | Min value | From Root's `min` prop (default 0) |
| `aria-valuemax` | Max value | From Root's `max` prop (default 100) |
| `aria-valuetext` | `${percent}%` | Omitted when indeterminate |
| `aria-labelledby` | Label ID | Links to `Progress.Label` |
| `aria-busy` | `true` | Set when indeterminate |
| `data-state` | `determinate` / `indeterminate` | Reflects current mode |
| `data-complete` | `true` | When total >= max |

<DocsApi />
