---
title: BuNotification - Bulma Notification for Vue
meta:
- name: description
  content: Bulma's notification in Vue — v-model dismiss that unmounts the block, color and light modifiers, and a labelled delete button the upstream documentation ships unlabeled.
- name: keywords
  content: bulma notification, vue notification, delete button, is-light, bulma vue, paper bulma
features:
  category: Component
  label: 'C: BuNotification'
  level: 2
  renderless: false
  order: 11
related:
  - /systems/bulma
  - /systems/bulma/message
  - /components/primitives/presence
---

# BuNotification

<DocsPageFeatures :frontmatter />

Bulma's `.notification` with a dismiss that unmounts the block.

> [!NOTE]
> Reference: [Notification on bulma.io](https://bulma.io/documentation/elements/notification/) — classes and visual variants. This page is the JavaScript.

## Usage

`v-model` is visibility, default `true`. The `.delete` button is always rendered and always wired; clicking it sets the model to `false` and the notification leaves the DOM. `color` and `light` are the two modifiers.

::: ds-example
/systems/bulma/notification/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BuNotification } from '@paper/bulma'
</script>

<template>
  <BuNotification />
</template>
```

## Composed on v0

`BuNotification` wraps v0's [Presence](/components/primitives/presence) and nothing else. Presence is a mount lifecycle, not a notification primitive: `v-model` drives present/leaving/unmounted, `data-state` is forwarded onto `.notification`, and with Presence's default `immediate` the leaving state resolves on the next tick, so a dismissed notification unmounts rather than sitting in the DOM at `display: none`.

The delete button is not Presence's. Presence has no close affordance and no default content. `BuNotification` always renders `button.delete` as the first child — matching the fixture's shape — and the click writes `false` through the model. The one deliberate delta from the fixture is `aria-label="delete"`: upstream ships that button unlabeled, which is an axe failure, and labelling it is a declared deviation on the [Bulma overview](/systems/bulma).

There is no queue, no timeout, and no severity role. A notification that should announce, stack, or expire is a different component — [Snackbar](/components/semantic/snackbar) in v0, or `BuMessage` when the block has a header.

## The markup you know

The Bulma tab is the markup [published on bulma.io](https://bulma.io/documentation/elements/notification/), captured verbatim in the conformance fixture. The Vue tab is the component that renders it. The conformance suite diffs the two on every test run — `type="button"` on the delete control is the tolerated difference.

::: code-group no-filename

```html Bulma
<div class="notification">
  <button class="delete"></button>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit lorem ipsum dolor.
  <strong>Pellentesque risus mi</strong>, tempus quis placerat ut, porta nec
  nulla. Vestibulum rhoncus ac ex sit amet fringilla. Nullam gravida purus diam,
  et dictum <a>felis venenatis</a> efficitur.
</div>
```

```vue Vue
<template>
  <BuNotification>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit lorem ipsum dolor.
    <strong>Pellentesque risus mi</strong>, tempus quis placerat ut, porta nec
    nulla. Vestibulum rhoncus ac ex sit amet fringilla. Nullam gravida purus diam,
    et dictum <a>felis venenatis</a> efficitur.
  </BuNotification>
</template>
```

:::

You write no `.delete` and no dismiss handler. The component owns the button and drives it from `v-model`.

## Examples

::: ds-example
/systems/bulma/notification/color

### Color

`color` is `is-{color}` on `.notification`: `primary`, `link`, `info`, `success`, `warning`, `danger`. `light` tints the same palette. Neither prop changes behavior — a danger notification dismisses the same way a default one does.

Pick by what the reader must do about it. `danger` and `warning` for failures and risks, `success` for a completed action, `info` / `link` / `primary` for context with no action attached. Color is the only visual signal of severity, and color alone does not survive grayscale: put the meaning in the words.

There is no live-region role on the root. A notification that is already in the initial HTML is not announced; if the message must be heard, render it when the condition becomes true, or use a component that is a live region.
:::

## Props

<!-- Hand-authored; <DocsApi /> does not cover @paper/* yet. Keep in sync with the SFC. -->

`BuNotification` is a single component. There are no parts. The delete button is not optional.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `boolean` | `true` | Visibility. `false` unmounts the notification |
| `color` | `'primary' \| 'link' \| 'info' \| 'success' \| 'warning' \| 'danger'` | — | `is-{color}` |
| `light` | `boolean` | `false` | `is-light` |

## Accessibility

The delete button always carries `aria-label="delete"` and `type="button"`. Upstream's documentation markup ships that button unlabeled; labelling it is a declared a11y addition, not a fixture miss.

Dismiss is click only. There is no Escape handler and no focus move when the notification appears or leaves. After dismiss the node is gone, so a keyboard user who was on the delete button falls back to wherever the browser puts focus — usually the document body.

The root is a `div` with no live-region role. It will not announce itself. Pair copy that names the severity; do not rely on `color` to do that job.
