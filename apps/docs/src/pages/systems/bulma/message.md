---
title: BuMessage - Bulma Message for Vue
meta:
- name: description
  content: Bulma's message in Vue — header and body as parts, v-model dismiss from the header's delete button, and a headerless variant that is simply a message with no header.
- name: keywords
  content: bulma message, vue message, message-header, message-body, bulma vue, paper bulma
features:
  category: Component
  label: 'C: BuMessage'
  level: 2
  renderless: false
  order: 6
related:
  - /systems/bulma
  - /systems/bulma/notification
  - /components/primitives/presence
---

# BuMessage

<DocsPageFeatures :frontmatter />

Bulma's `.message` with a dismissible header and a headerless body-only variant.

> [!NOTE]
> Reference: [Message on bulma.io](https://bulma.io/documentation/components/message/) — classes and visual variants. This page is the JavaScript.

## Usage

`BuMessage` is `article.message` and owns visibility through `v-model`, default `true`. Compose `BuMessageHeader` and `BuMessageBody` inside it. The header always renders the `.delete` button; omitting the header is the documented body-only variant, and that variant is not dismissible because there is no button to click.

::: ds-example
/systems/bulma/message/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BuMessage, BuMessageBody, BuMessageHeader } from '@paper/bulma'
</script>

<template>
  <BuMessage>
    <BuMessageHeader />

    <BuMessageBody />
  </BuMessage>
</template>
```

## Composed on v0

`BuMessage` wraps v0's [Presence](/components/primitives/presence) the same way `BuNotification` does: `v-model` drives present/leaving/unmounted, `data-state` lands on `article.message`, and a dismiss unmounts the article on the next tick.

The rest is package context, not a v0 compound. `BuMessage` provides `bulma:message` with a `close()` that writes `false` through the model. `BuMessageHeader` is the only consumer — it renders the documented `.delete` and calls `close()` on click. `BuMessageBody` injects nothing; it is a `div.message-body`.

Injection is optional. A header rendered outside `BuMessage` still emits the Bulma markup, warns once in dev, and the delete button is inert. Parts backed by a v0 context throw instead; this family does not, because the header's only job is a classed div and a button.

Presence does not supply a header, a body, or a close control. Those are Bulma's regions, expressed as parts, which is why a message with no `BuMessageHeader` is still a valid message — it is the body-only fixture, not a half-composed one.

## The markup you know

The Bulma tab is the markup [published on bulma.io](https://bulma.io/documentation/components/message/), captured verbatim in the conformance fixture. The Vue tab is the component that renders it. The conformance suite diffs the two on every test run — `type="button"` on the delete control is the tolerated difference.

::: code-group no-filename

```html Bulma
<article class="message">
  <div class="message-header">
    <p>Hello World</p>
    <button class="delete" aria-label="delete"></button>
  </div>
  <div class="message-body">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    <strong>Pellentesque risus mi</strong>, tempus quis placerat ut, porta nec
    nulla. Vestibulum rhoncus ac ex sit amet fringilla. Nullam gravida purus
    diam, et dictum <a>felis venenatis</a> efficitur.
  </div>
</article>
```

```vue Vue
<template>
  <BuMessage>
    <BuMessageHeader>
      <p>Hello World</p>
    </BuMessageHeader>

    <BuMessageBody>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      <strong>Pellentesque risus mi</strong>, tempus quis placerat ut, porta nec
      nulla. Vestibulum rhoncus ac ex sit amet fringilla. Nullam gravida purus
      diam, et dictum <a>felis venenatis</a> efficitur.
    </BuMessageBody>
  </BuMessage>
</template>
```

:::

You write no `.delete` and no close handler. Composing `BuMessageHeader` is what opts the message into being dismissible; the part owns the button.

## Examples

::: ds-example
/systems/bulma/message/body-only

### Body only

Omit `BuMessageHeader` and the article is Bulma's documented no-header variant: a body, no delete, no dismiss. The model still exists — you can hide the message from outside — but there is no control inside it to write `false`.

Reach for it when the message is standing copy rather than a dismissible notice: an explanatory block in a form, a quoted snippet, a permanent warning that should not have an X. The headered variant is the one for a notice the reader is allowed to put away.

`color` and `size` still apply. They are classes on `article.message`, and they do not depend on a header being present.
:::

## Props

<!-- Hand-authored; <DocsApi /> does not cover @paper/* yet. Keep in sync with the SFC. -->

`BuMessage` renders `article.message` and owns visibility. The regions are parts.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `boolean` | `true` | Visibility. `false` unmounts the message |
| `color` | `'primary' \| 'link' \| 'info' \| 'success' \| 'warning' \| 'danger'` | — | `is-{color}` |
| `size` | `'small' \| 'normal' \| 'medium' \| 'large'` | — | `is-{size}` |

| Part | Renders | Notes |
|------|---------|-------|
| `BuMessageHeader` | `div.message-header` | Always renders `.delete`, wired through `bulma:message` |
| `BuMessageBody` | `div.message-body` | Pure markup; the headerless variant is a message with no header |

The header's default slot is the title. Bulma wraps its own in a `<p>`; the part does not wrap for you.

## Accessibility

`BuMessageHeader`'s delete button carries `aria-label="delete"` and `type="button"`, matching the fixture. Dismiss is that click. There is no Escape handler, and nothing moves focus when the message appears or leaves.

> [!NOTE]
> A `BuMessageHeader` rendered outside `BuMessage` still emits the header markup. In development it warns once that `bulma:message` was missing; the delete button then does nothing. Nest the part, or you get a button that looks like a close control and isn't one.

The root is an `article` with no live-region role. It will not announce itself. Put the severity in the header text; `color` is decoration.
