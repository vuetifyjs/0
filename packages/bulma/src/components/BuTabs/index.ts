// Context
import Root from './BuTabs.vue'

import Tab from '../BuTab/BuTab.vue'
import List from '../BuTabList/BuTabList.vue'
import Panel from '../BuTabPanel/BuTabPanel.vue'

/**
 * Tabs. Owns the selected tab; the tablist, tabs, and panels are composed as parts.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`BuTabList`) remain exported and valid.
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { BuTabs } from '@paper/bulma'
 * </script>
 *
 * <template>
 *   <BuTabs>
 *     <BuTabs.List>
 *       <BuTabs.Tab />
 *     </BuTabs.List>
 *
 *     <BuTabs.Panel />
 *   </BuTabs>
 * </template>
 * ```
 */
export const BuTabs = Object.assign(Root, {
  /** `.tabs > ul` tablist. Modifier props live here. */
  List,
  /** A single tab. */
  Tab,
  /** Content shown for the matching tab. */
  Panel,
})
