export type { Md1MenuContext, Md1MenuProps, Md1MenuSlotProps } from './Md1Menu.vue'
export { useMd1Menu } from './Md1Menu.vue'
export type { Md1MenuActivatorProps, Md1MenuActivatorSlotProps } from './Md1MenuActivator.vue'
export { default as Md1MenuActivator } from './Md1MenuActivator.vue'
export type { Md1MenuCheckItemProps } from './Md1MenuCheckItem.vue'
export { default as Md1MenuCheckItem } from './Md1MenuCheckItem.vue'
export type { Md1MenuContentProps } from './Md1MenuContent.vue'
export { default as Md1MenuContent } from './Md1MenuContent.vue'
export { default as Md1MenuDivider } from './Md1MenuDivider.vue'
export type { Md1MenuItemProps } from './Md1MenuItem.vue'
export { default as Md1MenuItem } from './Md1MenuItem.vue'
export type { Md1MenuSubProps } from './Md1MenuSub.vue'
export { default as Md1MenuSub } from './Md1MenuSub.vue'
export { default as Md1MenuSubheader } from './Md1MenuSubheader.vue'

// Context
import Root from './Md1Menu.vue'
import Activator from './Md1MenuActivator.vue'
import CheckItem from './Md1MenuCheckItem.vue'
import Content from './Md1MenuContent.vue'
import Divider from './Md1MenuDivider.vue'
import Item from './Md1MenuItem.vue'
import Sub from './Md1MenuSub.vue'
import Subheader from './Md1MenuSubheader.vue'

/**
 * The Material Design 1 menu: a transient 8 dp sheet of choices emitted by a
 * button, in the handset, dense and desktop metrics, with the cascading sub
 * menu of the desktop page. Composes v0's `Menu` compound for the keyboard
 * model, roving focus, typeahead, light dismiss and anchored placement.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`Md1MenuItem`) remain exported and valid.
 *
 * @example
 * ```vue
 * <Md1Menu v-model="open">
 *   <Md1Menu.Activator v-slot="{ attrs }">
 *     <Md1Button v-bind="attrs" aria-label="More options" icon="more-vert" />
 *   </Md1Menu.Activator>
 *
 *   <Md1Menu.Content>
 *     <Md1Menu.Subheader>Edit</Md1Menu.Subheader>
 *
 *     <Md1Menu.Item icon="refresh" info="Ctrl+R">Refresh</Md1Menu.Item>
 *
 *     <Md1Menu.CheckItem v-model:checked="wrap">Wrap text</Md1Menu.CheckItem>
 *
 *     <Md1Menu.Divider />
 *
 *     <Md1Menu.Sub label="Share">
 *       <Md1Menu.Item>Email</Md1Menu.Item>
 *     </Md1Menu.Sub>
 *   </Md1Menu.Content>
 * </Md1Menu>
 * ```
 */
export const Md1Menu = Object.assign(Root, {
  /** Renderless trigger host: spread `attrs` onto the emitting Md1Button. */
  Activator,
  /** The 8 dp sheet, snapped to the 56 dp (64 px desktop) width unit. */
  Content,
  /** One choice on one line, with an optional leading glyph and trailing inline information. */
  Item,
  /** A multi-select item: the check glyph in the leading slot; choosing it keeps the menu open. */
  CheckItem,
  /** A full-width rule between groups, 8 dp above and below. */
  Divider,
  /** A 48 dp group title in Body 2 at the secondary ink. */
  Subheader,
  /** The cascading sub menu: a parent row with the trailing triangle and its own 9 dp sheet. */
  Sub,
})
