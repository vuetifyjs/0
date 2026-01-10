export { default as CheckboxGroup } from './CheckboxGroup.vue'
export { provideCheckboxGroup, useCheckboxGroup } from './CheckboxGroup.vue'

export { default as CheckboxIndicator } from './CheckboxIndicator.vue'

export { default as CheckboxRoot } from './CheckboxRoot.vue'
export { provideCheckboxRoot, useCheckboxRoot } from './CheckboxRoot.vue'

export type { CheckboxGroupProps, CheckboxGroupSlotProps } from './CheckboxGroup.vue'
export type { CheckboxIndicatorProps, CheckboxIndicatorSlotProps } from './CheckboxIndicator.vue'
export type { CheckboxRootContext, CheckboxRootProps, CheckboxRootSlotProps } from './CheckboxRoot.vue'

// Components
import Group from './CheckboxGroup.vue'
import Indicator from './CheckboxIndicator.vue'
import Root from './CheckboxRoot.vue'

/**
 * Checkbox component with sub-components for checkbox controls.
 *
 * @see https://0.vuetifyjs.com/components/checkbox
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { Checkbox } from '@vuetify/v0'
 * </script>
 *
 * <template>
 *   <label>
 *     <Checkbox.Root>
 *       <Checkbox.Indicator>✓</Checkbox.Indicator>
 *     </Checkbox.Root>
 *     I agree to terms
 *   </label>
 * </template>
 * ```
 */
export const Checkbox = {
  /**
   * Group component for managing multiple checkboxes.
   *
   * @see https://0.vuetifyjs.com/components/checkbox#group
   */
  Group,
  /**
   * Root component for individual checkboxes.
   *
   * Renders as a button with proper ARIA attributes and handles
   * click/keyboard interactions. Supports standalone mode with
   * v-model or group mode within Checkbox.Group.
   *
   * @see https://0.vuetifyjs.com/components/checkbox#root
   */
  Root,
  /**
   * Visual indicator component for checkboxes.
   *
   * Renders as a span and only displays when checked or indeterminate.
   * Must be used within a Checkbox.Root component.
   *
   * @see https://0.vuetifyjs.com/components/checkbox#indicator
   */
  Indicator,
}
