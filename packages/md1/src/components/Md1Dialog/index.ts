export type { Md1DialogContext, Md1DialogProps, Md1DialogSlotProps, Md1DialogVariant } from './Md1Dialog.vue'
export { useMd1Dialog } from './Md1Dialog.vue'
export type { Md1DialogActionsProps } from './Md1DialogActions.vue'
export { default as Md1DialogActions } from './Md1DialogActions.vue'
export type { Md1DialogActivatorProps, Md1DialogActivatorSlotProps } from './Md1DialogActivator.vue'
export { default as Md1DialogActivator } from './Md1DialogActivator.vue'
export type { Md1DialogCancelProps } from './Md1DialogCancel.vue'
export { default as Md1DialogCancel } from './Md1DialogCancel.vue'
export type { Md1DialogConfirmProps } from './Md1DialogConfirm.vue'
export { default as Md1DialogConfirm } from './Md1DialogConfirm.vue'
export type { Md1DialogContentProps } from './Md1DialogContent.vue'
export { default as Md1DialogContent } from './Md1DialogContent.vue'
export type { Md1DialogTextProps } from './Md1DialogText.vue'
export { default as Md1DialogText } from './Md1DialogText.vue'
export type { Md1DialogTitleProps } from './Md1DialogTitle.vue'
export { default as Md1DialogTitle } from './Md1DialogTitle.vue'

// Context
import Root from './Md1Dialog.vue'
import Actions from './Md1DialogActions.vue'
import Activator from './Md1DialogActivator.vue'
import Cancel from './Md1DialogCancel.vue'
import Confirm from './Md1DialogConfirm.vue'
import Content from './Md1DialogContent.vue'
import Text from './Md1DialogText.vue'
import Title from './Md1DialogTitle.vue'

/**
 * The Material Design 1 dialog: alert, simple, confirmation and full-screen,
 * on a native `<dialog>` at 24 dp. Composes v0 `Dialog`, and `AlertDialog`
 * under `variant="alert"`; the root owns `v-model` (open) and `v-model:value`
 * (the committed choice) and provides the `md1:dialog` context its parts
 * and hosted controls read.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`Md1DialogTitle`) remain exported and valid.
 *
 * @example
 * ```vue
 * <Md1Dialog v-model="open">
 *   <Md1Dialog.Activator v-slot="{ attrs }">
 *     <Md1Button v-bind="attrs">Discard draft</Md1Button>
 *   </Md1Dialog.Activator>
 *
 *   <Md1Dialog.Content>
 *     <Md1Dialog.Text>Discard this draft?</Md1Dialog.Text>
 *
 *     <Md1Dialog.Actions>
 *       <Md1Dialog.Cancel />
 *
 *       <Md1Dialog.Confirm @confirm="onDiscard">Discard</Md1Dialog.Confirm>
 *     </Md1Dialog.Actions>
 *   </Md1Dialog.Content>
 * </Md1Dialog>
 * ```
 */
export const Md1Dialog = Object.assign(Root, {
  /** Renderless trigger host: spread its `attrs` slot prop onto an `Md1Button`. */
  Activator,
  /** The `<dialog>` and the 24 dp sheet inside it; paints the scrim through `::backdrop`. */
  Content,
  /** The title, Medium 20 sp; the dialog's accessible name. Pinned over a scrolling option list. */
  Title,
  /** Body copy, Body 1 at the secondary ink; the dialog's accessible description. */
  Text,
  /** The 52 dp action area: dismissive then affirmative; stacks itself when a label is too long. */
  Actions,
  /** The dismissive flat button, "Cancel" by default; discards what a confirmation dialog holds. */
  Cancel,
  /** The affirmative flat button, "OK" by default; commits `v-model:value`, emits `confirm` and closes. */
  Confirm,
})
