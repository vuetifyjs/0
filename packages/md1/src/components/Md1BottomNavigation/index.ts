export type { Md1BottomNavigationContext, Md1BottomNavigationProps, Md1BottomNavigationVariant } from './Md1BottomNavigation.vue'
export type { Md1BottomNavigationActionProps } from './Md1BottomNavigationAction.vue'
export { default as Md1BottomNavigationAction } from './Md1BottomNavigationAction.vue'

// Context
import Root from './Md1BottomNavigation.vue'
import Action from './Md1BottomNavigationAction.vue'

/**
 * The Material Design 1 bottom navigation bar: three to five top-level
 * destinations, fixed or shifting, on the surface or the primary colour.
 * Selection is v0 `createSingle` behind `v-model`; each action is a v0
 * `Button.Root` (or a link with `href`) hosting `Md1Ripple` and an `Md1Icon`.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat name (`Md1BottomNavigationAction`) remains exported and valid.
 *
 * @example
 * ```vue
 * <Md1BottomNavigation v-model="view" aria-label="Main">
 *   <Md1BottomNavigation.Action icon="history" label="Recents" value="recents" />
 *
 *   <Md1BottomNavigation.Action icon="favorite" label="Favorites" value="favorites" />
 *
 *   <Md1BottomNavigation.Action icon="place" label="Nearby" value="nearby" />
 * </Md1BottomNavigation>
 * ```
 */
export const Md1BottomNavigation = Object.assign(Root, {
  /** One destination: an icon and a short label. */
  Action,
})
