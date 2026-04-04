// Types
import type { DependencyGraph, Feature, FeatureMeta } from './types'

import dependencyGraph from './dependencies.json'

import maturity from '../../../../packages/0/src/maturity.json'

const META: Record<string, FeatureMeta> = {
  // Foundation
  createContext: {
    name: 'Context',
    summary: 'Dependency injection with Vue provide/inject',
    useCases: ['Component communication', 'Shared state', 'Plugin architecture'],
    tags: ['di', 'provide', 'inject'],
  },
  createTrinity: {
    name: 'Trinity',
    summary: 'Structured tuple factory for composable APIs',
    useCases: ['Composable design', 'API consistency'],
    tags: ['pattern', 'api'],
  },
  createPlugin: {
    name: 'Plugin',
    summary: 'Vue plugin wrapper with context handling',
    useCases: ['App-level features', 'Global configuration'],
    tags: ['plugin', 'app'],
  },
  createRegistry: {
    name: 'Registry',
    summary: 'Track and manage child component instances',
    useCases: ['Tab panels', 'Accordion items', 'Carousel slides'],
    tags: ['registration', 'children', 'instances'],
  },
  createSelection: {
    name: 'Selection',
    summary: 'Single and multi-select state management',
    useCases: ['Dropdown menus', 'Tab selection', 'List filtering'],
    tags: ['select', 'single', 'multi', 'state'],
  },
  createSingle: {
    name: 'Single Select',
    summary: 'Exactly-one selection with mandatory support',
    useCases: ['Tabs', 'Radio groups', 'Navigation'],
    tags: ['select', 'single', 'mandatory'],
  },
  createGroup: {
    name: 'Group Select',
    summary: 'Multi-select with grouped items',
    useCases: ['Checkbox groups', 'Multi-tag selection', 'Filter panels'],
    tags: ['select', 'multi', 'group'],
  },
  createStep: {
    name: 'Stepper',
    summary: 'Sequential step navigation',
    useCases: ['Wizards', 'Onboarding flows', 'Multi-step forms'],
    tags: ['step', 'wizard', 'sequence'],
  },
  createModel: {
    name: 'Model',
    summary: 'Reactive value store for selection state',
    useCases: ['Form values', 'Controlled inputs'],
    tags: ['model', 'value', 'state'],
  },
  createForm: {
    name: 'Form',
    summary: 'Form state management with validation',
    useCases: ['Login forms', 'Settings pages', 'Data entry'],
    tags: ['form', 'validation', 'submit'],
  },
  createCombobox: {
    name: 'Combobox',
    summary: 'Autocomplete with keyboard navigation',
    useCases: ['Search inputs', 'Tag entry', 'Command palettes'],
    tags: ['combobox', 'autocomplete', 'search'],
  },
  createSlider: {
    name: 'Slider',
    summary: 'Range input with thumb control',
    useCases: ['Volume controls', 'Price filters', 'Settings'],
    tags: ['slider', 'range', 'input'],
  },
  createRating: {
    name: 'Rating',
    summary: 'Star rating input',
    useCases: ['Reviews', 'Feedback', 'Scoring'],
    tags: ['rating', 'stars', 'input'],
  },
  createDataTable: {
    name: 'Data Table',
    summary: 'Sortable, filterable table with pagination',
    useCases: ['Admin dashboards', 'Reports', 'Data management'],
    tags: ['table', 'sort', 'filter', 'paginate'],
  },
  createFilter: {
    name: 'Filter',
    summary: 'Client-side data filtering',
    useCases: ['Search results', 'List filtering', 'Table columns'],
    tags: ['filter', 'search', 'data'],
  },
  createPagination: {
    name: 'Pagination',
    summary: 'Page-based data navigation',
    useCases: ['Table pages', 'Gallery pages', 'Search results'],
    tags: ['pagination', 'pages', 'navigation'],
  },
  createVirtual: {
    name: 'Virtual Scroll',
    summary: 'Render only visible items in large lists',
    useCases: ['Long lists', 'Chat logs', 'Data grids'],
    tags: ['virtual', 'scroll', 'performance'],
  },
  useTheme: {
    name: 'Theme',
    summary: 'Light/dark mode with custom color tokens',
    useCases: ['Dark mode toggle', 'Brand theming', 'User preferences'],
    tags: ['theme', 'dark', 'light', 'colors'],
  },
  useLocale: {
    name: 'Locale',
    summary: 'Internationalization with adapter support',
    useCases: ['Multi-language apps', 'RTL support', 'Date formatting'],
    tags: ['i18n', 'locale', 'translation'],
  },
  useStorage: {
    name: 'Storage',
    summary: 'Persistent state with localStorage/sessionStorage',
    useCases: ['User preferences', 'Draft saving', 'Cache'],
    tags: ['storage', 'persist', 'local'],
  },
  useFeatures: {
    name: 'Feature Flags',
    summary: 'Boolean feature flags with adapter support',
    useCases: ['A/B testing', 'Progressive rollout', 'Beta features'],
    tags: ['features', 'flags', 'toggle'],
  },
  useLogger: {
    name: 'Logger',
    summary: 'Structured logging with adapter support',
    useCases: ['Debug output', 'Error tracking', 'Analytics'],
    tags: ['logging', 'debug', 'console'],
  },
  usePermissions: {
    name: 'Permissions',
    summary: 'Role-based access control',
    useCases: ['Admin panels', 'Feature gating', 'User roles'],
    tags: ['permissions', 'rbac', 'access'],
  },
  useBreakpoints: {
    name: 'Breakpoints',
    summary: 'Reactive viewport breakpoints',
    useCases: ['Responsive layouts', 'Mobile detection', 'Adaptive UI'],
    tags: ['responsive', 'viewport', 'mobile'],
  },
  useDate: {
    name: 'Date',
    summary: 'Date manipulation with adapter support',
    useCases: ['Date pickers', 'Calendars', 'Time formatting'],
    tags: ['date', 'time', 'calendar'],
  },
  useEventListener: {
    name: 'Event Listener',
    summary: 'Auto-cleanup event listener binding',
    useCases: ['Keyboard shortcuts', 'Scroll handlers', 'Window events'],
    tags: ['events', 'listener', 'cleanup'],
  },
  useHotkey: {
    name: 'Hotkey',
    summary: 'Keyboard shortcut registration',
    useCases: ['App shortcuts', 'Accessibility', 'Power user features'],
    tags: ['keyboard', 'shortcut', 'hotkey'],
  },
  useClickOutside: {
    name: 'Click Outside',
    summary: 'Detect clicks outside an element',
    useCases: ['Dropdown close', 'Modal dismiss', 'Menu collapse'],
    tags: ['click', 'outside', 'dismiss'],
  },
  usePopover: {
    name: 'Popover',
    summary: 'Floating UI positioning and visibility',
    useCases: ['Tooltips', 'Dropdowns', 'Context menus'],
    tags: ['popover', 'float', 'position'],
  },
  useStack: {
    name: 'Stack',
    summary: 'Z-index stacking order for overlays',
    useCases: ['Modals', 'Dialogs', 'Drawers'],
    tags: ['stack', 'zindex', 'overlay'],
  },
  useResizeObserver: {
    name: 'Resize Observer',
    summary: 'Reactive element size tracking',
    useCases: ['Responsive components', 'Chart resizing', 'Layout shifts'],
    tags: ['resize', 'observer', 'size'],
  },
  useIntersectionObserver: {
    name: 'Intersection Observer',
    summary: 'Detect element visibility in viewport',
    useCases: ['Lazy loading', 'Infinite scroll', 'Analytics'],
    tags: ['intersection', 'visibility', 'lazy'],
  },
}

const graph = dependencyGraph as DependencyGraph

export function buildCatalog (): Feature[] {
  const features: Feature[] = []

  for (const [id, meta] of Object.entries(META)) {
    const composable = (maturity.composables as Record<string, { level: string, since?: string | null, category: string }>)[id]
    const component = (maturity.components as Record<string, { level: string, since?: string | null, category: string }>)[id]
    const entry = composable ?? component

    if (!entry) continue

    const type = composable ? 'composable' : 'component'
    const deps = type === 'composable'
      ? (graph.composables[id] ?? [])
      : (graph.components[id] ?? [])

    features.push({
      id,
      type,
      category: entry.category,
      maturity: entry.level as Feature['maturity'],
      since: entry.since ?? '',
      dependencies: deps,
      ...meta,
    })
  }

  return features
}
