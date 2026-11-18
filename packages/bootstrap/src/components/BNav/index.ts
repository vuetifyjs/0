export type { BNavProps, BNavVariant } from './BNav.vue'

// Context
import Root from './BNav.vue'

import Item from '../BNavItem/BNavItem.vue'
import Link from '../BNavLink/BNavLink.vue'

/**
 * Bootstrap 6 nav. `ul.nav` or `nav.nav`. This is a link list, not a tab widget.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { BNav } from '@paper/bootstrap'
 * </script>
 *
 * <template>
 *   <BNav>
 *     <BNav.Item>
 *       <BNav.Link active href="#home">Active</BNav.Link>
 *     </BNav.Item>
 *   </BNav>
 * </template>
 * ```
 */
export const BNav = Object.assign(Root, {
  /** `li.nav-item`. */
  Item,
  /** `a.nav-link`. */
  Link,
})
