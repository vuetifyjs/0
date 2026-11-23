export { default as ScrollAreaCorner } from './ScrollAreaCorner.vue'
export { provideScrollAreaRoot, useScrollAreaRoot } from './ScrollAreaRoot.vue'
export { default as ScrollAreaRoot } from './ScrollAreaRoot.vue'
export { provideScrollAreaScrollbar, useScrollAreaScrollbar } from './ScrollAreaScrollbar.vue'
export { default as ScrollAreaScrollbar } from './ScrollAreaScrollbar.vue'
export { default as ScrollAreaThumb } from './ScrollAreaThumb.vue'
export { default as ScrollAreaViewport } from './ScrollAreaViewport.vue'

export type { ScrollAreaCornerProps, ScrollAreaCornerSlotProps } from './ScrollAreaCorner.vue'
export type { ScrollAreaAxis, ScrollAreaContext, ScrollAreaMetrics, ScrollAreaOrientation, ScrollAreaPartTicket, ScrollAreaRootExpose, ScrollAreaRootProps, ScrollAreaRootSlotProps, ScrollAreaVisibility } from './ScrollAreaRoot.vue'
export type { ScrollAreaScrollbarContext, ScrollAreaScrollbarProps, ScrollAreaScrollbarSlotProps, ScrollAreaScrollbarState } from './ScrollAreaScrollbar.vue'
export type { ScrollAreaThumbProps, ScrollAreaThumbSlotProps, ScrollAreaThumbState } from './ScrollAreaThumb.vue'
export type { ScrollAreaViewportProps, ScrollAreaViewportSlotProps } from './ScrollAreaViewport.vue'

// Context
import Corner from './ScrollAreaCorner.vue'
import Root from './ScrollAreaRoot.vue'
import Scrollbar from './ScrollAreaScrollbar.vue'
import Thumb from './ScrollAreaThumb.vue'
import Viewport from './ScrollAreaViewport.vue'

/**
 * ScrollArea component with sub-components for building scroll regions with
 * custom, styleable scrollbars on top of native scrolling.
 *
 * @see https://0.vuetifyjs.com/components/semantic/scroll-area
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { ScrollArea } from '@vuetify/v0'
 * </script>
 *
 * <template>
 *   <ScrollArea.Root class="h-64" visibility="hover">
 *     <ScrollArea.Viewport class="size-full">
 *       Long content
 *     </ScrollArea.Viewport>
 *
 *     <ScrollArea.Scrollbar orientation="vertical">
 *       <ScrollArea.Thumb />
 *     </ScrollArea.Scrollbar>
 *   </ScrollArea.Root>
 * </template>
 * ```
 */
export const ScrollArea = {
  /**
   * Root container that measures the viewport and decides when scrollbars are shown.
   *
   * @see https://0.vuetifyjs.com/components/semantic/scroll-area
   *
   * @example
   * ```vue
   * <ScrollArea.Root visibility="scroll" :delay="800">
   *   <ScrollArea.Viewport />
   *   <ScrollArea.Scrollbar />
   * </ScrollArea.Root>
   * ```
   */
  Root,
  /**
   * The natively scrolling element that holds the content.
   *
   * @see https://0.vuetifyjs.com/components/semantic/scroll-area
   *
   * @example
   * ```vue
   * <ScrollArea.Viewport class="size-full">
   *   Long content
   * </ScrollArea.Viewport>
   * ```
   */
  Viewport,
  /**
   * Track of a custom scrollbar for one axis. Mounting it enables scrolling on that axis.
   *
   * @see https://0.vuetifyjs.com/components/semantic/scroll-area
   *
   * @example
   * ```vue
   * <ScrollArea.Scrollbar orientation="horizontal">
   *   <ScrollArea.Thumb />
   * </ScrollArea.Scrollbar>
   * ```
   */
  Scrollbar,
  /**
   * Draggable thumb sized and positioned from the scroll state.
   *
   * @see https://0.vuetifyjs.com/components/semantic/scroll-area
   *
   * @example
   * ```vue
   * <ScrollArea.Thumb class="rounded-full bg-on-surface/40" />
   * ```
   */
  Thumb,
  /**
   * Fills the corner where both scrollbars meet. Rendered only while both are visible.
   *
   * @see https://0.vuetifyjs.com/components/semantic/scroll-area
   *
   * @example
   * ```vue
   * <ScrollArea.Corner class="bg-surface" />
   * ```
   */
  Corner,
}
