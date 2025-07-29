import { createApp } from 'vue'
import App from './App.vue'
import { registerPlugins } from './plugins'
import 'virtual:uno.css'
import 'prismjs/themes/prism.css'

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
