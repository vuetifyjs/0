# Using @vuetify/v0

Headless Vue 3 composables and components. Logic-focused primitives for building design systems.

## When to Use This Skill

- Building UI with v0 composables
- Integrating v0 components into your app
- Understanding v0 patterns (Registry, Selection, Trinity)

## Installation

```bash
pnpm add @vuetify/v0
# or
npm install @vuetify/v0
```

## Quick Reference

### Core Composables

| Composable | Purpose | Example |
|------------|---------|---------|
| `useTheme` | Theme management with CSS variables | Dark mode, custom themes |
| `useLocale` | i18n with interpolation | Multi-language support |
| `useBreakpoints` | Responsive breakpoint detection | Mobile-first layouts |
| `useStorage` | Reactive localStorage/sessionStorage | Persisted state |
| `useFilter` | Array filtering with search | Search/filter UI |
| `usePagination` | Page navigation | Paginated lists |
| `useVirtual` | Virtual scrolling | Large lists |
| `createForm` | Form validation with async rules | Form handling |
| `createQueue` | FIFO queue management | Notifications/toasts |

### Selection System

```ts
import { useSelection, useSingle, useGroup, useStep } from '@vuetify/v0'

// Multi-select
const selection = useSelection({ mandatory: true })

// Single-select (radio-like)
const single = useSingle()

// Multi-select with tri-state (checkbox groups)
const group = useGroup()

// Stepper navigation
const stepper = useStep()
```

### Event & Observer Composables

```ts
import {
  useEventListener,
  useClickOutside,
  useHotkey,
  useResizeObserver,
  useIntersectionObserver,
} from '@vuetify/v0'

// Auto-cleanup event listener
useEventListener(window, 'scroll', onScroll)

// Click outside detection
useClickOutside(elementRef, onClickOutside)

// Keyboard shortcuts
useHotkey('ctrl+s', onSave)

// Element resize
useResizeObserver(elementRef, ({ width, height }) => { ... })

// Intersection (lazy loading)
useIntersectionObserver(elementRef, ([entry]) => { ... })
```

## Components

v0 components follow the **compound pattern** — a Root provides context, Items consume it:

```vue
<script setup>
import { SelectionRoot, SelectionItem } from '@vuetify/v0'

const selected = ref(null)
</script>

<template>
  <SelectionRoot v-model="selected">
    <SelectionItem value="a">Option A</SelectionItem>
    <SelectionItem value="b">Option B</SelectionItem>
    <SelectionItem value="c">Option C</SelectionItem>
  </SelectionRoot>
</template>
```

### Available Components

| Component | Use Case |
|-----------|----------|
| `Selection` | Generic single/multi select |
| `Single` | Single selection (radio-like) |
| `Group` | Multi-select with tri-state |
| `Checkbox` | Checkbox with indicator |
| `Dialog` | Modal with focus trapping |
| `Popover` | Toggle visibility |
| `ExpansionPanel` | Accordion/collapsible |
| `Pagination` | Page navigation |
| `Step` | Stepper navigation |
| `Avatar` | Image with fallback |
| `Atom` | Polymorphic base (`as` prop) |

Each component has Root + sub-components (e.g., `DialogRoot`, `DialogContent`, `DialogClose`).

## Patterns

### Registry Pattern

Items register themselves with a parent context:

```ts
import { createRegistry } from '@vuetify/v0'

const registry = createRegistry()

// Register an item
const ticket = registry.register({ id: 'item-1', value: 'foo' })

// Lookup
registry.get('item-1')       // Get by ID
registry.browse('foo')       // Find IDs by value
registry.lookup(0)           // Get ID by index

// Cleanup
registry.unregister('item-1')
```

### Trinity Pattern

Composables that need dependency injection return a "trinity" tuple:

```ts
import { createTheme } from '@vuetify/v0'

// [useHook, provideHook, defaultInstance]
const [useTheme, provideTheme, defaultTheme] = createTheme({
  namespace: 'my-app',
  themes: {
    light: { colors: { primary: '#1976d2' } },
    dark: { colors: { primary: '#2196f3' } },
  },
})

// In App.vue - provide to tree
provideTheme(defaultTheme)

// In any child component - consume
const theme = useTheme()
theme.current.value // 'light'
theme.toggle()      // Switch to 'dark'
```

### v-model Integration

Use `useProxyModel` to sync selection state with v-model:

```ts
import { useSelection, useProxyModel } from '@vuetify/v0'

const model = defineModel<string>()
const selection = useSelection()

// Sync selection ↔ v-model
useProxyModel(selection, model)
```

## Utilities

Built-in type guards (tree-shakeable):

```ts
import {
  isFunction, isString, isNumber, isBoolean,
  isObject, isArray, isNull, isUndefined,
  isNullOrUndefined, isPrimitive, isSymbol, isNaN,
  instanceExists,
} from '@vuetify/v0'

// Type guards
if (isObject(value)) { ... }
if (isNullOrUndefined(value)) { ... }

// Check if instance exists (useful for optional injection)
if (instanceExists(maybeContext)) { ... }
```

## Constants

SSR-safe environment checks:

```ts
import {
  IN_BROWSER,
  SUPPORTS_TOUCH,
  SUPPORTS_MATCH_MEDIA,
  SUPPORTS_OBSERVER,
} from '@vuetify/v0'

if (IN_BROWSER) {
  // Safe to use window/document
}
```

## Common Mistakes

### ❌ Forgetting cleanup

```ts
// BAD - memory leak
onMounted(() => {
  const ticket = registry.register({ id, value })
})

// GOOD - cleanup on unmount
onMounted(() => {
  const ticket = registry.register({ id, value })
  onBeforeUnmount(() => registry.unregister(ticket.id))
})
```

### ❌ Using ref() for Sets/Maps

```ts
// BAD - loses reactivity granularity
const selected = ref(new Set())

// GOOD - proper reactive collection
const selected = shallowReactive(new Set())
```

### ❌ Not using Trinity for providable contexts

```ts
// BAD - standalone only, can't provide to children
const theme = useTheme()

// GOOD - when you need to provide to component tree
const [useTheme, provideTheme, defaultTheme] = createTheme(options)
provideTheme(defaultTheme)
```

### ❌ Missing mandatory for required selection

```ts
// BAD - selection can be empty
const tabs = useSingle()

// GOOD - always has a selection
const tabs = useSingle({ mandatory: true })
```

## TypeScript

v0 is fully typed. Key types:

```ts
import type {
  ID,                    // string | number
  RegistryTicket,        // Base ticket shape
  SelectionTicket,       // With selected state
  ThemeDefinition,       // Theme config
  LocaleMessages,        // i18n messages
} from '@vuetify/v0'
```

## MCP Integration

If using `vuetify-mcp`, these tools help:

- `get_vuetify0_composable_list` — Browse available composables
- `get_vuetify0_composable_guide` — Detailed usage for specific composable

## Resources

- **Docs**: https://0.vuetifyjs.com
- **Source**: https://github.com/vuetifyjs/0
- **Vuetify Discord**: https://discord.gg/vuetify
