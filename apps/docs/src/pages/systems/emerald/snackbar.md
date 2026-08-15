---
title: EmSnackbar - Emerald Snackbar for Vue
meta:
- name: description
  content: Emerald's toast surface — five severity variants over Vuetify0's headless Snackbar compound, with a notification queue that auto-dismisses, pauses on hover, and announces to screen readers.
- name: keywords
  content: emerald snackbar, vue snackbar, vue toast, notification queue vue, vuetify0 snackbar, paper emerald
features:
  category: Component
  label: 'C: EmSnackbar'
  level: 2
  renderless: false
  order: 22
related:
  - /systems/emerald
  - /components/semantic/snackbar
  - /composables/plugins/use-notifications
---

# EmSnackbar

<DocsPageFeatures :frontmatter />

Emerald's toast — a tinted, bordered card in five severity variants, over v0's headless Snackbar compound and its notification queue.

## Usage

The compound has five parts. `EmSnackbarPortal` is the fixed region toasts stack in — bottom-right, newest on top. `EmSnackbarQueue` connects that region to a [useNotifications](/composables/plugins/use-notifications) instance and hands you its tickets through `v-slot="{ items }"`. `EmSnackbar` is one toast; `EmSnackbarContent` is its message and `EmSnackbarClose` its dismiss button.

The queue is optional. A static `EmSnackbar` under a `v-if` is a complete snackbar — show it when something happens, listen for `dismiss` to hide it. Reach for the queue when toasts arrive faster than they leave: it orders them, auto-dismisses them, and pauses the clock while the reader is hovering or focused.

::: ds-example
/systems/emerald/snackbar/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import {
    EmSnackbar,
    EmSnackbarClose,
    EmSnackbarContent,
    EmSnackbarPortal,
    EmSnackbarQueue,
  } from '@paper/emerald'
</script>

<template>
  <EmSnackbarPortal>
    <EmSnackbarQueue>
      <EmSnackbar>
        <EmSnackbarContent />

        <EmSnackbarClose />
      </EmSnackbar>
    </EmSnackbarQueue>
  </EmSnackbarPortal>
</template>
```

## Composed on v0

Each part is a thin skin over the matching part of v0's [Snackbar](/components/semantic/snackbar) compound — `Snackbar.Portal`, `Snackbar.Queue`, `Snackbar.Root`, `Snackbar.Content`, `Snackbar.Close`. Emerald adds no behavior of its own.

The split is clean. v0 owns everything that moves: the portal's teleport and z-index coordination through the stack, the queue's connection to `useNotifications` with its FIFO auto-dismiss and its hover/focus pause, the dismiss context that wires a Close button to its Root, and the live-region plumbing that makes a freshly mounted toast actually get announced. Emerald owns everything you see: the card — border, radius, shadow, status-token tint keyed off the `data-variant` attribute the root writes — the fixed bottom-right region capped at `min(360px, 100vw - 32px)`, and the close button's hit area and default glyph.

Two consequences of the split are worth knowing. Dismissal is context-driven: inside a queue, `EmSnackbarClose` removes the ticket from the notifications instance; outside one, the underlying `Snackbar.Root` emits `dismiss` instead, which is why the basic example above hides its toast with `@dismiss` on `EmSnackbar`. And because every Emerald part renders exactly one v0 component at its root, props the wrapper does not re-declare still reach the v0 part through Vue's fallthrough — `namespace` on the portal, or `urgent` on the root — though only the declared surface below is Emerald's contract.

## Examples

::: ds-example
/systems/emerald/snackbar/variants

### Variants

`variant` maps the toast onto Emerald's status palette: a tinted background and a matching accent border for `success`, `error`, `info` and `warning`, and a grey pairing for `neutral`, the default. The prop is purely visual — it sets the `data-variant` attribute the stylesheet keys off and changes nothing about behavior or announcement.

Match the variant to what the message means, not to how much attention you want. `success` confirms an action completed; `error` reports one that failed; `info` and `warning` carry status the reader did not ask for; `neutral` is for the rest — undoable actions, ambient notices, anything without a severity. These are the same status tokens [EmAlert](/systems/emerald/alert) uses, so a toast and an inline alert about the same event read as the same color.

When toasts come from a notification queue, the ticket's `severity` is the natural source for this prop — the queue example below maps one onto the other.
:::

::: ds-example
/systems/emerald/snackbar/queue

### Queue-driven toasts

This is the arrangement the compound is designed around. A `useNotifications` instance owns the tickets; `notifications.send()` pushes one; `EmSnackbarQueue` exposes the queue's current tickets through its slot, newest first, and each renders as an `EmSnackbar` keyed by ticket id. Passing `:id="item.id"` is what ties the toast to its ticket — without it the root generates its own id, and Close would ask the queue to dismiss a ticket that does not exist.

Auto-dismiss is FIFO with a per-instance default timeout (3000 ms unless you raise it) and a per-ticket `timeout` override on `send`. The visual order being newest-first while dismissal is oldest-first is deliberate — fresh messages surface on top while the stack drains from the bottom.

The queue pauses while the reader is engaged with it: hovering any part of the stack or moving focus into it stops the clock, and it resumes only when both hover and focus have left. That is what makes an auto-dismissing toast defensible under WCAG's timing rules — the reader mousing toward a Close button never races the timeout.

In an app you would install `createNotificationsPlugin()` once and call `useNotifications()` anywhere; the example provides its own instance locally because the docs sandbox installs no notifications plugin. Without either, the queue renders nothing — `useNotifications` falls back to an inert stub, so `send` is a no-op.
:::

## Props

Defaults marked *v0* are inherited from the wrapped v0 part — Emerald passes the prop through without re-declaring the default.

### EmSnackbar

<!-- Hand-authored ahead of DocsApi extraction for @paper/emerald -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'success' \| 'error' \| 'info' \| 'warning' \| 'neutral'` | `'neutral'` | Status tint and accent border |
| `id` | `ID` | auto-generated (*v0*) | Ticket identity. Pass the notification's id inside a queue so Close dismisses the right ticket |
| `namespace` | `string` | `'v0:notifications'` (*v0*) | Which notifications instance to bind to |

