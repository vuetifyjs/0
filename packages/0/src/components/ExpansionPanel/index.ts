export type { ExpansionPanelActivatorProps, ExpansionPanelActivatorSlotProps } from './ExpansionPanelActivator.vue'
export { default as ExpansionPanelActivator } from './ExpansionPanelActivator.vue'
export type { ExpansionPanelContentProps, ExpansionPanelContentSlotProps } from './ExpansionPanelContent.vue'
export { default as ExpansionPanelContent } from './ExpansionPanelContent.vue'
export type { ExpansionPanelHeaderProps, ExpansionPanelHeaderSlotProps } from './ExpansionPanelHeader.vue'

export { default as ExpansionPanelHeader } from './ExpansionPanelHeader.vue'
export type { ExpansionPanelItemContext, ExpansionPanelItemProps, ExpansionPanelItemSlotProps } from './ExpansionPanelItem.vue'

export { provideExpansionPanelItem, useExpansionPanelItem } from './ExpansionPanelItem.vue'
export { default as ExpansionPanelItem } from './ExpansionPanelItem.vue'
export type { ExpansionPanelOptionsContext, ExpansionPanelRootProps, ExpansionPanelRootSlotProps } from './ExpansionPanelRoot.vue'
export { provideExpansionPanelSelection, useExpansionPanelRoot } from './ExpansionPanelRoot.vue'
export { default as ExpansionPanelRoot } from './ExpansionPanelRoot.vue'

import Activator from './ExpansionPanelActivator.vue'
import Content from './ExpansionPanelContent.vue'
import Header from './ExpansionPanelHeader.vue'
import Item from './ExpansionPanelItem.vue'
import Root from './ExpansionPanelRoot.vue'

/**
 * ExpansionPanel component with sub-components for building expansion panels.
 *
 * @see https://0.vuetifyjs.com/components/expansion-panels
 */
export const ExpansionPanel = {
  /**
   * Root component for expansion panels.
   *
   * @see https://0.vuetifyjs.com/components/expansion-panels
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { ExpansionPanel } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <ExpansionPanel.Root>
   *     <ExpansionPanel.Item>
   *       <ExpansionPanel.Header>
   *         <ExpansionPanel.Activator>
   *          Click to expand
   *         </ExpansionPanel.Activator>
   *       </ExpansionPanel.Header>
   *
   *       <ExpansionPanel.Content>
   *         Content goes here.
   *       </ExpansionPanel.Content>
   *     </ExpansionPanel.Item>
   *   </ExpansionPanel.Root>
   * </template>
   * ```
 */
  Root,
  /**
   * Component representing a single expansion panel item.
   *
   * @see https://0.vuetifyjs.com/components/expansion-panels#expansionpanelitem
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { ExpansionPanel } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <ExpansionPanel.Item>
   *     <ExpansionPanel.Header>
   *       <ExpansionPanel.Activator>
   *        Click to expand
   *       </ExpansionPanel.Activator>
   *     </ExpansionPanel.Header>
   *
   *     <ExpansionPanel.Content>
   *       Content goes here.
   *     </ExpansionPanel.Content>
   *   </ExpansionPanel.Item>
   * </template>
   * ```
   */
  Item,
  /**
   * (optional) Component for the header section of an expansion panel item.
   *
   * @see https://0.vuetifyjs.com/components/expansion-panels#expansionpanelheader
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { ExpansionPanel } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <ExpansionPanel.Header>
   *     <ExpansionPanel.Activator>
   *      Click to expand
   *     </ExpansionPanel.Activator>
   *   </ExpansionPanel.Header>
   * </template>
   * ```
   */
  Header,
  /**
   * Component for the activator section of an expansion panel header.
   *
   * @see https://0.vuetifyjs.com/components/expansion-panels#expansionpanelactivator
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { ExpansionPanel } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <ExpansionPanel.Activator>
   *    Click to expand
   *   </ExpansionPanel.Activator>
   * </template>
   * ```
   */
  Activator,
  /**
   * Component for the content section of an expansion panel item.
   *
   * @see https://0.vuetifyjs.com/components/expansion-panels#expansionpanelcontent
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { ExpansionPanel } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <ExpansionPanel.Content>
   *     Content goes here.
   *   </ExpansionPanel.Content>
   * </template>
   * ```
   */
  Content,
}
