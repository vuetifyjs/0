// Framework
import { createBreakpointsPlugin, createDatePlugin, createFeaturesPlugin, createHydrationPlugin, createLocalePlugin, createLoggerPlugin, createPermissionsPlugin, createRtlPlugin, createStackPlugin, createStoragePlugin, createThemePlugin, createTooltipPlugin, IN_BROWSER, useFeatures, V0UnheadThemeAdapter } from '@vuetify/v0'
import { Vuetify0DateAdapter } from '@vuetify/v0/date'

// Composables
import { createDiscoveryPlugin } from '@/composables/useDiscovery'
import { useIdleCallback } from '@/composables/useIdleCallback'

// Themes
import { getAllThemeConfigs } from '@/themes'

// Plugins
import { createIconPlugin } from './icons'

// Types
import type { App } from 'vue'

export default function zero (app: App) {
  app.use(createIconPlugin())
  app.use(createLoggerPlugin())
  app.use(createHydrationPlugin())
  app.use(createBreakpointsPlugin({ mobileBreakpoint: 768 }))
  app.use(createStoragePlugin())
  app.use(createStackPlugin())
  app.use(createTooltipPlugin())
  app.use(createDiscoveryPlugin())

  app.use(
    createFeaturesPlugin({
      features: {
        devmode: {
          $value: IN_BROWSER ? localStorage.getItem('v0:devmode') === 'true' : false,
          $description: 'Enables development mode with additional logging and warnings',
        },
      },
    }),
  )

  if (IN_BROWSER) {
    useIdleCallback(async () => {
      const [{ default: posthog }, { PostHogFeatureAdapter }] = await Promise.all([
        import('posthog-js'),
        import('@vuetify/v0/features/adapters/posthog'),
      ])
      posthog.init('phc_NNCtIDpiEgt5TsyxTItPnU9dA14asv6OR6IziSLQa97', { api_host: 'https://app.posthog.com' })
      const adapter = new PostHogFeatureAdapter(posthog)
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
    }),
  )
  app.use(
    createDatePlugin({
      adapter: new Vuetify0DateAdapter(),
      locales: { en: 'en-US' },
    }),
  )

  app.use(
    createThemePlugin({
      adapter: new V0UnheadThemeAdapter(),
      persist: true,
      default: 'dark',
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
