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
| Selection state (`selectedIds`, `selectedValues`) | <AppIcon icon="success" class="text-success" /> | UI must reflect selection changes |
| Ticket `isSelected`, `isMixed` | <AppIcon icon="success" class="text-success" /> | Per-item binding in templates |
| Plugin state (`useTheme`, `useLocale`, etc.) | <AppIcon icon="success" class="text-success" /> | App-wide singletons shared across components |
| Registry collections (`values()`, `keys()`) | <AppIcon icon="close" class="text-error" /> | Opt in via `reactive: true` or `useProxyRegistry` |
| Ticket fields (custom props) | <AppIcon icon="close" class="text-error" /> | Opt in via `reactive: true` |
| Registry size | <AppIcon icon="close" class="text-error" /> | Computed on access |
| Queue / Timeline data | <AppIcon icon="close" class="text-error" /> | Opt in via `reactive: true`; queue also auto-fires events |

### The reactive Option

For direct Vue reactivity on the collection and tickets themselves, pass `reactive: true` to the registry:

```vue playground collapse
<script setup lang="ts">
  import { createRegistry } from '@vuetify/v0'

  const registry = createRegistry({ reactive: true })

  const input = defineModel({ default: '' })

  function onAdd () {
    if (!input.value.trim()) return
    registry.register({ value: input.value.trim() })
    input.value = ''
  }
</script>

<template>
  <div class="flex gap-2 mb-3">
    <input
      v-model="input"
      class="border border-divider rounded px-2 py-1 text-sm bg-surface text-on-surface flex-1"
      placeholder="Add item..."
      @keydown.enter="onAdd"
    />
    <button class="px-3 py-1 text-sm rounded bg-primary text-on-primary" @click="onAdd">Add</button>
  </div>

  <ul class="space-y-1">
    <li
      v-for="ticket in registry.values()"
      :key="ticket.id"
      class="flex items-center justify-between text-sm px-2 py-1 rounded border border-divider"
    >
      {{ ticket.value }}
      <button class="text-xs opacity-50 hover:opacity-100" @click="registry.unregister(ticket.id)">✕</button>
    </li>
  </ul>

  <p class="mt-2 text-xs opacity-50">{{ registry.size }} item{{ registry.size === 1 ? '' : 's' }}</p>
</template>
```

> [!WARNING]
> Don't pass a registry directly to `v-for`. Pair `events: true` with `useProxyRegistry()` at the component boundary — the proxy exposes reactive `keys`, `values`, `entries`, and `size` properties that templates can iterate safely. Reading `.values()` from a `reactive: true` registry in a `v-for` breaks Vue's dep tracking because the internal cache invalidates on every mutation.

Unlike events (which fire callbacks) or `useProxyRegistry` (which wraps with computed refs), `reactive: true` makes the underlying Map and each ticket `shallowReactive`. Use it when you need Vue's dependency tracking at the ticket level.

### useProxyModel for v-model Binding

When you need to sync a selection context with a v-model ref, use `useProxyModel`:

```vue playground collapse
<script setup lang="ts">
  import { createSelection, useProxyModel } from '@vuetify/v0'
  import { toRef } from 'vue'

  const model = defineModel({ default: 'blue' })

  const colors = [
    { id: 'red', value: 'red', hex: '#ef4444' },
    { id: 'blue', value: 'blue', hex: '#3b82f6' },
    { id: 'green', value: 'green', hex: '#22c55e' },
  ]

  const selection = createSelection({ events: true })
  selection.onboard(colors)

  useProxyModel(selection, model)

  const active = toRef(() => colors.find(c => c.value === model.value))
</script>

<template>
  <div class="flex gap-2">
    <button
      v-for="ticket in selection.values()"
      :key="ticket.id"
      class="size-8 rounded-full border-2 transition-all"
      :class="ticket.isSelected.value ? 'border-on-surface scale-110' : 'border-transparent'"
      :style="{ backgroundColor: colors.find(c => c.id === ticket.id)?.hex }"
      @click="ticket.select()"
    />
  </div>

  <p class="mt-2 text-sm">Selected: {{ active?.id ?? '—' }}</p>
</template>
```

Clicking a swatch calls `ticket.select()`, which updates `model`. Setting `model.value = 'red'` drives the selection back. Both directions stay in sync automatically.

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
| Plugin consumers | `useTheme`, `useLocale`, `useStorage` | Reading app-level plugin state[^plugin-install] |
| Browser wrappers | `useEventListener`, `useResizeObserver` | Safe, lifecycle-managed browser API access |
| Behavior composables | `useHotkey`, `useClickOutside` | Adding interactive behavior to elements |

