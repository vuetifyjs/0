export type { BStrengthProps, BStrengthVariant } from './BStrength.vue'

/**
 * Bootstrap 6 password-strength meter. Presentational. The consumer passes
 * the level. This component does not score a password.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { BStrength } from '@paper/bootstrap'
 * </script>
 *
 * <template>
 *   <BStrength :value="2" />
 * </template>
 * ```
 */
export { default as BStrength } from './BStrength.vue'
