---
title: Building Frameworks - Using v0 as a Dependency
features:
  order: 6
  level: 2
meta:
  - name: description
    content: Learn how to use Vuetify0 as a foundation for building your own component framework. Covers behavior composables, component wrappers, plugins, SSR, and TypeScript patterns.
  - name: keywords
    content: vuetify0, component framework, headless ui, design system, Vue 3, dependency, library authoring
related:
  - /guide/fundamentals/core
  - /guide/fundamentals/composables
  - /guide/fundamentals/plugins
  - /composables/foundation/create-trinity
---

<script setup>
import TabsBasic from '@/examples/guide/building-frameworks/pattern-a/tabs-basic.vue'
import TabsBasicRaw from '@/examples/guide/building-frameworks/pattern-a/tabs-basic.vue?raw'
import TabsKeyboard from '@/examples/guide/building-frameworks/pattern-a/tabs-keyboard.vue'
import TabsKeyboardRaw from '@/examples/guide/building-frameworks/pattern-a/tabs-keyboard.vue?raw'
import Accordion from '@/examples/guide/building-frameworks/pattern-a/accordion.vue'
import AccordionRaw from '@/examples/guide/building-frameworks/pattern-a/accordion.vue?raw'
import Button from '@/examples/guide/building-frameworks/pattern-b/button.vue'
import ButtonRaw from '@/examples/guide/building-frameworks/pattern-b/button.vue?raw'
import Card from '@/examples/guide/building-frameworks/pattern-b/card.vue'
import CardRaw from '@/examples/guide/building-frameworks/pattern-b/card.vue?raw'
import Input from '@/examples/guide/building-frameworks/pattern-b/input.vue'
import InputRaw from '@/examples/guide/building-frameworks/pattern-b/input.vue?raw'
import PluginSetup from '@/examples/guide/building-frameworks/plugins/setup.vue'
import PluginSetupRaw from '@/examples/guide/building-frameworks/plugins/setup.vue?raw'
import HydrationGuard from '@/examples/guide/building-frameworks/ssr/hydration-guard.vue'
import HydrationGuardRaw from '@/examples/guide/building-frameworks/ssr/hydration-guard.vue?raw'
import TypeExtension from '@/examples/guide/building-frameworks/typescript/type-extension.vue'
import TypeExtensionRaw from '@/examples/guide/building-frameworks/typescript/type-extension.vue?raw'
import MyUiDemo from '@/examples/guide/building-frameworks/my-ui/demo.vue'
import MyUiDemoRaw from '@/examples/guide/building-frameworks/my-ui/demo.vue?raw'
</script>

# Building Frameworks

When building a component framework, you're often reimplementing the same patterns: selection state, keyboard navigation, form validation, and focus management. v0 provides these behaviors as headless primitives so you can focus on what makes your framework unique—its design language.

<DocsPageFeatures :frontmatter />

## Getting Started

### New Project

Use `vuetify0 create` to scaffold a new project with v0 pre-configured:

::: code-group no-filename

```bash pnpm
pnpm create vuetify0
```

```bash npm
npm create vuetify0
```

```bash yarn
yarn create vuetify0
```

```bash bun
bun create vuetify0
```

:::

### Existing Project

Add v0 to an existing Vue project:

::: code-group no-filename

```bash pnpm
pnpm add @vuetify/v0
```

```bash npm
npm install @vuetify/v0
```

```bash yarn
yarn add @vuetify/v0
```

```bash bun
bun add @vuetify/v0
```

:::

