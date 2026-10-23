<script lang="ts">
  // Framework
  import { Button, createContext, isString, isUndefined, Step, useId, useLocale } from '@vuetify/v0'

  // Context
  import { orphan, useQuStepper } from './QuStepper.vue'

  // Utilities
  import { toRef, toValue } from 'vue'

  // Types
  import type { Ref } from 'vue'

  // Components
  import QuIcon from '../QuIcon/QuIcon.vue'
  import QuRipple from '../QuRipple/QuRipple.vue'

  /** Where a step stands: the one being worked on, one already done, or one not reached yet. */
  export type QuStepperStepState = 'active' | 'complete' | 'inactive'

  export interface QuStepperStepContext {
    /** Whether this step is the active one. */
    active: Readonly<Ref<boolean>>
    /** Element id of the step's label, which names its content region. */
    label: string
  }

  export interface QuStepperStepProps<V = unknown> {
    /** The value `v-model` on the root takes while this step is active. */
    value?: V
    /** The step name: 14 sp, Medium while active. Keep it short in a horizontal stepper. */
    label: string
    /** Marks the step as skippable with the 12 sp "Optional" sub-label. Optional steps in a linear flow must be marked. */
    optional?: boolean
    /** A completed step that may be reopened: a pencil in its circle, and its label stays a button. */
    editable?: boolean
    /**
     * Whether the step is completed: a check (or the pencil) in a primary circle.
     * Unset, a linear stepper completes every step before the active one and a
     * non-linear stepper completes none.
     */
    complete?: boolean
    /** An error message: the red warning glyph replaces the circle, the label turns red Medium, the message sits under it. */
    error?: string
    /** A one-line summary under the label, the vertical stepper's "Summary if needed" sub-label. */
    summary?: string
    /** The id v0 registers the step under. Generated when unset. */
    id?: string
  }

  const [useQuStepperStep, provideQuStepperStep] = createContext<QuStepperStepContext | null>('quantum:stepper-step', null)

  export { useQuStepperStep }
</script>

<script lang="ts" setup generic="V = unknown">
  defineOptions({ name: 'QuStepperStep' })

  defineSlots<{
    /** The step's `QuStepper.Content`. */
    default?: () => any
  }>()

  const {
    value,
    label,
    optional = false,
    editable = false,
    complete = undefined,
    error,
    summary,
    id: _id,
  } = defineProps<QuStepperStepProps<V>>()

  const stepper = useQuStepper()
  const locale = useLocale()

  orphan('QuStepperStep', 'QuStepper', !stepper)

  const id = _id ?? `quantum-stepper-step-${useId()}`
  const labelId = `${id}-label`

  // The ticket Step.Item registers under this id; the registry is reactive, so
  // the number and state follow siblings registering, leaving and reordering.
  const ticket = toRef(() => stepper?.step.get(id))

  const active = toRef(() => toValue(ticket.value?.isSelected) ?? false)
  const index = toRef(() => ticket.value?.index ?? 0)

  const done = toRef(() => {
    if (!isUndefined(complete)) return complete

    return (stepper?.linear.value ?? true) && index.value < (stepper?.step.selectedIndex.value ?? -1)
  })

  const state = toRef((): QuStepperStepState => {
    if (active.value) return 'active'

    return done.value ? 'complete' : 'inactive'
  })

  // Headers are buttons only where the page lets the user go: a completed
  // step when it is editable, a step not reached yet only in a non-linear flow.
  const reachable = toRef(() => {
    if (state.value === 'active') return false
    if (state.value === 'complete') return editable

    return !(stepper?.linear.value ?? true)
  })

  const note = toRef(() => {
    if (isString(error)) return error
    if (isString(summary)) return summary
    if (optional) return locale.ti('Quantum.optional') ?? 'Optional'

    return undefined
  })

  const glyph = toRef(() => {
    if (isString(error)) return 'warning'
    if (state.value === 'complete') return editable ? 'edit' : 'check'

    return undefined
  })

  provideQuStepperStep({ active, label: labelId })

  function onClick (select: () => void) {
    if (reachable.value) select()
  }
</script>

