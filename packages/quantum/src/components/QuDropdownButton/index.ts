export type {
  QuDropdownButtonContext,
  QuDropdownButtonItemInput,
  QuDropdownButtonItemTicket,
  QuDropdownButtonProps,
} from './QuDropdownButton.vue'
export type { QuDropdownButtonItemProps } from './QuDropdownButtonItem.vue'
export { default as QuDropdownButtonItem } from './QuDropdownButtonItem.vue'

// Context
import Root from './QuDropdownButton.vue'
import Item from './QuDropdownButtonItem.vue'

/**
 * The Material Design 1 dropdown button: a flat button showing the current
 * state and a down arrow, whose menu covers it and lists the states. Plain,
 * segmented (the state fires its action, the arrow opens the options),
 * dense and desktop forms. Composes v0 `Menu.Root` / `Menu.Activator` /
 * `Menu.Content` / `Menu.RadioGroup`, and `Button.Root` for the segmented state.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat name (`QuDropdownButtonItem`) remains exported and valid.
 *
 * @example
 * ```vue
 * <QuDropdownButton v-model="style">
 *   <QuDropdownButton.Item value="normal">Normal text</QuDropdownButton.Item>
 *
 *   <QuDropdownButton.Item value="title">Title</QuDropdownButton.Item>
 * </QuDropdownButton>
 * ```
 */
export const QuDropdownButton = Object.assign(Root, {
  /** One state: a `Menu.RadioItem`, checked while it is the current state; `value` is its model value. */
  Item,
})
