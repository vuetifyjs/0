export { default as AlertDialogAction } from './AlertDialogAction.vue'
export { default as AlertDialogActivator } from './AlertDialogActivator.vue'
export { default as AlertDialogCancel } from './AlertDialogCancel.vue'
export { default as AlertDialogClose } from './AlertDialogClose.vue'
export { default as AlertDialogContent } from './AlertDialogContent.vue'
export { default as AlertDialogDescription } from './AlertDialogDescription.vue'
export { provideAlertDialogContext, useAlertDialogContext } from './AlertDialogRoot.vue'
export { default as AlertDialogRoot } from './AlertDialogRoot.vue'
export { default as AlertDialogTitle } from './AlertDialogTitle.vue'
export type { AlertDialogActionEmits, AlertDialogActionEvent, AlertDialogActionProps, AlertDialogActionSlotProps } from './AlertDialogAction.vue'
export type { AlertDialogActivatorProps, AlertDialogActivatorSlotProps } from './AlertDialogActivator.vue'
export type { AlertDialogCancelProps, AlertDialogCancelSlotProps } from './AlertDialogCancel.vue'
export type { AlertDialogCloseProps, AlertDialogCloseSlotProps } from './AlertDialogClose.vue'
export type { AlertDialogContentEmits, AlertDialogContentProps, AlertDialogContentSlotProps } from './AlertDialogContent.vue'
export type { AlertDialogDescriptionProps, AlertDialogDescriptionSlotProps } from './AlertDialogDescription.vue'
export type { AlertDialogContext, AlertDialogRootProps, AlertDialogRootSlotProps } from './AlertDialogRoot.vue'
export type { AlertDialogTitleProps, AlertDialogTitleSlotProps } from './AlertDialogTitle.vue'

// Context
import Action from './AlertDialogAction.vue'
import Activator from './AlertDialogActivator.vue'
import Cancel from './AlertDialogCancel.vue'
import Close from './AlertDialogClose.vue'
import Content from './AlertDialogContent.vue'
import Description from './AlertDialogDescription.vue'
import Root from './AlertDialogRoot.vue'
import Title from './AlertDialogTitle.vue'

/**
 * AlertDialog component with sub-components for building confirmation dialogs.
 *
 * @see https://0.vuetifyjs.com/components/disclosure/alert-dialog
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { AlertDialog } from '@vuetify/v0'
 * </script>
 *
 * <template>
 *   <AlertDialog.Root>
 *     <AlertDialog.Activator>
 *       Delete Item
 *     </AlertDialog.Activator>
 *
 *     <AlertDialog.Content>
 *       <AlertDialog.Title>Are you sure?</AlertDialog.Title>
 *       <AlertDialog.Description>This action cannot be undone.</AlertDialog.Description>
 *
 *       <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
 *       <AlertDialog.Action>Confirm</AlertDialog.Action>
 *     </AlertDialog.Content>
 *   </AlertDialog.Root>
 * </template>
 * ```
 */
export const AlertDialog = {
  /**
   * Root component for alert dialogs.
   *
   * @see https://0.vuetifyjs.com/components/disclosure/alert-dialog
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { AlertDialog } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <AlertDialog.Root>
   *     <AlertDialog.Activator>Delete</AlertDialog.Activator>
   *     <AlertDialog.Content>
   *       <AlertDialog.Title>Are you sure?</AlertDialog.Title>
   *       <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
   *       <AlertDialog.Action>Confirm</AlertDialog.Action>
   *     </AlertDialog.Content>
   *   </AlertDialog.Root>
   * </template>
   * ```
   */
  Root,
  /**
   * Activator component that opens the alert dialog.
   *
   * @see https://0.vuetifyjs.com/components/disclosure/alert-dialog
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { AlertDialog } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <AlertDialog.Activator>
   *     Delete Item
   *   </AlertDialog.Activator>
   * </template>
   * ```
   */
  Activator,
  /**
   * Content container for the alert dialog using native `<dialog>` element.
   *
   * @see https://0.vuetifyjs.com/components/disclosure/alert-dialog
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { AlertDialog } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <AlertDialog.Content>
   *     <AlertDialog.Title>Are you sure?</AlertDialog.Title>
   *     <AlertDialog.Description>This cannot be undone.</AlertDialog.Description>
   *     <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
   *     <AlertDialog.Action>Confirm</AlertDialog.Action>
   *   </AlertDialog.Content>
   * </template>
   * ```
   */
  Content,
  /**
   * Title component for accessible alert dialog labeling.
   *
   * @see https://0.vuetifyjs.com/components/disclosure/alert-dialog
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { AlertDialog } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <AlertDialog.Title>Are you sure?</AlertDialog.Title>
   * </template>
   * ```
   */
  Title,
  /**
   * Description component for accessible alert dialog description.
   *
   * @see https://0.vuetifyjs.com/components/disclosure/alert-dialog
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { AlertDialog } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <AlertDialog.Description>
   *     This action cannot be undone.
   *   </AlertDialog.Description>
   * </template>
   * ```
   */
  Description,
  /**
   * Cancel button component for dismissing the alert dialog.
   *
   * @see https://0.vuetifyjs.com/components/disclosure/alert-dialog
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { AlertDialog } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
   * </template>
   * ```
   */
  Cancel,
  /**
   * Close button component for closing the alert dialog.
   *
   * @see https://0.vuetifyjs.com/components/disclosure/alert-dialog
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { AlertDialog } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <AlertDialog.Close>Close</AlertDialog.Close>
   * </template>
   * ```
   */
  Close,
  /**
   * Action button component for confirming the alert dialog.
   *
   * @see https://0.vuetifyjs.com/components/disclosure/alert-dialog
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { AlertDialog } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <AlertDialog.Action>Confirm</AlertDialog.Action>
   * </template>
   * ```
   */
  Action,
}
