---
title: BListGroup - Bootstrap 6 List group for Vue
meta:
- name: description
  content: Bootstrap 6 list group markup for Vue. Plain items, flush, horizontal, numbered, and action buttons or links, with an optional active id.
- name: keywords
  content: bootstrap 6 list group, vue list group, list-group-item, list-group-flush, list-group-numbered, paper bootstrap
features:
  category: Component
  label: 'C: BListGroup'
  level: 2
  renderless: false
  group: content
related:
  - /systems/bootstrap
  - /systems/bootstrap/breadcrumb
  - /systems/bootstrap/pagination
---

# BListGroup

A list group of items, links, or buttons, with an optional single active id.

<DocsPageFeatures :frontmatter />

> [!NOTE]
> Reference: [List group on the Bootstrap 6 preview](https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/components/list-group/). Classes and visual variants. This page is Vue.

## Usage

The default is `ul.list-group` of `li.list-group-item`. `flush` and `horizontal` add those classes. `numbered` renders an `ol`. Action rows are a `button`, or an `a` when you pass `href`, and belong in `as="div"`. Without `selectable`, `active` is presentational. With `selectable`, `v-model` is the active item id.

::: ds-example
/systems/bootstrap/list-group/basic
:::

### The markup Bootstrap documents

The HTML tab is the Bootstrap 6 preview. The Vue tab is the component that renders the same tree. `md:list-group-horizontal` is a class you add, not a prop.

::: code-group no-filename

```html Bootstrap collapse
<ul class="list-group">
  <li class="list-group-item active" aria-current="true">An active item</li>
  <li class="list-group-item">A second item</li>
</ul>
```

```vue Vue collapse
<script setup lang="ts">
  import { shallowRef } from 'vue'
  import { BListGroup } from '@paper/bootstrap'

  const current = shallowRef('a')
</script>

<template>
  <BListGroup>
    <BListGroup.Item active>An active item</BListGroup.Item>
    <BListGroup.Item>A second item</BListGroup.Item>
  </BListGroup>

  <BListGroup v-model="current" as="div" selectable>
    <BListGroup.Item action value="a">First</BListGroup.Item>
    <BListGroup.Item action value="b">Second</BListGroup.Item>
  </BListGroup>
</template>
```

:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BListGroup } from '@paper/bootstrap'
</script>

<template>
  <BListGroup>
    <BListGroup.Item />
  </BListGroup>
</template>
```

## Composed on v0

The active id is [createSingle](/composables/selection/create-single). A selectable item registers its `value` and selects that ticket. The list stays `ul`, `ol`, or `div`. A row stays `li`, `button`, or `a`. Presentational `active` does not register.

## Examples

::: ds-example
/systems/bootstrap/list-group/variants

### Flush, numbered, horizontal, and links

`flush` adds `list-group-flush`. `numbered` is an `ol` with `list-group-numbered`. `horizontal` adds `list-group-horizontal`. A breakpoint class such as `md:list-group-horizontal` is still one you add yourself.

`href` renders an `a`. `disabled` on that link keeps `href`, adds `.disabled` and `aria-disabled`, and sets `tabindex="-1"`.
:::

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `string` | — | Active item id when `selectable` is set. |
| `as` | `'ul' \| 'ol' \| 'div'` | `'ul'` | Host element. `numbered` renders `ol` instead. |
| `flush` | `boolean` | `false` | Adds `list-group-flush`. |
| `horizontal` | `boolean` | `false` | Adds `list-group-horizontal`. |
| `numbered` | `boolean` | `false` | Renders `ol` and adds `list-group-numbered`. |
| `selectable` | `boolean` | `false` | `v-model` is the active id. `active` on an item is ignored. |
| `active` (item) | `boolean` | `false` | Presentational `.active` and `aria-current`. |
| `action` (item) | `boolean` | `false` | `button.list-group-item-action`. |
| `href` (item) | `string` | — | Renders `a.list-group-item-action`. |
| `disabled` (item) | `boolean` | `false` | Native `disabled` on a button. `.disabled` on a link or `li`. |
| `value` (item) | `string` | — | Id stored when the group is `selectable`. |

## Accessibility

An active row sets `aria-current="true"`. An action control is `button type="button"`. Its disabled state is the native attribute, with no `aria-disabled`. A disabled link keeps `href`, and adds `.disabled`, `aria-disabled="true"`, and `tabindex="-1"`. A disabled `li` adds `.disabled` and `aria-disabled`. Selectable rows are in the normal tab order. Enter and Space activate a button. Enter follows a link. There is no `data-bs-toggle`.
