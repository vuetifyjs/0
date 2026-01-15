---
title: Core - Foundation Systems for Vue 3
features:
  order: 1
  level: 3
meta:
  - name: description
    content: Explore Vuetify0's core architecture including createContext, createTrinity, and createPlugin factories. Build scalable apps with type-safe dependency injection.
  - name: keywords
    content: vuetify0, framework core, dependency injection, createContext, createTrinity, createPlugin, Vue 3
related:
  - /guide/fundamentals/plugins
  - /composables/foundation/create-context
  - /composables/foundation/create-trinity
  - /composables/registration/create-registry
---

# Core

v0's core architecture provides type-safe dependency injection and composable patterns. This page explains **how v0 works**. For creating plugins, see [Plugins Guide](/guide/fundamentals/plugins).

<DocsPageFeatures :frontmatter />

## Architecture Overview

```mermaid "Architecture Overview"
flowchart TD
    A[createContext] --> B[createTrinity]
    B --> C[createPlugin]

    A -.- A1["Type-safe provide/inject wrapper"]
    B -.- B1["[use, provide, context] tuple"]
    C -.- C1["Vue plugin factory"]
```

## The Trinity Pattern

The signature pattern of v0. Every composable returns a readonly 3-tuple:

```ts
const [useTheme, provideTheme, theme] = createThemeContext()

// 1. useTheme - Inject from ancestor
const theme = useTheme()

// 2. provideTheme - Provide to descendants
provideTheme()              // Use defaults
provideTheme(customTheme)   // Provide custom

// 3. theme - Direct access without DI
theme.cycle()  // Cycle through themes
```

### Why Three Elements?

| Element | Purpose |
| - | - |
| `useContext` | Consume in child components |
| `provideContext` | Provide from parent (defaults to built-in context) |
| `defaultContext` | Standalone access, testing, outside Vue |

> [!TIP]
> The third element (`defaultContext`) is useful for unit testing without mounting Vue components.

## createContext

Type-safe wrapper around Vue's provide/inject that **throws on missing context** (no silent undefined):

### Static Key Mode

```ts
const [useTheme, provideTheme] = createContext<ThemeContext>('v0:theme')

// Provider
provideTheme({ isDark: ref(false), toggle: () => {} })

// Consumer - throws if not provided
const theme = useTheme()
```

### Dynamic Key Mode

For nested contexts (panels within panels):

```ts
const [usePanel, providePanel] = createContext<PanelContext>()

// Provider with runtime key
providePanel('panel-1', context)

// Consumer with same key
const panel = usePanel('panel-1')
```

### Suffix Pattern

For parent-child context hierarchies:

```ts
const [useItem, provideItem] = createContext<ItemContext>({ suffix: 'item' })

provideItem('v0:panel', context)  // Provides to 'v0:panel:item'
useItem('v0:panel')               // Injects from 'v0:panel:item'
```

## Registry System

`createRegistry` is the foundational data structure. All selection, forms, and token composables extend it.

```ts
const registry = createRegistry()

// Register items
const ticket = registry.register({ id: 'item-1', value: 'First' })

// Lookup
registry.get('item-1')      // Get by ID
registry.browse('First')    // Get IDs by value
registry.lookup(0)          // Get ID by index

// Cleanup
registry.unregister('item-1')
```

### Ticket Structure

Every registered item is a "ticket":

```ts
interface RegistryTicket {
  id: ID,              // Unique identifier
  index: number,       // Position in registry
  value: unknown,      // Associated data
  valueIsIndex: boolean, // True if value wasn't explicitly set
}
```

### Extension Chain

```mermaid "Extension Chain"
flowchart LR
    R[createRegistry] --> S[createSelection]
    R --> T[createTokens]
    R --> F[useForm]
    S --> Si[createSingle]
    S --> G[createGroup]
    Si --> St[createStep]
```

| Composable | Extends | Adds |
| - | - | - |
| `createRegistry` | — | Base collection management |
| `createSelection` | Registry | `selectedIds` Set |
| `createSingle` | Selection | Single selection constraint |
| `createGroup` | Selection | Tri-state, batch ops |
| `createStep` | Single | Navigation (next/prev/first/last) |
| `createTokens` | Registry | Alias resolution |
| `useForm` | Registry | Validation |

## Selection System

### createSelection

Base multi-selection with Set-based tracking:

```ts
const selection = createSelection({ multiple: true })

selection.register({ id: 'a', value: 'Apple' })
selection.register({ id: 'b', value: 'Banana' })

selection.select('a')
selection.selectedIds  // Set { 'a' }
```

### createSingle

Auto-clears previous selection:

```ts
const tabs = createSingle({ mandatory: true })

tabs.onboard([
  { id: 'tab-1', value: 'Home' },
  { id: 'tab-2', value: 'About' },
])

tabs.select('tab-1')
tabs.select('tab-2')  // tab-1 auto-unselected
tabs.selectedId.value // 'tab-2'
```

### createGroup

Multi-select with tri-state:

