export { default as VirtualizerItem } from './VirtualizerItem.vue'

export { provideVirtualizerRoot, useVirtualizerRoot } from './VirtualizerRoot.vue'
export { default as VirtualizerRoot } from './VirtualizerRoot.vue'

export { default as VirtualizerSpacer } from './VirtualizerSpacer.vue'

export type { VirtualizerItemProps } from './VirtualizerItem.vue'
export type { VirtualizerRootContext, VirtualizerRootEmits, VirtualizerRootExpose, VirtualizerRootProps, VirtualizerRootSlotProps } from './VirtualizerRoot.vue'
export type { VirtualizerSpacerProps, VirtualizerSpacerSlotProps } from './VirtualizerSpacer.vue'

// Context
import Item from './VirtualizerItem.vue'
import Root from './VirtualizerRoot.vue'
import Spacer from './VirtualizerSpacer.vue'

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
 *   <Virtualizer.Root :items :item-height="40" style="height: 600px" v-slot="{ items: visible }">
 *     <Virtualizer.Spacer />
 *     <Virtualizer.Item
 *       v-for="item in visible"
 *       :key="item.raw.id"
 *       :index="item.index"
 *     >
 *       {{ item.raw.name }}
 *     </Virtualizer.Item>
 *     <Virtualizer.Spacer edge="end" />
 *   </Virtualizer.Root>
 * </template>
 * ```
 */
export const Virtualizer = {
  /**
   * Root component for virtualized lists.
   *
   * Creates virtual-scrolling context via `createVirtual`, provides it
   * to `Virtualizer.Item` and `Virtualizer.Spacer`, and renders the
   * scroll container. Place a `Virtualizer.Spacer` before the items and
   * one with `edge="end"` after them; those reserve the off-screen range.
   * The default slot receives only the currently visible (plus overscan)
   * items — iterate over them with `Virtualizer.Item`.
   *
   * @see https://0.vuetifyjs.com/components/data/virtualizer
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Virtualizer } from '@vuetify/v0'
   *   import { shallowRef } from 'vue'
   *
   *   const items = shallowRef(Array.from({ length: 100 }, (_, i) => ({ id: i, name: `Item ${i}` })))
   *
   *   function onBottom () {
   *     const start = items.value.length
   *     items.value = [...items.value, ...Array.from({ length: 100 }, (_, i) => ({ id: start + i, name: `Item ${start + i}` }))]
   *   }
   * </script>
   *
   * <template>
   *   <Virtualizer.Root
   *     :items
   *     :item-height="40"
   *     :bottom-threshold="200"
   *     style="height: 600px"
   *     v-slot="{ items: visible }"
   *     @bottom="onBottom"
   *   >
   *     <Virtualizer.Spacer />
   *     <Virtualizer.Item
   *       v-for="item in visible"
   *       :key="item.raw.id"
   *       :index="item.index"
   *     >
   *       {{ item.raw.name }}
   *     </Virtualizer.Item>
   *     <Virtualizer.Spacer edge="end" />
   *   </Virtualizer.Root>
   * </template>
   * ```
   */
  Root,
  /**
   * Reserves the scroll range for rows that are not mounted.
   *
   * `edge` defaults to `start` (rows above the window). The matching
   * spacer after the items uses `edge="end"`. Height comes from the
   * virtualizer. Set `as` when the scroll container is a `ul` or
   * another element that cannot contain a `div`.
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
   *   <Virtualizer.Root as="ul" :item-height="40" style="height: 600px">
   *     <Virtualizer.Spacer as="li" />
   *     <Virtualizer.Item as="li" :index="0">Row</Virtualizer.Item>
   *     <Virtualizer.Spacer as="li" edge="end" />
   *   </Virtualizer.Root>
   * </template>
   * ```
   */
  Spacer,
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
