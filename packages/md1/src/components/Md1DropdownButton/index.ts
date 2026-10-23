export type {
  Md1DropdownButtonContext,
  Md1DropdownButtonItemInput,
  Md1DropdownButtonItemTicket,
  Md1DropdownButtonProps,
} from './Md1DropdownButton.vue'
export type { Md1DropdownButtonItemProps } from './Md1DropdownButtonItem.vue'
export { default as Md1DropdownButtonItem } from './Md1DropdownButtonItem.vue'

// Context
import Root from './Md1DropdownButton.vue'
import Item from './Md1DropdownButtonItem.vue'

/**
 * The Material Design 1 dropdown button: a flat button showing the current
 * state and a down arrow, whose menu covers it and lists the states. Plain,
 * segmented (the state fires its action, the arrow opens the options),
 * dense and desktop forms. Composes v0 `Menu.Root` / `Menu.Activator` /
 * `Menu.Content` / `Menu.RadioGroup`, and `Button.Root` for the segmented state.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat name (`Md1DropdownButtonItem`) remains exported and valid.
 *
 * @example
 * ```vue
 * <Md1DropdownButton v-model="style">
 *   <Md1DropdownButton.Item value="normal">Normal text</Md1DropdownButton.Item>
 *
 *   <Md1DropdownButton.Item value="title">Title</Md1DropdownButton.Item>
 * </Md1DropdownButton>
 * ```
 */
export const Md1DropdownButton = Object.assign(Root, {
  /** One state: a `Menu.RadioItem`, checked while it is the current state; `value` is its model value. */
  Item,
})
