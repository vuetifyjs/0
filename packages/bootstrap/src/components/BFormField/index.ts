export type { BFormFieldProps } from './BFormField.vue'

/**
 * Bootstrap 6 `.form-field`. Optional `.form-floating`. Slot is the label, control, text, and feedback.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { BFormControl, BFormField, BFormLabel } from '@paper/bootstrap'
 * </script>
 *
 * <template>
 *   <BFormField>
 *     <BFormLabel for="email">Email address</BFormLabel>
 *     <BFormControl id="email" type="email" />
 *   </BFormField>
 * </template>
 * ```
 */
export { default as BFormField } from './BFormField.vue'
