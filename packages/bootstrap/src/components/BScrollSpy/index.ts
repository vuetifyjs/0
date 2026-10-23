export type { BScrollSpyContext, BScrollSpyProps, BScrollSpyRegistration } from './BScrollSpy.vue'
export type { BScrollSpyLinkProps } from './BScrollSpyLink.vue'
export type { BScrollSpySectionProps } from './BScrollSpySection.vue'

// Context
import Root from './BScrollSpy.vue'
import Link from './BScrollSpyLink.vue'
import Section from './BScrollSpySection.vue'

/**
 * Bootstrap 6 scrollspy. The link for the section in view gets `.active`.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { BScrollSpy } from '@paper/bootstrap'
 * </script>
 *
 * <template>
 *   <BScrollSpy>
 *     <BScrollSpy.Link id="one">First</BScrollSpy.Link>
 *     <BScrollSpy.Section id="one" />
 *   </BScrollSpy>
 * </template>
 * ```
 */
export const BScrollSpy = Object.assign(Root, {
  /** `a.nav-link`. `.active` while its section is the one in view. */
  Link,
  /** Observed block. Paired with a link by `id`. */
  Section,
})
