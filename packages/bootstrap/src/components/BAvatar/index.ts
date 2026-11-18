export type { BAvatarProps, BAvatarSize, BAvatarStatus } from './BAvatar.vue'

// Context

/**
 * Bootstrap 6 avatar.
 *
 * Canon: BAvatar was in the pinned catalog and missing from the SPEC bullet list. `.avatar-stack` is named in that catalog and never rendered as a wrapper, so there is no stack part.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { BAvatar } from '@paper/bootstrap'
 * </script>
 *
 * <template>
 *   <BAvatar src="https://github.com/mdo.png" alt="mdo" status="online" />
 *   <BAvatar subtle>AB</BAvatar>
 * </template>
 * ```
 */

export { default as BAvatar } from './BAvatar.vue'
