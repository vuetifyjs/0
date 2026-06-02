export { default as TooltipActivator } from './TooltipActivator.vue'
export { default as TooltipContent } from './TooltipContent.vue'
export { provideTooltipRoot, useTooltipRoot } from './TooltipRoot.vue'
export { default as TooltipRoot } from './TooltipRoot.vue'

export type { TooltipActivatorProps, TooltipActivatorSlotProps } from './TooltipActivator.vue'
export type { TooltipContentProps, TooltipContentSlotProps } from './TooltipContent.vue'
export type { TooltipRootContext, TooltipRootProps, TooltipRootSlotProps } from './TooltipRoot.vue'

// Context
import Activator from './TooltipActivator.vue'
import Content from './TooltipContent.vue'
import Root from './TooltipRoot.vue'

/**
 * Tooltip compound component.
 *
 * @see https://0.vuetifyjs.com/components/disclosure/tooltip
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { Tooltip } from '@vuetify/v0'
 * </script>
 *
 * <template>
 *   <Tooltip.Root>
 *     <Tooltip.Activator>Hover me</Tooltip.Activator>
 *     <Tooltip.Content>Helpful description</Tooltip.Content>
 *   </Tooltip.Root>
 * </template>
 * ```
 */
export const Tooltip = {
  /**
   * Root of a single tooltip instance; coordinates delay, state, and anchoring.
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Tooltip } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Tooltip.Root>
   *     <Tooltip.Activator>Hover me</Tooltip.Activator>
   *     <Tooltip.Content>Helpful description</Tooltip.Content>
   *   </Tooltip.Root>
   * </template>
   * ```
   */
  Root,
  /**
   * Trigger element that opens the tooltip on hover/focus.
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Tooltip } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Tooltip.Activator>Hover me</Tooltip.Activator>
   * </template>
   * ```
   */
  Activator,
  /**
   * Floating content shown while the tooltip is open.
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Tooltip } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Tooltip.Content>Helpful description</Tooltip.Content>
   * </template>
   * ```
   */
  Content,
}
