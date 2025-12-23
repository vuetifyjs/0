export { default as SingleItem } from './SingleItem.vue'
export { provideSingleRoot, useSingleRoot } from './SingleRoot.vue'

export { default as SingleRoot } from './SingleRoot.vue'

export type { SingleItemProps, SingleItemSlotProps } from './SingleItem.vue'
export type { SingleRootProps, SingleRootSlotProps } from './SingleRoot.vue'

// Components
import Item from './SingleItem.vue'
import Root from './SingleRoot.vue'

/**
 * Single component with sub-components for building single-selection interfaces.
 *
 * @see https://0.vuetifyjs.com/components/single
 */
export const Single = {
  /**
   * Root component for single-selection. Only one item can be selected at a time.
   *
   * @see https://0.vuetifyjs.com/components/single#singleroot
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Single } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Single.Root v-model="selected">
   *     <Single.Item value="option1">
   *       Option 1
   *     </Single.Item>
   *
   *     <Single.Item value="option2">
   *       Option 2
   *     </Single.Item>
   *   </Single.Root>
   * </template>
   * ```
   */
  Root,
  /**
   * Component representing a selectable item within Single.Root.
   *
   * @see https://0.vuetifyjs.com/components/single#singleitem
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Single } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Single.Item value="option1" #default="{ isSelected }">
   *     <div :class="{ selected: isSelected }">
   *       Option 1
   *     </div>
   *   </Single.Item>
   * </template>
   * ```
   */
  Item,
}
