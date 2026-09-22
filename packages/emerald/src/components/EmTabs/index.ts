export type { EmTabsOrientation, EmTabsProps } from './EmTabs.vue'
export type { EmTabsItemProps } from './EmTabsItem.vue'
export { default as EmTabsItem } from './EmTabsItem.vue'
export type { EmTabsListProps } from './EmTabsList.vue'
export { default as EmTabsList } from './EmTabsList.vue'
export type { EmTabsPanelProps } from './EmTabsPanel.vue'
export { default as EmTabsPanel } from './EmTabsPanel.vue'

// Context
import Root from './EmTabs.vue'
import Item from './EmTabsItem.vue'
import List from './EmTabsList.vue'
import Panel from './EmTabsPanel.vue'

/**
 * Tabs. Owns the selected tab, roving focus, and the tab/panel pairing.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`EmTabsList`) remain exported and valid.
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { EmTabs } from '@paper/emerald'
 * </script>
 *
 * <template>
 *   <EmTabs v-model="tab">
 *     <EmTabs.List>
 *       <EmTabs.Item />
 *     </EmTabs.List>
 *
 *     <EmTabs.Panel />
 *   </EmTabs>
 * </template>
 * ```
 */
export const EmTabs = Object.assign(Root, {
  /** Tablist that holds the tab items. */
  List,
  /** A single tab. */
  Item,
  /** Content shown for the matching tab. */
  Panel,
})
