export type { BRangeProps } from './BRange.vue'

/**
 * Bootstrap 6 range. `div.form-range` around `input.form-range-input`.
 * `v-model` is the thumb value.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { BRange } from '@paper/bootstrap'
 *   import { shallowRef } from 'vue'
 *
 *   const volume = shallowRef(60)
 * </script>
 *
 * <template>
 *   <BRange id="volume" v-model="volume" />
 * </template>
 * ```
 */
export { default as BRange } from './BRange.vue'
