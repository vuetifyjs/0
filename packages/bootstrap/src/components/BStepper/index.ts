export type { BStepperContext, BStepperProps } from './BStepper.vue'

// Context
import Root from './BStepper.vue'

import Item from '../BStepperItem/BStepperItem.vue'

/**
 * Bootstrap 6 stepper. `ol.stepper` of `li.stepper-item`.
 *
 * BStepper was in the pinned catalog and missing from the SPEC bullet list.
 * `.active` means reached (the current step and every step before it), which
 * is what the first pinned example does: the first two items are `.active`
 * and the rest are plain. `v-model` is the current step index. Click, Enter,
 * and Space select a step. `aria-current="step"` is the current index.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { BStepper, BStepperItem } from '@paper/bootstrap'
 * </script>
 *
 * <template>
 *   <BStepper v-model="step">
 *     <BStepperItem>Create account</BStepperItem>
 *
 *     <BStepperItem>Confirm email</BStepperItem>
 *
 *     <BStepperItem>Update profile</BStepperItem>
 *
 *     <BStepperItem>Finish</BStepperItem>
 *   </BStepper>
 * </template>
 * ```
 */
export const BStepper = Object.assign(Root, {
  /** `li.stepper-item`. `.active` while this step has been reached. */
  Item,
})
