export type { BuModalContext, BuModalProps } from './BuModal.vue'

// Context
import Root from './BuModal.vue'

import Body from '../BuModalBody/BuModalBody.vue'
import Card from '../BuModalCard/BuModalCard.vue'
import Close from '../BuModalClose/BuModalClose.vue'
import Content from '../BuModalContent/BuModalContent.vue'
import Delete from '../BuModalDelete/BuModalDelete.vue'
import Foot from '../BuModalFoot/BuModalFoot.vue'
import Head from '../BuModalHead/BuModalHead.vue'
import Title from '../BuModalTitle/BuModalTitle.vue'

/**
 * Modal. Owns the open state, backdrop, and focus trap; the panel is composed as parts.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`BuModalContent`) remain exported and valid.
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { BuModal } from '@paper/bulma'
 * </script>
 *
 * <template>
 *   <BuModal>
 *     <BuModal.Content />
 *
 *     <BuModal.Close />
 *
 *     <BuModal.Card>
 *       <BuModal.Head>
 *         <BuModal.Title />
 *
 *         <BuModal.Delete />
 *       </BuModal.Head>
 *
 *       <BuModal.Body />
 *
 *       <BuModal.Foot />
 *     </BuModal.Card>
 *   </BuModal>
 * </template>
 * ```
 */
export const BuModal = Object.assign(Root, {
  /** Plain `.modal-content` panel. */
  Content,
  /** Large `.modal-close` beside the content panel. */
  Close,
  /** `.modal-card` panel. */
  Card,
  /** `header.modal-card-head`. */
  Head,
  /** `p.modal-card-title`. */
  Title,
  /** Card-head `.delete`. */
  Delete,
  /** `section.modal-card-body`. */
  Body,
  /** `footer.modal-card-foot`. */
  Foot,
})
