export type { QuListContext, QuListItemContext, QuListLines, QuListSelect } from './context'
export type { QuListProps } from './QuList.vue'
export { default as QuListAction } from './QuListAction.vue'
export type { QuListAvatarProps } from './QuListAvatar.vue'
export { default as QuListAvatar } from './QuListAvatar.vue'
export { default as QuListContent } from './QuListContent.vue'
export type { QuListGroupProps } from './QuListGroup.vue'
export { default as QuListGroup } from './QuListGroup.vue'
export type { QuListIconProps } from './QuListIcon.vue'
export { default as QuListIcon } from './QuListIcon.vue'
export type { QuListItemProps } from './QuListItem.vue'
export { default as QuListItem } from './QuListItem.vue'
export { default as QuListPrimary } from './QuListPrimary.vue'
export { default as QuListSecondary } from './QuListSecondary.vue'

// Context
import Root from './QuList.vue'
import Action from './QuListAction.vue'
import Avatar from './QuListAvatar.vue'
import Content from './QuListContent.vue'
import Group from './QuListGroup.vue'
import Icon from './QuListIcon.vue'
import Item from './QuListItem.vue'
import Primary from './QuListPrimary.vue'
import Secondary from './QuListSecondary.vue'

/**
 * The Material Design 1 list: one continuous column of one-, two- and
 * three-line tiles at 48, 72 and 88 dp (40, 60 and 76 dp dense), with the
 * avatar or icon at the 16 dp edge and the text on the 72 dp keyline. Under
 * `select="single" | "multiple"` it is a listbox with the selection pattern's
 * selected state, built on v0 `createSelection` and `useRovingFocus`; `Group`
 * is a v0 `Collapsible`.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`QuListItem`) remain exported and valid.
 *
 * @example
 * ```vue
 * <QuList>
 *   <QuList.Item value="inbox">
 *     <QuList.Avatar />
 *
 *     <QuList.Icon name="inbox" />
 *
 *     <QuList.Content>
 *       <QuList.Primary />
 *
 *       <QuList.Secondary />
 *     </QuList.Content>
 *
 *     <QuList.Action />
 *   </QuList.Item>
 *
 *   <QuList.Group title="Folders">
 *     <QuList.Item />
 *   </QuList.Group>
 * </QuList>
 * ```
 */
export const QuList = Object.assign(Root, {
  /** One row: the tile is the primary action (a link, a button or an option). */
  Item,
  /** The 40 dp circle at the 16 dp edge: an image, or a fill for an icon or initials. */
  Avatar,
  /** A 24 dp glyph at the 16 dp edge. */
  Icon,
  /** The text column on the 72 dp keyline. */
  Content,
  /** The first line: Regular 16 sp (15 sp desktop, 13 sp dense). */
  Primary,
  /** The second line, or two lines in a three-line tile: Regular 14 sp in the secondary ink. */
  Secondary,
  /** The 56 dp column at the end: a secondary action control or Caption info, a separate target from the tile. */
  Action,
  /** An expandable header whose items nest beneath it, indented to the content keyline. */
  Group,
})
