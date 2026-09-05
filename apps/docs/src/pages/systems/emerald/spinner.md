---
title: EmSpinner - Emerald Spinner for Vue
meta:
- name: description
  content: Emerald's loading spinner — a currentcolor ring in three sizes with a visually hidden label announced by assistive tech. A single-span shell over Vuetify0's Atom.
- name: keywords
  content: emerald spinner, vue spinner, loading indicator, loading spinner vue, aria status, vuetify0 atom
features:
  category: Component
  label: 'C: EmSpinner'
  level: 1
  renderless: false
  order: 23
related:
  - /systems/emerald
  - /systems/emerald/button
  - /components/primitives/atom
---

# EmSpinner

<DocsPageFeatures :frontmatter />

An indeterminate loading ring in three sizes, with a visually hidden label so assistive technology hears what sighted readers see spinning.

## Usage

`EmSpinner` is a fixed-anatomy single span: a rotating ring for the eyes and a hidden text label for everyone else. It has exactly two props — `size` steps the ring through three diameters, and `label` sets the announced text. There are no slots and no models; a spinner either exists or it does not, and `v-if` is how you say which.

It is indeterminate only. There is no value, no percentage, no track — it says "something is happening", not "how much is left". When you can measure progress, reach for a determinate control instead; a spinner that runs for thirty seconds tells the reader less each second it keeps spinning.

The two spinners below look identical on purpose: `label` changes what a screen reader announces, not what renders. Default it says "Loading"; pass something more specific whenever you know what is loading.

::: ds-example
/systems/emerald/spinner/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { EmSpinner } from '@paper/emerald'
</script>

<template>
  <EmSpinner />
</template>
```

## Composed on Vuetify0

`EmSpinner` renders v0's [Atom](/components/primitives/atom) — the polymorphic primitive at the bottom of the component system — pinned to `as="span"`. Atom's other modes are not exposed: the component forwards neither `as` nor `renderless`, so the anatomy is fixed. A spinner is always one span wrapping a ring and a hidden label.

What the Atom base contributes is attribute fallthrough. Anything you put on `EmSpinner` that is not a prop — `class`, `style`, an id, extra ARIA — lands on the rendered span, which is how the recoloring pattern below works without the component needing a `color` prop. The `role="status"` and `aria-live="polite"` on that span are static attributes Emerald places on the Atom, not behavior v0 adds.

The rest is the usual Emerald split: the component publishes `data-size` and the stylesheet hangs every dimension off it, while the ring's color is simply `currentcolor` against a root that defaults to Emerald's primary green. There is no context, no `namespace`, and no Vuetify0 composable underneath — this is the smallest kind of Emerald component there is.

One relative worth knowing about: [EmButton](/systems/emerald/button)'s loading state draws its own ring rather than nesting `EmSpinner`, so it can sit inside the button's layout and inherit the variant's text color. Use the button's `loading` prop there; `EmSpinner` is for everywhere that is not a button.

## Examples

::: ds-example
/systems/emerald/spinner/sizes

### Sizes

`size` picks one of three fixed ring geometries: `sm` is a 14px ring with a 2px stroke, `md` — the default — is 20px with the same stroke, and `lg` is 28px with a heavier 3px stroke so the ring does not look wiry at the larger diameter. There is nothing between the steps and no numeric escape hatch; the three sizes are the vocabulary.

Match the spinner to the thing it stands in for. `sm` sits inline with text and inside dense chrome — a table cell refreshing, a status line. `md` is the general-purpose choice beside buttons and form rows. `lg` is for when the spinner *is* the content: the placeholder for a panel or page that has nothing else to show yet.

The root span is `inline-flex` with `vertical-align: middle`, so a spinner dropped into a line of text sits on the line rather than on the baseline — no wrapper needed to keep it from jittering the typography around it.
:::

::: ds-example
/systems/emerald/spinner/color

### Color

The ring is drawn in `currentcolor`, and the root sets its own color to Emerald's primary green. That one CSS decision is the entire theming API: set `color` on the spinner — through a class or a style, both of which fall through to the span — and the ring follows.

The middle spinner here uses `--emerald-on-surface-variant` to read as quiet chrome rather than a brand accent; the last uses `--emerald-danger-600` for a wait that belongs to a destructive flow. Stick to Emerald's tokens rather than raw hex so the spinner keeps agreeing with the theme it sits in — the tokens move when the scheme does, a hardcoded green does not.

Color here is decoration, not information. The label does not change with the color, and a reader who cannot distinguish the ring's hue loses nothing — which is exactly how it should stay. If the color means something, say that something in `label` or in nearby text.
:::

::: ds-example
/systems/emerald/spinner/pending

### Standing in for pending content

The working pattern for most spinners: render the spinner while a request is in flight, and replace it with the result when the answer arrives. `v-if`/`v-else` is the whole mechanism — the spinner has no open or active state of its own.

Give the in-context spinner a specific `label`. The default "Loading" is fine for a page-level spinner where there is only one thing it could mean; next to one widget among many, "Loading activity" tells a screen-reader user which region is busy while the rest of the page is not.

Note what this example does not do: it does not keep a visible "Loading…" text beside the spinner. The label already carries that text for assistive tech, so pairing the spinner with the same words visibly would announce twice. Show visible text *or* rely on the hidden label — pick per surface, not both.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with EmSpinner.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Ring geometry: 14px, 20px, or 28px diameter, with a heavier stroke at `lg` |
| `label` | `string` | `'Loading'` | Accessible name — rendered as visually hidden text inside the live region |

There are no slots, no models, and no emits. There is no `namespace` prop — the spinner binds to nothing — and non-prop attributes fall through to the rendered span.

## Accessibility

The root span is `role="status"` with an explicit `aria-live="polite"` — a polite live region whose content is the hidden label. The ring itself is `aria-hidden`; the label text is the entire accessible surface.

### The label is the announcement

`.emerald-spinner__label` is visually hidden but present in the accessibility tree, so the region's text is "Loading" — or whatever `label` says. Because the region is polite, updating `label` while the spinner is mounted announces the new text without interrupting whatever the reader was hearing.

Be aware that a live region inserted into the DOM *together with* its content is not reliably announced — some screen readers only report changes to regions they already knew about. If the announcement matters, either keep a region mounted and change its text, or surface the outcome elsewhere when the wait ends: a spinner tells the reader a wait started, not that it finished. Say what happened when it does.

### What the spinner does not set

`EmSpinner` sets no `aria-busy` — that attribute belongs on the region that is busy, not on the indicator inside it. When a whole panel is loading, put `aria-busy="true"` on the panel and let the spinner be its visible sign. It also claims no relationship to any control: pair it with [EmButton](/systems/emerald/button)'s own `loading` prop for in-button waits rather than composing the two.

### Motion

The ring's rotation is a plain CSS animation with no reduced-motion override — it spins regardless of `prefers-reduced-motion`. The animation is small and contained, which is usually acceptable under WCAG's essential-motion carve-out for loading indicators, but if your product honors the preference strictly, pause the `emerald-spinner-spin` animation yourself in a reduced-motion media query.
