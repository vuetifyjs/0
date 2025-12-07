export type { SelectionItemProps, SelectionItemSlotProps } from './SelectionItem.vue'
export { default as SelectionItem } from './SelectionItem.vue'
export type { SelectionRootProps, SelectionRootSlotProps } from './SelectionRoot.vue'

export { provideSelectionRoot, useSelectionRoot } from './SelectionRoot.vue'
export { default as SelectionRoot } from './SelectionRoot.vue'

import Root from './SelectionRoot.vue'
import Item from './SelectionItem.vue'

export const Selection = {
  Root,
  Item,
}
