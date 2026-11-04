export type { BComboboxItem, BComboboxProps } from './BCombobox.vue'

/**
 * Bootstrap 6 combobox. A `.combobox-toggle` and a `.menu`. `v-model` is the
 * selected value, not the open state.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { BCombobox } from '@paper/bootstrap'
 *   import { shallowRef } from 'vue'
 *
 *   const country = shallowRef<string>()
 * </script>
 *
 * <template>
 *   <BCombobox v-model="country" placeholder="Pick a country…" />
 * </template>
 * ```
 */
export { default as BCombobox } from './BCombobox.vue'
