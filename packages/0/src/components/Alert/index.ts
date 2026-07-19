export type { AlertDescriptionProps, AlertDescriptionSlotProps } from './AlertDescription.vue'
export type { AlertRootProps, AlertRootSlotProps } from './AlertRoot.vue'
export type { AlertTitleProps, AlertTitleSlotProps } from './AlertTitle.vue'

export { default as AlertDescription } from './AlertDescription.vue'
export { default as AlertRoot } from './AlertRoot.vue'
export { default as AlertTitle } from './AlertTitle.vue'

// Context
import Description from './AlertDescription.vue'
import Root from './AlertRoot.vue'
import Title from './AlertTitle.vue'

/**
 * Alert compound component for inline status messages.
 *
 * Renders a live region (`role="alert"` by default) that screen readers
 * announce when content is inserted or updated. Use `Alert.Root`,
 * `Alert.Title`, and `Alert.Description` to compose structured alerts.
 *
 * @see https://0.vuetifyjs.com/components/semantic/alert
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { Alert } from '@vuetify/v0'
 * </script>
 *
 * <template>
 *   <Alert.Root>
 *     <Alert.Title>Session expiring</Alert.Title>
 *
 *     <Alert.Description>You will be signed out in 5 minutes.</Alert.Description>
 *   </Alert.Root>
 * </template>
 * ```
 */
export const Alert = {
  /**
   * Root live-region container. Defaults to `role="alert"` (assertive).
   * Set `role="status"` for polite, non-urgent messages.
   *
   * @see https://0.vuetifyjs.com/components/semantic/alert
   */
  Root,
  /**
   * Heading for the alert. Renders as `<h5>` by default.
   *
   * @see https://0.vuetifyjs.com/components/semantic/alert
   */
  Title,
  /**
   * Description body for the alert. Renders as `<p>` by default.
   *
   * @see https://0.vuetifyjs.com/components/semantic/alert
   */
  Description,
}
