// apps/builder/src/data/component-recommendations.ts

// Hand-curated mapping from plugin id to the components that meaningfully benefit
// from that plugin being installed. Components are listed by id (e.g., 'Button', 'Dialog').
//
// This is a recommendation layer: it doesn't enforce dependencies (the resolver does that).
// Components that don't exist in v0 yet (DatePicker, Calendar) are still listed —
// they're tracked for when v0 ships them.
const PLUGIN_TO_COMPONENTS: Record<string, string[]> = {
  useTheme: [
    'Alert', 'Avatar', 'Badge', 'Button', 'Card', 'Checkbox', 'Chip',
    'Combobox', 'Dialog', 'Drawer', 'Form', 'Image', 'Input', 'List',
    'Menu', 'Pagination', 'Popover', 'Progress', 'Radio', 'Rating',
    'Select', 'Slider', 'Switch', 'Tabs', 'Toast', 'Tooltip',
  ],
  useStack: ['Dialog', 'Drawer', 'Menu', 'Popover', 'Tooltip', 'Toast'],
  useRules: ['Form', 'Input', 'Combobox', 'Select', 'Slider', 'Numeric', 'Rating'],
  useNotifications: ['Toast'],
  useLocale: ['Alert', 'Button', 'Dialog', 'Input', 'Select', 'Combobox', 'Form'],
  useDate: ['DatePicker', 'Calendar'],
  useFeatures: [],
  usePermissions: [],
  useHydration: [],
  useStorage: [],
  useBreakpoints: [],
  useLogger: [],
  useRtl: [],
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
