export type {
  Md1TextFieldContext,
  Md1TextFieldCounter,
  Md1TextFieldPicker,
  Md1TextFieldProps,
  Md1TextFieldSlotProps,
} from './Md1TextField.vue'
export type { Md1TextFieldItemProps } from './Md1TextFieldItem.vue'
export { default as Md1TextFieldItem } from './Md1TextFieldItem.vue'

// Context
import Root from './Md1TextField.vue'
import Item from './Md1TextFieldItem.vue'

/**
 * The Material Design 1 text field: single-line, multi-line, text area, box,
 * dense, full-width and solo, with the dropdown and nested pickers. Composes v0
 * `Input` (and `Select` under `dropdown`), `Button.Root` for the clear,
 * visibility, voice and picker glyphs, and `Md1Dialog` for the picker.
 *
 * A shell everywhere but under `dropdown`, where `Item` children fill the menu.
 * The flat name (`Md1TextFieldItem`) remains exported and valid.
 *
 * @example
 * ```vue
 * <Md1TextField v-model="name" label="Name" helper="As it appears on your card" />
 *
 * <Md1TextField v-model="size" dropdown label="Size">
 *   <Md1TextField.Item value="Small" />
 *   <Md1TextField.Item value="Large" />
 * </Md1TextField>
 * ```
 */
export const Md1TextField = Object.assign(Root, {
  /** One option of a dropdown field: a 48 dp row in the menu. */
  Item,
})
