export type { PaginationEllipsisProps, PaginationEllipsisSlotProps } from './PaginationEllipsis.vue'
export { default as PaginationEllipsis } from './PaginationEllipsis.vue'
export type { PaginationFirstProps, PaginationFirstSlotProps } from './PaginationFirst.vue'
export { default as PaginationFirst } from './PaginationFirst.vue'
export type { PaginationItemProps, PaginationItemSlotProps } from './PaginationItem.vue'
export { default as PaginationItem } from './PaginationItem.vue'
export type { PaginationLastProps, PaginationLastSlotProps } from './PaginationLast.vue'

export { default as PaginationLast } from './PaginationLast.vue'

export type { PaginationNextProps, PaginationNextSlotProps } from './PaginationNext.vue'
export { default as PaginationNext } from './PaginationNext.vue'
export type { PaginationPrevProps, PaginationPrevSlotProps } from './PaginationPrev.vue'
export { default as PaginationPrev } from './PaginationPrev.vue'
export type { PaginationRootProps, PaginationRootSlotProps } from './PaginationRoot.vue'
export { providePaginationControls, providePaginationItems, providePaginationRoot, usePaginationControls, usePaginationItems, usePaginationRoot } from './PaginationRoot.vue'
export { default as PaginationRoot } from './PaginationRoot.vue'

import Ellipsis from './PaginationEllipsis.vue'
import First from './PaginationFirst.vue'
import Item from './PaginationItem.vue'
import Last from './PaginationLast.vue'
import Next from './PaginationNext.vue'
import Prev from './PaginationPrev.vue'
import Root from './PaginationRoot.vue'

export const Pagination = {
  /**
   * Root component for pagination controls.
   *
   * @see https://0.vuetifyjs.com/components/pagination
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Pagination } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Pagination.Root v-model="page" :size="100">
   *     <Pagination.First />
   *
   *     <Pagination.Prev />
   *
   *     <template v-for="item in items" :key="item.value">
   *       <Pagination.Item v-if="item.type === 'page'" :value="item.value" />
   *
   *       <Pagination.Ellipsis v-else />
   *     </template>
   *
   *     <Pagination.Next />
   *
   *     <Pagination.Last />
   *   </Pagination.Root>
   * </template>
   * ```
   */
  Root,
  /**
   * Individual page button that navigates to a specific page number.
   *
   * @see https://0.vuetifyjs.com/components/pagination#paginationitem
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Pagination } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Pagination.Item :value="1">1</Pagination.Item>
   *
   *   <!-- With slot props -->
   *   <Pagination.Item :value="2" v-slot="{ isSelected }">
   *     <span :class="{ 'font-bold': isSelected }">2</span>
   *   </Pagination.Item>
   * </template>
   * ```
   */
  Item,
  /**
   * Navigation button that jumps to the first page. Automatically
   * disables when already on the first page.
   *
   * @see https://0.vuetifyjs.com/components/pagination#paginationfirst
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Pagination } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Pagination.First>First</Pagination.First>
   *
   *   <!-- With slot props -->
   *   <Pagination.First v-slot="{ isDisabled }">
   *     <span :class="{ 'opacity-50': isDisabled }">«</span>
   *   </Pagination.First>
   *
   *   <!-- With data attributes -->
   *   <Pagination.First class="data-[disabled]:opacity-50">
   *     First
   *   </Pagination.First>
   * </template>
   * ```
   */
  First,
  /**
   * Navigation button that moves to the previous page. Automatically
   * disables when already on the first page.
   *
   * @see https://0.vuetifyjs.com/components/pagination#paginationprev
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Pagination } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Pagination.Prev>Prev</Pagination.Prev>
   *
   *   <!-- With slot props -->
   *   <Pagination.Prev v-slot="{ isDisabled }">
   *     <span :class="{ 'opacity-50': isDisabled }">‹</span>
   *   </Pagination.Prev>
   *
   *  <!-- With data attributes -->
   *  <Pagination.Prev class="data-[disabled]:opacity-50">
   *    Prev
   *  </Pagination.Prev>
   * </template>
   * ```
   */
  Prev,
  /**
   * Visual indicator for omitted page numbers. Hidden from screen
   * readers via aria-hidden. Inherits ellipsis character from Root
   * or can be overridden via prop.
   *
   * @see https://0.vuetifyjs.com/components/pagination#paginationellipsis
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Pagination } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <!-- Uses default "..." from Root -->
   *   <Pagination.Ellipsis />
   *
   *   <!-- Override ellipsis character -->
   *   <Pagination.Ellipsis ellipsis="…" />
   * </template>
   * ```
   */
  Ellipsis,
  /**
   * Navigation button that moves to the next page. Automatically
   * disables when already on the last page.
   *
   * @see https://0.vuetifyjs.com/components/pagination#paginationnext
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Pagination } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Pagination.Next>Next</Pagination.Next>
   *
   *   <!-- With slot props -->
   *   <Pagination.Next v-slot="{ isDisabled }">
   *     <span :class="{ 'opacity-50': isDisabled }">›</span>
   *   </Pagination.Next>
   *
   *   <!-- With data attributes -->
   *   <Pagination.Next class="data-[disabled]:opacity-50">
   *     Next
   *   </Pagination.Next>
   * </template>
   * ```
   */
  Next,
  /**
   * Navigation button that jumps to the last page. Automatically
   * disables when already on the last page.
   *
   * @see https://0.vuetifyjs.com/components/pagination#paginationlast
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Pagination } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Pagination.Last>Last</Pagination.Last>
   *
   *   <!-- With slot props -->
   *   <Pagination.Last v-slot="{ isDisabled }">
   *     <span :class="{ 'opacity-50': isDisabled }">»</span>
   *   </Pagination.Last>
   *
   *   <!-- With data attributes -->
   *   <Pagination.Last class="data-[disabled]:opacity-50">
   *     Last
   *   </Pagination.Last>
   * </template>
   * ```
   */
  Last,
}
