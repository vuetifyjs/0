---
name: vuetify0
description: Build with @vuetify/v0 headless composables and components for Vue 3. Use when creating selection state (single, multi, grouped, stepped), form validation, tab/dialog/popover UI, provide/inject context, registries, virtual scrolling, pagination, keyboard shortcuts, resize observers, theming, breakpoints, or SSR-safe browser detection. Triggers on v0, vuetify0, headless components, or WAI-ARIA patterns.
---

# Vuetify0 Skill

> **@vuetify/v0** — Headless composables and components for Vue 3. Unstyled, logic-focused building blocks for design systems.

For detailed API signatures and usage, see [references/REFERENCE.md](references/REFERENCE.md).

## Installation

```bash
pnpm install @vuetify/v0
```

No global plugin is required. Import only what you need:

```ts
import { createSelection } from '@vuetify/v0/composables'
import { Tabs } from '@vuetify/v0/components'
import { mergeDeep } from '@vuetify/v0/utilities'
import { IN_BROWSER } from '@vuetify/v0/constants'
import { Vuetify0DateAdapter } from '@vuetify/v0/date'
import type { ID } from '@vuetify/v0/types'
```

## When to Use This Skill

Use v0 whenever you need:
- **Selection state** — single, multi, grouped, or stepped selection
- **Headless UI** — WAI-ARIA compliant components (tabs, dialogs, checkboxes, radios, popovers)
- **Form validation** — async rules, field-level errors, submit handling
- **Shared context** — type-safe provide/inject patterns
- **Collection management** — registries with lifecycle events
- **Browser utilities** — SSR-safe detection, observers, event handling
- **App-wide systems** — theming, breakpoints, locale, storage

## Vuetify MCP

