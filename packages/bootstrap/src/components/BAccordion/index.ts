export type { BAccordionContext, BAccordionProps } from './BAccordion.vue'

// Context
import Root from './BAccordion.vue'

import Body from '../BAccordionBody/BAccordionBody.vue'
import Header from '../BAccordionHeader/BAccordionHeader.vue'
import Item from '../BAccordionItem/BAccordionItem.vue'

/**
 * Bootstrap 6 accordion. Native `details` items inside `.accordion`.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { BAccordion } from '@paper/bootstrap'
 * </script>
 *
 * <template>
 *   <BAccordion>
 *     <BAccordion.Item open>
 *       <BAccordion.Header>Accordion Item #1</BAccordion.Header>
 *       <BAccordion.Body>First</BAccordion.Body>
 *     </BAccordion.Item>
 *   </BAccordion>
 * </template>
 * ```
 */
export const BAccordion = Object.assign(Root, {
  /** `details.accordion-item`. */
  Item,
  /** `summary.accordion-header` and the pin's chevron. */
  Header,
  /** `div.accordion-body`. */
  Body,
})
