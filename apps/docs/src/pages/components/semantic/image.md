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

`Image.Root` owns the loading state machine via `useImage`. `Image.Img` renders the image element and reports load and error events to the context. `Image.Placeholder` is shown while idle or loading; `Image.Fallback` is shown on error. `Image.Swap` is a drop-in alternative to `Image.Img` that crossfades between sources when `src` changes — see the [gallery example](#gallery-navigation-with-image-swap).

::: example
/components/image/basic
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

> [!INFO]
> `src` is the only native image attribute that doesn't live on `Image.Img` because it drives the load state machine — the `idle → loading → loaded | error` lifecycle can't function without knowing the URL to track, so `Image.Root` owns it. Every other image attribute (`alt`, `width`, `height`, `srcset`, `sizes`, `crossorigin`, `referrerpolicy`, `decoding`, `loading`, `fetchpriority`) is a pure rendering concern and lives on `Image.Img`, where it describes the element that actually renders it.

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
/components/image/BlurUpImage.vue 1
/components/image/observer.vue 2

### Blur-up LQIP with observer loading

Wrap `Image.Root` in a reusable component that drives a fade-in transition from a low-quality placeholder (LQIP) to the full-resolution image. A tiny blurred thumbnail ships in the initial HTML (or as a small base64 string), visible immediately; the full image is withheld by the `lazy` prop until `Image.Root` intersects the viewport, at which point it loads and fades in over the blur.

```mermaid "Blur-up transition"
flowchart LR
  Scroll["User scrolls<br/>container in"]
  Observer["IntersectionObserver<br/>fires (once)"]
  Status["status:<br/>idle → loading"]
  Load["img.onload"]
  DS["data-state<br/>= 'loaded'"]
  Fade["CSS fade<br/>opacity 0 → 1"]

  Scroll --> Observer --> Status --> Load --> DS --> Fade
```

Reach for this pattern when you have many below-the-fold images and want both perceived performance (something visible instantly) and actual bandwidth savings (only load what's seen). It shines on photo galleries, article covers, and image-heavy marketing pages where the blur-up effect is part of the aesthetic, not just a loading trick.

Three pieces make it work:

- **`lazy` prop on `Image.Root`** — defers setting the real `src` until the container scrolls into view via `useIntersectionObserver`. Pair with `root-margin` (e.g. `"200px"`) to start loading a bit before the container actually intersects.
- **LQIP inside `Image.Placeholder`** — the blurred preview sits in the reserved frame (typically `absolute inset-0`). It's decorative, so `Image.Placeholder` auto-sets `aria-hidden="true"`.
- **`data-state`-driven opacity** — the real `Image.Img` uses `opacity-0 transition-opacity data-[state=loaded]:opacity-100`, so the fade-in is CSS-only and doesn't require threading slot props through the template.

Gotcha: the `lazy` prop needs a wrapper element to observe — it warns and skips observation when combined with `renderless`. If you need a lazy `<picture>`, observe a parent yourself with `useIntersectionObserver` and gate the source manually via `useImage`'s `eager` option.

| File | Role |
|------|------|
| `BlurUpImage.vue` | Reusable component with LQIP placeholder, `lazy` intersection loading, and CSS-driven fade-in |
| `observer.vue` | Entry point rendering a scrollable list of blur-up images to demonstrate the viewport trigger |

:::

::: example
/components/image/PictureImage.vue 1
/components/image/picture.vue 2

### Picture element with format negotiation

Use `renderless` mode on both `Image.Root` and `Image.Img` to drop their wrapper elements and compose them directly inside a native `<picture>` element. The browser walks the `<source>` list and picks the first format it supports (WebP, AVIF, JPEG XL, etc.); `Image.Img` renders the fallback `<img>` that older browsers use. All loading state is still tracked by the surrounding `Image.Root`, so `Image.Placeholder` and `Image.Fallback` behave identically to the compound form — no extra wiring needed.

Reach for this pattern when you're serving modern image formats for bandwidth or quality gains while keeping a universal fallback, or when you need full control over DOM structure (e.g., embedding inside a `<figure>` with a `<figcaption>`). It's the only way to use `Image.Root`'s state machine with a native `<picture>` without losing either the format negotiation or the state-driven placeholder/fallback pattern.

Two details worth knowing:

- **`renderless` on both** — `Image.Root` must go renderless to avoid wrapping `<picture>` in an extra `<div>`, and `Image.Img` must go renderless so you can place the inner `<img>` as `<picture>`'s last child (where the browser expects it).
- **`lazy` doesn't work here** — observer-driven lazy loading relies on a wrapper element to measure against. Combine native `loading="lazy"` on the inner `<img>` with `fetchpriority` hints for equivalent deferred loading, or wrap the whole composition in an outer element you observe manually.

The `<source>` children are fully browser-driven — `Image.Img` never sees their URLs. It just reports the final `<img>` element's `load`/`error` events back to the context.

| File | Role |
|------|------|
| `PictureImage.vue` | Reusable wrapper that emits a `<picture>` with typed `<source>` children; both `Image.Root` and `Image.Img` go renderless to drop wrapper elements |
| `picture.vue` | Entry point passing WebP and fallback sources to demonstrate format negotiation |

:::

::: example
/components/image/GalleryImage.vue 1
/components/image/gallery.vue 2

### Gallery navigation with Image.Swap

Use `Image.Swap` instead of `Image.Img` when navigating between already-loaded sources should never flash the placeholder. The component renders two stacked `<img>` elements: the newly loaded one fades in while the previous one fades out at the same tempo. Until the new source loads, the old image stays on screen — the user never sees blank space between photos.

```mermaid "Source transition"
flowchart LR
  Change["src changes<br/>(Root.src = newUrl)"]
  Capture["previousSrc ← oldUrl<br/>showPrevious = true"]
  Mount["previous img<br/>mounts at opacity 1"]
  Load["new img loads"]
  Leave["showPrevious = false<br/>previous enters leaving"]
  Fade["crossfade:<br/>previous opacity 1 → 0<br/>current opacity 0 → 1"]
  Unmount["transitionend<br/>done() fires<br/>previous unmounts"]

  Change --> Capture --> Mount --> Load --> Leave --> Fade --> Unmount
```

Reach for this pattern whenever the user can navigate between preloaded sources — image galleries, photo viewers, product thumbnails reacting to a color picker, or anywhere a `v-model` drives `src`. Without `Image.Swap`, each navigation resets the state machine to `loading`; the old image disappears from the DOM and the placeholder shows until the next image loads, producing a visible pop. `Image.Swap` holds the previous image in DOM through the load window, so the transition stays continuous.

A few details worth knowing:

- **Initial mount behaves like `Image.Img`** — there's no previous source on first load, so the component renders a single `<img>` and the placeholder shows while it loads. Only *subsequent* src changes engage the crossfade.
- **Built on the Presence primitive** — the previous layer's mount lifecycle (mounted → leaving → unmounted) is managed by v0's `Presence` composable. CSS targets `data-state='leaving'` to fade opacity 1 → 0, and the `transitionend` event triggers `done()` to finalize the unmount. No `setTimeout`, no manual cleanup.
- **Class routing** — `class` goes on the wrapper `<div>` (layout, border-radius). `img-class` applies to both inner `<img>` elements (object-fit, sizing). `current-class` and `previous-class` target the individual layers — this is where transition/opacity rules live. The component ships no opinionated styling: you write the fade behavior against `data-state`, `data-has-previous` (on current while a swap is in flight), and Presence's `data-[state=leaving]` (on previous during exit).
- **Error state** — if the new image errors, the old one stays visible underneath and `Image.Fallback` overlays as usual. Call `retry()` from the Root slot props or the Fallback slot props to re-attempt the same source.

Not a replacement for `Image.Img` in every case — if you don't need cross-src transitions (single content image, hero banner, avatars), stick with `Image.Img` for the simpler DOM.

| File | Role |
|------|------|
| `GalleryImage.vue` | Reusable wrapper — `Image.Root` rendered twice, once with `Image.Img` and once with `Image.Swap`, plus shared `Image.Placeholder` and `Image.Fallback` overlays |
| `gallery.vue` | Entry point with Previous/Next navigation and a simulated load delay to make the crossfade visible |

:::

## Recipes

### Hero image with high priority

Set `loading="eager"` and `fetchpriority="high"` on hero images to optimize LCP. Always include `width` and `height` to prevent layout shift.

```vue
<template>
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
</template>
```

### Retry on error

The `retry()` function is available from both `Image.Root` and `Image.Fallback` slot props.

```vue
<template>
  <Image.Root src="/photo.jpg">
    <Image.Img alt="Photo" />
    <Image.Placeholder>Loading...</Image.Placeholder>
    <Image.Fallback v-slot="{ retry }">
      <button @click="retry">Retry</button>
    </Image.Fallback>
  </Image.Root>
</template>
```

## Styling

Every Image sub-component exposes `data-state` reflecting the current status (`idle`, `loading`, `loaded`, or `error`). Prefer styling against these data attributes with CSS over threading slot props — the transitions stay CSS-only and the template stays declarative.

```vue
<template>
  <Image.Img
    alt="Photo"
    class="opacity-0 transition-opacity data-[state=loaded]:opacity-100"
  />
</template>
```

```css
/* Or with plain CSS */
[data-state='loaded'] { opacity: 1; }
[data-state='loading'] { animation: pulse 1s infinite; }
[data-state='error'] { border-color: red; }
```

Slot props (`status`, `isLoaded`, etc.) remain available for the rare cases where logic has to branch in the template, but reach for CSS + data attributes first.

## Accessibility

| Element | ARIA / behavior |
| - | - |
| `Image.Img` | `role="img"`, accepts `alt` for accessible name |
| `Image.Swap` | Current `<img>` is the accessible image; the transitioning previous `<img>` is marked `aria-hidden="true"` so screen readers only announce the active source |
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

??? When should I use `Image.Swap` instead of `Image.Img`?

Use `Image.Swap` when the `src` on `Image.Root` can change to a different URL *after* the first image has loaded, and you want to avoid flashing the placeholder between transitions — gallery navigation, product variant thumbnails, anywhere a `v-model` drives `src`. `Image.Img` is the right choice for single-source content images where `src` never changes (or only changes via a full component remount). Pick one per `Image.Root` — the two sub-components aren't designed to coexist.

??? How do I fade in once the image loads?

Style against the `data-state` attribute that every Image sub-component exposes. Using data attributes keeps the transition CSS-only — no slot-prop threading required.

```vue
<template>
  <Image.Img
    alt="Photo"
    class="opacity-0 transition-opacity duration-500 data-[state=loaded]:opacity-100"
  />
</template>
```

The `data-state` attribute holds the current status (`idle`, `loading`, `loaded`, or `error`). The blur-up example uses this pattern.

??? Why isn't `src` on `Image.Img`?

`src` lives on `Image.Root` because it owns the state machine — the source is what the state is about. `Image.Img` accepts the rendering attributes (`alt`, `width`, `height`, `srcset`, `sizes`, etc.) that belong to the rendered element.

:::

<DocsApi />
