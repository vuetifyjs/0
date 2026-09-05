export { default as OverlayPanelActivator } from './OverlayPanelActivator.vue'
export { default as OverlayPanelClose } from './OverlayPanelClose.vue'
export { default as OverlayPanelContent } from './OverlayPanelContent.vue'
export { provideOverlayPanelContext, useOverlayPanelContext } from './OverlayPanelRoot.vue'
export { default as OverlayPanelRoot } from './OverlayPanelRoot.vue'
export type { OverlayPanelActivatorProps, OverlayPanelActivatorSlotProps } from './OverlayPanelActivator.vue'
export type { OverlayPanelCloseProps, OverlayPanelCloseSlotProps } from './OverlayPanelClose.vue'
export type { OverlayPanelContentProps, OverlayPanelContentSlotProps } from './OverlayPanelContent.vue'
export type { OverlayPanelContext, OverlayPanelRootProps, OverlayPanelRootSlotProps } from './OverlayPanelRoot.vue'

// Context
import Activator from './OverlayPanelActivator.vue'
import Close from './OverlayPanelClose.vue'
import Content from './OverlayPanelContent.vue'
import Root from './OverlayPanelRoot.vue'

/**
 * OverlayPanel component with sub-components for building non-modal floating overlays.
 *
 * Position-agnostic overlay primitive combining portal, z-index stacking, focus management,
 * escape dismissal, and click-outside behavior. Consumer applies positioning.
 *
 * @see https://0.vuetifyjs.com/components/disclosure/overlay-panel
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { OverlayPanel } from '@vuetify/v0'
 * </script>
 *
 * <template>
 *   <OverlayPanel.Root>
 *     <OverlayPanel.Activator>
 *       Open Panel
 *     </OverlayPanel.Activator>
 *
 *     <OverlayPanel.Content aria-label="Panel" class="panel">
 *       <p>Panel content goes here.</p>
 *       <OverlayPanel.Close>Close</OverlayPanel.Close>
 *     </OverlayPanel.Content>
 *   </OverlayPanel.Root>
 * </template>
 *
 * <style>
 * .panel {
 *   position: fixed;
 *   top: 50%;
 *   left: 50%;
 *   transform: translate(-50%, -50%);
 * }
 * </style>
 * ```
 */
export const OverlayPanel = {
  /**
   * Root component for overlay panels.
   *
   * @see https://0.vuetifyjs.com/components/disclosure/overlay-panel
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { OverlayPanel } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <OverlayPanel.Root>
   *     <OverlayPanel.Activator>Open</OverlayPanel.Activator>
   *     <OverlayPanel.Content aria-label="Panel">
   *       <OverlayPanel.Close>Close</OverlayPanel.Close>
   *     </OverlayPanel.Content>
   *   </OverlayPanel.Root>
   * </template>
   * ```
   */
  Root,
  /**
   * Activator component that toggles the overlay panel.
   *
   * @see https://0.vuetifyjs.com/components/disclosure/overlay-panel
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { OverlayPanel } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <OverlayPanel.Activator>
   *     Toggle Panel
   *   </OverlayPanel.Activator>
   * </template>
   * ```
   */
  Activator,
  /**
   * Content container for the overlay panel.
   *
   * @see https://0.vuetifyjs.com/components/disclosure/overlay-panel
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { OverlayPanel } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <OverlayPanel.Content aria-label="Panel">
   *     <p>Content goes here.</p>
   *     <OverlayPanel.Close>Close</OverlayPanel.Close>
   *   </OverlayPanel.Content>
   * </template>
   * ```
   */
  Content,
  /**
   * Close button component for closing the overlay panel.
   *
   * @see https://0.vuetifyjs.com/components/disclosure/overlay-panel
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { OverlayPanel } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <OverlayPanel.Close>Close</OverlayPanel.Close>
   * </template>
   * ```
   */
  Close,
}
