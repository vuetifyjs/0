export type { EmSnackbarCloseProps } from './EmSnackbarClose.vue'
export { default as EmSnackbarClose } from './EmSnackbarClose.vue'
export { default as EmSnackbarContent } from './EmSnackbarContent.vue'
export type { EmSnackbarPortalProps } from './EmSnackbarPortal.vue'
export { default as EmSnackbarPortal } from './EmSnackbarPortal.vue'
export type { EmSnackbarQueueProps } from './EmSnackbarQueue.vue'
export { default as EmSnackbarQueue } from './EmSnackbarQueue.vue'
export type { EmSnackbarProps, EmSnackbarVariant } from './EmSnackbar.vue'

// Context
import Root from './EmSnackbar.vue'
import Close from './EmSnackbarClose.vue'
import Content from './EmSnackbarContent.vue'
import Portal from './EmSnackbarPortal.vue'
import Queue from './EmSnackbarQueue.vue'

/**
 * A single snackbar. Owns its variant and dismissal.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`EmSnackbarPortal`) remain exported and valid.
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { EmSnackbar } from '@paper/emerald'
 * </script>
 *
 * <template>
 *   <EmSnackbar.Portal>
 *     <EmSnackbar.Queue>
 *       <EmSnackbar>
 *         <EmSnackbar.Content />
 *
 *         <EmSnackbar.Close />
 *       </EmSnackbar>
 *     </EmSnackbar.Queue>
 *   </EmSnackbar.Portal>
 * </template>
 * ```
 */
export const EmSnackbar = Object.assign(Root, {
  /** Teleports the queue to the document, out of the local stacking context. */
  Portal,
  /** Stacks active snackbars and manages their timeouts. */
  Queue,
  /** Message body. */
  Content,
  /** Dismisses the snackbar. */
  Close,
})
