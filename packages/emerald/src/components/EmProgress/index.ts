export type { EmProgressProps, EmProgressSize } from './EmProgress.vue'

/**
 * Linear progress bar. Composes v0 `Progress.Root` / `Track` / `Fill` / `Label` / `Value`.
 *
 * @example
 * ```vue
 * <EmProgress v-model="pct" :show-value label="Upload" />
 * <EmProgress indeterminate label="Loading" />
 * ```
 */
export { default as EmProgress } from './EmProgress.vue'
