export { default as ExpansionPanelActivator } from './ExpansionPanelActivator.vue'
export { default as ExpansionPanelContent } from './ExpansionPanelContent.vue'
export { default as ExpansionPanelCue } from './ExpansionPanelCue.vue'
export { default as ExpansionPanelHeader } from './ExpansionPanelHeader.vue'

export { provideExpansionPanelGroup, useExpansionPanelGroup } from './ExpansionPanelGroup.vue'
export { default as ExpansionPanelGroup } from './ExpansionPanelGroup.vue'

export { provideExpansionPanelRoot, useExpansionPanelRoot } from './ExpansionPanelRoot.vue'
export { default as ExpansionPanelRoot } from './ExpansionPanelRoot.vue'

export type { ExpansionPanelActivatorProps, ExpansionPanelActivatorSlotProps } from './ExpansionPanelActivator.vue'
export type { ExpansionPanelContentProps, ExpansionPanelContentSlotProps } from './ExpansionPanelContent.vue'
export type { ExpansionPanelCueProps, ExpansionPanelCueSlotProps } from './ExpansionPanelCue.vue'
export type { ExpansionPanelHeaderProps, ExpansionPanelHeaderSlotProps } from './ExpansionPanelHeader.vue'
export type { ExpansionPanelRootContext, ExpansionPanelRootProps, ExpansionPanelRootSlotProps } from './ExpansionPanelRoot.vue'
export type { ExpansionPanelGroupProps, ExpansionPanelGroupSlotProps, ExpansionPanelOptionsContext } from './ExpansionPanelGroup.vue'

// Context
import Activator from './ExpansionPanelActivator.vue'
import Content from './ExpansionPanelContent.vue'
import Cue from './ExpansionPanelCue.vue'
import Group from './ExpansionPanelGroup.vue'
import Header from './ExpansionPanelHeader.vue'
import Root from './ExpansionPanelRoot.vue'

/**
 * ExpansionPanel component with sub-components for building expansion panels.
 *
 * @see https://0.vuetifyjs.com/components/disclosure/expansion-panel
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { ExpansionPanel } from '@vuetify/v0'
 * </script>
 *
 * <template>
 *   <ExpansionPanel.Group>
 *     <ExpansionPanel.Root>
 *       <ExpansionPanel.Header>
 *         <ExpansionPanel.Activator>
 *          Click to expand
 *         </ExpansionPanel.Activator>
 *       </ExpansionPanel.Header>
 *
 *       <ExpansionPanel.Content>
 *         Content goes here.
 *       </ExpansionPanel.Content>
 *     </ExpansionPanel.Root>
 *   </ExpansionPanel.Group>
 * </template>
 * ```
 */
export const ExpansionPanel = {
  /**
   * Group component for coordinating expansion panels.
   *
   * @see https://0.vuetifyjs.com/components/disclosure/expansion-panel
   */
  Group,
  /**
   * Root component representing a single expansion panel.
   *
   * @see https://0.vuetifyjs.com/components/disclosure/expansion-panel
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { ExpansionPanel } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <ExpansionPanel.Root>
   *     <ExpansionPanel.Header>
   *       <ExpansionPanel.Activator>
   *        Click to expand
   *       </ExpansionPanel.Activator>
   *     </ExpansionPanel.Header>
   *
   *     <ExpansionPanel.Content>
   *       Content goes here.
   *     </ExpansionPanel.Content>
   *   </ExpansionPanel.Root>
   * </template>
   * ```
   */
  Root,
  /**
   * (optional) Component for the header section of an expansion panel item.
   *
   * @see https://0.vuetifyjs.com/components/disclosure/expansion-panel
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
   * @see https://0.vuetifyjs.com/components/disclosure/expansion-panel
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
   * Visual cue for expansion state (e.g., chevron icon).
   *
   * @see https://0.vuetifyjs.com/components/disclosure/expansion-panel
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { ExpansionPanel } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <ExpansionPanel.Activator>
   *     Click to expand
   *     <ExpansionPanel.Cue />
   *   </ExpansionPanel.Activator>
   * </template>
   * ```
   */
  Cue,
  /**
   * Component for the content section of an expansion panel item.
   *
   * @see https://0.vuetifyjs.com/components/disclosure/expansion-panel
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
