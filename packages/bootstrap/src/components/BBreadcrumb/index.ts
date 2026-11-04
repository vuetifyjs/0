export type { BBreadcrumbProps } from './BBreadcrumb.vue'
export type { BBreadcrumbItemProps } from '../BBreadcrumbItem/BBreadcrumbItem.vue'
export type { BBreadcrumbLinkProps } from '../BBreadcrumbLink/BBreadcrumbLink.vue'

// Context
import Root from './BBreadcrumb.vue'

import Divider from '../BBreadcrumbDivider/BBreadcrumbDivider.vue'
import Item from '../BBreadcrumbItem/BBreadcrumbItem.vue'
import Link from '../BBreadcrumbLink/BBreadcrumbLink.vue'

/**
 * Bootstrap 6 breadcrumb. Items are slotted. Write `Divider` between them.
 *
 * Canon: not v0 Breadcrumbs — that overflow trail does not match this markup. Bulma ships one file; these parts follow the pin (`li.breadcrumb-divider` is a sibling, not a pseudo-element). The last item is `aria-current="page"` and the link is `.active`.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { BBreadcrumb } from '@paper/bootstrap'
 * </script>
 *
 * <template>
 *   <BBreadcrumb>
 *     <BBreadcrumb.Item>
 *       <BBreadcrumb.Link href="#">Home</BBreadcrumb.Link>
 *     </BBreadcrumb.Item>
 *     <BBreadcrumb.Divider>/</BBreadcrumb.Divider>
 *     <BBreadcrumb.Item>
 *       <BBreadcrumb.Link href="#">Library</BBreadcrumb.Link>
 *     </BBreadcrumb.Item>
 *     <BBreadcrumb.Divider>/</BBreadcrumb.Divider>
 *     <BBreadcrumb.Item current>
 *       <BBreadcrumb.Link href="#" active>Data</BBreadcrumb.Link>
 *     </BBreadcrumb.Item>
 *   </BBreadcrumb>
 * </template>
 * ```
 */
export const BBreadcrumb = Object.assign(Root, {
  /** `li.breadcrumb-item`. */
  Item,
  /** `a.breadcrumb-link`. */
  Link,
  /** `li.breadcrumb-divider` between items. Not rendered automatically. */
  Divider,
})
