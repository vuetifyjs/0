export type { EmBreadcrumbsProps } from './EmBreadcrumbs.vue'
export type { EmBreadcrumbsDividerProps } from './EmBreadcrumbsDivider.vue'
export { default as EmBreadcrumbsDivider } from './EmBreadcrumbsDivider.vue'
export type { EmBreadcrumbsEllipsisProps } from './EmBreadcrumbsEllipsis.vue'
export { default as EmBreadcrumbsEllipsis } from './EmBreadcrumbsEllipsis.vue'
export type { EmBreadcrumbsItemProps } from './EmBreadcrumbsItem.vue'
export { default as EmBreadcrumbsItem } from './EmBreadcrumbsItem.vue'
export { default as EmBreadcrumbsLink } from './EmBreadcrumbsLink.vue'
export { default as EmBreadcrumbsList } from './EmBreadcrumbsList.vue'
export { default as EmBreadcrumbsPage } from './EmBreadcrumbsPage.vue'

// Context
import Root from './EmBreadcrumbs.vue'
import Divider from './EmBreadcrumbsDivider.vue'
import Ellipsis from './EmBreadcrumbsEllipsis.vue'
import Item from './EmBreadcrumbsItem.vue'
import Link from './EmBreadcrumbsLink.vue'
import List from './EmBreadcrumbsList.vue'
import Page from './EmBreadcrumbsPage.vue'

/**
 * Breadcrumb trail. Provides the nav landmark its list and items render into.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`EmBreadcrumbsList`) remain exported and valid.
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { EmBreadcrumbs } from '@paper/emerald'
 * </script>
 *
 * <template>
 *   <EmBreadcrumbs>
 *     <EmBreadcrumbs.List>
 *       <EmBreadcrumbs.Item>
 *         <EmBreadcrumbs.Link />
 *       </EmBreadcrumbs.Item>
 *
 *       <EmBreadcrumbs.Divider />
 *
 *       <EmBreadcrumbs.Item>
 *         <EmBreadcrumbs.Page />
 *       </EmBreadcrumbs.Item>
 *     </EmBreadcrumbs.List>
 *   </EmBreadcrumbs>
 * </template>
 * ```
 */
export const EmBreadcrumbs = Object.assign(Root, {
  /** Ordered list that holds the trail. */
  List,
  /** One crumb in the trail. */
  Item,
  /** Navigable crumb. */
  Link,
  /** Current-page crumb, marked with aria-current. */
  Page,
  /** Separator drawn between crumbs. */
  Divider,
  /** Collapsed-crumbs indicator. */
  Ellipsis,
})
