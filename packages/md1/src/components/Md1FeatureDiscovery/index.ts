export type {
  Md1FeatureDiscoveryColor,
  Md1FeatureDiscoveryContext,
  Md1FeatureDiscoveryEmits,
  Md1FeatureDiscoveryPlacement,
  Md1FeatureDiscoveryProps,
  Md1FeatureDiscoverySide,
} from './Md1FeatureDiscovery.vue'
export { useMd1FeatureDiscovery } from './Md1FeatureDiscovery.vue'
export type { Md1FeatureDiscoveryActivatorProps } from './Md1FeatureDiscoveryActivator.vue'
export { default as Md1FeatureDiscoveryActivator } from './Md1FeatureDiscoveryActivator.vue'
export type { Md1FeatureDiscoveryTextProps } from './Md1FeatureDiscoveryText.vue'
export { default as Md1FeatureDiscoveryText } from './Md1FeatureDiscoveryText.vue'
export type { Md1FeatureDiscoveryTitleProps } from './Md1FeatureDiscoveryTitle.vue'
export { default as Md1FeatureDiscoveryTitle } from './Md1FeatureDiscoveryTitle.vue'

// Context
import Root from './Md1FeatureDiscovery.vue'
import Activator from './Md1FeatureDiscoveryActivator.vue'
import Text from './Md1FeatureDiscoveryText.vue'
import Title from './Md1FeatureDiscoveryTitle.vue'

/**
 * The Material Design 1 feature discovery prompt: a circular background in
 * the primary (or accent) colour at 96% around a light tap target over one
 * promoted action, with a title and a line of text. Composes v0 `Tour` with a
 * single step (`Tour.Root`, `Tour.Activator`, `Tour.Content`, `Tour.Title`,
 * `Tour.Description`); the root owns `v-model` (open), emits `complete` when
 * the action is tapped and `dismiss` on a tap outside or Escape.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`Md1FeatureDiscoveryTitle`) remain exported and valid.
 *
 * @example
 * ```vue
 * <Md1FeatureDiscovery v-model="open">
 *   <Md1FeatureDiscovery.Activator>
 *     <Md1Button aria-label="Search" icon="search" />
 *   </Md1FeatureDiscovery.Activator>
 *
 *   <Md1FeatureDiscovery.Title>Find mail fast</Md1FeatureDiscovery.Title>
 *
 *   <Md1FeatureDiscovery.Text>Search by sender, subject or date.</Md1FeatureDiscovery.Text>
 * </Md1FeatureDiscovery>
 * ```
 */
export const Md1FeatureDiscovery = Object.assign(Root, {
  /** Wraps the promoted action: lifts it over the target disc, pulses it, and completes the prompt when it is tapped. */
  Activator,
  /** The headline, Title 20 sp in the prompt's ink; the prompt's accessible name. */
  Title,
  /** The supporting line, Subheading 16 sp at 70%; the prompt's accessible description. */
  Text,
})
