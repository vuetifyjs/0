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
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Breadcrumbs } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Breadcrumbs.Root>
   *     <Breadcrumbs.List>
   *       <Breadcrumbs.Item text="Home">
   *         <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
   *       </Breadcrumbs.Item>
   *
   *       <Breadcrumbs.Divider>/</Breadcrumbs.Divider>
   *       <Breadcrumbs.Ellipsis />
   *
   *       <Breadcrumbs.Item text="Products">
   *         <Breadcrumbs.Link href="/products">Products</Breadcrumbs.Link>
   *       </Breadcrumbs.Item>
   *
   *       <Breadcrumbs.Divider>/</Breadcrumbs.Divider>
   *
   *       <Breadcrumbs.Item text="Shoes">
   *         <Breadcrumbs.Page>Shoes</Breadcrumbs.Page>
   *       </Breadcrumbs.Item>
   *     </Breadcrumbs.List>
   *   </Breadcrumbs.Root>
   * </template>
   * ```
   */
  Root,
  /**
   * Semantic list wrapper for breadcrumb items.
   * Renders as an ordered list with role="list".
   *
   * @see https://0.vuetifyjs.com/components/breadcrumbs#breadcrumbslist
   *
   * @example
   * ```vue
   * <template>
   *   <Breadcrumbs.List class="flex items-center gap-2">
   *     <!-- Items, dividers, ellipsis go here -->
   *   </Breadcrumbs.List>
   * </template>
   * ```
   */
  List,
  /**
   * Individual breadcrumb item. Registers with root and
   * self-measures for overflow visibility.
   *
   * @see https://0.vuetifyjs.com/components/breadcrumbs#breadcrumbsitem
   *
   * @example
   * ```vue
   * <template>
   *   <!-- With a link -->
   *   <Breadcrumbs.Item text="Products">
   *     <Breadcrumbs.Link href="/products">Products</Breadcrumbs.Link>
   *   </Breadcrumbs.Item>
   *
   *   <!-- Current page (no link) -->
   *   <Breadcrumbs.Item text="Shoes">
   *     <Breadcrumbs.Page>Shoes</Breadcrumbs.Page>
   *   </Breadcrumbs.Item>
   *
   *   <!-- With slot props -->
   *   <Breadcrumbs.Item text="Home" v-slot="{ isSelected }">
   *     <span v-show="isSelected">Home</span>
   *   </Breadcrumbs.Item>
   * </template>
   * ```
   */
  Item,
  /**
   * Navigable breadcrumb link. Renders as an anchor by default.
   * All attributes (href, to, etc.) fall through to the underlying element.
   *
   * @see https://0.vuetifyjs.com/components/breadcrumbs#breadcrumbslink
   *
   * @example
   * ```vue
   * <template>
   *   <!-- Standard anchor -->
   *   <Breadcrumbs.Link href="/products">Products</Breadcrumbs.Link>
   *
   *   <!-- With RouterLink via :as -->
   *   <Breadcrumbs.Link :as="RouterLink" to="/products">
   *     Products
   *   </Breadcrumbs.Link>
   *
   *   <!-- Custom element -->
   *   <Breadcrumbs.Link as="button" @click="navigate">
   *     Products
   *   </Breadcrumbs.Link>
   * </template>
   * ```
   */
  Link,
  /**
   * Current page indicator. Renders as a span with
   * aria-current="page".
   *
   * @see https://0.vuetifyjs.com/components/breadcrumbs#breadcrumbspage
   *
   * @example
   * ```vue
   * <template>
   *   <Breadcrumbs.Page>Current Page</Breadcrumbs.Page>
   *
   *   <!-- With custom element -->
   *   <Breadcrumbs.Page as="strong">Current Page</Breadcrumbs.Page>
   * </template>
   * ```
   */
  Page,
  /**
   * Visual separator between breadcrumb items. Renders as a list
   * item with aria-hidden="true". Uses divider character from Root
   * by default, or override via prop or slot content.
   *
   * @see https://0.vuetifyjs.com/components/breadcrumbs#breadcrumbsdivider
   *
   * @example
   * ```vue
   * <template>
   *   <!-- Uses default divider from Root -->
   *   <Breadcrumbs.Divider />
   *
   *   <!-- Override divider character -->
   *   <Breadcrumbs.Divider divider=">" />
   *
   *   <!-- Custom slot content (e.g., SVG chevron) -->
   *   <Breadcrumbs.Divider>
   *     <svg class="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
   *       <path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
   *     </svg>
   *   </Breadcrumbs.Divider>
   * </template>
   * ```
   */
  Divider,
  /**
   * Ellipsis indicator shown when items are truncated by overflow.
   * Auto-hidden until overflow is detected. Renders with
   * aria-hidden="true".
   *
   * @see https://0.vuetifyjs.com/components/breadcrumbs#breadcrumbsellipsis
   *
   * @example
   * ```vue
   * <template>
   *   <!-- Uses default "..." from Root -->
   *   <Breadcrumbs.Ellipsis />
   *
   *   <!-- Override ellipsis character -->
   *   <Breadcrumbs.Ellipsis ellipsis="…" />
   * </template>
   * ```
   */
  Ellipsis,
}
