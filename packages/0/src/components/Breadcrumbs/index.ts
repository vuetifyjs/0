export { default as BreadcrumbsDivider } from './BreadcrumbsDivider.vue'
export { default as BreadcrumbsEllipsis } from './BreadcrumbsEllipsis.vue'
export { default as BreadcrumbsItem } from './BreadcrumbsItem.vue'
export { default as BreadcrumbsLink } from './BreadcrumbsLink.vue'
export { default as BreadcrumbsList } from './BreadcrumbsList.vue'
export { default as BreadcrumbsPage } from './BreadcrumbsPage.vue'
export { provideBreadcrumbsRoot, useBreadcrumbsRoot } from './BreadcrumbsRoot.vue'

export { default as BreadcrumbsRoot } from './BreadcrumbsRoot.vue'

export type { BreadcrumbsDividerProps, BreadcrumbsDividerSlotProps } from './BreadcrumbsDivider.vue'
export type { BreadcrumbsEllipsisProps, BreadcrumbsEllipsisSlotProps } from './BreadcrumbsEllipsis.vue'
export type { BreadcrumbsItemProps, BreadcrumbsItemSlotProps } from './BreadcrumbsItem.vue'
export type { BreadcrumbsLinkProps } from './BreadcrumbsLink.vue'
export type { BreadcrumbsListProps, BreadcrumbsListSlotProps } from './BreadcrumbsList.vue'
export type { BreadcrumbsPageProps, BreadcrumbsPageSlotProps } from './BreadcrumbsPage.vue'
export type { BreadcrumbsRootContext, BreadcrumbsRootProps, BreadcrumbsRootSlotProps, BreadcrumbsTicket, BreadcrumbsTicketType } from './BreadcrumbsRoot.vue'

// Components
import Divider from './BreadcrumbsDivider.vue'
import Ellipsis from './BreadcrumbsEllipsis.vue'
import Item from './BreadcrumbsItem.vue'
import Link from './BreadcrumbsLink.vue'
import List from './BreadcrumbsList.vue'
import Page from './BreadcrumbsPage.vue'
import Root from './BreadcrumbsRoot.vue'

/**
 * Breadcrumbs component for responsive navigation trails.
 *
 * @see https://0.vuetifyjs.com/components/breadcrumbs
 */
export const Breadcrumbs = {
  /**
   * Root component for breadcrumb navigation.
   * Creates breadcrumbs composable + Group + Overflow context.
   *
   * @see https://0.vuetifyjs.com/components/breadcrumbs#breadcrumbsroot
   */
  Root,
  /**
   * Semantic list wrapper for breadcrumb items.
   * Renders with role="list".
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
   * Navigable breadcrumb link.
   * Renders as an anchor with href prop.
   *
   * @see https://0.vuetifyjs.com/components/breadcrumbs#breadcrumbslink
   */
  Link,
  /**
   * Current page indicator.
   * Renders with aria-current="page".
   *
   * @see https://0.vuetifyjs.com/components/breadcrumbs#breadcrumbspage
   */
  Page,
  /**
   * Visual separator between breadcrumb items.
   * Renders with aria-hidden="true".
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
