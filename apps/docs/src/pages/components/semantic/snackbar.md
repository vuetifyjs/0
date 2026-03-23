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

A headless compound component for rendering toast and snackbar notifications.

<DocsPageFeatures :frontmatter />

## Usage

A single snackbar — render directly when you control the lifecycle yourself.

::: example
/components/snackbar/basic
:::

## Anatomy

```vue Anatomy playground collapse
<script setup lang="ts">
  import { Snackbar } from '@vuetify/v0'
</script>

<template>
  <!-- Standalone -->
  <Snackbar.Portal>
    <Snackbar.Root>
      <Snackbar.Content />

      <Snackbar.Action />

      <Snackbar.Close />
    </Snackbar.Root>
  </Snackbar.Portal>

  <!-- Queue-driven -->
  <Snackbar.Portal>
    <Snackbar.Queue v-slot="{ items }">
      <Snackbar.Root v-for="item in items" :key="item.id" :id="item.id">
        <Snackbar.Content />

        <Snackbar.Action />

        <Snackbar.Close />
      </Snackbar.Root>
    </Snackbar.Queue>
  </Snackbar.Portal>
</template>
```

## Examples

### Notification queue

`Snackbar.Queue` connects to `useNotifications` and exposes queue items newest-first. `Snackbar.Close` auto-wires dismiss to the nearest `Snackbar.Root` — no `@click` needed.

> [!WARNING] Inside a `Snackbar.Queue`, clicking `Snackbar.Close` permanently removes the notification from both the queue and the registry. To remove from the toast surface while keeping the notification in the inbox, call `ticket.dismiss()` directly on the `NotificationTicket`.

::: example
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
