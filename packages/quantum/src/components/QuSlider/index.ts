export type { QuSliderProps } from './QuSlider.vue'

/**
 * The Material Design 1 slider: continuous or discrete, with intensity icons
 * at the ends and an editable numeric value. Composes v0 `Slider.Root`,
 * `Slider.Track`, `Slider.Range` and `Slider.Thumb` (and `Input.Root` /
 * `Input.Control` for the numeric field); hosts `QuRipple` on the thumb.
 *
 * @example
 * ```vue
 * <QuSlider v-model="volume" icon-end="add" icon-start="remove" label="Volume" />
 * <QuSlider v-model="rating" discrete :max="10" label="Rating" />
 * ```
 */
export { default as QuSlider } from './QuSlider.vue'
