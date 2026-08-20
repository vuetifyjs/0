/**
 * Visual identity for registry features in the Open gallery.
 * Registry ships no icons — map by name, then category, then a hashed accent.
 */

export type FeatureAccent = {
  /** Soft header fill (css color with alpha). */
  bg: string
  /** Icon / emphasis color. */
  fg: string
}

/** Per-feature AppIcon token (keys registered in plugins/icons). */
const FEATURE_ICONS: Record<string, string> = {
  // components — actions
  'button': 'feat-button',
  'toggle': 'feat-toggle',

  // components — disclosure
  'alert-dialog': 'feat-alert',
  'collapsible': 'feat-collapse',
  'dialog': 'feat-dialog',
  'expansion-panel': 'feat-collapse',
  'popover': 'feat-popover',
  'tabs': 'feat-tabs',
  'tooltip': 'feat-tooltip',
  'treeview': 'feat-tree',

  // components — forms
  'checkbox': 'feat-checkbox',
  'combobox': 'feat-combobox',
  'form': 'feat-form',
  'input': 'feat-input',
  'number-field': 'feat-number',
  'radio': 'feat-radio',
  'rating': 'feat-rating',
  'select': 'feat-select',
  'slider': 'feat-slider',
  'switch': 'feat-switch',

  // components — primitives
  'aspect-ratio': 'feat-aspect',
  'atom': 'feat-atom',
  'portal': 'feat-portal',
  'presence': 'feat-presence',

  // components — providers
  'group': 'feat-group',
  'locale': 'feat-locale',
  'scrim': 'feat-scrim',
  'selection': 'feat-selection',
  'single': 'feat-single',
  'step': 'feat-step',
  'theme': 'feat-theme',

  // components — semantic
  'avatar': 'feat-avatar',
  'breadcrumbs': 'feat-breadcrumbs',
  'carousel': 'feat-carousel',
  'image': 'feat-image',
  'overflow': 'feat-overflow',
  'pagination': 'feat-pagination',
  'progress': 'feat-progress',
  'snackbar': 'feat-snackbar',
  'splitter': 'feat-splitter',

  // composables — data
  'create-data-grid': 'feat-table',
  'create-data-table': 'feat-table',
  'create-filter': 'feat-filter',
  'create-kanban': 'feat-kanban',
  'create-pagination': 'feat-pagination',
  'create-sortable': 'feat-sort',
  'create-virtual': 'feat-virtual',

  // composables — forms (mirror component names)
  'create-combobox': 'feat-combobox',
  'create-form': 'feat-form',
  'create-input': 'feat-input',
  'create-number-field': 'feat-number',
  'create-numeric': 'feat-number',
  'create-otp': 'feat-otp',
  'create-rating': 'feat-rating',
  'create-slider': 'feat-slider',
  'create-validation': 'feat-validation',

  // composables — foundation
  'create-context': 'feat-context',
  'create-plugin': 'feat-plugin',
  'create-trinity': 'feat-trinity',

  // composables — registration
  'create-queue': 'feat-queue',
  'create-registry': 'feat-registry',
  'create-timeline': 'feat-timeline',
  'create-tokens': 'feat-tokens',

  // composables — selection
  'create-group': 'feat-group',
  'create-model': 'feat-model',
  'create-nested': 'feat-tree',
  'create-selection': 'feat-selection',
  'create-single': 'feat-single',
  'create-step': 'feat-step',

  // composables — semantic
  'create-breadcrumbs': 'feat-breadcrumbs',
  'create-overflow': 'feat-overflow',
  'create-progress': 'feat-progress',

  // plugins
  'use-breakpoints': 'feat-breakpoints',
  'use-date': 'feat-date',
  'use-features': 'feat-features',
  'use-hydration': 'feat-hydration',
  'use-locale': 'feat-locale',
  'use-logger': 'feat-logger',
  'use-notifications': 'feat-snackbar',
  'use-permissions': 'feat-permissions',
  'use-reduced-motion': 'feat-motion',
  'use-rtl': 'feat-rtl',
  'use-rules': 'feat-validation',
  'use-stack': 'feat-stack',
  'use-storage': 'feat-storage',
  'use-theme': 'feat-theme',
  'use-tooltip': 'feat-tooltip',

  // system
  'use-click-outside': 'feat-click-outside',
  'use-delay': 'feat-delay',
  'use-drag-drop': 'feat-drag',
  'use-event-listener': 'feat-event',
  'use-hotkey': 'feat-hotkey',
  'use-image': 'feat-image',
  'use-intersection-observer': 'feat-intersection',
  'use-lazy': 'feat-lazy',
  'use-media-query': 'feat-media',
  'use-mutation-observer': 'feat-mutation',
  'use-popover': 'feat-popover',
  'use-presence': 'feat-presence',
  'use-raf': 'feat-raf',
  'use-resize-observer': 'feat-resize',
  'use-roving-focus': 'feat-focus',
  'use-timer': 'feat-timer',
  'use-toggle-scope': 'feat-scope',
  'use-virtual-focus': 'feat-focus',

  // reactivity
  'use-proxy-model': 'feat-model',
  'use-proxy-registry': 'feat-registry',

  // transformers
  'to-array': 'feat-array',
  'to-element': 'feat-element',
  'to-highlight': 'feat-highlight',
  'to-reactive': 'feat-reactive',
}

const CATEGORY_ICONS: Record<string, string> = {
  actions: 'feat-button',
  data: 'feat-table',
  disclosure: 'feat-dialog',
  forms: 'feat-form',
  foundation: 'feat-context',
  plugins: 'feat-plugin',
  primitives: 'feat-atom',
  providers: 'feat-group',
  reactivity: 'feat-reactive',
  registration: 'feat-registry',
  selection: 'feat-selection',
  semantic: 'feat-image',
  system: 'feat-system',
  transformers: 'feat-array',
}

/** Kind used for accent coloring (matches Open dialog rail). */
export type FeatureKind = 'components' | 'composables' | 'plugins'

/** Soft accent pairs — one palette per surface kind. */
const KIND_ACCENTS: Record<FeatureKind, FeatureAccent> = {
  // Components — primary blue
  components: { bg: 'rgba(124, 156, 255, 0.16)', fg: '#8eabff' },
  // Composables — violet
  composables: { bg: 'rgba(167, 139, 250, 0.16)', fg: '#b8a0ff' },
  // Plugins — teal
  plugins: { bg: 'rgba(45, 212, 191, 0.14)', fg: '#2dd4bf' },
}

export function resolveFeatureIcon (name: string, category?: string): string {
  const direct = FEATURE_ICONS[name]
  if (direct) return direct

  if (category) {
    const fromCategory = CATEGORY_ICONS[category]
    if (fromCategory) return fromCategory
  }

  return 'feat-default'
}

/**
 * Resolve kind from registry entry fields.
 * Plugins are tagged via `category === 'plugins'` (type is still composables).
 */
function resolveFeatureKind (
  type: string,
  category?: string,
): FeatureKind {
  if (category === 'plugins') return 'plugins'
  if (type === 'composables') return 'composables'
  return 'components'
}

export function resolveFeatureAccent (type: string, category?: string): FeatureAccent {
  return KIND_ACCENTS[resolveFeatureKind(type, category)]
}
