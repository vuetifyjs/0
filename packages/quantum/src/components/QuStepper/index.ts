export type { QuStepperContext, QuStepperMobile, QuStepperProps } from './QuStepper.vue'
export { default as QuStepperActions } from './QuStepperActions.vue'
export { default as QuStepperBar } from './QuStepperBar.vue'
export { default as QuStepperContent } from './QuStepperContent.vue'
export type { QuStepperStepProps, QuStepperStepState } from './QuStepperStep.vue'
export { default as QuStepperStep } from './QuStepperStep.vue'

// Context
import Root from './QuStepper.vue'
import Actions from './QuStepperActions.vue'
import Bar from './QuStepperBar.vue'
import Content from './QuStepperContent.vue'
import Step from './QuStepperStep.vue'

/**
 * The Material Design 1 stepper: horizontal or vertical, linear or non-linear,
 * with alternative labels, editable, optional and error steps, and the three
 * mobile forms. Composes v0 `Step` (the root provides the step context
 * `Step.Item` registers into), `Collapsible` for each step's content,
 * `QuButton` for the actions and `Progress.Root` for the mobile bar.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`QuStepperStep`) remain exported and valid.
 *
 * @example
 * ```vue
 * <QuStepper v-model="step">
 *   <QuStepper.Step label="Select campaign settings" value="settings">
 *     <QuStepper.Content>
 *       <QuStepper.Actions />
 *     </QuStepper.Content>
 *   </QuStepper.Step>
 *
 *   <QuStepper.Bar />
 * </QuStepper>
 * ```
 */
export const QuStepper = Object.assign(Root, {
  /** One step: its circle, label and sub-label, and the connector to the next. */
  Step,
  /** The step's body, shown while the step is active. */
  Content,
  /** CONTINUE and CANCEL under the body. */
  Actions,
  /** The mobile bottom bar: BACK and NEXT around dots, a progress bar or nothing. */
  Bar,
})