v0 uses [subpath exports](https://nodejs.org/api/packages.html#subpath-exports) for tree-shaking:

```ts
// Import everything
import { createSingle, Atom } from '@vuetify/v0'

// Or import specific modules
import { createSingle } from '@vuetify/v0/composables'
import { Atom } from '@vuetify/v0/components'
import type { ID } from '@vuetify/v0/types'
import { isObject } from '@vuetify/v0/utilities'
import { IN_BROWSER } from '@vuetify/v0/constants'
```

## Two Integration Patterns

This guide covers two approaches:

| Pattern | When to Use |
| - | - |
| **Pattern A: Behavior-Focused** | Need complex state (selection, navigation, validation) with full rendering control |
| **Pattern B: Component Wrappers** | Building styled components on top of v0's headless primitives |

> [!TIP]
> v0's composables are completely headless—they manage state and behavior without any DOM assumptions. This makes them ideal for building design systems that need complete control over markup and styling.

## Core Concepts

### Direct vs Context APIs

v0 composables offer two API surfaces. The direct API creates standalone instances—perfect for component-local state. The context API uses Vue's [provide/inject](https://vuejs.org/guide/components/provide-inject.html) for sharing state across component trees.

```ts
// Direct instance (component-local)
const tabs = createSingle({ mandatory: true })

// Context trinity (for dependency injection)
const [useTabs, provideTabs, defaultTabs] = createSingleContext()
```

> [!TIP]
> Start with the direct API. Only reach for contexts when you need to share state between parent and child components that can't communicate via props.

### The Ticket System

When you register items with a v0 registry, you get back "tickets"—plain objects that contain reactive properties and bound methods. Properties like `isSelected` are Vue refs that update automatically when selection state changes.

```ts
tabs.register({ id: 'home', value: 'Home' })
const ticket = tabs.get('home')

ticket.id                  // 'home' (static)
ticket.value               // 'Home' (static)
ticket.index               // 0 (static, position in registry)
ticket.isSelected          // Ref<boolean> - reactive!
ticket.isSelected.value    // true/false - access the value
ticket.toggle()            // Toggle selection
ticket.select()            // Select this item
```

### Template Iteration

Registry internals aren't directly exposed for template iteration. `useProxyRegistry` wraps a registry and provides reactive arrays that update when items change:

```vue playground
<script setup lang="ts">
  import { createSingle, useProxyRegistry } from '@vuetify/v0/composables'

  const tabs = createSingle({ mandatory: 'force', events: true })
  const proxy = useProxyRegistry(tabs)

  // proxy.values is a reactive array that updates when registry changes
  // proxy.keys and proxy.entries also available
</script>

<template>
  <button v-for="tab in proxy.values" :key="tab.id" @click="tab.toggle">
    {{ tab.value }}
  </button>
</template>
```

> [!TIP]
> The `events: true` option is required. `useProxyRegistry` listens for registry events to invalidate its cache.

## Pattern A: Behavior-Focused

Use v0's composables directly when you need complex state management—selection, navigation, validation—but want full control over rendering.

<DocsExample file="tabs-basic.vue" :code="TabsBasicRaw">
  <TabsBasic />
</DocsExample>

### Adding Keyboard Navigation

v0 composables handle state; you add the interaction layer:

<DocsExample file="tabs-keyboard.vue" :code="TabsKeyboardRaw">
  <TabsKeyboard />
</DocsExample>

### Multi-Selection with Groups

Use `createGroup` for checkbox-style multi-selection with tri-state support:

<DocsExample file="accordion.vue" :code="AccordionRaw">
  <Accordion />
</DocsExample>

> [!ASKAI] How does this compare to v0's built-in Tabs component?

## Pattern B: Component Wrappers

Wrap v0's headless components with your design system's styling. v0 handles behavior, accessibility, and keyboard navigation—you control the visual presentation.

### Polymorphic Elements

The `Atom` component provides polymorphic rendering via the `as` prop—render as any HTML element while keeping your component's API consistent:

<DocsExample file="button.vue" :code="ButtonRaw">
  <Button />
</DocsExample>

> [!TIP]
> The example uses [BEM naming](https://getbem.com/)—a convention for organizing CSS in component libraries. Blocks (`.my-button`), elements (`__icon`), and modifiers (`--filled`, `--primary`) create predictable, collision-free class names.

### Styling Headless Components

Wrap v0's compound components with custom CSS. The components expose data attributes like `data-state` for styling different states:

<DocsExample file="card.vue" :code="CardRaw">
  <Card />
</DocsExample>

### Form Components

v0's form components handle focus, keyboard interaction, and ARIA attributes. Apply your styles via classes:

<DocsExample file="input.vue" :code="InputRaw">
  <Input />
</DocsExample>

## Plugin Architecture

v0's plugins follow Vue's [plugin pattern](https://vuejs.org/guide/reusability/plugins.html) with additional structure for namespaced context provision.

<DocsExample file="setup.vue" :code="PluginSetupRaw">
  <PluginSetup />
</DocsExample>

> [!TIP]
> v0 plugins are designed to be order-independent. Each plugin gracefully handles missing dependencies by providing sensible fallbacks.

## SSR Safety

v0 is designed for universal rendering. Use the provided constants and composables to guard browser-only code:

```ts
import { useHydration, useWindowEventListener } from '@vuetify/v0'

// SSR-safe event listener (no-op on server, auto-cleanup)
useWindowEventListener('resize', handler)

// Reactive hydration state for conditional rendering
const { isHydrated } = useHydration()

// In templates: v-if="isHydrated"
```

The `isHydrated` shallowRef is `false` during SSR and becomes `true` after the root component mounts. This prevents hydration mismatches when rendering browser-dependent content.

<DocsExample file="hydration-guard.vue" :code="HydrationGuardRaw">
  <HydrationGuard />
</DocsExample>

## TypeScript Patterns

v0 uses generics extensively. When extending composables, provide your custom ticket and context types:

<DocsExample file="type-extension.vue" :code="TypeExtensionRaw">
  <TypeExtension />
</DocsExample>

Vue's [shallowReactive](https://vuejs.org/api/reactivity-advanced.html#shallowreactive) and [computed](https://vuejs.org/api/reactivity-core.html#computed) are used internally—understanding these helps when debugging reactivity issues.

## Complete Example: @example/my-ui

To see everything come together, we've included a complete example library that demonstrates the patterns in this guide.

<DocsExample file="demo.vue" :code="MyUiDemoRaw">
  <MyUiDemo />
</DocsExample>

The example package includes:

```
my-ui/
├── package.json          # Peer deps on @vuetify/v0 and vue
├── vite.config.ts        # Library build config
├── src/
│   ├── index.ts          # Public exports
│   ├── plugin.ts         # Vue plugin with v0 setup
│   └── components/
│       ├── MyButton.vue  # Atom wrapper (polymorphic)
│       ├── MyTabs.vue    # createSingle + keyboard nav
│       └── MyAccordion.vue # ExpansionPanel wrapper
```

View the full source in the [examples directory](https://github.com/vuetifyjs/0/tree/master/apps/docs/src/examples/guide/building-frameworks/my-ui).
