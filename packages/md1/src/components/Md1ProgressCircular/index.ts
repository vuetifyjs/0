export type { Md1ProgressCircularProps } from './Md1ProgressCircular.vue'

/**
 * The Material Design 1 circular progress indicator: a 4 dp arc on a 40 dp
 * ring, determinate or indeterminate, with the ring that wraps a floating
 * action button. Composes v0 `Progress.Root` for the progressbar semantics and
 * the percent; the arc is runtime-parameterised SVG geometry.
 *
 * @example
 * ```vue
 * <Md1ProgressCircular />
 * <Md1ProgressCircular :value="40" />
 * <Md1ProgressCircular :size="24" />
 * <div class="fab-host">
 *   <Md1Fab aria-label="Upload" icon="cloud-upload" position="static" />
 *   <Md1ProgressCircular fab :value="progress" />
 * </div>
 * ```
 */
export { default as Md1ProgressCircular } from './Md1ProgressCircular.vue'
