---
title: BuBreadcrumb - Bulma Breadcrumb for Vue
meta:
- name: description
  content: Bulma's breadcrumb trail in Vue — last item is current, separators are a prop, and crumbs wrap instead of vanishing when the trail is wider than its container.
- name: keywords
  content: bulma breadcrumb, vue breadcrumb, breadcrumb trail, has-arrow-separator, bulma vue, paper bulma
features:
  category: Component
  label: 'C: BuBreadcrumb'
  level: 2
  renderless: false
  order: 4
related:
  - /systems/bulma
  - /systems/bulma/pagination
  - /components/semantic/breadcrumbs
---

# BuBreadcrumb

<DocsPageFeatures :frontmatter />

Bulma's `.breadcrumb` — last crumb current, separators as a class, wrapping instead of hiding.

> [!NOTE]
> Reference: [Breadcrumb on bulma.io](https://bulma.io/documentation/components/breadcrumb/) — classes and visual variants. This page is the JavaScript.

## Usage

Pass `items` — `{ text, href? }[]`. The last entry is the current page; there is no v-model. Alignment, size and separator are modifier props on the same component.

::: ds-example
/systems/bulma/breadcrumb/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BuBreadcrumb } from '@paper/bulma'
</script>

<template>
  <BuBreadcrumb />
</template>
```

## Composed on v0

None. [Breadcrumbs](/components/semantic/breadcrumbs) is the compound it is *not* wrapping, and the skip is load-bearing.

v0's `Breadcrumbs.Root` owns an overflow watcher. The moment the measured container is narrower than the crumb run, it hides the middle items — even when no `Breadcrumbs.Ellipsis` is registered. There is no indicator. Crumbs just disappear. Upstream Bulma flex-wraps the trail instead, and that wrap is the documented look.

BuBreadcrumb also uses nothing else the compound offers. There is no v-model: the last item is current because it is last. There is no overflow UI to opt into. Wrapping the compound in Tier 1 would have bought a truncation bug and no behavior, so the component renders `nav.breadcrumb > ul > li > a` itself and leaves the last item `is-active` with `aria-current="page"`.

The follow-up is in v0, not here. `BreadcrumbsRoot` should skip the truncation branch when no ellipsis ticket is registered, or expose an overflow opt-out. Once it does, this page can wrap the compound without changing a class.

## The markup you know

The Bulma tab is the markup [published on bulma.io](https://bulma.io/documentation/components/breadcrumb/), captured verbatim in the conformance fixture. The Vue tab is the component that renders it. The conformance suite diffs the two on every test run — element for element, class for class.

::: code-group no-filename

```html Bulma
<nav class="breadcrumb" aria-label="breadcrumbs">
  <ul>
    <li><a href="#">Bulma</a></li>
    <li><a href="#">Documentation</a></li>
    <li><a href="#">Components</a></li>
    <li class="is-active"><a href="#" aria-current="page">Breadcrumb</a></li>
  </ul>
</nav>
```

```vue Vue
<template>
  <BuBreadcrumb
    :items="[
      { text: 'Bulma', href: '#' },
      { text: 'Documentation', href: '#' },
      { text: 'Components', href: '#' },
      { text: 'Breadcrumb', href: '#' },
    ]"
  />
</template>
```

:::

You write no `is-active` and no `aria-current`. The last item is current because it is last; the component marks it.

## Examples

::: ds-example
/systems/bulma/breadcrumb/separators

### Separators

`separator` is the four Bulma alternatives to the default slash: `arrow`, `bullet`, `dot`, `succeeds`. Each becomes `has-{separator}-separator` on `nav.breadcrumb`; the slashes, arrows and dots are `li + li::before` in Bulma's CSS, not extra DOM. There is no divider part to compose, and putting one in the slot would be a second separator sitting on top of the first.

Reach for `arrow` when the trail is a path you walk, `bullet` when it is a list of places, `dot` and `succeeds` when you want the quieter marks. The default slash is the right answer for most docs and app chrome. Alignment (`centered`, `right`) and `size` compose with any of them — they are independent modifier classes, not competing modes.
:::

## Props

<!-- Hand-authored; <DocsApi /> does not cover @paper/* yet. Keep in sync with the SFC. -->

`BuBreadcrumb` is a single component. There are no parts.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `{ text: string; href?: string }[]` | `[]` | Trail. The last entry is the current page |
| `centered` | `boolean` | `false` | `is-centered` |
| `right` | `boolean` | `false` | `is-right` |
| `separator` | `'arrow' \| 'bullet' \| 'dot' \| 'succeeds'` | — | `has-{separator}-separator`; omit for the default slash |
| `size` | `'small' \| 'normal' \| 'medium' \| 'large'` | — | `is-{size}` |
| `label` | `string` | `'breadcrumbs'` | `aria-label` on the `nav` |

The optional `#item` slot replaces each anchor's content. Slot props: `item`, `index`, `isLast`. Use it for icons; leave it off and the item's `text` is the link.

## Accessibility

The root is a `nav` labelled by `label`. The last crumb keeps its `<a>` — Bulma's CSS styles that anchor inert — and carries `aria-current="page"`. Earlier crumbs are ordinary links.

The trail wraps when it is wider than its container. Nothing is hidden, and there is no ellipsis control to announce.
