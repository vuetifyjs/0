export type { QuProgressLinearProps } from './QuProgressLinear.vue'

/**
 * The Material Design 1 linear progress indicator: a 4 dp bar at the edge of a
 * header or sheet, determinate or indeterminate, with the buffer and query
 * variants. Composes v0 `Progress.Root` / `Track` / `Fill` / `Buffer` and
 * `Presence` for the appearance.
 *
 * @example
 * ```vue
 * <QuProgressLinear v-if="loading" />
 * <QuProgressLinear :value="40" />
 * <QuProgressLinear :value="40" :buffer="70" />
 * <QuProgressLinear query :value="pending ? undefined : value" />
 * ```
 */
export { default as QuProgressLinear } from './QuProgressLinear.vue'
