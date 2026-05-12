export { default as SliderHiddenInput } from './SliderHiddenInput.vue'

export { default as SliderRange } from './SliderRange.vue'

export { default as SliderRoot } from './SliderRoot.vue'
export { provideSliderRoot, useSliderRoot } from './SliderRoot.vue'

export { default as SliderThumb } from './SliderThumb.vue'

export { default as SliderTrack } from './SliderTrack.vue'

export type { SliderHiddenInputProps } from './SliderHiddenInput.vue'
export type { SliderRangeProps, SliderRangeSlotProps } from './SliderRange.vue'
export type { SliderRootContext, SliderRootProps, SliderRootSlotProps } from './SliderRoot.vue'
export type { SliderThumbProps, SliderThumbSlotProps, SliderThumbState } from './SliderThumb.vue'
export type { SliderTrackProps, SliderTrackSlotProps } from './SliderTrack.vue'

// Context
import HiddenInput from './SliderHiddenInput.vue'
import Range from './SliderRange.vue'
import Root from './SliderRoot.vue'
import Thumb from './SliderThumb.vue'
import Track from './SliderTrack.vue'

/**
 * Slider component with sub-components for range input controls.
 *
 * @see https://0.vuetifyjs.com/components/forms/slider
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { Slider } from '@vuetify/v0'
 *   import { ref } from 'vue'
 *
 *   const value = ref([50])
 * </script>
 *
 * <template>
 *   <Slider.Root v-model="value" :min="0" :max="100">
 *     <Slider.Track>
 *       <Slider.Range />
 *     </Slider.Track>
 *     <Slider.Thumb />
 *   </Slider.Root>
 * </template>
 * ```
 */
export const Slider = {
  /**
   * Root component for sliders.
   *
   * Creates slider context, provides it to child components, and
   * bridges v-model. Value is always `number[]`: single thumb = `[50]`,
   * range = `[25, 75]`. Configure min, max, step, and orientation via
   * props. When `name` prop is provided, automatically renders hidden
   * inputs for form submission.
   *
   * @see https://0.vuetifyjs.com/components/forms/slider
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Slider } from '@vuetify/v0'
   *   import { ref } from 'vue'
   *
   *   const value = ref([50])
   * </script>
   *
   * <template>
   *   <Slider.Root v-model="value" :min="0" :max="100">
   *     <Slider.Track>
   *       <Slider.Range />
   *     </Slider.Track>
   *     <Slider.Thumb />
   *   </Slider.Root>
   * </template>
   * ```
   */
  Root,
  /**
   * Track element that contains the Range and handles click-to-position.
   *
   * On pointerdown, calculates the value from pointer position, snaps
   * the nearest thumb to that value, and initiates drag. Must contain
   * Slider.Range as a child.
   *
   * @see https://0.vuetifyjs.com/components/forms/slider#anatomy
   *
   * @example
   * ```vue
   * <Slider.Track>
   *   <Slider.Range />
   * </Slider.Track>
   * ```
   */
  Track,
  /**
   * Filled region between thumb positions.
   *
   * For single-thumb sliders, fills from min to the thumb value.
   * For range sliders, fills between the lowest and highest thumb
   * values. Must be used within a Slider.Track component.
   *
   * @see https://0.vuetifyjs.com/components/forms/slider#anatomy
   *
   * @example
   * ```vue
   * <Slider.Track>
   *   <Slider.Range />
   * </Slider.Track>
   * ```
   */
  Range,
  /**
   * Draggable thumb control with keyboard navigation.
   *
   * Auto-registers with parent Root to receive its index. Supports
   * pointer drag and full keyboard navigation (Arrow, Page, Home/End).
   * Provides ARIA slider attributes including per-thumb constrained
   * valuemin/valuemax for multi-thumb sliders. Render multiple Thumbs
   * for range sliders.
   *
   * @see https://0.vuetifyjs.com/components/forms/slider#anatomy
   *
   * @example
   * ```vue
   * <Slider.Thumb />
   * ```
   */
  Thumb,
  /**
   * Hidden native input for form submission.
   *
   * Auto-rendered by Root when `name` prop is provided — one input
   * per thumb value. Can also be used explicitly for custom form
   * integration.
   *
   * @see https://0.vuetifyjs.com/components/forms/slider#form-integration
   * @internal
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Slider } from '@vuetify/v0'
   *   import { ref } from 'vue'
   *
   *   const value = ref([50])
   * </script>
   *
   * <template>
   *   <!-- You don't need to do this — Root auto-renders hidden
   *        inputs when the `name` prop is set. This is only needed
   *        for custom form integration. -->
   *   <Slider.Root v-model="value">
   *     <Slider.Track>
   *       <Slider.Range />
   *     </Slider.Track>
   *     <Slider.Thumb />
   *     <Slider.HiddenInput name="volume" :index="0" />
   *   </Slider.Root>
   * </template>
   * ```
   */
  HiddenInput,
}