Outside a queue, the underlying root emits `dismiss` with the snackbar's id when its Close button is pressed — listen for it on `EmSnackbar` to hide a static toast. Inside a queue the dismissal goes to the queue instead and no event fires.

### Parts

<!-- Hand-authored ahead of DocsApi extraction for @paper/emerald -->

| Part | Props | Notes |
|------|-------|-------|
| `EmSnackbarPortal` | `teleport` (`'top-layer' \| string \| false`, default `'top-layer'` (*v0*)) | The fixed bottom-right region. `'top-layer'` mounts into the topmost open modal, falling back to `body`; `false` renders inline |
| `EmSnackbarQueue` | `namespace` (`string`, default `'v0:notifications'` (*v0*)) | Exposes queue tickets via `v-slot="{ items }"`, newest first. Pauses auto-dismiss on hover and focus |
| `EmSnackbarContent` | — | The message body. Flexes to fill the row |
| `EmSnackbarClose` | `namespace` (`string`, default `'v0:notifications'` (*v0*)) | Dismiss button. Default slot replaces the built-in close glyph |

`EmSnackbarContent` and `EmSnackbarPortal` take no `namespace` of their own — Content needs no context, and the portal coordinates on the v0 default unless you pass one through.

## Accessibility

The behavior below belongs to the wrapped v0 parts; Emerald only styles it.

### Announcements

A snackbar appears without the reader asking for it, so the compound does the announcing. Each root renders `role="status"` — a polite live region that does not interrupt. Because screen readers are unreliable about announcing live regions injected after page load, `EmSnackbarPortal` also renders a persistent, visually hidden announcer pair from mount, and every snackbar that appears under it mirrors its text there — which is what makes the *first* toast reliably heard. The announcer clears before it fills, so sending the same message twice announces twice.

Emerald does not expose the underlying `urgent` prop; toasts announce politely. Passing `urgent` through to the root switches it to `role="alert"` and routes the mirror to the assertive region, but reserve that for messages that justify interrupting.

### Timing

`EmSnackbarQueue` pauses auto-dismiss on `mouseenter` and `focusin` and resumes only when both hover and focus have left the stack — moving focus between a toast's Close button and its neighbor does not restart the clock, and dismissing one toast while still hovering keeps the rest paused. This is the WCAG 2.2.1 (Timing Adjustable) accommodation: content that removes itself on a timer must give the reader a way to hold it.

Static snackbars outside a queue have no timer, and nothing in the compound handles Escape — a snackbar is not a dialog and owns no dismissal keys.

### The close button

`EmSnackbarClose` renders a native `<button type="button">`, so Enter and Space activation, focusability and the implicit role all come from the platform. Its accessible name is the locale string `Snackbar.close`, falling back to "Dismiss"; the default glyph inside is `aria-hidden` and contributes nothing, so replacing it through the slot does not change the name. Keyboard focus gets Emerald's standard focus ring via `:focus-visible`.

The close button is the compound's only interactive element. Everything else — message text, the tinted card — is static content a screen reader encounters through the announcement, not the tab order.
