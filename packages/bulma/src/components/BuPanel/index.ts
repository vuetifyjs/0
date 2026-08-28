export type { BuPanelProps } from './BuPanel.vue'

// Context
import Root from './BuPanel.vue'

import Block from '../BuPanelBlock/BuPanelBlock.vue'
import Heading from '../BuPanelHeading/BuPanelHeading.vue'
import Icon from '../BuPanelIcon/BuPanelIcon.vue'
import Tab from '../BuPanelTab/BuPanelTab.vue'
import Tabs from '../BuPanelTabs/BuPanelTabs.vue'

/**
 * Panel. Owns block selection; heading, tabs, and blocks are composed as parts.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`BuPanelBlock`) remain exported and valid.
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { BuPanel } from '@paper/bulma'
 * </script>
 *
 * <template>
 *   <BuPanel>
 *     <BuPanel.Heading />
 *
 *     <BuPanel.Tabs>
 *       <BuPanel.Tab />
 *     </BuPanel.Tabs>
 *
 *     <BuPanel.Block>
 *       <BuPanel.Icon />
 *     </BuPanel.Block>
 *   </BuPanel>
 * </template>
 * ```
 */
export const BuPanel = Object.assign(Root, {
  /** `p.panel-heading`. */
  Heading,
  /** `.panel-tabs` selection scope. */
  Tabs,
  /** A tab inside `.panel-tabs`. */
  Tab,
  /** `.panel-block` row. */
  Block,
  /** `.panel-icon` inside a block. */
  Icon,
})
