import type { App } from 'vue'
import { materialPalette, tailwindPalette } from './palettes'

export function registerPlugins (app: App) {
  app.use(createHydrationPlugin())

  // app.use(createLoggerPlugin())

  app.use(
    createBreakpointsPlugin({
      //
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
          primary: '{palette.md.blue.500}',
          secondary: '{palette.md.indigo.500}',
          accent: '{palette.md.deepPurple.A200}',
          error: '{palette.md.red.500}',
          info: '{palette.md.lightBlue.500}',
          success: '{palette.md.green.500}',
          warning: '{palette.md.orange.500}',
          background: '{palette.md.grey.50}',
          surface: '{palette.md.grey.100}',
        },
        vitalityGreen: {
          primary: '{palette.md.green.500}',
          secondary: '{palette.md.teal.500}',
          accent: '{palette.md.amber.A200}',
          error: '{palette.md.deepOrange.500}',
          info: '{palette.md.cyan.500}',
          success: '{palette.md.lightGreen.500}',
          warning: '{palette.md.yellow.500}',
          background: '{palette.md.grey.50}',
          surface: '{palette.md.grey.100}',
        },
        minimalSlate: {
          primary: '{palette.tw.blue.500}',
          secondary: '{palette.tw.slate.500}',
          accent: '{palette.tw.indigo.500}',
          error: '{palette.tw.red.500}',
          info: '{palette.tw.sky.500}',
          success: '{palette.tw.green.500}',
          warning: '{palette.tw.amber.500}',
          background: '{palette.tw.gray.50}',
          surface: '{palette.tw.gray.100}',
        },
        creativeFuchsia: {
          primary: '{palette.tw.pink.500}',
          secondary: '{palette.tw.violet.500}',
          accent: '{palette.tw.fuchsia.500}',
          error: '{palette.tw.rose.500}',
          info: '{palette.tw.cyan.500}',
          success: '{palette.tw.emerald.500}',
          warning: '{palette.tw.yellow.500}',
          background: '{palette.tw.gray.50}',
          surface: '{palette.tw.gray.100}',
        },
      },
    }),
  )
}
