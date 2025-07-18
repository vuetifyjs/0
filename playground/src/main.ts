import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:uno.css'

import { createThemePlugin, createHydrationPlugin } from '@vuetify/0'

createApp(App)
  .use(
    createThemePlugin({
      default: 'light',
      palette: {
        red: {
          100: '#ffebee',
          200: '#ffcdd2',
          300: '#ef9a9a',
        },
      },
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
        },
        dark: {
          primary: '{palette.red.300}',
          secondary: '#03dac6',
          tertiary: '#03dac5',
          accent: '#03dac5',
          error: '#cf6679',
          info: '#2196f3',
          success: '#4caf50',
          warning: '#ff9800',
          background: '#121212',
          surface: '#1e1e1e',
        },
      },
    },
    ))
  .use(createHydrationPlugin())
  .mount('#app')
