import { shallowRef } from 'vue'
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- referenced in commented-out plugin example
import { createContext, createGroup, createPlugin } from '@vuetify/v0'
import type { GroupContext } from '@vuetify/v0'
import type { ShallowRef } from 'vue'

export interface DashboardContext {
  app: string
  locale: ShallowRef<string>
  locales: { code: string, label: string }[]
  group: GroupContext
}

export interface DashboardPluginOptions {
  app?: string
  locale?: string
}

export const [
  useDashboard,
  provideDashboard,
] = createContext<DashboardContext>('demo:dashboard')

export function createDashboardPlugin (options: DashboardPluginOptions = {}) {
  const group = createGroup()

  group.onboard([
    { id: 'dark', value: 'Dark Mode' },
    { id: 'animations', value: 'Animations' },
    { id: 'notifications', value: 'Notifications' },
    { id: 'analytics', value: 'Analytics' },
    { id: 'compact', value: 'Compact View' },
  ])

  // Enable defaults
  group.select(['animations', 'notifications'])

  const locales = [
    { code: 'en-US', label: 'English (US)' },
    { code: 'es-ES', label: 'Spanish' },
    { code: 'fr-FR', label: 'French' },
    { code: 'ja-JP', label: 'Japanese' },
    { code: 'de-DE', label: 'German' },
  ]

  const context: DashboardContext = {
    app: options.app ?? 'My App',
    locale: shallowRef(options.locale ?? 'en-US'),
    locales,
    group,
  }

  // In a real app, you'd return a plugin created with createPlugin
  //
  // return createPlugin({
  //   namespace: 'demo:dashboard',
  //   provide: app => {
  //     provideDashboard(context, app)
  //   },
  // })

  return context
}
