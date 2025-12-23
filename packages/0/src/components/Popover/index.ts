export { default as PopoverAnchor } from './PopoverAnchor.vue'
export { default as PopoverContent } from './PopoverContent.vue'
export { providePopoverContext, usePopoverContext } from './PopoverRoot.vue'
export { default as PopoverRoot } from './PopoverRoot.vue'
export type { PopoverAnchorProps, PopoverAnchorSlotProps } from './PopoverAnchor.vue'
export type { PopoverContentEmits, PopoverContentProps, PopoverContentSlotProps } from './PopoverContent.vue'
export type { PopoverContext, PopoverRootProps, PopoverRootSlotProps } from './PopoverRoot.vue'

// Components
import Anchor from './PopoverAnchor.vue'
import Content from './PopoverContent.vue'
import Root from './PopoverRoot.vue'

/**
 * Popover component with sub-components for building popovers.
 *
 * @see https://0.vuetifyjs.com/components/popover
 */
export const Popover = {
  /**
   * Root component for popovers.
   *
   * @see https://0.vuetifyjs.com/components/popover
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Popover } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Popover.Root>
   *     <Popover.Anchor>
   *       Click to toggle
   *     </Popover.Anchor>
   *
   *     <Popover.Content>
   *       Popover content goes here.
   *     </Popover.Content>
   *   </Popover.Root>
   * </template>
   * ```
   */
  Root,
  /**
   * Component for the anchor/trigger of a popover.
   *
   * @see https://0.vuetifyjs.com/components/popover#popoveranchor
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Popover } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Popover.Anchor>
   *     Click to toggle
   *   </Popover.Anchor>
   * </template>
   * ```
   */
  Anchor,
  /**
   * Component for the content section of a popover.
   *
   * @see https://0.vuetifyjs.com/components/popover#popovercontent
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Popover } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Popover.Content>
   *     Popover content goes here.
   *   </Popover.Content>
   * </template>
   * ```
   */
  Content,
}
