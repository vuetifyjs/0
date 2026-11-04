export type { BFormControlProps, BFormControlSize, BFormControlTag } from './BFormControl.vue'

/**
 * Bootstrap 6 `.form-control`. Input, textarea, or select. `v-model` is the string value.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { BFormControl } from '@paper/bootstrap'
 * </script>
 *
 * <template>
 *   <BFormControl v-model="email" type="email" placeholder="name@example.com" />
 * </template>
 * ```
 */
export { default as BFormControl } from './BFormControl.vue'
