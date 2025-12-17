export type { StepItemProps, StepItemSlotProps } from './StepItem.vue'
export { default as StepItem } from './StepItem.vue'

export type { StepRootProps, StepRootSlotProps } from './StepRoot.vue'

export { provideStepRoot, useStepRoot } from './StepRoot.vue'
export { default as StepRoot } from './StepRoot.vue'

import Root from './StepRoot.vue'
import Item from './StepItem.vue'

/**
 * Step component with sub-components for building stepper navigation.
 *
 * @see https://0.vuetifyjs.com/components/step
 */
export const Step = {
  /**
   * Root component for step navigation.
   *
   * @see https://0.vuetifyjs.com/components/step
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Step } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Step.Root>
   *     <Step.Item value="account">Account</Step.Item>
   *
   *     <Step.Item value="profile">Profile</Step.Item>
   *
   *     <Step.Item value="review">Review</Step.Item>
   *   </Step.Root>
   * </template>
   * ```
   */
  Root,
  /**
   * Component representing a single step item.
   *
   * @see https://0.vuetifyjs.com/components/step#stepitem
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Step } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Step.Item value="account">
   *     Account Setup
   *   </Step.Item>
   * </template>
   * ```
   */
  Item,
}
