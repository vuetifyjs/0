export type { QuDialogContext, QuDialogProps, QuDialogSlotProps, QuDialogVariant } from './QuDialog.vue'
export { useQuDialog } from './QuDialog.vue'
export type { QuDialogActionsProps } from './QuDialogActions.vue'
export { default as QuDialogActions } from './QuDialogActions.vue'
export type { QuDialogActivatorProps, QuDialogActivatorSlotProps } from './QuDialogActivator.vue'
export { default as QuDialogActivator } from './QuDialogActivator.vue'
export type { QuDialogCancelProps } from './QuDialogCancel.vue'
export { default as QuDialogCancel } from './QuDialogCancel.vue'
export type { QuDialogConfirmProps } from './QuDialogConfirm.vue'
export { default as QuDialogConfirm } from './QuDialogConfirm.vue'
export type { QuDialogContentProps } from './QuDialogContent.vue'
export { default as QuDialogContent } from './QuDialogContent.vue'
export type { QuDialogTextProps } from './QuDialogText.vue'
export { default as QuDialogText } from './QuDialogText.vue'
export type { QuDialogTitleProps } from './QuDialogTitle.vue'
export { default as QuDialogTitle } from './QuDialogTitle.vue'

// Context
import Root from './QuDialog.vue'
import Actions from './QuDialogActions.vue'
import Activator from './QuDialogActivator.vue'
import Cancel from './QuDialogCancel.vue'
import Confirm from './QuDialogConfirm.vue'
import Content from './QuDialogContent.vue'
import Text from './QuDialogText.vue'
import Title from './QuDialogTitle.vue'

/**
 * The Material Design 1 dialog: alert, simple, confirmation and full-screen,
 * on a native `<dialog>` at 24 dp. Composes v0 `Dialog`, and `AlertDialog`
 * under `variant="alert"`; the root owns `v-model` (open) and `v-model:value`
 * (the committed choice) and provides the `quantum:dialog` context its parts
 * and hosted controls read.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`QuDialogTitle`) remain exported and valid.
 *
 * @example
 * ```vue
 * <QuDialog v-model="open">
 *   <QuDialog.Activator v-slot="{ attrs }">
 *     <QuButton v-bind="attrs">Discard draft</QuButton>
 *   </QuDialog.Activator>
 *
 *   <QuDialog.Content>
 *     <QuDialog.Text>Discard this draft?</QuDialog.Text>
 *
 *     <QuDialog.Actions>
 *       <QuDialog.Cancel />
 *
 *       <QuDialog.Confirm @confirm="onDiscard">Discard</QuDialog.Confirm>
 *     </QuDialog.Actions>
 *   </QuDialog.Content>
 * </QuDialog>
 * ```
 */
export const QuDialog = Object.assign(Root, {
  /** Renderless trigger host: spread its `attrs` slot prop onto a `QuButton`. */
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
