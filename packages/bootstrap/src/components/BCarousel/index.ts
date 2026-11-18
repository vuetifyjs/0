export type { BCarouselContext, BCarouselProps } from './BCarousel.vue'

// Context
import Root from './BCarousel.vue'

import Item from '../BCarouselItem/BCarouselItem.vue'

/**
 * Bootstrap 6 carousel. `div.carousel.slide`, index on `v-model`.
 *
 * `autoplay` is a boolean or a millisecond interval. It is not `ride`.
 * There is no `data-bs-slide` and no `data-bs-ride`.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { BCarousel, BCarouselItem } from '@paper/bootstrap'
 * </script>
 *
 * <template>
 *   <BCarousel v-model="index">
 *     <BCarouselItem>First slide</BCarouselItem>
 *
 *     <BCarouselItem>Second slide</BCarouselItem>
 *   </BCarousel>
 * </template>
 * ```
 */
export const BCarousel = Object.assign(Root, {
  /** `div.carousel-item`. `.active` is the current slide. */
  Item,
})
