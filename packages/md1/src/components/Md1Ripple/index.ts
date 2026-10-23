export type { Md1RippleProps } from './Md1Ripple.vue'

/**
 * The ink reaction every Material Design 1 press produces. Place it as the
 * first child of an interactive root that is `position: relative`; it binds
 * the pointer and keyboard events on that parent and draws nothing while the
 * parent is disabled or motion is reduced.
 *
 * @example
 * ```vue
 * <button class="my-action">
 *   <Md1Ripple />
 *   Save
 * </button>
 *
 * <button class="my-icon-toggle" aria-pressed="false">
 *   <Md1Ripple unbounded />
 *   <Md1Icon name="star" />
 * </button>
 * ```
 */
export { default as Md1Ripple } from './Md1Ripple.vue'
