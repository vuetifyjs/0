---
title: BDrawer - Bootstrap 6 Drawer for Vue
meta:
- name: description
  content: Bootstrap 6's native drawer markup with Vuetify0 behavior — showModal, backdrop dismissal, Escape, and focus return, styled by your own Bootstrap CSS.
- name: keywords
  content: bootstrap 6 drawer, vue drawer, offcanvas, showModal, focus trap, bootstrap vue, paper bootstrap
features:
  category: Component
  label: 'C: BDrawer'
  level: 2
  renderless: false
  group: overlay
related:
  - /systems/bootstrap
  - /systems/bootstrap/dialog
  - /systems/bootstrap/menu
  - /systems/bootstrap/toast
  - /systems/bootstrap/tooltip
  - /components/disclosure/dialog
---

# BDrawer

Bootstrap's `<dialog class="drawer">` with the open state, backdrop click, and Escape key the stylesheet does not ship.

<DocsPageFeatures :frontmatter />

<DocsBootstrapReference
  href="https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/components/drawer/"
  title="Drawer"
/>

## Usage

`v-model` owns the open state. Pass `placement`. Bootstrap has no default, and a drawer with no placement class has no edge to slide from. Compose the header, body, and footer the way the Bootstrap markup nests them.

::: ds-example
/systems/bootstrap/drawer/basic
:::

### The markup Bootstrap documents

The HTML tab is the drawer from the v6 docs, without `data-bs-toggle` or `data-bs-dismiss`. Those attributes are the bundle's behavior. This package does not emit them. The Vue tab is the component that renders the same tree.

::: code-group no-filename

```html Bootstrap collapse
<dialog class="drawer drawer-start">
  <div class="drawer-header">
    <h5 class="drawer-title">Drawer</h5>
    <button type="button" class="btn-close" aria-label="Close"></button>
  </div>
  <div class="drawer-body">
    Content for the drawer goes here.
  </div>
</dialog>
```

```vue Vue collapse
<template>
  <BDrawer v-model="open" placement="start">
    <BDrawer.Header>
      <BDrawer.Title>Drawer</BDrawer.Title>
      <BDrawer.Close />
    </BDrawer.Header>

    <BDrawer.Body>
      Content for the drawer goes here.
    </BDrawer.Body>
  </BDrawer>
</template>
```

:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BDrawer } from '@paper/bootstrap'
</script>

<template>
  <BDrawer>
    <BDrawer.Header>
      <BDrawer.Title />

      <BDrawer.Close />
    </BDrawer.Header>

    <BDrawer.Body />

    <BDrawer.Footer />
  </BDrawer>
</template>
```

## Composed on v0

Wraps v0's [Dialog](/components/disclosure/dialog), the same way [BDialog](/systems/bootstrap/dialog) does. `Dialog.Root` owns `v-model`. `Dialog.Content` is renderless so the host can stay a `<dialog class="drawer">`. The browser's `showModal()` traps focus and paints `::backdrop`.

`Scrim` stays off. `blocking` is a static backdrop: the click bounces and does not close. Escape still closes unless `keyboard` is false. `scroll` leaves the page scrollable. A touch or pen swipe past 40px dismisses the panel in its outward direction.

`placement` is `start`, `end`, `top`, `bottom`, or `fullscreen`. `sheet` adds `drawer-sheet`. `drawer-instant`, `drawer-translucent`, and the responsive `.sm:drawer` classes are classes you pass through.

The panel slides off its edge and the backdrop fades with it. `drawer-instant` and reduced motion close without that transition.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `boolean` | `false` | Open state. Drives `showModal()` and `close()`. |
| `blocking` | `boolean` | `false` | Backdrop click does not close. Adds `.drawer-static` for the bounce. |
| `placement` | `'start' \| 'end' \| 'top' \| 'bottom' \| 'fullscreen'` | — | `drawer-start`, `drawer-end`, `drawer-top`, `drawer-bottom`, or `drawer-fullscreen`. |
| `sheet` | `boolean` | `false` | Adds `drawer-sheet`. |

| Part | Renders | Notes |
|------|---------|-------|
| `BDrawerHeader` | `div.drawer-header` | Title and close button |
| `BDrawerTitle` | `h5.drawer-title` | Supplies `aria-labelledby` |
| `BDrawerClose` | `button.btn-close` | Closes the drawer |
| `BDrawerBody` | `div.drawer-body` | |
| `BDrawerFooter` | `div.drawer-footer` | Actions |

## Accessibility

The dialog element carries `role="dialog"` and `aria-modal`. `BDrawerTitle` is the accessible name. Opening calls `showModal()`, so the browser traps focus and returns it to the trigger on close. Escape closes, including when `blocking` is set.

> [!IMPORTANT]
> Compose `BDrawerTitle`. Without it the drawer has no accessible name.
