export type { EmTooltipActivatorProps } from './EmTooltipActivator.vue'
export { default as EmTooltipActivator } from './EmTooltipActivator.vue'
export type { EmTooltipContentProps } from './EmTooltipContent.vue'
export { default as EmTooltipContent } from './EmTooltipContent.vue'
export type { EmTooltipProps } from './EmTooltip.vue'

// Context
import Root from './EmTooltip.vue'
import Activator from './EmTooltipActivator.vue'
import Content from './EmTooltipContent.vue'

/**
 * Tooltip. Owns the hover and focus delays plus the positioning of its content.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`EmTooltipActivator`) remain exported and valid.
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { EmTooltip } from '@paper/emerald'
 * </script>
 *
 * <template>
 *   <EmTooltip>
 *     <EmTooltip.Activator />
 *
 *     <EmTooltip.Content />
 *   </EmTooltip>
 * </template>
 * ```
 */
export const EmTooltip = Object.assign(Root, {
  /** Element the tooltip describes. */
  Activator,
  /** The floating label. */
  Content,
})
