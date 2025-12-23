export { default as SelectionItem } from './SelectionItem.vue'
export { provideSelectionRoot, useSelectionRoot } from './SelectionRoot.vue'
export { default as SelectionRoot } from './SelectionRoot.vue'

export type { SelectionItemProps, SelectionItemSlotProps } from './SelectionItem.vue'
export type { SelectionRootProps, SelectionRootSlotProps } from './SelectionRoot.vue'

// Components
import Item from './SelectionItem.vue'
import Root from './SelectionRoot.vue'

/**
 * Selection component with sub-components for managing item selection state.
 *
 * @see https://0.vuetifyjs.com/components/selection
 */
export const Selection = {
  /**
   * Root component for selection contexts.
   *
   * @see https://0.vuetifyjs.com/components/selection#selectionroot
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Selection } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Selection.Root v-model="selected" multiple>
   *     <Selection.Item value="a" v-slot="{ attrs }">
   *       <button v-bind="attrs">Option A</button>
   *     </Selection.Item>
   *
   *     <Selection.Item value="b" v-slot="{ attrs }">
   *       <button v-bind="attrs">Option B</button>
   *     </Selection.Item>
   *   </Selection.Root>
   * </template>
   * ```
   */
  Root,
  /**
   * Item component for selection contexts.
   *
   * @see https://0.vuetifyjs.com/components/selection#selectionitem
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Selection } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Selection.Item value="a" v-slot="{ attrs }">
   *     <button v-bind="attrs">Option A</button>
   *   </Selection.Item>
   * </template>
   * ```
   */
  Item,
}
