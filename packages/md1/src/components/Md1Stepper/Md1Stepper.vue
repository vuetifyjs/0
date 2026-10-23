<script lang="ts">
  // Framework
  import { createContext, createStep, isString, isUndefined, provideStepRoot, useId, useLocale, useLogger, useProxyModel } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { StepContext, StepTicket } from '@vuetify/v0'
  import type { Ref } from 'vue'

  /** The steppers page's three mobile forms: the bottom bar with dots, with a progress bar, or with nothing and a "Step N of M" line on top. */
  export type Md1StepperMobile = 'text' | 'dots' | 'progress'

  export interface Md1StepperContext {
    /** The v0 step context the root provides; `Step.Item` registers into it and the parts navigate through it. */
    step: StepContext<StepTicket>
    /** The v0 `Step` namespace the parts pass to `Step.Item`. */
    namespace: string
    vertical: Readonly<Ref<boolean>>
    linear: Readonly<Ref<boolean>>
    alternative: Readonly<Ref<boolean>>
    mobile: Readonly<Ref<Md1StepperMobile | undefined>>
    feedback: Readonly<Ref<string | undefined>>
    /** Content renders inside its step (the vertical stepper); otherwise it is teleported to the panel host under the header. */
    inline: Readonly<Ref<boolean>>
    /** Element id of the horizontal panel host. */
    panels: string
    /** Element id of the host the mobile bottom bar is teleported to. */
    outlet: string
  }

  export interface Md1StepperProps {
    /** The vertical stepper: steps stacked, each step's content under its label. Designed for narrow screens. */
    vertical?: boolean
    /**
     * `true` (the default): each step must be completed before the next; future
     * labels are 38% and locked. `false`: the non-linear stepper, where steps
     * are entered in any order and inactive labels are 54% with hover and press.
     */
    linear?: boolean
    /** Horizontal only: labels centred under their circles in a 104 dp bar, the steps in equal parts. */
    alternativeLabels?: boolean
    /**
     * The mobile stepper: the header is replaced by `Md1Stepper.Bar`, with dots,
     * a progress bar, or nothing between BACK and NEXT. `text` also prints
     * "Step N of M" in a 48 dp bar above the content.
     */
    mobile?: Md1StepperMobile
    /**
     * Transient feedback after a step is saved: while set, the active step's
     * content is replaced by an indeterminate circular indicator and this
     * message. Use it only when there is long latency between steps.
     */
    feedback?: string
    /** The v0 `Step` context key. Set it only when a surrounding v0 `Step` must not collide with this one. */
    namespace?: string
  }

  const [useMd1Stepper, provideMd1Stepper] = createContext<Md1StepperContext | null>('md1:stepper', null)

  export { useMd1Stepper }

  /** Dev warning for a part rendered outside the compound; the part then renders inert. */
  export function orphan (part: string, parent: string, missing: boolean) {
    if (__DEV__ && missing) useLogger().warn(`[${part}] rendered outside <${parent}>; its state is inert`)
  }
</script>

