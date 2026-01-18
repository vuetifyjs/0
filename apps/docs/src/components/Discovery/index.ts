export { default as DiscoveryRoot } from './DiscoveryRoot.vue'
export { provideDiscoveryRootContext, useDiscoveryRootContext } from './DiscoveryRoot.vue'
export { default as DiscoveryActivator } from './DiscoveryActivator.vue'
export { default as DiscoveryContent } from './DiscoveryContent.vue'
export { default as DiscoveryTitle } from './DiscoveryTitle.vue'
export { default as DiscoveryDescription } from './DiscoveryDescription.vue'
export { default as DiscoveryHighlight } from './DiscoveryHighlight.vue'
export { default as DiscoveryProgress } from './DiscoveryProgress.vue'
export { default as DiscoveryPrev } from './DiscoveryPrev.vue'
export { default as DiscoveryNext } from './DiscoveryNext.vue'
export { default as DiscoverySkip } from './DiscoverySkip.vue'
export { default as DiscoveryTooltip } from './DiscoveryTooltip.vue'

export type { DiscoveryRootContext, DiscoveryRootProps, DiscoveryRootSlotProps } from './DiscoveryRoot.vue'
export type { DiscoveryActivatorProps, DiscoveryActivatorSlotProps } from './DiscoveryActivator.vue'
export type { DiscoveryContentProps, DiscoveryContentSlotProps } from './DiscoveryContent.vue'
export type { DiscoveryTitleProps, DiscoveryTitleSlotProps } from './DiscoveryTitle.vue'
export type { DiscoveryDescriptionProps, DiscoveryDescriptionSlotProps } from './DiscoveryDescription.vue'
export type { DiscoveryHighlightProps, DiscoveryHighlightSlotProps } from './DiscoveryHighlight.vue'
export type { DiscoveryProgressProps, DiscoveryProgressSlotProps } from './DiscoveryProgress.vue'
export type { DiscoveryPrevProps, DiscoveryPrevSlotProps } from './DiscoveryPrev.vue'
export type { DiscoveryNextProps, DiscoveryNextSlotProps } from './DiscoveryNext.vue'
export type { DiscoverySkipProps, DiscoverySkipSlotProps } from './DiscoverySkip.vue'
export type { DiscoveryTooltipProps, DiscoveryTooltipSlotProps } from './DiscoveryTooltip.vue'

// Components
import Activator from './DiscoveryActivator.vue'
import Content from './DiscoveryContent.vue'
import Description from './DiscoveryDescription.vue'
import Highlight from './DiscoveryHighlight.vue'
import Next from './DiscoveryNext.vue'
import Prev from './DiscoveryPrev.vue'
import Progress from './DiscoveryProgress.vue'
import Root from './DiscoveryRoot.vue'
import Skip from './DiscoverySkip.vue'
import Title from './DiscoveryTitle.vue'
import Tooltip from './DiscoveryTooltip.vue'

/**
 * Discovery component for feature tours and guided experiences.
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { Discovery } from '@/components/Discovery'
 *   import { useDiscovery } from '@/composables/useDiscovery'
 *
 *   const discovery = useDiscovery()
 * </script>
 *
 * <template>
 *   <Discovery.Highlight />
 *
 *   <Discovery.Activator step="search">
 *     <SearchInput />
 *   </Discovery.Activator>
 *
 *   <Discovery.Root step="search">
 *     <Discovery.Content>
 *       <Discovery.Title>Search Feature</Discovery.Title>
 *       <Discovery.Progress />
 *       <Discovery.Description>
 *         Use the search to find content.
 *       </Discovery.Description>
 *       <Discovery.Prev>Previous</Discovery.Prev>
 *       <Discovery.Skip>Skip</Discovery.Skip>
 *       <Discovery.Next>Next</Discovery.Next>
 *     </Discovery.Content>
 *   </Discovery.Root>
 *
 *   <button @click="discovery.start()">Start Tour</button>
 * </template>
 * ```
 */
export const Discovery = {
  /** Root component that registers a step and provides context to children */
  Root,
  /** Registers target element for highlighting */
  Activator,
  /** SVG overlay with transparent cutout around the active step's activator */
  Highlight,
  /** Container for step content, rendered when step is active */
  Content,
  /** Accessible title for the step */
  Title,
  /** Accessible description for the step */
  Description,
  /** Progress indicator showing current position (e.g., "2 of 5") */
  Progress,
  /** Navigate to previous step */
  Prev,
  /** Navigate to next step or complete tour on last step */
  Next,
  /** Skip/close the tour */
  Skip,
  /** Positioned tooltip that follows the activator */
  Tooltip,
}
