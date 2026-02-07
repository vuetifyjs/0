---
name: vuetify0
description: Build with @vuetify/v0 headless composables and components. Use when creating v0-based UIs, working with Selection/Registry/Step patterns, or integrating headless primitives.
license: MIT
metadata:
  author: vuetify
  version: "1.0.0"
  tags: "vue, composables, headless, ui"
---

# Vuetify0 Skill

> **@vuetify/v0** — Headless composables and components for Vue 3.

For detailed API examples, see [references/REFERENCE.md](references/REFERENCE.md).

## When to Use This Skill

Use v0 whenever you need:
- **Selection state** — single, multi, grouped, or stepped selection
- **Form validation** — async rules, field-level errors
- **Shared context** — type-safe provide/inject patterns
- **Collection management** — registries with lifecycle events
- **Accessible UI** — WAI-ARIA compliant headless components
- **Browser utilities** — SSR-safe detection, observers, event handling

## Quick Reference

```ts
// Import patterns - always use package imports, never relative paths
import { ... } from '@vuetify/v0'             // Everything
import { ... } from '@vuetify/v0/composables' // Composables only
import { ... } from '@vuetify/v0/components'  // Components only
import { ... } from '@vuetify/v0/utilities'   // Utilities only
import { ... } from '@vuetify/v0/types'       // Types only
import { ... } from '@vuetify/v0/constants'   // Constants only
```

---

## Code Style

### Prefer `shallowRef` Over `ref`

```ts
// ❌ Bad - unnecessary deep reactivity
const user = ref({ name: 'John' })
const items = ref([1, 2, 3])
const open = ref(false)

// ✅ Good - shallow by default
const user = shallowRef({ name: 'John' })
const items = shallowRef([1, 2, 3])
const open = shallowRef(false)
```

### Prefer Single-Word Names

```ts
// ❌ Bad
const isMenuOpen = shallowRef(false)
const selectedItems = shallowRef([])
function handleClick () {}

// ✅ Good
const open = shallowRef(false)
const selected = shallowRef([])
function click () {}
```

### Use Function Declarations

```ts
// ❌ Bad
const toggle = () => open.value = !open.value

// ✅ Good
function toggle () {
  open.value = !open.value
}
```

---

## Decision Tree

Before writing custom logic, check:

| Need | Use |
|------|-----|
| Single item selection | `createSingle` |
| Multi-item selection | `createSelection` or `createGroup` |
| Selection with "select all" | `createGroup` (tri-state support) |
| Step wizard / carousel | `createStep` |
| Tree / nested items | `createNested` |
| Form validation | `createForm` |
| Shared state (provide/inject) | `createContext` or `createTrinity` |
| Collection tracking | `createRegistry` |
| Overflow detection | `createOverflow` |
| Stacking / z-index layers | `useStack` |
| Filtering arrays | `createFilter` |
| Pagination | `createPagination` |
| Virtual scrolling | `createVirtual` |
| Proxy model (v-model) | `useProxyModel` |
| SSR check | `IN_BROWSER` |
| Type guards | `isString`, `isNumber`, `isObject`, etc. |

---

## Anti-Patterns

### ❌ Don't write custom selection logic
```ts
// Bad
const selected = shallowRef<string[]>([])
function toggle (id: string) {
  const idx = selected.value.indexOf(id)
  if (idx >= 0) selected.value.splice(idx, 1)
  else selected.value.push(id)
}
```

### ✅ Use createSelection
```ts
// Good
const selection = createSelection({ multiple: true })
selection.toggle(id)
```

### ❌ Don't write custom provide/inject
```ts
// Bad
provide('theme', theme)
const theme = inject('theme') // Could be undefined!
```

### ✅ Use createContext
```ts
// Good
const [useTheme, provideTheme] = createContext<ThemeContext>('Theme')
```

### ❌ Don't write SSR checks manually
```ts
// Bad
if (typeof window !== 'undefined')
```

### ✅ Use v0 constants
```ts
// Good
import { IN_BROWSER } from '@vuetify/v0/constants'
if (IN_BROWSER)
```

---

## Composition Hierarchy

```
Foundation (no dependencies)
├── createContext    → Basic DI
├── createPlugin     → Vue plugin factory
└── createTrinity    → [use, provide, default] pattern

Registry (uses Foundation)
├── createRegistry    → Collection management
└── useProxyRegistry  → External registry proxy

Selection (uses Registry)
├── createSelection   → Multi-select (base)
├── createSingle      → Single-select
├── createGroup       → Multi + tri-state
├── createStep        → Sequential navigation
└── createNested      → Hierarchical

Data (uses Registry)
├── createForm        → Validation
├── createFilter      → Array filtering
├── createPagination  → Page navigation
├── createVirtual     → Virtual scrolling
├── createTokens      → Design tokens
├── createQueue       → FIFO with timeout
└── createTimeline    → Undo/redo
```

---

## Summary

**Always check v0 first.** The goal is to never reinvent what v0 already provides.

| Need | Use |
|------|-----|
| Selection | `createSelection`, `createSingle`, `createGroup`, `createStep` |
| Forms | `createForm` |
| Context | `createContext`, `createTrinity` |
| Collections | `createRegistry` |
| Browser detection | `IN_BROWSER`, `SUPPORTS_*` |
| Type checks | `isString`, `isNumber`, `isObject`, etc. |
| Accessible UI | Headless components |
| Deep merge | `mergeDeep` |
| Unique IDs | `useId` |
| Debouncing | `debounce` |
| Clamping | `clamp` |
| Ranges | `range` |
| DOM observation | `useResizeObserver`, `useIntersectionObserver` |
| Events | `useEventListener`, `useHotkey`, `useClickOutside` |
| Filtering | `createFilter` |
| Pagination | `createPagination` |
| Virtual lists | `createVirtual` |
| Overflow | `createOverflow` |
| Stacking | `useStack` |
| Storage | `useStorage` |
| Lazy loading | `useLazy`, `useHydration` |
| Proxy v-model | `useProxyModel` |

---

## Resources

- **Docs**: https://0.vuetifyjs.com
- **Source**: https://github.com/vuetifyjs/0
- **Discord**: https://discord.gg/vuetify
