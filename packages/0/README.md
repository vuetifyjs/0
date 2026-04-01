<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://vuetifyjs.b-cdn.net/docs/images/logos/vzero-logo-dark.png">
    <img alt="Vuetify Zero Logo" src="https://vuetifyjs.b-cdn.net/docs/images/logos/vzero-logo-light.png" height="150">
  </picture>
</div>

<p align="center">
  <a href="https://codecov.io/github/vuetifyjs/0">
    <img src="https://img.shields.io/codecov/c/github/vuetifyjs/0" alt="Coverage">
  </a>
  <a href="https://www.npmjs.com/package/@vuetify/v0">
    <img src="https://img.shields.io/npm/dt/@vuetify/v0.svg" alt="Downloads">
  </a>
  <a href="https://www.npmjs.com/package/@vuetify/v0">
    <img src="https://img.shields.io/npm/dm/@vuetify/v0.svg" alt="Downloads">
  </a>
  <br>
  <a href="https://github.com/vuetifyjs/0/blob/master/LICENSE.md">
    <img src="https://img.shields.io/npm/l/@vuetify/v0.svg" alt="License">
  </a>
  <a href="https://community.vuetifyjs.com">
    <img src="https://discordapp.com/api/guilds/340160225338195969/widget.png" alt="Chat">
  </a>
</p>

# @vuetify/v0

Headless Vue 3 UI primitives and composables for building modern applications and design systems. `@vuetify/v0` is the foundation of the Vuetify ecosystem, offering lightweight, unstyled building blocks with full TypeScript support and accessibility features built-in.

> **Note:** This package is in early development (pre-1.0). APIs may change between minor versions.

## Repository Structure

This is a **pnpm monorepo** containing:

