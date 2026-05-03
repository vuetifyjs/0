export { default as ComboboxActivator } from './ComboboxActivator.vue'
export { default as ComboboxContent } from './ComboboxContent.vue'
export { default as ComboboxControl } from './ComboboxControl.vue'
export { default as ComboboxCue } from './ComboboxCue.vue'
export { default as ComboboxDescription } from './ComboboxDescription.vue'
export { default as ComboboxEmpty } from './ComboboxEmpty.vue'
export { default as ComboboxError } from './ComboboxError.vue'
export { default as ComboboxItem } from './ComboboxItem.vue'
export { provideComboboxContext, useComboboxContext } from './ComboboxRoot.vue'
export { default as ComboboxRoot } from './ComboboxRoot.vue'
export type { ComboboxActivatorProps, ComboboxActivatorSlotProps } from './ComboboxActivator.vue'
export type { ComboboxContentProps, ComboboxContentSlotProps } from './ComboboxContent.vue'
export type { ComboboxControlProps, ComboboxControlSlotProps } from './ComboboxControl.vue'
export type { ComboboxCueProps, ComboboxCueSlotProps } from './ComboboxCue.vue'
export type { ComboboxDescriptionProps, ComboboxDescriptionSlotProps } from './ComboboxDescription.vue'
export type { ComboboxEmptyProps, ComboboxEmptySlotProps } from './ComboboxEmpty.vue'
export type { ComboboxErrorProps, ComboboxErrorSlotProps } from './ComboboxError.vue'
export type { ComboboxItemProps, ComboboxItemSlotProps } from './ComboboxItem.vue'
export type { ComboboxContext } from '#v0/composables/createCombobox'
export type { ComboboxRootProps, ComboboxRootSlotProps } from './ComboboxRoot.vue'

// Context
import Activator from './ComboboxActivator.vue'
import Content from './ComboboxContent.vue'
import Control from './ComboboxControl.vue'
import Cue from './ComboboxCue.vue'
import Description from './ComboboxDescription.vue'
import Empty from './ComboboxEmpty.vue'
import Error from './ComboboxError.vue'
import Item from './ComboboxItem.vue'
import Root from './ComboboxRoot.vue'

/**
 * Combobox component with sub-components for building autocomplete inputs.
 *
 * @see https://0.vuetifyjs.com/components/forms/combobox
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
 *       <Combobox.Control placeholder="Search..." />
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
   * and adapter contexts. Bridges v-model to the internal selection state.
   *
   * @see https://0.vuetifyjs.com/components/forms/combobox
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Combobox } from '@vuetify/v0'
   *   import { ref } from 'vue'
   *
   *   const selected = ref()
   * </script>
   *
   * <template>
   *   <Combobox.Root v-model="selected" strict>
   *     <Combobox.Activator>
   *       <Combobox.Control placeholder="Search..." />
   *       <Combobox.Cue />
   *     </Combobox.Activator>
   *     <Combobox.Content>
   *       <Combobox.Item id="a" value="A">Option A</Combobox.Item>
   *     </Combobox.Content>
   *   </Combobox.Root>
   * </template>
   * ```
   */
  Root,
  /**
   * Wrapper for the control and cue. Sets CSS anchor-name so the dropdown
   * positions relative to this element.
   *
   * @see https://0.vuetifyjs.com/components/forms/combobox
   *
   * @example
   * ```vue
   * <Combobox.Activator>
   *   <Combobox.Control placeholder="Type to search..." />
   *   <Combobox.Cue />
   * </Combobox.Activator>
   * ```
   */
  Activator,
  /**
   * Text input that drives the query string and keyboard navigation.
   * Binds `role="combobox"` and manages `aria-activedescendant` via virtual focus.
   *
   * @see https://0.vuetifyjs.com/components/forms/combobox
   *
   * @example
   * ```vue
   * <!-- Opens on focus (default) -->
   * <Combobox.Control placeholder="Search fruits..." />
   *
   * <!-- Opens only when the user starts typing -->
   * <Combobox.Control open-on="input" placeholder="Start typing..." />
   * ```
   */
  Control,
  /**
   * Visual cue for open/close state. Exposes `data-state="open|closed"` for
   * CSS-driven styling. Clicking toggles the dropdown.
   *
   * @see https://0.vuetifyjs.com/components/forms/combobox
   *
   * @example
   * ```vue
   * <Combobox.Cue v-slot="{ isOpen }">
   *   {{ isOpen ? '▲' : '▼' }}
   * </Combobox.Cue>
   * ```
   */
  Cue,
  /**
   * Dropdown content container using native popover API with CSS anchor
   * positioning. Renders `role="listbox"` with lazy mounting.
   *
   * @see https://0.vuetifyjs.com/components/forms/combobox
   *
   * @example
   * ```vue
   * <Combobox.Content>
   *   <Combobox.Item id="a" value="A">Option A</Combobox.Item>
   *   <Combobox.Item id="b" value="B">Option B</Combobox.Item>
   *   <Combobox.Empty>No results found</Combobox.Empty>
   * </Combobox.Content>
   * ```
   */
  Content,
  /**
   * Option item within the combobox dropdown. Registers with selection and
   * virtual focus. Hidden via `v-show` when filtered out so selection state
   * is preserved.
   *
   * @see https://0.vuetifyjs.com/components/forms/combobox
   *
   * @example
   * ```vue
   * <Combobox.Item id="apple" value="Apple" v-slot="{ isSelected, isHighlighted, attrs }">
   *   <div v-bind="attrs" :class="{ highlighted: isHighlighted }">
   *     Apple {{ isSelected ? '✓' : '' }}
   *   </div>
   * </Combobox.Item>
   * ```
   */
  Item,
  /**
   * Empty state shown when no items match the current query. Exposes the
   * query string via slot props for contextual messaging.
   *
   * @see https://0.vuetifyjs.com/components/forms/combobox
   *
   * @example
   * ```vue
   * <Combobox.Empty v-slot="{ query }">
   *   No results for "{{ query }}"
   * </Combobox.Empty>
   * ```
   */
  Empty,
  /**
   * Help text component connected via aria-describedby.
   * Auto-generates an ID that Combobox.Control references in its
   * aria-describedby attribute for accessibility.
   *
   * @see https://0.vuetifyjs.com/components/forms/combobox
   *
   * @example
   * ```vue
   * <Combobox.Root v-model="selected">
   *   <Combobox.Activator>
   *     <Combobox.Control placeholder="Search..." />
   *   </Combobox.Activator>
   *   <Combobox.Description>Select a fruit from the list.</Combobox.Description>
   * </Combobox.Root>
   * ```
   */
  Description,
  /**
   * Error message component with aria-live announcements.
   * Renders error messages from Root's errorMessages prop.
   * Connected to Control via aria-errormessage. Uses aria-live="polite"
   * for screen reader announcements when errors appear.
   *
   * @see https://0.vuetifyjs.com/components/forms/combobox
   *
   * @example
   * ```vue
   * <Combobox.Root v-model="selected" :error-messages="['Selection required']">
   *   <Combobox.Activator>
   *     <Combobox.Control placeholder="Search..." />
   *   </Combobox.Activator>
   *   <Combobox.Error v-slot="{ errors }">
   *     <span v-for="error in errors" :key="error">{{ error }}</span>
   *   </Combobox.Error>
   * </Combobox.Root>
   * ```
   */
  Error,
}
