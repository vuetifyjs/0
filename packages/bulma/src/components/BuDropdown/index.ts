export type { BuDropdownContext, BuDropdownProps } from './BuDropdown.vue'

// Context
import Root from './BuDropdown.vue'

import Menu from '../BuDropdownMenu/BuDropdownMenu.vue'
import Trigger from '../BuDropdownTrigger/BuDropdownTrigger.vue'

/**
 * Dropdown. Owns the open state; trigger and menu are composed as parts.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`BuDropdownMenu`) remain exported and valid.
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { BuDropdown } from '@paper/bulma'
 * </script>
 *
 * <template>
 *   <BuDropdown>
 *     <BuDropdown.Trigger />
 *
 *     <BuDropdown.Menu />
 *   </BuDropdown>
 * </template>
 * ```
 */
export const BuDropdown = Object.assign(Root, {
  /** Button that opens the menu. */
  Trigger,
  /** The `.dropdown-menu` panel. */
  Menu,
})
