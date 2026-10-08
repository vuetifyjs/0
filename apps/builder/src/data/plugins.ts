// apps/builder/src/data/plugins.ts

import {
  mdiBellOutline,
  mdiCalendarOutline,
  mdiClipboardCheckOutline,
  mdiConsole,
  mdiDatabaseOutline,
  mdiFlagOutline,
  mdiLayersOutline,
  mdiMotionOutline,
  mdiPaletteOutline,
  mdiResponsive,
  mdiServerOutline,
  mdiShieldOutline,
  mdiSwapHorizontal,
  mdiTooltipOutline,
  mdiTranslate,
} from '@mdi/js'

// Types
import type { Component } from 'vue'

export interface PluginMeta {
  id: string
  slug: string
  title: string
  category: string
  icon: string
  hasConfig: boolean
  docs?: string
  loader: () => Promise<{ default: Component }>
}

export const PLUGINS: PluginMeta[] = [
  // Appearance
  { id: 'useTheme', slug: 'theme', title: 'Theme', category: 'appearance', icon: mdiPaletteOutline, hasConfig: true, docs: 'https://0.vuetifyjs.com/composables/plugins/use-theme', loader: () => import('@/plugins/theme/ThemeConfig.vue') },
  { id: 'useBreakpoints', slug: 'breakpoints', title: 'Breakpoints', category: 'appearance', icon: mdiResponsive, hasConfig: true, docs: 'https://0.vuetifyjs.com/composables/plugins/use-breakpoints', loader: () => import('@/plugins/breakpoints/BreakpointsConfig.vue') },
  { id: 'useReducedMotion', slug: 'reduced-motion', title: 'Reduced Motion', category: 'appearance', icon: mdiMotionOutline, hasConfig: true, docs: 'https://0.vuetifyjs.com/composables/plugins/use-reduced-motion', loader: () => import('@/plugins/reduced-motion/ReducedMotionConfig.vue') },
  // i18n
  { id: 'useLocale', slug: 'locale', title: 'Locale', category: 'i18n', icon: mdiTranslate, hasConfig: true, docs: 'https://0.vuetifyjs.com/composables/plugins/use-locale', loader: () => import('@/plugins/locale/LocaleConfig.vue') },
  { id: 'useRtl', slug: 'rtl', title: 'Right-to-Left', category: 'i18n', icon: mdiSwapHorizontal, hasConfig: true, docs: 'https://0.vuetifyjs.com/composables/plugins/use-rtl', loader: () => import('@/plugins/rtl/RtlConfig.vue') },
  // Infrastructure
  { id: 'useStorage', slug: 'storage', title: 'Storage', category: 'infrastructure', icon: mdiDatabaseOutline, hasConfig: true, docs: 'https://0.vuetifyjs.com/composables/plugins/use-storage', loader: () => import('@/plugins/storage/StorageConfig.vue') },
  { id: 'useHydration', slug: 'hydration', title: 'SSR / SSG', category: 'infrastructure', icon: mdiServerOutline, hasConfig: false, docs: 'https://0.vuetifyjs.com/composables/plugins/use-hydration', loader: () => import('@/plugins/hydration/HydrationConfig.vue') },
  { id: 'useLogger', slug: 'logger', title: 'Logger', category: 'infrastructure', icon: mdiConsole, hasConfig: true, docs: 'https://0.vuetifyjs.com/composables/plugins/use-logger', loader: () => import('@/plugins/logger/LoggerConfig.vue') },
  { id: 'useStack', slug: 'stack', title: 'Stack', category: 'infrastructure', icon: mdiLayersOutline, hasConfig: true, docs: 'https://0.vuetifyjs.com/composables/plugins/use-stack', loader: () => import('@/plugins/stack/StackConfig.vue') },
  { id: 'useTooltip', slug: 'tooltip', title: 'Tooltip', category: 'infrastructure', icon: mdiTooltipOutline, hasConfig: true, docs: 'https://0.vuetifyjs.com/composables/plugins/use-tooltip', loader: () => import('@/plugins/tooltip/TooltipConfig.vue') },
  // Access
  { id: 'useFeatures', slug: 'features', title: 'Feature Flags', category: 'access', icon: mdiFlagOutline, hasConfig: true, docs: 'https://0.vuetifyjs.com/composables/plugins/use-features', loader: () => import('@/plugins/features/FeaturesConfig.vue') },
  { id: 'usePermissions', slug: 'permissions', title: 'Permissions', category: 'access', icon: mdiShieldOutline, hasConfig: true, docs: 'https://0.vuetifyjs.com/composables/plugins/use-permissions', loader: () => import('@/plugins/permissions/PermissionsConfig.vue') },
  // Utilities
  { id: 'useDate', slug: 'date', title: 'Date', category: 'utilities', icon: mdiCalendarOutline, hasConfig: true, docs: 'https://0.vuetifyjs.com/composables/plugins/use-date', loader: () => import('@/plugins/date/DateConfig.vue') },
  { id: 'useNotifications', slug: 'notifications', title: 'Notifications', category: 'utilities', icon: mdiBellOutline, hasConfig: true, docs: 'https://0.vuetifyjs.com/composables/plugins/use-notifications', loader: () => import('@/plugins/notifications/NotificationsConfig.vue') },
  // Forms
  { id: 'useRules', slug: 'rules', title: 'Rules', category: 'forms', icon: mdiClipboardCheckOutline, hasConfig: true, docs: 'https://0.vuetifyjs.com/composables/plugins/use-rules', loader: () => import('@/plugins/rules/RulesConfig.vue') },
]

export function getPluginById (id: string): PluginMeta | undefined {
  return PLUGINS.find(p => p.id === id)
}

export function getPluginBySlug (slug: string): PluginMeta | undefined {
  return PLUGINS.find(p => p.slug === slug)
}
