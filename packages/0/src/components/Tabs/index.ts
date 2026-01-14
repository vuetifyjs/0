export { provideTabsRoot, useTabsRoot } from './TabsRoot.vue'
export { default as TabsRoot } from './TabsRoot.vue'
export { default as TabsList } from './TabsList.vue'
export { default as TabsTab } from './TabsTab.vue'
export { default as TabsPanel } from './TabsPanel.vue'

export type { TabsActivation, TabsContext, TabsOrientation, TabsRootProps, TabsRootSlotProps, TabsTicket } from './TabsRoot.vue'
export type { TabsListProps, TabsListSlotProps } from './TabsList.vue'
export type { TabsTabProps, TabsTabSlotProps } from './TabsTab.vue'
export type { TabsPanelProps, TabsPanelSlotProps } from './TabsPanel.vue'

// Components
import List from './TabsList.vue'
import Panel from './TabsPanel.vue'
import Root from './TabsRoot.vue'
import Tab from './TabsTab.vue'

/**
 * Tabs component with sub-components for building accessible tab interfaces.
 *
 * @see https://0.vuetifyjs.com/components/tabs
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { Tabs } from '@vuetify/v0'
 *
 *   const selected = ref('profile')
 * </script>
 *
 * <template>
 *   <Tabs.Root v-model="selected">
 *     <Tabs.List label="Account settings">
 *       <Tabs.Tab value="profile">Profile</Tabs.Tab>
 *       <Tabs.Tab value="password">Password</Tabs.Tab>
 *       <Tabs.Tab value="billing" disabled>Billing</Tabs.Tab>
 *     </Tabs.List>
 *
 *     <Tabs.Panel value="profile">Profile content</Tabs.Panel>
 *     <Tabs.Panel value="password">Password content</Tabs.Panel>
 *     <Tabs.Panel value="billing">Billing content</Tabs.Panel>
 *   </Tabs.Root>
 * </template>
 * ```
 */
export const Tabs = {
  /**
   * Root component that provides tabs context.
   *
   * @see https://0.vuetifyjs.com/components/tabs
   */
  Root,
  /**
   * Container for tab triggers with tablist role.
   *
   * @see https://0.vuetifyjs.com/components/tabs#tabslist
   */
  List,
  /**
   * Individual tab trigger.
   *
   * @see https://0.vuetifyjs.com/components/tabs#tabstab
   */
  Tab,
  /**
   * Content panel associated with a tab.
   *
   * @see https://0.vuetifyjs.com/components/tabs#tabspanel
   */
  Panel,
}
