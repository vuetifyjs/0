---
title: Vuetify0 Composables - Vue 3 Headless Primitives
meta:
  - name: description
    content: Type-safe Vue 3 composables for headless UI. Selection, forms, theming, tokens, and state management primitives for building custom design systems.
  - name: keywords
    content: composables, Vue 3, headless ui, primitives, selection, forms, theming, state management, TypeScript
features:
  level: 1
related:
  - /guide/fundamentals/core
  - /components
---

# Composables

Type-safe composables for headless UI. Components wrap these composables—you can use either approach.

<DocsPageFeatures :frontmatter />

## Minimal Reactivity

Vuetify0 composables use the absolute minimum reactivity required to fulfill their responsibilities. This deliberate constraint keeps bundle sizes small, maximizes performance, and gives you full control over what triggers updates.

> [!TIP]
> See [Benchmarks](/guide/fundamentals/benchmarks) for performance data and what the size ratings mean.

### What's Reactive

| Category | Reactive | Why |
| - | :-: | - |
| Selection state (`selectedIds`, `selectedId`) | <AppIcon icon="success" class="text-success" /> | UI must reflect selection changes |
| Registry collections (`values()`, `keys()`) | <AppIcon icon="close" class="text-error" /> | Read-heavy, rarely needs live updates |
| Registry size | <AppIcon icon="close" class="text-error" /> | Computed on access, not tracked |
| Queue/Timeline data | <AppIcon icon="close" class="text-error" /> | Consumed via events or polling |

### Events as Opt-In Reactivity

Registries emit events when operations occur. Use events to build reactive behavior only where needed:

```ts
import { createRegistry } from '@vuetify/v0'

const registry = createRegistry({ events: true })

// Listen for changes
registry.on('register:ticket', ticket => {
  console.log('Added:', ticket.id)
})

registry.on('unregister:ticket', ticket => {
  console.log('Removed:', ticket.id)
})
```

**Available events:**
- `register:ticket` — Item added
- `unregister:ticket` — Item removed
- `update:ticket` — Item modified via `upsert()`
- `clear:registry` — All items removed
- `reindex:registry` — Indices recalculated

### useProxyRegistry for Full Reactivity

When you need automatic template updates for registry data, wrap it with `useProxyRegistry`:

```ts
import { createRegistry, useProxyRegistry } from '@vuetify/v0'

const registry = createRegistry()

// Non-reactive: template won't update when items change
const items = registry.values()

// Reactive: changes trigger template updates automatically
const proxy = useProxyRegistry(registry)
// proxy.values is a computed ref that updates on any mutation
```

This pattern lets you choose reactivity granularity—pay for what you use

## Naming Conventions

Composable names signal how they're used:

### `create*` — Factory Functions

Factory functions construct a new instance of stateful logic. They return an object you can provide, pass around, or destructure.

| Pattern | Example | When to Use |
| - | - | - |
| Context factories | `createContext`, `createTrinity` | Building reusable provide/inject pairs |
| State factories | `createSelection`, `createRegistry` | Creating isolated state instances |
| Feature factories | `createDataTable`, `createForm` | Composing multiple primitives into a feature |

### `use*` — Composables

Composables consume existing context or wrap browser APIs. They're called inside `setup()` and return reactive state.

| Pattern | Example | When to Use |
| - | - | - |
| Plugin consumers | `useTheme`, `useLocale`, `useStorage` | Reading app-level plugin state (requires plugin installation) |
| Browser wrappers | `useEventListener`, `useResizeObserver` | Safe, lifecycle-managed browser API access |
| Behavior composables | `useHotkey`, `useClickOutside` | Adding interactive behavior to elements |

## Foundation

Core factories that provide the foundation for all other composables.

| Name | Description |
| - | - |
| [createContext](/composables/foundation/create-context) | Create reusable context to share state across components |
| [createPlugin](/composables/foundation/create-plugin) | Create Vue plugins with standardized patterns |
| [createTrinity](/composables/foundation/create-trinity) | Create context provider/consumer pattern utilities |

## Registration

Collection management and data structure primitives.

