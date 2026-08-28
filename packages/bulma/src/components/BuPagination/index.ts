export type { BuPaginationProps } from './BuPagination.vue'

// Context
import Root from './BuPagination.vue'

import Ellipsis from '../BuPaginationEllipsis/BuPaginationEllipsis.vue'
import Item from '../BuPaginationItem/BuPaginationItem.vue'
import List from '../BuPaginationList/BuPaginationList.vue'
import Next from '../BuPaginationNext/BuPaginationNext.vue'
import Prev from '../BuPaginationPrev/BuPaginationPrev.vue'

/**
 * Pager. Owns the current page; prev, next, list, items, and ellipsis are composed as parts.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`BuPaginationPrev`) remain exported and valid.
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { BuPagination } from '@paper/bulma'
 * </script>
 *
 * <template>
 *   <BuPagination>
 *     <BuPagination.Prev />
 *
 *     <BuPagination.Next />
 *
 *     <BuPagination.List>
 *       <BuPagination.Item />
 *
 *       <BuPagination.Ellipsis />
 *     </BuPagination.List>
 *   </BuPagination>
 * </template>
 * ```
 */
export const BuPagination = Object.assign(Root, {
  /** Previous-page control. */
  Prev,
  /** Next-page control. */
  Next,
  /** `ul.pagination-list`. */
  List,
  /** A page number. */
  Item,
  /** Gap marker between page windows. */
  Ellipsis,
})
