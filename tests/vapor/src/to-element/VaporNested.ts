// Context
import VaporMulti from './VaporMulti.vue'

// Utilities
import { createComponent, defineVaporComponent } from 'vue'

// Written without <script setup> so dev compilation does not call expose():
// an exposed component's template ref is the expose proxy, not the instance.
export default defineVaporComponent({
  setup () {
    return createComponent(VaporMulti as never)
  },
})
