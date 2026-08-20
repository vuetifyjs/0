export type { EmAvatarProps, EmAvatarSize } from './EmAvatar.vue'
export type { EmAvatarFallbackProps } from './EmAvatarFallback.vue'
export { default as EmAvatarFallback } from './EmAvatarFallback.vue'
export type { EmAvatarImageProps } from './EmAvatarImage.vue'
export { default as EmAvatarImage } from './EmAvatarImage.vue'

// Context
import Root from './EmAvatar.vue'
import Fallback from './EmAvatarFallback.vue'
import Image from './EmAvatarImage.vue'

/**
 * User or entity avatar. Shows the image once it loads and the fallback until then.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`EmAvatarImage`) remain exported and valid.
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { EmAvatar } from '@paper/emerald'
 * </script>
 *
 * <template>
 *   <EmAvatar>
 *     <EmAvatar.Image />
 *
 *     <EmAvatar.Fallback />
 *   </EmAvatar>
 * </template>
 * ```
 */
export const EmAvatar = Object.assign(Root, {
  /** The avatar image; hidden until it loads. */
  Image,
  /** Initials or icon shown while the image loads or after it fails. */
  Fallback,
})
