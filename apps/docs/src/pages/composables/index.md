---
title: Vuetify0 Composables - Vue 3 Headless Primitives
meta:
  - name: description
    content: Type-safe Vue 3 composables for headless UI. Selection, forms, theming, tokens, and state management primitives for building custom design systems.
  - name: keywords
    content: composables, Vue 3, headless ui, primitives, selection, forms, theming, state management, TypeScript
---

# Composables

Reusable pieces of logic that can be shared across components, providing encapsulated functionality and state management.

<DocsPageFeatures :frontmatter />

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
| [useRegistry](/composables/registration/use-registry) | Foundation for registration-based systems |
| [useProxyRegistry](/composables/registration/use-proxy-registry) | Proxy-based registry with automatic reactivity |
| [useQueue](/composables/registration/use-queue) | Time-based queue management with automatic timeouts |
| [useTimeline](/composables/registration/use-timeline) | Bounded undo/redo system with fixed-size history |
| [useTokens](/composables/registration/use-tokens) | Design token management system |

## Selection

State management for single and multi-selection patterns.

| Name | Description |
| - | - |
| [useSelection](/composables/selection/use-selection) | General selection state management |
| [useSingle](/composables/selection/use-single) | Single-selection with automatic deselection |
| [useGroup](/composables/selection/use-group) | Multi-selection with tri-state support |
| [useStep](/composables/selection/use-step) | Sequential navigation for wizards and steppers |

## Forms

Form state management and model binding utilities.

| Name | Description |
| - | - |
| [useForm](/composables/forms/use-form) | Form state management and validation |
| [useProxyModel](/composables/forms/use-proxy-model) | Bridge selection context to v-model binding |

## System

Browser API wrappers with automatic lifecycle cleanup.

| Name | Description |
| - | - |
| [useEventListener](/composables/system/use-event-listener) | Handle DOM events with automatic cleanup |
| [useIntersectionObserver](/composables/system/use-intersection-observer) | Intersection Observer API for visibility detection |
| [useKeydown](/composables/system/use-keydown) | Handle keyboard events with automatic cleanup |
| [useMutationObserver](/composables/system/use-mutation-observer) | Mutation Observer API for DOM change detection |
| [useResizeObserver](/composables/system/use-resize-observer) | Resize Observer API for element size changes |
| [useToggleScope](/composables/system/use-toggle-scope) | Conditional effect scope management |

## Plugins

Application-level features installable via Vue plugins.

| Name | Description |
| - | - |
| [useBreakpoints](/composables/plugins/use-breakpoints) | Responsive breakpoint detection |
| [useFeatures](/composables/plugins/use-features) | Feature flags and A/B testing |
| [useHydration](/composables/plugins/use-hydration) | SSR hydration management |
| [useLocale](/composables/plugins/use-locale) | Internationalization system |
| [useLogger](/composables/plugins/use-logger) | Logging system with multiple adapters |
| [usePermissions](/composables/plugins/use-permissions) | Role-based access control |
| [useStorage](/composables/plugins/use-storage) | Reactive browser storage interface |
| [useTheme](/composables/plugins/use-theme) | Theme management with CSS custom properties |

## Utilities

Standalone helpers for common UI patterns.

| Name | Description |
| - | - |
| [useFilter](/composables/utilities/use-filter) | Filter arrays based on search queries |
| [useOverflow](/composables/utilities/use-overflow) | Compute item capacity for responsive truncation |
| [usePagination](/composables/utilities/use-pagination) | Pagination state with navigation methods |
| [useVirtual](/composables/utilities/use-virtual) | Virtual scrolling for large lists |

## Transformers

Value transformation utilities.

| Name | Description |
| - | - |
| [toArray](/composables/transformers/to-array) | Convert any value to an array |
| [toReactive](/composables/transformers/to-reactive) | Convert MaybeRef objects to reactive proxies |
