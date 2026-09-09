export type { BuNotificationContext, BuNotificationProps } from './BuNotification.vue'

// Context
import Root from './BuNotification.vue'

import Delete from '../BuNotificationDelete/BuNotificationDelete.vue'

/**
 * Notification box. Owns the open state; the dismiss button is a composed part.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`BuNotificationDelete`) remain exported and valid.
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { BuNotification } from '@paper/bulma'
 * </script>
 *
 * <template>
 *   <BuNotification>
 *     <BuNotification.Delete />
 *   </BuNotification>
 * </template>
 * ```
 */
export const BuNotification = Object.assign(Root, {
  /** `.delete` dismiss button. */
  Delete,
})
