import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:uno.css'

import { createThemePlugin, createHydrationPlugin } from '@vuetify/0'

createApp(App)
  .use(createThemePlugin({
    themes: {
      light: {
        primary: '#6200ea',
        secondary: '#03dac6',
        tertiary: '#018786',
        accent: '#03dac5',
        error: '#b00020',
        info: '#2196f3',
        success: '#4caf50',
        warning: '#ff9800',
        background: '#ffffff',
        surface: '#f5f5f5',
        surfaceLight: '#fafafa',
        surfaceVariant: '#eeeeee',
        surfaceBright: '#e0e0e0',
        surfaceTint: '#cfd8dc',

        onPrimary: '#ffffff',
        onSecondary: '#000000',
        onTertiary: '#000000',
        onAccent: '#000000',
        onError: '#ffffff',
        onInfo: '#ffffff',
        onSuccess: '#ffffff',
        onWarning: '#000000',
        onBackground: '#000000',
        onSurface: '#000000',
      },
    },
  }))
  .use(createHydrationPlugin())
  .mount('#app')
