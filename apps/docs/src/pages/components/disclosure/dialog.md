---
title: Dialog - Modal dialog component for Vue 3
meta:
- name: description
  content: Build accessible modal dialogs using the native HTML dialog element. Includes focus trapping, backdrop overlay, escape key handling, and ARIA support.
- name: keywords
  content: dialog, modal, overlay, Vue 3, headless, accessibility, ARIA, focus trap
features:
  category: Component
  label: 'C: Dialog'
  github: /components/Dialog/
  renderless: false
  level: 2
related:
  - /components/disclosure/popover
  - /components/disclosure/expansion-panel
---

# Dialog

A headless modal dialog component using the native HTML dialog element.

<DocsPageFeatures :frontmatter />

<DocsBrowserSupport
  feature="Native Dialog"
  :versions="{ chrome: '37+', edge: '79+', firefox: '98+', safari: '15.4+', opera: '24+' }"
  anchor="native-dialog"
>
  Uses the native dialog element with showModal(). Safari 15.4+ is required; older versions have no support.
</DocsBrowserSupport>

## Usage

The Dialog component leverages the native `showModal()` API for proper modal behavior including focus trapping, backdrop rendering, and escape key handling. It provides v-model support for open/closed state management.

::: gn-example
/components/dialog/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Dialog } from '@vuetify/v0'
</script>

<template>
  <Dialog.Root>
    <Dialog.Activator />
    <Dialog.Content>
      <Dialog.Title />
      <Dialog.Description />
      <Dialog.Close />
    </Dialog.Content>
  </Dialog.Root>
</template>
```

## Recipes

### Click-Outside Dismissal

By default, clicking the backdrop closes the dialog. Set `closeOnClickOutside` to `false` on `Dialog.Content` to prevent this:

```vue
<template>
  <Dialog.Content :close-on-click-outside="false">
    <!-- Dialog won't close on backdrop click -->
  </Dialog.Content>
</template>
```

### Blocking Dialogs

The `blocking` prop disables scrim-based dismissal entirely — the dialog can only be closed programmatically. Use this for critical confirmations where the user must make an explicit choice:

```vue
<template>
  <Dialog.Content blocking>
    <!-- No scrim, no click-outside close — must use Dialog.Close or v-model -->
  </Dialog.Content>
</template>
```

## FAQ

### Known Limitations

#### Overlays inside a modal dialog (Snackbar, Tooltip, Popover)

The native `<dialog>` element with `showModal()` promotes itself to the browser's **top layer** — a rendering surface that sits above all normal document content. This has one important consequence: any overlay rendered _outside_ the dialog (e.g., a `Snackbar.Portal` teleported to `body`, or a `Tooltip` inside a portal) will appear **below** the dialog, not above it.

This is a browser-level constraint, not a v0 bug. The two ways to work around it are:

**Option 1 — Render the overlay inside the dialog element**

Place `Snackbar.Portal` (or any overlay) as a direct child of `Dialog.Content`. The content will render inside the native `<dialog>` element, which is already in the top layer:

```vue
<template>
  <Dialog.Root v-model="open">
    <Dialog.Content>
      <Dialog.Title>Settings</Dialog.Title>
      <!-- ... dialog body ... -->

      <!-- Snackbars that must appear inside this dialog -->
      <Snackbar.Portal :teleport="false">
        <Snackbar.Queue>
          <!-- render queue items here -->
        </Snackbar.Queue>
      </Snackbar.Portal>
    </Dialog.Content>
  </Dialog.Root>
</template>
```

`teleport="false"` renders the portal inline (no teleport to body), so it stays inside the `<dialog>` element and inherits the top-layer context.

**Option 2 — Use a custom teleport target inside the dialog**

If you need to keep your snackbar queue outside the dialog tree but still render inside the top layer when a dialog is open, anchor the queue to a `<div>` placed inside the dialog:

```vue
<template>
  <Dialog.Root v-model="open">
    <Dialog.Content>
      <!-- ... dialog body ... -->
      <div id="dialog-toast-anchor" style="position: fixed; inset-block-end: 1rem; inset-inline-end: 1rem;" />
    </Dialog.Content>
  </Dialog.Root>

  <!-- This portal re-targets to inside the dialog when it is open -->
  <Snackbar.Portal :teleport="open ? '#dialog-toast-anchor' : 'body'">
    <Snackbar.Queue><!-- ... --></Snackbar.Queue>
  </Snackbar.Portal>
</template>
```

<DocsApi />
