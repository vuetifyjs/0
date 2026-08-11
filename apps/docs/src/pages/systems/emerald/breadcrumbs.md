---
title: EmBreadcrumbs - Emerald Breadcrumbs for Vue
meta:
- name: description
  content: Emerald's breadcrumb trail — a nav landmark with links, a current-page marker, custom dividers, and automatic collapse behind an ellipsis when space runs out. Composed on Vuetify0's headless Breadcrumbs.
- name: keywords
  content: emerald breadcrumbs, vue breadcrumbs, breadcrumb navigation, overflow breadcrumbs, vuetify0 breadcrumbs, paper emerald
features:
  category: Component
  label: 'C: EmBreadcrumbs'
  level: 2
  renderless: false
  order: 10
related:
  - /systems/emerald
  - /systems/emerald/icon
  - /components/semantic/breadcrumbs
---

# EmBreadcrumbs

<DocsPageFeatures :frontmatter />

A navigation trail that shows where the current page sits in a hierarchy. When the trail outgrows its container, the middle crumbs collapse behind an ellipsis on their own.

## Usage

`EmBreadcrumbs` is a compound: the root is the landmark, `EmBreadcrumbsList` is the list, and each `EmBreadcrumbsItem` holds either an `EmBreadcrumbsLink` (a place the reader can go back to) or an `EmBreadcrumbsPage` (where they are now). `EmBreadcrumbsDivider` sits between items and stays out of the accessibility tree.

The split between Link and Page is the one to get right. Every crumb except the last is a link; the last is the current page, and it gets `aria-current="page"` instead of an `href`. Pass each item's `text` — that is what registers the crumb with the navigation model underneath.

::: ds-example
/systems/emerald/breadcrumbs/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import {
    EmBreadcrumbs,
    EmBreadcrumbsDivider,
    EmBreadcrumbsEllipsis,
    EmBreadcrumbsItem,
    EmBreadcrumbsLink,
    EmBreadcrumbsList,
    EmBreadcrumbsPage,
  } from '@paper/emerald'
</script>

<template>
  <EmBreadcrumbs>
    <EmBreadcrumbsList>
      <EmBreadcrumbsItem>
        <EmBreadcrumbsLink />
      </EmBreadcrumbsItem>

      <EmBreadcrumbsDivider />

      <EmBreadcrumbsEllipsis />

      <EmBreadcrumbsDivider />

      <EmBreadcrumbsItem>
        <EmBreadcrumbsPage />
      </EmBreadcrumbsItem>
    </EmBreadcrumbsList>
  </EmBreadcrumbs>
