export type { Md1TooltipContext, Md1TooltipProps, Md1TooltipSlotProps } from './Md1Tooltip.vue'
export { useMd1Tooltip } from './Md1Tooltip.vue'
export type { Md1TooltipActivatorProps, Md1TooltipActivatorSlotProps } from './Md1TooltipActivator.vue'
export { default as Md1TooltipActivator } from './Md1TooltipActivator.vue'
export type { Md1TooltipContentProps } from './Md1TooltipContent.vue'
export { default as Md1TooltipContent } from './Md1TooltipContent.vue'

// Context
import Root from './Md1Tooltip.vue'
import Activator from './Md1TooltipActivator.vue'
import Content from './Md1TooltipContent.vue'

/**
 * The Material Design 1 tooltip: a one-line label in Grey 700 at 90% that
 * shows below its target on hover, keyboard focus, or a press and hold, in the
 * desktop (22 dp, 10 sp) and touch (32 dp, 14 sp) metrics. Composes v0's
 * `Tooltip` compound for the delays, `aria-describedby`, Escape and anchored
 * placement, and adds the press and hold v0 leaves out.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`Md1TooltipContent`) remain exported and valid.
 *
 * @example
 * ```vue
 * <Md1Tooltip>
 *   <Md1Tooltip.Activator v-slot="{ attrs }">
 *     <Md1Button v-bind="attrs" aria-label="Delete" icon="delete" />
 *   </Md1Tooltip.Activator>
 *
 *   <Md1Tooltip.Content>Delete</Md1Tooltip.Content>
 * </Md1Tooltip>
 * ```
 */
export const Md1Tooltip = Object.assign(Root, {
  /** Renderless target host: spread `attrs` onto the control the tooltip describes. */
  Activator,
  /** The label tile: one line of plain text, centred below the target. */
  Content,
})
