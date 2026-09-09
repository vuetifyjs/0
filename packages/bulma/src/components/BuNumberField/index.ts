export type { BuNumberFieldColor, BuNumberFieldContext, BuNumberFieldProps, BuNumberFieldSize } from './BuNumberField.vue'

// Context
import Root from './BuNumberField.vue'

import Decrement from '../BuNumberFieldDecrement/BuNumberFieldDecrement.vue'
import Increment from '../BuNumberFieldIncrement/BuNumberFieldIncrement.vue'
import Input from '../BuNumberFieldInput/BuNumberFieldInput.vue'

/**
 * Numeric stepper. Owns the value; decrement, input, and increment are composed as parts.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`BuNumberFieldInput`) remain exported and valid.
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { BuNumberField } from '@paper/bulma'
 * </script>
 *
 * <template>
 *   <BuNumberField>
 *     <BuNumberField.Decrement />
 *
 *     <BuNumberField.Input />
 *
 *     <BuNumberField.Increment />
 *   </BuNumberField>
 * </template>
 * ```
 */
export const BuNumberField = Object.assign(Root, {
  /** Decrement stepper. */
  Decrement,
  /** The numeric input. */
  Input,
  /** Increment stepper. */
  Increment,
})
