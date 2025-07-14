import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:uno.css'

import { createThemePlugin } from '@vuetify/0'

createApp(App)
  .use(createThemePlugin())
  .mount('#app')
