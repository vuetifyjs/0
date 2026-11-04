---
title: BCarousel - Bootstrap 6 Carousel for Vue
meta:
- name: description
  content: Bootstrap 6 carousel markup with Vuetify0 behavior — stacked slides, optional fade, an autoplay interval, and arrow keys, styled by your own Bootstrap CSS.
- name: keywords
  content: bootstrap 6 carousel, vue carousel, slides, fade, autoplay, bootstrap vue, paper bootstrap
features:
  category: Component
  label: 'C: BCarousel'
  level: 2
  renderless: false
  group: content
related:
  - /systems/bootstrap
  - /systems/bootstrap/stepper
  - /components/semantic/carousel
---

# BCarousel

A stacked slideshow. The current slide is the active item. Previous and next move it, and the arrow keys do the same.

<DocsPageFeatures :frontmatter />

<DocsBootstrapReference
  href="https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/components/carousel/"
  title="Carousel"
/>

## Usage

`v-model` is the slide index. The first slide starts at 0. The first Bootstrap example puts the title and the controls above the slides. Pass that row as the `controls` slot. Without the slot, previous and next sit under the slides.

::: ds-example
/systems/bootstrap/carousel/basic
:::

### The markup Bootstrap documents

The HTML tab is Bootstrap's first carousel, top controls. The Vue tab is the same tree. `data-bs-slide` and `data-bs-ride` are the bundle's behavior. This package does not emit them.

::: code-group no-filename

```html Bootstrap collapse
<div class="carousel slide">
  <div class="d-flex justify-content-between align-items-center">
    <h5 class="mb-0">Top controls</h5>
    <div>
      <button class="btn-icon btn-sm" type="button">
        <span class="carousel-icon-prev" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="btn-icon btn-sm" type="button">
        <span class="carousel-icon-next" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  </div>
  <div class="carousel-inner rounded-5">
    <div class="carousel-item active">First slide</div>
    <div class="carousel-item">Second slide</div>
    <div class="carousel-item">Third slide</div>
  </div>
</div>
```

```vue Vue collapse
<template>
  <BCarousel v-model="index" inner-class="rounded-5">
    <template #controls="{ next, prev }">
      <div class="d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Top controls</h5>
        <div>
          <BButton icon size="sm" @click="prev">
            <span class="carousel-icon-prev" aria-hidden="true" />
            <span class="visually-hidden">Previous</span>
          </BButton>
          <BButton icon size="sm" @click="next">
            <span class="carousel-icon-next" aria-hidden="true" />
            <span class="visually-hidden">Next</span>
          </BButton>
        </div>
      </div>
    </template>

    <BCarouselItem>First slide</BCarouselItem>
    <BCarouselItem>Second slide</BCarouselItem>
    <BCarouselItem>Third slide</BCarouselItem>
  </BCarousel>
</template>
```

:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BCarousel, BCarouselItem } from '@paper/bootstrap'
</script>

<template>
  <BCarousel>
    <BCarouselItem />
  </BCarousel>
</template>
```

## Composed on v0

Slide order and the previous and next actions come from [Carousel](/components/semantic/carousel). The root and each item are renderless, so `carousel`, `slide`, and `carousel-item` sit on elements this package renders.

`autoplay` starts a timer. `true` means 5000ms. `false` does not start it. Changing the interval restarts the timer.

## Examples

::: ds-example
/systems/bootstrap/carousel/fade

### Fade

`fade` adds `carousel-fade` and keeps `slide`. The default, with `fade` omitted, is the stacked carousel. The pinned page has no indicator row, so this component does not render dots.
:::

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `number` | — | Index of the current slide. Adds `.active` on that item. |
| `autoplay` | `boolean \| number` | `false` | `true` advances every 5000ms. A number is the interval in milliseconds. |
| `fade` | `boolean` | `false` | Adds `carousel-fade`. |
| `innerClass` | `string` | — | Classes on `.carousel-inner`, such as `rounded-5`. |

There is no `ride` prop and no `show` prop.

## Accessibility

The region is named as a carousel. Previous and next are icon buttons. The hidden names are `Carousel.prev` and `Carousel.next`, or Previous and Next. Right arrow moves forward and left arrow moves back. In RTL those arrows swap. Arrow keys are ignored while focus is in a field. The slides wrap.
