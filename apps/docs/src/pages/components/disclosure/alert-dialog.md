---
title: AlertDialog - Confirmation dialog component for Vue 3
meta:
- name: description
  content: Build accessible confirmation dialogs with deferred close support. Features wait/close pattern for async actions, escape prevention, and ARIA alertdialog role.
- name: keywords
  content: alert dialog, confirmation, modal, Vue 3, headless, accessibility, ARIA, async confirm
features:
  category: Component
  label: 'C: AlertDialog'
  github: /components/AlertDialog/
  renderless: false
  level: 2
related:
  - /components/disclosure/dialog
  - /components/disclosure/popover
---

# AlertDialog

A headless confirmation dialog that seeks user input before proceeding. Features a `wait()`/`close()` pattern for deferred close during async operations.

<DocsPageFeatures :frontmatter />

## Usage

AlertDialog mirrors Dialog but with stricter defaults: no close on click outside, no close on escape. The Action component provides a deferred close pattern for async confirmation flows.

::: gn-example
/components/alert-dialog/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { AlertDialog } from '@vuetify/v0'
</script>

<template>
  <AlertDialog.Root>
    <AlertDialog.Activator />

    <AlertDialog.Content>
      <AlertDialog.Title />

      <AlertDialog.Description />

      <AlertDialog.Close />

      <AlertDialog.Cancel />

      <AlertDialog.Action />
    </AlertDialog.Content>
  </AlertDialog.Root>
</template>
```

## Examples

::: gn-example
/components/alert-dialog/useDeleteProject.ts 1
/components/alert-dialog/DeleteProjectDialog.vue 2
/components/alert-dialog/delete-project-dialog.vue 3

### Destructive delete confirmation

This flow wraps the full AlertDialog surface around an async operation. Every project row renders its own `AlertDialog.Root`: the Activator opens the modal, `AlertDialog.Action` drives the destructive confirm, and `AlertDialog.Cancel` dismisses it. The load-bearing API is the `@action` event — calling `e.wait()` at the top of the handler holds the dialog open while the mocked delete runs, and `e.close()` resolves it once the promise settles.

The Root slot exposes `isPending`, which flips to `true` the moment `wait()` is called. Binding it to `:disabled` on both the Action and Cancel buttons locks the dialog for the duration of the request, so a slow network can't be double-submitted and a half-finished delete can't be dismissed. Because AlertDialog already blocks Escape and click-outside by default, `isPending` is the only extra state you need — no separate loading ref, no manual open/close bookkeeping. Styling hooks off the emitted `data-disabled` attribute rather than a JS class binding.

Reach for this pattern whenever an accidental confirm is expensive or irreversible — permanent deletes, billing changes, irreversible writes. For non-destructive flows where dismissal is harmless (settings, informational content), a plain [Dialog](/components/disclosure/dialog) is the lighter choice; [Popover](/components/disclosure/popover) covers non-modal disclosure.

| File | Role |
|------|------|
| `useDeleteProject.ts` | Owns the project list and the mocked async delete that drops a project after a short delay |
| `DeleteProjectDialog.vue` | Reusable confirmation dialog — wires `@action` to `wait()`/`close()` and disables its buttons while `isPending` |
| `delete-project-dialog.vue` | Entry — renders the project list and mounts a dialog per row |
:::

## Accessibility

AlertDialog uses `role="alertdialog"` instead of `role="dialog"`, signaling to assistive technologies that the dialog requires an immediate response.

### Keyboard interaction

| Key | Behavior |
|-----|----------|
| `Tab` | Cycles focus through focusable controls inside Content (trapped by `showModal()`) |
| `Escape` | Blocked by default (opt-in via `closeOnEscape` prop) |
| `Enter` / `Space` | Activates the focused button |

### Focus management

Focus is handled by the native dialog: `showModal()` moves focus to the **first focusable** control inside Content. AlertDialog does not retarget focus to Cancel on its own.

For the WAI-ARIA alertdialog pattern — safe action first, destructive confirm not initially focused — put Cancel (or another non-destructive control) **first among focusables** in DOM order. The shipped examples do this. If something focusable must appear before Cancel, put `autofocus` on Cancel (or call `.focus()` yourself after open).

## FAQ

::: faq

??? How is AlertDialog different from Dialog?

AlertDialog uses `role="alertdialog"` for accessibility, defaults to blocking escape and click-outside dismissal, and provides the `Action` component with `wait()`/`close()` for async confirmation flows. Dialog uses `role="dialog"`, closes on escape and click-outside by default, and has a simple `Close` button.

??? When should I use AlertDialog vs Dialog?

Use AlertDialog when the user must make an explicit choice before proceeding (delete confirmation, destructive action, data loss warning). Use Dialog for informational content, forms, or settings where dismissal is safe.

??? Can I allow escape to close the AlertDialog?

Yes, pass `closeOnEscape` to Content: `<AlertDialog.Content closeOnEscape>`.

:::

<DocsApi />
