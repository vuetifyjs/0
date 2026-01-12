export { default as CheckboxGroup } from './CheckboxGroup.vue'
export { provideCheckboxGroup, useCheckboxGroup } from './CheckboxGroup.vue'

export { default as CheckboxHiddenInput } from './CheckboxHiddenInput.vue'

export { default as CheckboxIndicator } from './CheckboxIndicator.vue'

export { default as CheckboxRoot } from './CheckboxRoot.vue'
export { provideCheckboxRoot, useCheckboxRoot } from './CheckboxRoot.vue'

export type { CheckboxGroupProps, CheckboxGroupSlotProps } from './CheckboxGroup.vue'
export type { CheckboxHiddenInputProps } from './CheckboxHiddenInput.vue'
export type { CheckboxIndicatorProps, CheckboxIndicatorSlotProps } from './CheckboxIndicator.vue'
export type { CheckboxRootContext, CheckboxRootProps, CheckboxRootSlotProps, CheckboxState } from './CheckboxRoot.vue'

// Components
import Group from './CheckboxGroup.vue'
import HiddenInput from './CheckboxHiddenInput.vue'
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
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Checkbox } from '@vuetify/v0'
   *   import { ref } from 'vue'
   *
   *   const selected = ref<string[]>([])
   * </script>
   *
   * <template>
   *   <Checkbox.Group v-model="selected">
   *     <Checkbox.Root value="a">
   *       <Checkbox.Indicator>✓</Checkbox.Indicator>
   *       Option A
   *     </Checkbox.Root>
   *     <Checkbox.Root value="b">
   *       <Checkbox.Indicator>✓</Checkbox.Indicator>
   *       Option B
   *     </Checkbox.Root>
   *   </Checkbox.Group>
   * </template>
   * ```
   */
  Group,
  /**
   * Hidden input component for form submission.
   *
   * Auto-rendered by Root when `name` prop is provided.
   * Can also be used explicitly for custom form integration.
   *
   * @see https://0.vuetifyjs.com/components/checkbox#hiddeninput
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Checkbox } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Checkbox.Root>
   *     <Checkbox.Indicator>✓</Checkbox.Indicator>
   *     <Checkbox.HiddenInput name="agree" value="yes" />
   *   </Checkbox.Root>
   * </template>
   * ```
   */
  HiddenInput,
  /**
   * Visual indicator component for checkboxes.
   *
   * Renders as a span and only displays when checked or indeterminate.
   * Must be used within a Checkbox.Root component.
   *
   * @see https://0.vuetifyjs.com/components/checkbox#indicator
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Checkbox } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Checkbox.Root>
   *     <Checkbox.Indicator>
   *       <svg viewBox="0 0 24 24">
   *         <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
   *       </svg>
   *     </Checkbox.Indicator>
   *   </Checkbox.Root>
   * </template>
   * ```
   */
  Indicator,
  /**
   * Root component for individual checkboxes.
   *
   * Renders as a button with proper ARIA attributes and handles
   * click/keyboard interactions. Supports standalone mode with
   * v-model or group mode within Checkbox.Group. When `name` prop
   * is provided, automatically renders a hidden input for form submission.
   *
   * @see https://0.vuetifyjs.com/components/checkbox#root
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Checkbox } from '@vuetify/v0'
   *   import { ref } from 'vue'
   *
   *   const agreed = ref(false)
   * </script>
   *
   * <template>
   *   <label>
   *     <Checkbox.Root v-model="agreed">
   *       <Checkbox.Indicator>✓</Checkbox.Indicator>
   *     </Checkbox.Root>
   *     I agree to the terms
   *   </label>
   * </template>
   * ```
   */
  Root,
}
