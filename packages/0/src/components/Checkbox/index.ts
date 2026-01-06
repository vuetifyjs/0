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
 *   import { ref } from 'vue'
 *
 *   // Standalone mode
 *   const agreed = ref(false)
 *
 *   // Group mode
 *   const selected = ref<string[]>([])
 * </script>
 *
 * <template>
 *   <!-- Standalone checkbox -->
 *   <Checkbox.Root v-model="agreed" v-slot="{ isChecked }">
 *     <Checkbox.Indicator>
 *       <CheckIcon v-if="isChecked" />
 *       I agree to terms
 *     </Checkbox.Indicator>
 *   </Checkbox.Root>
 *
 *   <!-- Group of checkboxes -->
 *   <Checkbox.Group v-model="selected">
 *     <Checkbox.Root value="a">
 *       <Checkbox.Indicator v-slot="{ isChecked }">
 *         <CheckIcon v-if="isChecked" /> Option A
 *       </Checkbox.Indicator>
 *     </Checkbox.Root>
 *
 *     <Checkbox.Root value="b">
 *       <Checkbox.Indicator v-slot="{ isChecked }">
 *         <CheckIcon v-if="isChecked" /> Option B
 *       </Checkbox.Indicator>
 *     </Checkbox.Root>
 *   </Checkbox.Group>
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
   * Handles registration with parent group (if present) and provides
   * checkbox context to Checkbox.Indicator. Supports standalone mode
   * with v-model or group mode within Checkbox.Group.
   *
   * @see https://0.vuetifyjs.com/components/checkbox#root
   */
  Root,
  /**
   * Visual indicator component for checkboxes.
   *
   * Renders the checkbox button with proper ARIA attributes.
   * Must be used within a Checkbox.Root component.
   *
   * @see https://0.vuetifyjs.com/components/checkbox#indicator
   */
  Indicator,
}