<template>
  <Step.Item
    v-if="stepper"
    :id
    v-slot="{ select }"
    :namespace="stepper.namespace"
    :value
  >
    <li
      :aria-current="active ? 'step' : undefined"
      class="quantum-stepper__step"
      :data-editable="editable || undefined"
      :data-error="isString(error) || undefined"
      :data-optional="optional || undefined"
      :data-state="state"
    >
      <component
        :is="reachable ? Button.Root : 'div'"
        :id="labelId"
        class="quantum-stepper__label"
        @click="onClick(select)"
      >
        <QuRipple v-if="reachable" />

        <!-- The ordered list already numbers the steps; the circle's number and glyphs are decoration. -->
        <span aria-hidden="true" class="quantum-stepper__circle">
          <QuIcon v-if="glyph" :name="glyph" />

          <template v-else>{{ index + 1 }}</template>
        </span>

        <span class="quantum-stepper__text">
          <span class="quantum-stepper__name">{{ label }}</span>

          <small v-if="note" class="quantum-stepper__note">{{ note }}</small>
        </span>
      </component>

      <!-- Decorative: an <hr> would announce a separator between every pair of steps. -->
      <span aria-hidden="true" class="quantum-stepper__connector" />

      <slot />
    </li>
  </Step.Item>
</template>