```ts
const checkboxes = createGroup()

checkboxes.onboard([
  { id: 'a', value: 'Option A' },
  { id: 'b', value: 'Option B' },
  { id: 'c', value: 'Option C' },
])

checkboxes.select(['a', 'b'])
checkboxes.selectAll()
checkboxes.isMixed.value  // true when some (not all) selected
```

### createStep

Sequential navigation:

```ts
const wizard = createStep({ circular: false })

wizard.onboard([
  { id: 'step-1', value: 'Step 1' },
  { id: 'step-2', value: 'Step 2' },
  { id: 'step-3', value: 'Step 3' },
])

wizard.first()  // Select first step
wizard.next()   // Move forward
wizard.prev()   // Move backward
wizard.last()   // Jump to end
```

## Best Practices

### Naming Conventions

| Prefix | Purpose | Example |
| - | - | - |
| `use*` | Inject from context | `useTheme()` |
| `create*` | Factory returning instance | `createSelection()` |
| `create*Context` | Factory returning trinity | `createThemeContext()` |
| `create*Plugin` | Factory returning Vue plugin | `createThemePlugin()` |

### When to Use Each

| Need | Use |
| - | - |
| Share state in component tree | `provideContext` / `useContext` |
| App-wide singleton | `createPlugin` with `app.use()` |
| Standalone logic | Direct factory call |
| Testing | Trinity's third element |

> [!SUGGESTION] How do I handle scoped contexts for nested components without prop drilling?

## Frequently Asked Questions

::: faq
??? Why use createContext instead of Vue's provide/inject directly?

`createContext` adds three critical guarantees:

1. **Throws on missing context** — No silent `undefined` bugs
2. **Type inference** — Full TypeScript support without manual casting
3. **Consistent API** — Same pattern across all v0 composables

```ts
// Vue's provide/inject - silent failure
const theme = inject('theme') // undefined if not provided, no error

// createContext - explicit failure
const theme = useTheme() // throws: "Injection 'v0:theme' not found"
```

??? Can I nest contexts? What happens with the same key?

Yes. Each `provideContext` call creates a new scope. Children receive the nearest ancestor's value:

```mermaid "Context Nesting"
flowchart TD
    A["App (provideTheme: 'light')"] --> B["Page"]
    B --> C["Panel (provideTheme: 'dark')"]
    C --> D["Card (useTheme → 'dark')"]
    B --> E["Sidebar (useTheme → 'light')"]
```

```ts
// App.vue
provideTheme({ mode: 'light' })

// Panel.vue - creates nested scope
provideTheme({ mode: 'dark' })

// Card.vue inside Panel - gets 'dark'
const theme = useTheme() // { mode: 'dark' }

// Sidebar.vue outside Panel - gets 'light'
const theme = useTheme() // { mode: 'light' }
```

??? How do I test code that uses contexts without mounting Vue components?

Use the trinity pattern's third element—the default context instance:

```ts
import { createThemeContext } from '@vuetify/v0'

const [useTheme, provideTheme, defaultTheme] = createThemeContext()

// Unit test without Vue
test('theme cycling', () => {
  defaultTheme.cycle()
  expect(defaultTheme.current.value).toBe('dark')
})
```

For testing components that inject contexts, use `provideContext` in a wrapper:

```ts
import { mount } from '@vue/test-utils'

const wrapper = mount(MyComponent, {
  global: {
    provide: {
      'v0:theme': mockThemeContext,
    },
  },
})
```

??? When should I use static vs dynamic key mode?

| Mode | Use When | Example |
| - | - | - |
| **Static** | Singletons—one instance for the entire app | Theme, locale, breakpoints |
| **Dynamic** | Multiple instances of same type | Nested panels, tabs within tabs |

Static keys are ideal for app-wide singletons where you'll never need more than one instance. Dynamic keys let you create multiple independent contexts of the same type.

```ts
// Static - singleton theme for the app
const [useTheme, provideTheme] = createContext<ThemeContext>('v0:theme')

// Dynamic - multiple panels can coexist
const [usePanel, providePanel] = createContext<PanelContext>()
providePanel('panel-main', mainContext)
providePanel('panel-sidebar', sidebarContext)
```

??? What's the performance impact of contexts vs direct imports?

Negligible. Context injection is a single Map lookup at component creation—not per render:

```mermaid "Context Resolution"
flowchart LR
    A[Component mounts] --> B[inject lookup]
    B --> C[Cache reference]
    C --> D[Use cached ref in renders]
```

Contexts don't add reactivity overhead. The injected value is the same object reference whether you use `inject()` directly or `useContext()`.

??? How does the suffix pattern work for parent-child hierarchies?

The suffix pattern creates derived keys for related contexts. Useful when a child context depends on knowing its parent:

```ts
// Parent provides at 'v0:panel'
const [usePanel, providePanel] = createContext<PanelContext>('v0:panel')

// Item context with suffix - provides at 'v0:panel:item'
const [useItem, provideItem] = createContext<ItemContext>({ suffix: 'item' })

// In PanelItem.vue
provideItem('v0:panel', itemContext) // Actually provides to 'v0:panel:item'

// In nested content
const item = useItem('v0:panel') // Injects from 'v0:panel:item'
```

This avoids key collision between the panel and its items while maintaining the relationship.
:::
