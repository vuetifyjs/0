export type { Md1ProgressLinearProps } from './Md1ProgressLinear.vue'

/**
 * The Material Design 1 linear progress indicator: a 4 dp bar at the edge of a
 * header or sheet, determinate or indeterminate, with the buffer and query
 * variants. Composes v0 `Progress.Root` / `Track` / `Fill` / `Buffer` and
 * `Presence` for the appearance.
 *
 * @example
 * ```vue
 * <Md1ProgressLinear v-if="loading" />
 * <Md1ProgressLinear :value="40" />
 * <Md1ProgressLinear :value="40" :buffer="70" />
 * <Md1ProgressLinear query :value="pending ? undefined : value" />
 * ```
 */
export { default as Md1ProgressLinear } from './Md1ProgressLinear.vue'
