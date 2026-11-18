export type { BTabsContext, BTabsProps, BTabsTicketInput, BTabsVariant } from './BTabs.vue'
export { provideBTabs, useBTabs } from './BTabs.vue'

// Context
import Root from './BTabs.vue'

import Content from '../BTabsContent/BTabsContent.vue'
import Item from '../BTabsItem/BTabsItem.vue'
import List from '../BTabsList/BTabsList.vue'
import Panel from '../BTabsPanel/BTabsPanel.vue'

/**
 * Bootstrap 6 tabs. A `ul.nav` tablist and `.tab-pane` panels. `v-model` is the selected value.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { shallowRef } from 'vue'
 *   import { BTabs } from '@paper/bootstrap'
 *
 *   const tab = shallowRef('home')
 * </script>
 *
 * <template>
 *   <BTabs v-model="tab">
 *     <BTabs.List>
 *       <BTabs.Item value="home">Home</BTabs.Item>
 *     </BTabs.List>
 *     <BTabs.Content>
 *       <BTabs.Panel value="home">Home</BTabs.Panel>
 *     </BTabs.Content>
 *   </BTabs>
 * </template>
 * ```
 */
export const BTabs = Object.assign(Root, {
  /** `ul.nav.nav-tabs` with `role="tablist"`. */
  List,
  /** `li.nav-item` and `button.nav-link`. */
  Item,
  /** `div.tab-content`. Panes must be its direct children. */
  Content,
  /** `div.tab-pane`. `.show.active` on the selected pane. */
  Panel,
})
