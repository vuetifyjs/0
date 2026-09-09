export type { BuBreadcrumbProps } from './BuBreadcrumb.vue'

// Context
import Root from './BuBreadcrumb.vue'

import Item from '../BuBreadcrumbItem/BuBreadcrumbItem.vue'

/**
 * Breadcrumb trail. Renders `nav.breadcrumb > ul`; crumbs are composed as parts.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`BuBreadcrumbItem`) remain exported and valid.
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { BuBreadcrumb } from '@paper/bulma'
 * </script>
 *
 * <template>
 *   <BuBreadcrumb>
 *     <BuBreadcrumb.Item />
 *   </BuBreadcrumb>
 * </template>
 * ```
 */
export const BuBreadcrumb = Object.assign(Root, {
  /** A single crumb (`li > a`). Last crumb uses `current`. */
  Item,
})
