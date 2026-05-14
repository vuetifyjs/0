export { provideCarouselRoot, useCarouselRoot } from './CarouselRoot.vue'
export { default as CarouselRoot } from './CarouselRoot.vue'
export { default as CarouselViewport } from './CarouselViewport.vue'
export { default as CarouselItem } from './CarouselItem.vue'
export { default as CarouselPrevious } from './CarouselPrevious.vue'
export { default as CarouselNext } from './CarouselNext.vue'
export { default as CarouselIndicator } from './CarouselIndicator.vue'
export { default as CarouselProgress } from './CarouselProgress.vue'
export { default as CarouselLiveRegion } from './CarouselLiveRegion.vue'

export type { CarouselContext, CarouselOrientation, CarouselPartTicket, CarouselRootProps, CarouselRootSlotProps, CarouselTicket } from './CarouselRoot.vue'
export type { CarouselViewportProps, CarouselViewportSlotProps } from './CarouselViewport.vue'
export type { CarouselItemProps, CarouselItemSlotProps } from './CarouselItem.vue'
export type { CarouselPreviousProps, CarouselPreviousSlotProps } from './CarouselPrevious.vue'
export type { CarouselNextProps, CarouselNextSlotProps } from './CarouselNext.vue'
export type { CarouselIndicatorItem, CarouselIndicatorProps, CarouselIndicatorSlotProps } from './CarouselIndicator.vue'
export type { CarouselProgressProps, CarouselProgressSlotProps } from './CarouselProgress.vue'
export type { CarouselLiveRegionProps, CarouselLiveRegionSlotProps } from './CarouselLiveRegion.vue'

