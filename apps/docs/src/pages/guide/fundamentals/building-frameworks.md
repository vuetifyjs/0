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

# Building Frameworks

When building a component framework, you're often reimplementing the same patterns: selection state, keyboard navigation, form validation, and focus management. v0 provides these behaviors as headless primitives so you can focus on what makes your framework unique—its design language.

<DocsPageFeatures :frontmatter />

## Getting Started

### New Project

Use `vuetify0 create` to scaffold a new project with v0 pre-configured:

::: code-group

```bash pnpm
pnpm create vuetify0
```

```bash npm
npm create vuetify0
```

```bash bun
bun create vuetify0
```

:::

### Existing Project

Add v0 to an existing Vue project:

```bash
pnpm add @vuetify/v0
```

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

When you register items with a v0 registry, you get back "tickets"—reactive objects with built-in methods. This follows Vue's [composables pattern](https://vuejs.org/guide/reusability/composables.html) where behavior is encapsulated alongside state.

```ts
tabs.register({ id: 'home', value: 'Home' })
const ticket = tabs.get('home')

ticket.id          // 'home'
ticket.value       // 'Home'
ticket.index       // 0
ticket.isSelected  // Ref<boolean>
ticket.toggle()    // Toggle selection
ticket.select()    // Select this item
```

### Template Iteration

Registry collections are Maps, which don't iterate well in Vue templates. Use `useProxyRegistry` to transform them into reactive iterables:

```ts
import { createSingle, useProxyRegistry } from '@vuetify/v0/composables'

const tabs = createSingle({ mandatory: 'force' })
const proxy = useProxyRegistry(tabs)

// Now iterate in template: v-for="tab in proxy.values"
```

## Pattern A: Behavior-Focused

Use v0's composables directly when you need complex state management—selection, navigation, validation—but want full control over rendering.

<DocsExample file="guide/building-frameworks/pattern-a/tabs-basic" />

### Adding Keyboard Navigation

v0 composables handle state; you add the interaction layer:

<DocsExample file="guide/building-frameworks/pattern-a/tabs-keyboard" />

### Multi-Selection with Groups

Use `createGroup` for checkbox-style multi-selection with tri-state support:

<DocsExample file="guide/building-frameworks/pattern-a/accordion" />

> [!SUGGESTION] Want to see how this compares to using v0's built-in components?
> Check the [Tabs component](/components/disclosure/tabs) for a pre-built solution with keyboard navigation and ARIA included.

## Pattern B: Component Wrappers

Wrap v0's headless components with your design system's styling. v0 handles behavior, accessibility, and keyboard navigation—you control the visual presentation.

### Polymorphic Elements

The `Atom` component provides polymorphic rendering via the `as` prop—render as any HTML element while keeping your component's API consistent:

<DocsExample file="guide/building-frameworks/pattern-b/button" />

### Styling Headless Components

Wrap v0's compound components with custom CSS. The components expose data attributes like `data-state` for styling different states:

<DocsExample file="guide/building-frameworks/pattern-b/card" />

### Form Components

v0's form components handle focus, keyboard interaction, and ARIA attributes. Apply your styles via classes:

<DocsExample file="guide/building-frameworks/pattern-b/input" />

## Plugin Architecture

v0's plugins follow Vue's [plugin pattern](https://vuejs.org/guide/reusability/plugins.html) with additional structure for namespaced context provision.

<DocsExample file="guide/building-frameworks/plugins/setup" />

> [!TIP]
> v0 plugins are designed to be order-independent. Each plugin gracefully handles missing dependencies by providing sensible fallbacks.

## SSR Safety

v0 is designed for universal rendering. Use the provided constants and composables to guard browser-only code:

```ts
import { IN_BROWSER } from '@vuetify/v0/constants'
import { useHydration } from '@vuetify/v0/composables'

// Static check for browser environment
if (IN_BROWSER) {
  window.addEventListener('resize', handler)
}

// Reactive hydration state
const { isHydrated } = useHydration()

// In templates: v-if="isHydrated"
```

The `isHydrated` ref is `false` during SSR and becomes `true` after the root component mounts. This prevents hydration mismatches when rendering browser-dependent content.

<DocsExample file="guide/building-frameworks/ssr/hydration-guard" />

## TypeScript Patterns

v0 uses generics extensively. When extending composables, provide your custom ticket and context types:

<DocsExample file="guide/building-frameworks/typescript/type-extension" />

Vue's [shallowReactive](https://vuejs.org/api/reactivity-advanced.html#shallowreactive) and [computed](https://vuejs.org/api/reactivity-core.html#computed) are used internally—understanding these helps when debugging reactivity issues.

## Complete Example: @example/my-ui

To see everything come together, we've included a complete example library that demonstrates the patterns in this guide.

<DocsExample file="guide/building-frameworks/my-ui/demo" />

The example package includes:

```
my-ui/
├── package.json          # Peer deps on @vuetify/v0 and vue
├── src/
│   ├── index.ts          # Public exports
│   ├── plugin.ts         # Vue plugin with v0 setup
│   └── components/
│       ├── MyButton.vue  # Atom wrapper (polymorphic)
│       ├── MyTabs.vue    # createSingle + keyboard nav
│       └── MyAccordion.vue # ExpansionPanel wrapper
```

View the full source in the [examples directory](https://github.com/vuetifyjs/0/tree/master/apps/docs/src/examples/guide/building-frameworks/my-ui).

## Next Steps

- Explore [createSingle](/composables/selection/create-single) for single-selection patterns
- Learn about [createGroup](/composables/selection/create-group) for multi-selection with tri-state
- See [createStep](/composables/selection/create-step) for wizard/stepper navigation
- Review [Atom](/components/primitives/atom) for polymorphic rendering
