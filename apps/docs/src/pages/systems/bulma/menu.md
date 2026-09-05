---
title: BuMenu - Bulma Menu for Vue
meta:
- name: description
  content: Bulma's menu markup with Vuetify0 behavior — exclusive active tracking across nested lists, with is-active on the anchor, not the li.
- name: keywords
  content: bulma menu, vue menu, menu-list, menu-label, sidebar nav, bulma vue, paper bulma
features:
  category: Component
  label: 'C: BuMenu'
  level: 2
  renderless: false
  order: 5
related:
  - /systems/bulma
  - /systems/bulma/panel
  - /components/providers/single
---

# BuMenu

<DocsPageFeatures :frontmatter />

Bulma's `.menu` with the JavaScript it never shipped: exclusive active tracking across nested lists, driven by `v-model`.

> [!NOTE]
> Reference: [Menu on bulma.io](https://bulma.io/documentation/components/menu/) — classes and visual variants. This page is the JavaScript.

## Usage

Compose `BuMenuLabel`, `BuMenuList`, `BuMenuItem`, and `BuMenuLink`. `v-model` is the selected link's `value`. `is-active` lands on the **anchor**, not the `li`. That is the opposite of tabs and breadcrumb, and it is what Bulma's CSS selects on.

::: ds-example
/systems/bulma/menu/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import {
    BuMenu,
    BuMenuItem,
    BuMenuLabel,
    BuMenuLink,
    BuMenuList,
  } from '@paper/bulma'
</script>

<template>
  <BuMenu>
    <BuMenuLabel />

    <BuMenuList>
      <BuMenuItem>
        <BuMenuLink />
      </BuMenuItem>
    </BuMenuList>
  </BuMenu>
</template>
```

## Composed on Vuetify0

`BuMenu` wraps v0's [Single](/components/providers/single). `Single.Root` is a pure provider — it renders no element — so the `aside.menu` and every list are Bulma's. Each `BuMenuLink` is a renderless `Single.Item` whose `isSelected` and `select` are bound by hand onto the anchor: `is-active` for Bulma's CSS, `data-selected` for the data-attr hook, click to select.

The Item `attrs` object is never spread. Those attrs include `aria-selected`, which is invalid on a role-less `<a>` (axe `aria-allowed-attr`, critical). Hand-picking is the same convention [BuPanel](/systems/bulma/panel) uses.

Nested children are still `Single.Item`s in that one exclusive selection. They render inside a `BuMenuList` with `nested`, which is a bare `<ul>` sibling of the parent anchor, always visible. [createNested](/composables/selection/create-nested) and [Collapsible](/components/disclosure/collapsible) are skipped on purpose: Bulma documents no collapse, no tree, and no `aria-expanded` on these lists. Inventing one would be a different component.

## The markup you know

The Bulma tab is the markup [published on bulma.io](https://bulma.io/documentation/components/menu/), captured verbatim in the conformance fixture. The Vue tab is the component that renders it. The conformance suite diffs the two on every test run — element for element, class for class.

::: code-group no-filename

```html Bulma collapse
<aside class="menu">
  <p class="menu-label">General</p>
  <ul class="menu-list">
    <li><a>Dashboard</a></li>
    <li><a>Customers</a></li>
  </ul>
  <p class="menu-label">Administration</p>
  <ul class="menu-list">
    <li><a>Team Settings</a></li>
    <li>
      <a class="is-active">Manage Your Team</a>
      <ul>
        <li><a>Members</a></li>
        <li><a>Plugins</a></li>
        <li><a>Add a member</a></li>
      </ul>
    </li>
    <li><a>Invitations</a></li>
    <li><a>Cloud Storage Environment Settings</a></li>
    <li><a>Authentication</a></li>
  </ul>
  <p class="menu-label">Transactions</p>
  <ul class="menu-list">
    <li><a>Payments</a></li>
    <li><a>Transfers</a></li>
    <li><a>Balance</a></li>
  </ul>
</aside>
```

```vue Vue
<template>
  <BuMenu v-model="active">
    <BuMenuLabel>General</BuMenuLabel>

    <BuMenuList>
      <BuMenuItem>
        <BuMenuLink value="Dashboard">Dashboard</BuMenuLink>
      </BuMenuItem>

      <BuMenuItem>
        <BuMenuLink value="Customers">Customers</BuMenuLink>
      </BuMenuItem>
    </BuMenuList>

    <BuMenuLabel>Administration</BuMenuLabel>

    <BuMenuList>
      <BuMenuItem>
        <BuMenuLink value="Team Settings">Team Settings</BuMenuLink>
      </BuMenuItem>

      <BuMenuItem>
        <BuMenuLink value="Manage Your Team">Manage Your Team</BuMenuLink>

        <BuMenuList nested>
          <BuMenuItem>
            <BuMenuLink value="Members">Members</BuMenuLink>
          </BuMenuItem>

          <BuMenuItem>
            <BuMenuLink value="Plugins">Plugins</BuMenuLink>
          </BuMenuItem>

          <BuMenuItem>
            <BuMenuLink value="Add a member">Add a member</BuMenuLink>
          </BuMenuItem>
        </BuMenuList>
      </BuMenuItem>

      <BuMenuItem>
        <BuMenuLink value="Invitations">Invitations</BuMenuLink>
      </BuMenuItem>

      <BuMenuItem>
        <BuMenuLink value="Cloud Storage Environment Settings">
          Cloud Storage Environment Settings
        </BuMenuLink>
      </BuMenuItem>

      <BuMenuItem>
        <BuMenuLink value="Authentication">Authentication</BuMenuLink>
      </BuMenuItem>
    </BuMenuList>

    <BuMenuLabel>Transactions</BuMenuLabel>

    <BuMenuList>
      <BuMenuItem>
        <BuMenuLink value="Payments">Payments</BuMenuLink>
      </BuMenuItem>

      <BuMenuItem>
        <BuMenuLink value="Transfers">Transfers</BuMenuLink>
      </BuMenuItem>

      <BuMenuItem>
        <BuMenuLink value="Balance">Balance</BuMenuLink>
      </BuMenuItem>
    </BuMenuList>
  </BuMenu>
</template>
```

:::

You write no `is-active` yourself — `v-model` owns which anchor is current. Nested markup is explicit: a second `BuMenuList` with `nested` inside the same `BuMenuItem`.

## Examples

::: ds-example
/systems/bulma/menu/nested

### Nested lists

A `BuMenuList` with `nested` inside a `BuMenuItem` renders a bare `<ul>` as a sibling of that item's `BuMenuLink`. The nested list has no class, and it is always visible. Bulma documents no collapse for `.menu-list`, so there is no disclosure, no chevron, and no `aria-expanded` — clicking a parent selects it the same way clicking a child does.

The link's default slot is open for icons and badges — the nested example puts a Font Awesome icon and a `.tag` inside `BuMenuLink` without changing the selection wiring.

That is the whole nesting story. The nested entries share the menu's single `v-model`; they are not a second selection and not a tree. Reach for this when the sidebar has a short group that should stay expanded — team settings, a docs section. If you need a collapsible tree, that is [Treeview](/components/disclosure/treeview) in Vuetify0, and it will not give you Bulma's markup.
:::

## Props

<!-- Hand-authored; <DocsApi /> does not cover @paper/* -->

`BuMenu` renders `aside.menu` and owns the selection. Lists and labels are composed parts.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `T` | — | Selected link value |

### BuMenuList

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `nested` | `boolean` | `false` | Omit `.menu-list` — bare `<ul>` for nested lists |

### BuMenuLink

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `T` | — | Selection value matched against `v-model` |
| `href` | `string` | — | Optional `href` on the anchor |

`BuMenuLabel` and `BuMenuItem` take no props — heading text and children go in the default slot.

## Accessibility

The anchors are role-less links, which is what Bulma ships. They are not a `menu` / `menubar` widget and they do not get `aria-selected`. Active state is `is-active` plus `data-selected` — visual and style-hook only.

> [!NOTE]
> Spreading v0 Item `attrs` onto these anchors fails axe (`aria-allowed-attr`, critical). The component never does that; neither should a hand-rolled slot.
