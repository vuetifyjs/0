export type { GroupItemProps, GroupItemSlotProps } from './GroupItem.vue'
export { default as GroupItem } from './GroupItem.vue'

export type { GroupRootProps, GroupRootSlotProps } from './GroupRoot.vue'

export { provideGroupRoot, useGroupRoot } from './GroupRoot.vue'
export { default as GroupRoot } from './GroupRoot.vue'

import Root from './GroupRoot.vue'
import Item from './GroupItem.vue'

export const Group = {
  /**
   * Root component for multi-selection groups.
   *
   * @see https://0.vuetifyjs.com/components/group
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Group } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Group.Root v-model="selected">
   *     <Group.Item value="a">Option A</Group.Item>
   *     <Group.Item value="b">Option B</Group.Item>
   *   </Group.Root>
   * </template>
   * ```
   */
  Root,
  /**
   * Item component for multi-selection groups.
   *
   * @see https://0.vuetifyjs.com/components/group#groupitem
   */
  Item,
}
