export { default as ComboboxActivator } from './ComboboxActivator.vue'
export { default as ComboboxContent } from './ComboboxContent.vue'
export { default as ComboboxCue } from './ComboboxCue.vue'
export { default as ComboboxEmpty } from './ComboboxEmpty.vue'
export { default as ComboboxInput } from './ComboboxInput.vue'
export { default as ComboboxItem } from './ComboboxItem.vue'
export { provideComboboxContext, useComboboxContext } from './ComboboxRoot.vue'
export { default as ComboboxRoot } from './ComboboxRoot.vue'
export type { ComboboxActivatorProps, ComboboxActivatorSlotProps } from './ComboboxActivator.vue'
export type { ComboboxContentProps, ComboboxContentSlotProps } from './ComboboxContent.vue'
export type { ComboboxCueProps, ComboboxCueSlotProps } from './ComboboxCue.vue'
export type { ComboboxEmptyProps, ComboboxEmptySlotProps } from './ComboboxEmpty.vue'
export type { ComboboxInputProps, ComboboxInputSlotProps } from './ComboboxInput.vue'
export type { ComboboxItemProps, ComboboxItemSlotProps } from './ComboboxItem.vue'
export type { ComboboxContext } from '#v0/composables/createCombobox'
export type { ComboboxRootProps, ComboboxRootSlotProps } from './ComboboxRoot.vue'

// Components
import Activator from './ComboboxActivator.vue'
import Content from './ComboboxContent.vue'
import Cue from './ComboboxCue.vue'
import Empty from './ComboboxEmpty.vue'
import Input from './ComboboxInput.vue'
import Item from './ComboboxItem.vue'
import Root from './ComboboxRoot.vue'

/**
 * Combobox component with sub-components for building autocomplete inputs.
 *
 * @see https://0.vuetifyjs.com/components/combobox
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { Combobox } from '@vuetify/v0'
 *   import { ref } from 'vue'
 *
 *   const selected = ref()
 *   const items = [
 *     { id: 'apple', label: 'Apple' },
 *     { id: 'banana', label: 'Banana' },
 *     { id: 'cherry', label: 'Cherry' },
 *   ]
 * </script>
 *
 * <template>
 *   <Combobox.Root v-model="selected">
 *     <Combobox.Activator>
 *       <Combobox.Input placeholder="Search..." />
 *       <Combobox.Cue />
 *     </Combobox.Activator>
 *
 *     <Combobox.Content>
 *       <Combobox.Item
 *         v-for="item in items"
 *         :key="item.id"
 *         :id="item.id"
 *         :value="item.label"
 *         v-slot="{ isSelected, attrs }"
 *       >
 *         <div v-bind="attrs">{{ item.label }}</div>
 *       </Combobox.Item>
 *       <Combobox.Empty>No results found</Combobox.Empty>
 *     </Combobox.Content>
 *   </Combobox.Root>
 * </template>
 * ```
 */
export const Combobox = {
  /**
   * Root component for comboboxes. Creates selection, virtual focus, popover,
   * and adapter contexts.
   *
   * @see https://0.vuetifyjs.com/components/combobox
   */
  Root,
  /**
   * Wrapper for the input and cue. Sets CSS anchor-name for popover positioning.
   *
   * @see https://0.vuetifyjs.com/components/combobox#comboboxactivator
   */
  Activator,
  /**
   * Text input that drives query and keyboard navigation.
   *
   * @see https://0.vuetifyjs.com/components/combobox#comboboxinput
   */
  Input,
  /**
   * Visual cue for open/close state. Clicking toggles the dropdown.
   *
   * @see https://0.vuetifyjs.com/components/combobox#comboboxcue
   */
  Cue,
  /**
   * Dropdown content container using native popover API with CSS anchor positioning.
   *
   * @see https://0.vuetifyjs.com/components/combobox#comboboxcontent
   */
  Content,
  /**
   * Option item within the combobox dropdown. Registers with selection, shown/hidden via filter.
   *
   * @see https://0.vuetifyjs.com/components/combobox#comboboxitem
   */
  Item,
  /**
   * Empty state shown when no items match the current query.
   *
   * @see https://0.vuetifyjs.com/components/combobox#comboboxempty
   */
  Empty,
}
