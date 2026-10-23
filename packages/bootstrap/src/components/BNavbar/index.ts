export type { BNavbarContext, BNavbarExpand, BNavbarProps } from './BNavbar.vue'
export type { BNavbarBrandProps } from './BNavbarBrand.vue'
export type { BNavbarCollapseProps } from './BNavbarCollapse.vue'
export type { BNavbarNavProps } from './BNavbarNav.vue'

// Context
import Root from './BNavbar.vue'
import Brand from './BNavbarBrand.vue'
import Collapse from './BNavbarCollapse.vue'
import Nav from './BNavbarNav.vue'

/**
 * Bootstrap 6 navbar. `nav.navbar`, with the collapsed menu as a drawer.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { BNavbar } from '@paper/bootstrap'
 * </script>
 *
 * <template>
 *   <BNavbar expand="md">
 *     <BNavbar.Brand href="#">Navbar</BNavbar.Brand>
 *     <BNavbar.Collapse>
 *       <BNavbar.Nav />
 *     </BNavbar.Collapse>
 *   </BNavbar>
 * </template>
 * ```
 */
export const BNavbar = Object.assign(Root, {
  /** `a.navbar-brand`, or `span` when `as` is set. */
  Brand,
  /** `ul.navbar-nav`. Not a nav — the consumer fills the items. */
  Nav,
  /** Toggler plus `BDrawer`. There is no `.navbar-collapse` in this pin. */
  Collapse,
})
