export type { EmExpansionPanelProps } from './EmExpansionPanel.vue'
export type { EmExpansionPanelActivatorProps } from './EmExpansionPanelActivator.vue'
export { default as EmExpansionPanelActivator } from './EmExpansionPanelActivator.vue'
export type { EmExpansionPanelContentProps } from './EmExpansionPanelContent.vue'
export { default as EmExpansionPanelContent } from './EmExpansionPanelContent.vue'
export type { EmExpansionPanelCueProps } from './EmExpansionPanelCue.vue'
export { default as EmExpansionPanelCue } from './EmExpansionPanelCue.vue'
export type { EmExpansionPanelGroupProps } from './EmExpansionPanelGroup.vue'
export { default as EmExpansionPanelGroup } from './EmExpansionPanelGroup.vue'
export type { EmExpansionPanelHeaderProps } from './EmExpansionPanelHeader.vue'
export { default as EmExpansionPanelHeader } from './EmExpansionPanelHeader.vue'

// Context
import Root from './EmExpansionPanel.vue'
import Activator from './EmExpansionPanelActivator.vue'
import Content from './EmExpansionPanelContent.vue'
import Cue from './EmExpansionPanelCue.vue'
import Group from './EmExpansionPanelGroup.vue'
import Header from './EmExpansionPanelHeader.vue'

/**
 * Single collapsible panel. Owns its open state and the header/content pairing.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`EmExpansionPanelGroup`) remain exported and valid.
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { EmExpansionPanel } from '@paper/emerald'
 * </script>
 *
 * <template>
 *   <EmExpansionPanel.Group>
 *     <EmExpansionPanel>
 *       <EmExpansionPanel.Header>
 *         <EmExpansionPanel.Activator>
 *           <EmExpansionPanel.Cue />
 *         </EmExpansionPanel.Activator>
 *       </EmExpansionPanel.Header>
 *
 *       <EmExpansionPanel.Content />
 *     </EmExpansionPanel>
 *   </EmExpansionPanel.Group>
 * </template>
 * ```
 */
export const EmExpansionPanel = Object.assign(Root, {
  /** Wraps sibling panels and coordinates which of them may be open. */
  Group,
  /** Always-visible row that holds the activator. */
  Header,
  /** Toggles the panel open and closed. */
  Activator,
  /** Rotating affordance that tracks the open state. */
  Cue,
  /** Region revealed while the panel is open. */
  Content,
})
