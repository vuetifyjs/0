export type { BListGroupContext, BListGroupProps } from './BListGroup.vue'
export type { BListGroupItemProps } from '../BListGroupItem/BListGroupItem.vue'

// Context
import Root from './BListGroup.vue'

import Item from '../BListGroupItem/BListGroupItem.vue'

/**
 * Bootstrap 6 list group. Presentational `active`, or `selectable` with a `v-model` id.
 *
 * Canon: `flush`, `horizontal`, and `numbered` map to the pin's classes. `numbered` renders `ol`. Action items are `button` or `a`. The `md:list-group-horizontal` sample is a consumer class.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { shallowRef } from 'vue'
 *   import { BListGroup } from '@paper/bootstrap'
 *
 *   const current = shallowRef('a')
 * </script>
 *
 * <template>
 *   <BListGroup v-model="current" as="div" selectable>
 *     <BListGroup.Item action value="a">First</BListGroup.Item>
 *     <BListGroup.Item action value="b">Second</BListGroup.Item>
 *   </BListGroup>
 * </template>
 * ```
 */
export const BListGroup = Object.assign(Root, {
  /** `li.list-group-item`, or an action `button` / `a`. */
  Item,
})