</template>
```

## Composed on v0

Every part is a thin skin over the matching part of v0's [Breadcrumbs](/components/semantic/breadcrumbs) compound — `EmBreadcrumbs` renders `Breadcrumbs.Root`, `EmBreadcrumbsItem` renders `Breadcrumbs.Item`, and so on down the list. Each Emerald part adds a class and Emerald's tokens; the behavior is all v0's.

That split matters most for the overflow machinery. `Breadcrumbs.Root` measures every item and divider, reserves room for the first crumb, its divider and the ellipsis, and hides middle crumbs from the start of the trail when they stop fitting — which is why the root crumb and the current page are the last things to go. A hidden crumb is not unmounted: v0 keeps it in the DOM with `display: none` and `inert`, so it stays registered and reappears the moment the container grows. Emerald writes none of that logic; it inherits it by rendering the parts.

Emerald pins each part's element rather than forwarding v0's `as` and `renderless` props: the root is a `nav`, the list an `ol`, items, dividers and the ellipsis are `li`, links are real anchors and the page is a `span`. One v0 part has no Emerald wrapper: `Breadcrumbs.Activator`, the disclosure button that makes a collapsed trail expandable. The Emerald parts provide and consume the same default context as v0's, so the v0 part can be dropped inside an `EmBreadcrumbsEllipsis` directly when you need that behavior.

## Examples

::: ds-example
/systems/emerald/breadcrumbs/overflow

### Collapse behind an ellipsis

Place an `EmBreadcrumbsEllipsis` in the trail — conventionally after the first item's divider — and the compound handles the rest. When everything fits, the ellipsis hides itself; when the container shrinks, middle crumbs fold away behind it, oldest first, while the root crumb and the current page hold on. Use the width presets to watch it happen.

Nothing here is a media query. The root measures the real rendered widths of every item and divider, works out how many fit, and toggles each crumb's visibility — so the collapse tracks the container, not the viewport, and works just as well in a sidebar or a resizable panel.

The root reports what it decided through its default slot: this example reads `isOverflowing` to caption the trail's state. One thing to keep aligned: the root's `gap` prop (default `8`) is the pixel gap the measurement math assumes between items, and Emerald's own list styles put an 8px gap there, so the defaults agree. If you restyle the list's gap, pass the same number to `gap` or the capacity calculation drifts.
:::

::: ds-example
/systems/emerald/breadcrumbs/divider

### Dividers

The divider character is a prop, not a convention. Set `divider` once on the root and every `EmBreadcrumbsDivider` in that trail renders it; set `divider` on a single divider to override just that one. The default is a slash.

For anything beyond a character, use the divider's default slot — it replaces the text entirely, and the slot receives the resolved `divider` string if you want to build on it. The second trail here renders an [EmIcon](/systems/emerald/icon) chevron in each divider. The icon needs no label: the divider is `aria-hidden`, so whatever you render inside it is decoration by construction, and a screen reader hears only the crumbs.

Whatever you render, keep it a divider. The slot is for how the separator looks, not for smuggling in extra content — anything interactive inside an `aria-hidden` list item would be reachable by keyboard but invisible to assistive technology.
:::

## Props

<!-- Hand-authored ahead of DocsApi extraction for @paper/emerald -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `divider` | `string` | `'/'` | Divider text for every divider in the trail |
| `ellipsis` | `string` | `'…'` | Ellipsis text shown when the trail collapses |
| `gap` | `number` | `8` | Pixel gap between items assumed by the overflow math — keep it equal to the list's CSS gap |
| `label` | `string` | — | Accessible name for the nav landmark. Falls back to the locale key and then to Breadcrumbs |
| `namespace` | `string` | — | Which v0 Breadcrumbs instance to bind to. Only needed when nesting |

The root's default slot forwards v0's slot props — `isOverflowing`, `capacity`, `total`, `depth`, `isRoot`, and the navigation methods `first`, `prev` and `select`. The `attrs` object in that slot is already bound to the rendered `nav`; do not spread it onto a child.

### Parts

<!-- Hand-authored ahead of DocsApi extraction for @paper/emerald -->

| Part | Props | Notes |
|------|-------|-------|
| `EmBreadcrumbsList` | — | The `ol` that holds the trail |
| `EmBreadcrumbsItem` | `id`, `value`, `text` (default `''`), `namespace` | One crumb. `text` registers with the navigation model |
| `EmBreadcrumbsLink` | — | A navigable crumb; native attributes such as `href` fall through to the anchor |
| `EmBreadcrumbsPage` | — | The current page; carries `aria-current="page"` |
| `EmBreadcrumbsDivider` | `id`, `divider`, `namespace` | Separator. `divider` overrides the root's character for this one; the default slot replaces it entirely and receives the resolved `divider` |
| `EmBreadcrumbsEllipsis` | `id`, `ellipsis`, `namespace` | Collapse indicator. Hidden while everything fits; its default slot receives the resolved `ellipsis` and a `count` of hidden crumbs |

`namespace` exists only on the parts that talk to the root's context — item, divider and ellipsis. The list, link and page are purely presentational and take no props of their own.

## Accessibility

The semantics come from v0's parts, and they follow the WAI-ARIA breadcrumb pattern.

- `EmBreadcrumbs` renders a `nav` landmark. Its `aria-label` is the `label` prop when given, then the `Breadcrumbs.label` locale key if v0's Locale plugin resolves one, then the English default.
- `EmBreadcrumbsList` renders an `ol` with an explicit `role="list"`, so the trail is announced as a list with a length.
- `EmBreadcrumbsLink` is a native anchor — focus, Enter activation and link announcement all come from the platform. No key handling is added anywhere in the compound.
- `EmBreadcrumbsPage` carries `aria-current="page"`, which is what tells a screen reader this crumb is the current location rather than a place to go.
- `EmBreadcrumbsDivider` is `aria-hidden`; separators are visual rhythm, not content.
- Crumbs collapsed by overflow are hidden with `display: none` and marked `inert`, which removes them from the accessibility tree *and* the tab order together — a collapsed crumb's link can never be a ghost tab stop.

One limit to know about: `EmBreadcrumbsEllipsis` is decorative on its own — `aria-hidden`, with its hidden-crumb `count` surfaced only as a slot prop for visual use. A truncated trail therefore gives assistive technology no signal that levels were dropped, and no way to reveal them. When that matters, place v0's `Breadcrumbs.Activator` inside the ellipsis: the same ellipsis element then leaves the hidden state, and the activator provides a native disclosure button with `aria-expanded` and a count-aware name.
