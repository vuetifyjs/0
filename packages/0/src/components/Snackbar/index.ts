/**
 * @module Snackbar
 *
 * @remarks
 * Headless compound component for toast and snackbar notifications.
 * Integrates with useNotifications for queue-driven toast stacks.
 */

export { default as SnackbarPortal } from './SnackbarPortal.vue'
export { provideSnackbarContext, useSnackbarContext } from './SnackbarPortal.vue'
export { default as SnackbarQueue } from './SnackbarQueue.vue'
export { provideSnackbarQueueContext, useSnackbarQueueContext } from './SnackbarQueue.vue'
export { default as SnackbarRoot } from './SnackbarRoot.vue'
export { provideSnackbarRootContext, useSnackbarRootContext } from './SnackbarRoot.vue'
export { default as SnackbarContent } from './SnackbarContent.vue'
export { default as SnackbarAction } from './SnackbarAction.vue'
export { default as SnackbarClose } from './SnackbarClose.vue'
export type { SnackbarContext, SnackbarPortalProps, SnackbarPortalSlotProps } from './SnackbarPortal.vue'
export type { SnackbarQueueContext, SnackbarQueueProps, SnackbarQueueSlotProps } from './SnackbarQueue.vue'
export type { SnackbarRootContext, SnackbarRootProps, SnackbarRootSlotProps } from './SnackbarRoot.vue'
export type { SnackbarContentProps } from './SnackbarContent.vue'
export type { SnackbarActionProps } from './SnackbarAction.vue'
export type { SnackbarCloseProps } from './SnackbarClose.vue'

// Components
import Action from './SnackbarAction.vue'
import Close from './SnackbarClose.vue'
import Content from './SnackbarContent.vue'
import Portal from './SnackbarPortal.vue'
import Queue from './SnackbarQueue.vue'
import Root from './SnackbarRoot.vue'

/**
 * Snackbar component with sub-components for building toast notifications.
 *
 * @see https://0.vuetifyjs.com/components/snackbar
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { Snackbar } from '@vuetify/v0'
 * </script>
 *
 * <template>
 *   <Snackbar.Portal>
 *     <Snackbar.Queue v-slot="{ items }">
 *       <template v-for="item in items" :key="item.id">
 *         <Snackbar.Root :id="item.id">
 *           <Snackbar.Content>{{ item.subject }}</Snackbar.Content>
 *           <Snackbar.Close />
 *         </Snackbar.Root>
 *       </template>
 *     </Snackbar.Queue>
 *   </Snackbar.Portal>
 * </template>
 * ```
 */
export const Snackbar = {
  /**
   * Container that teleports to body and manages z-index via useStack.
   *
   * @see https://0.vuetifyjs.com/components/snackbar
   *
   * @example
   * ```vue
   * <Snackbar.Portal>
   *   <!-- Snackbar.Root items -->
   * </Snackbar.Portal>
   * ```
   */
  Portal,
  /**
   * Connects to useNotifications and exposes queue items via slot.
   * Pauses the queue on mouseenter, resumes on mouseleave.
   *
   * @see https://0.vuetifyjs.com/components/snackbar#snackbarqueue
   *
   * @example
   * ```vue
   * <Snackbar.Queue v-slot="{ items }">
   *   <Snackbar.Root v-for="item in items" :key="item.id" :id="item.id">
   *     <Snackbar.Content>{{ item.subject }}</Snackbar.Content>
   *     <Snackbar.Close />
   *   </Snackbar.Root>
   * </Snackbar.Queue>
   * ```
   */
  Queue,
  /**
   * A single snackbar instance. Provides dismiss context to Snackbar.Close.
   * Set role="alert" for urgent notifications, role="status" for informational.
   *
   * @see https://0.vuetifyjs.com/components/snackbar#snackbarroot
   *
   * @example
   * ```vue
   * <Snackbar.Root :id="item.id">
   *   <Snackbar.Content>Changes saved</Snackbar.Content>
   *   <Snackbar.Close />
   * </Snackbar.Root>
   * ```
   */
  Root,
  /**
   * Semantic wrapper for the notification message text.
   *
   * @see https://0.vuetifyjs.com/components/snackbar#snackbarcontent
   *
   * @example
   * ```vue
   * <Snackbar.Content>Changes saved</Snackbar.Content>
   * ```
   */
  Content,
  /**
   * Optional action button (undo, retry, view, etc.).
   *
   * @see https://0.vuetifyjs.com/components/snackbar#snackbaraction
   *
   * @example
   * ```vue
   * <Snackbar.Action @click="undo()">Undo</Snackbar.Action>
   * ```
   */
  Action,
  /**
   * Dismiss button. Auto-wires to nearest Snackbar.Root context.
   *
   * @see https://0.vuetifyjs.com/components/snackbar#snackbarclose
   *
   * @example
   * ```vue
   * <Snackbar.Close />
   * ```
   */
  Close,
}
