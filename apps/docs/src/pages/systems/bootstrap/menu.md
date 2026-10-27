---
title: BMenu - Bootstrap 6 Menu for Vue
meta:
- name: description
  content: Bootstrap 6's menu markup with Vuetify0 behavior — placement, arrow keys, submenus, and click-outside, styled by your own Bootstrap CSS.
- name: keywords
  content: bootstrap 6 menu, vue menu, dropdown, popover, placement, bootstrap vue, paper bootstrap
features:
  category: Component
  label: 'C: BMenu'
  level: 2
  renderless: false
  group: overlay
related:
  - /systems/bootstrap
  - /systems/bootstrap/dialog
  - /systems/bootstrap/drawer
  - /systems/bootstrap/toast
  - /systems/bootstrap/tooltip
  - /composables/system/use-popover
---

# BMenu

A trigger button and a `.menu` of items. `v-model` toggles `.show`. Arrows move through the items; Escape and an outside click close.

<DocsPageFeatures :frontmatter />

<DocsBootstrapReference
  href="https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/components/menu/"
  title="Menu"
/>

## Usage

`v-model` owns the open state. The trigger label is a prop. The docs menu is three links. A header, a divider, and a submenu are the same slot.

::: ds-example
/systems/bootstrap/menu/basic
:::

### The markup Bootstrap documents

The HTML tab is the menu from the v6 docs, without `data-bs-toggle`. That attribute is the bundle's behavior. This package does not emit it. `data-bs-placement` is present because the stylesheet keys `transform-origin` off it. The Vue tab is the component that renders the same tree.

::: code-group no-filename

```html Bootstrap collapse
<button type="button" class="btn-solid theme-primary" aria-expanded="false" aria-haspopup="menu">
  Toggle menu
</button>
<div class="menu" data-bs-placement="bottom-start">
  <h6 class="menu-header">Account</h6>
  <a class="menu-item" href="#">Profile</a>
  <hr class="menu-divider">
  <a class="menu-item" href="#">Sign out</a>
</div>
```

```vue Vue collapse
<template>
  <BMenu v-model="open" label="Toggle menu">
    <BMenu.Header>Account</BMenu.Header>

    <BMenu.Item href="#">Profile</BMenu.Item>

    <BMenu.Divider />

    <BMenu.Item href="#">Sign out</BMenu.Item>
  </BMenu>
</template>
```

:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BMenu } from '@paper/bootstrap'
</script>

<template>
  <BMenu>
    <BMenu.Header />

    <BMenu.Item />

    <BMenu.Divider />

    <BMenu.Submenu>
      <BMenu.Item />
    </BMenu.Submenu>
  </BMenu>
</template>
```

## Composed on v0

Position comes from [usePopover](/composables/system/use-popover). The default adapter writes CSS anchor positioning onto the menu (`position: fixed`, `position-area`). The menu stays in normal layout: it does not use the native `popover` attribute, which would put it in the top layer and fight `.menu { position: absolute }`.

`placement` defaults to `bottom-start`. The same token is `data-bs-placement`.

### Other browsers

CSS anchor positioning covers current Chrome, Edge, Safari 26, and Firefox. Firefox ESR and Safari before 26 need a positioning engine in the app. A later combobox reads the same plugin.

```ts
import { createPopoverPlugin } from '@vuetify/v0'
import { FloatingUIPopoverAdapter } from '@vuetify/v0/popover/adapters/floating-ui'

app.use(createPopoverPlugin({
  adapter: new FloatingUIPopoverAdapter(),
}))
```

Hover opens a submenu immediately and closes it after 100ms. A click that enters a closed submenu keeps it open. A later click closes it. Safe-triangle tracking, a touch `mouseover` workaround, teleporting the menu into a container, and responsive `md:bottom-end` placements are left to the app.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `boolean` | `false` | Open state. Adds `.show` on `.menu`. |
| `label` | `string` | `'Toggle menu'` | Trigger text. |
| `placement` | `'bottom-start' \| 'bottom' \| 'bottom-end' \| 'top-start' \| 'top' \| 'top-end' \| 'left-start' \| 'left' \| 'left-end' \| 'right-start' \| 'right' \| 'right-end'` | `'bottom-start'` | Where the menu sits, and the `data-bs-placement` hook. |
| `autoClose` | `boolean \| 'inside' \| 'outside'` | `true` | `true` closes on a click inside or outside. `'inside'` and `'outside'` close on only that side. `false` leaves Escape and the trigger. |

| Part | Renders | Notes |
|------|---------|-------|
| `BMenuItem` | `a.menu-item` or `button.menu-item` | `href` selects the anchor. `disabled` adds `.disabled`. |
| `BMenuHeader` | `h6.menu-header` | Skipped by the arrow keys |
| `BMenuDivider` | `hr.menu-divider` | Skipped by the arrow keys |
| `BMenuSubmenu` | `div.submenu` | Nested menu. `label` is the trigger text. |

## Accessibility

The trigger is `aria-haspopup="menu"` and `aria-expanded`. Items are in the tab sequence only as a group: the trigger is tabbable, items are `tabindex="-1"`, and the arrows, Home, and End move between them, wrapping at the ends. Tab closes the menu and moves on. Escape closes and returns focus to the trigger. Opening from a click leaves focus where it was. ArrowDown and ArrowUp on the trigger open the menu and focus the first or last item.

A submenu trigger is `aria-haspopup="true"`. ArrowRight opens it (ArrowLeft when the direction is RTL) and focuses the first nested item. The opposite arrow closes it. The menu does not mark the rest of the page inert. Bootstrap's own menu does the same.

The markup does not add `role="menu"` or `role="menuitem"`. Bootstrap's stylesheet and docs don't either.
