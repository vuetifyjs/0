export type { Md1StepperContext, Md1StepperMobile, Md1StepperProps } from './Md1Stepper.vue'
export { default as Md1StepperActions } from './Md1StepperActions.vue'
export { default as Md1StepperBar } from './Md1StepperBar.vue'
export { default as Md1StepperContent } from './Md1StepperContent.vue'
export type { Md1StepperStepProps, Md1StepperStepState } from './Md1StepperStep.vue'
export { default as Md1StepperStep } from './Md1StepperStep.vue'

// Context
import Root from './Md1Stepper.vue'
import Actions from './Md1StepperActions.vue'
import Bar from './Md1StepperBar.vue'
import Content from './Md1StepperContent.vue'
import Step from './Md1StepperStep.vue'

/**
 * The Material Design 1 stepper: horizontal or vertical, linear or non-linear,
 * with alternative labels, editable, optional and error steps, and the three
 * mobile forms. Composes v0 `Step` (the root provides the step context
 * `Step.Item` registers into), `Collapsible` for each step's content,
 * `Md1Button` for the actions and `Progress.Root` for the mobile bar.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`Md1StepperStep`) remain exported and valid.
 *
 * @example
 * ```vue
 * <Md1Stepper v-model="step">
 *   <Md1Stepper.Step label="Select campaign settings" value="settings">
 *     <Md1Stepper.Content>
 *       <Md1Stepper.Actions />
 *     </Md1Stepper.Content>
 *   </Md1Stepper.Step>
 *
 *   <Md1Stepper.Bar />
 * </Md1Stepper>
 * ```
 */
export const Md1Stepper = Object.assign(Root, {
  /** One step: its circle, label and sub-label, and the connector to the next. */
  Step,
  /** The step's body, shown while the step is active. */
  Content,
  /** CONTINUE and CANCEL under the body. */
  Actions,
  /** The mobile bottom bar: BACK and NEXT around dots, a progress bar or nothing. */
  Bar,
})
