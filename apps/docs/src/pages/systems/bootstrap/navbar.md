---
title: BNavbar - Bootstrap 6 Navbar for Vue
meta:
- name: description
  content: Bootstrap 6 navbar markup for Vue. A brand, a nav, and a toggler that opens a drawer. Expand breakpoints use colon classes such as md:navbar-expand.
- name: keywords
  content: bootstrap 6 navbar, vue navbar, drawer, navbar toggler, navbar-expand, bootstrap vue, paper bootstrap
features:
  category: Component
  label: 'C: BNavbar'
  level: 2
  renderless: false
  group: disclosure
related:
  - /systems/bootstrap
  - /systems/bootstrap/drawer
  - /systems/bootstrap/nav-overflow
---

# BNavbar

A bar with a brand and a nav. Below the expand breakpoint the nav lives in a drawer, and the toggler opens that drawer.

<DocsPageFeatures :frontmatter />

<DocsBootstrapReference
  href="https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/components/navbar/"
  title="Navbar"
/>

## Usage

`v-model` is the drawer. `expand` adds `navbar-expand`, or a colon class such as `md:navbar-expand`. That class is a container query on the navbar, not the viewport. This example uses `md`, the same bar as the Bootstrap docs. The docs column is under 768px, so the toggler stays visible there. Color stays on the element you pass `bg-*` to.

::: ds-example
/systems/bootstrap/navbar/basic
:::

### The markup Bootstrap documents

The HTML tab is the Bootstrap docs navbar. The collapsed menu is a `dialog.drawer`, not a collapse region. The Vue tab is the same tree. `data-bs-toggle` and `data-bs-target` are the bundle's behavior. This package does not emit them.

::: code-group no-filename

```html Bootstrap collapse
<nav class="navbar md:navbar-expand bg-1">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Navbar</a>
    <button class="btn-icon navbar-toggler" type="button" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon" aria-hidden="true"></span>
    </button>
    <dialog class="drawer drawer-end">
      <div class="drawer-header">
        <h5 class="drawer-title">Menu</h5>
        <button type="button" class="btn-close" aria-label="Close"></button>
      </div>
      <div class="drawer-body mb-2 md:mb-0">
        <ul class="nav navbar-nav me-auto">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Link</a>
          </li>
          <li class="nav-item">
            <button class="nav-link" type="button">Menu</button>
            <div class="menu">
              <a class="menu-item" href="#">Action</a>
              <a class="menu-item" href="#">Another action</a>
              <hr class="menu-divider">
              <a class="menu-item" href="#">Something else here</a>
            </div>
          </li>
          <li class="nav-item">
            <a class="nav-link disabled" aria-disabled="true">Disabled</a>
          </li>
        </ul>
        <form class="hstack gap-2" role="search">
          <input class="form-control" type="search" placeholder="Search" aria-label="Search">
          <button class="btn-solid btn-icon theme-secondary" type="submit" aria-label="Search"></button>
        </form>
      </div>
    </dialog>
  </div>
</nav>
```

```vue Vue collapse
<template>
  <BNavbar class="bg-1" expand="md">
    <div class="container-fluid">
      <BNavbar.Brand href="#">Navbar</BNavbar.Brand>

      <BNavbar.Collapse>
        <BDrawer.Header>
          <BDrawer.Title>Menu</BDrawer.Title>
          <BDrawer.Close />
        </BDrawer.Header>

        <BDrawer.Body class="mb-2 md:mb-0">
          <BNavbar.Nav class="nav me-auto">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#">Home</a>
            </li>

            <li class="nav-item">
              <a class="nav-link" href="#">Link</a>
            </li>

            <li class="nav-item">
              <BMenu label="Menu" trigger-class="nav-link">
                <BMenu.Item href="#">Action</BMenu.Item>
                <BMenu.Item href="#">Another action</BMenu.Item>
                <BMenu.Divider />
                <BMenu.Item href="#">Something else here</BMenu.Item>
              </BMenu>
            </li>

            <li class="nav-item">
              <a class="nav-link disabled" aria-disabled="true">Disabled</a>
            </li>
          </BNavbar.Nav>

          <form class="hstack gap-2" role="search">
            <BFormControl aria-label="Search" placeholder="Search" type="search" />
            <BButton aria-label="Search" icon theme="secondary" type="submit" variant="solid" />
          </form>
        </BDrawer.Body>
      </BNavbar.Collapse>
    </div>
  </BNavbar>
</template>
```

:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BNavbar } from '@paper/bootstrap'
</script>

<template>
  <BNavbar>
    <BNavbar.Brand />

    <BNavbar.Collapse>
      <BNavbar.Nav />
    </BNavbar.Collapse>
  </BNavbar>
</template>
```

## Composed on v0

The collapse is [BDrawer](/systems/bootstrap/drawer), which is a [Dialog](/components/disclosure/dialog). There is no second offcanvas. The toggler is [BButton](/systems/bootstrap/button) with `icon`, plus `navbar-toggler`. It flips the navbar `v-model`, and the drawer reads that same boolean. `aria-controls` is the dialog id Dialog already sets.

`BNavbar.Nav` is only `ul.navbar-nav`. It is not a nav component. Put `li.nav-item` and `a.nav-link` in the slot, or pass `as="div"` when the pin uses a div.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `boolean` | `false` | Drawer open state. |
| `expand` | `boolean \| 'sm' \| 'md' \| 'lg'` | — | `true` adds `navbar-expand`. A breakpoint adds `sm:navbar-expand`, `md:navbar-expand`, or `lg:navbar-expand`. |
| `placement` | `'start' \| 'end' \| 'top' \| 'bottom' \| 'fullscreen'` | `'end'` | On `BNavbar.Collapse`. Passed through to the drawer. |
| `label` | `string` | — | Toggler name. Omitted, `Navbar.toggle`, or Toggle navigation. |
| `as` | `string` | `'a'` on Brand, `'ul'` on Nav | Element of that part. |
| `href` | `string` | — | On `BNavbar.Brand`, and only when `as` is `a`. |

`bg-*` and `fg-*` are not props. Put them on the navbar the same way the docs do.

## Accessibility

The toggler is a `button` named `Navbar.toggle`, or Toggle navigation. `aria-expanded` follows the drawer. `aria-controls` is the dialog id. The drawer is a native `dialog`, so Escape and the close button dismiss it and focus stays inside while it is modal. The icon span is `aria-hidden`. Above the expand breakpoint the pin hides the toggler and shows the drawer in the bar.