[^plugin-install]: Requires the corresponding plugin installed at app level — e.g. `app.use(createThemePlugin())` for `useTheme`. See each plugin composable's page for the exact factory.

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
| [createNested](/composables/selection/create-nested) | Hierarchical parent-child relationships with open/close state and tree traversal |
| [createSelection](/composables/selection/create-selection) | General selection state management |
| [createSingle](/composables/selection/create-single) | Single-selection with automatic deselection |
| [createGroup](/composables/selection/create-group) | Multi-selection with tri-state support |
| [createStep](/composables/selection/create-step) | Sequential navigation for wizards and steppers |

## Forms

Form state management and model binding utilities.

| Name | Description |
| - | - |
| [createCombobox](/composables/forms/create-combobox) | Coordinate selection, popover, virtual focus, and filtering for autocomplete |
| [createForm](/composables/forms/create-form) | Form validation coordinator |
| [createInput](/composables/forms/create-input) | Shared form field primitive: validation, field state, ARIA IDs |
| [createNumberField](/composables/forms/create-number-field) | Numeric input state with formatting, parsing, and validation |
| [createRating](/composables/forms/create-rating) | Bounded rating value with discrete items and half-step support |
| [createSlider](/composables/forms/create-slider) | Slider state with multi-thumb support, step snapping, and value math |
| [createValidation](/composables/forms/create-validation) | Per-field validation lifecycle |

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
| [useDelay](/composables/system/use-delay) | Schedule open and close transitions with configurable delays |
| [useEventListener](/composables/system/use-event-listener) | Handle DOM events with automatic cleanup |
| [useHotkey](/composables/system/use-hotkey) | Handle hotkey combinations and sequences |
| [useImage](/composables/system/use-image) | Image loading state machine with deferred loading and retry |
| [useIntersectionObserver](/composables/system/use-intersection-observer) | Intersection Observer API for visibility detection |
| [useLazy](/composables/system/use-lazy) | Defer rendering until first activation for dialogs, menus, and tooltips |
| [useMediaQuery](/composables/system/use-media-query) | Reactive CSS media query matching |
| [useMutationObserver](/composables/system/use-mutation-observer) | Mutation Observer API for DOM change detection |
| [usePopover](/composables/system/use-popover) | Native Popover API behavior with CSS anchor positioning |
| [usePresence](/composables/system/use-presence) | Animation-agnostic mount lifecycle with lazy mounting and exit timing |
| [useRaf](/composables/system/use-raf) | Scope-safe requestAnimationFrame with automatic cleanup |
| [useResizeObserver](/composables/system/use-resize-observer) | Resize Observer API for element size changes |
| [useRovingFocus](/composables/system/use-roving-focus) | Roving tabindex keyboard navigation for composite widgets |
| [useTimer](/composables/system/use-timer) | Reactive timer with pause/resume controls and remaining time tracking |
| [useToggleScope](/composables/system/use-toggle-scope) | Conditional effect scope management |
| [useVirtualFocus](/composables/system/use-virtual-focus) | Virtual focus for aria-activedescendant keyboard navigation patterns |

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
| [useNotifications](/composables/plugins/use-notifications) | Notification lifecycle with toast queue and service adapter integration |
| [usePermissions](/composables/plugins/use-permissions) | Role-based access control |
| [useRtl](/composables/plugins/use-rtl) | Reactive RTL text direction with dir attribute management |
| [useRules](/composables/plugins/use-rules) | Validation rule aliases with locale-aware messages |
| [useStack](/composables/plugins/use-stack) | Overlay z-index stacking with automatic calculation and scrim integration |
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

## Semantic

Composables for presentational and semantic components.

| Name | Description |
| - | - |
| [createBreadcrumbs](/composables/semantic/create-breadcrumbs) | Breadcrumb navigation with path truncation |
| [createOverflow](/composables/semantic/create-overflow) | Compute item capacity for responsive truncation |
| [createProgress](/composables/semantic/create-progress/) | Progress tracking with multi-segment registration |

## Transformers

Value transformation utilities.

| Name | Description |
| - | - |
| [toArray](/composables/transformers/to-array) | Convert any value to an array |
| [toElement](/composables/transformers/to-element) | Resolve refs, getters, or component instances to a plain DOM element |
| [toReactive](/composables/transformers/to-reactive) | Convert MaybeRef objects to reactive proxies |

