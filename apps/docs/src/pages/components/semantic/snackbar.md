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

::: gn-example
/components/snackbar/useToasts.ts 1
/components/snackbar/ToastHost.vue 2
/components/snackbar/toast-host.vue 3

### Toast notifications with undo

`Snackbar.Queue` connects to `useNotifications` by namespace and exposes its items newest-first through the default slot. A single `ToastHost` is mounted once near the root; anywhere else in the app, `useToasts().notify()` or `remove()` pushes a notification and the host renders it. Each toast auto-dismisses on the `timeout` passed to `send`, the stack pauses while hovered or focused (WCAG 2.2.1) for free, and `Snackbar.Close` dismisses without any `@click` wiring.

The undo affordance rides along on the notification's `data` payload: `remove()` deletes a file, then sends a toast carrying `data.undo` — a closure that splices the file back at its original index. The host reads that closure off the ticket and renders an Undo button beside Close. Undo restores the file and calls `ticket.dismiss()`, which removes the toast from the display queue only, whereas `Snackbar.Close` inside a queue permanently unregisters the notification from both the queue and the registry. Reach for `dismiss()` when the item should survive in an inbox.

Reach for the queue whenever notifications flow through [useNotifications](/composables/plugins/use-notifications); for a transient one-off message you control directly, render a `Snackbar.Root` without a queue (see Usage). The display surface is layout-agnostic — the stacking here is a plain flex column of consumer-styled cards, built on the [createQueue](/composables/registration/create-queue) primitive underneath.

| File | Role |
|------|------|
| `useToasts.ts` | Owns the notifications instance and the deletable file list; exposes notify, remove, and the undo restore closure |
| `ToastHost.vue` | Renders the Snackbar.Queue surface — a stacked column of severity-styled toasts, each with a Close and a conditional Undo button |
| `toast-host.vue` | Demo entry — action buttons and a file list wired to the composable, plus the mounted ToastHost |
:::

::: gn-example
/components/snackbar/in-dialog

### Snackbar inside a Dialog

Click **Open Settings** to open the modal dialog, then **Save** to trigger the snackbar. The snackbar mounts directly inside the dialog's top-layer subtree via the default `teleport="top-layer"` — no extra configuration required.

A native `<dialog>` with `showModal()` is promoted to the browser **top layer**, which paints it above all content and makes everything outside its subtree inert. A snackbar teleported to `body` would render beneath the dialog and be unclickable. `Snackbar.Portal` avoids this by resolving its target to `useStack().topElement` — the topmost open modal's `<dialog>` element — so the snackbar shares the dialog's top-layer context and stays interactive.

When the dialog closes, the portal reparents back to `body` automatically; timers and queue state are preserved because Vue's Teleport moves the same live DOM nodes rather than re-mounting. To always target `body`, pass `teleport="body"`; for inline rendering inside a scoped container, see [Inline rendering](#inline-rendering).
:::

## Recipes

### Teleport target

`Snackbar.Portal` defaults to `teleport="top-layer"` so snackbars work automatically when a modal dialog is open. Pass an explicit value to override:

```vue collapse no-filename
<template>
  <!-- Default: mounts inside the topmost open modal, falls back to body -->
  <Snackbar.Portal><!-- ... --></Snackbar.Portal>

  <!-- Always teleport to body, even inside a modal -->
  <Snackbar.Portal teleport="body"><!-- ... --></Snackbar.Portal>

  <!-- Render inline — no teleport (useful in scoped containers, Storybook) -->
  <Snackbar.Portal :teleport="false"><!-- ... --></Snackbar.Portal>
</template>
```

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
| Close button | `Snackbar.Close` renders an inline default `aria-label` of `"Dismiss"`, localizable via the `Snackbar.close` key. |
| Timing | Auto-dismiss pauses on hover and focus (WCAG 2.2.1). Tabbing into a snackbar pauses the queue; focus leaving the container resumes it. |
| Focus | No focus trap — snackbars are non-modal. |

<DocsApi />
