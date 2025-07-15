import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:uno.css'

import { createHydrationPlugin } from '@vuetify/0'

createApp(App).use(createHydrationPlugin()).mount('#app')
