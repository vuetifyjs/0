export type { QuSearchBarContext, QuSearchBarProps } from './QuSearchBar.vue'
export type { QuSearchBarEmptySlotProps } from './QuSearchBarEmpty.vue'
export { default as QuSearchBarEmpty } from './QuSearchBarEmpty.vue'
export type { QuSearchBarItemProps } from './QuSearchBarItem.vue'
export { default as QuSearchBarItem } from './QuSearchBarItem.vue'

// Context
import Root from './QuSearchBar.vue'
import Empty from './QuSearchBarEmpty.vue'
import Item from './QuSearchBarItem.vue'

/**
 * The Material Design 1 persistent search bar: a raised 48 dp inset box with
 * the search glyph that turns into the up arrow on focus, the clear and voice
 * actions, recent queries on focus and completions as the user types, and the
 * desktop Search button. Composes v0 `Combobox.*` through Quantum's `useSearch`
 * (the core `QuToolbar.Search` shares), drawn with QuTextField's solo values.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`QuSearchBarItem`, `QuSearchBarEmpty`) remain
 * exported and valid.
 *
 * @example
 * ```vue
 * <QuSearchBar v-model="query" @submit="onSearch">
 *   <QuSearchBar.Item v-for="item in recent" :key="item" history :value="item" />
 *
 *   <QuSearchBar.Item v-for="item in completions" :key="item" :value="item" />
 *
 *   <QuSearchBar.Empty />
 * </QuSearchBar>
 * ```
 */
export const QuSearchBar = Object.assign(Root, {
  /** One suggestion: a 48 dp row, a recent query under `history` or a completion. */
  Item,
  /** The row shown when nothing matches what was typed. */
  Empty,
})
