---
title: BuPanel - Bulma Panel for Vue
meta:
- name: description
  content: Bulma's panel markup with Vuetify0 behavior — independent selection for blocks and for tabs, composed as the flat children Bulma already documents.
- name: keywords
  content: bulma panel, vue panel, panel-block, panel-tabs, panel-heading, bulma vue, paper bulma
features:
  category: Component
  label: 'C: BuPanel'
  level: 2
  renderless: false
  order: 9
related:
  - /systems/bulma
  - /systems/bulma/menu
  - /components/providers/selection
---

# BuPanel

<DocsPageFeatures :frontmatter />

Bulma's `.panel` with the JavaScript it never shipped: independent selection for blocks and for tabs, composed as the flat children Bulma already documents.

> [!NOTE]
> Reference: [Panel on bulma.io](https://bulma.io/documentation/components/panel/) — classes and visual variants. This page is the JavaScript.

## Usage

`BuPanel` renders `nav.panel` and owns the **block** `v-model`. Compose the rest in document order, with no list wrapper: `BuPanelHeading`, optional passthrough `.panel-block` markup, `BuPanelTabs` / `BuPanelTab` for the filter row, `BuPanelBlock` for selectable rows, `BuPanelIcon` for the leading glyph.

Tabs have a second `v-model` of their own. The two selections never share.

::: ds-example
/systems/bulma/panel/basic
:::

## Anatomy

```vue Anatomy no-filename collapse
<script setup lang="ts">
  import { BuPanel } from '@paper/bulma'
</script>

<template>
  <BuPanel>
    <BuPanel.Heading />

    <BuPanel.Tabs>
      <BuPanel.Tab />
    </BuPanel.Tabs>

    <BuPanel.Block>
      <BuPanel.Icon />
    </BuPanel.Block>
  </BuPanel>
</template>
```

## Composed on v0

`BuPanel` wraps its children in v0's [Selection](/components/providers/selection). That is the block `v-model`. `BuPanelBlock` is a renderless `Selection.Item` with the same hand-picked anchor bindings [BuMenu](/systems/bulma/menu) uses: `is-active`, `data-selected`, click to select — never the Item `attrs` spread, because `aria-selected` is invalid on a role-less `<a>`. `multiple` is Selection's `multiple`, forwarded.

`BuPanelTabs` opens a nested [Single](/components/providers/single) of its own, with `mandatory="force"` so one tab is always active, matching Bulma's docs. Its `v-model` never shares the panel's. Clicking a tab cannot select a block, and the reverse.

`label.panel-block > input[type=checkbox]` rows, search fields, and footer buttons stay native passthrough. They are not `BuPanelBlock` and they do not enroll in either selection.

## The markup you know

The Bulma tab is the markup [published on bulma.io](https://bulma.io/documentation/components/panel/), captured verbatim in the conformance fixture. The Vue tab is the component that renders it. The conformance suite diffs the two on every test run — element for element, class for class.

::: code-group no-filename

```html Bulma collapse
<nav class="panel">
  <p class="panel-heading">Repositories</p>
  <div class="panel-block">
    <p class="control has-icons-left">
      <input class="input" type="text" placeholder="Search" />
      <span class="icon is-left">
        <i class="fas fa-search" aria-hidden="true"></i>
      </span>
    </p>
  </div>
  <p class="panel-tabs">
    <a class="is-active">All</a>
    <a>Public</a>
    <a>Private</a>
    <a>Sources</a>
    <a>Forks</a>
  </p>
  <a class="panel-block is-active">
    <span class="panel-icon">
      <i class="fas fa-book" aria-hidden="true"></i>
    </span>
    bulma
  </a>
  <a class="panel-block">
    <span class="panel-icon">
      <i class="fas fa-book" aria-hidden="true"></i>
    </span>
    marksheet
  </a>
  <a class="panel-block">
    <span class="panel-icon">
      <i class="fas fa-book" aria-hidden="true"></i>
    </span>
    minireset.css
  </a>
  <a class="panel-block">
    <span class="panel-icon">
      <i class="fas fa-book" aria-hidden="true"></i>
    </span>
    jgthms.github.io
  </a>
  <a class="panel-block">
    <span class="panel-icon">
      <i class="fas fa-code-branch" aria-hidden="true"></i>
    </span>
    daniellowtw/infboard
  </a>
  <a class="panel-block">
    <span class="panel-icon">
      <i class="fas fa-code-branch" aria-hidden="true"></i>
    </span>
    mojs
  </a>
  <label class="panel-block">
    <input type="checkbox" />
    remember me
  </label>
  <div class="panel-block">
    <button class="button is-link is-outlined is-fullwidth">
      Reset all filters
    </button>
  </div>
</nav>
```

```vue Vue collapse
<template>
  <BuPanel v-model="selected">
    <BuPanel.Heading>Repositories</BuPanel.Heading>

    <div class="panel-block">
      <p class="control has-icons-left">
        <input class="input" placeholder="Search" type="text">
        <span class="icon is-left">
          <i aria-hidden="true" class="fas fa-search" />
        </span>
      </p>
    </div>

    <BuPanel.Tabs v-model="tab">
      <BuPanel.Tab value="All">All</BuPanel.Tab>
      <BuPanel.Tab value="Public">Public</BuPanel.Tab>
      <BuPanel.Tab value="Private">Private</BuPanel.Tab>
      <BuPanel.Tab value="Sources">Sources</BuPanel.Tab>
      <BuPanel.Tab value="Forks">Forks</BuPanel.Tab>
    </BuPanel.Tabs>

    <BuPanel.Block value="bulma">
      <BuPanel.Icon icon="fas fa-book" />
      bulma
    </BuPanel.Block>

    <BuPanel.Block value="marksheet">
      <BuPanel.Icon icon="fas fa-book" />
      marksheet
    </BuPanel.Block>

    <BuPanel.Block value="minireset.css">
      <BuPanel.Icon icon="fas fa-book" />
      minireset.css
    </BuPanel.Block>

    <BuPanel.Block value="jgthms.github.io">
      <BuPanel.Icon icon="fas fa-book" />
      jgthms.github.io
    </BuPanel.Block>

    <BuPanel.Block value="daniellowtw/infboard">
      <BuPanel.Icon icon="fas fa-code-branch" />
      daniellowtw/infboard
    </BuPanel.Block>

    <BuPanel.Block value="mojs">
      <BuPanel.Icon icon="fas fa-code-branch" />
      mojs
    </BuPanel.Block>

    <label class="panel-block">
      <input type="checkbox">
      remember me
    </label>

    <div class="panel-block">
      <button class="button is-link is-outlined is-fullwidth" type="button">
        Reset all filters
      </button>
    </div>
  </BuPanel>
</template>
```

:::

You write no `is-active` on tabs or blocks. Each `v-model` owns its own row of it. Search, checkbox and footer stay the markup Bulma already gave you.

## Examples

::: ds-example
/systems/bulma/panel/tabs

### Tabs and blocks

`BuPanelTabs` is its own [Single](/components/providers/single) with `mandatory="force"`. One tab is always active — an empty `shallowRef` is enough; the first tab is selected as it registers. That `v-model` is independent of the panel's. Filter the list from the tab value if you want; the component will not do it for you, because Bulma's panel does not either.

`BuPanelBlock` rows live in the parent [Selection](/components/providers/selection). Default is exclusive. Pass `multiple` on `BuPanel` when several rows should stay `is-active` together — a tag filter, a batch of checked-looking rows that are not actually checkboxes.

Everything else in the panel is passthrough. A search field is `div.panel-block`. A checkbox row is `label.panel-block > input`. A footer button is `div.panel-block > button`. None of those enroll in either selection, which is why a "remember me" checkbox does not steal `is-active` from the repo list.
:::

## Props

<!-- Hand-authored; <DocsApi /> does not cover @paper/* -->

`BuPanel` renders `nav.panel` and owns the block selection. Everything else is a part, or passthrough markup.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `T \| T[]` | — | Selected block value(s) |
| `multiple` | `boolean` | `false` | Allow multiple selected `a.panel-block` rows |
| `color` | `'primary' \| 'link' \| 'info' \| 'success' \| 'warning' \| 'danger'` | — | `is-{color}` on `.panel` |

| Part | Renders | Notes |
|------|---------|-------|
| `BuPanelHeading` | `p.panel-heading` | Title bar; pure markup |
| `BuPanelTabs` | `p.panel-tabs` | Own Single `v-model`; `mandatory="force"` |
| `BuPanelTab` | `a` | `value` matched against the tabs `v-model` |
| `BuPanelBlock` | `a.panel-block` | `value` matched against the panel `v-model` |
| `BuPanelIcon` | `span.panel-icon` | `icon` is the inner `<i>` class list (`fas fa-book`); default slot replaces it |

`BuPanelTabs` takes only `v-model`. `BuPanelTab` and `BuPanelBlock` take `value`. `BuPanelIcon` takes `icon`.

## Accessibility

`.panel` is a `<nav>` without a name in the markup Bulma ships; this component does not invent one. Add `aria-label` yourself if the panel is the page's only navigation, or leave it when it sits beside a named landmark.

Tabs and blocks are role-less anchors with `is-active` / `data-selected`. They are not a `tablist` and not a `listbox`. Spreading v0 Item `attrs` onto them fails axe (`aria-allowed-attr`, critical) — the parts never do that.

Checkbox rows stay native `label > input[type=checkbox]`. That is the right control for a boolean; do not restyle a `BuPanelBlock` into a checkbox.
