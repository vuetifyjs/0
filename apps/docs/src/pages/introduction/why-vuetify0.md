---
title: Why Vuetify0 - Choosing Your Vue UI Foundation
meta:
  - name: description
    content: Why choose Vuetify0 for your Vue project. Compare v0 headless composables with Vuetify 3, Reka UI, Ark UI, and VueUse for building design systems.
  - name: keywords
    content: vuetify0, headless ui, comparison, reka ui, ark ui, vueuse, vuetify, why
features:
  order: 1.5
  level: 1
related:
  - /introduction/getting-started
  - /introduction/frequently-asked
  - /guide/fundamentals/composables
---

# Why Vuetify0

<DocsPageFeatures :frontmatter />

Choosing a UI foundation is one of the most consequential decisions in a Vue project. This guide compares v0 with other popular options to help you decide.

Use the filter to show content matching your experience level: <AppSkillFilter />

## Why v0

Vuetify0 comes from the creators of [Vuetify](https://vuetifyjs.com)—the most popular Vue component framework with **40K+ GitHub stars**, **2M+ weekly downloads**, and **10+ years** of production use. This isn't a side project or experiment.

### What You Get

| | Feature | Description |
|:-:|---------|-------------|
| <AppIcon icon="vuetify" :size="20" /> | **Battle-tested patterns** | Selection, registration, and theming systems derived from Vuetify's core patterns. Vuetify itself will be refactored to use Vuetify0 under the hood. |
| <AppIcon icon="vuetify-create" :size="20" /> | **Quick scaffolding** | Get started in seconds with [Vuetify Create](https://github.com/vuetifyjs/create). One command sets up your project with v0 pre-configured and ready to build. |
| <AppIcon icon="vuetify-play" :size="20" /> | **Interactive playground** | Every example runs live in [Vuetify Play](https://play.vuetifyjs.com). Edit code, see results instantly, and share your experiments with a single link. |
| <AppIcon icon="vuetify-mcp" :size="20" /> | **AI-powered assistance** | First-class [MCP server](/guide/tooling/vuetify-mcp) for Claude and other AI assistants. Get accurate answers about v0 APIs without hallucinations. |
| <AppIcon icon="vuetify-cli" :size="20" /> | **Developer tooling** | Dedicated CLI for common workflows—component generation, project upgrades, and debugging utilities. Streamline your development process. |

### Composable-First Architecture

Most headless libraries give you components. v0 gives you **composables that optionally have components**. Use the logic without any rendering overhead:

```ts
import { createSelection } from '@vuetify/v0'

// Pure logic - no components needed
const selection = createSelection()

// Register items first
selection.register({ id: 'item-1', value: 'Item 1' })
selection.register({ id: 'item-2', value: 'Item 2' })

// Then select
selection.select('item-1')
selection.select('item-2')

console.log(selection.selected.value) // ['item-1', 'item-2']
console.log(selection.isSelected('item-1')) // true
```

Compare this to other libraries where you must wrap everything in components to access selection state.

### The Trinity Pattern

v0's [Trinity pattern](/guide/fundamentals/core#the-trinity-pattern) provides three layers that work together:

1. **Context** — Dependency injection via `provide`/`inject`
2. **Composable** — Reactive logic you can use anywhere
3. **Component** — Optional rendering layer with slot props

This means the same selection logic powers a chip group, a listbox, tabs, or your custom component—without any wrappers.

## Quick Comparison

| Library | Type | Components | Best For |
|---------|------|------------|----------|
| <span class="text-nowrap">[**Vuetify0**](/)</span> | Headless composables + components | 10+ (growing) | Custom design systems, composable logic |
| <span class="text-nowrap">[Vuetify 3](https://vuetifyjs.com)</span> | Styled Material Design | 80+ | Full-featured apps with Material Design |
| <span class="text-nowrap">[Reka UI](https://reka-ui.com)</span> | Headless components (formerly Radix Vue) | 40+ | Nuxt UI users, Radix-style patterns |
| <span class="text-nowrap">[Ark UI](https://ark-ui.com)</span> | Headless (state machines) | 45+ | Multi-framework projects |
| <span class="text-nowrap">[VueUse](https://vueuse.org)</span> | Utility composables | 200+ | Browser APIs, not UI components |

## When to Choose Each

### Choose Vuetify 3 when:

- You want [Material Design](https://m3.material.io/) out of the box
- You need 80+ production-ready styled components
- You prefer convention over configuration
- You're building a standard business application

### Choose Vuetify0 when:

- Building a **custom design system** (not Material Design)
- You need composable logic **without component wrappers**
- You want full control over markup and styling
- You're already using Vuetify and need headless pieces
- You value Vue-native patterns over React ports

### Choose Reka UI when:

- You need **40+ headless components** now
- You're using [Nuxt UI](https://ui.nuxt.com) as your foundation
- You're comfortable with Radix-style APIs (Reka is the Vue port of Radix, formerly called Radix Vue)
- You want the [shadcn-vue](https://shadcn-vue.com) ecosystem

### Choose Ark UI when:

- Building for **multiple frameworks** (Vue + React + Solid)
- You prefer state machine predictability ([Zag.js](https://zagjs.com))
- You need components v0 doesn't have yet (e.g., color picker, tree view)

### Choose VueUse when:

- You need **utility composables**, not UI components
- Browser APIs, sensors, animations, state utilities
- VueUse complements v0—use them together

## Feature Comparison

| Feature | <span class="text-nowrap">v0</span> | <span class="text-nowrap">Vuetify</span> | <span class="text-nowrap">Reka UI</span> | <span class="text-nowrap">Ark UI</span> |
|---------|:--:|:--:|:--:|:--:|
| Unstyled/headless | <AppIcon icon="success" class="text-success" /> | <AppIcon icon="close" class="text-error" /> | <AppIcon icon="success" class="text-success" /> | <AppIcon icon="success" class="text-success" /> |
| Composable-only usage | <AppIcon icon="success" class="text-success" /> | <AppIcon icon="close" class="text-error" /> | <AppIcon icon="close" class="text-error" /> | <AppIcon icon="close" class="text-error" /> |
| Vue-native design | <AppIcon icon="success" class="text-success" /> | <AppIcon icon="success" class="text-success" /> | Radix port | Zag.js |
| TypeScript | Full | Full | Full | Full |
| SSR/Nuxt support | <AppIcon icon="success" class="text-success" /> | <AppIcon icon="success" class="text-success" /> | <AppIcon icon="success" class="text-success" /> | <AppIcon icon="success" class="text-success" /> |
| Theming system | CSS variables | SASS + CSS | <AppIcon icon="close" class="text-error" /> | <AppIcon icon="close" class="text-error" /> |
| Form validation | Built-in | Built-in | <AppIcon icon="close" class="text-error" /> | Field context |
| Selection patterns | Advanced | Advanced | Basic | Basic |
| Component count | ~15 | 80+ | 40+ | 45+ |

## v0 Roadmap

v0 is actively growing. The initial release focuses on core abstractions—the patterns that power Vuetify's most complex components:

| Version | Focus | Status |
|---------|-------|--------|
| <AppLink to="/roadmap?milestone=v0.1.0">**v0.1.x**</AppLink> | Core patterns (selection, registry, theming, forms) | Current |
| <AppLink to="/roadmap?milestone=v0.2.0">**v0.2.0**</AppLink> | Expanded component library | Planned |
| <AppLink to="/roadmap?milestone=v1.0.0">**v1.0**</AppLink> | Complete headless package | Target 2026 |

If you need 40+ components today, consider Reka UI or Ark UI. If you're building a design system and want the strongest foundation for selection, forms, and composition patterns, v0 is the right choice—and more components are coming.

> [!TIP]
> **What about PrimeVue?** [PrimeVue](https://primevue.org) offers 80+ components with an [unstyled mode](https://primevue.org/theming/unstyled/). It's a great option if you want a full-featured library that can be stripped down, but it's not headless-first—the architecture is designed around styled components with unstyled as an option.

## Using v0 with Vuetify

v0 and Vuetify share the same DNA. You can use v0 composables inside a Vuetify application:

```vue collapse
<script setup lang="ts">
  import { VBtn, VCard } from 'vuetify/components'
  import { createSelection } from '@vuetify/v0'

  const selection = createSelection({ multiple: true })

  const items = [
    { id: 1, title: 'Option A' },
    { id: 2, title: 'Option B' },
    { id: 3, title: 'Option C' },
  ]
</script>

<template>
  <VCard title="Select Options">
    <div class="d-flex ga-2 pa-4">
      <VBtn
        v-for="item in items"
        :key="item.id"
        :color="selection.isSelected(item.id) ? 'primary' : undefined"
        :variant="selection.isSelected(item.id) ? 'flat' : 'outlined'"
        @click="selection.toggle(item.id)"
      >
        {{ item.title }}
      </VBtn>
    </div>
  </VCard>
</template>
```

This lets you leverage v0's selection patterns while keeping Vuetify's styled components.

> [!INFO]
> After Vuetify 4 releases, Vuetify 5 will immediately begin implementing Vuetify0 into key parts of its internal functionality. See the [roadmap](/roadmap) for more details.

## Summary

| If you need... | Choose |
|----------------|--------|
| Material Design, batteries included | Vuetify 3 |
| Custom design system, full control | v0 |
| Most components, fastest start | Reka UI |
| Multi-framework consistency | Ark UI |
| Utility composables | VueUse (pairs with any) |

Still unsure? Start with the [Getting Started](/introduction/getting-started) guide and try v0's selection patterns. If they click, you're in the right place.
