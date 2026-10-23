export type { BCardProps } from './BCard.vue'

// Context
import Root from './BCard.vue'

import Body from '../BCardBody/BCardBody.vue'
import Header from '../BCardHeader/BCardHeader.vue'
import Subtitle from '../BCardSubtitle/BCardSubtitle.vue'
import Text from '../BCardText/BCardText.vue'
import Title from '../BCardTitle/BCardTitle.vue'

/**
 * Bootstrap 6 card. `section.card` by default.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { BCard } from '@paper/bootstrap'
 * </script>
 *
 * <template>
 *   <BCard>
 *     <BCard.Body>
 *       <BCard.Title>Card title</BCard.Title>
 *       <BCard.Text>Some quick example text.</BCard.Text>
 *     </BCard.Body>
 *   </BCard>
 * </template>
 * ```
 */
export const BCard = Object.assign(Root, {
  /** `div.card-header`. */
  Header,
  /** `div.card-body`. */
  Body,
  /** `h4.card-title`. */
  Title,
  /** `p.card-subtitle`. */
  Subtitle,
  /** `p.card-text`. */
  Text,
})
