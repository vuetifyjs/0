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

export type { TreeviewSelectAllProps, TreeviewSelectAllSlotProps } from './types'
export { default as TreeviewSelectAll } from './TreeviewSelectAll.vue'

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
import SelectAll from './TreeviewSelectAll.vue'

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
export const Treeview = {
  /**
   * Root component that creates and provides the nested context.
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
   *   <Treeview.Root v-model="selected" :multiple="true">
   *     <Treeview.List>
   *       <Treeview.Item value="a">Node A</Treeview.Item>
   *     </Treeview.List>
   *   </Treeview.Root>
   * </template>
   * ```
   */
  Root,
  /**
   * Top-level list container with `role="tree"` and `aria-multiselectable`.
   *
   * @see https://0.vuetifyjs.com/components/treeview#treeviewlist
   */
  List,
  /**
   * Tree node with `role="treeitem"`. Registers with the nearest Root context
   * and auto-nests under the closest ancestor Item.
   *
   * @see https://0.vuetifyjs.com/components/treeview#treeviewitem
   */
  Item,
  /**
   * Click-to-toggle trigger for expand/collapse. Renders a button by default.
   *
   * @see https://0.vuetifyjs.com/components/treeview#treeviewactivator
   */
  Activator,
  /**
   * Collapse gate for child nodes. Conditionally renders when the parent Item is open.
   *
   * @see https://0.vuetifyjs.com/components/treeview#treeviewcontent
   */
  Content,
  /**
   * Visual cue for expand/collapse state. Hides itself on leaf nodes.
   * Exposes `data-state="open|closed"` for CSS-driven styling.
   *
   * @see https://0.vuetifyjs.com/components/treeview#treeviewcue
   */
  Cue,
  /**
   * Wrapper with `role="group"` for nested child items inside Content.
   *
   * @see https://0.vuetifyjs.com/components/treeview#treeviewgroup
   */
  Group,
  /**
   * Tri-state checkbox for selection. Toggles selection on click
   * and shows mixed state for partially-selected parents.
   *
   * @see https://0.vuetifyjs.com/components/treeview#treeviewcheckbox
   */
  Checkbox,
  /**
   * Visual indicator for selection state. Shows checked, unchecked,
   * or indeterminate via `data-state`.
   *
   * @see https://0.vuetifyjs.com/components/treeview#treeviewindicator
   */
  Indicator,
  /**
   * Select all checkbox for tree-wide multi-selection.
   *
   * Binds to parent TreeviewRoot's aggregate state. Reflects
   * isAllSelected/isMixed and calls toggleAll on click. Does NOT
   * register as a tree item. Must be used within a Treeview.Root.
   *
   * @see https://0.vuetifyjs.com/components/treeview#treeviewselectall
   */
  SelectAll,
}
