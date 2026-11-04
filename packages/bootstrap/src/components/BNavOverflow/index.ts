export type { BNavOverflowContext, BNavOverflowProps, BNavOverflowTicket } from './BNavOverflow.vue'
export type { BNavOverflowItemProps } from './BNavOverflowItem.vue'

// Context
import Root from './BNavOverflow.vue'
import Item from './BNavOverflowItem.vue'

/**
 * Bootstrap 6 nav overflow. Items that do not fit move into a More menu.
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { BNavOverflow } from '@paper/bootstrap'
 * </script>
 *
 * <template>
 *   <BNavOverflow>
 *     <ul class="nav nav-pills">
 *       <BNavOverflow.Item>
 *         <a class="nav-link" href="#">Home</a>
 *       </BNavOverflow.Item>
 *     </ul>
 *   </BNavOverflow>
 * </template>
 * ```
 */
export const BNavOverflow = Object.assign(Root, {
  /** Measured `li.nav-item`. `keep` or `.nav-overflow-keep` stays in the row. */
  Item,
})