<script lang="ts" setup generic="T = unknown">
  defineOptions({ name: 'Md1Stepper' })

  defineSlots<{
    /** `Md1Stepper.Step` children, each holding its `Md1Stepper.Content`; then `Md1Stepper.Bar` for a mobile stepper. */
    default?: () => any
  }>()

  defineEmits<{
    /** The active step's `value`. */
    'update:model-value': [value: T]
  }>()

  const {
    vertical = false,
    linear = true,
    alternativeLabels = false,
    mobile,
    feedback,
    namespace = 'v0:step',
  } = defineProps<Md1StepperProps>()

  const model = defineModel<T>()

  const locale = useLocale()

  // Step.Root's own context is built non-reactive, so a step could not read
  // its number or the root its count after later siblings register. The root
  // builds the same context reactive and provides it under Step.Root's key,
  // so every Md1Stepper.Step still registers through v0's Step.Item. `force`
  // keeps one step active: a stepper always shows where the user is.
  const step = createStep({ mandatory: 'force', events: true, reactive: true })

  useProxyModel(step, model, { multiple: false })

  provideStepRoot(namespace, step)

  const id = useId()
  const panels = `md1-stepper-${id}-panels`
  const outlet = `md1-stepper-${id}-outlet`

  const inline = toRef(() => vertical && isUndefined(mobile))

  provideMd1Stepper({
    step,
    namespace,
    vertical: toRef(() => vertical),
    linear: toRef(() => linear),
    alternative: toRef(() => alternativeLabels),
    mobile: toRef(() => mobile),
    feedback: toRef(() => feedback),
    inline,
    panels,
    outlet,
  })

  const count = toRef(() => step.size)
  const position = toRef(() => step.selectedIndex.value + 1)

  const counter = toRef(() => locale.ti('Md1.stepCount', position.value, count.value) ?? `Step ${position.value} of ${count.value}`)
</script>

<template>
  <div
    class="md1-stepper"
    :data-alternative="alternativeLabels || undefined"
    :data-feedback="isString(feedback) || undefined"
    :data-linear="linear || undefined"
    :data-mobile="mobile"
    :data-vertical="vertical || undefined"
  >
    <div v-if="mobile === 'text'" class="md1-stepper__counter">{{ counter }}</div>

    <ol class="md1-stepper__header">
      <slot />
    </ol>

    <div :id="panels" class="md1-stepper__panels" />

    <div :id="outlet" class="md1-stepper__outlet" />
  </div>
</template>

<!-- Unscoped: every part keeps its own sheet under the md1- prefix and the parts teleport. -->
<style>
  /*
   * The steppers page draws every stepper as a card; the elevation is not
   * stated, so it takes the card's 2 dp (Vuetify 1.5 `elevation(2)`, a decision).
   */
  .md1-stepper {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
    box-shadow: var(--md1-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  /*
   * The horizontal header: a 72 dp bar holding the steps, lifted 2 dp off the
   * content under it (the sheets draw it as its own card; value a decision).
   * It is a size container so the steps can drop their labels when it is narrow.
   */
  .md1-stepper__header {
    display: flex;
    align-items: stretch;
    box-sizing: border-box;
    container: md1-stepper-header / inline-size;
    height: 72px;
    margin: 0;
    padding: 0;
    list-style: none;
    border-radius: inherit;
    box-shadow: var(--md1-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
  }

  /* Alternative label placement: a 104 dp bar (it grows when a sub-label is added). */
  .md1-stepper[data-alternative]:not([data-vertical]) .md1-stepper__header {
    height: auto;
    min-height: 104px;
  }

  /* Vertical: the steps stack, and the content sits inside each step. */
  .md1-stepper[data-vertical]:not([data-mobile]) .md1-stepper__header {
    flex-direction: column;
    height: auto;
    box-shadow: none;
  }

  /* Mobile: the bottom bar replaces the header. The steps stay mounted, so their labels still name the panels. */
  .md1-stepper[data-mobile] .md1-stepper__header {
    display: none;
  }

  .md1-stepper[data-vertical]:not([data-mobile]) .md1-stepper__panels {
    display: none;
  }

  /* The text form: "Step N of M" in Body 1 at 87%, a 48 dp bar on the 16 dp keyline with a shadow below. */
  .md1-stepper__counter {
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 48px;
    /* The 16 dp handset keyline at every width: the mobile stepper is a handset form, so not the keyline token that widens at 600 px. */
    padding: 0 var(--md1-spacing-2, 16px);
    border-radius: inherit;
    box-shadow: var(--md1-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
    font-size: var(--md1-type-body-1-size, 14px);
    font-weight: var(--md1-type-body-1-weight, 400);
    line-height: var(--md1-type-body-1-leading, 20px);
    letter-spacing: var(--md1-type-body-1-tracking, 0.01em);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }
</style>
