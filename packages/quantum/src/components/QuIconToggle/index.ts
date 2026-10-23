export type { QuIconToggleProps } from './QuIconToggle.vue'

/**
 * The Material Design 1 icon toggle: a single choice selected or deselected,
 * drawn as a glyph in a 48 dp target with `aria-pressed`. Composes v0
 * `Toggle.Root` / `Toggle.Indicator` around `QuIcon`; hosts an unbounded
 * `QuRipple` for the press.
 *
 * @example
 * ```vue
 * <QuIconToggle v-model="starred" aria-label="Star" icon="star-border" icon-on="star" />
 * ```
 */
export { default as QuIconToggle } from './QuIconToggle.vue'
