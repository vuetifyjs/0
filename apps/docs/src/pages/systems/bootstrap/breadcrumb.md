---
title: BBreadcrumb - Bootstrap 6 Breadcrumb for Vue
meta:
- name: description
  content: Bootstrap 6 breadcrumb markup for Vue. Slotted crumbs and a divider item you write between them, with the last crumb marked as the current page.
- name: keywords
  content: bootstrap 6 breadcrumb, vue breadcrumb, breadcrumb-item, breadcrumb-divider, paper bootstrap
features:
  category: Component
  label: 'C: BBreadcrumb'
  level: 2
  renderless: false
  group: content
related:
  - /systems/bootstrap
  - /systems/bootstrap/pagination
  - /systems/bootstrap/list-group
---

# BBreadcrumb

A breadcrumb trail. Dividers are their own items, written between the crumbs.

<DocsPageFeatures :frontmatter />

<DocsBootstrapReference
  href="https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/components/breadcrumb/"
  title="Breadcrumb"
/>

## Usage

There is no items prop. Write an item, a divider, an item. The divider is an empty `li.breadcrumb-divider` unless you put text or an icon in it. The last item takes `current`, and its link takes `active`.

::: ds-example
/systems/bootstrap/breadcrumb/basic
:::

### The markup Bootstrap documents

The HTML tab is the Bootstrap 6 preview. The Vue tab is the component that renders the same tree. Nothing appends a divider after the last crumb.

::: code-group no-filename

```html Bootstrap collapse
<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item">
      <a class="breadcrumb-link" href="#">Home</a>
    </li>
    <li class="breadcrumb-divider">/</li>
    <li class="breadcrumb-item">
      <a class="breadcrumb-link" href="#">Library</a>
    </li>
    <li class="breadcrumb-divider">/</li>
    <li class="breadcrumb-item" aria-current="page">
      <a class="breadcrumb-link active" href="#">Data</a>
    </li>
  </ol>
</nav>
```

```vue Vue collapse
<template>
  <BBreadcrumb>
    <BBreadcrumb.Item>
      <BBreadcrumb.Link href="#">Home</BBreadcrumb.Link>
    </BBreadcrumb.Item>
    <BBreadcrumb.Divider>/</BBreadcrumb.Divider>
    <BBreadcrumb.Item>
      <BBreadcrumb.Link href="#">Library</BBreadcrumb.Link>
    </BBreadcrumb.Item>
    <BBreadcrumb.Divider>/</BBreadcrumb.Divider>
    <BBreadcrumb.Item current>
      <BBreadcrumb.Link href="#" active>Data</BBreadcrumb.Link>
    </BBreadcrumb.Item>
  </BBreadcrumb>
</template>
```

:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BBreadcrumb } from '@paper/bootstrap'
</script>

<template>
  <BBreadcrumb>
    <BBreadcrumb.Item>
      <BBreadcrumb.Link />
    </BBreadcrumb.Item>

    <BBreadcrumb.Divider />
  </BBreadcrumb>
</template>
```

## Composed on v0

This is markup. The host is `nav` around `ol.breadcrumb`. You write the items, the links, and the dividers.

v0 [Breadcrumbs](/components/semantic/breadcrumbs) measures the row and hides what does not fit. [createBreadcrumbs](/composables/semantic/create-breadcrumbs) is a route trail. Neither is this list. The pin's divider is a sibling `li`, not a separator the component inserts.

The nav name is [useLocale](/composables/plugins/use-locale): `Breadcrumb.label`, or `breadcrumb`. `label` replaces that.

## Examples

::: ds-example
/systems/bootstrap/breadcrumb/dividers

### Dividers

An empty divider paints the chevron. The mask is `::before` on `:empty`, so text in the slot replaces it. `›` is one of those characters.
:::

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `breadcrumb` | `aria-label` on the nav. |
| `current` (item) | `boolean` | `false` | `aria-current="page"` on the item. |
| `href` (link) | `string` | `'#'` | The link target. |
| `active` (link) | `boolean` | `false` | Adds `.active` on the current page's link. |

## Accessibility

The nav is named `breadcrumb` unless `label` or a locale string replaces it. The current item sets `aria-current="page"`. Its link also takes `.active`, and it stays a link, which is what the pin renders. An empty divider has no text, so the chevron is not announced. A text divider is text in the list. Tab moves between the links. Enter follows the link.
