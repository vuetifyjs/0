export { default as BreadcrumbsDivider } from './BreadcrumbsDivider.vue'
export { default as BreadcrumbsEllipsis } from './BreadcrumbsEllipsis.vue'
export { default as BreadcrumbsItem } from './BreadcrumbsItem.vue'
export { default as BreadcrumbsList } from './BreadcrumbsList.vue'
export { provideBreadcrumbsRoot, useBreadcrumbsRoot } from './BreadcrumbsRoot.vue'
export { default as BreadcrumbsRoot } from './BreadcrumbsRoot.vue'

export type {
  BreadcrumbsDividerProps,
  BreadcrumbsDividerSlotProps,
} from './BreadcrumbsDivider.vue'

export type {
  BreadcrumbsEllipsisProps,
  BreadcrumbsEllipsisSlotProps,
} from './BreadcrumbsEllipsis.vue'

export type {
  BreadcrumbsItemProps,
  BreadcrumbsItemSlotProps,
} from './BreadcrumbsItem.vue'

export type {
  BreadcrumbsListProps,
  BreadcrumbsListSlotProps,
} from './BreadcrumbsList.vue'

export type {
  BreadcrumbsRootProps,
  BreadcrumbsRootSlotProps,
} from './BreadcrumbsRoot.vue'

export type {
  BreadcrumbsContext,
  BreadcrumbsTicket,
  BreadcrumbsTicketType,
} from './types'

// Components
import Divider from './BreadcrumbsDivider.vue'
import Ellipsis from './BreadcrumbsEllipsis.vue'
import Item from './BreadcrumbsItem.vue'
import List from './BreadcrumbsList.vue'
import Root from './BreadcrumbsRoot.vue'

/**
 * Breadcrumbs component for responsive navigation trails.
 *
 * Uses declarative children for flexible composition. Items, dividers,
 * and ellipsis register with the root and self-measure for overflow detection.
 * Visibility is automatically managed based on available space.
 *
 * @see https://0.vuetifyjs.com/components/breadcrumbs
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { Breadcrumbs } from '@vuetify/v0'
 * </script>
 *
 * <template>
 *   <Breadcrumbs.Root divider="/" as="nav">
 *     <Breadcrumbs.List as="ol">
 *       <Breadcrumbs.Item as="li">
 *         <a href="/">Home</a>
 *       </Breadcrumbs.Item>
 *       <Breadcrumbs.Divider />
 *       <Breadcrumbs.Ellipsis />
 *       <Breadcrumbs.Divider />
 *       <Breadcrumbs.Item as="li">
 *         <a href="/about">About</a>
 *       </Breadcrumbs.Item>
 *       <Breadcrumbs.Divider />
 *       <Breadcrumbs.Item as="li">Team</Breadcrumbs.Item>
 *     </Breadcrumbs.List>
 *   </Breadcrumbs.Root>
 * </template>
 * ```
 */
export const Breadcrumbs = {
  /**
   * Root component for breadcrumb navigation.
   * Creates Group + Overflow context for managing items.
   *
   * @see https://0.vuetifyjs.com/components/breadcrumbs#breadcrumbsroot
   */
  Root,
  /**
   * Semantic list wrapper for breadcrumb items.
   * Typically renders as `<ol>`.
   *
   * @see https://0.vuetifyjs.com/components/breadcrumbs#breadcrumbslist
   */
  List,
  /**
   * Individual breadcrumb item.
   * Registers with root and self-measures for overflow.
   *
   * @see https://0.vuetifyjs.com/components/breadcrumbs#breadcrumbsitem
   */
  Item,
  /**
   * Visual separator between breadcrumb items.
   * Supports inline divider override.
   *
   * @see https://0.vuetifyjs.com/components/breadcrumbs#breadcrumbsdivider
   */
  Divider,
  /**
   * Ellipsis indicator shown when items are truncated.
   * Auto-hidden until overflow is detected.
   *
   * @see https://0.vuetifyjs.com/components/breadcrumbs#breadcrumbsellipsis
   */
  Ellipsis,
}
