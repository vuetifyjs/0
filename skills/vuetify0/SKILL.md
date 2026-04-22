---
name: vuetify0
description: Use when building Vue 3 UI that needs headless logic — selection state (single, multi, grouped, nested, stepped), form validation, registries, context providers, virtual scrolling, pagination, data tables, focus traversal, keyboard shortcuts, resize/intersection/mutation observers, popovers, snackbars, SSR-safe browser checks, theming, RTL, breakpoints, or WAI-ARIA compound components. Triggers on @vuetify/v0, vuetify0, v0, createX composables, or import paths starting with #v0.
---

# Vuetify0

Headless Vue 3 primitives. Logic only, zero styling. Feeds Vuetify 4 through minor releases.

**36 components, 63 composables** across selection, forms, data, disclosure, observers, and plugins. Compound-component APIs with WAI-ARIA semantics.

## Install

```bash
pnpm install @vuetify/v0
```

No global plugin required. Tree-shakeable imports:

```ts
import { createSelection, useBreakpoints } from '@vuetify/v0'
import { Tabs, Dialog } from '@vuetify/v0/components'
```

## Decision table — reach for these first

Check this table **before writing custom logic**. Match by problem, not by keyword.

| Problem | Use | Category |
|---|---|---|
| Single-choice state (tabs, theme picker) | `createSingle` | selection |
| Multi-choice state (filters, tag pickers) | `createSelection` | selection |
| Select-all with tri-state | `createGroup` | selection |
| Tree / nested selection (treeview, menus) | `createNested` | selection |
| Wizard / carousel step tracking | `createStep` | selection |
| Id-based value store (shared across sub-components) | `createModel` | selection |
| Form with async validation + dirty tracking | `createForm` + `createValidation` | forms |
| Slider / range / knob state | `createSlider` | forms |
| Autocomplete / combobox | `createCombobox` | forms |
| Spin-button numeric input | `createNumberField` / `createNumeric` | forms |
| Paginated or virtualized list | `createPagination`, `createVirtual` | data |
| Sortable / filterable table | `createDataTable`, `createFilter` | data |
| Breadcrumb trail derived from route | `createBreadcrumbs` | utilities |
| Overflow / responsive menu (hides overflowing items) | `createOverflow` | utilities |
| Type-safe provide/inject | `createContext` | foundation |
| Reactive registry of ids → values | `createRegistry` | registration |
| Auto-dismissing queue (snackbars, toasts) | `createQueue` | registration |
| Scheduled events over time (timeline, animation) | `createTimeline` | registration |
| Design-token graph (theme, spacing scales) | `createTokens` | registration |
| Floating UI positioning (popover, tooltip, menu) | `usePopover` | system |
| Enter/leave animation orchestration | `usePresence` | system |
| Roving tabindex (list, menubar) | `useRovingFocus` | system |
| Virtual focus (combobox listbox) | `useVirtualFocus` | system |
| Click outside / keyboard shortcut / event listener | `useClickOutside`, `useHotkey`, `useEventListener` | system |
| ResizeObserver / IntersectionObserver / MutationObserver | `useResizeObserver`, etc. | system |
| rAF loop or setTimeout with pause/resume | `useRaf`, `useTimer` | system |
| Responsive breakpoints | `useBreakpoints`, `useMediaQuery` | plugins |
| Localized strings + date/number format | `useLocale`, `useDate` | plugins |
| Theme (light/dark/custom palette) | `useTheme` | plugins |
| RTL direction awareness | `useRtl` | plugins |
| z-index stacking for overlays | `useStack` | plugins |
| Notifications / snackbar queue plugin | `useNotifications` | plugins |
| Feature flags / permission checks | `useFeatures`, `usePermissions` | plugins |
| Persisted state (localStorage / sessionStorage) | `useStorage` | plugins |
| Structured logging with adapters | `useLogger` | plugins |
| SSR-safe mount detection | `useHydration` | plugins |

**Full API and type signatures:** see [references/REFERENCE.md](references/REFERENCE.md).

## Compound-component pattern

All components are headless and compound. Root owns state, children are named sub-components.

