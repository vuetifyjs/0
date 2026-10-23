export type { Md1AutocompleteProps } from './Md1Autocomplete.vue'
export type { Md1AutocompleteContext } from './context'
export type { Md1AutocompleteEmptySlotProps } from './Md1AutocompleteEmpty.vue'
export { default as Md1AutocompleteEmpty } from './Md1AutocompleteEmpty.vue'
export type { Md1AutocompleteItemProps } from './Md1AutocompleteItem.vue'
export { default as Md1AutocompleteItem } from './Md1AutocompleteItem.vue'

// Context
import Root from './Md1Autocomplete.vue'
import Empty from './Md1AutocompleteEmpty.vue'
import Item from './Md1AutocompleteItem.vue'

/**
 * The Material Design 1 auto-complete text field: suggestions under the field
 * as the user types, or completed in-line to the right of the cursor, with
 * free text or a strict choice and contact chips for several values. Composes
 * v0 `Combobox.*` inside Md1TextField's anatomy, and `Md1Chip` under `multiple`.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`Md1AutocompleteItem`, `Md1AutocompleteEmpty`)
 * remain exported and valid.
 *
 * @example
 * ```vue
 * <Md1Autocomplete v-model="fruit" label="Fruit" strict>
 *   <Md1Autocomplete.Item v-for="item in fruits" :key="item" :value="item" />
 *
 *   <Md1Autocomplete.Empty />
 * </Md1Autocomplete>
 * ```
 */
export const Md1Autocomplete = Object.assign(Root, {
  /** One suggestion: a 48 dp row in the list. */
  Item,
  /** The row shown when nothing matches what was typed. */
  Empty,
})
