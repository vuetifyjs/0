export type { Md1SliderProps } from './Md1Slider.vue'

/**
 * The Material Design 1 slider: continuous or discrete, with intensity icons
 * at the ends and an editable numeric value. Composes v0 `Slider.Root`,
 * `Slider.Track`, `Slider.Range` and `Slider.Thumb` (and `Input.Root` /
 * `Input.Control` for the numeric field); hosts `Md1Ripple` on the thumb.
 *
 * @example
 * ```vue
 * <Md1Slider v-model="volume" icon-end="add" icon-start="remove" label="Volume" />
 * <Md1Slider v-model="rating" discrete :max="10" label="Rating" />
 * ```
 */
export { default as Md1Slider } from './Md1Slider.vue'
