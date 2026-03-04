---
title: Slider - Accessible Range Input Controls
meta:
- name: description
  content: Headless slider component with single and range mode. Pointer drag, keyboard navigation, step snapping, and full ARIA compliance for Vue 3.
- name: keywords
  content: slider, range, input, form control, drag, accessible, ARIA, Vue 3, headless
features:
  category: Component
  label: 'C: Slider'
  level: 2
  github: /components/Slider/
related:
  - /composables/forms/create-slider
---

# Slider

A headless slider component with single and range mode support. Pointer drag, keyboard navigation, step snapping, and full ARIA compliance.

<DocsPageFeatures :frontmatter />

## Usage

The Slider component supports two modes:

- **Single mode**: One `Slider.Thumb` for a single value (`[50]`)
- **Range mode**: Two `Slider.Thumb` components for a value range (`[25, 75]`)

::: example
/components/slider/basic
:::

## Anatomy

```vue Anatomy playground collapse no-filename
<script setup lang="ts">
  import { Slider } from '@vuetify/v0'
</script>

<template>
  <!-- Single thumb -->
  <Slider.Root>
    <Slider.Track>
      <Slider.Range />
    </Slider.Track>

    <Slider.Thumb />
  </Slider.Root>

  <!-- Range (two thumbs) -->
  <Slider.Root>
    <Slider.Track>
      <Slider.Range />
    </Slider.Track>

    <Slider.Thumb />
    <Slider.Thumb />
  </Slider.Root>

  <!-- With form submission -->
  <Slider.Root>
    <Slider.Track>
      <Slider.Range />
    </Slider.Track>

    <Slider.Thumb />

    <Slider.HiddenInput />
  </Slider.Root>
</template>
```

## Accessibility

Each `Slider.Thumb` handles all ARIA attributes automatically:

- `role="slider"` for proper semantics
- `aria-valuenow`, `aria-valuemin`, `aria-valuemax` reflect current state
- `aria-valuetext` for custom display text (via prop)
- `aria-orientation` reflects slider direction
- `aria-disabled` when slider is disabled
- `tabindex="0"` for keyboard focus (removed when disabled)

For custom implementations, use `renderless` mode and bind the `attrs` slot prop to your element:

```vue
<template>
  <Slider.Thumb v-slot="{ attrs }" renderless>
    <div v-bind="attrs">
      <!-- Custom thumb visual -->
    </div>
  </Slider.Thumb>
</template>
```

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `ArrowRight` / `ArrowUp` | Increment by one step |
| `ArrowLeft` / `ArrowDown` | Decrement by one step |
| `Shift+Arrow` | Increment/decrement by 10 steps |
| `PageUp` | Increment by 10 steps |
| `PageDown` | Decrement by 10 steps |
| `Home` | Set to minimum |
| `End` | Set to maximum |

## Recipes

### Range Slider

Add two `Slider.Thumb` components for range selection. Use `minStepsBetweenThumbs` to prevent overlapping:

::: example
/components/slider/range
:::

### Form Integration

When the `name` prop is set on `Slider.Root`, hidden inputs are automatically rendered for form submission — one per thumb value:

```vue
<template>
  <Slider.Root name="price" :min="0" :max="1000">
    <Slider.Track>
      <Slider.Range />
    </Slider.Track>

    <Slider.Thumb />
  </Slider.Root>
</template>
```

### Styling with Data Attributes

Slider components expose `data-state` and `data-orientation` attributes for CSS styling:

| Attribute | Values | Components |
|-----------|--------|------------|
| `data-state` | `dragging`, `idle` | Thumb |
| `data-disabled` | `true` | Root, Track, Range, Thumb |
| `data-orientation` | `horizontal`, `vertical` | Root, Track, Range |

```vue
<template>
  <Slider.Root class="relative flex items-center w-full h-5">
    <Slider.Track class="relative h-1 w-full rounded-full bg-surface-variant">
      <Slider.Range class="absolute h-full rounded-full bg-primary" />
    </Slider.Track>

    <Slider.Thumb class="absolute size-5 rounded-full bg-primary data-[state=dragging]:scale-125 transition-transform" />
  </Slider.Root>
</template>
```

<DocsApi />
