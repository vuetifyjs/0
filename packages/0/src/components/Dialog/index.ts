export { default as DialogClose } from './DialogClose.vue'
export { default as DialogContent } from './DialogContent.vue'
export { default as DialogDescription } from './DialogDescription.vue'
export { provideDialogContext, useDialogContext } from './DialogRoot.vue'
export { default as DialogRoot } from './DialogRoot.vue'
export { default as DialogTitle } from './DialogTitle.vue'
export { default as DialogActivator } from './DialogActivator.vue'
export type { DialogCloseProps, DialogCloseSlotProps } from './DialogClose.vue'
export type { DialogContentEmits, DialogContentProps, DialogContentSlotProps } from './DialogContent.vue'
export type { DialogDescriptionProps, DialogDescriptionSlotProps } from './DialogDescription.vue'
export type { DialogContext, DialogRootProps, DialogRootSlotProps } from './DialogRoot.vue'
export type { DialogTitleProps, DialogTitleSlotProps } from './DialogTitle.vue'
export type { DialogActivatorProps, DialogActivatorSlotProps } from './DialogActivator.vue'

// Components
import Trigger from './DialogActivator.vue'
import Close from './DialogClose.vue'
import Content from './DialogContent.vue'
import Description from './DialogDescription.vue'
import Root from './DialogRoot.vue'
import Title from './DialogTitle.vue'

/**
 * Dialog component with sub-components for building modal dialogs.
 *
 * @see https://0.vuetifyjs.com/components/dialog
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { Dialog } from '@vuetify/v0'
 * </script>
 *
 * <template>
 *   <Dialog.Root>
 *     <Dialog.Trigger>
 *       Open Dialog
 *     </Dialog.Trigger>
 *
 *     <Dialog.Content>
 *       <Dialog.Title>Dialog Title</Dialog.Title>
 *       <Dialog.Description>Dialog description text.</Dialog.Description>
 *
 *       <p>Dialog content goes here.</p>
 *
 *       <Dialog.Close>Close</Dialog.Close>
 *     </Dialog.Content>
 *   </Dialog.Root>
 * </template>
 * ```
 */
export const Dialog = {
  /**
   * Root component for dialogs.
   *
   * @see https://0.vuetifyjs.com/components/dialog
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Dialog } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Dialog.Root>
   *     <Dialog.Trigger>Open</Dialog.Trigger>
   *     <Dialog.Content>
   *       <Dialog.Title>Title</Dialog.Title>
   *       <Dialog.Close>Close</Dialog.Close>
   *     </Dialog.Content>
   *   </Dialog.Root>
   * </template>
   * ```
   */
  Root,
  /**
   * Trigger component that opens the dialog.
   *
   * @see https://0.vuetifyjs.com/components/dialog#dialogtrigger
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Dialog } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Dialog.Trigger>
   *     Open Dialog
   *   </Dialog.Trigger>
   * </template>
   * ```
   */
  Trigger,
  /**
   * Content container for the dialog using native `<dialog>` element.
   *
   * @see https://0.vuetifyjs.com/components/dialog#dialogcontent
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Dialog } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Dialog.Content>
   *     <Dialog.Title>Title</Dialog.Title>
   *     <p>Content goes here.</p>
   *     <Dialog.Close>Close</Dialog.Close>
   *   </Dialog.Content>
   * </template>
   * ```
   */
  Content,
  /**
   * Title component for accessible dialog labeling.
   *
   * @see https://0.vuetifyjs.com/components/dialog#dialogtitle
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Dialog } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Dialog.Title>Dialog Title</Dialog.Title>
   * </template>
   * ```
   */
  Title,
  /**
   * Description component for accessible dialog description.
   *
   * @see https://0.vuetifyjs.com/components/dialog#dialogdescription
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Dialog } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Dialog.Description>
   *     This dialog allows you to configure settings.
   *   </Dialog.Description>
   * </template>
   * ```
   */
  Description,
  /**
   * Close button component for closing the dialog.
   *
   * @see https://0.vuetifyjs.com/components/dialog#dialogclose
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Dialog } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Dialog.Close>Close</Dialog.Close>
   * </template>
   * ```
   */
  Close,
}
