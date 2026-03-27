import posthog from 'posthog-js'

// Framework
import { createBreakpointsPlugin, createDatePlugin, createFeaturesPlugin, createHydrationPlugin, createLocalePlugin, createLoggerPlugin, createPermissionsPlugin, createRtlPlugin, createStackPlugin, createStoragePlugin, createThemePlugin, IN_BROWSER } from '@vuetify/v0'
import { Vuetify0DateAdapter } from '@vuetify/v0/date'
import { PostHogFeatureAdapter } from '@vuetify/v0/features/adapters/posthog'

// Composables
import { createDiscoveryPlugin } from '@/composables/useDiscovery'

// Types
import type { App } from 'vue'

// Themes
import { getAllThemeConfigs } from '@/themes'

// Plugins
import { createIconPlugin } from './icons'

export default function zero (app: App) {
  app.use(createIconPlugin())
  app.use(createLoggerPlugin())
  app.use(createHydrationPlugin())
  app.use(createBreakpointsPlugin({ mobileBreakpoint: 768 }))
  app.use(createStoragePlugin())
  app.use(createStackPlugin())
  app.use(createDiscoveryPlugin())

  if (IN_BROWSER) {
    posthog.init('phc_NNCtIDpiEgt5TsyxTItPnU9dA14asv6OR6IziSLQa97', { api_host: 'https://app.posthog.com' })
  }
  app.use(
    createFeaturesPlugin({
      adapter: new PostHogFeatureAdapter(posthog),
      features: {
        devmode: {
          $value: IN_BROWSER ? localStorage.getItem('v0:devmode') === 'true' : false,
          $description: 'Enables development mode with additional logging and warnings',
        },
      },
    }),
  )
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
