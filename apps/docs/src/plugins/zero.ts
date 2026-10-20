import { createEmeraldIconsPlugin } from '@paper/emerald'
import { provideGnIcons, type GnIconRole } from '@paper/genesis'

// Framework
import { createBreakpointsPlugin, createDatePlugin, createFeaturesPlugin, createHydrationPlugin, createLocalePlugin, createLoggerPlugin, createPermissionsPlugin, createRtlPlugin, createStackPlugin, createStoragePlugin, createThemePlugin, createTooltipPlugin, IN_BROWSER, useFeatures, V0UnheadThemeAdapter } from '@vuetify/v0'
import { V0DateAdapter } from '@vuetify/v0/date'

// Components
import AppIcon from '@/components/app/AppIcon.vue'

// Composables
import { createDiscoveryPlugin } from '@/composables/useDiscovery'
import { useIdleCallback } from '@/composables/useIdleCallback'

// Themes
import { getAllThemeConfigs } from '@/themes'

// Plugins
import { createIconPlugin } from './icons'

// Utilities
import { h } from 'vue'

// Types
import type { App } from 'vue'

const gnIcons = {
  'callout-caution': 'error',
  'callout-important': 'alert-circle',
  'callout-note': 'info',
  'callout-tip': 'lightbulb',
  'callout-warning': 'alert',
  'example-bin': 'vuetify-bin',
  'example-combine': 'combine',
  'example-playground': 'vuetify-play',
  'example-reset': 'restart',
  'example-split': 'split',
  'example-toggle': 'chevron-down',
  'peek': 'chevron-down',
} satisfies Record<GnIconRole, string>

export default function zero (app: App) {
  app.use(createIconPlugin())
  provideGnIcons({
    render: (role, { size = 16 } = {}) => h(AppIcon, { icon: gnIcons[role], size }),
  }, app)
  app.use(createEmeraldIconsPlugin())
  app.use(createLoggerPlugin({ devtools: true }))
  app.use(createHydrationPlugin())
  app.use(createBreakpointsPlugin({ mobileBreakpoint: 768, devtools: true }))
  app.use(createStoragePlugin())
  app.use(createStackPlugin({ devtools: true }))
  app.use(createTooltipPlugin({ openDelay: 500, closeDelay: 200 }))
  app.use(createDiscoveryPlugin())

  app.use(
    createFeaturesPlugin({
      persist: true,
      devtools: true,
      features: {
        devmode: {
          $value: false,
          $description: 'Enables development mode with additional logging and warnings',
        },
      },
    }),
  )

  if (IN_BROWSER) {
    useIdleCallback(async () => {
      const [{ default: posthog }, { PostHogFeaturesAdapter }] = await Promise.all([
        import('posthog-js'),
        import('@vuetify/v0/features/adapters/posthog'),
      ])
      posthog.init('phc_NNCtIDpiEgt5TsyxTItPnU9dA14asv6OR6IziSLQa97', { api_host: 'https://app.posthog.com' })
      const adapter = new PostHogFeaturesAdapter(posthog)
      const features = app.runWithContext(() => useFeatures())
      features.sync(adapter.setup(flags => features.sync(flags)))
    }, 2000)
  }

  app.use(
    createPermissionsPlugin({
      permissions: {
        super: [['use', 'devmode']],
      },
    }),
  )
  app.use(createRtlPlugin({ persist: true }))
  app.use(
    createLocalePlugin({
      default: 'en',
      fallback: 'en',
      devtools: true,
    }),
  )
  app.use(
    createDatePlugin({
      adapter: new V0DateAdapter(),
      locales: { en: 'en-US' },
    }),
  )

  app.use(
    createThemePlugin({
      adapter: new V0UnheadThemeAdapter(),
      persist: true,
      devtools: true,
      default: 'light',
      system: { light: 'light', dark: 'dark' },
      target: 'html',
      palette: {
        brand: {
          discord: '#5865f2',
          vue: '#41b883',
          mastered: '#ff8000',
        },
      },
      themes: getAllThemeConfigs(),
    }),
  )
}
