---
title: Breadcrumbs - Responsive Navigation Trail for Vue 3
meta:
- name: description
  content: Responsive breadcrumb navigation with automatic overflow detection, ellipsis collapse, custom dividers, and WAI-ARIA compliance. Compound component pattern for Vue 3.
- name: keywords
  content: breadcrumbs, navigation, Vue 3, headless, accessibility, ARIA, overflow, responsive, compound component
features:
  category: Component
  label: 'C: Breadcrumbs'
  github: /components/Breadcrumbs/
  renderless: false
  level: 2
related:
  - /composables/utilities/create-breadcrumbs
  - /components/semantic/pagination
---

# Breadcrumbs

A headless component for creating responsive breadcrumb navigation with proper ARIA support.

<DocsPageFeatures :frontmatter />

## Usage

The Breadcrumbs component provides a compound component pattern for building navigation trails. It uses the [createBreadcrumbs](/composables/utilities/create-breadcrumbs) and [createOverflow](/composables/utilities/create-overflow) composable internally.

::: example
/components/breadcrumbs/basic
:::

## Anatomy

```vue Anatomy playground
<script setup lang="ts">
  import { Breadcrumbs } from '@vuetify/v0'
</script>

<template>
  <Breadcrumbs.Root>
    <Breadcrumbs.List>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
      </Breadcrumbs.Item>

      <Breadcrumbs.Divider />

      <Breadcrumbs.Ellipsis />

      <Breadcrumbs.Divider />

      <Breadcrumbs.Item>
        <Breadcrumbs.Link href="/about">About</Breadcrumbs.Link>
      </Breadcrumbs.Item>

      <Breadcrumbs.Divider />

      <Breadcrumbs.Item>
        <Breadcrumbs.Page>Current</Breadcrumbs.Page>
      </Breadcrumbs.Item>
    </Breadcrumbs.List>
  </Breadcrumbs.Root>
</template>
```

## Architecture

The Root component composes three internal systems: [createBreadcrumbs](/composables/utilities/create-breadcrumbs) for navigation state, [createGroup](/composables/selection/create-group) for visibility tracking, and [createOverflow](/composables/utilities/create-overflow) for width measurement.

```mermaid "Breadcrumbs Architecture"
flowchart TD
  Root["Breadcrumbs.Root"]
  Breadcrumbs["createBreadcrumbs"]
  Group["createGroup"]
  Overflow["createOverflow"]

  Root --> Breadcrumbs
  Root --> Group
  Root --> Overflow
  Overflow -->|"capacity"| Group
```

The Root creates three internal composables: `createBreadcrumbs` manages the navigation model, `createGroup` tracks item visibility, and `createOverflow` measures widths to determine how many items fit.

## Examples

::: example
/components/breadcrumbs/overflow

### Responsive Overflow

Breadcrumb trails can easily exceed their container in sidebars, mobile viewports, or resizable panels. Rather than wrapping or clipping, the Root measures each item's width via [createOverflow](/composables/utilities/create-overflow) and hides items from the beginning when space runs out. The Ellipsis component appears automatically to indicate hidden items.

**Key patterns:**

- Items without an `href` render as `Breadcrumbs.Page` with `aria-current="page"`
- The Ellipsis is placed after the first item (`v-if="index === 1"`) so the root crumb always stays visible
- `shrink-0` and `whitespace-nowrap` on items prevent text from wrapping before overflow kicks in

Drag the slider to shrink the container and watch items collapse into the ellipsis.

:::

::: example
/components/breadcrumbs/AppBreadcrumbs.vue
/components/breadcrumbs/useBreadcrumbItems.ts

### Route-Derived Breadcrumbs

In most applications, breadcrumbs mirror the current URL. Rather than manually maintaining a list of items, this example derives the trail reactively from [useRoute()](https://router.vuejs.org/api/interfaces/Router.html#currentRoute). When no `items` prop is provided, `AppBreadcrumbs` automatically uses the route-derived trail.

**File breakdown:**

| File | Role |
|------|------|
| `useBreadcrumbItems.ts` | Composable that reads [route.path](https://router.vuejs.org/api/interfaces/RouteLocationNormalizedLoaded.html#path), splits it into segments, and returns a reactive breadcrumb array |
| `AppBreadcrumbs.vue` | Reusable component — falls back to `useBreadcrumbItems` when no `items` prop is provided |

**Key patterns:**

- The composable wraps its logic in a `computed` so the trail updates automatically when [route.path](https://router.vuejs.org/api/interfaces/RouteLocationNormalizedLoaded.html#path) changes during navigation
- Path segments are title-cased with a simple regex (`replace(/\b\w/g, ...)`)
- Segments that don't resolve to a real route (like category folders) render as plain text instead of links
- The last segment omits `href`, which causes `AppBreadcrumbs` to render it as a `Breadcrumbs.Page` with `aria-current="page"`
- Pass explicit `items` for static trails, or omit the prop to derive from the current route

Navigate to a different page in the docs and watch the breadcrumb trail update.

:::

<DocsApi />

## Recipes

Common patterns for integrating Breadcrumbs into your application.

### Links and Current Page

Use `Breadcrumbs.Link` for navigable items and `Breadcrumbs.Page` for the current (last) item. Page automatically applies `aria-current="page"`.

```vue
<template>
  <Breadcrumbs.Item>
    <Breadcrumbs.Link href="/products">Products</Breadcrumbs.Link>
  </Breadcrumbs.Item>

  <!-- Last item uses Page instead of Link -->
  <Breadcrumbs.Item>
    <Breadcrumbs.Page>Current</Breadcrumbs.Page>
  </Breadcrumbs.Item>
</template>
```

### With Vue Router

Use the `as` prop to render `Breadcrumbs.Link` as a `RouterLink`:

```vue
<template>
  <Breadcrumbs.Item>
    <Breadcrumbs.Link :as="RouterLink" to="/products">
      Products
    </Breadcrumbs.Link>
  </Breadcrumbs.Item>
</template>
```

### Slot Props

The Root exposes navigation state and methods through its default slot:

```vue
<template>
  <Breadcrumbs.Root v-slot="{ isOverflowing, depth, isRoot, first, prev, select }">
    <!-- Use navigation methods and overflow state -->
  </Breadcrumbs.Root>
</template>
```

### Custom Ellipsis

Override the ellipsis globally on Root or per-instance:

```vue
<template>
  <Breadcrumbs.Root ellipsis="[more]">
    <!-- Ellipsis shows "[more]" instead of default -->
  </Breadcrumbs.Root>
</template>
```
