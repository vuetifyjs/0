export type { QuCheckboxProps } from './QuCheckbox.vue'

/**
 * The Material Design 1 checkbox: an 18 dp square in the accent colour when
 * on, with the check drawn through `QuIcon`, and the declared indeterminate
 * extension. Composes v0 `Checkbox.Root` / `Checkbox.Indicator` inside a
 * native `<label>`; hosts an unbounded `QuRipple` for the touch reaction.
 *
 * @example
 * ```vue
 * <QuCheckbox v-model="agreed" label="Send me updates" />
 * ```
 */
export { default as QuCheckbox } from './QuCheckbox.vue'
