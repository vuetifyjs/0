/**
 * @module Snackbar
 *
 * @see https://0.vuetifyjs.com/components/semantic/snackbar
 *
 * @remarks
 * Headless compound component for toast and snackbar notifications.
 * Integrates with useNotifications for queue-driven toast stacks.
 */

export { default as SnackbarPortal } from './SnackbarPortal.vue'
export { default as SnackbarQueue } from './SnackbarQueue.vue'
export { provideSnackbarQueueContext, useSnackbarQueueContext } from './SnackbarQueue.vue'
export { default as SnackbarRoot } from './SnackbarRoot.vue'
export { provideSnackbarRootContext, useSnackbarRootContext } from './SnackbarRoot.vue'
export { default as SnackbarContent } from './SnackbarContent.vue'
export { default as SnackbarClose } from './SnackbarClose.vue'
export type { SnackbarPortalProps, SnackbarPortalSlotProps } from './SnackbarPortal.vue'
export type { SnackbarQueueContext, SnackbarQueueProps, SnackbarQueueSlotProps } from './SnackbarQueue.vue'
export type { SnackbarRootContext, SnackbarRootProps, SnackbarRootSlotProps } from './SnackbarRoot.vue'
export type { SnackbarContentProps } from './SnackbarContent.vue'
export type { SnackbarCloseProps, SnackbarCloseSlotProps } from './SnackbarClose.vue'

// Context
import Close from './SnackbarClose.vue'
import Content from './SnackbarContent.vue'
import Portal from './SnackbarPortal.vue'
import Queue from './SnackbarQueue.vue'
import Root from './SnackbarRoot.vue'

/**
 * Snackbar component with sub-components for building toast notifications.
 *
 * @see https://0.vuetifyjs.com/components/semantic/snackbar
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
   * Container that teleports to `<body>` and manages z-index via useStack.
   * Coordinates layering with Dialog and Scrim. Pass `:teleport="false"`
   * for inline rendering (docs, Storybook, scoped containers).
   *
   * @see https://0.vuetifyjs.com/components/semantic/snackbar
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Snackbar } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Snackbar.Portal>
   *     <Snackbar.Root>
   *       <Snackbar.Content>Saved</Snackbar.Content>
   *       <Snackbar.Close />
   *     </Snackbar.Root>
   *   </Snackbar.Portal>
   * </template>
   * ```
   */
  Portal,
  /**
   * Connects to useNotifications by namespace and exposes queue items
   * via scoped slot. Pauses auto-dismiss on hover and focus (WCAG 2.2.1).
   * Re-pauses after dismiss when hover/focus is still active.
   *
   * @see https://0.vuetifyjs.com/components/semantic/snackbar
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Snackbar } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Snackbar.Queue v-slot="{ items }">
   *     <Snackbar.Root v-for="item in items" :key="item.id" :id="item.id">
   *       <Snackbar.Content>{{ item.subject }}</Snackbar.Content>
   *       <Snackbar.Close />
   *     </Snackbar.Root>
   *   </Snackbar.Queue>
   * </template>
   * ```
   */
  Queue,
  /**
   * A single snackbar instance. Provides dismiss context to child
   * Snackbar.Close components. Defaults to `role="status"` (polite
   * live region) — override with `role="alert"` for urgent notifications.
   *
   * @see https://0.vuetifyjs.com/components/semantic/snackbar
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Snackbar } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Snackbar.Root :id="item.id">
   *     <Snackbar.Content>{{ item.subject }}</Snackbar.Content>
   *     <Snackbar.Close />
   *   </Snackbar.Root>
   * </template>
   * ```
   */
  Root,
  /**
   * Semantic wrapper for the notification message text.
   * Renders as a `<div>` by default. Polymorphic via the `as` prop.
   *
   * @see https://0.vuetifyjs.com/components/semantic/snackbar
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Snackbar } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Snackbar.Content>Changes saved</Snackbar.Content>
   * </template>
   * ```
   */
  Content,
  /**
   * Dismiss button that auto-wires to the nearest Snackbar.Root context.
   * Renders with `aria-label="Close"` and `type="button"`. In renderless
   * mode, all attributes including `onClick` are available via `slotProps.attrs`.
   *
   * @see https://0.vuetifyjs.com/components/semantic/snackbar
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Snackbar } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Snackbar.Close />
   * </template>
   * ```
   */
  Close,
}
