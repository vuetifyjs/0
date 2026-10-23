export type { QuSwitchProps } from './QuSwitch.vue'

/**
 * The Material Design 1 switch: a 20 dp thumb at 1 dp over a 36 x 14 dp
 * track, in the accent colour when on. Composes v0 `Switch.Root` /
 * `Switch.Track` / `Switch.Thumb` inside a native `<label>`; hosts an
 * unbounded `QuRipple` that follows the thumb.
 *
 * @example
 * ```vue
 * <QuSwitch v-model="wifi" label="Wi-Fi" />
 * ```
 */
export { default as QuSwitch } from './QuSwitch.vue'
