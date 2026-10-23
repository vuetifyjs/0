export type {
  QuTextFieldContext,
  QuTextFieldCounter,
  QuTextFieldPicker,
  QuTextFieldProps,
  QuTextFieldSlotProps,
} from './QuTextField.vue'
export type { QuTextFieldItemProps } from './QuTextFieldItem.vue'
export { default as QuTextFieldItem } from './QuTextFieldItem.vue'

// Context
import Root from './QuTextField.vue'
import Item from './QuTextFieldItem.vue'

/**
 * The Material Design 1 text field: single-line, multi-line, text area, box,
 * dense, full-width and solo, with the dropdown and nested pickers. Composes v0
 * `Input` (and `Select` under `dropdown`), `Button.Root` for the clear,
 * visibility, voice and picker glyphs, and `QuDialog` for the picker.
 *
 * A shell everywhere but under `dropdown`, where `Item` children fill the menu.
 * The flat name (`QuTextFieldItem`) remains exported and valid.
 *
 * @example
 * ```vue
 * <QuTextField v-model="name" label="Name" helper="As it appears on your card" />
 *
 * <QuTextField v-model="size" dropdown label="Size">
 *   <QuTextField.Item value="Small" />
 *   <QuTextField.Item value="Large" />
 * </QuTextField>
 * ```
 */
export const QuTextField = Object.assign(Root, {
  /** One option of a dropdown field: a 48 dp row in the menu. */
  Item,
})
