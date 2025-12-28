---
title: Composables Guide - Headless Logic for Vue 3
meta:
  - name: description
    content: Learn how to use Vuetify0 composables for headless UI logic. Understand when to use composables vs components, and how to build custom UI with type-safe primitives.
  - name: keywords
    content: vuetify0, composables, headless ui, Vue 3, selection, forms, plugins, utilities
related:
  - /guide/core
  - /guide/components
  - /composables/foundation/create-context
---

# Composables

Composables are the foundation of v0. They provide headless logic that you can use directly or through wrapper components.

<DocsPageFeatures :frontmatter />

## Composables vs Components

Both approaches use the same underlying logic:

```ts
// Direct composable usage
const selection = createSelection({ multiple: true })
selection.register({ id: 'a', value: 'Apple' })
selection.select('a')
```

```vue playground
<template>
  <Selection.Root v-model="selected" multiple>
    <Selection.Item value="Apple">Apple</Selection.Item>
  </Selection.Root>
</template>
```

### When to Use Each

| Use Composables When | Use Components When |
| - | - |
| Need full control over rendering | Want declarative templates |
| Building custom abstractions | Standard UI patterns |
| Non-DOM contexts (stores, workers) | Accessibility attrs needed |
| Maximum flexibility | Faster development |

## Categories

### Foundation

Factories that create other composables:

| Composable | Purpose |
| - | - |
| [createContext](/composables/foundation/create-context) | Type-safe provide/inject |
| [createTrinity](/composables/foundation/create-trinity) | `[use, provide, context]` tuple |
| [createPlugin](/composables/foundation/create-plugin) | Vue plugin factory |

### Registration

Collection management primitives:

| Composable | Purpose |
| - | - |
| [useRegistry](/composables/registration/use-registry) | Base collection with lookup |
| [useTokens](/composables/registration/use-tokens) | Design token aliases |
| [useQueue](/composables/registration/use-queue) | Time-based queue |
| [useTimeline](/composables/registration/use-timeline) | Undo/redo history |

### Selection

State management for selection patterns:

| Composable | Purpose |
| - | - |
| [useSelection](/composables/selection/use-selection) | Multi-select base |
| [useSingle](/composables/selection/use-single) | Radio, tabs, accordion |
| [useGroup](/composables/selection/use-group) | Checkboxes, tri-state |
| [useStep](/composables/selection/use-step) | Wizard, stepper, carousel |

### Forms

Form state and validation:

| Composable | Purpose |
| - | - |
| [useForm](/composables/forms/use-form) | Validation, dirty tracking |
| [useProxyModel](/composables/forms/use-proxy-model) | v-model bridge |

### Plugins

App-level features installed via `app.use()`:

| Composable | Purpose |
| - | - |
| [useTheme](/composables/plugins/use-theme) | Dark/light mode |
| [useLocale](/composables/plugins/use-locale) | i18n, RTL |
| [useBreakpoints](/composables/plugins/use-breakpoints) | Responsive queries |
| [useStorage](/composables/plugins/use-storage) | Persistent state |

### Utilities

Standalone helpers:

| Composable | Purpose |
| - | - |
| [useFilter](/composables/utilities/use-filter) | Array filtering |
| [usePagination](/composables/utilities/use-pagination) | Page navigation |
| [useVirtual](/composables/utilities/use-virtual) | Virtual scrolling |

## Usage Patterns

### Direct Factory Call

For standalone instances:

```ts
import { createSelection } from '@vuetify/v0'

const tabs = createSelection({ multiple: false })
tabs.register({ id: 'home', value: 'Home' })
tabs.register({ id: 'about', value: 'About' })
tabs.select('home')
```

### Context Injection

For component tree sharing:

```ts
// Parent
import { createSelectionContext } from '@vuetify/v0'

const [useTabSelection, provideTabSelection] = createSelectionContext({
  namespace: 'tabs'
})
provideTabSelection({ multiple: false })

// Child
const selection = useTabSelection()
selection.select('home')
```

### Plugin Installation

For app-wide singletons:

```ts
import { createApp } from 'vue'
import { createThemePlugin } from '@vuetify/v0'

const app = createApp(App)
app.use(createThemePlugin({
  defaultTheme: 'light',
  themes: { light: {...}, dark: {...} }
}))
```

## Composing Composables

Build complex behavior by combining primitives:

```ts
import { createSelection, createFilter, createPagination } from '@vuetify/v0'

// Filterable, paginated selection
const items = ref([...])
const query = ref('')

const filter = createFilter()
const { items: filtered } = filter.apply(query, items)

const pagination = createPagination({
  size: () => filtered.value.length,
  itemsPerPage: 10
})
const selection = createSelection({ multiple: true })

// Visible items with selection state
const visibleItems = computed(() => {
  const start = pagination.pageStart.value
  const end = pagination.pageStop.value
  return filtered.value.slice(start, end)
})
```

## TypeScript

All composables are fully typed:

```ts
interface MyItem {
  id: string
  label: string
  disabled?: boolean
}

const selection = createSelection<MyItem>()
selection.register({ id: '1', value: { id: '1', label: 'First' } })

// Type-safe access
const item = selection.get('1')
item?.value.label // string
```

