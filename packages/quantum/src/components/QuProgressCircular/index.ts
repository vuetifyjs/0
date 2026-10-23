export type { QuProgressCircularProps } from './QuProgressCircular.vue'

/**
 * The Material Design 1 circular progress indicator: a 4 dp arc on a 40 dp
 * ring, determinate or indeterminate, with the ring that wraps a floating
 * action button. Composes v0 `Progress.Root` for the progressbar semantics and
 * the percent; the arc is runtime-parameterised SVG geometry.
 *
 * @example
 * ```vue
 * <QuProgressCircular />
 * <QuProgressCircular :value="40" />
 * <QuProgressCircular :size="24" />
 * <div class="fab-host">
 *   <QuFab aria-label="Upload" icon="cloud-upload" position="static" />
 *   <QuProgressCircular fab :value="progress" />
 * </div>
 * ```
 */
export { default as QuProgressCircular } from './QuProgressCircular.vue'
