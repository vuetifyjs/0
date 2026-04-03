export { default as TourRoot } from './TourRoot.vue'
export { provideTourRootContext, useTourRootContext } from './TourRoot.vue'
export type { TourRootContext, TourRootProps, TourRootSlotProps } from './TourRoot.vue'

export { default as TourActivator } from './TourActivator.vue'
export type { TourActivatorProps, TourActivatorSlotProps } from './TourActivator.vue'

export { default as TourContent } from './TourContent.vue'
export type { TourContentProps, TourContentSlotProps } from './TourContent.vue'

export { default as TourHighlight } from './TourHighlight.vue'
export type { TourHighlightProps, TourHighlightSlotProps } from './TourHighlight.vue'

export { default as TourKeyboard } from './TourKeyboard.vue'
export type { TourKeyboardProps } from './TourKeyboard.vue'

export { default as TourTitle } from './TourTitle.vue'
export type { TourTitleProps, TourTitleSlotProps } from './TourTitle.vue'

export { default as TourDescription } from './TourDescription.vue'
export type { TourDescriptionProps, TourDescriptionSlotProps } from './TourDescription.vue'

export { default as TourProgress } from './TourProgress.vue'
export type { TourProgressProps, TourProgressSlotProps } from './TourProgress.vue'

export { default as TourPrev } from './TourPrev.vue'
export type { TourPrevProps, TourPrevSlotProps } from './TourPrev.vue'

export { default as TourNext } from './TourNext.vue'
export type { TourNextProps, TourNextSlotProps } from './TourNext.vue'

export { default as TourSkip } from './TourSkip.vue'
export type { TourSkipEmits, TourSkipProps, TourSkipSlotProps } from './TourSkip.vue'

// Components
import Activator from './TourActivator.vue'
import Content from './TourContent.vue'
import Description from './TourDescription.vue'
import Highlight from './TourHighlight.vue'
import Keyboard from './TourKeyboard.vue'
import Next from './TourNext.vue'
import Prev from './TourPrev.vue'
import Progress from './TourProgress.vue'
import Root from './TourRoot.vue'
import Skip from './TourSkip.vue'
import Title from './TourTitle.vue'

/**
 * Tour component with sub-components for building guided tours.
 *
 * @see https://0.vuetifyjs.com/components/disclosure/tour
 */
export const Tour = {
  /** Per-step context provider. @see https://0.vuetifyjs.com/components/disclosure/tour */
  Root,
  /** Element registration and CSS anchor positioning. */
  Activator,
  /** Tour content container, teleported to body. */
  Content,
  /** SVG overlay with cutout highlighting the active activator. */
  Highlight,
  /** Renderless keyboard navigation (arrow keys + escape). */
  Keyboard,
  /** Semantic heading with aria-labelledby integration. */
  Title,
  /** Semantic paragraph with aria-describedby integration. */
  Description,
  /** Step counter with role="status". */
  Progress,
  /** Previous step button with disabled state. */
  Prev,
  /** Next step / complete tour button. */
  Next,
  /** Dismiss tour button emitting skip event. */
  Skip,
}
