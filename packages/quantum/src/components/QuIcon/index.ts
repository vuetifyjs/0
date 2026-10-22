export type { QuIconProps, QuIconSize } from './QuIcon.vue'

/**
 * Draws a named glyph from the Quantum icon set: Material Icons, filled, on
 * the 24 dp system icon grid.
 *
 * Decorative by default; pass `label` only when the icon carries meaning no
 * neighbouring text already gives. Directional roles flip under `[dir="rtl"]`.
 *
 * @example
 * ```vue
 * <QuIcon name="arrow-back" />
 * <QuIcon label="Favourite" name="star" size="s" />
 * ```
 */
export { default as QuIcon } from './QuIcon.vue'
