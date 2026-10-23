<script lang="ts">
  // Framework
  import { Button, createContext, isString, isUndefined, Step, useId, useLocale } from '@vuetify/v0'

  // Context
  import { orphan, useMd1Stepper } from './Md1Stepper.vue'

  // Utilities
  import { toRef, toValue } from 'vue'

  // Types
  import type { Ref } from 'vue'

  // Components
  import Md1Icon from '../Md1Icon/Md1Icon.vue'
  import Md1Ripple from '../Md1Ripple/Md1Ripple.vue'

  /** Where a step stands: the one being worked on, one already done, or one not reached yet. */
  export type Md1StepperStepState = 'active' | 'complete' | 'inactive'

  export interface Md1StepperStepContext {
    /** Whether this step is the active one. */
    active: Readonly<Ref<boolean>>
    /** Element id of the step's label, which names its content region. */
    label: string
  }

  export interface Md1StepperStepProps<V = unknown> {
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

  const [useMd1StepperStep, provideMd1StepperStep] = createContext<Md1StepperStepContext | null>('md1:stepper-step', null)

  export { useMd1StepperStep }
</script>

<script lang="ts" setup generic="V = unknown">
  defineOptions({ name: 'Md1StepperStep' })

  defineSlots<{
    /** The step's `Md1Stepper.Content`. */
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
  } = defineProps<Md1StepperStepProps<V>>()

  const stepper = useMd1Stepper()
  const locale = useLocale()

  orphan('Md1StepperStep', 'Md1Stepper', !stepper)

  const id = _id ?? `md1-stepper-step-${useId()}`
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

  const state = toRef((): Md1StepperStepState => {
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
    if (optional) return locale.ti('Md1.optional') ?? 'Optional'

    return undefined
  })

  const glyph = toRef(() => {
    if (isString(error)) return 'warning'
    if (state.value === 'complete') return editable ? 'edit' : 'check'

    return undefined
  })

  provideMd1StepperStep({ active, label: labelId })

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
      class="md1-stepper__step"
      :data-editable="editable || undefined"
      :data-error="isString(error) || undefined"
      :data-optional="optional || undefined"
      :data-state="state"
    >
      <component
        :is="reachable ? Button.Root : 'div'"
        :id="labelId"
        class="md1-stepper__label"
        @click="onClick(select)"
      >
        <Md1Ripple v-if="reachable" />

        <!-- The ordered list already numbers the steps; the circle's number and glyphs are decoration. -->
        <span aria-hidden="true" class="md1-stepper__circle">
          <Md1Icon v-if="glyph" :name="glyph" />

          <template v-else>{{ index + 1 }}</template>
        </span>

        <span class="md1-stepper__text">
          <span class="md1-stepper__name">{{ label }}</span>

          <small v-if="note" class="md1-stepper__note">{{ note }}</small>
        </span>
      </component>

      <!-- Decorative: an <hr> would announce a separator between every pair of steps. -->
      <span aria-hidden="true" class="md1-stepper__connector" />

      <slot />
    </li>
  </Step.Item>
</template>

<!-- Unscoped: the step renders inside Step.Item's slot and the root's header. -->
<style>
  /* Horizontal: each step is its label and the connector that runs to the next one; the last step has no connector. */
  .md1-stepper__step {
    position: relative;
    display: flex;
    flex: 1 1 auto;
    align-items: center;
    min-width: 0;
  }

  .md1-stepper__step:last-child {
    flex: 0 0 auto;
  }

  .md1-stepper__step:last-child > .md1-stepper__connector {
    display: none;
  }

  /* The step cell: 24 dp padding around the 24 dp circle, 8 dp from the circle to the label (horizontal step specs). */
  .md1-stepper__label {
    position: relative;
    display: flex;
    align-items: center;
    align-self: stretch;
    box-sizing: border-box;
    min-width: 0;
    margin: 0;
    padding: var(--md1-spacing-3, 24px);
    border: 0;
    border-radius: 0;
    background: transparent;
    font: inherit;
    color: inherit;
    text-align: start;
    -webkit-tap-highlight-color: transparent;
    transition: background-color var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  button.md1-stepper__label {
    cursor: pointer;
    user-select: none;
  }

  /* Hover: 6% over the whole step cell on the steps the user can go to (steppers page; lead decision 3). */
  button.md1-stepper__label:hover {
    background-color: var(--md1-hover, rgba(0, 0, 0, 0.06));
  }

  /*
   * Focus is not stated on the steppers page; the buttons page's 12% overlay,
   * keyboard only. The transparent outline keeps a ring under forced colours.
   */
  button.md1-stepper__label:focus-visible {
    outline: 2px solid transparent;
    background-color: var(--md1-focus, rgba(0, 0, 0, 0.12));
  }

  /* Pressed: a circular ripple from the press point in the hover tone, not the buttons' grey (steppers page). */
  .md1-stepper__label > .md1-ripple {
    color: var(--md1-hover, rgba(0, 0, 0, 0.06));
  }

  /* 24 dp, a 12 sp Regular number in white; 38% while inactive, the primary colour once reached. */
  .md1-stepper__circle {
    position: relative;
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    margin-inline-end: var(--md1-spacing-1, 8px);
    border-radius: 50%;
    background: var(--md1-text-disabled, rgba(0, 0, 0, 0.38));
    color: var(--md1-on-primary, #FFFFFF);
    font-size: var(--md1-type-caption-size, 12px);
    font-weight: var(--md1-font-weight-regular, 400);
    line-height: 1;
    transition: background-color var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /* The check and the pencil inside a circle: the page draws them at 18 dp (Vuetify 1.5, `moderate`). */
  .md1-stepper__circle > .md1-icon {
    --md1-icon-size: 18px;
  }

  .md1-stepper__step[data-state='active'] .md1-stepper__circle,
  .md1-stepper__step[data-state='complete'] .md1-stepper__circle {
    background: var(--md1-primary, #3F51B5);
  }

  /* Error: the 24 dp warning glyph in red stands in for the circle. */
  .md1-stepper__step[data-error] .md1-stepper__circle {
    background: transparent;
    color: var(--md1-error, #FF1744);
  }

  .md1-stepper__step[data-error] .md1-stepper__circle > .md1-icon {
    --md1-icon-size: 24px;
  }

  .md1-stepper__text {
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  /* The name: 14 sp Regular; Medium while active. Inactive is 38% in a linear flow, 54% in a non-linear one. */
  .md1-stepper__name {
    overflow: hidden;
    font-size: var(--md1-type-body-1-size, 14px);
    font-weight: var(--md1-font-weight-regular, 400);
    line-height: var(--md1-type-body-1-leading, 20px);
    letter-spacing: var(--md1-type-body-1-tracking, 0.01em);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .md1-stepper[data-linear] .md1-stepper__name {
    color: var(--md1-text-disabled, rgba(0, 0, 0, 0.38));
  }

  .md1-stepper .md1-stepper__step[data-state='active'] .md1-stepper__name,
  .md1-stepper .md1-stepper__step[data-state='complete'] .md1-stepper__name {
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-stepper__step[data-state='active'] .md1-stepper__name {
    font-weight: var(--md1-font-weight-medium, 500);
  }

  .md1-stepper .md1-stepper__step[data-error] .md1-stepper__name {
    font-weight: var(--md1-font-weight-medium, 500);
    color: var(--md1-error, #FF1744);
  }

  /* The sub-label ("Optional", a summary or the error message): 12 sp Regular at 54%, red on an error step. */
  .md1-stepper__note {
    font-size: var(--md1-type-caption-size, 12px);
    font-weight: var(--md1-font-weight-regular, 400);
    line-height: 16px;
    letter-spacing: var(--md1-type-caption-tracking, 0.02em);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-stepper__step[data-error] .md1-stepper__note {
    color: var(--md1-error, #FF1744);
  }

  /*
   * The 1 dp connector in Grey 400 (the page's text; the sheets render Grey 300),
   * 8 dp clear of the label before it and the circle after it: it reaches 16 dp
   * into each side's 24 dp padding.
   */
  .md1-stepper__connector {
    display: block;
    flex: 1 1 auto;
    align-self: center;
    box-sizing: content-box;
    min-width: var(--md1-spacing-1, 8px);
    height: 1px;
    margin: 0 -16px;
    padding: 0;
    border: 0;
    background: var(--md1-grey-400, #BDBDBD);
  }

  /* The page has no dark sheet; on the dark theme the connector takes the divider ink rather than a light grey bar. */
  [data-theme='md1-dark'] .md1-stepper__connector {
    background: var(--md1-divider, rgba(255, 255, 255, 0.12));
  }

  /*
   * Alternative labels: steps in equal parts, the label centred 16 dp under
   * its circle, 24 dp above and below and 16 dp at the sides. The connector
   * runs between circles, 8 dp clear of each.
   */
  .md1-stepper[data-alternative]:not([data-vertical]) .md1-stepper__step {
    flex: 1 1 0;
    align-items: flex-start;
  }

  .md1-stepper[data-alternative]:not([data-vertical]) .md1-stepper__label {
    flex: 1 1 auto;
    flex-direction: column;
    padding: var(--md1-spacing-3, 24px) var(--md1-spacing-2, 16px);
    text-align: center;
  }

  .md1-stepper[data-alternative]:not([data-vertical]) .md1-stepper__circle {
    margin: 0 0 var(--md1-spacing-2, 16px);
  }

  .md1-stepper[data-alternative]:not([data-vertical]) .md1-stepper__text {
    align-items: center;
    max-width: 100%;
  }

  .md1-stepper[data-alternative]:not([data-vertical]) .md1-stepper__name {
    line-height: 16px;
  }

  /* Absolutely positioned connectors align to their insets, not to the flex line (align-self would centre a 0 dp box in them). */
  .md1-stepper[data-alternative]:not([data-vertical]) .md1-stepper__connector {
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
  .md1-stepper[data-vertical]:not([data-mobile]) .md1-stepper__step {
    display: block;
    flex: none;
  }

  .md1-stepper[data-vertical]:not([data-mobile]) .md1-stepper__label {
    align-items: flex-start;
    width: 100%;
    padding: var(--md1-spacing-3, 24px) var(--md1-spacing-3, 24px) var(--md1-spacing-2, 16px);
  }

  .md1-stepper[data-vertical]:not([data-mobile]) .md1-stepper__circle {
    margin-inline-end: 12px;
  }

  .md1-stepper[data-vertical]:not([data-mobile]) .md1-stepper__name {
    line-height: 24px;
  }

  /* The vertical connector: centred under the circle, 8 dp clear of it and of the next circle. */
  .md1-stepper[data-vertical]:not([data-mobile]) .md1-stepper__connector {
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
