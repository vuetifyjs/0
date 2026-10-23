export type { Md1NavigationDrawerContext, Md1NavigationDrawerSide, Md1NavigationDrawerType } from './context'
export { useMd1NavigationDrawer } from './context'
export type { Md1NavigationDrawerProps, Md1NavigationDrawerSlotProps } from './Md1NavigationDrawer.vue'
export type { Md1NavigationDrawerActivatorSlotProps } from './Md1NavigationDrawerActivator.vue'
export { default as Md1NavigationDrawerActivator } from './Md1NavigationDrawerActivator.vue'
export { default as Md1NavigationDrawerContent } from './Md1NavigationDrawerContent.vue'
export type { Md1NavigationDrawerHeaderProps } from './Md1NavigationDrawerHeader.vue'
export { default as Md1NavigationDrawerHeader } from './Md1NavigationDrawerHeader.vue'

// Context
import Root from './Md1NavigationDrawer.vue'
import Activator from './Md1NavigationDrawerActivator.vue'
import Content from './Md1NavigationDrawerContent.vue'
import Header from './Md1NavigationDrawerHeader.vue'

/**
 * The Material Design 1 navigation drawer: temporary on a native `<dialog>`
 * at 16 dp over the scrim (v0 `Dialog`), persistent, mini and permanent as a
 * `<nav>` landmark beside the content (v0 `Atom`). The root owns `v-model`
 * (open) and provides the `md1:navigation-drawer` context its parts read.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`Md1NavigationDrawerHeader`) remain exported and valid.
 *
 * @example
 * ```vue
 * <Md1NavigationDrawer v-model="open">
 *   <Md1NavigationDrawer.Activator v-slot="{ attrs }">
 *     <Md1Button v-bind="attrs" aria-label="Menu" icon="menu" />
 *   </Md1NavigationDrawer.Activator>
 *
 *   <Md1NavigationDrawer.Header email="ada@example.com" name="Ada Lovelace" />
 *
 *   <Md1NavigationDrawer.Content>
 *     <Md1List v-model="page">
 *       <Md1List.Item href="/inbox" value="inbox">
 *         <Md1List.Icon name="inbox" />
 *
 *         Inbox
 *       </Md1List.Item>
 *     </Md1List>
 *   </Md1NavigationDrawer.Content>
 * </Md1NavigationDrawer>
 * ```
 */
export const Md1NavigationDrawer = Object.assign(Root, {
  /** Renderless trigger host: spread its `attrs` slot prop onto an `Md1Button`. A direct child of the root. */
  Activator,
  /** The 16:9 account area: avatar, name and email on the primary fill or an image. */
  Header,
  /** The destinations: `Md1List`, `Md1Subheader` and `Md1Divider`; choosing one closes a temporary drawer. */
  Content,
})
