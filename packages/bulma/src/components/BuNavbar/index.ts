export type { BuNavbarContext, BuNavbarProps, BuNavbarSlotProps } from './BuNavbar.vue'

// Context
import Root from './BuNavbar.vue'

import Brand from '../BuNavbarBrand/BuNavbarBrand.vue'
import Menu from '../BuNavbarMenu/BuNavbarMenu.vue'

/**
 * Navbar. Owns the burger/menu open state; brand and menu are composed as parts.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`BuNavbarBrand`) remain exported and valid.
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { BuNavbar } from '@paper/bulma'
 * </script>
 *
 * <template>
 *   <BuNavbar>
 *     <BuNavbar.Brand />
 *
 *     <BuNavbar.Menu />
 *   </BuNavbar>
 * </template>
 * ```
 */
export const BuNavbar = Object.assign(Root, {
  /** `.navbar-brand`, including the burger. */
  Brand,
  /** `.navbar-menu` collapsible region. */
  Menu,
})
