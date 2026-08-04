export { default as VirtualizerItem } from './VirtualizerItem.vue'

export { default as VirtualizerRoot } from './VirtualizerRoot.vue'
export { provideVirtualizerRoot, useVirtualizerRoot } from './VirtualizerRoot.vue'

export type { VirtualizerItemProps } from './VirtualizerItem.vue'
export type { VirtualizerRootContext, VirtualizerRootProps, VirtualizerRootSlotProps } from './VirtualizerRoot.vue'

// Context
import Item from './VirtualizerItem.vue'
import Root from './VirtualizerRoot.vue'

/**
 * Virtualizer component with sub-components for rendering large lists
 * efficiently.
 *
 * Provides a headless virtualized scroll container that renders only
 * the items within (and slightly beyond) the visible viewport. Uses
 * `createVirtual` internally for offset/size math, scroll anchoring,
 * bidirectional scrolling, and edge detection.
 *
 * @see https://0.vuetifyjs.com/components/data/virtualizer
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { Virtualizer } from '@vuetify/v0'
 *
 *   const items = Array.from({ length: 10000 }, (_, i) => ({ id: i, name: `Item ${i}` }))
 * </script>
 *
 * <template>
 *   <Virtualizer.Root :items :item-height="40" style="height: 600px" v-slot="{ items }">
 *     <Virtualizer.Item
 *       v-for="item in items"
 *       :key="item.index"
 *       :index="item.index"
 *     >
 *       {{ (item.raw as typeof items[0]['raw']).name }}
 *     </Virtualizer.Item>
 *   </Virtualizer.Root>
 * </template>
 * ```
 */
export const Virtualizer = {
  /**
   * Root component for virtualized lists.
   *
   * Creates virtual-scrolling context via `createVirtual`, provides it
   * to `Virtualizer.Item`, and renders the scroll container with
   * leading/trailing spacer elements that reserve space for items
   * scrolled out of view. The default slot receives only the currently
   * visible (plus overscan) items — iterate over them with
   * `Virtualizer.Item`.
   *
   * @see https://0.vuetifyjs.com/components/data/virtualizer
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Virtualizer } from '@vuetify/v0'
   *
   *   const items = Array.from({ length: 10000 }, (_, i) => ({ id: i, name: `Item ${i}` }))
   * </script>
   *
   * <template>
   *   <Virtualizer.Root :items :item-height="40" style="height: 600px" v-slot="{ items, scrollTo }">
   *     <button @click="scrollTo(0)">Scroll to top</button>
   *     <Virtualizer.Item
   *       v-for="item in items"
   *       :key="item.index"
   *       :index="item.index"
   *     >
   *       {{ (item.raw as typeof items[0]['raw']).name }}
   *     </Virtualizer.Item>
   *   </Virtualizer.Root>
   * </template>
   * ```
   */
  Root,
  /**
   * Wrapper for a single rendered item within a virtualized list.
   *
   * Measures its own rendered height via `ResizeObserver` and reports
   * it back to `Virtualizer.Root` (`resize(index, height)`) so
   * subsequent layout accounts for variable item heights, rather than
   * requiring the consumer to call `resize()` by hand.
   *
   * @see https://0.vuetifyjs.com/components/data/virtualizer#anatomy
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Virtualizer } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Virtualizer.Item :index="0" class="p-2 border-b">
   *     Row content, any height
   *   </Virtualizer.Item>
   * </template>
   * ```
   */
  Item,
}
