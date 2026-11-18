---
title: BCollapse - Bootstrap 6 Collapse for Vue
meta:
- name: description
  content: Bootstrap 6's collapse markup with Vuetify0 behavior — a panel you open from your own button, styled by your own Bootstrap CSS.
- name: keywords
  content: bootstrap 6 collapse, vue collapse, show, horizontal, bootstrap vue, paper bootstrap
features:
  category: Component
  label: 'C: BCollapse'
  level: 2
  renderless: false
  group: disclosure
related:
  - /systems/bootstrap
  - /systems/bootstrap/accordion
  - /systems/bootstrap/popover
  - /components/disclosure/collapsible
---

# BCollapse

A panel that opens and closes in place. The trigger is your button; this component is the panel.

<DocsPageFeatures :frontmatter />

<DocsBootstrapReference
  href="https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/components/collapse/"
  title="Collapse"
/>

## Usage

`v-model` owns `.show`. Point the button's `aria-controls` at the panel id.

::: ds-example
/systems/bootstrap/collapse/basic
:::

### The markup Bootstrap documents

The HTML tab is the open panel. The Vue tab is the component that renders it. `data-bs-toggle` is the bundle's behavior. This package does not emit it.

::: code-group no-filename

```html Bootstrap collapse
<div class="collapse show">
  Some placeholder content for the collapse component.
</div>
```

```vue Vue collapse
<template>
  <button class="btn-solid theme-primary" type="button" aria-controls="collapse-example" :aria-expanded="open" @click="open = !open">
    Toggle collapse
  </button>

  <BCollapse id="collapse-example" v-model="open">
    Some placeholder content for the collapse component.
  </BCollapse>
</template>
```

:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BCollapse } from '@paper/bootstrap'
</script>

<template>
  <BCollapse />
</template>
```

## Composed on v0

The open flag is a boolean `v-model`. The panel is a `div.collapse`, and `.show` is added while that flag is true. The id is generated when you do not pass one, so a button outside the panel can set `aria-controls`.

It does not use [Collapsible](/components/disclosure/collapsible). That primitive renders its own tag and classes, and Bootstrap's stylesheet is written for `div.collapse`.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `boolean` | `false` | Open state. Adds `.show` on `.collapse`. |
| `id` | `string` | generated | Element id for `aria-controls`. |
| `horizontal` | `boolean` | `false` | Adds `.collapse-horizontal`. |

There is no `.collapsing` class. Keyboard behavior belongs to the button you write.

## Accessibility

The panel does not take a role of its own. Give the button `aria-controls` set to the panel id and `aria-expanded` set from the same `v-model`. This component does not listen for keys.
