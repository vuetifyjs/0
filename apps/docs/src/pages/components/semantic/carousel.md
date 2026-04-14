---
title: Carousel - Scrollable Slide Navigation with Drag Support
meta:
- name: description
  content: Headless carousel component built on CSS scroll-snap with multi-slide display, partial-slide peeking, and drag/swipe navigation for Vue 3.
- name: keywords
  content: carousel, slider, scroll-snap, drag, swipe, slides, Vue 3, headless, accessible
features:
  category: Component
  label: 'C: Carousel'
  github: /components/Carousel/
  renderless: false
  level: 2
related:
  - /components/providers/step
  - /composables/selection/create-step
  - /components/primitives/atom
---

# Carousel

Headless carousel built on CSS scroll-snap with multi-slide display and partial-slide peeking.

<DocsPageFeatures :frontmatter />

## Usage

The Carousel provides slide navigation with native drag/swipe via CSS scroll-snap. Slides register with a step context for programmatic navigation.

::: example
/components/carousel/basic
:::

## Anatomy

```vue Anatomy playground no-filename
<script setup lang="ts">
  import { Carousel } from '@vuetify/v0'
</script>

<template>
  <Carousel.Root>
    <Carousel.Viewport>
      <Carousel.Item />
    </Carousel.Viewport>

    <Carousel.Indicator />
    <Carousel.Previous />
    <Carousel.Next />
    <Carousel.Progress />
    <Carousel.LiveRegion />
  </Carousel.Root>
</template>
```

## Examples

### Multi-Slide Display

Show multiple slides at once with the `per-view` prop. This is useful for card grids, skill lists, or product carousels where users can browse items in groups.

::: example
/components/carousel/multi-slide

### Three Slides Per View

A circular carousel showing 3 slides at once with a 12px gap between them.

:::

### Peek

Add padding to the viewport to reveal a portion of adjacent slides, signaling to the user that more content is available and encouraging drag/swipe interaction.

::: example
/components/carousel/peek

### Partial Slide Visibility

A carousel with 48px peek on each side showing portions of adjacent slides.

:::

## Recipes

### Circular Navigation

Enable wrapping from last slide to first with the `circular` prop.

```vue
<template>
  <Carousel.Root circular>
    <Carousel.Viewport>
      <Carousel.Item v-for="i in 5" :key="i" :value="i">
        Slide {{ i }}
      </Carousel.Item>
    </Carousel.Viewport>
  </Carousel.Root>
</template>
```

### Vertical Orientation

Set `orientation="vertical"` for a vertically scrolling carousel.

```vue
<template>
  <Carousel.Root orientation="vertical">
    <Carousel.Viewport style="height: 300px">
      <Carousel.Item v-for="i in 5" :key="i" :value="i">
        Slide {{ i }}
      </Carousel.Item>
    </Carousel.Viewport>
  </Carousel.Root>
</template>
```

### Disabled State

Disable all navigation via the `disabled` prop on the root.

```vue
<template>
  <Carousel.Root disabled>
    <Carousel.Viewport>
      <Carousel.Item v-for="i in 3" :key="i" :value="i">
        Slide {{ i }}
      </Carousel.Item>
    </Carousel.Viewport>

    <Carousel.Previous>Previous</Carousel.Previous>
    <Carousel.Next>Next</Carousel.Next>
  </Carousel.Root>
</template>
```

### Instant Scroll

Set `behavior="instant"` to disable smooth scrolling on programmatic navigation.

```vue
<template>
  <Carousel.Root behavior="instant">
    <Carousel.Viewport>
      <Carousel.Item v-for="i in 5" :key="i" :value="i">
        Slide {{ i }}
      </Carousel.Item>
    </Carousel.Viewport>
  </Carousel.Root>
</template>
```

### Styling with Data Attributes

All component state is exposed via `data-*` attributes for CSS-only styling:

```css
/* Style the selected slide */
[data-selected] { opacity: 1; }

/* Dim inactive slides */
[aria-hidden="true"] { opacity: 0.4; }

/* Hide nav buttons at boundaries */
[data-edge] { visibility: hidden; }

/* Drag interaction */
[data-dragging] { cursor: grabbing; user-select: none; }
```

## Accessibility

The Carousel implements the [WAI-ARIA Carousel Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/).

| Element | Role / Attribute |
| - | - |
| Root | `role="region"`, `aria-roledescription="carousel"`, `aria-label`, `aria-disabled` |
| Viewport | `aria-live="polite"` |
| Slide | `role="group"`, `aria-roledescription="slide"`, `aria-label="N of M"` |
| Previous | `aria-label` via locale, `aria-controls` links to viewport |
| Next | `aria-label` via locale, `aria-controls` links to viewport |
| Indicator | `role="tablist"` container with `aria-orientation`, `role="tab"` per dot, `aria-selected` |
| Progress | `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax` |
| LiveRegion | `role="status"`, `aria-live="polite"`, `aria-atomic` |

Slides outside the visible window are marked with `aria-hidden="true"` so screen readers only announce visible content. The LiveRegion provides a dedicated announcement channel for slide changes, using a 100ms delay for reliable screen reader detection.

::: faq

??? How does multi-slide display work?

The `per-view` prop controls how many slides are visible at once. The Viewport measures its own layout (padding, gaps) from the DOM and computes each slide's width automatically. It uses CSS scroll-snap so the browser handles all scroll physics and snap behavior natively.

??? Can I use fade transitions instead of sliding?

The Carousel is built on CSS scroll-snap for native drag/swipe support. For fade transitions, use the `Step` provider component with `Presence` for mount/unmount animations — it gives you the same navigation model (next/prev/circular) without scroll-based layout.

??? How do I build an autoplay carousel?

Use the `autoplay` prop with an interval in milliseconds. The root slot exposes `isAutoplay`, `isPaused`, `remaining`, `play`, `stop`, `pause`, and `resume` for controlling playback. Autoplay pauses automatically during touch and mouse drag interactions. Use `Carousel.Progress` to visualize the timer.

```vue
<Carousel.Root v-slot="{ isAutoplay, play, stop }" :autoplay="5000">
  <Carousel.Viewport>
    <!-- slides -->
  </Carousel.Viewport>

  <Carousel.Progress class="h-1 bg-surface-variant" />
</Carousel.Root>
```

:::

<DocsApi />
