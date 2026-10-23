export type { QuNavigationDrawerContext, QuNavigationDrawerSide, QuNavigationDrawerType } from './context'
export { useQuNavigationDrawer } from './context'
export type { QuNavigationDrawerProps, QuNavigationDrawerSlotProps } from './QuNavigationDrawer.vue'
export type { QuNavigationDrawerActivatorSlotProps } from './QuNavigationDrawerActivator.vue'
export { default as QuNavigationDrawerActivator } from './QuNavigationDrawerActivator.vue'
export { default as QuNavigationDrawerContent } from './QuNavigationDrawerContent.vue'
export type { QuNavigationDrawerHeaderProps } from './QuNavigationDrawerHeader.vue'
export { default as QuNavigationDrawerHeader } from './QuNavigationDrawerHeader.vue'

// Context
import Root from './QuNavigationDrawer.vue'
import Activator from './QuNavigationDrawerActivator.vue'
import Content from './QuNavigationDrawerContent.vue'
import Header from './QuNavigationDrawerHeader.vue'

/**
 * The Material Design 1 navigation drawer: temporary on a native `<dialog>`
 * at 16 dp over the scrim (v0 `Dialog`), persistent, mini and permanent as a
 * `<nav>` landmark beside the content (v0 `Atom`). The root owns `v-model`
 * (open) and provides the `quantum:navigation-drawer` context its parts read.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`QuNavigationDrawerHeader`) remain exported and valid.
 *
 * @example
 * ```vue
 * <QuNavigationDrawer v-model="open">
 *   <QuNavigationDrawer.Activator v-slot="{ attrs }">
 *     <QuButton v-bind="attrs" aria-label="Menu" icon="menu" />
 *   </QuNavigationDrawer.Activator>
 *
 *   <QuNavigationDrawer.Header email="ada@example.com" name="Ada Lovelace" />
 *
 *   <QuNavigationDrawer.Content>
 *     <QuList v-model="page">
 *       <QuList.Item href="/inbox" value="inbox">
 *         <QuList.Icon name="inbox" />
 *
 *         Inbox
 *       </QuList.Item>
 *     </QuList>
 *   </QuNavigationDrawer.Content>
 * </QuNavigationDrawer>
 * ```
 */
export const QuNavigationDrawer = Object.assign(Root, {
  /** Renderless trigger host: spread its `attrs` slot prop onto a `QuButton`. A direct child of the root. */
  Activator,
  /** The 16:9 account area: avatar, name and email on the primary fill or an image. */
  Header,
  /** The destinations: `QuList`, `QuSubheader` and `QuDivider`; choosing one closes a temporary drawer. */
  Content,
})
