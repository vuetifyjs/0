export type { EmAlertProps, EmAlertRole, EmAlertVariant } from './EmAlert.vue'
export { default as EmAlertDescription } from './EmAlertDescription.vue'
export { default as EmAlertTitle } from './EmAlertTitle.vue'

// Context
import Root from './EmAlert.vue'
import Description from './EmAlertDescription.vue'
import Title from './EmAlertTitle.vue'

/**
 * Inline status message. Owns the tone and renders the icon that matches it.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`EmAlertTitle`) remain exported and valid.
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { EmAlert } from '@paper/emerald'
 * </script>
 *
 * <template>
 *   <EmAlert tone="success">
 *     <EmAlert.Title />
 *
 *     <EmAlert.Description />
 *   </EmAlert>
 * </template>
 * ```
 */
export const EmAlert = Object.assign(Root, {
  /** Short headline for the message. */
  Title,
  /** Supporting copy under the title. */
  Description,
})
