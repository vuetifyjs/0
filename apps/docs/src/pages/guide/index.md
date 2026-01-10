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

Learn v0's patterns and build headless UI systems. Start with [Getting Started](/introduction/getting-started) if you haven't installed v0 yet, or see [Using the Docs](/guide/using-the-docs) for navigation tips and AI assistance.

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

### Track A: Core Concepts

For understanding the system architecture.

| Guide | What You'll Learn |
| - | - |
| [Core](/guide/core) | Trinity, Context, Registry patterns |
| [Components](/guide/components) | Component categories, Atom primitive, slot props |
| [Plugins](/guide/plugins) | Using and creating Vue plugins |

### Track B: Features & Polish

For building production UIs.

| Guide | What You'll Learn |
| - | - |
| [Theming](/guide/theming) | CSS variables, design tokens, dark mode |
| [Accessibility](/guide/accessibility) | ARIA patterns, keyboard nav, testing |
| [Utilities](/guide/utilities) | Helper functions, type guards |

### Track C: Real-World Application

See v0 patterns in production.

| Guide | What You'll Learn |
| - | - |
| [Building This Documentation](/guide/building-docs) | How this site uses v0, UnoCSS, and vite-ssg |

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

```vue
<script setup lang="ts">
  import { shallowRef } from 'vue'

  const active = shallowRef(0)

  function select (i: number) {
    active.value = i
  }
</script>
```

**After** (v0-powered):

```vue
<script setup lang="ts">
  import { shallowRef } from 'vue'
  import { createSingle } from '@vuetify/v0'

  const tabs = shallowRef(createSingle({ mandatory: true }))

  // Expose for advanced consumers
  defineExpose({ tabs })
</script>

<template>
  <div class="my-tabs">
    <slot :tabs="tabs" />
  </div>
</template>
```

### Benefits

- **Less code to maintain** - v0 handles edge cases (keyboard nav, ARIA, etc.)
- **Consistent patterns** - All your components use the same selection/toggle primitives
- **Incremental adoption** - Migrate one component at a time

## Quick Reference

| Pattern | Use Case | Guide |
| - | - | - |
| `createContext` | Share state across component tree | [Core](/guide/core) |
| `createSelection` | Multi-select, toggles, radio groups | [Composables](/composables/selection/create-selection) |
| `createRegistry` | Dynamic child registration | [Core](/guide/core) |
| `Atom` component | Polymorphic base element | [Components](/guide/components) |
| `useTheme` | Theme switching, CSS variables | [Theming](/guide/theming) |

