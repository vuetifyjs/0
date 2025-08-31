import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:uno.css'

import { registerPlugins } from './plugins'

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
