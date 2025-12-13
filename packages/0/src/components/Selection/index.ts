export type { SelectionItemProps, SelectionItemSlotProps } from './SelectionItem.vue'
export { default as SelectionItem } from './SelectionItem.vue'
export type { SelectionRootProps, SelectionRootSlotProps } from './SelectionRoot.vue'

export { provideSelectionRoot, useSelectionRoot } from './SelectionRoot.vue'
export { default as SelectionRoot } from './SelectionRoot.vue'

import Root from './SelectionRoot.vue'
import Item from './SelectionItem.vue'

/**
 * Selection compound component for managing item selection state.
 *
 * @see https://0.vuetifyjs.com/components/selection
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
 *     <Selection.Item value="b" v-slot="{ attrs }">
 *       <button v-bind="attrs">Option B</button>
 *     </Selection.Item>
 *   </Selection.Root>
 * </template>
 * ```
 */
export const Selection = {
  /**
   * Root component for selection contexts.
   *
   * @see https://0.vuetifyjs.com/components/selection#selectionroot
   */
  Root,
  /**
   * Item component for selection contexts.
   *
   * @see https://0.vuetifyjs.com/components/selection#selectionitem
   */
  Item,
}
