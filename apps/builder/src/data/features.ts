// Icons
import {
  mdiArchive,
  mdiCheckboxMarked,
  mdiCog,
  mdiCube,
  mdiFilterVariant,
  mdiNetwork,
  mdiPuzzle,
  mdiStar,
  mdiTable,
  mdiTextBox,
} from '@mdi/js'

// Types
import type { DependencyGraph, Feature, FeatureMeta } from './types'

import dependencyGraph from './dependencies.json'

import maturity from '../../../../packages/0/src/maturity.json'

export const CATEGORY_ICONS: Record<string, string> = {
  foundation: mdiCube,
  registration: mdiArchive,
  selection: mdiCheckboxMarked,
  forms: mdiTextBox,
  data: mdiTable,
  plugins: mdiPuzzle,
  system: mdiNetwork,
  reactivity: mdiCog,
  transformers: mdiCog,
  semantic: mdiStar,
  utilities: mdiFilterVariant,
}

const META: Record<string, FeatureMeta> = {
  // Foundation
  createContext: {
    name: 'Context',
    summary: 'Dependency injection with Vue provide/inject',
    description: 'Creates type-safe provide/inject pairs for component communication. Supports optional injection, default values, and nested context overrides for building plugin architectures.',
    example: `const [provide, inject] = createContext('tabs')
// Parent: provide({ selected })
// Child: const { selected } = inject()`,
    useCases: ['Component communication', 'Shared state', 'Plugin architecture'],
    tags: ['di', 'provide', 'inject'],
    icon: mdiCube,
  },
  createTrinity: {
    name: 'Trinity',
    summary: 'Structured tuple factory for composable APIs',
    description: 'Enforces a consistent [setup, provide, inject] tuple pattern for composable APIs. Ensures every composable exposes the same three-part interface for predictable consumption.',
    example: `const [setup, provide, inject] = createTrinity('tabs')
// setup() returns reactive state
// provide() shares it with children`,
    useCases: ['Composable design', 'API consistency'],
    tags: ['pattern', 'api'],
    icon: mdiCube,
  },
  createPlugin: {
    name: 'Plugin',
    summary: 'Vue plugin wrapper with context handling',
    description: 'Wraps composable setup into a standard Vue plugin with app-level configuration. Handles context injection and provides a clean app.use() interface.',
    example: `const ThemePlugin = createPlugin('theme', options => {
  return createTheme(options)
})
app.use(ThemePlugin, { dark: true })`,
    useCases: ['App-level features', 'Global configuration'],
    tags: ['plugin', 'app'],
    icon: mdiCube,
  },
  createRegistry: {
    name: 'Registry',
    summary: 'Track and manage child component instances',
    description: 'Maintains an ordered registry of child components with ticket-based registration. Supports dynamic add/remove, reordering, and iteration over registered items.',
    example: `const registry = createRegistry()
// Child calls: registry.register(id, payload)
// Parent iterates: registry.values()`,
    useCases: ['Tab panels', 'Accordion items', 'Carousel slides'],
    tags: ['registration', 'children', 'instances'],
    icon: mdiArchive,
  },
  createSelection: {
    name: 'Selection',
    summary: 'Single and multi-select state management',
    description: 'Manages selected items with support for single-select, multi-select, and mandatory selection. Provides reactive state for each item including isSelected, toggle, and select methods.',
    example: `const selection = createSelection()
selection.onboard([
  { id: 'home', value: 'Home' },
  { id: 'about', value: 'About' },
])
const items = selection.values()`,
    useCases: ['Dropdown menus', 'Tab selection', 'List filtering'],
    tags: ['select', 'single', 'multi', 'state'],
    icon: mdiCheckboxMarked,
  },
  createSingle: {
    name: 'Single Select',
    summary: 'Exactly-one selection with mandatory support',
    description: 'Enforces single-item selection with optional mandatory mode that prevents deselection. Ideal for navigation and tab-style interfaces where exactly one item must be active.',
    example: `const single = createSingle({ mandatory: true })
single.select('tab-1')
// single.selected.value === 'tab-1'`,
    useCases: ['Tabs', 'Radio groups', 'Navigation'],
    tags: ['select', 'single', 'mandatory'],
    icon: mdiCheckboxMarked,
  },
  createGroup: {
    name: 'Group Select',
    summary: 'Multi-select with grouped items',
    description: 'Manages multi-select state where multiple items can be active simultaneously. Supports select-all, toggle, and range selection patterns.',
    example: `const group = createGroup()
group.select('a')
group.select('b')
// group.selected.value === ['a', 'b']`,
    useCases: ['Checkbox groups', 'Multi-tag selection', 'Filter panels'],
    tags: ['select', 'multi', 'group'],
    icon: mdiCheckboxMarked,
  },
  createStep: {
    name: 'Stepper',
    summary: 'Sequential step navigation',
    description: 'Tracks progress through an ordered sequence of steps with next/previous navigation, validation gates, and completion state for each step.',
    example: `const stepper = createStep({ steps: 4 })
stepper.next()
// stepper.current.value === 1`,
    useCases: ['Wizards', 'Onboarding flows', 'Multi-step forms'],
    tags: ['step', 'wizard', 'sequence'],
    icon: mdiCheckboxMarked,
  },
  createModel: {
    name: 'Model',
    summary: 'Reactive value store for selection state',
    description: 'Lightweight reactive value container used internally by selection composables. Provides a consistent interface for reading and writing selection state.',
    example: `const model = createModel()
model.value = 'active'
// Reactive — triggers watchers`,
    useCases: ['Form values', 'Controlled inputs'],
    tags: ['model', 'value', 'state'],
    icon: mdiCheckboxMarked,
  },
  createForm: {
    name: 'Form',
    summary: 'Form state management with validation',
    description: 'Complete form lifecycle management with field registration, validation rules, dirty/touched tracking, and submit handling. Supports async validation and field-level error messages.',
    example: `const form = createForm()
form.register('email', {
  rules: [v => !!v || 'Required'],
})
const { valid } = form.validate()`,
    useCases: ['Login forms', 'Settings pages', 'Data entry'],
    tags: ['form', 'validation', 'submit'],
    icon: mdiTextBox,
  },
  createCombobox: {
    name: 'Combobox',
    summary: 'Autocomplete with keyboard navigation',
    description: 'Combines text input with a filterable dropdown list. Handles keyboard navigation, highlighting, selection, and custom filtering for typeahead experiences.',
    example: `const combobox = createCombobox({
  items: ['Apple', 'Banana', 'Cherry'],
})
// Provides filtered items, highlight index`,
    useCases: ['Search inputs', 'Tag entry', 'Command palettes'],
    tags: ['combobox', 'autocomplete', 'search'],
    icon: mdiTextBox,
  },
  createSlider: {
    name: 'Slider',
    summary: 'Range input with thumb control',
    description: 'Headless slider with thumb positioning, step snapping, min/max bounds, and keyboard accessibility. Supports both single-value and range (two-thumb) modes.',
    example: `const slider = createSlider({
  min: 0, max: 100, step: 5,
})
// slider.value.value === 50`,
    useCases: ['Volume controls', 'Price filters', 'Settings'],
    tags: ['slider', 'range', 'input'],
    icon: mdiTextBox,
  },
  createRating: {
    name: 'Rating',
    summary: 'Star rating input',
    description: 'Interactive rating input with configurable scale, half-star support, and hover preview. Provides accessible keyboard navigation and read-only display mode.',
    example: `const rating = createRating({ length: 5 })
// rating.value.value === 3
// rating.hover.value === 4`,
    useCases: ['Reviews', 'Feedback', 'Scoring'],
    tags: ['rating', 'stars', 'input'],
    icon: mdiTextBox,
  },
  createDataTable: {
    name: 'Data Table',
    summary: 'Sortable, filterable table with pagination',
    description: 'Full-featured data table composable with column sorting, multi-column filtering, pagination, and row selection. Supports server-side data loading with reactive query parameters.',
    example: `const table = createDataTable({
  items: users,
  columns: [
    { key: 'name', sortable: true },
    { key: 'email', filterable: true },
  ],
})`,
    useCases: ['Admin dashboards', 'Reports', 'Data management'],
    tags: ['table', 'sort', 'filter', 'paginate'],
    icon: mdiTable,
  },
  createFilter: {
    name: 'Filter',
    summary: 'Client-side data filtering',
    description: 'Reactive filtering engine that applies search queries against item collections. Supports custom filter functions, multiple search keys, and debounced input.',
    example: `const filter = createFilter({
  items: products,
  keys: ['name', 'category'],
})
filter.query.value = 'shoes'`,
    useCases: ['Search results', 'List filtering', 'Table columns'],
    tags: ['filter', 'search', 'data'],
    icon: mdiTable,
  },
  createPagination: {
    name: 'Pagination',
    summary: 'Page-based data navigation',
    description: 'Manages page state with configurable page size, total item count, and computed page ranges. Provides next/previous/goTo navigation and visible page window.',
    example: `const pagination = createPagination({
  total: 100,
  size: 10,
})
// pagination.page.value === 1
// pagination.pages.value === 10`,
    useCases: ['Table pages', 'Gallery pages', 'Search results'],
    tags: ['pagination', 'pages', 'navigation'],
    icon: mdiTable,
  },
  createVirtual: {
    name: 'Virtual Scroll',
    summary: 'Render only visible items in large lists',
    description: 'Renders only the items visible in the viewport for performant handling of large datasets. Supports variable-height items, scroll-to-index, and dynamic content loading.',
    example: `const virtual = createVirtual({
  items: largeList,
  size: 48,
})
// virtual.visible.value — rendered slice`,
    useCases: ['Long lists', 'Chat logs', 'Data grids'],
    tags: ['virtual', 'scroll', 'performance'],
    icon: mdiTable,
  },
  useTheme: {
    name: 'Theme',
    summary: 'Light/dark mode with custom color tokens',
    description: 'Reactive theme system with light/dark mode toggling, custom color tokens, and CSS variable output. Supports nested theme scopes and system preference detection.',
    example: `const theme = useTheme()
theme.global.name.value = 'dark'
// Applies CSS variables to :root`,
    useCases: ['Dark mode toggle', 'Brand theming', 'User preferences'],
    tags: ['theme', 'dark', 'light', 'colors'],
    icon: mdiPuzzle,
  },
  useLocale: {
    name: 'Locale',
    summary: 'Internationalization with adapter support',
    description: 'Adapter-based i18n system supporting vue-i18n, custom backends, or a built-in simple adapter. Provides reactive locale switching, RTL detection, and message formatting.',
    example: `const locale = useLocale()
locale.current.value = 'fr'
const msg = locale.t('greeting')`,
    useCases: ['Multi-language apps', 'RTL support', 'Date formatting'],
    tags: ['i18n', 'locale', 'translation'],
    icon: mdiPuzzle,
  },
  useStorage: {
    name: 'Storage',
    summary: 'Persistent state with localStorage/sessionStorage',
    description: 'Reactive wrapper around Web Storage APIs with automatic serialization, SSR safety, and cross-tab synchronization. Values persist across page reloads.',
    example: `const sidebar = useStorage('sidebar', true)
sidebar.value = false
// Persisted to localStorage`,
    useCases: ['User preferences', 'Draft saving', 'Cache'],
    tags: ['storage', 'persist', 'local'],
    icon: mdiNetwork,
  },
  useFeatures: {
    name: 'Feature Flags',
    summary: 'Boolean feature flags with adapter support',
    description: 'Runtime feature flag system with adapter support for LaunchDarkly, Flagsmith, or local config. Provides reactive flag values and conditional rendering helpers.',
    example: `const features = useFeatures()
if (features.isEnabled('beta-ui')) {
  // Show new interface
}`,
    useCases: ['A/B testing', 'Progressive rollout', 'Beta features'],
    tags: ['features', 'flags', 'toggle'],
    icon: mdiPuzzle,
  },
  useLogger: {
    name: 'Logger',
    summary: 'Structured logging with adapter support',
    description: 'Structured logging with configurable levels and adapter support for Sentry, DataDog, or console output. Provides scoped loggers with automatic context enrichment.',
    example: `const log = useLogger('MyComponent')
log.info('Mounted', { userId: 42 })
log.warn('Deprecation notice')`,
    useCases: ['Debug output', 'Error tracking', 'Analytics'],
    tags: ['logging', 'debug', 'console'],
    icon: mdiPuzzle,
  },
  usePermissions: {
    name: 'Permissions',
    summary: 'Role-based access control',
    description: 'Declarative permission system with role definitions, permission checks, and reactive guards. Integrates with routing for protected pages and conditional UI rendering.',
    example: `const perms = usePermissions()
if (perms.can('edit', 'posts')) {
  // Show edit button
}`,
    useCases: ['Admin panels', 'Feature gating', 'User roles'],
    tags: ['permissions', 'rbac', 'access'],
    icon: mdiPuzzle,
  },
  useBreakpoints: {
    name: 'Breakpoints',
    summary: 'Reactive viewport breakpoints',
    description: 'Tracks viewport dimensions against named breakpoints using matchMedia. Provides reactive booleans for each breakpoint and a current breakpoint name for responsive logic.',
    example: `const bp = useBreakpoints()
if (bp.mobile.value) {
  // Render mobile layout
}`,
    useCases: ['Responsive layouts', 'Mobile detection', 'Adaptive UI'],
    tags: ['responsive', 'viewport', 'mobile'],
    icon: mdiNetwork,
  },
  useDate: {
    name: 'Date',
    summary: 'Date manipulation with adapter support',
    description: 'Adapter-based date utilities supporting date-fns, dayjs, luxon, or a built-in adapter. Provides formatting, parsing, comparison, and locale-aware operations.',
    example: `const date = useDate()
const formatted = date.format(new Date(), 'fullDate')
const next = date.addDays(today, 7)`,
    useCases: ['Date pickers', 'Calendars', 'Time formatting'],
    tags: ['date', 'time', 'calendar'],
    icon: mdiPuzzle,
  },
  useEventListener: {
    name: 'Event Listener',
    summary: 'Auto-cleanup event listener binding',
    description: 'Attaches DOM event listeners that are automatically cleaned up on component unmount. Supports element refs, window, and document targets with full TypeScript event type inference.',
    example: `useEventListener(window, 'resize', () => {
  // Automatically removed on unmount
})`,
    useCases: ['Keyboard shortcuts', 'Scroll handlers', 'Window events'],
    tags: ['events', 'listener', 'cleanup'],
    icon: mdiNetwork,
  },
  useHotkey: {
    name: 'Hotkey',
    summary: 'Keyboard shortcut registration',
    description: 'Registers keyboard shortcuts with modifier key support (ctrl, shift, alt, meta). Handles key combinations, prevents defaults, and cleans up on unmount.',
    example: `useHotkey('ctrl+s', () => {
  save()
})`,
    useCases: ['App shortcuts', 'Accessibility', 'Power user features'],
    tags: ['keyboard', 'shortcut', 'hotkey'],
    icon: mdiNetwork,
  },
  useClickOutside: {
    name: 'Click Outside',
    summary: 'Detect clicks outside an element',
    description: 'Detects pointer events outside a target element for dismissing overlays. Supports conditional activation, excluded elements, and touch device compatibility.',
    example: `useClickOutside(menuRef, () => {
  isOpen.value = false
})`,
    useCases: ['Dropdown close', 'Modal dismiss', 'Menu collapse'],
    tags: ['click', 'outside', 'dismiss'],
    icon: mdiNetwork,
  },
  usePopover: {
    name: 'Popover',
    summary: 'Floating UI positioning and visibility',
    description: 'Floating element positioning using Floating UI with automatic flip, shift, and arrow middleware. Returns attrs and styles for both activator and content elements.',
    example: `const { activator, content } = usePopover({
  placement: 'bottom',
})
// Bind activator.attrs to trigger element`,
    useCases: ['Tooltips', 'Dropdowns', 'Context menus'],
    tags: ['popover', 'float', 'position'],
    icon: mdiNetwork,
  },
  useStack: {
    name: 'Stack',
    summary: 'Z-index stacking order for overlays',
    description: 'Manages z-index stacking order for overlapping UI elements. Ensures modals, drawers, and popovers layer correctly without manual z-index management.',
    example: `const stack = useStack()
// stack.zIndex.value — auto-assigned
// stack.isTop.value — true if topmost`,
    useCases: ['Modals', 'Dialogs', 'Drawers'],
    tags: ['stack', 'zindex', 'overlay'],
    icon: mdiNetwork,
  },
  useResizeObserver: {
    name: 'Resize Observer',
    summary: 'Reactive element size tracking',
    description: 'Wraps the ResizeObserver API with automatic cleanup and SSR safety. Provides reactive width and height values that update as the observed element resizes.',
    example: `const { width, height } = useResizeObserver(el)
// width.value, height.value update live`,
    useCases: ['Responsive components', 'Chart resizing', 'Layout shifts'],
    tags: ['resize', 'observer', 'size'],
    icon: mdiNetwork,
  },
  useIntersectionObserver: {
    name: 'Intersection Observer',
    summary: 'Detect element visibility in viewport',
    description: 'Wraps IntersectionObserver with reactive visibility state and configurable thresholds. Ideal for lazy loading images, triggering animations, and infinite scroll.',
    example: `const { isIntersecting } = useIntersectionObserver(el)
// isIntersecting.value — true when visible`,
    useCases: ['Lazy loading', 'Infinite scroll', 'Analytics'],
    tags: ['intersection', 'visibility', 'lazy'],
    icon: mdiNetwork,
  },

  // System (missing)
  useMutationObserver: {
    name: 'Mutation Observer',
    summary: 'Watch for DOM changes on elements',
    description: 'Wraps the MutationObserver API with lifecycle management, pause/resume controls, and automatic cleanup. SSR-safe and hydration-aware with configurable observation options.',
    example: `const { stop } = useMutationObserver(el, records => {
  // React to DOM mutations
}, { childList: true, attributes: true })`,
    useCases: ['Dynamic content', 'DOM monitoring', 'Attribute tracking'],
    tags: ['mutation', 'observer', 'dom'],
    icon: mdiNetwork,
  },
  useMediaQuery: {
    name: 'Media Query',
    summary: 'Reactive CSS media query matching',
    description: 'Reactive matchMedia integration that returns a boolean ref tracking whether a CSS media query matches. SSR-safe and hydration-aware with automatic listener cleanup.',
    example: `const { matches } = useMediaQuery('(prefers-color-scheme: dark)')
// matches.value — true when dark mode preferred`,
    useCases: ['Responsive conditionals', 'Preference detection', 'Adaptive rendering'],
    tags: ['media', 'query', 'responsive'],
    icon: mdiNetwork,
  },
  useTimer: {
    name: 'Timer',
    summary: 'Reactive countdown with pause/resume',
    description: 'A reactive timer with start, stop, pause, and resume controls. Tracks remaining time and supports one-shot or repeating modes with automatic scope cleanup.',
    example: `const timer = useTimer({ duration: 5000 })
timer.start()
// timer.remaining.value — ms left`,
    useCases: ['Auto-dismiss', 'Countdowns', 'Polling intervals'],
    tags: ['timer', 'countdown', 'delay'],
    icon: mdiNetwork,
  },
  usePresence: {
    name: 'Presence',
    summary: 'Animation-agnostic mount lifecycle',
    description: 'Manages the full DOM presence lifecycle: lazy mount, enter, exit delay, and unmount. Consumers control exit timing via a done() callback, making it compatible with CSS transitions, GSAP, or no animation at all.',
    example: `const { isMounted, isLeaving, done } = usePresence({
  present: isOpen,
  lazy: true,
})
// Call done() when exit animation finishes`,
    useCases: ['Transition wrappers', 'Lazy mount', 'Exit animations'],
    tags: ['presence', 'animation', 'mount'],
    icon: mdiNetwork,
  },
  useLazy: {
    name: 'Lazy',
    summary: 'Deferred content rendering for performance',
    description: 'Defers content rendering until first activation with optional delay. Supports eager mode bypass and keeps content mounted after first boot for instant re-show.',
    example: `const { isBooted, isActive } = useLazy(isOpen, {
  delay: 200,
})
// Content renders only after first open`,
    useCases: ['Dialog content', 'Menu panels', 'Tooltip bodies'],
    tags: ['lazy', 'defer', 'performance'],
    icon: mdiNetwork,
  },
  useToggleScope: {
    name: 'Toggle Scope',
    summary: 'Conditional effect scope management',
    description: 'Creates and destroys a Vue effect scope based on a reactive boolean. All reactive effects within the scope are automatically cleaned up when the condition becomes false.',
    example: `useToggleScope(isOpen, () => {
  // Effects only run while isOpen is true
  watch(source, handler)
})`,
    useCases: ['Conditional side effects', 'Feature flags', 'Performance optimization'],
    tags: ['scope', 'toggle', 'effects'],
    icon: mdiNetwork,
  },
  useRovingFocus: {
    name: 'Roving Focus',
    summary: 'Keyboard navigation with roving tabindex',
    description: 'Arrow key navigation for composite widgets using the roving tabindex pattern. Supports horizontal, vertical, and grid modes with automatic disabled-item skipping and circular navigation.',
    example: `const { focusedId, register } = useRovingFocus({
  orientation: 'horizontal',
})
// Arrow keys move focus between registered items`,
    useCases: ['Toolbars', 'Menu items', 'Grid navigation'],
    tags: ['focus', 'keyboard', 'roving'],
    icon: mdiNetwork,
  },
  useVirtualFocus: {
    name: 'Virtual Focus',
    summary: 'aria-activedescendant keyboard navigation',
    description: 'Virtual focus management where DOM focus stays on a control element while a virtual cursor highlights list items. Sets aria-activedescendant and data-highlighted attributes automatically.',
    example: `const { highlightedId, register } = useVirtualFocus({
  control: inputRef,
})
// Arrow keys move highlight, focus stays on input`,
    useCases: ['Comboboxes', 'Autocomplete', 'Listboxes'],
    tags: ['virtual', 'focus', 'aria'],
    icon: mdiNetwork,
  },
  useRaf: {
    name: 'Request Animation Frame',
    summary: 'Scope-safe requestAnimationFrame wrapper',
    description: 'Wraps requestAnimationFrame with a cancel-then-request pattern for deduplicating rapid calls. Automatically cleans up on scope disposal and is SSR-safe.',
    example: `const update = useRaf(() => {
  // Runs on next animation frame
})
update() // Request frame
update.cancel() // Cancel pending`,
    useCases: ['Smooth updates', 'Frame throttling', 'Visual animations'],
    tags: ['raf', 'animation', 'frame'],
    icon: mdiNetwork,
  },

  // Reactivity (missing)
  useProxyModel: {
    name: 'Proxy Model',
    summary: 'Bridge selection state to v-model',
    description: 'Bidirectional sync between a model context (Selection, Slider, etc.) and a Vue v-model ref. Supports array and single-value modes with automatic cleanup.',
    example: `useProxyModel(selection, modelValue, {
  multiple: true,
})
// v-model now syncs with selection state`,
    useCases: ['Component v-model', 'Two-way binding', 'Selection bridges'],
    tags: ['proxy', 'model', 'vmodel'],
    icon: mdiCog,
  },
  useProxyRegistry: {
    name: 'Proxy Registry',
    summary: 'Reactive proxy for registry data',
    description: 'Transforms a Map-based registry into reactive refs for keys, values, entries, and size. Updates via registry events with deep or shallow reactivity options.',
    example: `const proxy = useProxyRegistry(registry)
// proxy.values — reactive array of tickets
// proxy.size — reactive count`,
    useCases: ['Template iteration', 'Reactive lists', 'Registry binding'],
    tags: ['proxy', 'registry', 'reactive'],
    icon: mdiCog,
  },

  // Transformers (missing)
  toArray: {
    name: 'To Array',
    summary: 'Normalize values into arrays',
    description: 'Converts single values into single-element arrays, passes arrays through unchanged, and returns empty arrays for null/undefined. Essential for APIs that accept T | T[].',
    example: `toArray('hello')  // ['hello']
toArray([1, 2])   // [1, 2]
toArray(null)      // []`,
    useCases: ['Input normalization', 'API flexibility', 'Safe iteration'],
    tags: ['array', 'normalize', 'transform'],
    icon: mdiCog,
  },
  toElement: {
    name: 'To Element',
    summary: 'Resolve refs to DOM elements',
    description: 'Resolves refs, getters, raw DOM elements, or Vue component instances to a plain Element. Uses structural typing to avoid cross-version Vue Ref incompatibilities.',
    example: `const el = toElement(templateRef)
// Resolves Ref, getter, component, or Element`,
    useCases: ['Observer targets', 'DOM operations', 'Component refs'],
    tags: ['element', 'ref', 'resolve'],
    icon: mdiCog,
  },
  toReactive: {
    name: 'To Reactive',
    summary: 'Convert values to reactive proxies',
    description: 'Converts plain objects and refs into deep reactive proxies with automatic ref unwrapping. Supports Map and Set collections with nested reactivity and type preservation.',
    example: `const state = toReactive(ref({ count: 0 }))
state.count++ // Reactive, unwrapped`,
    useCases: ['State conversion', 'Ref unwrapping', 'Reactive collections'],
    tags: ['reactive', 'proxy', 'unwrap'],
    icon: mdiCog,
  },

  // Plugins (missing)
  useHydration: {
    name: 'Hydration',
    summary: 'SSR hydration state management',
    description: 'Tracks SSR hydration lifecycle with isHydrated and isSettled states. Essential for composables that need to behave differently during server-side rendering vs. client-side execution.',
    example: `const { isHydrated, isSettled } = useHydration()
// isHydrated — root component has mounted
// isSettled — safe for animations`,
    useCases: ['SSR safety', 'Hydration-aware rendering', 'Animation deferral'],
    tags: ['hydration', 'ssr', 'mount'],
    icon: mdiPuzzle,
  },
  useRtl: {
    name: 'RTL',
    summary: 'Right-to-left direction management',
    description: 'Reactive RTL direction state with adapter pattern for DOM integration. Supports subtree overrides via context provision and is independent from useLocale.',
    example: `const { isRtl, toggle } = useRtl()
toggle() // Flip LTR ↔ RTL`,
    useCases: ['RTL layouts', 'Bidirectional text', 'Direction-aware components'],
    tags: ['rtl', 'direction', 'ltr'],
    icon: mdiPuzzle,
  },
  useNotifications: {
    name: 'Notifications',
    summary: 'Push notification lifecycle management',
    description: 'Full notification system with push, read, archive, snooze, and bulk operations. Built on createRegistry for persistence and createQueue for toast-style auto-dismiss with pause/resume.',
    example: `const notifications = useNotifications()
notifications.send({
  subject: 'Saved',
  severity: 'success',
  timeout: 3000,
})`,
    useCases: ['Toast messages', 'Notification center', 'Alert management'],
    tags: ['notifications', 'toast', 'alerts'],
    icon: mdiPuzzle,
  },

  // Registration (missing)
  createQueue: {
    name: 'Queue',
    summary: 'Time-based FIFO queue with auto-dismiss',
    description: 'Manages a FIFO queue with automatic timeout-based removal, pause/resume, and manual dismissal. Only the first ticket is active at any time; when it expires, the next auto-activates.',
    example: `const queue = createQueue({ timeout: 3000 })
queue.register({ id: 'msg-1' })
// Auto-dismissed after 3s`,
    useCases: ['Toast queues', 'Notification stacks', 'Timed content'],
    tags: ['queue', 'fifo', 'timeout'],
    icon: mdiArchive,
  },
  createTimeline: {
    name: 'Timeline',
    summary: 'Bounded undo/redo history',
    description: 'Bounded undo/redo system with fixed-size history and overflow management. Extends createRegistry with temporal navigation for command patterns and history tracking.',
    example: `const timeline = createTimeline({ max: 10 })
timeline.register({ id: 'action-1' })
timeline.undo()
timeline.redo()`,
    useCases: ['Undo/redo', 'Command history', 'Action replay'],
    tags: ['timeline', 'undo', 'redo'],
    icon: mdiArchive,
  },
  createTokens: {
    name: 'Tokens',
    summary: 'Design token registry with alias resolution',
    description: 'Design token registry supporting W3C Design Tokens format with alias resolution, circular reference detection, and nested flattening. Used internally by useTheme, useLocale, and useFeatures.',
    example: `const tokens = createTokens({
  colors: { primary: '{colors.blue.500}' },
})
tokens.resolve('{colors.primary}')`,
    useCases: ['Design tokens', 'Theme variables', 'Configuration'],
    tags: ['tokens', 'design', 'alias'],
    icon: mdiArchive,
  },

  // Selection (missing)
  createNested: {
    name: 'Nested',
    summary: 'Hierarchical tree management',
    description: 'Extends createGroup with parent-child relationship tracking, open/close state, and tree traversal utilities. Supports single and multiple open strategies for tree views and nested navigation.',
    example: `const nested = createNested({ open: 'single' })
// Tracks parent-child relationships
// getPath, getDescendants, open/close`,
    useCases: ['Tree views', 'Nested navigation', 'File explorers'],
    tags: ['nested', 'tree', 'hierarchy'],
    icon: mdiCheckboxMarked,
  },

  // Forms (missing)
  createValidation: {
    name: 'Validation',
    summary: 'Per-input validation with rule management',
    description: 'Per-input validation built on createGroup where each ticket is a rule that can be enabled/disabled. Supports async validation, Standard Schema (Zod, Valibot), and auto-registers with parent forms.',
    example: `const validation = createValidation()
validation.register({ value: v => !!v || 'Required' })
await validation.validate(inputValue)`,
    useCases: ['Input validation', 'Field rules', 'Async validation'],
    tags: ['validation', 'rules', 'input'],
    icon: mdiTextBox,
  },
  useRules: {
    name: 'Rules',
    summary: 'Validation rule resolution with Standard Schema',
    description: 'Resolves validation rules from alias strings, functions, or Standard Schema objects (Zod, Valibot, ArkType). Provides a shared rule alias registry via plugin context with locale-aware error messages.',
    example: `const rules = useRules()
const resolved = rules.resolve(['required', 'email'])
// Returns FormValidationRule[] array`,
    useCases: ['Rule aliases', 'Schema integration', 'Shared rules'],
    tags: ['rules', 'schema', 'validation'],
    icon: mdiTextBox,
  },

  // Semantic (missing)
  createBreadcrumbs: {
    name: 'Breadcrumbs',
    summary: 'Breadcrumb navigation with path truncation',
    description: 'Breadcrumb navigation built on createSingle with depth tracking, root detection, and path truncation. Provides first(), prev(), and select() for navigating hierarchical paths.',
    example: `const breadcrumbs = createBreadcrumbs()
// breadcrumbs.depth — path length
// breadcrumbs.prev() — go up one level`,
    useCases: ['Breadcrumb trails', 'Path navigation', 'Hierarchical UI'],
    tags: ['breadcrumbs', 'navigation', 'path'],
    icon: mdiStar,
  },
  createOverflow: {
    name: 'Overflow',
    summary: 'Container capacity measurement',
    description: 'Computes how many items fit in a container based on available width using ResizeObserver. Supports variable-width and uniform-width modes with reserved space for navigation elements.',
    example: `const overflow = createOverflow({
  container: containerRef,
  gap: 8,
})
// overflow.capacity — items that fit`,
    useCases: ['Responsive truncation', 'Pagination sizing', 'Breadcrumb collapse'],
    tags: ['overflow', 'capacity', 'responsive'],
    icon: mdiStar,
  },
}

const graph = dependencyGraph as DependencyGraph

export function buildCatalog (): Feature[] {
  const features: Feature[] = []

  for (const [id, meta] of Object.entries(META)) {
    const composable = (maturity.composables as unknown as Record<string, { level: string, since?: string | null, category: string }>)[id]
    const component = (maturity.components as unknown as Record<string, { level: string, since?: string | null, category: string }>)[id]
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
