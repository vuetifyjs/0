# Composables

Reusable pieces of logic that can be shared across components, providing encapsulated functionality and state management.

## Available Composables

### Foundation

| Name | Description |
| - | - |
| [createContext](/composables/foundation/create-context) | Create reusable context to share state across components |
| [createPlugin](/composables/foundation/create-plugin) |  |
| [createTrinity](/composables/foundation/create-trinity) | Standardized context pattern utility |

### Plugins

| Name | Description |
| - | - |
| [useBreakpoints](/composables/plugin/use-breakpoints) | Responsive breakpoint detection for different screen sizes |
| [useHydration](/composables/plugin/use-hydration) | Manage SSR hydration process |
| [useLocale](/composables/plugin/use-locale) | Internationalization system for multiple languages |
| [useStorage](/composables/plugin/use-storage) | Reactive interface to browser storage APIs |
| [useTheme](/composables/plugin/use-theme) | Application theme management with CSS custom properties |

### Registration

| Name | Description |
| - | - |
| [useRegistry](/composables/registration/use-registry) | Foundation for registration-based systems |
| [useProxyModel](/composables/registration/use-proxy-model) |  |
| [useTokens](/composables/registration/use-tokens) | Design token management system |

### Selection

| Name | Description |
| - | - |
| [useFilter](/composables/selection/use-filter) | Filter arrays based on search queries |
| [useGroup](/composables/selection/use-group) | Manage collections with selection capabilities |
| [useSelection](/composables/selection/use-selection) |  |
| [useSingle](/composables/selection/use-single) | Simplified single-selection wrapper around useGroup |
| [useStep](/composables/selection/use-step) | Manage multi-step processes like forms or wizards |

### System

| Name | Description |
| - | - |
| [useKeydown](/composables/system/use-keydown) | Handle keyboard events with automatic cleanup |
| [useLayout](/composables/system/use-layout) |  |
| [useLogger](/composables/system/use-logger) |  |
