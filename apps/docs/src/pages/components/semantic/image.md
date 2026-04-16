---
title: Image - Headless Image Component with Placeholder and Fallback
meta:
- name: description
  content: Headless Vue 3 image component with state-driven placeholder, error fallback, retry support, and optional IntersectionObserver-based lazy loading.
- name: keywords
  content: image, lazy loading, placeholder, fallback, fetchpriority, srcset, picture, Vue 3, headless, retry
features:
  category: Component
  label: 'C: Image'
  github: /components/Image/
  renderless: false
  level: 2
related:
  - /composables/system/use-image
  - /components/semantic/avatar
  - /composables/system/use-intersection-observer
---

# Image

Headless image component with state-driven placeholder and error fallback. Tracks the loading lifecycle and exposes `retry()`, with optional IntersectionObserver-driven lazy loading.

<DocsPageFeatures :frontmatter />

## Usage

`Image.Root` owns the loading state machine via `useImage`. `Image.Img` renders the image element and reports load and error events to the context. `Image.Placeholder` is shown while idle or loading; `Image.Fallback` is shown on error.

::: example
/components/image/basic

### Image with placeholder and fallback

The basic compound: a placeholder during loading, the image when loaded, and a fallback on error. Native `loading="lazy"` defers the request until the browser deems it necessary.

:::

## Anatomy

```vue Anatomy playground collapse
<script setup lang="ts">
  import { Image } from '@vuetify/v0'
</script>

<template>
  <Image.Root>
    <Image.Img />

    <Image.Placeholder />

    <Image.Fallback />
  </Image.Root>
</template>
```

## Architecture

`Image.Root` calls `useImage` to manage status, and optionally wires up `useIntersectionObserver` when the `lazy` prop is set. Children consume the root context via `useImageRoot`.

```mermaid "Image lifecycle"
stateDiagram-v2
  [*] --> idle: lazy = true
  [*] --> loading: lazy = false
  idle --> loading: enters viewport
  loading --> loaded: img.onload
  loading --> error: img.onerror
  loaded --> loading: src changes
  error --> loading: retry / src changes
```

### Lazy loading strategies

The component supports two distinct lazy loading mechanisms — pick the one that matches your requirements.

| Strategy | How | When to use |
| - | - | - |
| Native | `loading="lazy"` on `Image.Img` | Most below-the-fold images. Zero JS, browser-managed. |
| Observer | `lazy` prop on `Image.Root` | When you need precise control over when the source is set — e.g. blur-up transitions, prefetch, or custom intersection thresholds. |

You can combine both: use the observer for state control and `loading="lazy"` as a fallback for browsers without IntersectionObserver support.

## Examples

::: example
/components/image/observer

### Observer-driven lazy loading

`lazy` on `Image.Root` defers the request until the root element intersects the viewport. The placeholder is visible while idle.

:::

::: example
/components/image/picture

### Picture element with format negotiation

Use `renderless` mode on both `Image.Root` and `Image.Img` to drop the wrappers and emit a native `<picture>` element with `<source>` children for format negotiation.

:::

## Recipes

### Hero image with high priority

Set `loading="eager"` and `fetchpriority="high"` on hero images to optimize LCP. Always include `width` and `height` to prevent layout shift.

```vue
<Image.Root src="/hero.jpg">
  <Image.Img
    alt="Hero"
    width="1600"
    height="900"
    loading="eager"
    fetchpriority="high"
  />
  <Image.Placeholder>
    <img src="/hero-tiny.jpg" class="w-full blur-sm" />
  </Image.Placeholder>
</Image.Root>
```

### Retry on error

The `retry()` function is available from both `Image.Root` and `Image.Fallback` slot props.

```vue
<Image.Root src="/photo.jpg">
  <Image.Img alt="Photo" />
  <Image.Placeholder>Loading...</Image.Placeholder>
  <Image.Fallback v-slot="{ retry }">
    <button @click="retry">Retry</button>
  </Image.Fallback>
</Image.Root>
```

## Accessibility

| Element | ARIA / behavior |
| - | - |
| `Image.Img` | `role="img"`, accepts `alt` for accessible name |
| `Image.Placeholder` | `aria-hidden="true"` — placeholder is decorative |
| `Image.Fallback` | `role="img"` — provide alternate text inside the slot |

Always pass `width` and `height` props on `Image.Img` to reserve layout space and prevent Cumulative Layout Shift while the image loads.

## FAQ

::: faq

??? When should I use Avatar vs Image?

`Avatar` is for identity / profile UIs with priority-based multi-source fallback (e.g. high-res then low-res then initials). `Image` is for general content images with state-driven placeholder and fallback for a single source.

??? Should I use the `lazy` prop or the `loading="lazy"` attribute?

Use native `loading="lazy"` for most cases — it's declarative, zero-JS, and browser-managed. Use the `lazy` prop on `Image.Root` only when you need to control exactly when the source is set, such as for blur-up transitions, prefetching, or custom intersection thresholds.

??? How do I prevent layout shift?

Always set `width` and `height` on `Image.Img`. The browser uses these to reserve space before the image loads, eliminating Cumulative Layout Shift.

??? Can I use a `<picture>` element with multiple `<source>` formats?

Yes — set `renderless` on both `Image.Root` and `Image.Img`, then compose them inside a native `<picture>` element. See the picture example.

??? How do I fade in once the image loads?

Use the `status` slot prop from `Image.Root` to drive CSS classes, e.g. `:class="{ 'opacity-100': status === 'loaded' }"`.

??? Why isn't `src` on `Image.Img`?

`src` lives on `Image.Root` because it owns the state machine — the source is what the state is about. `Image.Img` accepts the rendering attributes (`alt`, `width`, `height`, `srcset`, `sizes`, etc.) that belong to the rendered element.

:::

<DocsApi />
