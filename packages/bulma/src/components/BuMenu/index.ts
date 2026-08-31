// Context
import Root from './BuMenu.vue'

import Item from '../BuMenuItem/BuMenuItem.vue'
import Label from '../BuMenuLabel/BuMenuLabel.vue'
import Link from '../BuMenuLink/BuMenuLink.vue'
import List from '../BuMenuList/BuMenuList.vue'

/**
 * Side menu. Renders `aside.menu`; labels, lists, and links are composed as parts.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`BuMenuItem`) remain exported and valid.
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { BuMenu } from '@paper/bulma'
 * </script>
 *
 * <template>
 *   <BuMenu>
 *     <BuMenu.Label />
 *
 *     <BuMenu.List>
 *       <BuMenu.Item>
 *         <BuMenu.Link />
 *       </BuMenu.Item>
 *     </BuMenu.List>
 *   </BuMenu>
 * </template>
 * ```
 */
export const BuMenu = Object.assign(Root, {
  /** `p.menu-label` section heading. */
  Label,
  /** `ul.menu-list`; `nested` omits the class. */
  List,
  /** `li` row. */
  Item,
  /** Renderless selectable link inside an item. */
  Link,
})
