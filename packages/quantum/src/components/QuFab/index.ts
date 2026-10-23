export type { QuFabContext, QuFabPosition, QuFabProps } from './QuFab.vue'
export type { QuFabActionProps } from './QuFabAction.vue'
export { default as QuFabAction } from './QuFabAction.vue'

// Context
import Root from './QuFab.vue'
import Action from './QuFabAction.vue'

/**
 * The Material Design 1 floating action button: a 56 dp circle (40 dp mini)
 * in the accent colour resting at 6 dp and lifting to 12 dp on press, fixed
 * at the keyline margin or attached to a seam. Composes v0 `Button.Root` and
 * `Button.Icon` around `QuIcon`; with `Action` children it becomes the speed
 * dial, a v0 `Menu.Root` whose activator is the FAB itself.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat name (`QuFabAction`) remains exported and valid.
 *
 * @example
 * ```vue
 * <QuFab aria-label="Compose" icon="edit" />
 *
 * <QuFab v-model="open" aria-label="Create" icon="add" @select="create">
 *   <QuFab.Action icon="email" label="Email" />
 *
 *   <QuFab.Action icon="event" label="Event" />
 * </QuFab>
 * ```
 */
export const QuFab = Object.assign(Root, {
  /** One speed dial action: a 40 dp mini FAB with its label at the start side. */
  Action,
})
