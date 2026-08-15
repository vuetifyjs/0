---
title: EmAlert - Emerald Alert for Vue
meta:
- name: description
  content: Emerald's alert — four status variants whose live-region role follows severity, so errors interrupt and everything else waits its turn. Composed on Vuetify0's Atom.
- name: keywords
  content: emerald alert, vue alert, status message vue, live region vue, aria alert role, design system alert
features:
  category: Component
  label: 'C: EmAlert'
  level: 1
  renderless: false
  order: 7
related:
  - /systems/emerald
  - /systems/emerald/button
  - /components/primitives/atom
---

# EmAlert

<DocsPageFeatures :frontmatter />

A status message with four severity variants. The live-region role follows the severity — errors interrupt, everything else waits — and the title and description are parts you compose.

## Usage

`EmAlert` is the container; `EmAlertTitle` and `EmAlertDescription` are the two parts that go inside it. Both are optional and both are plain slots, so an alert can be a single line of text, a title over a description, or anything else the message needs.

`variant` picks the severity, and severity does almost all the work: it sets the border and background from Emerald's status palette *and* decides how assistive technology hears the message. The default is `error` — an alert you render without thinking about it is treated as the urgent kind, which is the safe wrong guess.

::: ds-example
/systems/emerald/alert/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { EmAlert, EmAlertDescription, EmAlertTitle } from '@paper/emerald'
</script>

<template>
  <EmAlert>
    <EmAlertTitle />

    <EmAlertDescription />
  </EmAlert>
</template>
```

## Composed on v0

`EmAlert` renders v0's [Atom](/components/primitives/atom) — the polymorphic primitive at the bottom of the component system — rather than a behavioral compound, because an alert has no behavior to wrap. There is nothing to open, select, or validate; the component's only logic is one line that derives the live-region role from the variant.

Atom's job here is the rendering contract. It can render as any element or as nothing at all — that is its `as` and `renderless` surface — and `EmAlert` uses exactly one point on that surface: a `div`. Neither prop is part of `EmAlert`'s own surface, so an `EmAlert` renders as an element in the flow. What you do get from the base is standard attribute forwarding — a `class` or `id` you put on `EmAlert` lands on that root `div`.

The split is the usual Emerald one, just with less on v0's side than usual: v0 renders the element, Emerald owns everything painted on it. The variant is published as a `data-variant` attribute and every visual rule in the stylesheet hangs off that attribute — Emerald writes no state classes. `EmAlertTitle` and `EmAlertDescription` are pure Emerald: plain `div`s carrying the class the alert's stylesheet targets, with no v0 involvement at all.

## Examples

::: ds-example
/systems/emerald/alert/variants

### Variants

The four variants map onto Emerald's status palette — `error` on danger, `warning`, `success`, and `info` each on their own background with a matching border. The text color does not change between them; the surface does, which keeps a stack of mixed alerts readable as a group.

Pick by what the reader must do about it. `error` means something failed and needs action now; `warning` means something will go wrong if ignored; `success` confirms a completed action; `info` is context with no action attached. The variant also decides the announcement urgency — only `error` interrupts a screen reader, the other three wait for a pause — so choosing `error` for emphasis has a cost beyond the color.

One thing the variant does not add is an icon or a label. The tint is the only visual signal of severity, and color alone does not survive color-blindness or grayscale. Put the severity in the words — a title like "Import failed" carries the meaning the background only decorates.
:::

::: ds-example
/systems/emerald/alert/live

### Announcements

An alert is a live region, and a live region announces content that *appears* — an alert sitting in the initial page is generally not read out on load. The pattern that works is the one this example shows: render the alert conditionally, when the thing it reports has actually happened.

The two buttons land in different roles. The error renders `role="alert"`, which is assertive — a screen reader announces it immediately, interrupting whatever it was saying. The success renders `role="status"`, which is polite — it queues behind the current speech. That difference is the reason the role tracks the variant: a failed save justifies an interruption, a confirmation does not.

When the default guess is wrong, `role` overrides it. A validation summary built from `info` styling but reporting a blocking problem can pass `role="alert"`; an error-tinted message that is really a persistent notice can pass `role="status"` so it stops interrupting. The prop changes only the announcement — the colors stay with `variant`.
:::

## Props

<!-- Hand-authored ahead of DocsApi extraction for @paper/emerald -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'error' \| 'success' \| 'info' \| 'warning'` | `'error'` | Severity. Sets the status palette and the default live-region role |
| `role` | `'alert' \| 'status'` | `'alert'` for `error`, `'status'` otherwise | Override the live-region role independently of the variant |

The default slot is the alert's content. There are no named slots and nothing is exposed on the template ref.

### Parts

`EmAlertTitle` and `EmAlertDescription` take no props — each is a single default slot. The title renders in the alert's bold body weight; the description drops to the muted on-surface-variant text color — the same in all four variants. Both are `div`s styled by the alert's stylesheet, so they only make sense inside an `EmAlert`.

## Accessibility

The root is a `div` whose `role` makes it a live region: `role="alert"` carries implicit assertive, atomic live-region semantics, and `role="status"` the polite equivalent. By default `error` gets `alert` and the other three variants get `status`; the `role` prop overrides the mapping without touching the styling.

### What announces, and when

Live regions announce change, not presence. An `EmAlert` rendered into the page after load — a `v-if` flipping true, a list gaining an entry — is what triggers speech; an alert already in the initial HTML is generally not announced. If a message must be heard, render it at the moment its condition becomes true rather than toggling its visibility with CSS.

Because `role="alert"` interrupts, reserve it for messages worth interrupting for. A page that raises assertive alerts for routine confirmations teaches screen-reader users to ignore them. The default mapping encodes that judgment — only `error` is assertive — and the `role` prop is there for the cases where severity and styling genuinely diverge.

### What the component does not do

There is no dismiss button, no timeout, and no keyboard behavior — the component renders a static region and nothing else. It is not focusable and adds nothing to the tab order; do not move focus to an alert when it appears, since the live region already announces it and stealing focus would yank the reader out of what they were doing. If a message needs a dismiss affordance, compose one in — a tertiary [EmButton](/systems/emerald/button) in the default slot — and manage the state yourself.

`EmAlertTitle` is a styled `div`, not a heading, so it adds nothing to the document outline. When an alert's title should appear in the outline — a page-level error summary, for instance — put a real heading element inside the title's slot.
