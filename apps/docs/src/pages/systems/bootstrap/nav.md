---
title: BNav - Bootstrap 6 nav for Vue
meta:
- name: description
  content: Bootstrap 6 nav markup for Vue. A list of links with tabs, pills, or underline. Active and disabled are props. This is not a tab widget.
- name: keywords
  content: bootstrap 6 nav, vue nav, nav-pills, nav-underline, nav-link, paper bootstrap
features:
  category: Component
  label: 'C: BNav'
  level: 2
  renderless: false
  group: disclosure
related:
  - /systems/bootstrap
  - /systems/bootstrap/tabs
  - /systems/bootstrap/navbar
---

# BNav

A list of links. You choose which one is active. It does not switch panes.

<DocsPageFeatures :frontmatter />

<DocsBootstrapReference
  href="https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/components/nav/"
  title="Navs"
/>

## Usage

The default host is `ul.nav`. Put a `BNav.Link` in each `BNav.Item`. `as="nav"` is the flat list, with links and no `li`.

::: ds-example
/systems/bootstrap/nav/basic
:::

## Examples

::: ds-example
/systems/bootstrap/nav/variants
:::

### The markup Bootstrap documents

::: code-group no-filename

```html Bootstrap collapse
<ul class="nav">
  <li class="nav-item">
    <a class="nav-link active" href="#home" aria-current="page">Active</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="#link">Link</a>
  </li>
</ul>
```

```vue Vue collapse
<template>
  <BNav>
    <BNav.Item>
      <BNav.Link active href="#home">Active</BNav.Link>
    </BNav.Item>
    <BNav.Item>
      <BNav.Link href="#link">Link</BNav.Link>
    </BNav.Item>
  </BNav>
</template>
```

:::

`variant` adds `nav-tabs`, `nav-pills`, or `nav-underline`. `vertical` uses pills and `nav-pills-vertical`, and it wins over `variant`. `fill` and `justified` add `nav-fill` and `nav-justified`.

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BNav } from '@paper/bootstrap'
</script>

<template>
  <BNav>
    <BNav.Item>
      <BNav.Link href="#home">Home</BNav.Link>
    </BNav.Item>
  </BNav>
</template>
```

## Composed on v0

Nothing here is a selection or a tab. The component writes the classes and the active link's `aria-current`. For a keyboard tablist, use [BTabs](/systems/bootstrap/tabs).

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `'ul' \| 'nav'` | `'ul'` | `ul` wraps items. `nav` is the flat link list. |
| `variant` | `'tabs' \| 'pills' \| 'underline'` | | Adds that nav class. |
| `vertical` | `boolean` | `false` | `nav-pills` and `nav-pills-vertical`. |
| `fill` | `boolean` | `false` | Adds `.nav-fill`. |
| `justified` | `boolean` | `false` | Adds `.nav-justified`. |

`BNav.Link` takes `href`, `active`, and `disabled`. `active` adds `.active` and `aria-current="page"`. `disabled` adds `.disabled` and `aria-disabled="true"`, drops `href`, and sets `tabindex="-1"`.

## Accessibility

These are links, not tabs. There is no `role="tab"`. A disabled link is not in the tab order and has no `href`. Set `active` on the current page yourself.
