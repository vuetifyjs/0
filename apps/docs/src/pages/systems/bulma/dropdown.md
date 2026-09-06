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

> [!NOTE]
> Reference: [Dropdown on bulma.io](https://bulma.io/documentation/components/dropdown/) — classes and visual variants. This page is the JavaScript.

## Usage

Compose three parts: `BuDropdown` renders `.dropdown` and owns the open state, `BuDropdownTrigger` wraps your own button, and `BuDropdownMenu` renders `.dropdown-menu` with its `.dropdown-content`. `v-model` is the single source of truth for open and closed.

Positioning stays Bulma's. The menu is placed by CSS against the trigger, so there is no floating engine to install and nothing measured at runtime — `right` and `up` are the two knobs. What the component adds is the part Bulma leaves to you: the open state, the aria wiring between trigger and menu, click-outside and Escape dismissal.

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

## Composed on Vuetify0

Skips v0's [Popover](/components/disclosure/popover) entirely. `Popover.Content` hardwires `popover=""`, which promotes the menu to the top layer and sets UA `margin: unset` — both fight Bulma's in-flow `.dropdown-menu { position: absolute }`. Open state is a boolean `v-model` plus `useClickOutside` and a local Escape handler bound to the dropdown subtree, not the document: a dropdown inside `BuModal` must not close the modal on the first Escape.

Trigger aria is hand-bound (`aria-haspopup`, `aria-expanded`, `aria-controls`) because v0's Toggle only emits `aria-pressed`. `hoverable` is CSS-only — `is-hoverable` on `.dropdown`, no JS listeners.

Collision-aware placement is [Popover](/components/disclosure/popover), and it will not give you Bulma's markup.

## The markup you know

The Bulma tab is the markup [published on bulma.io](https://bulma.io/documentation/components/dropdown/), captured verbatim in the conformance fixture. The Vue tab is the component that renders it. The conformance suite diffs the two on every test run — the generated `id` and its matching `aria-controls` are the only tolerated difference.

::: code-group no-filename

```html Bulma collapse
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

```vue Vue collapse
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

## Examples

::: ds-example
/systems/bulma/dropdown/hoverable

### Hover to open

`hoverable` is the one modifier that changes behavior rather than looks. Bulma's `is-hoverable` opens the menu on hover in pure CSS, so the component deliberately steps back: the toggle becomes a no-op, and neither the click-outside listener nor the Escape handler is attached. Nothing about the open state reaches JavaScript, which is exactly why there is no `v-model` in this example.

That trade has an accessibility cost worth knowing before you reach for it. With no JavaScript running, the trigger's `aria-expanded` never flips — a hover menu reads to assistive technology as a collapsed control whose contents happen to be reachable. Use it for the light, decorative case Bulma designed it for, and use the default click mode whenever the menu is a real navigation surface.
:::

::: ds-example
/systems/bulma/dropdown/alignment

### Alignment

`right` and `up` add Bulma's `is-right` and `is-up` to `.dropdown`, and that is the whole positioning story. The menu is placed by CSS relative to the trigger — nothing measures the viewport, nothing repositions on scroll, and there is no floating engine to configure. Reach for `right` when the trigger sits near the right edge of its container, and `up` when it sits near the bottom of the page.

Because placement is static, the two modifiers are decisions you make at author time rather than behavior you get for free: a menu that would overflow the viewport stays overflowing. If you need collision-aware placement, that is a different component — [Popover](/components/disclosure/popover) in Vuetify0 does the measuring — and it will not give you Bulma's markup.
:::

::: ds-example
/systems/bulma/dropdown/items

### Menu content

The pieces Bulma documents for a menu-shaped dropdown: entries as `a.dropdown-item`, `hr.dropdown-divider` between groups, and `is-active` marking the current one. The active class is yours to drive — the component tracks open and closed, not which entry is selected.

This is also the `menu` mode in practice. Setting the prop puts `role="menu"` on `.dropdown-menu`, and spreading the `item` slot prop on each entry gives it the matching `role="menuitem"`. Take the `close` slot prop too: an entry that navigates or picks something should shut the menu behind it, and nothing closes automatically on click — an inside click is deliberately not a dismissal.
:::

::: ds-example
/systems/bulma/dropdown/arbitrary

### Arbitrary content

Bulma documents a second dropdown shape whose entries are `div.dropdown-item` holding anything at all — a paragraph, a form, a button. Leave `menu` off for this one. `role="menu"` promises a list of menu items, and a dropdown full of prose fails the accessibility checks that take the promise seriously, which is why the component makes the role opt-in rather than emitting it always.

The `item` slot prop is still handed out in this mode — it is simply an empty object while `menu` is off. Spreading it on entries you might later promote to a real menu means the same template works either way, so switching modes is one prop rather than a rewrite.
:::

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

`BuDropdownTrigger` hands out `aria-haspopup`, `aria-expanded` and an `aria-controls` that points at the id `BuDropdownMenu` generates, so the trigger and the menu it controls are wired to each other without you tracking an id.

### Dismissal

Three ways out, and one deliberate non-way:

| Gesture | Behavior |
|---------|----------|
| Click outside | Closes. The listener is attached only while the dropdown is open |
| Escape | Closes the nearest open dropdown, and stops there |
| Click inside | Does **not** close — call the `close` slot prop from the entries that should |
| Hover out (`hoverable`) | Closes, in CSS; no listener is ever attached |

Escape is bound to the dropdown's own subtree rather than the document, and the handler stops propagation once it has closed something. That is what lets a dropdown live inside an open `BuModal`: pressing Escape closes the dropdown and leaves the modal open, and pressing it again closes the modal. A document-level handler would collapse both at once — and would swallow every Escape on the page while the dropdown sat there closed.

### Menu semantics

`role="menu"` is opt-in through the `menu` prop, and it is a promise about the children: every entry must carry `role="menuitem"`, which is what the `item` slot prop applies. Set the prop when the dropdown is a list of actions or links; leave it off when the menu holds arbitrary content, where the role would fail `aria-required-children`.[^dropdown-axe]

[^dropdown-axe]: Bulma's documented arbitrary-content dropdown ships `role="menu"` around `div.dropdown-item` prose, which is the axe failure this policy avoids — one of the declared deviations on the [Bulma overview](/systems/bulma).