| Name | Description |
| - | - |
| [createRegistry](/composables/registration/create-registry) | Foundation for registration-based systems |
| [createQueue](/composables/registration/create-queue) | Time-based queue management with automatic timeouts |
| [createTimeline](/composables/registration/create-timeline) | Bounded undo/redo system with fixed-size history |
| [createTokens](/composables/registration/create-tokens) | Design token management system |

## Selection

State management for single and multi-selection patterns.

| Name | Description |
| - | - |
| [createModel](/composables/selection/create-model) | Value store layer with disabled guards and apply bridge |
| [createSelection](/composables/selection/create-selection) | General selection state management |
| [createSingle](/composables/selection/create-single) | Single-selection with automatic deselection |
| [createGroup](/composables/selection/create-group) | Multi-selection with tri-state support |
| [createStep](/composables/selection/create-step) | Sequential navigation for wizards and steppers |

## Forms

Form state management and model binding utilities.

| Name | Description |
| - | - |
| [createValidation](/composables/forms/create-validation) | Per-field validation lifecycle |
| [createForm](/composables/forms/create-form) | Form validation coordinator |

## Reactivity

Reactive proxy utilities for bridging state.

| Name | Description |
| - | - |
| [useProxyModel](/composables/reactivity/use-proxy-model) | Bridge selection context to v-model binding |
| [useProxyRegistry](/composables/reactivity/use-proxy-registry) | Proxy-based registry with automatic reactivity |

## System

Browser API wrappers with automatic lifecycle cleanup.

| Name | Description |
| - | - |
| [useClickOutside](/composables/system/use-click-outside) | Detect clicks outside an element |
| [useEventListener](/composables/system/use-event-listener) | Handle DOM events with automatic cleanup |
| [useHotkey](/composables/system/use-hotkey) | Handle hotkey combinations and sequences |
| [useIntersectionObserver](/composables/system/use-intersection-observer) | Intersection Observer API for visibility detection |
| [useMediaQuery](/composables/system/use-media-query) | Reactive CSS media query matching |
| [useMutationObserver](/composables/system/use-mutation-observer) | Mutation Observer API for DOM change detection |
| [useResizeObserver](/composables/system/use-resize-observer) | Resize Observer API for element size changes |
| [useToggleScope](/composables/system/use-toggle-scope) | Conditional effect scope management |

## Plugins

Application-level features installable via Vue plugins.

| Name | Description |
| - | - |
| [useBreakpoints](/composables/plugins/use-breakpoints) | Responsive breakpoint detection |
| [useDate](/composables/plugins/use-date) | Date manipulation with Temporal API and locale-aware formatting |
| [useFeatures](/composables/plugins/use-features) | Feature flags and A/B testing |
| [useHydration](/composables/plugins/use-hydration) | SSR hydration management |
| [useLocale](/composables/plugins/use-locale) | Internationalization system |
| [useLogger](/composables/plugins/use-logger) | Logging system with multiple adapters |
| [usePermissions](/composables/plugins/use-permissions) | Role-based access control |
| [useRules](/composables/plugins/use-rules) | Validation rule aliases with locale-aware messages |
| [useStorage](/composables/plugins/use-storage) | Reactive browser storage interface |
| [useTheme](/composables/plugins/use-theme) | Theme management with CSS custom properties |

## Data

Composables for filtering, sorting, paginating, and virtualizing collections.

| Name | Description |
| - | - |
| [createDataTable](/composables/data/create-data-table) | Composable data table with sort, filter, paginate, select, and expand |
| [createFilter](/composables/data/create-filter) | Filter arrays based on search queries |
| [createPagination](/composables/data/create-pagination) | Pagination state with navigation methods |
| [createVirtual](/composables/data/create-virtual) | Virtual scrolling for large lists |

## Utilities

Standalone helpers for common UI patterns.

| Name | Description |
| - | - |
| [createBreadcrumbs](/composables/utilities/create-breadcrumbs) | Breadcrumb navigation with path truncation |
| [createOverflow](/composables/utilities/create-overflow) | Compute item capacity for responsive truncation |

## Transformers

Value transformation utilities.

| Name | Description |
| - | - |
| [toArray](/composables/transformers/to-array) | Convert any value to an array |
| [toReactive](/composables/transformers/to-reactive) | Convert MaybeRef objects to reactive proxies |

