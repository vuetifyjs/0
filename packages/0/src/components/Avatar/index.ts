export type { AvatarFallbackProps, AvatarFallbackSlotProps } from './AvatarFallback.vue'
export { default as AvatarFallback } from './AvatarFallback.vue'
export type { AvatarImageEmits, AvatarImageProps, AvatarImageSlotProps } from './AvatarImage.vue'

export { default as AvatarImage } from './AvatarImage.vue'

export type { AvatarContext, AvatarRootProps, AvatarTicket } from './AvatarRoot.vue'
export { provideAvatarContext, useAvatarRoot } from './AvatarRoot.vue'
export { default as AvatarRoot } from './AvatarRoot.vue'

import Fallback from './AvatarFallback.vue'
import Image from './AvatarImage.vue'
import Root from './AvatarRoot.vue'

export const Avatar = {
  Fallback,
  Image,
  Root,
}
