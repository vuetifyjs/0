---
title: AspectRatio - Reserve Layout Space for Vue 3
meta:
  - name: description
    content: Headless Vue 3 primitive that reserves a fixed width-to-height ratio using CSS aspect-ratio. Prevents Cumulative Layout Shift for media, iframes, and responsive containers.
  - name: keywords
    content: aspect ratio, aspectRatio, CLS, cumulative layout shift, responsive, Vue 3, headless, primitive, iframe wrapper
features:
  category: Component
  label: 'C: AspectRatio'
  github: /components/AspectRatio/
  renderless: false
  level: 1
related:
  - /components/semantic/image
  - /components/primitives/atom
---

# AspectRatio

Reserves a box with a fixed width-to-height ratio using CSS `aspect-ratio`.

<DocsPageFeatures :frontmatter />

## Usage

Wrap any content whose height should track its width. The child fills the
reserved frame — pair with `w-full h-full` or absolute positioning.

::: example
/components/aspect-ratio/basic
:::

## Anatomy

```vue Anatomy playground collapse
<script setup lang="ts">
  import { AspectRatio } from '@vuetify/v0'
</script>

<template>
  <AspectRatio :ratio="16 / 9">
    <!-- content -->
  </AspectRatio>
</template>
```

## Examples

::: example
/components/aspect-ratio/ResponsiveImage.vue 1
/components/aspect-ratio/responsive.vue 2

### Compose with Image

Wrap `Image.Root` in `AspectRatio` to pin the load frame to a fixed
width-to-height ratio. The placeholder, fallback, and loaded image all
share the same reserved box — so the layout never reflows as the image
transitions through `idle → loading → loaded` or drops into `error`.

This composition is the recommended pattern for content images whose
natural dimensions vary, or that come from a CMS where the source's
intrinsic size isn't known at authoring time. Instead of hard-coding
`width`/`height` attributes that may not match the final media, let the
container enforce the frame and let the image cover it via
`object-cover`.

Two tradeoffs to know about:

- The child must fill the frame. Use `w-full h-full` on `Image.Img` (or
  absolute positioning) so it stretches to the reserved box — otherwise
  the box is taller than the rendered image and looks broken.
- A single ratio applies to every descendant. If you need different
  ratios per breakpoint, swap the `:ratio` prop with a responsive
  expression (`computed` driven by `useBreakpoints`) rather than
  layering multiple `AspectRatio` wrappers.

Pairs naturally with `useImage` when you're driving the state machine
manually, and with `useIntersectionObserver` when combining native lazy
loading (`loading="lazy"`) with a reserved frame.

| File | Role |
|------|------|
| `ResponsiveImage.vue` | Reusable wrapper — `AspectRatio` around `Image.Root` with placeholder, fallback, and `object-cover` image |
| `responsive.vue` | Entry point rendering images at two different ratios side-by-side (`16 / 9` landscape and `1` square) |

:::

## Recipes

### Video embed

```vue
<template>
  <AspectRatio :ratio="16 / 9" class="w-full">
    <iframe
      class="w-full h-full"
      src="https://www.youtube.com/embed/..."
    />
  </AspectRatio>
</template>
```

### Square thumbnail grid

```vue
<template>
  <div class="grid grid-cols-3 gap-2">
    <AspectRatio v-for="photo in photos" :key="photo.id" :ratio="1">
      <img :src="photo.src" class="w-full h-full object-cover" />
    </AspectRatio>
  </div>
</template>
```

### Number or string

`ratio` accepts either form. Both produce the same output:

```vue
<template>
  <AspectRatio :ratio="16 / 9" /> <!-- number: 1.777... -->
  <AspectRatio ratio="16 / 9" />  <!-- string -->
</template>
```

## Accessibility

`AspectRatio` is a presentational primitive — it renders a `<div>` with an
inline style and no semantics of its own. Any ARIA attributes belong on the
content inside. Pass `as` to change the element when a different semantic
wrapper is needed (e.g. `as="figure"`).

## Questions

::: faq

??? Why use `AspectRatio` when I can just set `aspect-ratio` in CSS?

You can, and for static layouts it's fine. Reach for `AspectRatio` when the
ratio is dynamic, when you want the intent to be visible at the call site,
or when the same frame wraps more than one piece of content (placeholder,
image, fallback) and all three need to share the reservation.

??? Does the child need `w-full h-full`?

If the child should fill the frame, yes. `aspect-ratio` only reserves the
box — it doesn't size the child. Using `object-cover` on media is the usual
pairing. Absolute positioning (`position: absolute; inset: 0`) on the child
also works and is what layered compositions (image + placeholder + fallback)
typically use.

??? Can I combine `AspectRatio` with `Image.Root`?

Yes — put `AspectRatio` on the outside. `Image.Root` then participates in
the reserved frame without needing its own width/height, and the placeholder
and fallback sit inside the same box. See the [responsive example](#compose-with-image).

??? Does this affect SSR?

No. `aspect-ratio` is an inline style that renders identically on server and
client, so there's no hydration mismatch and no layout shift on hydration.

??? Browser support?

CSS `aspect-ratio` is supported in all modern browsers (Chrome 88+,
Firefox 89+, Safari 15+). Legacy fallbacks (padding-bottom hack) are not
provided — if you need to support older browsers, add your own fallback.

:::

<DocsApi />
