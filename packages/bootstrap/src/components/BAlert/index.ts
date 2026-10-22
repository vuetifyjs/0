export type { BAlertProps } from './BAlert.vue'

/**
 * Bootstrap 6 alert. `div.alert`. `v-model` false adds `.hiding`, then unmounts.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { shallowRef } from 'vue'
 *   import { BAlert, BClose } from '@paper/bootstrap'
 *
 *   const open = shallowRef(true)
 * </script>
 *
 * <template>
 *   <BAlert v-model="open" theme="warning">
 *     <BClose @click="open = false" />
 *   </BAlert>
 * </template>
 * ```
 */
export { default as BAlert } from './BAlert.vue'
