export { default as TabsIndicator } from './TabsIndicator.vue'

export { default as TabsItem } from './TabsItem.vue'
export { provideTabsItem, useTabsItem } from './TabsItem.vue'

export { default as TabsList } from './TabsList.vue'

export { default as TabsPanel } from './TabsPanel.vue'

export { default as TabsRoot } from './TabsRoot.vue'
export { provideTabsRoot, useTabsRoot } from './TabsRoot.vue'

export type { TabsIndicatorProps, TabsIndicatorSlotProps } from './TabsIndicator.vue'
export type { TabsItemContext, TabsItemProps, TabsItemSlotProps } from './TabsItem.vue'
export type { TabsListProps, TabsListSlotProps } from './TabsList.vue'
export type { TabsPanelProps, TabsPanelSlotProps } from './TabsPanel.vue'
export type { TabsActivation, TabsContext, TabsOrientation, TabsRootProps, TabsRootSlotProps, TabsState, TabsTicket } from './TabsRoot.vue'

// Components
import Indicator from './TabsIndicator.vue'
import Item from './TabsItem.vue'
import List from './TabsList.vue'
import Panel from './TabsPanel.vue'
import Root from './TabsRoot.vue'

/**
 * Tabs component with sub-components for building accessible tab interfaces.
 *
 * @see https://0.vuetifyjs.com/components/navigation/tabs
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { Tabs } from '@vuetify/v0'
 *   import { ref } from 'vue'
 *
 *   const selected = ref('profile')
 * </script>
 *
 * <template>
 *   <Tabs.Root v-model="selected">
 *     <Tabs.List label="Account settings">
 *       <Tabs.Item value="profile">
 *         Profile
 *         <Tabs.Indicator />
 *       </Tabs.Item>
 *       <Tabs.Item value="password">
 *         Password
 *         <Tabs.Indicator />
 *       </Tabs.Item>
 *       <Tabs.Item value="billing" disabled>
 *         Billing
 *         <Tabs.Indicator />
 *       </Tabs.Item>
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
   * Root component that provides tabs context and manages selection state.
   *
   * @see https://0.vuetifyjs.com/components/navigation/tabs#root
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Tabs } from '@vuetify/v0'
   *   import { ref } from 'vue'
   *
   *   const activeTab = ref('profile')
   * </script>
   *
   * <template>
   *   <Tabs.Root v-model="activeTab" orientation="horizontal">
   *     <Tabs.List>
   *       <Tabs.Item value="profile">Profile</Tabs.Item>
   *       <Tabs.Item value="settings">Settings</Tabs.Item>
   *     </Tabs.List>
   *     <Tabs.Panel value="profile">Profile content</Tabs.Panel>
   *     <Tabs.Panel value="settings">Settings content</Tabs.Panel>
   *   </Tabs.Root>
   * </template>
   * ```
   */
  Root,
  /**
   * Container for tab triggers with tablist ARIA role.
   *
   * Provides proper accessibility attributes and orientation support.
   *
   * @see https://0.vuetifyjs.com/components/navigation/tabs#list
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Tabs } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Tabs.Root>
   *     <Tabs.List label="Navigation tabs" class="flex gap-2">
   *       <Tabs.Item value="home">Home</Tabs.Item>
   *       <Tabs.Item value="about">About</Tabs.Item>
   *     </Tabs.List>
   *   </Tabs.Root>
   * </template>
   * ```
   */
  List,
  /**
   * Individual tab trigger with keyboard navigation and ARIA attributes.
   *
   * Supports roving tabindex and both automatic/manual activation modes.
   *
   * @see https://0.vuetifyjs.com/components/navigation/tabs#item
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Tabs } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Tabs.Root>
   *     <Tabs.List>
   *       <Tabs.Item v-slot="{ isSelected }" value="profile">
   *         <span :class="{ 'font-bold': isSelected }">Profile</span>
   *         <Tabs.Indicator class="absolute bottom-0 h-0.5 bg-blue-500" />
   *       </Tabs.Item>
   *     </Tabs.List>
   *   </Tabs.Root>
   * </template>
   * ```
   */
  Item,
  /**
   * Visual indicator component for active tab state.
   *
   * Must be placed inside a Tabs.Item component. Renders as a span
   * and only displays when its parent tab is selected.
   *
   * @see https://0.vuetifyjs.com/components/navigation/tabs#indicator
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Tabs } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Tabs.Root>
   *     <Tabs.List>
   *       <Tabs.Item value="home" class="relative pb-2">
   *         Home
   *         <Tabs.Indicator class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
   *       </Tabs.Item>
   *     </Tabs.List>
   *   </Tabs.Root>
   * </template>
   * ```
   */
  Indicator,
  /**
   * Content panel associated with a tab via matching `value` prop.
   *
   * Provides proper tabpanel ARIA role and hidden state management.
   *
   * @see https://0.vuetifyjs.com/components/navigation/tabs#panel
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Tabs } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Tabs.Root>
   *     <Tabs.List>
   *       <Tabs.Item value="profile">Profile</Tabs.Item>
   *     </Tabs.List>
   *
   *     <Tabs.Panel value="profile" class="p-4">
   *       <h2>Profile Settings</h2>
   *       <p>Manage your profile information here.</p>
   *     </Tabs.Panel>
   *   </Tabs.Root>
   * </template>
   * ```
   */
  Panel,
}
