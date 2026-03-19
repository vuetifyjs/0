export { default as SelectActivator } from './SelectActivator.vue'
export { default as SelectContent } from './SelectContent.vue'
export { default as SelectItem } from './SelectItem.vue'
export { provideSelectContext, useSelectContext } from './SelectRoot.vue'
export { default as SelectRoot } from './SelectRoot.vue'
export { default as SelectValue } from './SelectValue.vue'
export type { SelectActivatorProps, SelectActivatorSlotProps } from './SelectActivator.vue'
export type { SelectContentProps, SelectContentSlotProps } from './SelectContent.vue'
export type { SelectItemProps, SelectItemSlotProps } from './SelectItem.vue'
export type { SelectContext, SelectRootProps, SelectRootSlotProps } from './SelectRoot.vue'
export type { SelectValueProps, SelectValueSlotProps } from './SelectValue.vue'

// Components
import Activator from './SelectActivator.vue'
import Content from './SelectContent.vue'
import Item from './SelectItem.vue'
import Root from './SelectRoot.vue'
import Value from './SelectValue.vue'

/**
 * Select component with sub-components for building dropdown selects.
 *
 * @see https://0.vuetifyjs.com/components/select
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { Select } from '@vuetify/v0'
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
 *   <Select.Root v-model="selected">
 *     <Select.Activator>
 *       <Select.Value placeholder="Pick a fruit" v-slot="{ selectedIds }">
 *         {{ items.find(i => i.id === selectedIds[0])?.label }}
 *       </Select.Value>
 *     </Select.Activator>
 *
 *     <Select.Content>
 *       <Select.Item
 *         v-for="item in items"
 *         :key="item.id"
 *         :id="item.id"
 *         :value="item.label"
 *         v-slot="{ isSelected, attrs }"
 *       >
 *         <div v-bind="attrs">{{ item.label }}</div>
 *       </Select.Item>
 *     </Select.Content>
 *   </Select.Root>
 * </template>
 * ```
 */
export const Select = {
  /**
   * Root component for selects. Creates selection, virtual focus, and popover contexts.
   *
   * @see https://0.vuetifyjs.com/components/select
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Select } from '@vuetify/v0'
   *   import { ref } from 'vue'
   *
   *   const selected = ref()
   * </script>
   *
   * <template>
   *   <Select.Root v-model="selected">
   *     <Select.Activator>
   *       <Select.Value placeholder="Choose..." />
   *     </Select.Activator>
   *     <Select.Content>
   *       <Select.Item id="a" value="A">Option A</Select.Item>
   *     </Select.Content>
   *   </Select.Root>
   * </template>
   * ```
   */
  Root,
  /**
   * Activator button that opens the select dropdown.
   *
   * @see https://0.vuetifyjs.com/components/select#selectactivator
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Select } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Select.Activator>
   *     Click to open
   *   </Select.Activator>
   * </template>
   * ```
   */
  Activator,
  /**
   * Display component for the selected value. Slot-based — consumers provide rendering.
   *
   * @see https://0.vuetifyjs.com/components/select#selectvalue
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Select } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Select.Value placeholder="Pick one" v-slot="{ selectedIds }">
   *     {{ selectedIds.join(', ') }}
   *   </Select.Value>
   * </template>
   * ```
   */
  Value,
  /**
   * Dropdown content container using native popover API with CSS anchor positioning.
   *
   * @see https://0.vuetifyjs.com/components/select#selectcontent
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Select } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Select.Content>
   *     <Select.Item id="a" value="A">Option A</Select.Item>
   *     <Select.Item id="b" value="B">Option B</Select.Item>
   *   </Select.Content>
   * </template>
   * ```
   */
  Content,
  /**
   * Option item within the select dropdown. Registers with selection and virtual focus.
   *
   * @see https://0.vuetifyjs.com/components/select#selectitem
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Select } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Select.Item id="apple" value="Apple" v-slot="{ isSelected, attrs }">
   *     <div v-bind="attrs">Apple {{ isSelected ? '✓' : '' }}</div>
   *   </Select.Item>
   * </template>
   * ```
   */
  Item,
}
