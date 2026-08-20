export type { EmPaginationProps } from './EmPagination.vue'
export type { EmPaginationItemProps } from './EmPaginationItem.vue'
export { default as EmPaginationItem } from './EmPaginationItem.vue'
export type { EmPaginationNextProps } from './EmPaginationNext.vue'
export { default as EmPaginationNext } from './EmPaginationNext.vue'
export type { EmPaginationPrevProps } from './EmPaginationPrev.vue'
export { default as EmPaginationPrev } from './EmPaginationPrev.vue'

// Context
import Root from './EmPagination.vue'
import Item from './EmPaginationItem.vue'
import Next from './EmPaginationNext.vue'
import Prev from './EmPaginationPrev.vue'

/**
 * Pager. Owns the current page and the window of page numbers on show.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`EmPaginationPrev`) remain exported and valid.
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { EmPagination } from '@paper/emerald'
 * </script>
 *
 * <template>
 *   <EmPagination>
 *     <EmPagination.Prev />
 *
 *     <EmPagination.Item />
 *
 *     <EmPagination.Next />
 *   </EmPagination>
 * </template>
 * ```
 */
export const EmPagination = Object.assign(Root, {
  /** Steps back one page. */
  Prev,
  /** A page number. */
  Item,
  /** Steps forward one page. */
  Next,
})
