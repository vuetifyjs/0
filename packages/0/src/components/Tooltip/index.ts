export type { TooltipProps, TooltipSlotProps } from './Tooltip.vue'
export { default as TooltipActivator } from './TooltipActivator.vue'
export { default as TooltipContent } from './TooltipContent.vue'
export { provideTooltipRoot, useTooltipRoot } from './TooltipRoot.vue'
export { default as TooltipRoot } from './TooltipRoot.vue'
export type { TooltipActivatorProps, TooltipActivatorSlotProps } from './TooltipActivator.vue'
export type { TooltipContentProps, TooltipContentSlotProps } from './TooltipContent.vue'
export type { TooltipRootContext, TooltipRootProps, TooltipRootSlotProps } from './TooltipRoot.vue'

// Context
import TooltipScope from './Tooltip.vue'
import Activator from './TooltipActivator.vue'
import Content from './TooltipContent.vue'
import Root from './TooltipRoot.vue'

/**
 * Tooltip compound component.
 *
 * Used directly (`<Tooltip>`) the bare component is the optional scope
 * wrapper — it overrides delay defaults for descendants. The compound
 * sub-components (`<Tooltip.Root>` / `<Tooltip.Activator>` /
 * `<Tooltip.Content>`) build the actual tooltip.
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
 *   <Tooltip :openDelay="300">
 *     <Tooltip.Root>
 *       <Tooltip.Activator>Hover me</Tooltip.Activator>
 *       <Tooltip.Content>Helpful description</Tooltip.Content>
 *     </Tooltip.Root>
 *   </Tooltip>
 * </template>
 * ```
 */
export const Tooltip = Object.assign(TooltipScope, {
  Root,
  Activator,
  Content,
})
