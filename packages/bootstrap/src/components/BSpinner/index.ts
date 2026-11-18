export type { BSpinnerProps } from './BSpinner.vue'

// Context

/**
 * Bootstrap 6 spinner. Border, grow, small, or the separate rotate icon.
 *
 * Canon: `variant="rotate"` is the pin's `svg.bi.spinner-rotate`, not a class on `.spinner-border`. `grow` replaces `.spinner-border` with `.spinner-grow`. The hidden label defaults to "Loading". Rotate uses that string as `aria-label`.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { BSpinner } from '@paper/bootstrap'
 * </script>
 *
 * <template>
 *   <BSpinner />
 *   <BSpinner grow small />
 *   <BSpinner variant="rotate" />
 * </template>
 * ```
 */

export { default as BSpinner } from './BSpinner.vue'
