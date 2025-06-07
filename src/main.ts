import { createApp } from 'vue'
import App from './App.vue'
import paintUrl from './assets/paint.js?url'
import 'virtual:uno.css'

if (CSS && 'paintWorklet' in CSS) {
  // @ts-ignore
  CSS.paintWorklet.addModule(paintUrl)
}

createApp(App).mount('#app')
