export type { EmCardProps, EmCardVariant } from './EmCard.vue'
export { default as EmCardBody } from './EmCardBody.vue'
export { default as EmCardFooter } from './EmCardFooter.vue'
export { default as EmCardHeader } from './EmCardHeader.vue'
export { default as EmCardSubtitle } from './EmCardSubtitle.vue'
export { default as EmCardTitle } from './EmCardTitle.vue'

// Context
import Root from './EmCard.vue'
import Body from './EmCardBody.vue'
import Footer from './EmCardFooter.vue'
import Header from './EmCardHeader.vue'
import Subtitle from './EmCardSubtitle.vue'
import Title from './EmCardTitle.vue'

/**
 * Surface container. Owns the elevation and the padding rhythm its sections inherit.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`EmCardHeader`) remain exported and valid.
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { EmCard } from '@paper/emerald'
 * </script>
 *
 * <template>
 *   <EmCard>
 *     <EmCard.Header>
 *       <EmCard.Title />
 *
 *       <EmCard.Subtitle />
 *     </EmCard.Header>
 *
 *     <EmCard.Body />
 *
 *     <EmCard.Footer />
 *   </EmCard>
 * </template>
 * ```
 */
export const EmCard = Object.assign(Root, {
  /** Top section, typically the title and subtitle. */
  Header,
  /** Primary heading. */
  Title,
  /** Secondary line under the title. */
  Subtitle,
  /** Main content region. */
  Body,
  /** Bottom section, typically actions. */
  Footer,
})
