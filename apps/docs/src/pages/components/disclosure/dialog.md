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

::: faq

??? Why do my Snackbar, Tooltip, or Popover overlays render below a modal dialog?

The native `<dialog>` element with `showModal()` promotes itself to the browser's **top layer** — a rendering surface that sits above all normal document content regardless of `z-index`, and makes everything outside its subtree inert. Any overlay rendered _outside_ the dialog (e.g. a `Snackbar.Portal` teleported to `body`, or a `Tooltip` inside a portal) appears **below** the dialog, not above it. This is a browser-level constraint, not a v0 bug — but `Snackbar.Portal` handles it for you by default (see below).

??? How do I show a Snackbar (or other overlay) inside an open modal dialog?

`Snackbar.Portal` handles this automatically: it defaults to `teleport="top-layer"`, which teleports the snackbar into the topmost open modal so it shares the dialog's top-layer context and stays interactive. When no modal is open it falls back to `body`.

```vue no-filename
<template>
  <!-- teleport="top-layer" is the default — no explicit prop needed -->
  <Snackbar.Portal>
    <Snackbar.Queue v-slot="{ items }">
      <!-- ... -->
    </Snackbar.Queue>
  </Snackbar.Portal>
</template>
```

To opt out, set `teleport="body"` (always body) or `:teleport="false"` (render inline). See [Snackbar](/components/semantic/snackbar) for the full `teleport` option reference.

??? What's the difference between `closeOnClickOutside` and `blocking`?

`:close-on-click-outside="false"` on `Dialog.Content` stops backdrop clicks from closing the dialog. `blocking` goes further and disables scrim-based dismissal entirely, so the dialog can only be closed programmatically via `Dialog.Close` or `v-model` — reach for it on critical confirmations that require an explicit choice.

:::

<DocsApi />
