---
title: BDialog - Bootstrap 6 Dialog for Vue
meta:
- name: description
  content: Bootstrap 6's native dialog markup with Vuetify0 behavior — showModal, backdrop dismissal, Escape, and focus return, styled by your own Bootstrap CSS.
- name: keywords
  content: bootstrap 6 dialog, vue dialog, modal, showModal, focus trap, bootstrap vue, paper bootstrap
features:
  category: Component
  label: 'C: BDialog'
  level: 2
  renderless: false
  group: overlay
related:
  - /systems/bootstrap
  - /systems/bootstrap/drawer
  - /systems/bootstrap/menu
  - /systems/bootstrap/toast
  - /systems/bootstrap/tooltip
  - /components/disclosure/dialog
---

# BDialog

Bootstrap's `<dialog class="dialog">` with the open state, backdrop click, and Escape key the stylesheet does not ship.

<DocsPageFeatures :frontmatter />

<DocsBootstrapReference
  href="https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/components/dialog/"
  title="Dialog"
/>

## Usage

`v-model` owns the open state. Compose the header, body, and footer the way the Bootstrap markup nests them. `BDialogClose` is the `.btn-close` inside the header.

::: ds-example
/systems/bootstrap/dialog/basic
:::

### The markup Bootstrap documents

The HTML tab is the dialog from the v6 docs, without `data-bs-toggle` or `data-bs-dismiss`. Those attributes are the bundle's behavior. This package does not emit them. The Vue tab is the component that renders the same tree.

::: code-group no-filename

```html Bootstrap collapse
<dialog class="dialog">
  <div class="dialog-header">
    <h1 class="dialog-title">Dialog title</h1>
    <button type="button" class="btn-close" aria-label="Close"></button>
  </div>
  <div class="dialog-body">
    <p>This is a native dialog element.</p>
  </div>
  <div class="dialog-footer">
    <button type="button" class="btn-solid theme-secondary">Close</button>
    <button type="button" class="btn-solid theme-primary">Save changes</button>
  </div>
</dialog>
```

```vue Vue collapse
<template>
  <BDialog v-model="open">
    <BDialog.Header>
      <BDialog.Title>Dialog title</BDialog.Title>
      <BDialog.Close />
    </BDialog.Header>

    <BDialog.Body>
      <p>This is a native dialog element.</p>
    </BDialog.Body>

    <BDialog.Footer>
      <button type="button" class="btn-solid theme-secondary">Close</button>
      <button type="button" class="btn-solid theme-primary">Save changes</button>
    </BDialog.Footer>
  </BDialog>
</template>
```

:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BDialog } from '@paper/bootstrap'
</script>

<template>
  <BDialog>
    <BDialog.Header>
      <BDialog.Title />

      <BDialog.Close />
    </BDialog.Header>

    <BDialog.Body />

    <BDialog.Footer />
  </BDialog>
</template>
```

## Composed on v0

Wraps v0's [Dialog](/components/disclosure/dialog). `Dialog.Root` owns `v-model`. `Dialog.Content` is renderless so the host can stay a `<dialog class="dialog">` — the fixture demands that element, and the browser's `showModal()` is what traps focus and paints `::backdrop`.

`Scrim` stays off. A global scrim behind a dialog that already paints `::backdrop` would double the backdrop. `closeOnClickOutside` stays off too: `Dialog.Content` is renderless, so it has no element to hit-test. A backdrop click is a click on the `<dialog>` itself. `blocking` ignores that click and adds `.dialog-static` for the bounce. Escape still closes unless `keyboard` is false, which bounces and stays open. `modal` false calls `show()` instead of `showModal()`, adds `.dialog-nonmodal`, and does not lock page scroll.

Size modifiers are `dialog-sm`, `dialog-lg`, and `dialog-xl`. Anything else Bootstrap puts on the dialog — `dialog-scrollable`, `dialog-fullscreen`, `dialog-instant` — is a class you pass through.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `boolean` | `false` | Open state. Drives `showModal()` and `close()`. |
| `blocking` | `boolean` | `false` | Backdrop click does not close. Adds `.dialog-static` for the bounce. |
| `keyboard` | `boolean` | `true` | Escape closes. `false` bounces a modal dialog and leaves it open. A non-modal dialog ignores Escape. |
| `modal` | `boolean` | `true` | `false` calls `show()`, adds `.dialog-nonmodal`, and does not lock scroll. There is no backdrop. |
| `size` | `'sm' \| 'lg' \| 'xl'` | — | `dialog-sm`, `dialog-lg`, or `dialog-xl`. |

| Part | Renders | Notes |
|------|---------|-------|
| `BDialogHeader` | `div.dialog-header` | Title and close button |
| `BDialogTitle` | `h1.dialog-title` | Supplies `aria-labelledby` |
| `BDialogClose` | `button.btn-close` | Closes the dialog |
| `BDialogBody` | `div.dialog-body` | |
| `BDialogFooter` | `div.dialog-footer` | Actions |

## Accessibility

The dialog element carries `role="dialog"` and `aria-modal` while it is modal. `modal` false drops `aria-modal`. `BDialogTitle` is the accessible name. Opening calls `showModal()`, so the browser traps focus and returns it to the trigger on close. Escape closes, including when `blocking` is set, unless `keyboard` is false.

> [!IMPORTANT]
> Compose `BDialogTitle`. Without it the dialog has no accessible name.
