export type { BDialogContext, BDialogProps } from './BDialog.vue'

// Context
import Root from './BDialog.vue'

import Body from '../BDialogBody/BDialogBody.vue'
import Close from '../BDialogClose/BDialogClose.vue'
import Footer from '../BDialogFooter/BDialogFooter.vue'
import Header from '../BDialogHeader/BDialogHeader.vue'
import Title from '../BDialogTitle/BDialogTitle.vue'

/**
 * Bootstrap 6 dialog. Native `<dialog class="dialog">`, open state on `v-model`.
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { BDialog } from '@paper/bootstrap'
 * </script>
 *
 * <template>
 *   <BDialog>
 *     <BDialog.Header>
 *       <BDialog.Title />
 *
 *       <BDialog.Close />
 *     </BDialog.Header>
 *
 *     <BDialog.Body />
 *
 *     <BDialog.Footer />
 *   </BDialog>
 * </template>
 * ```
 */
export const BDialog = Object.assign(Root, {
  /** `div.dialog-header`. */
  Header,
  /** `h1.dialog-title`. Supplies the accessible name. */
  Title,
  /** `button.btn-close`. */
  Close,
  /** `div.dialog-body`. */
  Body,
  /** `div.dialog-footer`. */
  Footer,
})