For structured API access during development, add [Vuetify MCP](https://0.vuetifyjs.com/guide/tooling/vuetify-mcp):

```bash
claude mcp add --transport http vuetify-mcp https://mcp.vuetifyjs.com/mcp
```

Available tools: `get_vuetify0_skill`, `get_vuetify0_composable_list`, `get_vuetify0_composable_guide`, `get_vuetify0_component_list`, `get_vuetify0_component_guide`

## Decision Tree

Before writing custom logic, check if v0 already provides it:

| Need | Use |
|------|-----|
| Single item selection | [`createSingle`](https://0.vuetifyjs.com/composables/selection/create-single) |
| Multi-item selection | [`createSelection`](https://0.vuetifyjs.com/composables/selection/create-selection) or [`createGroup`](https://0.vuetifyjs.com/composables/selection/create-group) |
| Selection with "select all" | [`createGroup`](https://0.vuetifyjs.com/composables/selection/create-group) (tri-state support) |
| Step wizard / carousel | [`createStep`](https://0.vuetifyjs.com/composables/selection/create-step) |
| Tree / nested items | [`createNested`](https://0.vuetifyjs.com/composables/selection/create-nested) |
| Form validation | [`createForm`](https://0.vuetifyjs.com/composables/forms/create-form) |
| Shared state (provide/inject) | [`createContext`](https://0.vuetifyjs.com/composables/foundation/create-context) or [`createTrinity`](https://0.vuetifyjs.com/composables/foundation/create-trinity) |
| Collection tracking | [`createRegistry`](https://0.vuetifyjs.com/composables/registration/create-registry) |
| Overflow detection | [`createOverflow`](https://0.vuetifyjs.com/composables/utilities/create-overflow) |
| Stacking / z-index layers | [`useStack`](https://0.vuetifyjs.com/composables/plugins/use-stack) |
| Filtering arrays | [`createFilter`](https://0.vuetifyjs.com/composables/utilities/create-filter) |
| Pagination | [`createPagination`](https://0.vuetifyjs.com/composables/utilities/create-pagination) |
| Virtual scrolling | [`createVirtual`](https://0.vuetifyjs.com/composables/utilities/create-virtual) |
| Undo / redo | [`createTimeline`](https://0.vuetifyjs.com/composables/registration/create-timeline) |
| Notification queue | [`createQueue`](https://0.vuetifyjs.com/composables/registration/create-queue) |
| Design tokens | [`createTokens`](https://0.vuetifyjs.com/composables/registration/create-tokens) |
| Proxy model (v-model) | [`useProxyModel`](https://0.vuetifyjs.com/composables/reactivity/use-proxy-model) |
| Keyboard shortcuts | [`useHotkey`](https://0.vuetifyjs.com/composables/system/use-hotkey) |
| Click outside | [`useClickOutside`](https://0.vuetifyjs.com/composables/system/use-click-outside) |
| Element resizing | [`useResizeObserver`](https://0.vuetifyjs.com/composables/system/use-resize-observer) |
| Element visibility | [`useIntersectionObserver`](https://0.vuetifyjs.com/composables/system/use-intersection-observer) |
| Responsive breakpoints | [`useBreakpoints`](https://0.vuetifyjs.com/composables/plugins/use-breakpoints) |
| Theme switching | [`useTheme`](https://0.vuetifyjs.com/composables/plugins/use-theme) |
| Persistent storage | [`useStorage`](https://0.vuetifyjs.com/composables/plugins/use-storage) |
| SSR check | `IN_BROWSER` |
| Type guards | `isString`, `isNumber`, `isObject`, etc. |

---

## Headless Components

All components are unstyled, accessible, and follow WAI-ARIA patterns. They use a compound sub-component pattern:

### [Tabs](https://0.vuetifyjs.com/components/disclosure/tabs)
```vue
<script lang="ts" setup>
  import { Tabs } from '@vuetify/v0/components'
</script>

<template>
  <Tabs.Root v-model="active">
    <Tabs.List>
      <Tabs.Item value="overview">Overview</Tabs.Item>
      <Tabs.Item value="features">Features</Tabs.Item>
    </Tabs.List>

    <Tabs.Panel value="overview">...</Tabs.Panel>
    <Tabs.Panel value="features">...</Tabs.Panel>
  </Tabs.Root>
</template>
```

### [Dialog](https://0.vuetifyjs.com/components/disclosure/dialog)
```vue
<script lang="ts" setup>
  import { Dialog } from '@vuetify/v0/components'
</script>

<template>
  <Dialog.Root v-model="open">
    <Dialog.Activator>Open</Dialog.Activator>
    <Dialog.Content>
      <Dialog.Title>Confirm</Dialog.Title>
      <Dialog.Description>Are you sure?</Dialog.Description>
      <Dialog.Close>Cancel</Dialog.Close>
    </Dialog.Content>
  </Dialog.Root>
</template>
```

### Available Components

| Component | Purpose |
|-----------|---------|
| [`Atom`](https://0.vuetifyjs.com/components/primitives/atom) | Polymorphic element — render as any HTML tag |
| [`Avatar`](https://0.vuetifyjs.com/components/semantic/avatar) | Image with fallback system |
| [`Checkbox`](https://0.vuetifyjs.com/components/forms/checkbox) | Checkbox with tri-state and group support |
| [`Dialog`](https://0.vuetifyjs.com/components/disclosure/dialog) | Modal with focus trap |
| [`ExpansionPanel`](https://0.vuetifyjs.com/components/disclosure/expansion-panel) | Accordion (single or multi-expand) |
| [`Group`](https://0.vuetifyjs.com/components/providers/group) | Multi-selection container |
| [`Pagination`](https://0.vuetifyjs.com/components/semantic/pagination) | Page navigation with First/Last/Next/Prev/Ellipsis |
| [`Popover`](https://0.vuetifyjs.com/components/disclosure/popover) | Toggle overlay (CSS anchor positioning) |
| [`Radio`](https://0.vuetifyjs.com/components/forms/radio) | Radio buttons with roving tabindex |
| [`Scrim`](https://0.vuetifyjs.com/components/providers/scrim) | Overlay backdrop |
| [`Selection`](https://0.vuetifyjs.com/components/providers/selection) | Generic selection container |
| [`Single`](https://0.vuetifyjs.com/components/providers/single) | Single-selection container |
| [`Step`](https://0.vuetifyjs.com/components/providers/step) | Stepper / wizard |
| [`Tabs`](https://0.vuetifyjs.com/components/disclosure/tabs) | Tab navigation with keyboard support |

---

## Composables

### Selection Patterns

```ts
// Single selection (e.g., theme picker, active tab)
const single = createSingle({ mandatory: 'force' })
single.register({ id: 'light', value: 'light' })
single.register({ id: 'dark', value: 'dark' })
single.select('dark')
single.selectedValue // Ref<string | undefined>

// Multi-selection (e.g., tag picker, multi-select list)
const selection = createSelection({ multiple: true })
selection.toggle('a')
selection.isSelected('a') // boolean

// Group with "select all" (e.g., data table checkboxes)
const group = createGroup()
group.selectAll()
group.toggleAll()
group.isMixed // true when partially selected

// Sequential navigation (e.g., stepper, carousel)
const stepper = createStep({ circular: true })
stepper.next()
stepper.prev()
stepper.first()
stepper.last()
```

Docs: [createSingle](https://0.vuetifyjs.com/composables/selection/create-single) | [createSelection](https://0.vuetifyjs.com/composables/selection/create-selection) | [createGroup](https://0.vuetifyjs.com/composables/selection/create-group) | [createStep](https://0.vuetifyjs.com/composables/selection/create-step) | [createNested](https://0.vuetifyjs.com/composables/selection/create-nested)

### Forms

```ts
const form = createForm()

form.register({
  id: 'email',
  value: '',
  rules: [
    v => !!v || 'Required',
    v => /.+@.+/.test(v) || 'Invalid email',
    async v => await checkAvailable(v) || 'Email taken'
  ]
})

form.submit() // Validates all fields, returns { valid, errors }
```

Docs: [createForm](https://0.vuetifyjs.com/composables/forms/create-form)

### Context (Dependency Injection)

```ts
// createContext — type-safe provide/inject
const [useTheme, provideTheme] = createContext<ThemeContext>('Theme')

// Provider component
provideTheme({ mode, toggle })

// Consumer component (throws helpful error if not provided)
const { mode, toggle } = useTheme()

// createTrinity — context with built-in defaults
const [useConfig, provideConfig, defaultConfig] = createTrinity<Config>('Config', {
  theme: 'light',
  locale: 'en'
})
```

Docs: [createContext](https://0.vuetifyjs.com/composables/foundation/create-context) | [createTrinity](https://0.vuetifyjs.com/composables/foundation/create-trinity) | [createPlugin](https://0.vuetifyjs.com/composables/foundation/create-plugin)

### Data Utilities

```ts
// Filtering
const { apply } = createFilter({ keys: ['name', 'email'] })
const filtered = apply(query, users)

// Pagination
const pagination = createPagination({ page: 1, itemsPerPage: 10, length: 100 })
pagination.next()

// Virtual scrolling
const { virtualItems, totalHeight, scrollTo } = createVirtual({
  items: largeList,
  itemHeight: 48
})

// Undo/redo
const timeline = createTimeline({ maxSize: 50 })
timeline.push(state)
timeline.undo()

// Notification queue with auto-dismiss
const notifications = createQueue({ timeout: 5000 })
notifications.push({ message: 'Saved!' })
```

Docs: [createFilter](https://0.vuetifyjs.com/composables/utilities/create-filter) | [createPagination](https://0.vuetifyjs.com/composables/utilities/create-pagination) | [createVirtual](https://0.vuetifyjs.com/composables/utilities/create-virtual) | [createTimeline](https://0.vuetifyjs.com/composables/registration/create-timeline) | [createQueue](https://0.vuetifyjs.com/composables/registration/create-queue) | [createOverflow](https://0.vuetifyjs.com/composables/utilities/create-overflow)

### Browser & DOM

```ts
// SSR-safe environment checks
import { IN_BROWSER, SUPPORTS_TOUCH, SUPPORTS_OBSERVER } from '@vuetify/v0/constants'

// DOM observation (auto-cleanup on unmount)
const { width, height } = useResizeObserver(el)
const { isIntersecting } = useIntersectionObserver(el, { threshold: 0.1 })

// Events
useEventListener(window, 'resize', onResize)
useHotkey('ctrl+k', openSearch)
useClickOutside(menuRef, close)

// Responsive
const { md, lgAndUp } = useBreakpoints()
const { matches } = useMediaQuery('(prefers-color-scheme: dark)')
```

Docs: [useResizeObserver](https://0.vuetifyjs.com/composables/system/use-resize-observer) | [useIntersectionObserver](https://0.vuetifyjs.com/composables/system/use-intersection-observer) | [useMutationObserver](https://0.vuetifyjs.com/composables/system/use-mutation-observer) | [useEventListener](https://0.vuetifyjs.com/composables/system/use-event-listener) | [useHotkey](https://0.vuetifyjs.com/composables/system/use-hotkey) | [useClickOutside](https://0.vuetifyjs.com/composables/system/use-click-outside) | [useMediaQuery](https://0.vuetifyjs.com/composables/system/use-media-query)

### Plugins (App-Wide Systems)

For features that need app-wide state, use plugins in `main.ts`:

```ts
import { createThemePlugin, createBreakpointsPlugin } from '@vuetify/v0'

app.use(
  createThemePlugin({
    themes: {
      light: { colors: { primary: '#3b82f6' } },
      dark: { colors: { primary: '#60a5fa' } },
    }
  })
)
app.use(createBreakpointsPlugin())

// Then in any component:
const { current, toggle } = useTheme()
const { md, lgAndUp } = useBreakpoints()
```

Available plugins: [`createThemePlugin`](https://0.vuetifyjs.com/composables/plugins/use-theme), [`createBreakpointsPlugin`](https://0.vuetifyjs.com/composables/plugins/use-breakpoints), [`createFeaturesPlugin`](https://0.vuetifyjs.com/composables/plugins/use-features), [`createLoggerPlugin`](https://0.vuetifyjs.com/composables/plugins/use-logger), [`createLocalePlugin`](https://0.vuetifyjs.com/composables/plugins/use-locale), [`createDatePlugin`](https://0.vuetifyjs.com/composables/plugins/use-date), [`createStoragePlugin`](https://0.vuetifyjs.com/composables/plugins/use-storage)

---

## Anti-Patterns

### Don't write custom selection logic
```ts
// Bad — v0 handles reactivity, mandatory constraints, and events for you
const selected = ref<string[]>([])
function toggle (id: string) {
  const index = selected.value.indexOf(id)
  if (index >= 0) selected.value.splice(index, 1)
  else selected.value.push(id)
}

// Good
const selection = createSelection({ multiple: true })
selection.toggle(id)
```

### Don't write custom provide/inject
```ts
// Bad — no type safety, no error on missing provider
provide('theme', theme)
const theme = inject('theme') // Could be undefined!

// Good — type-safe, throws descriptive error if provider is missing
const [useTheme, provideTheme] = createContext<ThemeContext>('theme')
```

### Don't write manual SSR checks
```ts
// Bad
if (typeof window !== 'undefined')

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
├── useProxyRegistry  → External registry proxy
└── useStack          → Layered z-index management

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

System (standalone)
├── useResizeObserver       → Element dimensions
├── useIntersectionObserver → Visibility detection
├── useMutationObserver     → DOM mutations
├── useEventListener        → Auto-cleanup events
├── useHotkey               → Keyboard shortcuts
├── useClickOutside         → Outside click detection
├── useToggleScope          → Conditional effect scopes
└── createOverflow          → Container overflow detection

Plugins (app-wide, uses createPlugin)
├── useTheme          → Theme switching
├── useBreakpoints    → Responsive detection
├── useLocale         → i18n
├── useDate           → Date utilities
├── useStorage        → localStorage/sessionStorage
├── useFeatures       → Feature flags
├── usePermissions    → Permission management
├── useLogger         → Logging
├── useHydration      → SSR hydration
└── useLazy           → Deferred computation

Transformers
├── toArray           → Normalize to array
└── toReactive        → MaybeRef to reactive
```

---

## Utility Functions

```ts
import { mergeDeep, clamp, range, debounce, useId } from '@vuetify/v0/utilities'

mergeDeep({}, defaults, overrides) // Deep merge (prototype-pollution safe)
clamp(value, 0, 100)              // Clamp to range
range(5)                           // [0, 1, 2, 3, 4]
range(5, 1)                        // [1, 2, 3, 4, 5]

const search = debounce(fn, 300)   // With .clear() and .immediate()
const id = useId()                 // SSR-safe unique ID
```

### Type Guards

```ts
import { isString, isNumber, isObject, isArray, isFunction, isBoolean, isNull, isUndefined, isNullOrUndefined, isPrimitive, isSymbol, isNaN } from '@vuetify/v0/utilities'
```

---

## Resources

- **Docs**: https://0.vuetifyjs.com
- **Source**: https://github.com/vuetifyjs/0
- **MCP**: https://0.vuetifyjs.com/guide/tooling/vuetify-mcp
- **AI Tools**: https://0.vuetifyjs.com/guide/tooling/ai-tools
- **API Reference**: [references/REFERENCE.md](references/REFERENCE.md)
- **Discord**: https://community.vuetifyjs.com/
