export type { Md1ToggleButtonsContext, Md1ToggleButtonsProps } from './Md1ToggleButtons.vue'
export type { Md1ToggleButtonsItemProps } from './Md1ToggleButtonsItem.vue'
export { default as Md1ToggleButtonsItem } from './Md1ToggleButtonsItem.vue'

// Context
import Root from './Md1ToggleButtons.vue'
import Item from './Md1ToggleButtonsItem.vue'

/**
 * The Material Design 1 toggle button group: related options in one row,
 * selected exclusively or several at once. Owns the selection its items
 * render against; composes v0 `Toggle.Group` / `Toggle.Root`.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat name (`Md1ToggleButtonsItem`) remains exported and valid.
 *
 * @example
 * ```vue
 * <Md1ToggleButtons v-model="style" multiple>
 *   <Md1ToggleButtons.Item value="bold">Bold</Md1ToggleButtons.Item>
 *
 *   <Md1ToggleButtons.Item value="italic">Italic</Md1ToggleButtons.Item>
 *
 *   <Md1ToggleButtons.Item value="underline">Underline</Md1ToggleButtons.Item>
 * </Md1ToggleButtons>
 * ```
 */
export const Md1ToggleButtons = Object.assign(Root, {
  /** One option: text, a glyph, or both; `value` is its selection key. */
  Item,
})
