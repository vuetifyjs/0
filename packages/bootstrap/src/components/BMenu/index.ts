export type { BMenuAutoClose, BMenuContext, BMenuPlacement, BMenuProps, BMenuRegistration } from './BMenu.vue'

// Context
import Root from './BMenu.vue'

import Divider from '../BMenuDivider/BMenuDivider.vue'
import Header from '../BMenuHeader/BMenuHeader.vue'
import Item from '../BMenuItem/BMenuItem.vue'
import Submenu from '../BMenuSubmenu/BMenuSubmenu.vue'

/**
 * Bootstrap 6 menu. A trigger and a sibling `.menu`, open state on `v-model`.
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { BMenu } from '@paper/bootstrap'
 * </script>
 *
 * <template>
 *   <BMenu label="Toggle menu">
 *     <BMenu.Item href="#">Menu item 1</BMenu.Item>
 *
 *     <BMenu.Item href="#">Menu item 2</BMenu.Item>
 *   </BMenu>
 * </template>
 * ```
 */
export const BMenu = Object.assign(Root, {
  /** `a.menu-item` or `button.menu-item`. */
  Item,
  /** `hr.menu-divider`. */
  Divider,
  /** `h6.menu-header`. */
  Header,
  /** `.submenu` with a nested `.menu`. */
  Submenu,
})
