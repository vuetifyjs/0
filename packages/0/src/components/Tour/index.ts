export { default as TourActivator } from './TourActivator.vue'
export { default as TourContent } from './TourContent.vue'
export { default as TourDescription } from './TourDescription.vue'
export { default as TourHighlight } from './TourHighlight.vue'
export { default as TourKeyboard } from './TourKeyboard.vue'
export { default as TourNext } from './TourNext.vue'
export { default as TourPrev } from './TourPrev.vue'
export { default as TourProgress } from './TourProgress.vue'
export { provideTourRootContext, useTourRootContext } from './TourRoot.vue'
export { default as TourRoot } from './TourRoot.vue'
export { default as TourSkip } from './TourSkip.vue'
export { default as TourTitle } from './TourTitle.vue'

export type { TourActivatorProps, TourActivatorSlotProps } from './TourActivator.vue'
export type { TourContentProps, TourContentSlotProps, TourPlacement } from './TourContent.vue'
export type { TourDescriptionProps, TourDescriptionSlotProps } from './TourDescription.vue'
export type { TourHighlightProps, TourHighlightSlotProps } from './TourHighlight.vue'
export type { TourKeyboardProps } from './TourKeyboard.vue'
export type { TourNextProps, TourNextSlotProps } from './TourNext.vue'
export type { TourPrevProps, TourPrevSlotProps } from './TourPrev.vue'
export type { TourProgressProps, TourProgressSlotProps } from './TourProgress.vue'
export type { TourRootContext, TourRootProps, TourRootSlotProps } from './TourRoot.vue'
export type { TourSkipEmits, TourSkipProps, TourSkipSlotProps } from './TourSkip.vue'
export type { TourTitleProps, TourTitleSlotProps } from './TourTitle.vue'

// Context
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
 * Tour compound. Consumes a `createTour` / `useTour` instance provided
 * above the tree; `Tour.Root` is per-step context, not the tour factory.
 *
 * @see https://0.vuetifyjs.com/components/disclosure/tour
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { createTourContext } from '@vuetify/v0'
 *   import { Tour } from '@vuetify/v0'
 *
 *   const [, provideTour, tour] = createTourContext()
 *   provideTour()
 *   tour.steps.onboard([{ id: 'intro' }, { id: 'done' }])
 *   tour.start()
 * </script>
 *
 * <template>
 *   <Tour.Keyboard />
 *   <Tour.Highlight />
 *
 *   <Tour.Root step="intro">
 *     <Tour.Activator step="intro">Target</Tour.Activator>
 *     <Tour.Content>
 *       <Tour.Title>Intro</Tour.Title>
 *       <Tour.Description>Welcome.</Tour.Description>
 *       <Tour.Progress />
 *       <Tour.Prev>Back</Tour.Prev>
 *       <Tour.Next>Next</Tour.Next>
 *       <Tour.Skip>Skip</Tour.Skip>
 *     </Tour.Content>
 *   </Tour.Root>
 * </template>
 * ```
 */
export const Tour = {
  /**
   * Per-step context provider. Does not create the tour.
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Tour } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Tour.Root step="intro">
   *     <Tour.Content>…</Tour.Content>
   *   </Tour.Root>
   * </template>
   * ```
   */
  Root,
  /**
   * Target element registered as the step activator.
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Tour } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Tour.Activator step="intro">Target</Tour.Activator>
   * </template>
   * ```
   */
  Activator,
  /**
   * Portaled step overlay, positioned against the activator.
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Tour } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Tour.Content>…</Tour.Content>
   * </template>
   * ```
   */
  Content,
  /**
   * SVG scrim with a cutout around the active activator.
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Tour } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Tour.Highlight blocking />
   * </template>
   * ```
   */
  Highlight,
  /**
   * Renderless keyboard bindings for the active tour.
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Tour } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Tour.Keyboard />
   * </template>
   * ```
   */
  Keyboard,
  /**
   * Accessible step title (`aria-labelledby` target).
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Tour } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Tour.Title>Intro</Tour.Title>
   * </template>
   * ```
   */
  Title,
  /**
   * Accessible step description (`aria-describedby` target).
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Tour } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Tour.Description>Welcome.</Tour.Description>
   * </template>
   * ```
   */
  Description,
  /**
   * Live-region progress, `current / total`.
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Tour } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Tour.Progress />
   * </template>
   * ```
   */
  Progress,
  /**
   * Previous-step control.
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Tour } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Tour.Prev>Back</Tour.Prev>
   * </template>
   * ```
   */
  Prev,
  /**
   * Next-step control; completes the tour on the last step.
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Tour } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Tour.Next>Next</Tour.Next>
   * </template>
   * ```
   */
  Next,
  /**
   * Dismisses the tour without marking it complete.
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Tour } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Tour.Skip>Skip</Tour.Skip>
   * </template>
   * ```
   */
  Skip,
}
