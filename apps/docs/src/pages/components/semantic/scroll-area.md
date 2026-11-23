---
title: ScrollArea - Native Scrolling with Custom Scrollbars
meta:
- name: description
  content: Headless scroll area for Vue 3 that keeps native scrolling and adds styleable scrollbars shown on hover, while scrolling, on overflow, or always.
- name: keywords
  content: scroll area, scrollbar, custom scrollbar, overflow, scroll, thumb, Vue 3, headless, accessible
features:
  category: Component
  label: 'C: ScrollArea'
  github: /components/ScrollArea/
  renderless: false
  level: 2
related:
  - /components/semantic/splitter
  - /composables/system/use-resize-observer
  - /components/primitives/atom
---

# ScrollArea

A scroll region that keeps native scrolling and replaces the browser's scrollbars with ones you can style.

<DocsPageFeatures :frontmatter />

## Usage

::: gn-example
/components/scroll-area/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { ScrollArea } from '@vuetify/v0'
</script>

<template>
  <ScrollArea.Root>
    <ScrollArea.Viewport />

    <ScrollArea.Scrollbar>
      <ScrollArea.Thumb />
    </ScrollArea.Scrollbar>

    <ScrollArea.Corner />
  </ScrollArea.Root>
</template>
```

## Examples

::: gn-example
/components/scroll-area/StyledScrollbar.vue 1
/components/scroll-area/visibility.vue 2

### Visibility Modes

A table that overflows on both axes, with a switch for the four `visibility` modes. Hover the area, scroll it, or drag a thumb to see how each mode decides when the scrollbars appear.

`hover` is the default and suits most panels: scrollbars appear while the pointer is over the area or it is scrolling, then fade out `delay` ms later. `scroll` is quieter and shows them only while the content moves, which fits dense lists that the user scans with a wheel or touchpad. `auto` shows a scrollbar whenever its axis overflows, like a classic desktop scrollbar. `always` keeps the track visible even when nothing overflows, which keeps the layout stable when content size changes.

The scrollbars never animate by themselves. Each one carries `data-state="visible"` or `data-state="hidden"`, and the example fades them with a CSS transition on that attribute. The scrollbar waits for running transitions and animations to finish before it is hidden with `display: none`, so exit animations play out in full.

Because both axes have a scrollbar, `ScrollArea.Corner` fills the square where they meet. The root also sets `--v0-scroll-area-corner-width` and `--v0-scroll-area-corner-height`, and the scrollbars use them to stop short of the corner.

| File | Role |
|------|------|
| `StyledScrollbar.vue` | Reusable scrollbar with a thumb, a fade on `data-state`, and an accent on `data-dragging` |
| `visibility.vue` | Two-axis scroll area with a visibility mode switcher |
:::

## Recipes

### Horizontal Scrolling

Scrolling is enabled only on axes that have a `ScrollArea.Scrollbar`. Add a horizontal scrollbar to scroll sideways; without it, horizontal overflow is clipped.

```vue
<script setup lang="ts">
  import { ScrollArea } from '@vuetify/v0'
</script>

<template>
  <ScrollArea.Root class="w-80">
    <ScrollArea.Viewport class="size-full">
      <div class="flex gap-4 w-max">
        <div v-for="n in 12" :key="n" class="size-32 shrink-0 rounded-lg bg-surface-variant" />
      </div>
    </ScrollArea.Viewport>

    <ScrollArea.Scrollbar orientation="horizontal" class="h-2">
      <ScrollArea.Thumb class="rounded-full bg-on-surface/30" />
    </ScrollArea.Scrollbar>
  </ScrollArea.Root>
</template>
```

### Programmatic Scrolling

The root exposes `scrollTo(orientation, offset)` through its slot props and template ref. The offset is measured from the start edge and clamped to the scrollable range, also in right-to-left layouts.

```vue
<script setup lang="ts">
  import { ScrollArea } from '@vuetify/v0'
</script>

<template>
  <ScrollArea.Root v-slot="{ scrollTo }" class="h-64">
    <ScrollArea.Viewport class="size-full">
      <button @click="scrollTo('vertical', Infinity)">Jump to end</button>
      Long content
    </ScrollArea.Viewport>

    <ScrollArea.Scrollbar>
      <ScrollArea.Thumb />
    </ScrollArea.Scrollbar>
  </ScrollArea.Root>
</template>
```

### Hide Delay

Set `delay` to change how long the scrollbars stay visible after the pointer leaves or scrolling stops in `hover` and `scroll` modes.

```vue
<template>
  <ScrollArea.Root visibility="scroll" :delay="1200">
    <ScrollArea.Viewport />

    <ScrollArea.Scrollbar>
      <ScrollArea.Thumb />
    </ScrollArea.Scrollbar>
  </ScrollArea.Root>
</template>
```

## Accessibility

ScrollArea keeps the browser's own scrolling, so keyboard, touch, wheel, and screen reader behavior stay native.

- The viewport gets `tabindex="0"` while it overflows on a scrollable axis, so keyboard users can focus and scroll it with the arrow keys, Page Up / Page Down, Home, End, and Space
- Scrollbars and the corner are `aria-hidden="true"`: they duplicate what the viewport already offers to assistive technology
- Native scrollbars are hidden with `scrollbar-width: none`, and scroll positions, find-in-page, and scroll anchoring work as usual
- Give the viewport an accessible name (for example `aria-label`) when the scrollable region is not labelled by nearby content

## FAQ

::: faq

??? Why doesn't my area scroll?

The root needs a bounded size (for example a height), and the viewport must fill it — give it `size-full` or an explicit size. Each axis also needs its own `ScrollArea.Scrollbar`; axes without one are clipped.

??? How do I animate the scrollbars in and out?

Style `[data-state="hidden"]` and `[data-state="visible"]` on `ScrollArea.Scrollbar` with a CSS transition or animation. The scrollbar waits for it to finish before hiding.

??? Does it work in right-to-left layouts?

Yes. The vertical scrollbar and the corner use logical insets, so they move to the left side under `dir="rtl"`, and the horizontal thumb and track clicks are mirrored.

??? What does the thumb size depend on?

The thumb length is the visible share of the content multiplied by the track length, with an 18px minimum so it stays easy to grab on very long content.

:::

<DocsApi />
