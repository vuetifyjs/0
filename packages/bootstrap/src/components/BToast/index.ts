export type { BToastContext, BToastProps } from './BToast.vue'

// Context
import Root from './BToast.vue'

import Body from '../BToastBody/BToastBody.vue'
import Close from '../BToastClose/BToastClose.vue'
import Queue from '../BToastQueue/BToastQueue.vue'

/**
 * Bootstrap 6 toast. A `.toast` whose open state is `v-model`.
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { BToast } from '@paper/bootstrap'
 * </script>
 *
 * <template>
 *   <BToast v-model="open">
 *     <BToast.Body>Saved</BToast.Body>
 *     <BToast.Close />
 *   </BToast>
 * </template>
 * ```
 */
export const BToast = Object.assign(Root, {
  /** `div.toast-body`. */
  Body,
  /** `button.btn-close`. */
  Close,
  /** `.toast-container` of toasts added with `push`. */
  Queue,
})
