export type {
  QuFeatureDiscoveryColor,
  QuFeatureDiscoveryContext,
  QuFeatureDiscoveryEmits,
  QuFeatureDiscoveryPlacement,
  QuFeatureDiscoveryProps,
  QuFeatureDiscoverySide,
} from './QuFeatureDiscovery.vue'
export { useQuFeatureDiscovery } from './QuFeatureDiscovery.vue'
export type { QuFeatureDiscoveryTargetProps } from './QuFeatureDiscoveryTarget.vue'
export { default as QuFeatureDiscoveryTarget } from './QuFeatureDiscoveryTarget.vue'
export type { QuFeatureDiscoveryTextProps } from './QuFeatureDiscoveryText.vue'
export { default as QuFeatureDiscoveryText } from './QuFeatureDiscoveryText.vue'
export type { QuFeatureDiscoveryTitleProps } from './QuFeatureDiscoveryTitle.vue'
export { default as QuFeatureDiscoveryTitle } from './QuFeatureDiscoveryTitle.vue'

// Context
import Root from './QuFeatureDiscovery.vue'
import Target from './QuFeatureDiscoveryTarget.vue'
import Text from './QuFeatureDiscoveryText.vue'
import Title from './QuFeatureDiscoveryTitle.vue'

/**
 * The Material Design 1 feature discovery prompt: a circular background in
 * the primary (or accent) colour at 96% around a light tap target over one
 * promoted action, with a title and a line of text. Composes v0 `Tour` with a
 * single step (`Tour.Root`, `Tour.Activator`, `Tour.Content`, `Tour.Title`,
 * `Tour.Description`); the root owns `v-model` (open), emits `complete` when
 * the action is tapped and `dismiss` on a tap outside or Escape.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`QuFeatureDiscoveryTitle`) remain exported and valid.
 *
 * @example
 * ```vue
 * <QuFeatureDiscovery v-model="open">
 *   <QuFeatureDiscovery.Target>
 *     <QuButton aria-label="Search" icon="search" />
 *   </QuFeatureDiscovery.Target>
 *
 *   <QuFeatureDiscovery.Title>Find mail fast</QuFeatureDiscovery.Title>
 *
 *   <QuFeatureDiscovery.Text>Search by sender, subject or date.</QuFeatureDiscovery.Text>
 * </QuFeatureDiscovery>
 * ```
 */
export const QuFeatureDiscovery = Object.assign(Root, {
  /** Wraps the promoted action: lifts it over the target disc, pulses it, and completes the prompt when it is tapped. */
  Target,
  /** The headline, Title 20 sp in the prompt's ink; the prompt's accessible name. */
  Title,
  /** The supporting line, Subheading 16 sp at 70%; the prompt's accessible description. */
  Text,
})
