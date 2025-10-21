# Composables

Reusable pieces of logic that can be shared across components, providing encapsulated functionality and state management.

<DocsPageFeatures />

## Available Composables

| Name | Description |
| - | - |
| **Foundation** | |
| [createContext](/composables/foundation/create-context) | Create reusable context to share state across components |
| [createPlugin](/composables/foundation/create-plugin) | Create Vue plugins with standardized patterns |
| [createTrinity](/composables/foundation/create-trinity) | Create context provider/consumer pattern utilities |
| **Registration** | |
| [useRegistry](/composables/registration/use-registry) | Foundation for registration-based systems |
| [useProxyRegistry](/composables/registration/use-proxy-registry) | Proxy-based registry with automatic reactivity |
| [useTimeline](/composables/registration/use-timeline) | Bounded undo/redo system with fixed-size history |
| [useTokens](/composables/registration/use-tokens) | Design token management system |
| **Selection** | |
| [useFilter](/composables/selection/use-filter) | Filter arrays based on search queries |
| [useGroup](/composables/selection/use-group) | Manage collections with selection capabilities |
| [useSelection](/composables/selection/use-selection) | General selection state management |
| [useSingle](/composables/selection/use-single) | Simplified single-selection wrapper around useGroup |
| [useStep](/composables/selection/use-step) | Manage multi-step processes like forms or wizards |
| **Forms** | |
| [useForm](/composables/forms/use-form) | Form state management and validation |
| [useProxyModel](/composables/forms/use-proxy-model) | Proxy model utilities for reactive data binding |
| **System** | |
| [useEventListener](/composables/system/use-event-listener) | Handle DOM events with automatic cleanup |
| [useIntersectionObserver](/composables/system/use-intersection-observer) | Intersection Observer API wrapper for visibility detection |
| [useKeydown](/composables/system/use-keydown) | Handle keyboard events with automatic cleanup |
| [useMutationObserver](/composables/system/use-mutation-observer) | Mutation Observer API wrapper for DOM change detection |
| [useResizeObserver](/composables/system/use-resize-observer) | Resize Observer API wrapper for element size changes |
| **Plugins** | |
| [useBreakpoints](/composables/plugins/use-breakpoints) | Responsive breakpoint detection for different screen sizes |
| [useFeatures](/composables/plugins/use-features) | Feature flags and A/B testing management |
| [useHydration](/composables/plugins/use-hydration) | Manage SSR hydration process |
| [useLocale](/composables/plugins/use-locale) | Internationalization system for multiple languages |
| [useLogger](/composables/plugins/use-logger) | Logging system with multiple adapters |
| [usePermissions](/composables/plugins/use-permissions) | Role-based access control and permissions management |
| [useStorage](/composables/plugins/use-storage) | Reactive interface to browser storage APIs |
| [useTheme](/composables/plugins/use-theme) | Application theme management with CSS custom properties |
| **Transformers** | |
| [toArray](/composables/transformers/to-array) | Convert any value to an array with null/undefined handling |
| [toReactive](/composables/transformers/to-reactive) | Convert MaybeRef objects to reactive proxies |
