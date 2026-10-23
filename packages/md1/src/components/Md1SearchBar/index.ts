export type { Md1SearchBarContext, Md1SearchBarProps } from './Md1SearchBar.vue'
export type { Md1SearchBarEmptySlotProps } from './Md1SearchBarEmpty.vue'
export { default as Md1SearchBarEmpty } from './Md1SearchBarEmpty.vue'
export type { Md1SearchBarItemProps } from './Md1SearchBarItem.vue'
export { default as Md1SearchBarItem } from './Md1SearchBarItem.vue'

// Context
import Root from './Md1SearchBar.vue'
import Empty from './Md1SearchBarEmpty.vue'
import Item from './Md1SearchBarItem.vue'

/**
 * The Material Design 1 persistent search bar: a raised 48 dp inset box with
 * the search glyph that turns into the up arrow on focus, the clear and voice
 * actions, recent queries on focus and completions as the user types, and the
 * desktop Search button. Composes v0 `Combobox.*` through MD1's `useSearch`
 * (the core `Md1Toolbar.Search` shares), drawn with Md1TextField's solo values.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`Md1SearchBarItem`, `Md1SearchBarEmpty`) remain
 * exported and valid.
 *
 * @example
 * ```vue
 * <Md1SearchBar v-model="query" @submit="onSearch">
 *   <Md1SearchBar.Item v-for="item in recent" :key="item" history :value="item" />
 *
 *   <Md1SearchBar.Item v-for="item in completions" :key="item" :value="item" />
 *
 *   <Md1SearchBar.Empty />
 * </Md1SearchBar>
 * ```
 */
export const Md1SearchBar = Object.assign(Root, {
  /** One suggestion: a 48 dp row, a recent query under `history` or a completion. */
  Item,
  /** The row shown when nothing matches what was typed. */
  Empty,
})
