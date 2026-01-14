---
title: Components Guide - Headless Vue 3 UI Primitives
features:
  order: 2
  level: 2
meta:
  - name: description
    content: Build accessible, customizable Vue 3 components with Vuetify0. Learn the compound component pattern, context injection, and v-model integration for headless UI.
  - name: keywords
    content: vuetify0, components, headless ui, compound pattern, accessibility, v-model, Vue 3, unstyled
related:
  - /guide/fundamentals/core
  - /guide/fundamentals/composables
  - /guide/features/accessibility
---

# Components

v0 components are Vue wrappers around composables. Composables hold logic, components provide Vue integration via slots, props, and emits.

<DocsPageFeatures :frontmatter />

## Component Philosophy

- **Headless**: Zero styling - you own all CSS
- **Slot-driven**: All customization through scoped slots
- **Accessible**: ARIA attributes via `attrs` object
- **Composable-backed**: Use components or composables directly

> [!TIP]
> Always spread the `attrs` object onto your elements. It contains ARIA attributes and data attributes for accessibility and styling.

> [!SUGGESTION] How do I add styling or CSS classes to headless components?

## Component Categories

| Category | Purpose | Examples |
| - | - | - |
| **Primitives** | Base building blocks | [Atom](/components/primitives/atom) |
| **Providers** | Pure state management, no DOM | [Selection](/components/providers/selection), [Single](/components/providers/single), [Group](/components/providers/group), [Step](/components/providers/step) |
| **Forms** | Form controls with accessibility | [Checkbox](/components/forms/checkbox) |
| **Semantic** | Meaningful HTML defaults | [Avatar](/components/semantic/avatar), [Pagination](/components/semantic/pagination) |
| **Disclosure** | Show/hide patterns | [Dialog](/components/disclosure/dialog), [ExpansionPanel](/components/disclosure/expansion-panel), [Popover](/components/disclosure/popover) |

## Atom: The Foundation

The `Atom` component is a polymorphic base element supporting any HTML tag:

```vue
<script setup lang="ts">
  function onClick() {
    console.log('clicked')
  }
</script>

<template>
  <!-- Render as button -->
  <Atom as="button" @click="onClick">Click me</Atom>

  <!-- Render as link -->
  <Atom as="a" href="/path">Navigate</Atom>

  <!-- Renderless mode - slot only -->
  <Atom :as="null" v-slot="{ attrs }">
    <MyCustomComponent v-bind="attrs" />
  </Atom>
</template>
```

### Rendering Modes

| Mode | Usage | Output |
| - | - | - |
| Element | `as="button"` | `<button>` with slot content |
| Renderless | `:as="null"` or `renderless` | Slot only, no wrapper |

## Slot Props Pattern

Every component exposes `attrs` in its default slot. Spread onto your element for behavior and accessibility:

```vue playground
<script setup lang="ts">
  import { Selection } from '@vuetify/v0'

  const items = ['Apple', 'Banana', 'Cherry']
</script>

<template>
  <Selection.Root>
    <Selection.Item v-for="item in items" v-slot="{ attrs, isSelected, toggle }">
      <button
        v-bind="attrs"
        :class="{ 'bg-primary': isSelected }"
        @click="toggle"
      >
        {{ item }}
      </button>
    </Selection.Item>
  </Selection.Root>
</template>
```

### Common Slot Props

| Component Type | Slot Props |
| - | - |
| Selection.Item | `attrs`, `isSelected`, `toggle`, `select`, `unselect` |
| Group.Item | `attrs`, `isSelected`, `isMixed`, `toggle` |
| ExpansionPanel.Activator | `attrs`, `isSelected`, `toggle` |
| Popover.Root | `id`, `isSelected`, `toggle` |
| Popover.Activator | `attrs`, `isOpen` |
| Popover.Content | `attrs`, `isOpen` |

### Data Attributes

Components emit data attributes for CSS styling:

```css
[data-selected] { background: var(--primary); }
[data-disabled] { opacity: 0.5; }
[data-mixed] { /* tri-state checkbox */ }
[data-popover-open] { /* popover is visible */ }
```

## Component Reference

### Primitives

- [Atom](/components/primitives/atom) — Polymorphic base element

### Providers

- [Selection](/components/providers/selection) — Multi-selection state
- [Single](/components/providers/single) — Single-selection state
- [Group](/components/providers/group) — Multi-select with tri-state
- [Step](/components/providers/step) — Sequential navigation

### Forms

- [Checkbox](/components/forms/checkbox) — Standalone/group checkbox with tri-state

### Semantic

- [Avatar](/components/semantic/avatar) — Image with fallback
- [Pagination](/components/semantic/pagination) — Page navigation

### Disclosure

- [Dialog](/components/disclosure/dialog) — Modal dialog with focus management
- [ExpansionPanel](/components/disclosure/expansion-panel) — Accordion pattern
- [Popover](/components/disclosure/popover) — Floating content
