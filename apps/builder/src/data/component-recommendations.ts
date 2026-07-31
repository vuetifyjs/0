// apps/builder/src/data/component-recommendations.ts

// Hand-curated mapping from plugin id to the components that meaningfully benefit
// from that plugin being installed. Components are listed by id (e.g., 'Button', 'Dialog').
//
// This is a recommendation layer: it doesn't enforce dependencies (the resolver does that).
// Every id below must exist in packages/0/src/maturity.json — that file is the catalog the
// component picker renders, so an id missing from it silently drops out of the UI. Draft
// entries (DatePicker, DataGrid, Tour, ...) are catalogued there and are safe to reference.
//
// An empty list means the plugin has no component-level affinity: feature flags,
// permissions, and logging apply app-wide rather than to any particular component.
const PLUGIN_TO_COMPONENTS: Record<string, string[]> = {
  useTheme: [
    'Alert', 'AlertDialog', 'Avatar', 'Button', 'Checkbox', 'Combobox',
    'Dialog', 'ExpansionPanel', 'Form', 'Image', 'Input', 'NumberField',
    'Pagination', 'Popover', 'Progress', 'Radio', 'Rating', 'Select',
    'Slider', 'Snackbar', 'Switch', 'Tabs', 'Tooltip', 'Treeview',
  ],
  useBreakpoints: ['Carousel', 'DataTable', 'Dialog', 'Overflow', 'Splitter', 'Tabs', 'Virtualizer'],
  useLocale: [
    'Alert', 'AlertDialog', 'Breadcrumbs', 'Button', 'Combobox', 'DatePicker',
    'Dialog', 'Form', 'Input', 'Pagination', 'Select', 'Snackbar', 'Tooltip',
  ],
  useRtl: [
    'Breadcrumbs', 'Carousel', 'Pagination', 'Popover', 'Progress', 'Slider',
    'Splitter', 'Tabs', 'Tooltip', 'Treeview',
  ],
  useStorage: ['DataGrid', 'DataTable', 'ExpansionPanel', 'Splitter', 'Tabs', 'Treeview'],
  useHydration: ['Dialog', 'Image', 'Popover', 'Portal', 'Presence', 'Tooltip', 'Virtualizer'],
  useLogger: [],
  useStack: ['AlertDialog', 'Combobox', 'Dialog', 'Popover', 'Scrim', 'Select', 'Snackbar', 'Tooltip'],
  useTooltip: ['Button', 'Tooltip'],
  useReducedMotion: [
    'Carousel', 'Collapsible', 'Dialog', 'ExpansionPanel', 'Popover',
    'Presence', 'Progress', 'Snackbar', 'Tabs', 'Tooltip',
  ],
  useFeatures: [],
  usePermissions: [],
  useDate: ['DatePicker', 'DateRangePicker', 'TimePicker'],
  useNotifications: ['Snackbar'],
  useRules: ['Combobox', 'Form', 'Input', 'NumberField', 'Otp', 'Rating', 'Select', 'Slider'],
}

export function recommendedFor (selectedPlugins: Set<string>): Set<string> {
  const out = new Set<string>()
  for (const pluginId of selectedPlugins) {
    for (const componentId of PLUGIN_TO_COMPONENTS[pluginId] ?? []) {
      out.add(componentId)
    }
  }
  return out
}

export function reasonsFor (componentId: string, selectedPlugins: Set<string>): string[] {
  const reasons: string[] = []
  for (const pluginId of selectedPlugins) {
    if ((PLUGIN_TO_COMPONENTS[pluginId] ?? []).includes(componentId)) {
      reasons.push(pluginId)
    }
  }
  return reasons
}
