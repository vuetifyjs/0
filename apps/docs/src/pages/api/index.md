---
title: API Reference - Vuetify0 Components & Composables
meta:
  - name: description
    content: Complete API reference for all Vuetify0 components and composables. Explore props, events, slots, options, and methods with detailed documentation.
  - name: keywords
    content: api, reference, props, events, slots, methods, options, components, composables
features:
  category: API
  label: API Reference
  level: 1
related:
  - /components
  - /composables
---

# API Reference

Complete API documentation for all @vuetify/v0 components and composables.

<DocsPageFeatures :frontmatter />

## Components

Detailed API reference for each component including props, events, and slots.

| Component | Description |
| - | - |
| [Atom](/api/atom) | Polymorphic element base component |
| [Avatar](/api/avatar) | Image with fallback support |
| [Checkbox](/api/checkbox) | Checkbox with indeterminate support |
| [Dialog](/api/dialog) | Modal dialog with focus management |
| [ExpansionPanel](/api/expansion-panel) | Collapsible accordion panels |
| [Group](/api/group) | Multi-selection with tri-state |
| [Pagination](/api/pagination) | Page navigation component |
| [Popover](/api/popover) | Anchor-positioned popups |
| [Radio](/api/radio) | Radio button group |
| [Scrim](/api/scrim) | Overlay backdrop |
| [Selection](/api/selection) | Multi-selection state provider |
| [Single](/api/single) | Single-selection provider |
| [Step](/api/step) | Sequential navigation provider |
| [Tabs](/api/tabs) | Tabbed navigation |

## Composables

Detailed API reference for each composable including options, properties, and methods.

### Foundation

| Composable | Description |
| - | - |
| [createContext](/api/create-context) | Type-safe provide/inject |
| [createPlugin](/api/create-plugin) | Vue plugin factory |
| [createTrinity](/api/create-trinity) | Provider/consumer pattern utilities |

### Registration

| Composable | Description |
| - | - |
| [createRegistry](/api/create-registry) | Foundation for registration systems |
| [createQueue](/api/create-queue) | Time-based queue management |
| [createTimeline](/api/create-timeline) | Bounded undo/redo system |
| [createTokens](/api/create-tokens) | Design token management |

### Selection

| Composable | Description |
| - | - |
| [createSelection](/api/create-selection) | General selection state |
| [createSingle](/api/create-single) | Single-selection with auto-deselection |
| [createGroup](/api/create-group) | Multi-selection with tri-state |
| [createNested](/api/create-nested) | Hierarchical tree management |
| [createStep](/api/create-step) | Sequential navigation |

### Forms

| Composable | Description |
| - | - |
| [createForm](/api/create-form) | Form state and validation |

### Reactivity

| Composable | Description |
| - | - |
| [useProxyModel](/api/use-proxy-model) | Bridge selection to v-model |
| [useProxyRegistry](/api/use-proxy-registry) | Proxy-based registry with reactivity |

### System

| Composable | Description |
| - | - |
| [useEventListener](/api/use-event-listener) | DOM events with cleanup |
| [useHotkey](/api/use-hotkey) | Hotkey combinations |
| [useClickOutside](/api/use-click-outside) | Click outside detection |
| [useIntersectionObserver](/api/use-intersection-observer) | Visibility detection |
| [useLazy](/api/use-lazy) | Deferred content rendering |
| [useMutationObserver](/api/use-mutation-observer) | DOM change detection |
| [useResizeObserver](/api/use-resize-observer) | Element size changes |
| [useMediaQuery](/api/use-media-query) | CSS media query matching |
| [useToggleScope](/api/use-toggle-scope) | Conditional effect scope |

### Plugins

| Composable | Description |
| - | - |
| [useBreakpoints](/api/use-breakpoints) | Responsive breakpoints |
| [useDate](/api/use-date) | Date manipulation with adapters |
| [useFeatures](/api/use-features) | Feature flags |
| [useHydration](/api/use-hydration) | SSR hydration |
| [useLocale](/api/use-locale) | Internationalization |
| [useLogger](/api/use-logger) | Logging with adapters |
| [usePermissions](/api/use-permissions) | Role-based access |
| [useStack](/api/use-stack) | Overlay z-index stacking |
| [useStorage](/api/use-storage) | Reactive browser storage |
| [useTheme](/api/use-theme) | Theme management |

### Utilities

| Composable | Description |
| - | - |
| [createFilter](/api/create-filter) | Array filtering |
| [createOverflow](/api/create-overflow) | Item capacity computation |
| [createPagination](/api/create-pagination) | Pagination state |
| [createVirtual](/api/create-virtual) | Virtual scrolling |

### Transformers

| Composable | Description |
| - | - |
| [toArray](/api/to-array) | Convert to array |
| [toReactive](/api/to-reactive) | Convert to reactive proxy |
