---
title: BuBreadcrumb - Bulma Breadcrumb for Vue
meta:
- name: description
  content: Bulma's breadcrumb trail in Vue — compose BuBreadcrumbItem crumbs, mark the current page explicitly, and wrap instead of vanishing when the trail is wider than its container.
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

Bulma's `.breadcrumb` — compose crumb items, mark the current page with `current`, separators as a class, wrapping instead of hiding.

> [!NOTE]
> Reference: [Breadcrumb on bulma.io](https://bulma.io/documentation/components/breadcrumb/) — classes and visual variants. This page is the JavaScript.

## Usage

`BuBreadcrumb` is `nav.breadcrumb > ul`. Compose `BuBreadcrumbItem` children for each crumb. Set `current` on the last item — there is no v-model and no auto-last magic. Alignment, size and separator are modifier props on the root.

::: ds-example
/systems/bulma/breadcrumb/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BuBreadcrumb, BuBreadcrumbItem } from '@paper/bulma'
</script>

<template>
  <BuBreadcrumb>
    <BuBreadcrumbItem />
  </BuBreadcrumb>
</template>
```

## Composed on v0

None. [Breadcrumbs](/components/semantic/breadcrumbs) is the compound it is *not* wrapping, and the skip is load-bearing.

v0's `Breadcrumbs.Root` owns an overflow watcher. The moment the measured container is narrower than the crumb run, it hides the middle items — even when no `Breadcrumbs.Ellipsis` is registered. There is no indicator. Crumbs just disappear. Upstream Bulma flex-wraps the trail instead, and that wrap is the documented look.

BuBreadcrumb also uses nothing else the compound offers. There is no v-model: the current page is the item you mark with `current`. There is no overflow UI to opt into. Wrapping the compound in Tier 1 would have bought a truncation bug and no behavior, so the component renders `nav.breadcrumb > ul` itself and leaves each `BuBreadcrumbItem` to emit `li > a`.

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
  <BuBreadcrumb>
    <BuBreadcrumbItem href="#">
      Bulma
    </BuBreadcrumbItem>

    <BuBreadcrumbItem href="#">
      Documentation
    </BuBreadcrumbItem>

    <BuBreadcrumbItem href="#">
      Components
    </BuBreadcrumbItem>

    <BuBreadcrumbItem
      current
      href="#"
    >
      Breadcrumb
    </BuBreadcrumbItem>
  </BuBreadcrumb>
</template>
```

:::

You write `current` on the last crumb. That is what applies `is-active` and `aria-current="page"` — the root does not infer it from position.

## Examples

::: ds-example
/systems/bulma/breadcrumb/separators

### Separators

`separator` is the four Bulma alternatives to the default slash: `arrow`, `bullet`, `dot`, `succeeds`. Each becomes `has-{separator}-separator` on `nav.breadcrumb`; the slashes, arrows and dots are `li + li::before` in Bulma's CSS, not extra DOM. There is no divider part to compose, and putting one in the slot would be a second separator sitting on top of the first.

Reach for `arrow` when the trail is a path you walk, `bullet` when it is a list of places, `dot` and `succeeds` when you want the quieter marks. The default slash is the right answer for most docs and app chrome. Alignment (`centered`, `right`) and `size` compose with any of them — they are independent modifier classes, not competing modes.
:::

::: ds-example
/systems/bulma/breadcrumb/icons

### Icons

Icon crumbs are ordinary anchor children — a `.icon.is-small` span beside a text span inside `BuBreadcrumbItem`. There is no `#item` slot and no special icon prop; compose the markup Bulma documents.
:::

## Props

<!-- Hand-authored; <DocsApi /> does not cover @paper/* yet. Keep in sync with the SFC. -->

`BuBreadcrumb` renders `nav.breadcrumb > ul`. The crumbs are parts.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `centered` | `boolean` | `false` | `is-centered` |
| `right` | `boolean` | `false` | `is-right` |
| `separator` | `'arrow' \| 'bullet' \| 'dot' \| 'succeeds'` | — | `has-{separator}-separator`; omit for the default slash |
| `size` | `'small' \| 'normal' \| 'medium' \| 'large'` | — | `is-{size}` |
| `label` | `string` | `'breadcrumbs'` | `aria-label` on the `nav` |

| Part | Renders | Notes |
|------|---------|-------|
| `BuBreadcrumbItem` | `li > a` | Props `href?`, `current?`. `current` applies `is-active` on `li` and `aria-current="page"` on `a` |

The item's default slot is the anchor children — text, icons, or both.

## Accessibility

The root is a `nav` labelled by `label`. The current crumb keeps its `<a>` — Bulma's CSS styles that anchor inert — and carries `aria-current="page"` when you set `current`. Earlier crumbs are ordinary links.

The trail wraps when it is wider than its container. Nothing is hidden, and there is no ellipsis control to announce.
