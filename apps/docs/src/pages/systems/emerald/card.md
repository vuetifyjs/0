---
title: EmCard - Emerald Card for Vue
meta:
- name: description
  content: Emerald's card — a six-part content surface with complete and simple variants and an optional hover elevation, composed on Vuetify0's Atom primitive.
- name: keywords
  content: emerald card, vue card, design system card, card component vue, vuetify0 atom, paper emerald
features:
  category: Component
  label: 'C: EmCard'
  level: 1
  renderless: false
  order: 11
related:
  - /systems/emerald
  - /systems/emerald/button
  - /components/primitives/atom
---

# EmCard

<DocsPageFeatures :frontmatter />

A surface for grouping related content — header, title, subtitle, body and footer, in two variants, with an optional hover elevation. It is entirely presentational: the card owns no state and no behavior.

## Usage

`EmCard` is a compound of six parts, and only the root takes props. The parts are slot-through containers that carry the card's spacing and type scale — `EmCardHeader` stacks a title over a subtitle, `EmCardBody` fills the remaining height, and `EmCardFooter` right-aligns whatever actions you put in it. Use the parts you need in the order you need them; nothing is required except the root.

`variant` picks the surface treatment — `complete` is the padded, elevated default — and `hoverable` adds an elevation response on pointer hover.

::: ds-example
/systems/emerald/card/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import {
    EmCard,
    EmCardBody,
    EmCardFooter,
    EmCardHeader,
    EmCardSubtitle,
    EmCardTitle,
  } from '@paper/emerald'
</script>

<template>
  <EmCard>
    <EmCardHeader>
      <EmCardTitle />

      <EmCardSubtitle />
    </EmCardHeader>

    <EmCardBody />

    <EmCardFooter />
  </EmCard>
</template>
```

## Composed on v0

`EmCard` renders v0's [Atom](/components/primitives/atom) — the polymorphic primitive every v0 component is built on, whose `as` prop picks the rendered element and whose `renderless` mode removes the element entirely. Emerald uses the narrowest slice of that: it pins `as` to `div` and exposes neither prop, because a card is a styled box and nothing about it varies structurally.

The five parts do not even need Atom. They are plain `div`s with a class each, because there is no behavior to share between them — no context, no namespace, no state flowing from root to part. The compound shape exists purely so the stylesheet can give each region its spacing and type scale.

That also makes `EmCard` the inverse of `EmButton` on one point worth noticing. On the button, v0 publishes state attributes (`data-loading`, `data-disabled`) and Emerald styles them; the card has no state, so the `data-variant` and `data-hoverable` attributes on its root are Emerald's own props reflected to the DOM. The convention is the same — the stylesheet targets data attributes, never state classes — but here Emerald is both the writer and the reader.

## Examples

::: ds-example
/systems/emerald/card/variants

### Variants

The two variants are two different jobs, not two intensities of the same look.

`complete` is a standalone surface: generous padding and a resting shadow that lifts it off the page. It is the variant for content that is *the point* of its region — a settings panel, a summary, a form section. Because it already spends significant space on padding, it earns its footprint best with a header and body inside.

`simple` strips the card back to a rounded, clipped boundary with almost no padding of its own. It is a framing device rather than a surface — reach for it when the content brings its own spacing, or when something should run edge to edge inside the radius: an image, a table, a list. The example pads its body locally, which is the intended pattern — `simple` deliberately does not guess at spacing for you.

Both variants clip their contents to the card's radius, so flush children never poke square corners out of a rounded box.
:::

::: ds-example
/systems/emerald/card/hoverable

### Hoverable cards

`hoverable` makes the card respond to pointer hover — the shadow deepens and the border tints to Emerald's primary. Use it when cards are choices in a set, as here, where the response tells the reader the card is one unit and which one they are on.

The response is visual only. `hoverable` does not make the card interactive: it adds no cursor change, no focus treatment, no keyboard behavior, and clicking it does nothing you did not wire up yourself. If a card *is* a choice, the activation still needs a real control — a link or a button inside the card, or wrapping it — and that control is what keyboard users will see and use. Treat the hover elevation as a preview of interactivity that lives elsewhere, not as the interactivity itself.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with the EmCard sources until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'complete' \| 'simple'` | `'complete'` | Surface treatment. `complete` is padded and elevated; `simple` is a flat, near-flush shell |
| `hoverable` | `boolean` | `false` | Deepens the shadow and tints the border on pointer hover. Purely visual |

The root reflects both props to the DOM — `data-variant` always, `data-hoverable` only when true — which is where to hang any style overrides. Its only slot is the default slot, where the parts go. There are no models and no emits anywhere in the compound.

### Parts

`EmCardHeader`, `EmCardTitle`, `EmCardSubtitle`, `EmCardBody` and `EmCardFooter` take no props at all. Each renders a single `div` with its region's class and a default slot.

## Accessibility

Every element in the compound is a plain `div` — no roles, no ARIA attributes, no keyboard behavior. A card is announced as nothing and read straight through, which is correct for what it is: a visual grouping. Content order in the template is reading order.

### Headings

`EmCardTitle` is a styled `div`, not a heading. That is deliberate — a card cannot know what level it sits at in your document — but it means a page of cards contributes nothing to the heading outline by default. When the card's title should be navigable, put a real heading element inside `EmCardTitle` and flatten its user-agent styles (`font: inherit; margin: 0`) so the visual scale stays the card's while the semantics become yours.

### Hover is not interaction

`hoverable` responds only to `:hover`, so the elevation feedback exists exclusively for pointer users — keyboard and screen-reader users never encounter it, and the card ships no focus treatment because the card itself is never focusable. Any action a card offers must be a real link or button inside it; give that control the focus treatment, and keep the whole-card hover as a pointer-only echo of it. Avoid making the card `div` itself clickable — a click handler on a `div` is invisible to the accessibility tree.
