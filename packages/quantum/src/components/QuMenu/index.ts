export type { QuMenuContext, QuMenuProps, QuMenuSlotProps } from './QuMenu.vue'
export { useQuMenu } from './QuMenu.vue'
export type { QuMenuActivatorProps, QuMenuActivatorSlotProps } from './QuMenuActivator.vue'
export { default as QuMenuActivator } from './QuMenuActivator.vue'
export type { QuMenuCheckItemProps } from './QuMenuCheckItem.vue'
export { default as QuMenuCheckItem } from './QuMenuCheckItem.vue'
export type { QuMenuContentProps } from './QuMenuContent.vue'
export { default as QuMenuContent } from './QuMenuContent.vue'
export { default as QuMenuDivider } from './QuMenuDivider.vue'
export type { QuMenuItemProps } from './QuMenuItem.vue'
export { default as QuMenuItem } from './QuMenuItem.vue'
export type { QuMenuSubProps } from './QuMenuSub.vue'
export { default as QuMenuSub } from './QuMenuSub.vue'
export { default as QuMenuSubheader } from './QuMenuSubheader.vue'

// Context
import Root from './QuMenu.vue'
import Activator from './QuMenuActivator.vue'
import CheckItem from './QuMenuCheckItem.vue'
import Content from './QuMenuContent.vue'
import Divider from './QuMenuDivider.vue'
import Item from './QuMenuItem.vue'
import Sub from './QuMenuSub.vue'
import Subheader from './QuMenuSubheader.vue'

/**
 * The Material Design 1 menu: a transient 8 dp sheet of choices emitted by a
 * button, in the handset, dense and desktop metrics, with the cascading sub
 * menu of the desktop page. Composes v0's `Menu` compound for the keyboard
 * model, roving focus, typeahead, light dismiss and anchored placement.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`QuMenuItem`) remain exported and valid.
 *
 * @example
 * ```vue
 * <QuMenu v-model="open">
 *   <QuMenu.Activator v-slot="{ attrs }">
 *     <QuButton v-bind="attrs" aria-label="More options" icon="more-vert" />
 *   </QuMenu.Activator>
 *
 *   <QuMenu.Content>
 *     <QuMenu.Subheader>Edit</QuMenu.Subheader>
 *
 *     <QuMenu.Item icon="refresh" info="Ctrl+R">Refresh</QuMenu.Item>
 *
 *     <QuMenu.CheckItem v-model:checked="wrap">Wrap text</QuMenu.CheckItem>
 *
 *     <QuMenu.Divider />
 *
 *     <QuMenu.Sub label="Share">
 *       <QuMenu.Item>Email</QuMenu.Item>
 *     </QuMenu.Sub>
 *   </QuMenu.Content>
 * </QuMenu>
 * ```
 */
export const QuMenu = Object.assign(Root, {
  /** Renderless trigger host: spread `attrs` onto the emitting QuButton. */
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
