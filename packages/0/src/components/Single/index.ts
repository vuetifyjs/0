export type { SingleItemProps, SingleItemSlotProps } from './SingleItem.vue'
export { default as SingleItem } from './SingleItem.vue'

export type { SingleRootProps, SingleRootSlotProps } from './SingleRoot.vue'

export { provideSingleRoot, useSingleRoot } from './SingleRoot.vue'
export { default as SingleRoot } from './SingleRoot.vue'

import Root from './SingleRoot.vue'
import Item from './SingleItem.vue'

export const Single = {
  Root,
  Item,
}
