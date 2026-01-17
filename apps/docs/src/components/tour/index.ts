// Types - export first for consumers
export type { TourRootProps, TourRootSlotProps } from './TourRoot.vue'
export { default as TourRoot, useTourContext, provideTourContext } from './TourRoot.vue'

export type { TourHighlightProps, TourHighlightSlotProps } from './TourHighlight.vue'
export { default as TourHighlight } from './TourHighlight.vue'

export type { TourTooltipProps, TourTooltipSlotProps } from './TourTooltip.vue'
export { default as TourTooltip } from './TourTooltip.vue'

// Compound component export
import Root from './TourRoot.vue'
import Highlight from './TourHighlight.vue'
import Tooltip from './TourTooltip.vue'

/**
 * Tour with sub-components for building guided feature discovery.
 *
 * @see https://0.vuetifyjs.com/components/tour
 *
 * @example
 * ```vue
 * <script setup>
 *   import { Tour } from '@/components/tour'
 *
 *   const steps = [
 *     { id: 'step-1', selector: '#search', title: 'Search', content: 'Find anything...' },
 *     { id: 'step-2', selector: '#menu', title: 'Menu', content: 'Navigate here...' },
 *   ]
 * </script>
 *
 * <template>
 *   <Tour.Root :steps="steps" auto-start>
 *     <Tour.Highlight />
 *     <Tour.Tooltip />
 *   </Tour.Root>
 * </template>
 * ```
 */
export const Tour = {
  Root,
  Highlight,
  Tooltip,
}
