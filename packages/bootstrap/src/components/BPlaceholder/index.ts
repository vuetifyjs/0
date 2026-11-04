export type { BPlaceholderProps } from './BPlaceholder.vue'

// Context

/**
 * Bootstrap 6 placeholder span. Width is a consumer class (`col-6`), not a prop.
 *
 * Canon: `placeholder-wave`, `placeholder-pulse`, and `placeholder-glow` sit on the parent in the pin. This component is only `span.placeholder`.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { BPlaceholder } from '@paper/bootstrap'
 * </script>
 *
 * <template>
 *   <p class="placeholder-wave">
 *     <BPlaceholder class="col-6" />
 *   </p>
 * </template>
 * ```
 */

export { default as BPlaceholder } from './BPlaceholder.vue'
