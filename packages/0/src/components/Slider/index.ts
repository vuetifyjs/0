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

// Components
import HiddenInput from './SliderHiddenInput.vue'
import Range from './SliderRange.vue'
import Root from './SliderRoot.vue'
import Thumb from './SliderThumb.vue'
import Track from './SliderTrack.vue'

/**
 * Slider component with sub-components for range input controls.
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
  Root,
  Track,
  Range,
  Thumb,
  HiddenInput,
}
