---
title: BuTabs - Bulma Tabs for Vue
meta:
- name: description
  content: Bulma's tabs markup with Vuetify0 selection — is-active, tabpanels and keyboard selection owned by the compound, with boxed and toggle modifiers living on the list.
- name: keywords
  content: bulma tabs, vue tabs, is-boxed, is-toggle, tabpanel, bulma vue, paper bulma
features:
  category: Component
  label: 'C: BuTabs'
  level: 2
  renderless: false
  order: 10
related:
  - /systems/bulma
  - /systems/bulma/pagination
  - /components/disclosure/tabs
---

# BuTabs

<DocsPageFeatures :frontmatter />

Bulma's `.tabs` with selection and panels — the JavaScript and the tabpanels the CSS framework never documented.

> [!NOTE]
> Reference: [Tabs on bulma.io](https://bulma.io/documentation/components/tabs/) — classes and visual variants. This page is the JavaScript.

## Usage

`BuTabs` is the selection context and renders no element of its own. Modifiers live on `BuTabList`. `BuTab` siblings go inside the list; `BuTabPanel` siblings of the list hold the content. `v-model` is the selected tab's `value`; leave it empty and the first tab is selected.

::: ds-example
/systems/bulma/tabs/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BuTab, BuTabList, BuTabPanel, BuTabs } from '@paper/bulma'
</script>

<template>
  <BuTabs>
    <BuTabList>
      <BuTab />
    </BuTabList>

    <BuTabPanel />
  </BuTabs>
</template>
```

## Composed on Vuetify0

`BuTabs` maps onto v0's [Tabs](/components/disclosure/tabs) compound: `Tabs.Root`, `Tabs.List`, `Tabs.Item` and `Tabs.Panel`.

`BuTabs` is `Tabs.Root` with no element of its own. Bulma's `.tabs` block is the list, and the panels are siblings of that block, so the selection context has to wrap both. Every `.tabs` modifier — `centered`, `boxed`, `toggle`, `size` — therefore lives on `BuTabList`, which is the `div.tabs` plus the `ul` (`Tabs.List as="ul"`). Putting those classes on the root would paint a wrapper Bulma does not document.

`BuTab` is `Tabs.Item` with `as` set to `null`, not the `renderless` prop. `as` feeds the item's button polyfill, so `renderless` alone would leak `type="button"` and `disabled` onto the anchor. The item renders `li.is-active > a` itself, which is what the fixture demands: `is-active` on the `li`, no `href` on the `a`. The `<a>` is passed as `el` so arrow-key focus follows the real control.

`BuTabPanel` is `Tabs.Panel` as-is. The `hidden` attribute is fine here: Bulma defines no panel CSS, so there is no class for the wrapper to fight.

## The markup you know

The Bulma tab is the markup [published on bulma.io](https://bulma.io/documentation/components/tabs/), captured verbatim in the conformance fixture. The Vue tab is the component that renders it. Upstream documents no tabpanels — those are component territory. The conformance suite diffs the list.

::: code-group no-filename

```html Bulma
<div class="tabs">
  <ul>
    <li class="is-active"><a>Pictures</a></li>
    <li><a>Music</a></li>
    <li><a>Videos</a></li>
    <li><a>Documents</a></li>
  </ul>
</div>
```

```vue Vue
<template>
  <BuTabs>
    <BuTabList>
      <BuTab value="pictures">Pictures</BuTab>
      <BuTab value="music">Music</BuTab>
      <BuTab value="videos">Videos</BuTab>
      <BuTab value="documents">Documents</BuTab>
    </BuTabList>
  </BuTabs>
</template>
```

:::

You write no `is-active`. The first tab is selected when `v-model` is empty; after that, the model owns the class.

## Examples

::: ds-example
/systems/bulma/tabs/boxed

### Boxed

`boxed` is `is-boxed` on `.tabs` — the bordered, folder-tab look. It is a list modifier, so it lives on `BuTabList` with `centered`, `toggle` and `size`, not on `BuTabs`. The root has no class to hang a modifier on.

Reach for boxed when the tabs sit on a content panel and you want the selected tab to read as attached to it. `toggle` is the other shape: mutually exclusive buttons, no folder metaphor. The two modifiers are independent classes in Bulma, so stacking them is possible and usually a mistake — pick the look the surrounding layout is built for.

Size still belongs on the list. `small` / `medium` / `large` scale the tabs without changing which item is selected, and they compose with boxed the same way they compose with the default underline style.
:::

## Props

<!-- Hand-authored; <DocsApi /> does not cover @paper/* yet. Keep in sync with the SFC. -->

`BuTabs` is the selection context. Everything visible is a part.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `T` | — | Selected tab `value`. Empty selects the first tab |

| Part | Renders | Props |
|------|---------|-------|
| `BuTabList` | `div.tabs` + `ul` | `centered`, `boxed`, `toggle`, `size` (`'small' \| 'normal' \| 'medium' \| 'large'`) |
| `BuTab` | `li` > `a` | `value`, `disabled` |
| `BuTabPanel` | `div[role=tabpanel]` | `value` (required) |

`BuTab` and `BuTabPanel` both expose `isSelected` as a slot prop.

## Accessibility

`BuTabList`'s `ul` is `role="tablist"`. Each `BuTab` puts `role="presentation"` on the `li` so the list's required children are the `role="tab"` anchors, not the list items — without that, axe flags `aria-required-children` / `aria-required-parent`. Selected state is `aria-selected` on the tab and `hidden` on the matching `role="tabpanel"`, which is labelled through `aria-labelledby`.

| Key | Behavior |
|-----|----------|
| Click | Selects that tab |
| Arrow Left / Right | Moves focus **and** activates the tab |
| Home / End | Focuses **and** activates first / last |
