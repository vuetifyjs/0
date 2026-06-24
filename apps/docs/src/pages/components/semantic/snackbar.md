---
title: Snackbar - Toast and Snackbar Notifications
meta:
- name: description
  content: Headless compound component for rendering toast and snackbar notifications. Snackbar.Queue connects to useNotifications for queue-driven toast stacks.
- name: keywords
  content: snackbar, toast, notification, alert, status, headless, compound component, queue
features:
  category: Component
  label: 'C: Snackbar'
  github: /components/Snackbar/
  renderless: false
  level: 2
related:
  - /composables/plugins/use-notifications
  - /composables/registration/create-queue
---

# Snackbar

Headless compound component for toast and snackbar notifications. Pairs with `useNotifications` for queue-driven stacks with auto-dismiss and pause on hover.

<DocsPageFeatures :frontmatter />

## Usage

A single snackbar — render directly when you control the lifecycle yourself.

::: gn-example
/components/snackbar/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Snackbar } from '@vuetify/v0'
</script>

<template>
  <Snackbar.Portal>
    <Snackbar.Queue>
      <Snackbar.Root>
        <Snackbar.Content />
        <Snackbar.Close />
      </Snackbar.Root>
    </Snackbar.Queue>
  </Snackbar.Portal>
</template>
```

## Examples

### Notification queue

`Snackbar.Queue` connects to `useNotifications` and exposes queue items newest-first via its default slot `{ items }`. Each item carries the full notification ticket — `id`, `severity`, `subject`, and a `dismiss()` method — so you can apply severity-specific classes or drive any custom layout without coupling to the queue internals.

`Snackbar.Close` auto-wires dismiss to the nearest `Snackbar.Root` — no `@click` needed. Pass `:id="item.id"` to `Snackbar.Root` inside a queue loop so each root tracks its own ticket; the queue slot surfaces items newest-first, making index 0 the most recent.

The example below builds a stacked toast surface: toasts fan out on hover and collapse back to a peek when the pointer leaves. The stacking geometry — translate, scale, opacity per depth — is pure consumer CSS applied via `itemStyle(i)`; `Snackbar.Queue` itself is layout-agnostic. Auto-dismiss pauses while any item is hovered or focused (WCAG 2.2.1), which you get for free from `useNotifications`.

Reach for `Snackbar.Queue` when your app routes notifications through `useNotifications`. For transient one-off messages where you control visibility directly, use `Snackbar.Root` without a queue (see Usage above).

> [!WARNING] Inside a `Snackbar.Queue`, clicking `Snackbar.Close` permanently removes the notification from both the queue and the registry. To remove from the toast surface while keeping the notification in the inbox, call `ticket.dismiss()` directly on the [NotificationTicket](/composables/plugins/use-notifications#notificationticket).

::: gn-example
/components/snackbar/queue
:::

## Recipes

### ARIA role

Set `role` directly on `Snackbar.Root` to control how screen readers announce the notification:

```vue collapse no-filename
<template>
  <!-- Polite — waits for user to be idle -->
  <Snackbar.Root role="status">
    <Snackbar.Content>Changes saved</Snackbar.Content>
    <Snackbar.Close />
  </Snackbar.Root>

  <!-- Assertive — interrupts immediately -->
  <Snackbar.Root role="alert">
    <Snackbar.Content>Build failed — check logs</Snackbar.Content>
    <Snackbar.Close />
  </Snackbar.Root>
</template>
```

### Inline rendering

Pass `:teleport="false"` to render the portal inline instead of teleporting to `<body>`. Useful in docs, Storybook, or scoped container layouts:

```vue collapse no-filename
<template>
  <div class="relative h-48">
    <Snackbar.Portal :teleport="false" class="absolute bottom-4 right-4">
      <Snackbar.Root>
        <Snackbar.Content>Changes saved</Snackbar.Content>
        <Snackbar.Close />
      </Snackbar.Root>
    </Snackbar.Portal>
  </div>
</template>
```

## Accessibility

| Concern | Implementation |
|---------|---------------|
| Live region | `Snackbar.Root` defaults to `role="status"`. Override with `role="alert"` for urgent notifications. No `aria-live` on `Portal` to avoid nesting conflicts. |
| `role="status"` | Implicit `aria-live="polite"` — screen reader waits for idle. Use for confirmations and info. |
| `role="alert"` | Implicit `aria-live="assertive"` — screen reader interrupts. Use for errors and warnings. |
| Close button | `aria-label="Close"` hardcoded on `Snackbar.Close`. |
| Timing | Auto-dismiss pauses on hover and focus (WCAG 2.2.1). Tabbing into a snackbar pauses the queue; focus leaving the container resumes it. |
| Focus | No focus trap — snackbars are non-modal. |

<DocsApi />
