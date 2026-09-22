export type { EmIconProps, EmIconSize } from './EmIcon.vue'

/**
 * Draws a named glyph from the Emerald icon set.
 *
 * Decorative by default — pass `label` only when the icon carries meaning no
 * neighbouring text already gives.
 *
 * @example
 * ```vue
 * <EmIcon name="chevron-down" size="s" />
 * <EmIcon label="Favourite" name="star" />
 * ```
 */
export { default as EmIcon } from './EmIcon.vue'
