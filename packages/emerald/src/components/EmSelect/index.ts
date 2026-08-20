export type { EmSelectActivatorProps } from './EmSelectActivator.vue'
export { default as EmSelectActivator } from './EmSelectActivator.vue'
export type { EmSelectContentProps } from './EmSelectContent.vue'
export { default as EmSelectContent } from './EmSelectContent.vue'
export type { EmSelectItemProps } from './EmSelectItem.vue'
export { default as EmSelectItem } from './EmSelectItem.vue'
export type { EmSelectPlaceholderProps } from './EmSelectPlaceholder.vue'
export { default as EmSelectPlaceholder } from './EmSelectPlaceholder.vue'
export type { EmSelectProps } from './EmSelect.vue'
export type { EmSelectValueProps } from './EmSelectValue.vue'
export { default as EmSelectValue } from './EmSelectValue.vue'

// Context
import Root from './EmSelect.vue'
import Activator from './EmSelectActivator.vue'
import Content from './EmSelectContent.vue'
import Item from './EmSelectItem.vue'
import Placeholder from './EmSelectPlaceholder.vue'
import Value from './EmSelectValue.vue'

/**
 * Select. Owns the selected value, the listbox open state, and typeahead focus.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`EmSelectActivator`) remain exported and valid.
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { EmSelect } from '@paper/emerald'
 * </script>
 *
 * <template>
 *   <EmSelect v-model="value">
 *     <EmSelect.Activator>
 *       <EmSelect.Value />
 *
 *       <EmSelect.Placeholder />
 *     </EmSelect.Activator>
 *
 *     <EmSelect.Content>
 *       <EmSelect.Item />
 *     </EmSelect.Content>
 *   </EmSelect>
 * </template>
 * ```
 */
export const EmSelect = Object.assign(Root, {
  /** Trigger that opens the listbox. */
  Activator,
  /** Renders the current selection. */
  Value,
  /** Stands in while nothing is selected. */
  Placeholder,
  /** The listbox surface. */
  Content,
  /** One selectable option. */
  Item,
})
