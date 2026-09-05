---
title: EmTag - Emerald Tag for Vue
meta:
- name: description
  content: Emerald's tag — a compact status and filter label in four variants that becomes a native toggle button when interactive. Composed on Vuetify0's Atom.
- name: keywords
  content: emerald tag, vue tag, filter chip vue, toggle tag, status label vue, design system tag
features:
  category: Component
  label: 'C: EmTag'
  level: 1
  renderless: false
  order: 27
related:
  - /systems/emerald
  - /systems/emerald/badge
  - /components/primitives/atom
---

# EmTag

<DocsPageFeatures :frontmatter />

A compact label for statuses and filters — a plain span by default, and a real toggle button the moment you make it interactive.

## Usage

`EmTag` has four props and one slot, and the slot is the label. `variant` picks the palette — `neutral` for plain categorization, `success`, `danger` and `info` when the tag carries a status. The status variants tint the border; `neutral` keeps the default one; and every variant holds a matching background in reserve for the selected state.

The prop that changes what the component *is* rather than how it looks is `interactive`. Off, the tag is static text in a pill: nothing to click, nothing to focus. On, it renders a native button with pressed-state semantics, which is the shape a filter chip should have. `selected` and `disabled` apply to both modes, but only the interactive tag communicates them to assistive technology — the details are under Accessibility.

::: ds-example
/systems/emerald/tag/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { EmTag } from '@paper/emerald'
</script>

<template>
  <EmTag />
</template>
```

## Composed on Vuetify0

`EmTag` renders a single [Atom](/components/primitives/atom) — Vuetify0's polymorphic foundation element — and the component's real job is deciding what to ask that Atom to be. With `interactive` off it renders as a `span`; on, it renders as a `button` with `type="button"`, so a tag inside a form never submits it by accident.

The Atom's `as` and `renderless` escape hatches are not part of the prop surface — the element choice above *is* the component, and exposing `as` would let a caller undo it. What does pass through is everything Vue's attribute fallthrough carries: the Atom is the single root, so a `@click` listener, an `id`, or an extra class lands on whichever element the tag rendered as.

Styling hangs entirely off data attributes the template writes — `data-variant` for the palette, `data-selected` and `data-disabled` for state. There are no state classes, and `aria-pressed` and the native `disabled` attribute are written only in interactive mode, where there is a control for them to describe.

## Examples

::: ds-example
/systems/emerald/tag/filter

### Filter tags

Interactive tags are toggle buttons, and a filter row is their natural habitat: each tag flips its own membership in a selection, and `selected` feeds back into the tinted background that marks it active.

The component owns no selection state — `selected` is an input, not a model. That keeps the wiring honest: the array of active topics lives in your component, the click handler mutates it, and the tag merely reflects the result. There is no `v-model` and no custom event to learn; the native click is the whole API.

Because each tag renders as a real button, the row is keyboard-complete for free — Tab moves between tags, Space and Enter toggle, and a screen reader hears each one as a toggle button with its pressed state. If you need the row to enforce rules — single-select, at-least-one — that logic belongs in the handler, exactly where it would live for any group of buttons.
:::

::: ds-example
/systems/emerald/tag/disabled

### Disabled

`disabled` dims the tag to half opacity and removes it from pointer interaction in both modes — but the two modes differ underneath, and the difference matters.

On an interactive tag, `disabled` sets the native `disabled` attribute: the button leaves the tab order, activation is blocked by the platform, and assistive technology announces it as unavailable. This is the state for a filter that exists but cannot currently be changed — a locked facet, a plan-gated option.

On a static tag, `disabled` is purely visual. A span has no disabled semantics, so the prop writes `data-disabled` for the stylesheet and nothing for the accessibility tree — a screen reader reads the same text either way. Reach for it only when nearby interactive tags are disabled and the static ones should match visually; a lone dimmed label with no explanation is decoration, not information.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with EmTag.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'neutral' \| 'success' \| 'danger' \| 'info'` | `'neutral'` | Palette — status variants tint the border; every variant tints the background once selected |
| `selected` | `boolean` | `false` | Selected styling via `data-selected`; reflected as `aria-pressed` when interactive |
| `disabled` | `boolean` | `false` | Dims the tag and blocks pointer interaction. Sets the native `disabled` attribute only when interactive |
| `interactive` | `boolean` | `false` | Renders a native `button` with `type="button"` instead of a `span` |

The default slot is the label. There are no named slots, no events, and no exposed methods — a click on an interactive tag is handled with a plain `@click` via attribute fallthrough.

## Accessibility

The `interactive` prop is an accessibility decision, not a styling one — it changes the rendered element and everything assistive technology is told:

| Mode | Rendered as | Focusable | Semantics |
|------|-------------|-----------|-----------|
| Static | `span` | No | Plain text. `selected` and `disabled` are visual only |
| Interactive | `button type="button"` | Yes | Toggle button — `aria-pressed` mirrors `selected`; `disabled` is the native attribute |

An interactive tag always carries `aria-pressed`, true or false, so it always announces as a toggle. Use `interactive` only when the tag genuinely flips state in place — a filter, a selectable topic. A tag that navigates somewhere should be a link styled to match, and a tag that only displays a status should stay static; a "toggle button" that does not toggle is a promise the interface breaks.

The static tag makes the inverse promise: it tells assistive technology nothing beyond its text. `selected` and `disabled` on a static tag are stylesheet state — there is no role and no ARIA to carry them — so any meaning they express visually must also live in the text or the surrounding content.

Variant color is in the same category. `success` and `danger` differ only by border and background tint, so let the label say what the color implies — "Failed" on a danger tag, not a bare glyph the color alone must explain.

Focus handling comes from the platform: only the interactive tag can take focus, and Emerald's focus ring appears on `:focus-visible` only, so keyboard focus shows a ring where a mouse click does not.
