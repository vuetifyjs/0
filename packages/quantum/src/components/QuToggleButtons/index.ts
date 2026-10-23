export type { QuToggleButtonsContext, QuToggleButtonsProps } from './QuToggleButtons.vue'
export type { QuToggleButtonsItemProps } from './QuToggleButtonsItem.vue'
export { default as QuToggleButtonsItem } from './QuToggleButtonsItem.vue'

// Context
import Root from './QuToggleButtons.vue'
import Item from './QuToggleButtonsItem.vue'

/**
 * The Material Design 1 toggle button group: related options in one row,
 * selected exclusively or several at once. Owns the selection its items
 * render against; composes v0 `Toggle.Group` / `Toggle.Root`.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat name (`QuToggleButtonsItem`) remains exported and valid.
 *
 * @example
 * ```vue
 * <QuToggleButtons v-model="style" multiple>
 *   <QuToggleButtons.Item value="bold">Bold</QuToggleButtons.Item>
 *
 *   <QuToggleButtons.Item value="italic">Italic</QuToggleButtons.Item>
 *
 *   <QuToggleButtons.Item value="underline">Underline</QuToggleButtons.Item>
 * </QuToggleButtons>
 * ```
 */
export const QuToggleButtons = Object.assign(Root, {
  /** One option: text, a glyph, or both; `value` is its selection key. */
  Item,
})
