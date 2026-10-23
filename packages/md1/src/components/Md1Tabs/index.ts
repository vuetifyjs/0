export type { Md1TabsContext, Md1TabsItemKind, Md1TabsItemMeasure, Md1TabsItemTicket, Md1TabsProps } from './Md1Tabs.vue'
export { useMd1Tabs } from './Md1Tabs.vue'
export type { Md1TabsItemProps } from './Md1TabsItem.vue'
export { default as Md1TabsItem } from './Md1TabsItem.vue'
export type { Md1TabsListProps } from './Md1TabsList.vue'
export { default as Md1TabsList } from './Md1TabsList.vue'
export type { Md1TabsPanelDirection, Md1TabsPanelMotion, Md1TabsPanelProps } from './Md1TabsPanel.vue'
export { default as Md1TabsPanel } from './Md1TabsPanel.vue'

// Context
import Root from './Md1Tabs.vue'
import Item from './Md1TabsItem.vue'
import List from './Md1TabsList.vue'
import Panel from './Md1TabsPanel.vue'

/**
 * The Material Design 1 tabs: fixed or scrollable, text, icon or icon-and-text
 * tabs over a 2 dp indicator, with desktop pagination arrows when the bar
 * overflows and a sibling slide between panels. Composes v0 `Tabs` and
 * `createOverflow`; the root owns `v-model` (the selected tab's value) and
 * provides the `md1:tabs` context its parts read.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`Md1TabsItem`) remain exported and valid.
 *
 * @example
 * ```vue
 * <Md1Tabs v-model="tab">
 *   <Md1Tabs.List label="Library">
 *     <Md1Tabs.Item label="Songs" value="songs" />
 *
 *     <Md1Tabs.Item label="Albums" value="albums" />
 *   </Md1Tabs.List>
 *
 *   <Md1Tabs.Panel value="songs">...</Md1Tabs.Panel>
 *
 *   <Md1Tabs.Panel value="albums">...</Md1Tabs.Panel>
 * </Md1Tabs>
 * ```
 */
export const Md1Tabs = Object.assign(Root, {
  /** The tab bar: the tablist, its indicator and the desktop pagination arrows. */
  List,
  /** One tab: text, an icon, or an icon above text (72 dp). */
  Item,
  /** A tab's content; slides in from the side of the tab that was chosen. */
  Panel,
})
