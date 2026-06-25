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

### Async Confirmation

The `AlertDialog.Action` component emits an `@action` event with an `AlertDialogActionEvent` payload. Call `e.wait()` at the top of your handler to hold the dialog open while the async work runs, then call `e.close()` once it completes. The `isPending` slot prop on `AlertDialog.Action` flips to `true` immediately after `wait()` is called, letting you swap button labels or show a spinner without managing a separate `shallowRef`.

This pattern keeps the dialog in a locked state during the operation — the user cannot dismiss it, and escape is already blocked by default. Use it for any action where the consequence of double-submission or premature dismissal is dangerous (permanent deletion, irreversible writes).

Compare with a plain Dialog approach, where you would manage loading state yourself and wire up a separate `shallowRef`. The `wait()`/`close()` contract removes that boilerplate and ensures the dialog stays open exactly as long as needed.

::: gn-example
/components/alert-dialog/async
:::

## Accessibility

AlertDialog uses `role="alertdialog"` instead of `role="dialog"`, signaling to assistive technologies that the dialog requires an immediate response.

### Keyboard interaction

| Key | Behavior |
|-----|----------|
| `Tab` | Moves focus between Cancel and Action buttons |
| `Escape` | Blocked by default (opt-in via `closeOnEscape` prop) |
| `Enter` / `Space` | Activates the focused button |

### Focus management

Focus moves to the Cancel button on open, as it represents the safest action. This follows the WAI-ARIA alertdialog pattern where destructive actions should not receive initial focus.

::: faq

??? How is AlertDialog different from Dialog?

AlertDialog uses `role="alertdialog"` for accessibility, defaults to blocking escape and click-outside dismissal, and provides the `Action` component with `wait()`/`close()` for async confirmation flows. Dialog uses `role="dialog"`, closes on escape and click-outside by default, and has a simple `Close` button.

??? When should I use AlertDialog vs Dialog?

Use AlertDialog when the user must make an explicit choice before proceeding (delete confirmation, destructive action, data loss warning). Use Dialog for informational content, forms, or settings where dismissal is safe.

??? Can I allow escape to close the AlertDialog?

Yes, pass `closeOnEscape` to Content: `<AlertDialog.Content closeOnEscape>`.

:::

<DocsApi />
