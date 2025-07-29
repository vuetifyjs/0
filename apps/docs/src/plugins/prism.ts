// Plugins
import Prism from 'prismjs'

// Types
import type { App } from 'vue'

// Import language components
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-markup'

export default {
  install (app: App) {
    // Auto-highlight on route changes
    if (typeof window !== 'undefined') {
      // Initial highlight
      Prism.highlightAll()
    }
  },
}
