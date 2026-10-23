export type { Md1FabContext, Md1FabPosition, Md1FabProps } from './Md1Fab.vue'
export type { Md1FabActionProps } from './Md1FabAction.vue'
export { default as Md1FabAction } from './Md1FabAction.vue'

// Context
import Root from './Md1Fab.vue'
import Action from './Md1FabAction.vue'

/**
 * The Material Design 1 floating action button: a 56 dp circle (40 dp mini)
 * in the accent colour resting at 6 dp and lifting to 12 dp on press, fixed
 * at the keyline margin or attached to a seam. Composes v0 `Button.Root` and
 * `Button.Icon` around `Md1Icon`; with `Action` children it becomes the speed
 * dial, a v0 `Menu.Root` whose activator is the FAB itself.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat name (`Md1FabAction`) remains exported and valid.
 *
 * @example
 * ```vue
 * <Md1Fab aria-label="Compose" icon="edit" />
 *
 * <Md1Fab v-model="open" aria-label="Create" icon="add" @select="create">
 *   <Md1Fab.Action icon="email" label="Email" />
 *
 *   <Md1Fab.Action icon="event" label="Event" />
 * </Md1Fab>
 * ```
 */
export const Md1Fab = Object.assign(Root, {
  /** One speed dial action: a 40 dp mini FAB with its label at the start side. */
  Action,
})
