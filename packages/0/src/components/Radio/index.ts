export { default as RadioGroup } from './RadioGroup.vue'
export { provideRadioGroup, useRadioGroup } from './RadioGroup.vue'

export { default as RadioHiddenInput } from './RadioHiddenInput.vue'

export { default as RadioIndicator } from './RadioIndicator.vue'

export { default as RadioRoot } from './RadioRoot.vue'
export { provideRadioRoot, useRadioRoot } from './RadioRoot.vue'

export type { RadioActivation, RadioGroupContext, RadioGroupProps, RadioGroupSlotProps, RadioTicket } from './RadioGroup.vue'
export type { RadioHiddenInputProps } from './RadioHiddenInput.vue'
export type { RadioIndicatorProps, RadioIndicatorSlotProps } from './RadioIndicator.vue'
export type { RadioRootContext, RadioRootProps, RadioRootSlotProps, RadioState } from './RadioRoot.vue'

// Components
import Group from './RadioGroup.vue'
import HiddenInput from './RadioHiddenInput.vue'
import Indicator from './RadioIndicator.vue'
import Root from './RadioRoot.vue'

/**
 * Radio component with sub-components for radio button controls.
 *
 * @see https://0.vuetifyjs.com/components/forms/radio
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { Radio } from '@vuetify/v0'
 *   import { ref } from 'vue'
 *
 *   const selected = ref<string>()
 * </script>
 *
 * <template>
 *   <Radio.Group v-model="selected">
 *     <label>
 *       <Radio.Root value="a">
 *         <Radio.Indicator>●</Radio.Indicator>
 *       </Radio.Root>
 *       Option A
 *     </label>
 *     <label>
 *       <Radio.Root value="b">
 *         <Radio.Indicator>●</Radio.Indicator>
 *       </Radio.Root>
 *       Option B
 *     </label>
 *   </Radio.Group>
 * </template>
 * ```
 */
export const Radio = {
  /**
   * Group component for managing radio buttons with single-selection.
   *
   * @see https://0.vuetifyjs.com/components/forms/radio#group
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Radio } from '@vuetify/v0'
   *   import { ref } from 'vue'
   *
   *   const selected = ref<string>()
   * </script>
   *
   * <template>
   *   <Radio.Group v-model="selected" mandatory>
   *     <Radio.Root value="a">
   *       <Radio.Indicator>●</Radio.Indicator>
   *       Option A
   *     </Radio.Root>
   *     <Radio.Root value="b">
   *       <Radio.Indicator>●</Radio.Indicator>
   *       Option B
   *     </Radio.Root>
   *   </Radio.Group>
   * </template>
   * ```
   */
  Group,
  /**
   * Hidden input component for form submission.
   *
   * Auto-rendered by Root when Group has a `name` prop.
   * Can also be used explicitly for custom form integration.
   *
   * @see https://0.vuetifyjs.com/components/forms/radio#hiddeninput
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Radio } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Radio.Group v-model="selected">
   *     <Radio.Root value="yes">
   *       <Radio.Indicator>●</Radio.Indicator>
   *       <Radio.HiddenInput name="choice" />
   *     </Radio.Root>
   *   </Radio.Group>
   * </template>
   * ```
   */
  HiddenInput,
  /**
   * Visual indicator component for radio buttons.
   *
   * Renders as a span and only displays when checked.
   * Must be used within a Radio.Root component.
   *
   * @see https://0.vuetifyjs.com/components/forms/radio#indicator
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Radio } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Radio.Group v-model="selected">
   *     <Radio.Root value="a">
   *       <Radio.Indicator>
   *         <svg viewBox="0 0 24 24">
   *           <circle cx="12" cy="12" r="6" />
   *         </svg>
   *       </Radio.Indicator>
   *     </Radio.Root>
   *   </Radio.Group>
   * </template>
   * ```
   */
  Indicator,
  /**
   * Root component for individual radio buttons.
   *
   * Must be used within a Radio.Group. Renders as a button with proper
   * ARIA attributes and handles click/keyboard interactions. When the
   * group has a `name` prop, automatically renders a hidden input for
   * form submission.
   *
   * @see https://0.vuetifyjs.com/components/forms/radio#root
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Radio } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Radio.Group v-model="selected">
   *     <Radio.Root value="option1">
   *       <Radio.Indicator>●</Radio.Indicator>
   *       Option 1
   *     </Radio.Root>
   *   </Radio.Group>
   * </template>
   * ```
   */
  Root,
}
