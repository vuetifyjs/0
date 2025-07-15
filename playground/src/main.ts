import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:uno.css'

import { createThemePlugin, createHydrationPlugin } from '@vuetify/0'

createApp(App)
  .use(createThemePlugin())
  .use(createHydrationPlugin())
  .mount('#app')
