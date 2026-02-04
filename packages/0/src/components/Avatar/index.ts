export { default as AvatarFallback } from './AvatarFallback.vue'
export { default as AvatarImage } from './AvatarImage.vue'
export { provideAvatarRoot, useAvatarRoot } from './AvatarRoot.vue'

export { default as AvatarRoot } from './AvatarRoot.vue'

export type { AvatarFallbackProps, AvatarFallbackSlotProps } from './AvatarFallback.vue'
export type { AvatarImageEmits, AvatarImageProps, AvatarImageSlotProps } from './AvatarImage.vue'
export type { AvatarContext, AvatarRootProps, AvatarTicket } from './AvatarRoot.vue'

// Components
import Fallback from './AvatarFallback.vue'
import Image from './AvatarImage.vue'
import Root from './AvatarRoot.vue'

/**
 * Avatar component with sub-components for building avatars.
 *
 * @see https://0.vuetifyjs.com/components/avatar
 */
export const Avatar = {
  /**
   * Root component for avatars.
   *
   * @see https://0.vuetifyjs.com/components/avatar
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
   * Component for displaying the avatar image.
   *
   * @see https://0.vuetifyjs.com/components/avatar#avatarimage
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Avatar } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Avatar.Image src="/avatar.jpg" alt="User avatar" />
   * </template>
   * ```
   */
  Image,
  /**
   * Component for displaying fallback content when image fails to load.
   *
   * @see https://0.vuetifyjs.com/components/avatar#avatarfallback
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Avatar } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Avatar.Fallback>
   *     JD
   *   </Avatar.Fallback>
   * </template>
   * ```
   */
  Fallback,
}
