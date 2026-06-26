import { materialPalette, tailwindPalette } from './palettes'

// Types
import type { App } from 'vue'

export function registerPlugins (app: App) {
  app.use(
    createFeaturesPlugin({
      features: {
        dev: true,
      },
    }),
  )

  app.use(createHydrationPlugin())

  app.use(createLoggerPlugin())

  app.use(
    createBreakpointsPlugin({
      //
    }),
  )

  app.use(
    createRulesPlugin({
      aliases: {
        required: v => (v === 0 || !!v) || 'This field is required',
        email: v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v)) || 'Must be a valid email',
        slug: v => !v || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(v)) || 'Must be a valid slug',
        prefix: v => !v || String(v).startsWith('/') || 'Must start with /',
      },
    }),
  )

  app.use(
    createLocalePlugin({
      default: 'en',
      messages: {
        en: {
          hello: 'Hello',
          welcome: '{fr.hello}, {hello}, Welcome to our application',
        },
        fr: {
          hello: 'Bonjour',
          welcome: 'Bienvenue dans notre application',
        },
      },
    }),
  )

  app.use(
    createThemePlugin({
      default: 'minimalSlate',
      palette: {
        md: materialPalette,
        tw: tailwindPalette,
      },
      themes: {
        corporateIndigo: {
          colors: {
            'primary': '{palette.md.blue.500}',
            'secondary': '{palette.md.indigo.500}',
            'accent': '{palette.md.deepPurple.A200}',
            'error': '{palette.md.red.500}',
            'info': '{palette.md.lightBlue.500}',
            'success': '{palette.md.green.500}',
            'warning': '{palette.md.orange.500}',
            'background': '{palette.md.grey.50}',
            'divider': '{palette.md.grey.300}',
            'surface': '{palette.md.grey.100}',
            'surface-tint': '{palette.md.grey.200}',
            'surface-variant': '{palette.md.grey.200}',
            'on-surface-variant': '{palette.md.grey.700}',
          },
        },
        vitalityGreen: {
          colors: {
            'primary': '{palette.md.green.500}',
            'secondary': '{palette.md.teal.500}',
            'accent': '{palette.md.amber.A200}',
            'error': '{palette.md.deepOrange.500}',
            'info': '{palette.md.cyan.500}',
            'success': '{palette.md.lightGreen.500}',
            'warning': '{palette.md.yellow.500}',
            'background': '{palette.md.grey.50}',
            'divider': '{palette.md.grey.300}',
            'surface': '{palette.md.grey.100}',
            'surface-tint': '{palette.md.grey.200}',
            'surface-variant': '{palette.md.grey.200}',
            'on-surface-variant': '{palette.md.grey.700}',
          },
        },
        minimalSlate: {
          colors: {
            'primary': '{palette.tw.violet.500}',
            'secondary': '{palette.tw.slate.500}',
            'accent': '{palette.tw.indigo.500}',
            'error': '{palette.tw.red.500}',
            'info': '{palette.tw.sky.500}',
            'success': '{palette.tw.green.500}',
            'warning': '{palette.tw.amber.500}',
            'background': '{palette.tw.gray.50}',
            'divider': '{palette.tw.gray.200}',
            'surface': '{palette.tw.gray.100}',
            'surface-tint': '{palette.tw.gray.200}',
            'surface-variant': '{palette.tw.gray.200}',
            'on-surface-variant': '{palette.tw.gray.600}',
          },
        },
        creativeFuchsia: {
          colors: {
            'primary': '{palette.tw.pink.500}',
            'secondary': '{palette.tw.violet.500}',
            'accent': '{palette.tw.fuchsia.500}',
            'error': '{palette.tw.rose.500}',
            'info': '{palette.tw.cyan.500}',
            'success': '{palette.tw.emerald.500}',
            'warning': '{palette.tw.yellow.500}',
            'background': '{palette.tw.gray.50}',
            'divider': '{palette.tw.gray.200}',
            'surface': '{palette.tw.gray.100}',
            'surface-tint': '{palette.tw.gray.200}',
            'surface-variant': '{palette.tw.gray.200}',
            'on-surface-variant': '{palette.tw.gray.600}',
          },
        },
        dark: {
          colors: {
            'primary': '{palette.tw.violet.400}',
            'secondary': '{palette.tw.slate.400}',
            'accent': '{palette.tw.indigo.400}',
            'error': '{palette.tw.red.400}',
            'info': '{palette.tw.sky.400}',
            'success': '{palette.tw.green.400}',
            'warning': '{palette.tw.amber.400}',
            'background': '{palette.tw.neutral.950}',
            'divider': '{palette.tw.neutral.800}',
            'surface': '{palette.tw.neutral.900}',
            'surface-tint': '{palette.tw.neutral.800}',
            'surface-variant': '{palette.tw.neutral.800}',
            'on-background': '{palette.tw.neutral.100}',
            'on-surface': '{palette.tw.neutral.100}',
            'on-surface-variant': '{palette.tw.neutral.400}',
          },
        },
      },
    }),
  )
}
