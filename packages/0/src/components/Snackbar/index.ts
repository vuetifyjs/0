export { default as SnackbarPortal } from './SnackbarPortal.vue'
export { provideSnackbarContext, useSnackbarContext } from './SnackbarPortal.vue'
export { default as SnackbarRoot } from './SnackbarRoot.vue'
export { default as SnackbarContent } from './SnackbarContent.vue'
export { default as SnackbarAction } from './SnackbarAction.vue'
export { default as SnackbarClose } from './SnackbarClose.vue'
export type { SnackbarContext, SnackbarPortalProps, SnackbarPortalSlotProps } from './SnackbarPortal.vue'
export type { SnackbarRootProps, SnackbarRootSlotProps } from './SnackbarRoot.vue'
export type { SnackbarContentProps } from './SnackbarContent.vue'
export type { SnackbarActionProps } from './SnackbarAction.vue'
export type { SnackbarCloseProps, SnackbarCloseSlotProps } from './SnackbarClose.vue'

// Components
import Action from './SnackbarAction.vue'
import Close from './SnackbarClose.vue'
import Content from './SnackbarContent.vue'
import Portal from './SnackbarPortal.vue'
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
 *     <Snackbar.Root v-for="item in items" :key="item.id" :severity="item.severity">
 *       <Snackbar.Content>{{ item.subject }}</Snackbar.Content>
 *       <Snackbar.Close @click="item.dismiss()" />
 *     </Snackbar.Root>
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
   * A single snackbar instance. Sets ARIA role based on severity.
   *
   * @see https://0.vuetifyjs.com/components/snackbar#snackbarroot
   *
   * @example
   * ```vue
   * <Snackbar.Root severity="error">
   *   <Snackbar.Content>Something went wrong</Snackbar.Content>
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
   * Dismiss button with aria-label="Close".
   *
   * @see https://0.vuetifyjs.com/components/snackbar#snackbarclose
   *
   * @example
   * ```vue
   * <Snackbar.Close @click="item.dismiss()" />
   * ```
   */
  Close,
}
