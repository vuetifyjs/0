export type { BProgressProps } from './BProgress.vue'

// Context

/**
 * Bootstrap 6 progress bar. `v-model` is the current value. The width percent comes from `createProgress`.
 *
 * Canon: one bar. `progress-stacked` is in the pin and not rendered here. Conform ignores `style`.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { shallowRef } from 'vue'
 *   import { BProgress } from '@paper/bootstrap'
 *
 *   const value = shallowRef(25)
 * </script>
 *
 * <template>
 *   <BProgress v-model="value" label="Basic example" striped />
 * </template>
 * ```
 */

export { default as BProgress } from './BProgress.vue'
