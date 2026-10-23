<script lang="ts">
  // Framework
  import { Collapsible, isString } from '@vuetify/v0'

  // Context
  import { orphan, useQuStepper } from './QuStepper.vue'
  import { useQuStepperStep } from './QuStepperStep.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { CollapsibleContentSlotProps } from '@vuetify/v0'

  // Components
  import QuProgressCircular from '../QuProgressCircular/QuProgressCircular.vue'

  /** The content's own Collapsible key, so a consumer's v0 Collapsible inside a step never resolves to it. */
  const NAMESPACE = 'quantum:stepper:collapsible'
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuStepperContent' })

  defineSlots<{
    /** The step's body, with `QuStepper.Actions` last. */
    default?: () => any
  }>()

  const stepper = useQuStepper()
  const step = useQuStepperStep()

  orphan('QuStepperContent', 'QuStepper.Step', !stepper || !step)

  const open = toRef(() => step?.active.value ?? false)
  const feedback = toRef(() => open.value ? stepper?.feedback.value : undefined)

  // The region is named by its step's label rather than by a Collapsible
  // activator: the step header is the stepper's own button, or no button at all.
  function bind (attrs: CollapsibleContentSlotProps['attrs']) {
    return { ...attrs, 'aria-labelledby': step?.label }
  }
</script>

<template>
  <!--
    Horizontal steppers show one step's content under the whole header, so the
    content is teleported to the root's panel host; the vertical stepper keeps
    it inside its step. Deferred because the host mounts after the steps.
  -->
  <Teleport
    v-if="stepper && step"
    defer
    :disabled="stepper.inline.value"
    :to="`#${stepper.panels}`"
  >
    <Collapsible.Root
      :model-value="open"
      :namespace="NAMESPACE"
      renderless
    >
      <Collapsible.Content v-slot="{ attrs }" :namespace="NAMESPACE" renderless>
        <div v-bind="bind(attrs)" class="quantum-stepper__content">
          <div class="quantum-stepper__body" :hidden="isString(feedback) || undefined">
            <slot />
          </div>

          <div v-if="isString(feedback)" class="quantum-stepper__feedback" role="status">
            <QuProgressCircular />

            <span class="quantum-stepper__message">{{ feedback }}</span>
          </div>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  </Teleport>

  <div v-else class="quantum-stepper__content">
    <slot />
  </div>
</template>

<!-- Unscoped: the content is teleported out of the component tree's DOM position. -->
<style>
  /* Horizontal: the active step's body under the header, on the 24 dp step padding. */
  .quantum-stepper__content {
    box-sizing: border-box;
    padding: var(--quantum-spacing-3, 24px);
    font-size: var(--quantum-type-body-1-size, 14px);
    font-weight: var(--quantum-type-body-1-weight, 400);
    line-height: var(--quantum-type-body-1-leading, 20px);
    letter-spacing: var(--quantum-type-body-1-tracking, 0.01em);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
  }

  .quantum-stepper__content[hidden] {
    display: none;
  }

  /*
   * Vertical: indented to the label keyline (24 + 24 + 12 = 60 dp), 24 dp
   * from the right edge, and 24 dp below so the next label starts 48 dp under
   * the button row. The region opens as a height change on a grid track, the
   * expansion panel's mechanism; the page states no motion, so the duration
   * is the standard one.
   */
  .quantum-stepper[data-vertical]:not([data-mobile]) .quantum-stepper__content {
    display: grid;
    grid-template-rows: 1fr;
    padding: 0 var(--quantum-spacing-3, 24px) var(--quantum-spacing-3, 24px);
    padding-inline-start: 60px;
    overflow: hidden;
    transition:
      grid-template-rows var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      padding var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      display var(--quantum-duration-standard, 300ms) allow-discrete;
  }

  .quantum-stepper[data-vertical]:not([data-mobile]) .quantum-stepper__content[hidden] {
    display: none;
    grid-template-rows: 0fr;
    padding-bottom: 0;
  }

  @starting-style {
    .quantum-stepper[data-vertical]:not([data-mobile]) .quantum-stepper__content {
      grid-template-rows: 0fr;
      padding-bottom: 0;
    }
  }

  .quantum-stepper__body {
    min-height: 0;
  }

  .quantum-stepper__body[hidden] {
    display: none;
  }

  /*
   * Transient feedback: the page shows it in video only, so the layout is a
   * decision: the indeterminate circle beside the message in Body 1 at 54%.
   */
  .quantum-stepper__feedback {
    display: flex;
    align-items: center;
    gap: var(--quantum-spacing-2, 16px);
    min-height: 48px;
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  body[data-reduced-motion='reduce'] .quantum-stepper__content {
    transition: none;
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) .quantum-stepper__content {
      transition: none;
    }
  }
</style>
