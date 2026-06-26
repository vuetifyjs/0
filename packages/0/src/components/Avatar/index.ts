export { default as AvatarFallback } from './AvatarFallback.vue'
export { default as AvatarGroup } from './AvatarGroup.vue'
export { default as AvatarImage } from './AvatarImage.vue'
export { default as AvatarIndicator } from './AvatarIndicator.vue'
export { provideAvatarGroup, useAvatarGroup } from './AvatarGroup.vue'
export { provideAvatarRoot, useAvatarRoot } from './AvatarRoot.vue'

export { default as AvatarRoot } from './AvatarRoot.vue'

export type { AvatarFallbackProps, AvatarFallbackSlotProps } from './AvatarFallback.vue'
export type {
  AvatarGroupContext,
  AvatarGroupPriority,
  AvatarGroupProps,
  AvatarGroupSlotProps,
  AvatarGroupTicket,
  AvatarGroupTicketInput,
} from './AvatarGroup.vue'
export type { AvatarImageEmits, AvatarImageProps, AvatarImageSlotProps } from './AvatarImage.vue'
export type { AvatarIndicatorProps, AvatarIndicatorSlotProps } from './AvatarIndicator.vue'
export type { AvatarContext, AvatarRootProps, AvatarRootSlotProps, AvatarTicket } from './AvatarRoot.vue'

// Context
import Fallback from './AvatarFallback.vue'
import Group from './AvatarGroup.vue'
import Image from './AvatarImage.vue'
import Indicator from './AvatarIndicator.vue'
import Root from './AvatarRoot.vue'

/**
 * Avatar component with sub-components for building avatars.
 *
 * @see https://0.vuetifyjs.com/components/semantic/avatar
 */
export const Avatar = {
  /**
   * Root component for avatars.
   *
   * @see https://0.vuetifyjs.com/components/semantic/avatar
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Avatar } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Avatar.Root>
   *     <Avatar.Image src="/avatar.jpg" />
   *
   *     <Avatar.Fallback>JD</Avatar.Fallback>
   *   </Avatar.Root>
   * </template>
   * ```
   */
  Root,
  /**
   * Image inside an Avatar.Root. Registers with the avatar's image
   * selection and shows when loaded.
   *
   * @see https://0.vuetifyjs.com/components/semantic/avatar
   */
  Image,
  /**
   * Fallback content when no image is loaded.
   *
   * @see https://0.vuetifyjs.com/components/semantic/avatar
   */
  Fallback,
  /**
   * Group container for stacked / collapsing avatars. Owns the visibility
   * math driven by `max` and (optionally) width-based truncation.
   *
   * @see https://0.vuetifyjs.com/components/semantic/avatar
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Avatar } from '@vuetify/v0'
   *   const users = [{ id: 1, initials: 'JD' }, { id: 2, initials: 'KW' }]
   * </script>
   *
   * <template>
   *   <Avatar.Group :max="4">
   *     <Avatar.Root v-for="u in users" :key="u.id" :value="u.id">
   *       <Avatar.Fallback>{{ u.initials }}</Avatar.Fallback>
   *     </Avatar.Root>
   *
   *     <Avatar.Indicator v-slot="{ count }">
   *       +{{ count }}
   *     </Avatar.Indicator>
   *   </Avatar.Group>
   * </template>
   * ```
   */
  Group,
  /**
   * Overflow indicator for Avatar.Group. Renders only when items are
   * hidden. Slot receives the hidden count and hidden tickets.
   *
   * @see https://0.vuetifyjs.com/components/semantic/avatar
   */
  Indicator,
}
