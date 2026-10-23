export type { QuTooltipContext, QuTooltipProps, QuTooltipSlotProps } from './QuTooltip.vue'
export { useQuTooltip } from './QuTooltip.vue'
export type { QuTooltipActivatorProps, QuTooltipActivatorSlotProps } from './QuTooltipActivator.vue'
export { default as QuTooltipActivator } from './QuTooltipActivator.vue'
export type { QuTooltipContentProps } from './QuTooltipContent.vue'
export { default as QuTooltipContent } from './QuTooltipContent.vue'

// Context
import Root from './QuTooltip.vue'
import Activator from './QuTooltipActivator.vue'
import Content from './QuTooltipContent.vue'

/**
 * The Material Design 1 tooltip: a one-line label in Grey 700 at 90% that
 * shows below its target on hover, keyboard focus, or a press and hold, in the
 * desktop (22 dp, 10 sp) and touch (32 dp, 14 sp) metrics. Composes v0's
 * `Tooltip` compound for the delays, `aria-describedby`, Escape and anchored
 * placement, and adds the press and hold v0 leaves out.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`QuTooltipContent`) remain exported and valid.
 *
 * @example
 * ```vue
 * <QuTooltip>
 *   <QuTooltip.Activator v-slot="{ attrs }">
 *     <QuButton v-bind="attrs" aria-label="Delete" icon="delete" />
 *   </QuTooltip.Activator>
 *
 *   <QuTooltip.Content>Delete</QuTooltip.Content>
 * </QuTooltip>
 * ```
 */
export const QuTooltip = Object.assign(Root, {
  /** Renderless target host: spread `attrs` onto the control the tooltip describes. */
  Activator,
  /** The label tile: one line of plain text, centred below the target. */
  Content,
})
