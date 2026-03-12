---
title: Snackbar - Toast and Snackbar Notifications
meta:
- name: description
  content: Headless compound component for rendering toast and snackbar notifications with severity-driven ARIA roles, useStack z-index coordination, and teleport support.
- name: keywords
  content: snackbar, toast, notification, alert, status, headless, compound component
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

The Snackbar component is purely presentational — it renders whatever items you give it. Bring your own queue (`createQueue`, `useNotifications`, or manual state) and map items to `Snackbar.Root`. Severity drives the ARIA role; positioning and styling are handled with utility classes.

::: example
/components/snackbar/basic
:::

## Anatomy

```vue Anatomy playground collapse
<script setup lang="ts">
  import { Snackbar } from '@vuetify/v0'
</script>

<template>
  <Snackbar.Portal>
    <Snackbar.Root severity="info">
      <Snackbar.Content />

      <Snackbar.Action />

      <Snackbar.Close />
    </Snackbar.Root>
  </Snackbar.Portal>
</template>
```

## Examples

### With useNotifications

Filter notifications by type to drive the snackbar stack from a shared notification center:

```vue collapse no-filename
<script setup lang="ts">
  import { toRef } from 'vue'
  import { Snackbar, useNotifications } from '@vuetify/v0'

  const notifications = useNotifications()
  const toasts = toRef(() =>
    notifications.proxy.values.filter(t => t.data?.type === 'toast'),
  )
</script>

<template>
  <Snackbar.Portal>
    <Snackbar.Root
      v-for="ticket in toasts"
      :key="ticket.id"
      :severity="ticket.severity"
    >
      <Snackbar.Content>{{ ticket.subject }}</Snackbar.Content>

      <Snackbar.Action v-if="ticket.data?.undo" @click="ticket.data.undo()">
        Undo
      </Snackbar.Action>

      <Snackbar.Close @click="ticket.dismiss()" />
    </Snackbar.Root>
  </Snackbar.Portal>
</template>
```

> [!TIP] `useNotifications` requires the `createNotificationsPlugin` to be installed. See [useNotifications](/composables/plugins/use-notifications) for setup.

### Inline rendering

Pass `:teleport="false"` to render the portal inline instead of teleporting to `<body>`. Useful in docs, Storybook, or scoped container layouts:

```vue collapse no-filename
<template>
  <div class="relative h-48">
    <Snackbar.Portal :teleport="false" class="absolute bottom-4 right-4">
      <Snackbar.Root v-for="item in items" :key="item.id">
        <Snackbar.Content>{{ item.subject }}</Snackbar.Content>
        <Snackbar.Close @click="item.dismiss()" />
      </Snackbar.Root>
    </Snackbar.Portal>
  </div>
</template>
```

## Accessibility

| Concern | Implementation |
|---------|---------------|
| Live region | Each `Snackbar.Root` sets its own `role`. No `aria-live` on `Portal` to avoid nesting conflicts. |
| `info` / `success` | `role="status"` — implicit `aria-live="polite"`. Screen reader waits for idle. |
| `error` / `warning` | `role="alert"` — implicit `aria-live="assertive"`. Screen reader interrupts. |
| Close button | `aria-label="Close"` default on `Snackbar.Close`. Override via prop. |
| Focus | No focus trap — snackbars are non-modal. |
| Keyboard | No keyboard interaction required — snackbars are informational. |

<DocsApi />
