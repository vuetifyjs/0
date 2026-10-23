export type {
  QuToolbarContext,
  QuToolbarExtensionTicket,
  QuToolbarPosition,
  QuToolbarProps,
  QuToolbarScroll,
  QuToolbarTabBar,
  QuToolbarVariant,
} from './QuToolbar.vue'
export { useQuToolbar } from './QuToolbar.vue'
export type { QuToolbarActionsProps } from './QuToolbarActions.vue'
export { default as QuToolbarActions } from './QuToolbarActions.vue'
export type { QuToolbarContextualProps } from './QuToolbarContextual.vue'
export { default as QuToolbarContextual } from './QuToolbarContextual.vue'
export type { QuToolbarExtensionContext, QuToolbarExtensionProps, QuToolbarExtensionRatio } from './QuToolbarExtension.vue'
export { default as QuToolbarExtension, useQuToolbarExtension } from './QuToolbarExtension.vue'
export type { QuToolbarNavIcon, QuToolbarNavProps } from './QuToolbarNav.vue'
export { default as QuToolbarNav } from './QuToolbarNav.vue'
export type { QuToolbarSearchProps } from './QuToolbarSearch.vue'
export { default as QuToolbarSearch } from './QuToolbarSearch.vue'
export { default as QuToolbarTitle } from './QuToolbarTitle.vue'

// Context
import Root from './QuToolbar.vue'
import Actions from './QuToolbarActions.vue'
import Contextual from './QuToolbarContextual.vue'
import Extension from './QuToolbarExtension.vue'
import Nav from './QuToolbarNav.vue'
import Search from './QuToolbarSearch.vue'
import Title from './QuToolbarTitle.vue'

/**
 * The Material Design 1 toolbar and app bar: a 56 dp sheet (64 dp from 600 px,
 * 48 dp dense, 128 dp prominent) at 4 dp, with the nav icon, the title and the
 * action icons in one row and an extension for tabs, a large title or a
 * flexible-space image. As an app bar it is the banner landmark, fixed to the
 * top, and follows the scrolling-techniques page. Presentational on v0 `Atom`;
 * the actions rove on `useRovingFocus`, the search mode runs on `Combobox`.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`QuToolbarTitle`) remain exported and valid.
 *
 * @example
 * ```vue
 * <QuToolbar app-bar>
 *   <QuToolbar.Nav />
 *
 *   <QuToolbar.Title />
 *
 *   <QuToolbar.Actions />
 *
 *   <QuToolbar.Search />
 *
 *   <QuToolbar.Contextual />
 *
 *   <QuToolbar.Extension />
 * </QuToolbar>
 * ```
 */
export const QuToolbar = Object.assign(Root, {
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
