export type { QuRippleProps } from './QuRipple.vue'

/**
 * The ink reaction every Material Design 1 press produces. Place it as the
 * first child of an interactive root that is `position: relative`; it binds
 * the pointer and keyboard events on that parent and draws nothing while the
 * parent is disabled or motion is reduced.
 *
 * @example
 * ```vue
 * <button class="my-action">
 *   <QuRipple />
 *   Save
 * </button>
 *
 * <button class="my-icon-toggle" aria-pressed="false">
 *   <QuRipple unbounded />
 *   <QuIcon name="star" />
 * </button>
 * ```
 */
export { default as QuRipple } from './QuRipple.vue'
