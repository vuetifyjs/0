export { default as AlertAction } from './AlertAction.vue'
export { default as AlertDescription } from './AlertDescription.vue'
export { default as AlertIcon } from './AlertIcon.vue'
export { default as AlertRoot } from './AlertRoot.vue'
export { default as AlertTitle } from './AlertTitle.vue'
export { provideAlertContext, useAlertContext } from './AlertRoot.vue'
export type { AlertActionProps, AlertActionSlotProps } from './AlertAction.vue'
export type { AlertDescriptionProps, AlertDescriptionSlotProps } from './AlertDescription.vue'
export type { AlertIconProps, AlertIconSlotProps } from './AlertIcon.vue'
export type { AlertContext, AlertRootProps, AlertRootSlotProps } from './AlertRoot.vue'
export type { AlertTitleProps, AlertTitleSlotProps } from './AlertTitle.vue'

// Components
import Action from './AlertAction.vue'
import Description from './AlertDescription.vue'
import Icon from './AlertIcon.vue'
import Root from './AlertRoot.vue'
import Title from './AlertTitle.vue'

/**
 * Alert component for inline status banners with title, description, icon, and dismiss action.
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
 *     <Alert.Icon>⚠️</Alert.Icon>
 *     <Alert.Title>Heads up</Alert.Title>
 *     <Alert.Description>Your session expires in 5 minutes.</Alert.Description>
 *     <Alert.Action>✕</Alert.Action>
 *   </Alert.Root>
 * </template>
 * ```
 */
export const Alert = {
  /**
   * Root container for the alert banner. Renders with role="alert".
   *
   * @see https://0.vuetifyjs.com/components/semantic/alert
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Alert } from '@vuetify/v0'
   *   import { shallowRef } from 'vue'
   *   const visible = shallowRef(true)
   * </script>
   *
   * <template>
   *   <Alert.Root v-if="visible" v-model="visible">
   *     <Alert.Title>Notice</Alert.Title>
   *     <Alert.Action />
   *   </Alert.Root>
   * </template>
   * ```
   */
  Root,
  /**
   * Title element providing an accessible name for the alert.
   *
   * @see https://0.vuetifyjs.com/components/semantic/alert
   *
   * @example
   * ```vue
   * <Alert.Title>Something went wrong</Alert.Title>
   * ```
   */
  Title,
  /**
   * Body text of the alert, associated via aria-describedby.
   *
   * @see https://0.vuetifyjs.com/components/semantic/alert
   *
   * @example
   * ```vue
   * <Alert.Description>Check your connection and try again.</Alert.Description>
   * ```
   */
  Description,
  /**
   * Decorative icon or avatar area. Renders aria-hidden="true" by default.
   *
   * @see https://0.vuetifyjs.com/components/semantic/alert
   *
   * @example
   * ```vue
   * <Alert.Icon>
   *   <MyInfoIcon />
   * </Alert.Icon>
   * ```
   */
  Icon,
  /**
   * Dismiss button that calls dismiss() from the alert context.
   *
   * @see https://0.vuetifyjs.com/components/semantic/alert
   *
   * @example
   * ```vue
   * <Alert.Action>✕</Alert.Action>
   * ```
   */
  Action,
}