| Package | Description |
|---------|-------------|
| [`@vuetify/v0`](./packages/0) | Core headless components and composables |
| [`@vuetify/paper`](./packages/paper) | Styling and layout primitives |
| [`apps/docs`](./apps/docs) | Documentation site ([0.vuetifyjs.com](https://0.vuetifyjs.com)) |
| [`apps/playground`](./apps/playground) | Interactive development environment |

## Requirements

- **Node.js** >= 22
- **pnpm** >= 10.6
- **Vue** >= 3.5.0

## Installation

```bash
npm install @vuetify/v0@latest
# or
pnpm add @vuetify/v0
# or
yarn add @vuetify/v0
# or
bun add @vuetify/v0
```

## Exports

The package provides tree-shakeable subpath exports:

```ts
import { ... } from '@vuetify/v0'            // Everything
import { ... } from '@vuetify/v0/components' // Components only
import { ... } from '@vuetify/v0/composables' // Composables only
import { ... } from '@vuetify/v0/utilities'  // Utilities only
import { ... } from '@vuetify/v0/types'      // Types only
import { ... } from '@vuetify/v0/constants'  // Constants only
import { ... } from '@vuetify/v0/date'       // Date adapter and utilities
```

## What's Included

### Components

#### Primitives

| Component | Description |
|-----------|-------------|
| **Atom** | Polymorphic base element with dynamic `as` prop and renderless mode |
| **Portal** | Teleport wrapper with automatic z-index stacking via useStack |

#### Providers

| Component | Description |
|-----------|-------------|
| **Group** | Multi-selection with tri-state support |
| **Locale** | Locale context provider for internationalization |
| **Scrim** | Overlay backdrop with click-to-dismiss and z-index management |
| **Selection** | Multi-selection state with v-model binding |
| **Single** | Single-selection with automatic deselection |
| **Step** | Sequential navigation (first, last, next, prev) |
| **Theme** | Theme context provider with CSS variable injection |

#### Actions

| Component | Description |
|-----------|-------------|
| **Button** | Button with loading grace period, toggle groups, and icon accessibility |

#### Forms

| Component | Description |
|-----------|-------------|
| **Checkbox** | Dual-mode checkbox (standalone/group) with tri-state support |
| **Combobox** | Filterable selection with autocomplete, virtual focus, and custom input |
| **Form** | Form validation coordinator with submit handling and error aggregation |
| **Input** | Text input with label, description, error messages, and character counting |
| **Radio** | Radio group with single-selection and keyboard navigation |
| **Select** | Dropdown selection with virtual focus and multi-select support |
| **Slider** | Range input with snapping, range mode, and custom tracks |
| **Switch** | Toggle switch with on/off states and label association |

#### Disclosure

| Component | Description |
|-----------|-------------|
| **Dialog** | Modal dialog using native `<dialog>` with focus management |
| **ExpansionPanel** | Accordion-style collapsible panels |
| **Popover** | CSS anchor-positioned popup content |
| **Tabs** | Tab panel navigation with keyboard support and lazy content rendering |
| **Treeview** | Hierarchical tree with nested selection and expand/collapse |

#### Semantic

| Component | Description |
|-----------|-------------|
| **Avatar** | Image/fallback avatar with priority loading |
| **Breadcrumbs** | Navigation breadcrumbs with overflow detection and truncation |
| **Pagination** | Page navigation with semantic `<nav>` wrapper |
| **Snackbar** | Toast notification with queue, positioning, and auto-dismiss |
| **Splitter** | Resizable panel layout with drag handles |

### Composables

#### Foundation

Core factories that provide the foundation for all other composables:

- **`createContext`** - Type-safe Vue dependency injection wrapper
- **`createPlugin`** - Vue plugin factory with context provision
- **`createTrinity`** - Context triple pattern: `[use, provide, default]`

#### Registration

Base data structures that most other composables build upon:

- **`createRegistry`** - Enhanced Map with indexing, caching, and event support
- **`createQueue`** - FIFO queue with timeout management (notifications/toasts)
- **`createTimeline`** - Bounded undo/redo history
- **`createTokens`** - Design token registry with alias resolution

#### Data

- **`createDataTable`** - Data table with sort, filter, pagination, row selection, grouping, and adapter pattern
- **`createFilter`** - Reactive array filtering with multiple modes
- **`createPagination`** - Lightweight page navigation
- **`createVirtual`** - Virtual scrolling for large lists

#### Selection

Selection management composables built on `createRegistry`:

- **`createSelection`** - Base selection with Set-based tracking
- **`createModel`** - Value store for single-value state
- **`createGroup`** - Multi-selection with tri-state/mixed support
- **`createSingle`** - Single-selection specialization
- **`createStep`** - Navigation through items (first, last, next, prev)
- **`createNested`** - Hierarchical tree management with parent-child relationships and open state

#### Forms

- **`createForm`** - Form validation and state management with async rules
- **`createValidation`** - Field-level validation with sync/async rules
- **`createCombobox`** - Combobox state management with filtering and virtual focus
- **`createSlider`** - Slider state with snapping, range mode, and step control

#### Reactivity

- **`useProxyModel`** - Bridge selection context to component v-model
- **`useProxyRegistry`** - Convert registry Map to reactive object

#### Utilities

- **`createBreadcrumbs`** - Breadcrumb navigation model with depth tracking and path traversal
- **`createOverflow`** - Container overflow measurement for item capacity

#### Transformers

- **`toArray`** - Array transformation utilities
- **`toElement`** - Normalize refs, selectors, and elements to DOM elements
- **`toReactive`** - Reactive object conversion

#### System

- **`useClickOutside`** - Click outside detection with cleanup
- **`useEventListener`** - Lifecycle-managed event listeners
- **`useHotkey`** - Hotkey combinations and sequences
- **`useIntersectionObserver`** - Intersection observer with auto-cleanup
- **`useLazy`** - Deferred content rendering for dialogs, menus, and tooltips
- **`useMediaQuery`** - Reactive CSS media query matching
- **`useMutationObserver`** - DOM mutation observation
- **`usePopover`** - Popover positioning and anchor management
- **`useRaf`** - requestAnimationFrame loop with start/stop control
- **`useResizeObserver`** - Resize observer utilities
- **`useRovingFocus`** - Roving tabindex keyboard navigation
- **`useTimer`** - Countdown and interval timer with pause/resume
- **`useToggleScope`** - Conditional effect scope management
- **`useVirtualFocus`** - Virtual focus management via aria-activedescendant

#### Plugins

Plugin-capable composables following the trinity pattern:

- **`useBreakpoints`** - Responsive breakpoint detection
- **`useDate`** - Date manipulation with adapter pattern and locale sync
- **`useFeatures`** - Feature flags with variations
- **`useHydration`** - SSR hydration helpers
- **`useLocale`** - Internationalization with message interpolation
- **`useLogger`** - Logging adapter (consola/pino/custom)
- **`useNotifications`** - Toast/snackbar queue management with positioning
- **`usePermissions`** - RBAC/ABAC permission system
- **`useRtl`** - Right-to-left text direction detection and management
- **`useRules`** - Validation rule adapter with built-in rule library
- **`useStack`** - Overlay z-index stacking with automatic scrim coordination
- **`useStorage`** - Storage adapter (localStorage/sessionStorage/memory)
- **`useTheme`** - Theme management with CSS variable injection

## Design Principles

- **Headless First**: Components provide logic and accessibility without imposed styling
- **Slot-Driven**: Maximum flexibility through comprehensive slot APIs
- **CSS Variables**: All styling configurable via `--v0-*` custom properties
- **TypeScript Native**: Full type safety with generics for extensibility
- **Minimal Dependencies**: Only Vue 3.5+ required (markdown libraries optional)
- **Composable Architecture**: Reusable logic through Vue 3 composables

## Documentation

For detailed API documentation, examples, and guides, visit [0.vuetifyjs.com](https://0.vuetifyjs.com).

## Development

```bash collapse
# Install dependencies
pnpm install

# Start playground
pnpm dev

# Start documentation site
pnpm dev:docs

# Run tests
pnpm test

# Run tests (CI mode)
pnpm test:run

# Type check
pnpm typecheck

# Lint
pnpm lint:fix

# Full validation (lint + typecheck + test)
pnpm validate
```

## Contributing

We are not currently accepting external contributions. Check back later or join our [Discord community](https://community.vuetifyjs.com) for updates.

## License

[MIT License](./LICENSE.md)

---

Built with care for the Vue ecosystem. Part of the [Vuetify](https://vuetifyjs.com) family.
