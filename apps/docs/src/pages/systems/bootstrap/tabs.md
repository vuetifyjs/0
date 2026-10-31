---
title: BTabs - Bootstrap 6 tabs for Vue
meta:
- name: description
  content: Bootstrap 6 tabs for Vue. A nav tablist and tab panes. The model is the selected value. Arrow keys move. Styled by your CSS.
- name: keywords
  content: bootstrap 6 tabs, vue tabs, nav-tabs, tab-pane, paper bootstrap
features:
  category: Component
  label: 'C: BTabs'
  level: 2
  renderless: true
  group: disclosure
related:
  - /systems/bootstrap
  - /systems/bootstrap/nav
  - /systems/bootstrap/collapse
  - /composables/selection/create-single
---

# BTabs

A tablist and its panes. `v-model` is the selected value. Arrow keys move between tabs.

<DocsPageFeatures :frontmatter />

<DocsBootstrapReference
  href="https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/components/nav/#tabs"
  title="Tabs"
/>

## Usage

The root renders nothing of its own. `List` is the tablist. `Content` is `.tab-content`. Each pane has to be a direct child of `Content`, because the pin hides panes with `.tab-content > .tab-pane` and shows `.tab-content > .active`.

::: ds-example
/systems/bootstrap/tabs/basic
:::

## Examples

::: ds-example
/systems/bootstrap/tabs/vertical
:::

### The markup Bootstrap documents

The HTML tab is one selected tab and its pane. The Vue tab is the same tree. There is no `data-bs-toggle`.

::: code-group no-filename

```html Bootstrap collapse
<ul class="nav nav-tabs" role="tablist">
  <li class="nav-item" role="presentation">
    <button class="nav-link active" type="button" role="tab" aria-selected="true">Home</button>
  </li>
</ul>
<div class="tab-content">
  <div class="tab-pane show active" role="tabpanel" tabindex="0">Home</div>
</div>
```

```vue Vue collapse
<template>
  <BTabs v-model="tab">
    <BTabs.List>
      <BTabs.Item value="home">Home</BTabs.Item>
    </BTabs.List>
    <BTabs.Content>
      <BTabs.Panel value="home">Home</BTabs.Panel>
    </BTabs.Content>
  </BTabs>
</template>
```

:::

`variant="pills"` uses `.nav-pills`. `vertical` uses `.nav-pills` and `.nav-pills-vertical`, and the arrows run up and down. `instant` adds `.tab-pane-instant` so the pane does not fade.

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BTabs } from '@paper/bootstrap'
</script>

<template>
  <BTabs>
    <BTabs.List>
      <BTabs.Item value="home">Home</BTabs.Item>
    </BTabs.List>

    <BTabs.Content>
      <BTabs.Panel value="home">Home</BTabs.Panel>
    </BTabs.Content>
  </BTabs>
</template>
```

## Composed on v0

Selection is [createSingle](/composables/selection/create-single) with `mandatory: 'force'`, bridged to `v-model` by [useProxyModel](/composables/reactivity/use-proxy-model). Arrow keys are [useRovingFocus](/composables/system/use-roving-focus). The list does not wrap v0 Tabs. That component's roles land on different elements than `.nav-link` and `.tab-pane`.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `string` | | Selected item `value`. |
| `variant` | `'tabs' \| 'pills'` | `'tabs'` | `nav-tabs` or `nav-pills`. |
| `vertical` | `boolean` | `false` | Pills, stacked. Arrows are vertical. The direction is read when the tabs are created. |
| `instant` | `boolean` | `false` | Adds `.tab-pane-instant` and skips the fade. |

`BTabs.Item` takes `value` and `disabled`. `BTabs.Panel` takes the same `value`. Changing an item's `value` updates the registered id, and a selected item keeps the model on that new id.

## Accessibility

The list is `role="tablist"`. Each item is `role="tab"` with `aria-selected` and `aria-controls`. The selected pane is `role="tabpanel"` and `tabindex="0"`. A disabled item is a native disabled button and is skipped by the arrows. Home and End move to the ends. The roving keydown is on the tab button, not on a wrapper.
