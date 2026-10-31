export type { BChipsItem, BChipsProps } from './BChips.vue'

/**
 * Bootstrap 6 chips. Choice chips are `span.chip`. The input face is
 * `div.chip-input`. `v-model` is `string[]` on both.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { BChips } from '@paper/bootstrap'
 *   import { shallowRef } from 'vue'
 *
 *   const skills = shallowRef<string[]>([])
 * </script>
 *
 * <template>
 *   <BChips v-model="skills" input placeholder="Add more…" />
 * </template>
 * ```
 */
export { default as BChips } from './BChips.vue'
