export { provideCarouselRoot, useCarouselRoot } from './CarouselRoot.vue'
export { default as CarouselRoot } from './CarouselRoot.vue'
export { default as CarouselViewport } from './CarouselViewport.vue'
export { default as CarouselSlide } from './CarouselSlide.vue'
export { default as CarouselPrevious } from './CarouselPrevious.vue'
export { default as CarouselNext } from './CarouselNext.vue'

export type { CarouselContext, CarouselOrientation, CarouselRootProps, CarouselRootSlotProps } from './CarouselRoot.vue'
export type { CarouselViewportProps, CarouselViewportSlotProps } from './CarouselViewport.vue'
export type { CarouselSlideProps, CarouselSlideSlotProps } from './CarouselSlide.vue'
export type { CarouselPreviousProps, CarouselPreviousSlotProps } from './CarouselPrevious.vue'
export type { CarouselNextProps, CarouselNextSlotProps } from './CarouselNext.vue'

// Components
import Next from './CarouselNext.vue'
import Previous from './CarouselPrevious.vue'
import Root from './CarouselRoot.vue'
import Slide from './CarouselSlide.vue'
import Viewport from './CarouselViewport.vue'

/**
 * Carousel component with sub-components for building accessible slide navigation.
 *
 * @see https://0.vuetifyjs.com/components/semantic/carousel
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { Carousel } from '@vuetify/v0'
 * </script>
 *
 * <template>
 *   <Carousel.Root circular>
 *     <Carousel.Viewport>
 *       <Carousel.Slide v-for="i in 5" :key="i" :value="i">
 *         Slide {{ i }}
 *       </Carousel.Slide>
 *     </Carousel.Viewport>
 *
 *     <Carousel.Previous>Previous</Carousel.Previous>
 *     <Carousel.Next>Next</Carousel.Next>
 *   </Carousel.Root>
 * </template>
 * ```
 */
export const Carousel = {
  /**
   * Root component that provides carousel context.
   *
   * @see https://0.vuetifyjs.com/components/semantic/carousel
   */
  Root,
  /**
   * Scroll-snap container for slides.
   *
   * @see https://0.vuetifyjs.com/components/semantic/carousel
   */
  Viewport,
  /**
   * Individual slide element.
   *
   * @see https://0.vuetifyjs.com/components/semantic/carousel
   */
  Slide,
  /**
   * Previous slide navigation button.
   *
   * @see https://0.vuetifyjs.com/components/semantic/carousel
   */
  Previous,
  /**
   * Next slide navigation button.
   *
   * @see https://0.vuetifyjs.com/components/semantic/carousel
   */
  Next,
}
