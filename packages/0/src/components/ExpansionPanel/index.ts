export * from './ExpansionPanelActivator.vue'
export * from './ExpansionPanelContent.vue'
export * from './ExpansionPanelHeader.vue'
export * from './ExpansionPanelItem.vue'
export * from './ExpansionPanelRoot.vue'

import Activator from './ExpansionPanelActivator.vue'
import Content from './ExpansionPanelContent.vue'
import Header from './ExpansionPanelHeader.vue'
import Item from './ExpansionPanelItem.vue'
import Root from './ExpansionPanelRoot.vue'

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
