export type { QuTabsContext, QuTabsItemKind, QuTabsItemMeasure, QuTabsItemTicket, QuTabsProps } from './QuTabs.vue'
export { useQuTabs } from './QuTabs.vue'
export type { QuTabsItemProps } from './QuTabsItem.vue'
export { default as QuTabsItem } from './QuTabsItem.vue'
export type { QuTabsListProps } from './QuTabsList.vue'
export { default as QuTabsList } from './QuTabsList.vue'
export type { QuTabsPanelDirection, QuTabsPanelMotion, QuTabsPanelProps } from './QuTabsPanel.vue'
export { default as QuTabsPanel } from './QuTabsPanel.vue'

// Context
import Root from './QuTabs.vue'
import Item from './QuTabsItem.vue'
import List from './QuTabsList.vue'
import Panel from './QuTabsPanel.vue'

/**
 * The Material Design 1 tabs: fixed or scrollable, text, icon or icon-and-text
 * tabs over a 2 dp indicator, with desktop pagination arrows when the bar
 * overflows and a sibling slide between panels. Composes v0 `Tabs` and
 * `createOverflow`; the root owns `v-model` (the selected tab's value) and
 * provides the `quantum:tabs` context its parts read.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`QuTabsItem`) remain exported and valid.
 *
 * @example
 * ```vue
 * <QuTabs v-model="tab">
 *   <QuTabs.List label="Library">
 *     <QuTabs.Item label="Songs" value="songs" />
 *
 *     <QuTabs.Item label="Albums" value="albums" />
 *   </QuTabs.List>
 *
 *   <QuTabs.Panel value="songs">...</QuTabs.Panel>
 *
 *   <QuTabs.Panel value="albums">...</QuTabs.Panel>
 * </QuTabs>
 * ```
 */
export const QuTabs = Object.assign(Root, {
  /** The tab bar: the tablist, its indicator and the desktop pagination arrows. */
  List,
  /** One tab: text, an icon, or an icon above text (72 dp). */
  Item,
  /** A tab's content; slides in from the side of the tab that was chosen. */
  Panel,
})
