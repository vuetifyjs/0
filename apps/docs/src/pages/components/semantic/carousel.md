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

::: gn-example
/components/carousel/basic
:::

## Anatomy

```vue Anatomy no-filename
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

::: gn-example
/components/carousel/indicator

### Dot Navigation

`Carousel.Indicator` renders a `role="tablist"` container and exposes an `items` array via its default slot. Each item carries `attrs` that wire up `role="tab"`, `aria-selected`, `aria-controls` (linking to the corresponding slide), and roving tabindex — bind them directly with `v-bind="item.attrs"` to get keyboard navigation for free.

This example overlays Previous/Next buttons alongside the dot strip. Styling active dots with `data-[selected]:bg-primary` keeps the interaction purely CSS-driven — no slot-prop threading required. Reach for this layout whenever your design needs visible pagination alongside directional controls.

:::

::: gn-example
/components/carousel/multi-slide

### Three Slides Per View

The `per-view` prop sets how many slides are visible simultaneously. The Viewport measures its own padding and gap from the DOM, then computes each slide's flex-basis automatically — no manual width math needed.

This example pairs `:per-view="3"` with `:autoplay="3000"` and a `Switch` to toggle autoplay. `circular` is enabled so navigation wraps from the last group back to the first. Reach for multi-slide when building card grids, skill lists, or product carousels where users should see context before committing to a slide.

The `flex-[0_0_calc((100%-1.5rem)/3)]` utility on each item aligns the visual width with the `gap-3` between slides so snap points align correctly.

:::

::: gn-example
/components/carousel/peek

### Partial Slide Visibility

Horizontal `px-12` padding on `Carousel.Viewport` creates 48px of visible bleed on each side, revealing the edges of adjacent slides. This gives users a strong affordance that more content exists and that dragging will reveal it — without requiring explicit Previous/Next buttons.

Peek is a pure CSS technique: the viewport clips at its own bounds, so the padding carves space inside the scroll container while the overflowing slide content bleeds in from both sides. Use it for photo galleries, onboarding flows, or any context where a visual "pull" toward the next item improves engagement.

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
| Previous | `aria-label` defaults to `"Previous slide"` (`Carousel.prev` key, localizable), `aria-controls` links to viewport |
| Next | `aria-label` defaults to `"Next slide"` (`Carousel.next` key, localizable), `aria-controls` links to viewport |
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
<template>
  <Carousel.Root v-slot="{ isAutoplay, play, stop }" :autoplay="5000">
    <Carousel.Viewport>
      <!-- slides -->
    </Carousel.Viewport>

    <Carousel.Progress class="h-1 bg-surface-variant" />
  </Carousel.Root>
</template>
```

:::

<DocsApi />
