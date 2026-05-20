// apps/builder/src/data/plugins.ts

// Types
import type { Component } from 'vue'

export interface PluginMeta {
  id: string
  slug: string
  title: string
  category: string
  hasConfig: boolean
  loader: () => Promise<{ default: Component }>
}

export const PLUGINS: PluginMeta[] = [
  // Appearance
  { id: 'useTheme', slug: 'theme', title: 'Theme', category: 'appearance', hasConfig: true, loader: () => import('@/plugins/theme/ThemeConfig.vue') },
  { id: 'useBreakpoints', slug: 'breakpoints', title: 'Breakpoints', category: 'appearance', hasConfig: true, loader: () => import('@/plugins/breakpoints/BreakpointsConfig.vue') },
  // i18n
  { id: 'useLocale', slug: 'locale', title: 'Locale', category: 'i18n', hasConfig: true, loader: () => import('@/plugins/locale/LocaleConfig.vue') },
  { id: 'useRtl', slug: 'rtl', title: 'Right-to-Left', category: 'i18n', hasConfig: true, loader: () => import('@/plugins/rtl/RtlConfig.vue') },
  // Infrastructure
  { id: 'useStorage', slug: 'storage', title: 'Storage', category: 'infrastructure', hasConfig: true, loader: () => import('@/plugins/storage/StorageConfig.vue') },
  { id: 'useHydration', slug: 'hydration', title: 'SSR / SSG', category: 'infrastructure', hasConfig: false, loader: () => import('@/plugins/hydration/HydrationConfig.vue') },
  { id: 'useLogger', slug: 'logger', title: 'Logger', category: 'infrastructure', hasConfig: true, loader: () => import('@/plugins/logger/LoggerConfig.vue') },
  { id: 'useStack', slug: 'stack', title: 'Stack', category: 'infrastructure', hasConfig: true, loader: () => import('@/plugins/stack/StackConfig.vue') },
  // Access
  { id: 'useFeatures', slug: 'features', title: 'Feature Flags', category: 'access', hasConfig: true, loader: () => import('@/plugins/features/FeaturesConfig.vue') },
  { id: 'usePermissions', slug: 'permissions', title: 'Permissions', category: 'access', hasConfig: true, loader: () => import('@/plugins/permissions/PermissionsConfig.vue') },
  // Utilities
  { id: 'useDate', slug: 'date', title: 'Date', category: 'utilities', hasConfig: true, loader: () => import('@/plugins/date/DateConfig.vue') },
  { id: 'useNotifications', slug: 'notifications', title: 'Notifications', category: 'utilities', hasConfig: true, loader: () => import('@/plugins/notifications/NotificationsConfig.vue') },
  // Forms
  { id: 'useRules', slug: 'rules', title: 'Rules', category: 'forms', hasConfig: true, loader: () => import('@/plugins/rules/RulesConfig.vue') },
]

export function getPluginById (id: string): PluginMeta | undefined {
  return PLUGINS.find(p => p.id === id)
}

export function getPluginBySlug (slug: string): PluginMeta | undefined {
  return PLUGINS.find(p => p.slug === slug)
}
