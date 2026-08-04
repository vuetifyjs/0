---
title: BuDropdown - Bulma Dropdown for Vue
meta:
- name: description
  content: Bulma's dropdown markup with Vuetify0 behavior — toggle, outside-click and Escape dismissal, and the aria wiring between trigger and menu.
- name: keywords
  content: bulma dropdown, vue dropdown, dropdown-menu, is-hoverable, bulma vue, paper bulma
features:
  category: Component
  label: 'C: BuDropdown'
  level: 2
  renderless: false
  order: 2
related:
  - /systems/bulma
  - /systems/bulma/modal
  - /components/disclosure/popover
---

# BuDropdown

Bulma's `.dropdown` with the JavaScript it never shipped: toggle, outside-click and Escape dismissal, and the aria wiring between trigger and menu.

<DocsPageFeatures :frontmatter />

## Usage

`BuDropdownTrigger` hands you the attrs to spread on your own button — `aria-haspopup`, `aria-controls`, `aria-expanded` and the click handler. `BuDropdownMenu` renders `.dropdown-menu` and `.dropdown-content`, and hands each item the role it needs.

::: ds-example
/systems/bulma/dropdown/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BuDropdown, BuDropdownMenu, BuDropdownTrigger } from '@paper/bulma'
</script>

<template>
  <BuDropdown>
    <BuDropdownTrigger />

    <BuDropdownMenu />
  </BuDropdown>
</template>
```

## The markup you know

The Bulma tab is the markup [published on bulma.io](https://bulma.io/documentation/components/dropdown/), captured verbatim in the conformance fixture. The Vue tab is the component that renders it. The conformance suite diffs the two on every test run — the generated `id` and its matching `aria-controls` are the only tolerated difference.

::: code-group no-filename

```html Bulma
<div class="dropdown is-active">
  <div class="dropdown-trigger">
    <button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
      <span>Dropdown button</span>
      <span class="icon is-small">
        <i class="fas fa-angle-down" aria-hidden="true"></i>
      </span>
    </button>
  </div>
  <div class="dropdown-menu" id="dropdown-menu" role="menu">
    <div class="dropdown-content">
      <a href="#" class="dropdown-item"> Dropdown item </a>
      <a href="#" class="dropdown-item is-active"> Active dropdown item </a>
      <hr class="dropdown-divider" />
      <a href="#" class="dropdown-item"> With a divider </a>
    </div>
  </div>
</div>
```

```vue Vue
<template>
  <BuDropdown menu>
    <BuDropdownTrigger v-slot="{ attrs }">
      <button class="button" type="button" v-bind="attrs">
        <span>Dropdown button</span>
        <span class="icon is-small">
          <i class="fas fa-angle-down" aria-hidden="true" />
        </span>
      </button>
    </BuDropdownTrigger>

    <BuDropdownMenu v-slot="{ close, item }">
      <a class="dropdown-item" v-bind="item" @click="close">Dropdown item</a>
      <a class="dropdown-item is-active" v-bind="item" @click="close">Active dropdown item</a>
      <hr class="dropdown-divider">
      <a class="dropdown-item" v-bind="item" @click="close">With a divider</a>
    </BuDropdownMenu>
  </BuDropdown>
</template>
```

:::

You write no `is-active` and no `id`/`aria-controls` pair. The component owns the open class and generates a unique id, binding both ends of it for you.

## Recipes

### Modifiers

Bulma's positioning modifiers are props. Each one adds the class of the same name to `.dropdown`.

```vue
<template>
  <!-- is-right: align the menu to the right edge -->
  <BuDropdown right>
    <BuDropdownTrigger />
    <BuDropdownMenu />
  </BuDropdown>

  <!-- is-up: open upwards -->
  <BuDropdown up>
    <BuDropdownTrigger />
    <BuDropdownMenu />
  </BuDropdown>

  <!-- is-hoverable: Bulma's CSS-only hover behavior; no JS is wired -->
  <BuDropdown hoverable>
    <BuDropdownTrigger />
    <BuDropdownMenu />
  </BuDropdown>
</template>
```

`hoverable` is the one modifier that changes behavior rather than looks. Bulma opens the menu on hover with CSS alone, so the component steps back entirely: the toggle, the outside-click listener and the Escape handler all go inert.

### Arbitrary content

Bulma documents a second dropdown shape whose items are `div.dropdown-item` holding anything at all. Leave `menu` off for it — `role="menu"` promises menu items, and a dropdown full of paragraphs fails accessibility checks that take the promise seriously.

```vue
<template>
  <BuDropdown>
    <BuDropdownTrigger v-slot="{ attrs }">
      <button class="button" type="button" v-bind="attrs">Content</button>
    </BuDropdownTrigger>

    <BuDropdownMenu>
      <div class="dropdown-item">
        <p>You can insert <strong>any type of content</strong> within the dropdown menu.</p>
      </div>

      <hr class="dropdown-divider">

      <a class="dropdown-item" href="#">This is a link</a>
    </BuDropdownMenu>
  </BuDropdown>
</template>
```

## Props

`BuDropdown` renders `.dropdown` and owns the open state and the modifiers; the regions are parts.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `boolean` | `false` | Open state |
| `hoverable` | `boolean` | `false` | `is-hoverable` — Bulma's CSS-only hover mode; wires no JavaScript |
| `right` | `boolean` | `false` | `is-right` — align the menu to the right edge |
| `up` | `boolean` | `false` | `is-up` — open the menu upwards |
| `menu` | `boolean` | `false` | Emit `role="menu"`; only for dropdowns whose items are all actionable |

| Part | Renders | Slot props |
|------|---------|-----------|
| `BuDropdownTrigger` | `div.dropdown-trigger` | `isOpen`, `toggle`, `attrs` |
| `BuDropdownMenu` | `div.dropdown-menu` + `div.dropdown-content` | `isOpen`, `close`, `item` |

## Accessibility

`BuDropdownTrigger` hands out `aria-haspopup`, `aria-expanded` and an `aria-controls` that points at the id `BuDropdownMenu` generates. Escape closes the dropdown and stops there — a dropdown opened inside a modal closes without also closing the modal — and a click outside closes it. While the dropdown is closed, neither listener is attached.

Spread `item` on each entry when the parent sets `menu`: it applies `role="menuitem"`, which `role="menu"` requires. Without `menu` it is an empty object, so the same template works in both modes.
