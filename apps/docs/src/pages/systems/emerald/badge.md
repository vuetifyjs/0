---
title: EmBadge - Emerald Badge for Vue
meta:
- name: description
  content: Emerald's badge — a count, label, or status dot in six variants, with numeric capping like 99+. A single-span presentational shell over Vuetify0's Atom.
- name: keywords
  content: emerald badge, vue badge, notification badge, status dot, count badge, vuetify0 atom
features:
  category: Component
  label: 'C: EmBadge'
  level: 1
  renderless: false
  order: 9
related:
  - /systems/emerald
  - /systems/emerald/button
  - /components/primitives/atom
---

# EmBadge

<DocsPageFeatures :frontmatter />

A small pill for a count, a short label, or a bare status dot — six variants over Emerald's status palette, with numeric capping like 99+.

## Usage

`EmBadge` is a single `<span>` with three ways to fill it. `content` takes a number or a short string; the default slot takes arbitrary markup and wins over `content` when both are present; `dot` renders an empty 8px status dot and suppresses content entirely.

Numbers get one convenience: pass `max` and any numeric `content` strictly greater than it renders as `max+` — `content=120, max=99` shows `99+`, while `content=99` still shows `99`. The cap applies to numbers only; string content is rendered as-is regardless of `max`. Digits are set in tabular figures, so a badge counting up does not wobble as its digits change.

There is no auto-hide: `content=0` renders a badge that says 0. When zero means "nothing to show", wrap the badge in `v-if` — the component does not decide that for you.

::: ds-example
/systems/emerald/badge/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { EmBadge } from '@paper/emerald'
</script>

<template>
  <EmBadge />
</template>
```

## Composed on v0

`EmBadge` renders v0's [Atom](/components/primitives/atom) — the polymorphic primitive at the bottom of the component system — pinned to `as="span"`. Atom's other two modes exist but are not exposed here: `EmBadge` forwards neither `as` nor `renderless`, so the anatomy is fixed. A badge is always exactly one span.

What Emerald gets from the Atom base is its attribute forwarding. Everything you put on `EmBadge` that is not a prop — `class`, `aria-hidden`, `role`, an id — lands on the rendered span, which is what makes the call-site accessibility patterns below work without the component needing props for them.

The ownership split is the usual Emerald one: the component publishes state as data attributes — `data-variant` always, `data-dot` when `dot` is set — and the stylesheet hangs every rule off those. The capping logic (`99+`), the slot-over-content precedence, and the dot's content suppression are the only behavior Emerald adds; there is no context, no namespace, and no v0 composable underneath.

## Examples

::: ds-example
/systems/emerald/badge/variants

### Variants

`variant` selects a slot in Emerald's status vocabulary, not just a color. `neutral` is the default — a quiet tinted pill for counts that carry no judgement, like the per-category totals in a navigation list. `primary` is the brand-green filled pill for the count you want noticed.

The remaining four are the status palette, each on its tinted status background. `success`, `danger`, and `info` set their text in the matching status color; `warning` is the exception that switches to dark neutral text, because yellow text on its pale yellow tint would not survive a contrast check. Use them with the same meanings the rest of the app assigns those colors; a badge is usually the smallest element on screen carrying a status, and it is the first place inconsistency shows.

Color is the whole difference between variants — size, type step, and shape are identical across all six, so switching variant never reflows the layout around it.
:::

::: ds-example
/systems/emerald/badge/count

### Counts and the max cap

A count badge is `content` with a number, and `max` is the overflow valve. The comparison is strict: `content` greater than `max` renders as `max+`, equal renders the number itself. Emerald's shell uses `max=9` on toolbar icons where a wide pill would crowd the layout; `max=99` is the convention for list rows with more room.

The cap is visual truncation, not data. Once capped, the real number is gone from the badge — sighted readers see `99+` and screen readers hear `99+`, because that is literally the rendered text. When the exact count matters, keep it somewhere with room for it: the host's accessible name, a tooltip, the page itself.

This example is live so you can push the count across the boundary: it starts at 97, crosses to `99+` on the third click, and the tabular figures keep the pill from shifting as digits change underneath.
:::

::: ds-example
/systems/emerald/badge/dot

### The status dot

`dot` collapses the badge to an 8px circle with no content — the slot and `content` are both ignored while it is set. The four status variants swap their tinted backgrounds for the palette's border-strength colors — `neutral` uses a mid grey and `primary` keeps its brand fill — so a dot stays legible at a size where a pale tint would vanish.

A dot is pure signal: presence, state, activity. The canonical placements are beside a status word, as this example does, or pinned to the corner of an avatar or icon — Emerald's shell does the latter with a `primary` dot on the current user's avatar.

The thing to remember is that a dot is invisible to assistive technology — it is an empty span with no name and no role. Never let it be the only carrier of a state. Beside visible text, as here, the text is the state and the dot is reinforcement; on an avatar corner, put the state in the host's label (`aria-label="John Doe, online"`) and the dot is free to stay decorative.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with EmBadge.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'neutral' \| 'primary' \| 'success' \| 'danger' \| 'info' \| 'warning'` | `'neutral'` | Slot in the status palette |
| `content` | `number \| string` | — | Badge text when the default slot is empty. Numbers participate in `max` capping; strings render as-is |
| `max` | `number` | — | Cap for numeric content. Strictly greater renders as `max+`; equal renders the number |
| `dot` | `boolean` | `false` | Render an empty 8px status dot; suppresses `content` and the slot |

The default slot takes the badge's content and wins over `content` when both are present. There is no `namespace` prop — the badge binds to nothing — and non-prop attributes fall through to the rendered span.

## Accessibility

`EmBadge` sets no ARIA attributes of its own. It renders a span whose text participates in the accessibility tree like any other text, and everything beyond that is a call-site decision — which the attribute fallthrough is there to support.

### A number needs a subject

A badge reading "3" tells a screen-reader user almost nothing on its own: three what, belonging to which control? The pattern Emerald's own shell uses is to fold the meaning into the host's accessible name and hide the badge from the tree:

```vue
<template>
  <EmButton :aria-label="`Notifications, ${unread} unread`" variant="tertiary">
    <EmIcon name="bell" size="s" />

    <EmBadge aria-hidden="true" :content="unread" :max="9" variant="primary" />
  </EmButton>
</template>
```

That keeps one announcement — "Notifications, 4 unread, button" — instead of a button name followed by a floating, unexplained number. It also survives capping: the label carries the real count while the pill shows `9+`.

### Dots are silent

A `dot` badge renders an empty element — no text, no name, no role. Assistive technology skips it entirely, and so does anyone who cannot distinguish the dot's color. Pair it with visible text, or put the state in the host's label as the shell does for its avatar status dot. A color-only dot is not a reduced version of the state; for part of your audience it is the absence of it.

### Capped counts

Once `max` truncates, `max+` is the badge's literal text — read out exactly as sighted users see it. If the precise number matters, surface it in the host's label or nearby text; nothing retains it for you.
