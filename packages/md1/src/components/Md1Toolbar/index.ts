export type {
  Md1ToolbarContext,
  Md1ToolbarExtensionTicket,
  Md1ToolbarPosition,
  Md1ToolbarProps,
  Md1ToolbarScroll,
  Md1ToolbarTabBar,
  Md1ToolbarVariant,
} from './Md1Toolbar.vue'
export { useMd1Toolbar } from './Md1Toolbar.vue'
export type { Md1ToolbarActionsProps } from './Md1ToolbarActions.vue'
export { default as Md1ToolbarActions } from './Md1ToolbarActions.vue'
export type { Md1ToolbarContextualProps } from './Md1ToolbarContextual.vue'
export { default as Md1ToolbarContextual } from './Md1ToolbarContextual.vue'
export type { Md1ToolbarExtensionContext, Md1ToolbarExtensionProps, Md1ToolbarExtensionRatio } from './Md1ToolbarExtension.vue'
export { default as Md1ToolbarExtension, useMd1ToolbarExtension } from './Md1ToolbarExtension.vue'
export type { Md1ToolbarNavIcon, Md1ToolbarNavProps } from './Md1ToolbarNav.vue'
export { default as Md1ToolbarNav } from './Md1ToolbarNav.vue'
export type { Md1ToolbarSearchProps } from './Md1ToolbarSearch.vue'
export { default as Md1ToolbarSearch } from './Md1ToolbarSearch.vue'
export { default as Md1ToolbarTitle } from './Md1ToolbarTitle.vue'

// Context
import Root from './Md1Toolbar.vue'
import Actions from './Md1ToolbarActions.vue'
import Contextual from './Md1ToolbarContextual.vue'
import Extension from './Md1ToolbarExtension.vue'
import Nav from './Md1ToolbarNav.vue'
import Search from './Md1ToolbarSearch.vue'
import Title from './Md1ToolbarTitle.vue'

/**
 * The Material Design 1 toolbar and app bar: a 56 dp sheet (64 dp from 600 px,
 * 48 dp dense, 128 dp prominent) at 4 dp, with the nav icon, the title and the
 * action icons in one row and an extension for tabs, a large title or a
 * flexible-space image. As an app bar it is the banner landmark, fixed to the
 * top, and follows the scrolling-techniques page. Presentational on v0 `Atom`;
 * the actions rove on `useRovingFocus`, the search mode runs on `Combobox`.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`Md1ToolbarTitle`) remain exported and valid.
 *
 * @example
 * ```vue
 * <Md1Toolbar app-bar>
 *   <Md1Toolbar.Nav />
 *
 *   <Md1Toolbar.Title />
 *
 *   <Md1Toolbar.Actions />
 *
 *   <Md1Toolbar.Search />
 *
 *   <Md1Toolbar.Contextual />
 *
 *   <Md1Toolbar.Extension />
 * </Md1Toolbar>
 * ```
 */
export const Md1Toolbar = Object.assign(Root, {
  /** The drawer or up control at the start: menu, up arrow or close; the menu glyph morphs to the back arrow while open. */
  Nav,
  /** Title 20 sp Medium on the content keyline, one line. */
  Title,
  /** The action icons: a `role="toolbar"` with one tab stop and arrow-key movement. */
  Actions,
  /** Expandable search: the row becomes a search field with suggestions beneath the bar. */
  Search,
  /** Selection mode: close, "N selected" and the actions on the selected items. */
  Contextual,
  /** The block under the row: a tab bar, a large collapsing title, a flexible-space image, or related content. */
  Extension,
})
