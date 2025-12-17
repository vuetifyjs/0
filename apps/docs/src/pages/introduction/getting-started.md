---
title: Getting Started
meta:
  - name: description
    content: Get started with Vuetify0 - headless UI primitives and composables for Vue 3. Build your own design system with unstyled, accessible components.
  - name: keywords
    content: vuetify0, getting started, installation, vue3, headless ui, composables
---

# Get started with Vuetify0

Vuetify0 provides headless UI primitives and composables for Vue 3. Components are unstyled and logic-focused, giving you complete control over styling while handling accessibility, keyboard navigation, and state management.

<DocsPageFeatures :frontmatter />

## Installation

Install `@vuetify/v0` with your preferred package manager:

```bash
pnpm add @vuetify/v0
# or npm install @vuetify/v0
# or yarn add @vuetify/v0
# or bun add @vuetify/v0
```

## Requirements

- Vue 3.3.0 or higher
- Node 20.19+ or 22+

## Quick Start

Import and use components directly - no plugin installation required:

```vue QuickStart
<script setup>
import { ExpansionPanel } from '@vuetify/v0'
import { ref } from 'vue'

const expanded = ref([])
</script>

<template>
  <ExpansionPanel.Root v-model="expanded" multiple>
    <ExpansionPanel.Item value="item-1">
      <ExpansionPanel.Activator>
        Section 1
      </ExpansionPanel.Activator>
      <ExpansionPanel.Content>
        Content for section 1
      </ExpansionPanel.Content>
    </ExpansionPanel.Item>
  </ExpansionPanel.Root>
</template>
```

Components are completely unstyled. Add your own classes using Tailwind, UnoCSS, or plain CSS.

## Package Exports

Import only what you need:

```ts
// Everything
import { ExpansionPanel, useSelection } from '@vuetify/v0'

// Components only
import { ExpansionPanel, Single, Group } from '@vuetify/v0/components'

// Composables only
import { useSelection, useTheme, useForm } from '@vuetify/v0/composables'

// Utilities only
import { isObject, isString } from '@vuetify/v0/utilities'
```

## What's Included

### Components

Compound components following the Root/Item pattern:

- [Atom](/components/atom) - Polymorphic foundation component
- [Selection](/components/selection) - Generic single/multi-selection
- [Single](/components/single) - Single-selection specialization
- [Group](/components/group) - Multi-selection with tri-state support
- [Step](/components/step) - Sequential navigation (steppers, wizards)
- [ExpansionPanel](/components/expansion-panel) - Accordion/collapsible panels
- [Pagination](/components/pagination) - Page navigation
- [Avatar](/components/avatar) - Image with fallback
- [Popover](/components/popover) - Toggle visibility (native popover API)

### Composables

The real power of Vuetify0. Build custom components with battle-tested logic:

**Foundation**
- [createContext](/composables/foundation/create-context) - Type-safe dependency injection
- [createTrinity](/composables/foundation/create-trinity) - Context triple pattern
- [createPlugin](/composables/foundation/create-plugin) - Vue plugin factory

**Selection & Registration**
- [useRegistry](/composables/registration/use-registry) - Foundation for collection management
- [useSelection](/composables/selection/use-selection) - Selection state with Set-based tracking
- [useSingle](/composables/selection/use-single) - Single-selection
- [useGroup](/composables/selection/use-group) - Multi-selection with tri-state
- [useStep](/composables/selection/use-step) - Navigation (first, last, next, prev)

**Forms & Validation**
- [useForm](/composables/forms/use-form) - Form validation and state

**Theming & Tokens**
- [useTheme](/composables/plugins/use-theme) - Theme management with CSS variables
- [useTokens](/composables/registration/use-tokens) - Design token registry with alias resolution
- [useLocale](/composables/plugins/use-locale) - i18n adapter

**Data & Collections**
- [usePagination](/composables/utilities/use-pagination) - Lightweight page navigation
- [useVirtual](/composables/utilities/use-virtual) - Virtual scrolling for large lists
- [useFilter](/composables/utilities/use-filter) - Reactive array filtering
- [useQueue](/composables/registration/use-queue) - FIFO queue with timeout
- [useTimeline](/composables/registration/use-timeline) - Undo/redo history

**Layout & Measurement**
- [useOverflow](/composables/utilities/use-overflow) - Container measurement and capacity
- [useBreakpoints](/composables/plugins/use-breakpoints) - Responsive breakpoint detection

**Observers & Events**
- [useResizeObserver](/composables/system/use-resize-observer) - Resize observation
- [useIntersectionObserver](/composables/system/use-intersection-observer) - Intersection observation
- [useMutationObserver](/composables/system/use-mutation-observer) - DOM mutation observation
- [useEventListener](/composables/system/use-event-listener) - Auto-cleanup event listeners
- [useKeydown](/composables/system/use-keydown) - Keyboard event handling

**Utilities**
- [useStorage](/composables/plugins/use-storage) - localStorage/sessionStorage adapter
- [useLogger](/composables/plugins/use-logger) - Logging adapter
- [useHydration](/composables/plugins/use-hydration) - SSR hydration helpers
- [useToggleScope](/composables/system/use-toggle-scope) - Conditional effect scope
- [useProxyModel](/composables/forms/use-proxy-model) - Selection to v-model bridge
- [useProxyRegistry](/composables/registration/use-proxy-registry) - Registry to reactive object
- [useFeatures](/composables/plugins/use-features) - Feature flags with variations
- [usePermissions](/composables/plugins/use-permissions) - RBAC/ABAC permissions

**Transformers**
- [toReactive](/composables/transformers/to-reactive) - Convert to reactive
- [toArray](/composables/transformers/to-array) - Normalize to array

## Next Steps

- [Explore Components](/components/) - See all available components
- [Browse Composables](/composables/) - Dive into the composables API
- [View Examples](https://github.com/vuetifyjs/0/tree/master/playground) - Check out the playground
