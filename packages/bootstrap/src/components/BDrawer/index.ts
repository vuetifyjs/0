export type { BDrawerContext, BDrawerPlacement, BDrawerProps } from './BDrawer.vue'

// Context
import Root from './BDrawer.vue'

import Body from '../BDrawerBody/BDrawerBody.vue'
import Close from '../BDrawerClose/BDrawerClose.vue'
import Footer from '../BDrawerFooter/BDrawerFooter.vue'
import Header from '../BDrawerHeader/BDrawerHeader.vue'
import Title from '../BDrawerTitle/BDrawerTitle.vue'

/**
 * Bootstrap 6 drawer. Native `<dialog class="drawer">`, open state on `v-model`.
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { BDrawer } from '@paper/bootstrap'
 * </script>
 *
 * <template>
 *   <BDrawer placement="start">
 *     <BDrawer.Header>
 *       <BDrawer.Title />
 *
 *       <BDrawer.Close />
 *     </BDrawer.Header>
 *
 *     <BDrawer.Body />
 *
 *     <BDrawer.Footer />
 *   </BDrawer>
 * </template>
 * ```
 */
export const BDrawer = Object.assign(Root, {
  /** `div.drawer-header`. */
  Header,
  /** `h5.drawer-title`. Supplies the accessible name. */
  Title,
  /** `button.btn-close`. */
  Close,
  /** `div.drawer-body`. */
  Body,
  /** `div.drawer-footer`. */
  Footer,
})
