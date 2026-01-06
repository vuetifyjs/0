---
title: API Reference - Vuetify0 Components & Composables
meta:
  - name: description
    content: Complete API reference for all Vuetify0 components and composables. Props, events, slots, options, and methods.
  - name: keywords
    content: api, reference, props, events, slots, methods, options, components, composables
features:
  category: API
  label: API Reference
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
| [Dialog](/api/dialog) | Modal dialog with focus management |
| [ExpansionPanel](/api/expansion-panel) | Collapsible accordion panels |
| [Group](/api/group) | Multi-selection with tri-state |
| [Pagination](/api/pagination) | Page navigation component |
| [Popover](/api/popover) | Anchor-positioned popups |
| [Selection](/api/selection) | Multi-selection state provider |
| [Single](/api/single) | Single-selection provider |
| [Step](/api/step) | Sequential navigation provider |

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
| [useMutationObserver](/api/use-mutation-observer) | DOM change detection |
| [useResizeObserver](/api/use-resize-observer) | Element size changes |
| [useMediaQuery](/api/use-media-query) | CSS media query matching |
| [useToggleScope](/api/use-toggle-scope) | Conditional effect scope |

### Plugins

| Composable | Description |
| - | - |
| [useBreakpoints](/api/use-breakpoints) | Responsive breakpoints |
| [useFeatures](/api/use-features) | Feature flags |
| [useHydration](/api/use-hydration) | SSR hydration |
| [useLocale](/api/use-locale) | Internationalization |
| [useLogger](/api/use-logger) | Logging with adapters |
| [usePermissions](/api/use-permissions) | Role-based access |
| [useStorage](/api/use-storage) | Reactive browser storage |
| [useTheme](/api/use-theme) | Theme management |

### Utilities

| Composable | Description |
| - | - |
| [useFilter](/api/use-filter) | Array filtering |
| [useOverflow](/api/use-overflow) | Item capacity computation |
| [usePagination](/api/use-pagination) | Pagination state |
| [useVirtual](/api/use-virtual) | Virtual scrolling |

### Transformers

| Composable | Description |
| - | - |
| [toArray](/api/to-array) | Convert to array |
| [toReactive](/api/to-reactive) | Convert to reactive proxy |