// Context
import Indicator from './CarouselIndicator.vue'
import Item from './CarouselItem.vue'
import LiveRegion from './CarouselLiveRegion.vue'
import Next from './CarouselNext.vue'
import Previous from './CarouselPrevious.vue'
import Progress from './CarouselProgress.vue'
import Root from './CarouselRoot.vue'
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
 *       <Carousel.Item v-for="i in 5" :key="i" :value="i">
 *         Slide {{ i }}
 *       </Carousel.Item>
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
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Carousel } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Carousel.Root circular :autoplay="5000">
   *     <Carousel.Viewport>
   *       <Carousel.Item v-for="i in 5" :key="i" :value="i">
   *         Slide {{ i }}
   *       </Carousel.Item>
   *     </Carousel.Viewport>
   *
   *     <Carousel.Previous>Previous</Carousel.Previous>
   *     <Carousel.Next>Next</Carousel.Next>
   *     <Carousel.LiveRegion class="sr-only" />
   *   </Carousel.Root>
   * </template>
   * ```
   */
  Root,
  /**
   * Scroll-snap container for carousel items. Handles native drag/swipe
   * via CSS scroll-snap and synchronizes scroll position with selection.
   *
   * @see https://0.vuetifyjs.com/components/semantic/carousel
   *
   * @example
   * ```vue
   * <template>
   *   <Carousel.Viewport class="cursor-grab data-[dragging]:cursor-grabbing">
   *     <Carousel.Item v-for="i in 5" :key="i" :value="i">
   *       Slide {{ i }}
   *     </Carousel.Item>
   *   </Carousel.Viewport>
   *
   *   <!-- With slot props -->
   *   <Carousel.Viewport v-slot="{ isDragging }">
   *     <span v-if="isDragging">Dragging...</span>
   *   </Carousel.Viewport>
   * </template>
   * ```
   */
  Viewport,
  /**
   * Individual carousel slide that registers with the step context.
   * Exposes selection state, visibility, and ARIA attributes.
   *
   * @see https://0.vuetifyjs.com/components/semantic/carousel
   *
   * @example
   * ```vue
   * <template>
   *   <Carousel.Item :value="1">Slide 1</Carousel.Item>
   *
   *   <!-- With slot props -->
   *   <Carousel.Item :value="2" v-slot="{ isActive, isSelected }">
   *     <div :class="{ 'opacity-100': isActive, 'opacity-40': !isActive }">
   *       Slide 2
   *     </div>
   *   </Carousel.Item>
   *
   *   <!-- With data attributes -->
   *   <Carousel.Item :value="3" class="data-[active]:opacity-100 opacity-40">
   *     Slide 3
   *   </Carousel.Item>
   * </template>
   * ```
   */
  Item,
  /**
   * Navigation button that moves to the previous slide. Automatically
   * disables at the first slide in non-circular mode.
   *
   * @see https://0.vuetifyjs.com/components/semantic/carousel
   *
   * @example
   * ```vue
   * <template>
   *   <Carousel.Previous>Previous</Carousel.Previous>
   *
   *   <!-- With slot props -->
   *   <Carousel.Previous v-slot="{ isDisabled, isAtEdge }">
   *     <span :class="{ 'opacity-50': isDisabled }">‹</span>
   *   </Carousel.Previous>
   *
   *   <!-- With data attributes -->
   *   <Carousel.Previous class="data-[disabled]:opacity-40">
   *     Previous
   *   </Carousel.Previous>
   * </template>
   * ```
   */
  Previous,
  /**
   * Navigation button that moves to the next slide. Automatically
   * disables at the last visible boundary in non-circular mode.
   *
   * @see https://0.vuetifyjs.com/components/semantic/carousel
   *
   * @example
   * ```vue
   * <template>
   *   <Carousel.Next>Next</Carousel.Next>
   *
   *   <!-- With slot props -->
   *   <Carousel.Next v-slot="{ isDisabled, isAtEdge }">
   *     <span :class="{ 'opacity-50': isDisabled }">›</span>
   *   </Carousel.Next>
   *
   *   <!-- With data attributes -->
   *   <Carousel.Next class="data-[disabled]:opacity-40">
   *     Next
   *   </Carousel.Next>
   * </template>
   * ```
   */
  Next,
  /**
   * Dot indicator navigation showing the active slide. Exposes an
   * `items` array via slot props — one entry per slide with selection
   * state and ARIA attributes. Uses roving tabindex for keyboard nav.
   *
   * @see https://0.vuetifyjs.com/components/semantic/carousel
   *
   * @example
   * ```vue
   * <template>
   *   <Carousel.Indicator v-slot="{ items }">
   *     <button
   *       v-for="item in items"
   *       :key="item.index"
   *       v-bind="item.attrs"
   *       class="size-2 rounded-full bg-surface-variant data-[selected]:bg-primary"
   *     />
   *   </Carousel.Indicator>
   * </template>
   * ```
   */
  Indicator,
  /**
   * Autoplay progress bar that fills based on remaining timer duration.
   * Exposes progress (0–1), autoplay state, and width styling via
   * slot props. Use `data-state` to style active/paused/idle states.
   *
   * @see https://0.vuetifyjs.com/components/semantic/carousel
   *
   * @example
   * ```vue
   * <template>
   *   <Carousel.Progress
   *     class="h-1 bg-surface-variant data-[state=idle]:hidden"
   *   >
   *     <template #default="{ attrs }">
   *       <div
   *         class="h-full bg-primary transition-[width]"
   *         :style="attrs.style"
   *       />
   *     </template>
   *   </Carousel.Progress>
   * </template>
   * ```
   */
  Progress,
  /**
   * Visually-hidden live region that announces slide changes to screen
   * readers. Should be styled with sr-only/visually-hidden CSS.
   *
   * @see https://0.vuetifyjs.com/components/semantic/carousel
   *
   * @example
   * ```vue
   * <template>
   *   <Carousel.Root>
   *     <Carousel.LiveRegion class="sr-only" />
   *     <!-- other carousel items -->
   *   </Carousel.Root>
   * </template>
   * ```
   */
  LiveRegion,
}
