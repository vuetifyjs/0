export type { EmListItemProps } from './EmListItem.vue'
export { default as EmListItem } from './EmListItem.vue'
export { default as EmListItemContent } from './EmListItemContent.vue'
export { default as EmListItemMedia } from './EmListItemMedia.vue'
export { default as EmListItemMeta } from './EmListItemMeta.vue'
export { default as EmListItemSubtitle } from './EmListItemSubtitle.vue'
export { default as EmListItemTitle } from './EmListItemTitle.vue'
export type { EmListProps } from './EmList.vue'

// Context
import Root from './EmList.vue'
import Item from './EmListItem.vue'
import ItemContent from './EmListItemContent.vue'
import ItemMedia from './EmListItemMedia.vue'
import ItemMeta from './EmListItemMeta.vue'
import ItemSubtitle from './EmListItemSubtitle.vue'
import ItemTitle from './EmListItemTitle.vue'

/**
 * List container. Owns the density and divider rhythm its items inherit.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`EmListItem`) remain exported and valid.
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { EmList } from '@paper/emerald'
 * </script>
 *
 * <template>
 *   <EmList>
 *     <EmList.Item>
 *       <EmList.ItemMedia />
 *
 *       <EmList.ItemContent>
 *         <EmList.ItemTitle />
 *
 *         <EmList.ItemSubtitle />
 *       </EmList.ItemContent>
 *
 *       <EmList.ItemMeta />
 *     </EmList.Item>
 *   </EmList>
 * </template>
 * ```
 */
export const EmList = Object.assign(Root, {
  /** A single row. */
  Item,
  /** Leading slot for an avatar or icon. */
  ItemMedia,
  /** Text column between the media and the meta. */
  ItemContent,
  /** Primary line of the row. */
  ItemTitle,
  /** Secondary line of the row. */
  ItemSubtitle,
  /** Trailing slot for a value or action. */
  ItemMeta,
})
