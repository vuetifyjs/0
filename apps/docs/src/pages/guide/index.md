---
title: Vuetify0 Guide - Build Your Own UI Library
meta:
  - name: description
    content: Comprehensive guide to building UI libraries with Vuetify0. Learn composables, components, theming, plugins, and accessibility patterns for Vue 3.
  - name: keywords
    content: vuetify0, guide, Vue 3, ui library, composables, theming, accessibility, design system
features:
  level: 1
related:
  - /composables
  - /components
  - /introduction/getting-started
---

# Guide

Learn v0's patterns and build headless UI systems. Start with [Getting Started](/introduction/getting-started) if you haven't installed v0 yet, or see [Using the Docs](/guide/essentials/using-the-docs) for navigation tips and AI assistance.

<DocsPageFeatures :frontmatter />

## Prerequisites

Before diving into the guides, ensure you're familiar with:

- **Required**: Vue 3 basics (ref, computed, provide/inject)
- **Helpful**: Composables pattern, TypeScript generics

## What's Different About v0

| Traditional Component Libraries | v0 Approach |
| - | - |
| Pre-styled, override with CSS | Zero styles - you own all styling |
| Props configure behavior | Composables expose reactive state |
| Component = black box | Component = transparent composition |
| Fight the framework | Build with the framework |

**The v0 Mental Model:**

- Components are **delivery mechanisms**, not behavior containers
- Logic lives in **composables** you can use independently
- **Trinity pattern**: `[use, provide, context]` - predictable, debuggable
- **Registry/Context pattern**: Parent-child coordination without prop drilling

## Learning Paths

### Track A: Fundamentals

For understanding the system architecture.

| Guide | What You'll Learn |
| - | - |
| [Core](/guide/fundamentals/core) | Trinity, Context, Registry patterns |
| [Components](/guide/fundamentals/components) | Component categories, Atom primitive, slot props |
| [Composables](/guide/fundamentals/composables) | Composables vs components, when to use each |
| [Plugins](/guide/fundamentals/plugins) | Using and creating Vue plugins |
| [Benchmarks](/guide/fundamentals/benchmarks) | Performance tiers, metrics, minimal reactivity tradeoffs |

### Track B: Features

For building production UIs.

| Guide | What You'll Learn |
| - | - |
| [Theming](/guide/features/theming) | CSS variables, design tokens, dark mode |
| [Accessibility](/guide/features/accessibility) | ARIA patterns, keyboard nav, testing |
| [Utilities](/guide/features/utilities) | Helper functions, type guards |

### Track C: Integration

See v0 patterns in production.

| Guide | What You'll Learn |
| - | - |
| [Nuxt 3](/guide/integration/nuxt) | SSR, auto-imports, theme persistence |
| [Building This Documentation](/guide/integration/building-docs) | How this site uses v0, UnoCSS, and vite-ssg |

> [!TIP]
> New to v0? Start with Track A. Already building? Jump to Track B as needed.

## Migrating to Headless

If you have an existing styled component library and want to adopt v0's headless approach:

### Strategy

1. **Keep your styled components** - They become thin wrappers around v0 logic
2. **Replace internal state** - Swap custom selection/toggle logic for v0 composables
3. **Expose v0's API** - Let consumers access the underlying composable if needed

### Example: Styled Tabs Component

**Before** (custom state management):

```vue collapse
<script setup lang="ts">
  import { shallowRef, computed } from 'vue'

  const tabs = ['Home', 'Profile', 'Settings']
  const activeIndex = shallowRef(0)

  function select(index: number) {
    activeIndex.value = index
  }

  function next() {
    activeIndex.value = (activeIndex.value + 1) % tabs.length
  }

  function prev() {
    activeIndex.value = (activeIndex.value - 1 + tabs.length) % tabs.length
  }

  const activeTab = computed(() => tabs[activeIndex.value])
</script>

<template>
  <div class="my-tabs">
    <button
      v-for="(tab, i) in tabs"
      :key="tab"
      :class="{ active: i === activeIndex }"
      @click="select(i)"
    >
      {{ tab }}
    </button>
    <div class="content">{{ activeTab }}</div>
  </div>
</template>
```

**After** (v0-powered):

```vue
<script setup lang="ts">
  import { createSingle } from '@vuetify/v0'

  const tabs = createSingle({ mandatory: true })

  // Bulk register tabs - first is auto-selected due to mandatory
  tabs.onboard([
    { id: 'home', value: 'Home' },
    { id: 'profile', value: 'Profile' },
    { id: 'settings', value: 'Settings' },
  ])
</script>

<template>
  <div class="my-tabs">
    <button
      v-for="tab in tabs.items"
      :key="tab.id"
      :class="{ active: tab.isSelected }"
      @click="tab.select"
    >
      {{ tab.value }}
    </button>
    <div class="content">{{ tabs.selectedValue }}</div>
  </div>
</template>
```

### What You Get

- **`mandatory`** auto-selects first registered item
- **Navigation** methods built-in: `next()`, `prev()`, `first()`, `last()`
- **Computed properties**: `selectedId`, `selectedIndex`, `selectedValue`
- **Ticket methods**: each item has `isSelected`, `select()`, `toggle()`
- **Disabled support** via `{ disabled: true }` on any ticket

### Benefits

- **Less code to maintain** - v0 handles edge cases
- **Consistent patterns** - All your components use the same selection primitives
- **Incremental adoption** - Migrate one component at a time

## Quick Reference

| Pattern | Use Case | Guide |
| - | - | - |
| `createContext` | Share state across component tree | [Core](/guide/fundamentals/core) |
| `createSelection` | Multi-select, toggles, radio groups | [Composables](/composables/selection/create-selection) |
| `createRegistry` | Dynamic child registration | [Core](/guide/fundamentals/core) |
| `Atom` component | Polymorphic base element | [Components](/guide/fundamentals/components) |
| `useTheme` | Theme switching, CSS variables | [Theming](/guide/features/theming) |
