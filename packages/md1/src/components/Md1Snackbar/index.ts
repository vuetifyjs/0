export type { Md1SnackbarAlign, Md1SnackbarProps } from './Md1Snackbar.vue'
export type { Md1SnackbarPortalContext, Md1SnackbarPortalProps } from './Md1SnackbarPortal.vue'
export { default as Md1SnackbarPortal } from './Md1SnackbarPortal.vue'
export type { Md1SnackbarQueueContext, Md1SnackbarQueueProps, Md1SnackbarQueueSlotProps } from './Md1SnackbarQueue.vue'
export { default as Md1SnackbarQueue } from './Md1SnackbarQueue.vue'

// Context
import Root from './Md1Snackbar.vue'
import Portal from './Md1SnackbarPortal.vue'
import Queue from './Md1SnackbarQueue.vue'

/**
 * The Material Design 1 snackbar: one short message at the bottom edge, at
 * most one text action, gone on its own. Composes v0 `Snackbar.Portal`,
 * `Snackbar.Queue`, `Snackbar.Root` and `Snackbar.Content`, `usePresence` for
 * the upward entrance and downward exit, and a flat `Md1Button` for the action.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`Md1SnackbarPortal`) remain exported and valid.
 *
 * @example
 * ```vue
 * <Md1Snackbar.Portal>
 *   <Md1Snackbar.Queue v-slot="{ item }">
 *     <Md1Snackbar action="Undo">{{ item.subject }}</Md1Snackbar>
 *   </Md1Snackbar.Queue>
 * </Md1Snackbar.Portal>
 * ```
 */
export const Md1Snackbar = Object.assign(Root, {
  /** The fixed bottom container: teleports out of the page and announces each message. */
  Portal,
  /** Shows the newest notification, one at a time, each waiting for the last to leave. */
  Queue,
})