```vue
<script setup lang="ts">
  import { Tabs } from '@vuetify/v0/components'
  import { shallowRef } from 'vue'

  const active = shallowRef('overview')
</script>

<template>
  <Tabs.Root v-model="active">
    <Tabs.List>
      <Tabs.Item value="overview">Overview</Tabs.Item>
      <Tabs.Item value="details">Details</Tabs.Item>
    </Tabs.List>
    <Tabs.Panel value="overview">Overview content</Tabs.Panel>
    <Tabs.Panel value="details">Details content</Tabs.Panel>
  </Tabs.Root>
</template>
```

**Available components:**

- *Primitives:* `Atom`, `Portal`, `Presence`
- *Providers:* `Group`, `Locale`, `Scrim`, `Selection`, `Single`, `Step`, `Theme`
- *Actions:* `Button`, `Toggle`
- *Forms:* `Checkbox`, `Combobox`, `Form`, `Input`, `NumberField`, `Radio`, `Rating`, `Select`, `Slider`, `Switch`
- *Disclosure:* `AlertDialog`, `Collapsible`, `Dialog`, `ExpansionPanel`, `Popover`, `Tabs`, `Treeview`
- *Semantic:* `Avatar`, `Breadcrumbs`, `Carousel`, `Pagination`, `Snackbar`, `Splitter`

**More compound examples:** see [references/component-examples.md](references/component-examples.md).

## Must-read rules

### 1. Check utilities before writing helpers

Import from `#v0/utilities` (internal) or `@vuetify/v0` (external):

- Type guards: `isFunction`, `isString`, `isNumber`, `isBoolean`, `isObject`, `isArray`, `isNull`, `isUndefined`, `isNullOrUndefined`, `isPrimitive`, `isSymbol`, `isNaN`, `isElement`
- Data: `mergeDeep`, `clamp`, `range`, `useId`

### 2. Check globals before SSR branches

Import from `#v0/constants/globals`:

- `IN_BROWSER` — replaces `typeof window !== 'undefined'`
- `SUPPORTS_TOUCH`, `SUPPORTS_MATCH_MEDIA`, `SUPPORTS_OBSERVER`, `SUPPORTS_INTERSECTION_OBSERVER`, `SUPPORTS_MUTATION_OBSERVER`

### 3. Reactivity defaults

- `shallowRef` for primitives
- `ref` for objects/arrays
- `toRef` for derived values (default)
- `computed` only when caching expensive work

### 4. Compound components only

Sub-components talk to the root via `createContext`. Never prop-drill state between siblings. Never build a monolithic component when the root + sub-component pattern fits.

**Detailed anti-patterns:** see [references/anti-patterns.md](references/anti-patterns.md).

## Paper and Vuetify relationship

- `@vuetify/v0` — headless (this skill)
- `@vuetify/paper` — styling primitives that depend on v0
- `vuetify` v4 — Material Design framework, integrates v0 via minor releases

When the user asks to "style" a v0 component or build a design system, point them at `@vuetify/paper` or a Paper-based design system (e.g., Emerald, Codex). Keep v0 itself headless.

## Vuetify MCP

For live API schemas, guides, and release notes, prefer the Vuetify MCP server over guessing:

```bash
claude mcp add vuetify-mcp https://mcp.vuetifyjs.com/mcp
```

Useful tools (fully qualified names required):

- `vuetify-mcp:get_vuetify0_component_list` — all components with categories
- `vuetify-mcp:get_vuetify0_composable_list` — all composables with categories
- `vuetify-mcp:get_vuetify0_component_guide` — guide for a named component
- `vuetify-mcp:get_vuetify0_composable_guide` — guide for a named composable
- `vuetify-mcp:get_vuetify0_installation_guide` — installation + bootstrap

## Resources

- Live docs: https://0.vuetifyjs.com
- API reference: [references/REFERENCE.md](references/REFERENCE.md)
- Selection patterns (single, multi, group, nested, step): [references/selection-patterns.md](references/selection-patterns.md)
- Component compound patterns: [references/component-examples.md](references/component-examples.md)
- Anti-patterns and migrations: [references/anti-patterns.md](references/anti-patterns.md)
