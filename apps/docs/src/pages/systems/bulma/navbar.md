---
title: BuNavbar - Bulma Navbar for Vue
meta:
- name: description
  content: Bulma's navbar markup with Vuetify0 behavior — burger toggle, is-active on both ends, and the aria wiring between burger and menu.
- name: keywords
  content: bulma navbar, vue navbar, navbar-burger, navbar-menu, is-hoverable, bulma vue, paper bulma
features:
  category: Component
  label: 'C: BuNavbar'
  level: 2
  renderless: false
  order: 7
related:
  - /systems/bulma
  - /systems/bulma/dropdown
  - /components/actions/toggle
---

# BuNavbar

<DocsPageFeatures :frontmatter />

Bulma's `.navbar` with the JavaScript it never shipped: the burger toggle, `is-active` on both ends, and the aria wiring between them.

> [!NOTE]
> Reference: [Navbar on bulma.io](https://bulma.io/documentation/components/navbar/) — classes and visual variants. This page is the JavaScript.

## Usage

Compose three parts: `BuNavbar` renders `nav.navbar` and owns the open state, `BuNavbarBrand` wraps your brand items and renders the burger, and `BuNavbarMenu` renders `.navbar-menu`. `v-model` is a boolean — burger and menu open together.

`.navbar-start` and `.navbar-end` are yours. So is `.navbar-item.has-dropdown.is-hoverable`: hover is Bulma CSS, no JavaScript, and there is no click-dropdown to configure.

::: ds-example
/systems/bulma/navbar/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BuNavbar, BuNavbarBrand, BuNavbarMenu } from '@paper/bulma'
</script>

<template>
  <BuNavbar>
    <BuNavbarBrand />

    <BuNavbarMenu />
  </BuNavbar>
</template>
```

## Composed on v0

`BuNavbar` owns a boolean `v-model` — the burger/menu open state — and provides it through the package context `bulma:navbar`. That is a Toggle-shaped model, not a disclosure compound.

[Collapsible](/components/disclosure/collapsible) is skipped because `Collapsible.Content` sets the `hidden` attribute, and `.navbar-menu.is-active { display: block }` in Bulma's CSS silently beats `[hidden]`. The menu would look open while remaining hidden to the platform. [Popover](/components/disclosure/popover) is skipped for the same class of reason: it would hoist the menu into the top layer and fight Bulma's in-flow layout.

v0's [Toggle](/components/actions/toggle) shows up in one place. The burger is `Toggle.Root` rendered `as="a"` — that supplies `role="button"`, tabindex, and the Enter/Space polyfill. Toggle only emits `aria-pressed`, so `aria-expanded` and `aria-label="menu"` are bound by hand, as is `data-target` pointing at the id `BuNavbarMenu` wears. Four `aria-hidden` spans are the 1.0 burger glyph; 0.9 had three.

The brand slot sits **beside** the burger, not around it. Slot content is the `.navbar-item` links and logos; the burger is appended after them, matching the markup Bulma documents.

## The markup you know

The Bulma tab is the markup [published on bulma.io](https://bulma.io/documentation/components/navbar/), captured verbatim in the conformance fixture. The Vue tab is the component that renders it. The conformance suite diffs the two on every test run — a generated `id` and its matching `data-target` are tolerated when you omit `id`.

::: code-group no-filename

```html Bulma collapse
<nav class="navbar" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item" href="https://bulma.io">
      <img src="logo.png" alt="Logo" />
    </a>

    <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>

  <div id="navbarBasicExample" class="navbar-menu">
    <div class="navbar-start">
      <a class="navbar-item">
        Home
      </a>

      <a class="navbar-item">
        Documentation
      </a>

      <div class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-link">
          More
        </a>

        <div class="navbar-dropdown">
          <a class="navbar-item">
            About
          </a>
          <a class="navbar-item is-selected">
            Jobs
          </a>
          <a class="navbar-item">
            Contact
          </a>
          <hr class="navbar-divider">
          <a class="navbar-item">
            Report an issue
          </a>
        </div>
      </div>
    </div>

    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <a class="button is-primary">
            <strong>Sign up</strong>
          </a>
          <a class="button is-light">
            Log in
          </a>
        </div>
      </div>
    </div>
  </div>
</nav>
```

```vue Vue collapse
<template>
  <BuNavbar id="navbarBasicExample" v-model="open">
    <BuNavbarBrand>
      <a class="navbar-item" href="https://bulma.io">
        <img src="logo.png" alt="Logo">
      </a>
    </BuNavbarBrand>

    <BuNavbarMenu>
      <div class="navbar-start">
        <a class="navbar-item">Home</a>
        <a class="navbar-item">Documentation</a>

        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">More</a>
          <div class="navbar-dropdown">
            <a class="navbar-item">About</a>
            <a class="navbar-item is-selected">Jobs</a>
            <a class="navbar-item">Contact</a>
            <hr class="navbar-divider">
            <a class="navbar-item">Report an issue</a>
          </div>
        </div>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <a class="button is-primary"><strong>Sign up</strong></a>
            <a class="button is-light">Log in</a>
          </div>
        </div>
      </div>
    </BuNavbarMenu>
  </BuNavbar>
</template>
```

:::

You write no burger, no `is-active`, and no `aria-expanded` / `data-target` pair. `BuNavbarBrand` owns the burger; the open class is driven by `v-model` onto both ends.

## Examples

::: ds-example
/systems/bulma/navbar/color

### Color

`color` adds `is-{color}` to `.navbar`. That is the whole modifier: it does not change open state, burger wiring, or how a hover dropdown works. Reach for it when the bar itself is the brand surface — a primary header, a danger admin strip — and leave it off when the bar should recede behind the page.

`has-dropdown is-hoverable` remains passthrough markup either way. Hover is Bulma CSS. There is no prop for a click-dropdown, and adding one would fight that CSS.
:::

## Props

<!-- Hand-authored; <DocsApi /> does not cover @paper/* -->

`BuNavbar` renders `nav.navbar` and owns the open state; the regions are parts.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `boolean` | `false` | Burger / menu open state |
| `id` | `string` | auto | Applied to `.navbar-menu` and mirrored on the burger's `data-target` |
| `label` | `string` | `'main navigation'` | Accessible name for the `<nav>` landmark |
| `color` | `'primary' \| 'link' \| 'info' \| 'success' \| 'warning' \| 'danger'` | — | `is-{color}` on `.navbar` |

| Part | Renders | Notes |
|------|---------|-------|
| `BuNavbarBrand` | `div.navbar-brand` | Slot is brand items; renders `.navbar-burger` after them when `burger` (default `true`) |
| `BuNavbarMenu` | `div.navbar-menu` | `is-active` follows the navbar `v-model`; slot is `.navbar-start` / `.navbar-end` |

`BuNavbarBrand` takes one prop of its own:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `burger` | `boolean` | `true` | Render the `.navbar-burger` toggle |

## Accessibility

`nav` carries `role="navigation"` and `aria-label` from `label`. The burger is a `role="button"` anchor with `aria-label="menu"` and `aria-expanded` bound to the open state; `data-target` points at the menu's `id`. The four inner spans are `aria-hidden`.

Toggle also emits `aria-pressed` onto that same button. Both attributes are allowed on `role="button"`; whether pressed belongs on a disclosure trigger is an APG question, not an axe one.

> [!NOTE]
> Resize the frame to a mobile width to use the burger. On desktop Bulma shows `.navbar-menu` regardless of `is-active`.
