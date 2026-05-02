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
| [AspectRatio](https://0.vuetifyjs.com/components/primitives/aspect-ratio) | Fixed width-to-height ratio container via CSS `aspect-ratio` |
| [Atom](https://0.vuetifyjs.com/components/primitives/atom) | Polymorphic base element with dynamic `as` prop and renderless mode |
| [Portal](https://0.vuetifyjs.com/components/primitives/portal) | Teleport wrapper with automatic z-index stacking via useStack |
| [Presence](https://0.vuetifyjs.com/components/primitives/presence) | Animation-agnostic mount lifecycle with lazy mounting and exit timing |

#### Providers

| Component | Description |
|-----------|-------------|
| [Group](https://0.vuetifyjs.com/components/providers/group) | Multi-selection with tri-state support |
| [Locale](https://0.vuetifyjs.com/components/providers/locale) | Locale context provider for internationalization |
| [Scrim](https://0.vuetifyjs.com/components/providers/scrim) | Overlay backdrop with click-to-dismiss and z-index management |
| [Selection](https://0.vuetifyjs.com/components/providers/selection) | Multi-selection state with v-model binding |
| [Single](https://0.vuetifyjs.com/components/providers/single) | Single-selection with automatic deselection |
| [Step](https://0.vuetifyjs.com/components/providers/step) | Sequential navigation (first, last, next, prev) |
| [Theme](https://0.vuetifyjs.com/components/providers/theme) | Theme context provider with CSS variable injection |

#### Actions

| Component | Description |
|-----------|-------------|
| [Button](https://0.vuetifyjs.com/components/actions/button) | Button with loading grace period, toggle groups, and icon accessibility |
| [Toggle](https://0.vuetifyjs.com/components/actions/toggle) | Pressable on/off button with standalone and group modes |

#### Forms

| Component | Description |
|-----------|-------------|
| [Checkbox](https://0.vuetifyjs.com/components/forms/checkbox) | Dual-mode checkbox (standalone/group) with tri-state support |
| [Combobox](https://0.vuetifyjs.com/components/forms/combobox) | Filterable selection with autocomplete, virtual focus, and custom input |
| [Form](https://0.vuetifyjs.com/components/forms/form) | Form validation coordinator with submit handling and error aggregation |
| [Input](https://0.vuetifyjs.com/components/forms/input) | Text input with label, description, error messages, and character counting |
| [NumberField](https://0.vuetifyjs.com/components/forms/number-field) | Numeric input with increment/decrement, scrub, and Intl formatting |
| [Radio](https://0.vuetifyjs.com/components/forms/radio) | Radio group with single-selection and keyboard navigation |
| [Select](https://0.vuetifyjs.com/components/forms/select) | Dropdown selection with virtual focus and multi-select support |
| [Rating](https://0.vuetifyjs.com/components/forms/rating) | Star/icon rating with hover preview, half-stars, and keyboard navigation |
| [Slider](https://0.vuetifyjs.com/components/forms/slider) | Range input with snapping, range mode, and custom tracks |
| [Switch](https://0.vuetifyjs.com/components/forms/switch) | Toggle switch with on/off states and label association |

#### Disclosure

| Component | Description |
|-----------|-------------|
| [AlertDialog](https://0.vuetifyjs.com/components/disclosure/alert-dialog) | Confirmation dialog with deferred close and `wait()`/`close()` pattern |
| [Collapsible](https://0.vuetifyjs.com/components/disclosure/collapsible) | Single-item disclosure toggle for showing and hiding content |
| [Dialog](https://0.vuetifyjs.com/components/disclosure/dialog) | Modal dialog using native `<dialog>` with focus management |
| [ExpansionPanel](https://0.vuetifyjs.com/components/disclosure/expansion-panel) | Accordion-style collapsible panels |
| [Popover](https://0.vuetifyjs.com/components/disclosure/popover) | CSS anchor-positioned popup content |
| [Tabs](https://0.vuetifyjs.com/components/disclosure/tabs) | Tab panel navigation with keyboard support and lazy content rendering |
| [Treeview](https://0.vuetifyjs.com/components/disclosure/treeview) | Hierarchical tree with nested selection and expand/collapse |

#### Semantic

| Component | Description |
|-----------|-------------|
| [Avatar](https://0.vuetifyjs.com/components/semantic/avatar) | Image/fallback avatar with priority loading |
| [Breadcrumbs](https://0.vuetifyjs.com/components/semantic/breadcrumbs) | Navigation breadcrumbs with overflow detection and truncation |
| [Carousel](https://0.vuetifyjs.com/components/semantic/carousel) | Scroll-snap slide navigation with multi-slide display and drag/swipe |
| [Image](https://0.vuetifyjs.com/components/semantic/image) | Image with placeholder, error fallback, and lazy loading |
| [Overflow](https://0.vuetifyjs.com/components/semantic/overflow) | Responsive truncation primitive with overflow detection and indicator |
| [Pagination](https://0.vuetifyjs.com/components/semantic/pagination) | Page navigation with semantic `<nav>` wrapper |
| [Snackbar](https://0.vuetifyjs.com/components/semantic/snackbar) | Toast notification with queue, positioning, and auto-dismiss |
| [Splitter](https://0.vuetifyjs.com/components/semantic/splitter) | Resizable panel layout with drag handles |

### Composables

#### Foundation

Core factories that provide the foundation for all other composables:

- [`createContext`](https://0.vuetifyjs.com/composables/foundation/create-context) - Type-safe Vue dependency injection wrapper
- [`createPlugin`](https://0.vuetifyjs.com/composables/foundation/create-plugin) - Vue plugin factory with context provision
- [`createTrinity`](https://0.vuetifyjs.com/composables/foundation/create-trinity) - Context triple pattern: `[use, provide, default]`

#### Registration

Base data structures that most other composables build upon:

- [`createRegistry`](https://0.vuetifyjs.com/composables/registration/create-registry) - Enhanced Map with indexing, caching, and event support
- [`createQueue`](https://0.vuetifyjs.com/composables/registration/create-queue) - FIFO queue with timeout management (notifications/toasts)
- [`createTimeline`](https://0.vuetifyjs.com/composables/registration/create-timeline) - Bounded undo/redo history
- [`createTokens`](https://0.vuetifyjs.com/composables/registration/create-tokens) - Design token registry with alias resolution

#### Data

- [`createDataTable`](https://0.vuetifyjs.com/composables/data/create-data-table) - Data table with sort, filter, pagination, row selection, grouping, and adapter pattern
- [`createFilter`](https://0.vuetifyjs.com/composables/data/create-filter) - Reactive array filtering with multiple modes
- [`createPagination`](https://0.vuetifyjs.com/composables/data/create-pagination) - Lightweight page navigation
- [`createVirtual`](https://0.vuetifyjs.com/composables/data/create-virtual) - Virtual scrolling for large lists

#### Selection

Selection management composables built on `createRegistry`:

- [`createSelection`](https://0.vuetifyjs.com/composables/selection/create-selection) - Base selection with Set-based tracking
- [`createModel`](https://0.vuetifyjs.com/composables/selection/create-model) - Value store for single-value state
- [`createGroup`](https://0.vuetifyjs.com/composables/selection/create-group) - Multi-selection with tri-state/mixed support
- [`createSingle`](https://0.vuetifyjs.com/composables/selection/create-single) - Single-selection specialization
- [`createStep`](https://0.vuetifyjs.com/composables/selection/create-step) - Navigation through items (first, last, next, prev)
- [`createNested`](https://0.vuetifyjs.com/composables/selection/create-nested) - Hierarchical tree management with parent-child relationships and open state

#### Forms

- [`createForm`](https://0.vuetifyjs.com/composables/forms/create-form) - Form validation and state management with async rules
- [`createInput`](https://0.vuetifyjs.com/composables/forms/create-input) - Shared form field state: validation, dirty/pristine, ARIA IDs
- [`createNumberField`](https://0.vuetifyjs.com/composables/forms/create-number-field) - Numeric input state with formatting, stepping, and validation
- [`createValidation`](https://0.vuetifyjs.com/composables/forms/create-validation) - Field-level validation with sync/async rules
- [`createCombobox`](https://0.vuetifyjs.com/composables/forms/create-combobox) - Combobox state management with filtering and virtual focus
- [`createRating`](https://0.vuetifyjs.com/composables/forms/create-rating) - Bounded rating value with discrete items and half-step support
- [`createSlider`](https://0.vuetifyjs.com/composables/forms/create-slider) - Slider state with snapping, range mode, and step control

#### Reactivity

- [`useProxyModel`](https://0.vuetifyjs.com/composables/reactivity/use-proxy-model) - Bridge selection context to component v-model
- [`useProxyRegistry`](https://0.vuetifyjs.com/composables/reactivity/use-proxy-registry) - Convert registry Map to reactive object

#### Utilities

- [`createBreadcrumbs`](https://0.vuetifyjs.com/composables/utilities/create-breadcrumbs) - Breadcrumb navigation model with depth tracking and path traversal
- [`createDragDrop`](https://0.vuetifyjs.com/composables/utilities/create-drag-drop) - Headless drag-and-drop primitive with two registries, pluggable transports, and accessibility-first defaults
- [`createOverflow`](https://0.vuetifyjs.com/composables/utilities/create-overflow) - Container overflow measurement for item capacity

#### Transformers

- [`toArray`](https://0.vuetifyjs.com/composables/transformers/to-array) - Array transformation utilities
- [`toElement`](https://0.vuetifyjs.com/composables/transformers/to-element) - Normalize refs, selectors, and elements to DOM elements
- [`toReactive`](https://0.vuetifyjs.com/composables/transformers/to-reactive) - Reactive object conversion

#### System

- [`useClickOutside`](https://0.vuetifyjs.com/composables/system/use-click-outside) - Click outside detection with cleanup
- [`useDelay`](https://0.vuetifyjs.com/composables/system/use-delay) - Schedule open and close transitions with configurable delays
- [`useEventListener`](https://0.vuetifyjs.com/composables/system/use-event-listener) - Lifecycle-managed event listeners
- [`useHotkey`](https://0.vuetifyjs.com/composables/system/use-hotkey) - Hotkey combinations and sequences
- [`useImage`](https://0.vuetifyjs.com/composables/system/use-image) - Image loading state machine with deferred loading and retry
- [`useIntersectionObserver`](https://0.vuetifyjs.com/composables/system/use-intersection-observer) - Intersection observer with auto-cleanup
- [`useLazy`](https://0.vuetifyjs.com/composables/system/use-lazy) - Deferred content rendering for dialogs, menus, and tooltips
- [`useMediaQuery`](https://0.vuetifyjs.com/composables/system/use-media-query) - Reactive CSS media query matching
- [`useMutationObserver`](https://0.vuetifyjs.com/composables/system/use-mutation-observer) - DOM mutation observation
- [`usePopover`](https://0.vuetifyjs.com/composables/system/use-popover) - Popover positioning and anchor management
- [`useRaf`](https://0.vuetifyjs.com/composables/system/use-raf) - requestAnimationFrame loop with start/stop control
- [`useResizeObserver`](https://0.vuetifyjs.com/composables/system/use-resize-observer) - Resize observer utilities
- [`useRovingFocus`](https://0.vuetifyjs.com/composables/system/use-roving-focus) - Roving tabindex keyboard navigation
- [`usePresence`](https://0.vuetifyjs.com/composables/system/use-presence) - Animation-agnostic mount lifecycle with lazy mounting and exit timing
- [`useTimer`](https://0.vuetifyjs.com/composables/system/use-timer) - Countdown and interval timer with pause/resume
- [`useToggleScope`](https://0.vuetifyjs.com/composables/system/use-toggle-scope) - Conditional effect scope management
- [`useVirtualFocus`](https://0.vuetifyjs.com/composables/system/use-virtual-focus) - Virtual focus management via aria-activedescendant

#### Plugins

Plugin-capable composables following the trinity pattern:

- [`useBreakpoints`](https://0.vuetifyjs.com/composables/plugins/use-breakpoints) - Responsive breakpoint detection
- [`useDate`](https://0.vuetifyjs.com/composables/plugins/use-date) - Date manipulation with adapter pattern and locale sync
- [`useFeatures`](https://0.vuetifyjs.com/composables/plugins/use-features) - Feature flags with variations
- [`useHydration`](https://0.vuetifyjs.com/composables/plugins/use-hydration) - SSR hydration helpers
- [`useLocale`](https://0.vuetifyjs.com/composables/plugins/use-locale) - Internationalization with message interpolation
- [`useLogger`](https://0.vuetifyjs.com/composables/plugins/use-logger) - Logging adapter (consola/pino/custom)
- [`useNotifications`](https://0.vuetifyjs.com/composables/plugins/use-notifications) - Toast/snackbar queue management with positioning
- [`usePermissions`](https://0.vuetifyjs.com/composables/plugins/use-permissions) - RBAC/ABAC permission system
- [`useRtl`](https://0.vuetifyjs.com/composables/plugins/use-rtl) - Right-to-left text direction detection and management
- [`useRules`](https://0.vuetifyjs.com/composables/plugins/use-rules) - Validation rule adapter with built-in rule library
- [`useStack`](https://0.vuetifyjs.com/composables/plugins/use-stack) - Overlay z-index stacking with automatic scrim coordination
- [`useStorage`](https://0.vuetifyjs.com/composables/plugins/use-storage) - Storage adapter (localStorage/sessionStorage/memory)
- [`useTheme`](https://0.vuetifyjs.com/composables/plugins/use-theme) - Theme management with CSS variable injection

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

v0 is in alpha — open for feedback, bug reports, and contributions. See the [Alpha Roadmap](https://0.vuetifyjs.com/roadmap#alpha) for what's planned and how to get involved.

## License

[MIT License](./LICENSE.md)

---

Built with care for the Vue ecosystem. Part of the [Vuetify](https://vuetifyjs.com) family.
