export type { BPaginationProps } from './BPagination.vue'
export type { BPaginationItemProps } from '../BPaginationItem/BPaginationItem.vue'
export type { BPaginationNextProps } from '../BPaginationNext/BPaginationNext.vue'
export type { BPaginationPrevProps } from '../BPaginationPrev/BPaginationPrev.vue'

// Context
import Root from './BPagination.vue'

import Item from '../BPaginationItem/BPaginationItem.vue'
import Next from '../BPaginationNext/BPaginationNext.vue'
import Prev from '../BPaginationPrev/BPaginationPrev.vue'

/**
 * Bootstrap 6 pagination. `v-model` is the 1-based page from v0 Pagination. It is not converted.
 *
 * Canon: `ul.pagination` > `li.page-item` > `a.page-link`. `.active` and `.disabled` sit on the `li`. `size` is only `sm` or `lg`.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { shallowRef } from 'vue'
 *   import { BPagination } from '@paper/bootstrap'
 *
 *   const page = shallowRef(2)
 * </script>
 *
 * <template>
 *   <BPagination v-model="page" :total="3" label="Page navigation example">
 *     <BPagination.Prev>Previous</BPagination.Prev>
 *     <BPagination.Item :value="1">1</BPagination.Item>
 *     <BPagination.Item :value="2">2</BPagination.Item>
 *     <BPagination.Item :value="3">3</BPagination.Item>
 *     <BPagination.Next>Next</BPagination.Next>
 *   </BPagination>
 * </template>
 * ```
 */
export const BPagination = Object.assign(Root, {
  /** `li.page-item` > `a.page-link`. */
  Item,
  /** Previous page. Disabled on the first page. */
  Prev,
  /** Next page. Disabled on the last page. */
  Next,
})