<!-- Unscoped: the step renders inside Step.Item's slot and the root's header. -->
<style>
  /* Horizontal: each step is its label and the connector that runs to the next one; the last step has no connector. */
  .quantum-stepper__step {
    position: relative;
    display: flex;
    flex: 1 1 auto;
    align-items: center;
    min-width: 0;
  }

  .quantum-stepper__step:last-child {
    flex: 0 0 auto;
  }

  .quantum-stepper__step:last-child > .quantum-stepper__connector {
    display: none;
  }

  /* The step cell: 24 dp padding around the 24 dp circle, 8 dp from the circle to the label (horizontal step specs). */
  .quantum-stepper__label {
    position: relative;
    display: flex;
    align-items: center;
    align-self: stretch;
    box-sizing: border-box;
    min-width: 0;
    margin: 0;
    padding: var(--quantum-spacing-3, 24px);
    border: 0;
    border-radius: 0;
    background: transparent;
    font: inherit;
    color: inherit;
    text-align: start;
    -webkit-tap-highlight-color: transparent;
    transition: background-color var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  button.quantum-stepper__label {
    cursor: pointer;
    user-select: none;
  }

  /* Hover: 6% over the whole step cell on the steps the user can go to (steppers page; lead decision 3). */
  button.quantum-stepper__label:hover {
    background-color: var(--quantum-hover, rgba(0, 0, 0, 0.06));
  }

  /*
   * Focus is not stated on the steppers page; the buttons page's 12% overlay,
   * keyboard only. The transparent outline keeps a ring under forced colours.
   */
  button.quantum-stepper__label:focus-visible {
    outline: 2px solid transparent;
    background-color: var(--quantum-focus, rgba(0, 0, 0, 0.12));
  }

  /* Pressed: a circular ripple from the press point in the hover tone, not the buttons' grey (steppers page). */
  .quantum-stepper__label > .quantum-ripple {
    color: var(--quantum-hover, rgba(0, 0, 0, 0.06));
  }

  /* 24 dp, a 12 sp Regular number in white; 38% while inactive, the primary colour once reached. */
  .quantum-stepper__circle {
    position: relative;
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    margin-inline-end: var(--quantum-spacing-1, 8px);
    border-radius: 50%;
    background: var(--quantum-text-disabled, rgba(0, 0, 0, 0.38));
    color: var(--quantum-on-primary, #FFFFFF);
    font-size: var(--quantum-type-caption-size, 12px);
    font-weight: var(--quantum-font-weight-regular, 400);
    line-height: 1;
    transition: background-color var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /* The check and the pencil inside a circle: the page draws them at 18 dp (Vuetify 1.5, `moderate`). */
  .quantum-stepper__circle > .quantum-icon {
    --quantum-icon-size: 18px;
  }

  .quantum-stepper__step[data-state='active'] .quantum-stepper__circle,
  .quantum-stepper__step[data-state='complete'] .quantum-stepper__circle {
    background: var(--quantum-primary, #3F51B5);
  }

  /* Error: the 24 dp warning glyph in red stands in for the circle. */
  .quantum-stepper__step[data-error] .quantum-stepper__circle {
    background: transparent;
    color: var(--quantum-error, #FF1744);
  }

  .quantum-stepper__step[data-error] .quantum-stepper__circle > .quantum-icon {
    --quantum-icon-size: 24px;
  }

  .quantum-stepper__text {
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  /* The name: 14 sp Regular; Medium while active. Inactive is 38% in a linear flow, 54% in a non-linear one. */
  .quantum-stepper__name {
    overflow: hidden;
    font-size: var(--quantum-type-body-1-size, 14px);
    font-weight: var(--quantum-font-weight-regular, 400);
    line-height: var(--quantum-type-body-1-leading, 20px);
    letter-spacing: var(--quantum-type-body-1-tracking, 0.01em);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .quantum-stepper[data-linear] .quantum-stepper__name {
    color: var(--quantum-text-disabled, rgba(0, 0, 0, 0.38));
  }

  .quantum-stepper .quantum-stepper__step[data-state='active'] .quantum-stepper__name,
  .quantum-stepper .quantum-stepper__step[data-state='complete'] .quantum-stepper__name {
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
  }

  .quantum-stepper__step[data-state='active'] .quantum-stepper__name {
    font-weight: var(--quantum-font-weight-medium, 500);
  }

  .quantum-stepper .quantum-stepper__step[data-error] .quantum-stepper__name {
    font-weight: var(--quantum-font-weight-medium, 500);
    color: var(--quantum-error, #FF1744);
  }

  /* The sub-label ("Optional", a summary or the error message): 12 sp Regular at 54%, red on an error step. */
  .quantum-stepper__note {
    font-size: var(--quantum-type-caption-size, 12px);
    font-weight: var(--quantum-font-weight-regular, 400);
    line-height: 16px;
    letter-spacing: var(--quantum-type-caption-tracking, 0.02em);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .quantum-stepper__step[data-error] .quantum-stepper__note {
    color: var(--quantum-error, #FF1744);
  }

  /*
   * The 1 dp connector in Grey 400 (the page's text; the sheets render Grey 300),
   * 8 dp clear of the label before it and the circle after it: it reaches 16 dp
   * into each side's 24 dp padding.
   */
  .quantum-stepper__connector {
    display: block;
    flex: 1 1 auto;
    align-self: center;
    box-sizing: content-box;
    min-width: var(--quantum-spacing-1, 8px);
    height: 1px;
    margin: 0 -16px;
    padding: 0;
    border: 0;
    background: var(--quantum-grey-400, #BDBDBD);
  }

  /* The page has no dark sheet; on the dark theme the connector takes the divider ink rather than a light grey bar. */
  [data-theme='quantum-dark'] .quantum-stepper__connector {
    background: var(--quantum-divider, rgba(255, 255, 255, 0.12));
  }

  /*
   * Alternative labels: steps in equal parts, the label centred 16 dp under
   * its circle, 24 dp above and below and 16 dp at the sides. The connector
   * runs between circles, 8 dp clear of each.
   */
  .quantum-stepper[data-alternative]:not([data-vertical]) .quantum-stepper__step {
    flex: 1 1 0;
    align-items: flex-start;
  }

  .quantum-stepper[data-alternative]:not([data-vertical]) .quantum-stepper__label {
    flex: 1 1 auto;
    flex-direction: column;
    padding: var(--quantum-spacing-3, 24px) var(--quantum-spacing-2, 16px);
    text-align: center;
  }

  .quantum-stepper[data-alternative]:not([data-vertical]) .quantum-stepper__circle {
    margin: 0 0 var(--quantum-spacing-2, 16px);
  }

  .quantum-stepper[data-alternative]:not([data-vertical]) .quantum-stepper__text {
    align-items: center;
    max-width: 100%;
  }

  .quantum-stepper[data-alternative]:not([data-vertical]) .quantum-stepper__name {
    line-height: 16px;
  }

  /* Absolutely positioned connectors align to their insets, not to the flex line (align-self would centre a 0 dp box in them). */
  .quantum-stepper[data-alternative]:not([data-vertical]) .quantum-stepper__connector {
    position: absolute;
    align-self: auto;
    top: 36px;
    inset-inline: calc(50% + 20px) calc(-50% + 20px);
    min-width: 0;
    margin: 0;
  }

  /*
   * Vertical: the label row is 24 dp from the top and 16 dp above the
   * content, with 12 dp from the circle to the label. The name line is as
   * tall as the circle so the two centre while a sub-label hangs below.
   */
  .quantum-stepper[data-vertical]:not([data-mobile]) .quantum-stepper__step {
    display: block;
    flex: none;
  }

  .quantum-stepper[data-vertical]:not([data-mobile]) .quantum-stepper__label {
    align-items: flex-start;
    width: 100%;
    padding: var(--quantum-spacing-3, 24px) var(--quantum-spacing-3, 24px) var(--quantum-spacing-2, 16px);
  }

  .quantum-stepper[data-vertical]:not([data-mobile]) .quantum-stepper__circle {
    margin-inline-end: 12px;
  }

  .quantum-stepper[data-vertical]:not([data-mobile]) .quantum-stepper__name {
    line-height: 24px;
  }

  /* The vertical connector: centred under the circle, 8 dp clear of it and of the next circle. */
  .quantum-stepper[data-vertical]:not([data-mobile]) .quantum-stepper__connector {
    position: absolute;
    align-self: auto;
    top: 56px;
    bottom: -16px;
    inset-inline-start: 36px;
    width: 1px;
    min-width: 0;
    height: auto;
    margin: 0;
  }
</style>
