---
title: Framework Core - Foundation Systems for Vue 3
meta:
  - name: description
    content: Explore Vuetify0's core architecture including createContext, createTrinity, and createPlugin factories. Build scalable Vue 3 apps with type-safe dependency injection.
  - name: keywords
    content: vuetify0, framework core, dependency injection, createContext, createTrinity, createPlugin, Vue 3
related:
  - /guide/plugins
  - /composables/foundation/create-context
  - /composables/foundation/create-trinity
  - /composables/registration/use-registry
---

# Framework Core

v0's core architecture provides type-safe dependency injection and composable patterns. This page explains **how v0 works**. For creating plugins, see [Plugins Guide](/guide/plugins).

<DocsPageFeatures :frontmatter />

## Architecture Overview

```
createContext ─── Type-safe provide/inject wrapper
      │
      └──► createTrinity ─── [use, provide, context] tuple
                │
                └──► createPlugin ─── Vue plugin factory
```

## The Trinity Pattern

The signature pattern of v0. Every composable returns a readonly 3-tuple:

```ts
const [useTheme, provideTheme, defaultTheme] = createThemeContext()

// 1. useTheme - Inject from ancestor
const theme = useTheme()

// 2. provideTheme - Provide to descendants
provideTheme()              // Use defaults
provideTheme(customTheme)   // Provide custom

// 3. defaultTheme - Direct access without DI
defaultTheme.toggle()
```

### Why Three Elements?

| Element | Purpose |
| - | - |
| `useContext` | Consume in child components |
| `provideContext` | Provide from parent (defaults to built-in context) |
| `defaultContext` | Standalone access, testing, outside Vue |

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

`useRegistry` is the foundational data structure. All selection, forms, and token composables extend it.

```ts
const registry = useRegistry()

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
  id: ID           // Unique identifier
  index: number    // Position in registry
  value: unknown   // Associated data
}
```

### Extension Chain

```
useRegistry ─── Base collection management
      │
      ├──► useSelection ─── + selectedIds Set
      │         │
      │         ├──► useSingle ─── Single selection
      │         │         │
      │         │         └──► useStep ─── + navigation
      │         │
      │         └──► useGroup ─── + tri-state, batch ops
      │
      ├──► useTokens ─── + alias resolution
      │
      └──► useForm ─── + validation
```

## Selection System

### useSelection

Base multi-selection with Set-based tracking:

```ts
const selection = createSelection({ multiple: true })

selection.register({ id: 'a', value: 'Apple' })
selection.register({ id: 'b', value: 'Banana' })

selection.select('a')
selection.selectedIds  // Set { 'a' }
```

### useSingle

Auto-clears previous selection:

```ts
const tabs = createSingle({ mandatory: true })

tabs.select('tab-1')
tabs.select('tab-2')  // tab-1 auto-unselected
tabs.selectedId       // 'tab-2'
```

### useGroup

Multi-select with tri-state:

```ts
const checkboxes = createGroup()

checkboxes.select(['a', 'b'])
checkboxes.selectAll()
checkboxes.isMixed  // true when some (not all) selected
```

### useStep

Sequential navigation:

```ts
const wizard = createStep({ circular: false })

wizard.next()   // Move forward
wizard.prev()   // Move backward
wizard.first()  // Jump to start
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

<DocsRelated :frontmatter />
