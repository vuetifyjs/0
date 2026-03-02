export type { TreeviewActivatorProps, TreeviewActivatorSlotProps } from './types'
export { default as TreeviewActivator } from './TreeviewActivator.vue'

export type { TreeviewCheckboxProps, TreeviewCheckboxSlotProps } from './types'
export { default as TreeviewCheckbox } from './TreeviewCheckbox.vue'

export type { TreeviewContentProps, TreeviewContentSlotProps } from './types'
export { default as TreeviewContent } from './TreeviewContent.vue'

export type { TreeviewCueProps, TreeviewCueSlotProps } from './types'
export { default as TreeviewCue } from './TreeviewCue.vue'

export type { TreeviewGroupProps, TreeviewGroupSlotProps } from './types'
export { default as TreeviewGroup } from './TreeviewGroup.vue'

export type { TreeviewIndicatorProps, TreeviewIndicatorSlotProps } from './types'
export { default as TreeviewIndicator } from './TreeviewIndicator.vue'

export type { TreeviewItemContext, TreeviewItemProps, TreeviewItemSlotProps } from './types'
export { provideTreeviewItem, useTreeviewItem } from './TreeviewItem.vue'
export { default as TreeviewItem } from './TreeviewItem.vue'

export type { TreeviewListProps, TreeviewListSlotProps } from './types'
export { default as TreeviewList } from './TreeviewList.vue'

export type { TreeviewRootProps, TreeviewRootSlotProps } from './types'
export { provideTreeviewRoot, useTreeviewRoot } from './TreeviewRoot.vue'
export { default as TreeviewRoot } from './TreeviewRoot.vue'

// Components
import Activator from './TreeviewActivator.vue'
import Checkbox from './TreeviewCheckbox.vue'
import Content from './TreeviewContent.vue'
import Cue from './TreeviewCue.vue'
import Group from './TreeviewGroup.vue'
import Indicator from './TreeviewIndicator.vue'
import Item from './TreeviewItem.vue'
import List from './TreeviewList.vue'
import Root from './TreeviewRoot.vue'

/**
 * Treeview component with sub-components for hierarchical data.
 *
 * @see https://0.vuetifyjs.com/components/treeview
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { Treeview } from '@vuetify/v0'
 * </script>
 *
 * <template>
 *   <Treeview.Root>
 *     <Treeview.List>
 *       <Treeview.Item>
 *         <Treeview.Activator>Documents</Treeview.Activator>
 *         <Treeview.Content>
 *           <Treeview.Group>
 *             <Treeview.Item>
 *               <Treeview.Activator>Resume.pdf</Treeview.Activator>
 *             </Treeview.Item>
 *           </Treeview.Group>
 *         </Treeview.Content>
 *       </Treeview.Item>
 *     </Treeview.List>
 *   </Treeview.Root>
 * </template>
 * ```
 */
export const Treeview = { Root, List, Item, Activator, Content, Cue, Group, Checkbox, Indicator }
