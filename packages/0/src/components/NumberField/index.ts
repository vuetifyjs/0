export { default as NumberFieldControl } from './NumberFieldControl.vue'

export { default as NumberFieldDecrement } from './NumberFieldDecrement.vue'

export { default as NumberFieldDescription } from './NumberFieldDescription.vue'

export { default as NumberFieldError } from './NumberFieldError.vue'

export { default as NumberFieldIncrement } from './NumberFieldIncrement.vue'

export { default as NumberFieldRoot } from './NumberFieldRoot.vue'
export { provideNumberFieldRoot, useNumberFieldRoot } from './NumberFieldRoot.vue'

export { default as NumberFieldScrub } from './NumberFieldScrub.vue'

export type { NumberFieldControlProps, NumberFieldControlSlotProps } from './NumberFieldControl.vue'
export type { NumberFieldDecrementProps, NumberFieldDecrementSlotProps } from './NumberFieldDecrement.vue'
export type { NumberFieldDescriptionProps, NumberFieldDescriptionSlotProps } from './NumberFieldDescription.vue'
export type { NumberFieldErrorProps, NumberFieldErrorSlotProps } from './NumberFieldError.vue'
export type { NumberFieldIncrementProps, NumberFieldIncrementSlotProps } from './NumberFieldIncrement.vue'
export type { NumberFieldRootContext, NumberFieldRootProps, NumberFieldRootSlotProps } from './NumberFieldRoot.vue'
export type { NumberFieldScrubProps, NumberFieldScrubSlotProps } from './NumberFieldScrub.vue'

// Context
import Control from './NumberFieldControl.vue'
import Decrement from './NumberFieldDecrement.vue'
import Description from './NumberFieldDescription.vue'
import Error from './NumberFieldError.vue'
import Increment from './NumberFieldIncrement.vue'
import Root from './NumberFieldRoot.vue'
import Scrub from './NumberFieldScrub.vue'

/**
 * Number field component with sub-components for numeric input controls.
 *
 * @see https://0.vuetifyjs.com/components/number-field
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { NumberField } from '@vuetify/v0'
 *   import { ref } from 'vue'
 *
 *   const value = ref<number | null>(0)
 * </script>
 *
 * <template>
 *   <NumberField.Root v-model="value" :min="0" :max="100">
 *     <NumberField.Decrement>-</NumberField.Decrement>
 *     <NumberField.Control />
 *     <NumberField.Increment>+</NumberField.Increment>
 *   </NumberField.Root>
 * </template>
 * ```
 */
export const NumberField = {
  /**
   * Root component for number fields.
   *
   * Creates number field context, provides it to child components, and
   * bridges v-model. Manages validation timing via validateOn prop.
   * Configure min, max, step, locale, and format via props.
   *
   * @see https://0.vuetifyjs.com/components/number-field
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { NumberField } from '@vuetify/v0'
   *   import { ref } from 'vue'
   *
   *   const value = ref<number | null>(0)
   * </script>
   *
   * <template>
   *   <NumberField.Root v-model="value" :min="0" :max="100">
   *     <NumberField.Control />
   *   </NumberField.Root>
   * </template>
   * ```
   */
  Root,
  /**
   * Native input element with spinbutton semantics.
   *
   * Provides keyboard navigation (Arrow, Page, Home/End, Shift+Arrow, Enter),
   * text parsing, and focus-dependent display (raw while focused, formatted
   * while blurred). Emits full ARIA spinbutton attributes.
   *
   * @see https://0.vuetifyjs.com/components/number-field#anatomy
   *
   * @example
   * ```vue
   * <NumberField.Control />
   * ```
   */
  Control,
  /**
   * Increment button with spin-on-hold behavior.
   *
   * On pointerdown, increments immediately then starts repeating
   * after spinDelay at spinRate interval. Disabled when value is
   * at maximum or field is disabled/readonly.
   *
   * @see https://0.vuetifyjs.com/components/number-field#anatomy
   *
   * @example
   * ```vue
   * <NumberField.Increment>+</NumberField.Increment>
   * ```
   */
  Increment,
  /**
   * Decrement button with spin-on-hold behavior.
   *
   * On pointerdown, decrements immediately then starts repeating
   * after spinDelay at spinRate interval. Disabled when value is
   * at minimum or field is disabled/readonly.
   *
   * @see https://0.vuetifyjs.com/components/number-field#anatomy
   *
   * @example
   * ```vue
   * <NumberField.Decrement>-</NumberField.Decrement>
   * ```
   */
  Decrement,
  /**
   * Click-and-drag scrub control using Pointer Lock API.
   *
   * Allows unbounded horizontal dragging to adjust the value.
   * Configure sensitivity (pixels per step) via prop. Shows
   * ew-resize cursor on hover. Renders as label by default.
   *
   * @see https://0.vuetifyjs.com/components/number-field#scrub
   *
   * @example
   * ```vue
   * <NumberField.Scrub>Amount</NumberField.Scrub>
   * ```
   */
  Scrub,
  /**
   * Help text component connected via aria-describedby.
   *
   * Auto-registers with parent Root to wire up the ARIA relationship
   * to the Control element.
   *
   * @see https://0.vuetifyjs.com/components/number-field#description
   *
   * @example
   * ```vue
   * <NumberField.Description>Enter a value between 0 and 100</NumberField.Description>
   * ```
   */
  Description,
  /**
   * Error message component connected via aria-errormessage.
   *
   * Renders validation error messages from the parent Root's validation
   * context. Uses aria-live="polite" for screen reader announcements.
   *
   * @see https://0.vuetifyjs.com/components/number-field#validation
   *
   * @example
   * ```vue
   * <NumberField.Error v-slot="{ errors }">
   *   <span v-for="error in errors">{{ error }}</span>
   * </NumberField.Error>
   * ```
   */
  Error,
}
