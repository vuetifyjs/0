export type { QuSnackbarAlign, QuSnackbarProps } from './QuSnackbar.vue'
export type { QuSnackbarPortalContext, QuSnackbarPortalProps } from './QuSnackbarPortal.vue'
export { default as QuSnackbarPortal } from './QuSnackbarPortal.vue'
export type { QuSnackbarQueueContext, QuSnackbarQueueProps, QuSnackbarQueueSlotProps } from './QuSnackbarQueue.vue'
export { default as QuSnackbarQueue } from './QuSnackbarQueue.vue'

// Context
import Root from './QuSnackbar.vue'
import Portal from './QuSnackbarPortal.vue'
import Queue from './QuSnackbarQueue.vue'

/**
 * The Material Design 1 snackbar: one short message at the bottom edge, at
 * most one text action, gone on its own. Composes v0 `Snackbar.Portal`,
 * `Snackbar.Queue`, `Snackbar.Root` and `Snackbar.Content`, `usePresence` for
 * the upward entrance and downward exit, and a flat `QuButton` for the action.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`QuSnackbarPortal`) remain exported and valid.
 *
 * @example
 * ```vue
 * <QuSnackbar.Portal>
 *   <QuSnackbar.Queue v-slot="{ item }">
 *     <QuSnackbar action="Undo">{{ item.subject }}</QuSnackbar>
 *   </QuSnackbar.Queue>
 * </QuSnackbar.Portal>
 * ```
 */
export const QuSnackbar = Object.assign(Root, {
  /** The fixed bottom container: teleports out of the page and announces each message. */
  Portal,
  /** Shows the newest notification, one at a time, each waiting for the last to leave. */
  Queue,
})
