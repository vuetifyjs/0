export type { QuBottomNavigationContext, QuBottomNavigationProps, QuBottomNavigationVariant } from './QuBottomNavigation.vue'
export type { QuBottomNavigationActionProps } from './QuBottomNavigationAction.vue'
export { default as QuBottomNavigationAction } from './QuBottomNavigationAction.vue'

// Context
import Root from './QuBottomNavigation.vue'
import Action from './QuBottomNavigationAction.vue'

/**
 * The Material Design 1 bottom navigation bar: three to five top-level
 * destinations, fixed or shifting, on the surface or the primary colour.
 * Selection is v0 `createSingle` behind `v-model`; each action is a v0
 * `Button.Root` (or a link with `href`) hosting `QuRipple` and a `QuIcon`.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat name (`QuBottomNavigationAction`) remains exported and valid.
 *
 * @example
 * ```vue
 * <QuBottomNavigation v-model="view" aria-label="Main">
 *   <QuBottomNavigation.Action icon="history" label="Recents" value="recents" />
 *
 *   <QuBottomNavigation.Action icon="favorite" label="Favorites" value="favorites" />
 *
 *   <QuBottomNavigation.Action icon="place" label="Nearby" value="nearby" />
 * </QuBottomNavigation>
 * ```
 */
export const QuBottomNavigation = Object.assign(Root, {
  /** One destination: an icon and a short label. */
  Action,
})
