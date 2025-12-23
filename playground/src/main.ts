// Components
import App from './App.vue'

// Utilities
import { createApp } from 'vue'

import { registerPlugins } from './plugins'

import 'virtual:uno.css'

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
