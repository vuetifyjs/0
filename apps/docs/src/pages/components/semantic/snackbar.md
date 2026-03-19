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

The Snackbar component is purely presentational — it renders whatever items you give it. Use `Snackbar.Queue` to connect to `useNotifications` for queue-driven stacks with auto-dismiss, or render `Snackbar.Root` directly for manual control.

::: example
/components/snackbar/basic
:::

## Anatomy

### Standalone

A single snackbar — render directly when you control the lifecycle yourself.

```vue Anatomy playground collapse
<script setup lang="ts">
  import { Snackbar } from '@vuetify/v0'
</script>

<template>
  <Snackbar.Portal>
    <Snackbar.Root>
      <Snackbar.Content />

      <Snackbar.Action />

      <Snackbar.Close />
    </Snackbar.Root>
  </Snackbar.Portal>
</template>
```

### Queue-driven

Connect to `useNotifications` via `Snackbar.Queue`. The queue provides items in order; `Snackbar.Root` provides dismiss context to `Snackbar.Close`.

```vue Anatomy playground collapse
<script setup lang="ts">
  import { Snackbar } from '@vuetify/v0'
</script>

<template>
  <Snackbar.Portal>
    <Snackbar.Queue v-slot="{ items }">
      <template v-for="item in items" :key="item.id">
        <Snackbar.Root :id="item.id">
          <Snackbar.Content />

          <Snackbar.Close />
        </Snackbar.Root>
      </template>
    </Snackbar.Queue>
  </Snackbar.Portal>
</template>
```

## Examples

### With useNotifications

`Snackbar.Queue` connects to `useNotifications` and exposes queue items via slot. `Snackbar.Close` auto-wires to the nearest `Snackbar.Root` — no `@click` needed:

```vue collapse no-filename
<script setup lang="ts">
  import { Snackbar, useNotifications } from '@vuetify/v0'

  const notifications = useNotifications()
</script>

<template>
  <Snackbar.Portal>
    <Snackbar.Queue v-slot="{ items }">
      <template v-for="item in items" :key="item.id">
        <Snackbar.Root :id="item.id">
          <Snackbar.Content>{{ item.subject }}</Snackbar.Content>

          <Snackbar.Close />
        </Snackbar.Root>
      </template>
    </Snackbar.Queue>
  </Snackbar.Portal>
</template>
```

> [!TIP] `Snackbar.Queue` requires `createNotificationsPlugin` to be installed. See [useNotifications](/composables/plugins/use-notifications) for setup.

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
      <Snackbar.Queue v-slot="{ items }">
        <template v-for="item in items" :key="item.id">
          <Snackbar.Root :id="item.id">
            <Snackbar.Content>{{ item.subject }}</Snackbar.Content>
            <Snackbar.Close />
          </Snackbar.Root>
        </template>
      </Snackbar.Queue>
    </Snackbar.Portal>
  </div>
</template>
```

## Accessibility

| Concern | Implementation |
|---------|---------------|
| Live region | Set `role` directly on `Snackbar.Root`. No `aria-live` on `Portal` to avoid nesting conflicts. |
| `role="status"` | Implicit `aria-live="polite"` — screen reader waits for idle. Use for confirmations and info. |
| `role="alert"` | Implicit `aria-live="assertive"` — screen reader interrupts. Use for errors and warnings. |
| Close button | `aria-label="Close"` hardcoded on `Snackbar.Close`. |
| Focus | No focus trap — snackbars are non-modal. |
| Keyboard | No keyboard interaction required — snackbars are informational. |

<DocsApi />
