export type { Md1ListContext, Md1ListItemContext, Md1ListLines, Md1ListSelect } from './context'
export type { Md1ListProps } from './Md1List.vue'
export { default as Md1ListAction } from './Md1ListAction.vue'
export type { Md1ListAvatarProps } from './Md1ListAvatar.vue'
export { default as Md1ListAvatar } from './Md1ListAvatar.vue'
export { default as Md1ListContent } from './Md1ListContent.vue'
export type { Md1ListGroupProps } from './Md1ListGroup.vue'
export { default as Md1ListGroup } from './Md1ListGroup.vue'
export type { Md1ListIconProps } from './Md1ListIcon.vue'
export { default as Md1ListIcon } from './Md1ListIcon.vue'
export type { Md1ListItemProps } from './Md1ListItem.vue'
export { default as Md1ListItem } from './Md1ListItem.vue'
export { default as Md1ListPrimary } from './Md1ListPrimary.vue'
export type { Md1ListReorderProps } from './Md1ListReorder.vue'
export { default as Md1ListReorder } from './Md1ListReorder.vue'
export { default as Md1ListSecondary } from './Md1ListSecondary.vue'

// Context
import Root from './Md1List.vue'
import Action from './Md1ListAction.vue'
import Avatar from './Md1ListAvatar.vue'
import Content from './Md1ListContent.vue'
import Group from './Md1ListGroup.vue'
import Icon from './Md1ListIcon.vue'
import Item from './Md1ListItem.vue'
import Primary from './Md1ListPrimary.vue'
import Reorder from './Md1ListReorder.vue'
import Secondary from './Md1ListSecondary.vue'

/**
 * The Material Design 1 list: one continuous column of one-, two- and
 * three-line tiles at 48, 72 and 88 dp (40, 60 and 76 dp dense), with the
 * avatar or icon at the 16 dp edge and the text on the 72 dp keyline. Under
 * `select="single" | "multiple"` it is a listbox with the selection pattern's
 * selected state, built on v0 `createSelection` and `useRovingFocus`; `Group`
 * is a v0 `Collapsible`.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`Md1ListItem`) remain exported and valid.
 *
 * @example
 * ```vue
 * <Md1List>
 *   <Md1List.Item value="inbox">
 *     <Md1List.Avatar />
 *
 *     <Md1List.Icon name="inbox" />
 *
 *     <Md1List.Content>
 *       <Md1List.Primary />
 *
 *       <Md1List.Secondary />
 *     </Md1List.Content>
 *
 *     <Md1List.Action />
 *   </Md1List.Item>
 *
 *   <Md1List.Group title="Folders">
 *     <Md1List.Item />
 *   </Md1List.Group>
 * </Md1List>
 * ```
 */
export const Md1List = Object.assign(Root, {
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
  /** The reorder handle in the secondary action column: drag it, or move the row with the arrow keys. Needs the root's `v-model:order`. */
  Reorder,
})
