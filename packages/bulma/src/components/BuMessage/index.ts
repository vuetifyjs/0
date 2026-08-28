export type { BuMessageContext, BuMessageProps } from './BuMessage.vue'

// Context
import Root from './BuMessage.vue'

import Body from '../BuMessageBody/BuMessageBody.vue'
import Delete from '../BuMessageDelete/BuMessageDelete.vue'
import Header from '../BuMessageHeader/BuMessageHeader.vue'

/**
 * Message box. Owns the open state; header, delete, and body are composed as parts.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`BuMessageHeader`) remain exported and valid.
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { BuMessage } from '@paper/bulma'
 * </script>
 *
 * <template>
 *   <BuMessage>
 *     <BuMessage.Header>
 *       <BuMessage.Delete />
 *     </BuMessage.Header>
 *
 *     <BuMessage.Body />
 *   </BuMessage>
 * </template>
 * ```
 */
export const BuMessage = Object.assign(Root, {
  /** `.message-header` title row. */
  Header,
  /** Header dismiss button. */
  Delete,
  /** `.message-body` content. */
  Body,
})
