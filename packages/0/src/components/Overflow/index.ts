export { default as OverflowIndicator } from './OverflowIndicator.vue'
export { default as OverflowItem } from './OverflowItem.vue'
export { provideOverflowRoot, useOverflowRoot } from './OverflowRoot.vue'

export { default as OverflowRoot } from './OverflowRoot.vue'

export type { OverflowIndicatorProps, OverflowIndicatorSlotProps } from './OverflowIndicator.vue'
export type { OverflowItemProps, OverflowItemSlotProps } from './OverflowItem.vue'
export type { OverflowRootProps, OverflowRootSlotProps } from './OverflowRoot.vue'
export type { OverflowPriority, OverflowRootContext, OverflowTicket, OverflowTicketInput } from './types'

// Context
import Indicator from './OverflowIndicator.vue'
import Item from './OverflowItem.vue'
import Root from './OverflowRoot.vue'

/**
 * Headless responsive truncation primitive. Children render until the
 * container runs out of width, then overflowing children are hidden
 * and an indicator surfaces the hidden count.
 *
 * @see https://0.vuetifyjs.com/components/semantic/overflow
 */
export const Overflow = {
  /**
   * Root component. Owns the createOverflow context, child registry,
   * and capacity computation.
   *
   * @see https://0.vuetifyjs.com/components/semantic/overflow
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Overflow } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Overflow.Root class="flex gap-2 overflow-hidden">
   *     <Overflow.Item v-for="tag in tags" :key="tag">
   *       {{ tag }}
   *     </Overflow.Item>
   *
   *     <Overflow.Indicator v-slot="{ count }">
   *       +{{ count }} more
   *     </Overflow.Indicator>
   *   </Overflow.Root>
   * </template>
   * ```
   */
  Root,
  /**
   * Individual overflow item. Registers with Root and self-measures.
   * Hidden when its index falls outside capacity.
   *
   * @see https://0.vuetifyjs.com/components/semantic/overflow
   *
   * @example
   * ```vue
   * <template>
   *   <Overflow.Item v-slot="{ isHidden }">
   *     <span :class="{ 'opacity-50': isHidden }">Tag</span>
   *   </Overflow.Item>
   * </template>
   * ```
   */
  Item,
  /**
   * Indicator that renders only when items are hidden. Exposes the
   * hidden count and the array of hidden tickets via slot props.
   *
   * @see https://0.vuetifyjs.com/components/semantic/overflow
   *
   * @example
   * ```vue
   * <template>
   *   <Overflow.Indicator v-slot="{ count, hidden }">
   *     +{{ count }} more
   *   </Overflow.Indicator>
   * </template>
   * ```
   */
  Indicator,
}
