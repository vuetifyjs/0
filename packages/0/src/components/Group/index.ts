export type { GroupItemProps, GroupItemSlotProps } from './GroupItem.vue'
export { default as GroupItem } from './GroupItem.vue'

export type { GroupRootProps, GroupRootSlotProps } from './GroupRoot.vue'

export { provideGroupRoot, useGroupRoot } from './GroupRoot.vue'
export { default as GroupRoot } from './GroupRoot.vue'

import Root from './GroupRoot.vue'
import Item from './GroupItem.vue'

export const Group = {
  Root,
  Item,
}
