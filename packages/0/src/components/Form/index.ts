export type { FormProps, FormSlotProps } from './Form.vue'

/**
 * Form component for coordinating validation across fields.
 *
 * @see https://0.vuetifyjs.com/components/form
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { Form } from '@vuetify/v0'
 *   import { shallowRef } from 'vue'
 *
 *   const valid = shallowRef<boolean | null>(null)
 *
 *   function onSubmit ({ valid }: { valid: boolean }) {
 *     if (!valid) return
 *     // handle submission
 *   }
 * </script>
 *
 * <template>
 *   <Form v-model="valid" @submit="onSubmit">
 *     <button type="submit">Submit</button>
 *     <button type="reset">Reset</button>
 *   </Form>
 * </template>
 * ```
 */
export { default as Form } from './Form.vue'
