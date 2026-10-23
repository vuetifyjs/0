export type { QuAutocompleteProps } from './QuAutocomplete.vue'
export type { QuAutocompleteContext } from './context'
export type { QuAutocompleteEmptySlotProps } from './QuAutocompleteEmpty.vue'
export { default as QuAutocompleteEmpty } from './QuAutocompleteEmpty.vue'
export type { QuAutocompleteItemProps } from './QuAutocompleteItem.vue'
export { default as QuAutocompleteItem } from './QuAutocompleteItem.vue'

// Context
import Root from './QuAutocomplete.vue'
import Empty from './QuAutocompleteEmpty.vue'
import Item from './QuAutocompleteItem.vue'

/**
 * The Material Design 1 auto-complete text field: suggestions under the field
 * as the user types, or completed in-line to the right of the cursor, with
 * free text or a strict choice and contact chips for several values. Composes
 * v0 `Combobox.*` inside QuTextField's anatomy, and `QuChip` under `multiple`.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`QuAutocompleteItem`, `QuAutocompleteEmpty`)
 * remain exported and valid.
 *
 * @example
 * ```vue
 * <QuAutocomplete v-model="fruit" label="Fruit" strict>
 *   <QuAutocomplete.Item v-for="item in fruits" :key="item" :value="item" />
 *
 *   <QuAutocomplete.Empty />
 * </QuAutocomplete>
 * ```
 */
export const QuAutocomplete = Object.assign(Root, {
  /** One suggestion: a 48 dp row in the list. */
  Item,
  /** The row shown when nothing matches what was typed. */
  Empty,
})
