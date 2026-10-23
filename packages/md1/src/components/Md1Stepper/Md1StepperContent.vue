<script lang="ts">
  // Framework
  import { Collapsible, isString } from '@vuetify/v0'

  // Context
  import { orphan, useMd1Stepper } from './Md1Stepper.vue'
  import { useMd1StepperStep } from './Md1StepperStep.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { CollapsibleContentSlotProps } from '@vuetify/v0'

  // Components
  import Md1ProgressCircular from '../Md1ProgressCircular/Md1ProgressCircular.vue'

  /** The content's own Collapsible key, so a consumer's v0 Collapsible inside a step never resolves to it. */
  const NAMESPACE = 'md1:stepper:collapsible'
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1StepperContent' })

  defineSlots<{
    /** The step's body, with `Md1Stepper.Actions` last. */
    default?: () => any
  }>()

  const stepper = useMd1Stepper()
  const step = useMd1StepperStep()

  orphan('Md1StepperContent', 'Md1Stepper.Step', !stepper || !step)

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
        <div v-bind="bind(attrs)" class="md1-stepper__content">
          <div class="md1-stepper__body" :hidden="isString(feedback) || undefined">
            <slot />
          </div>

          <div v-if="isString(feedback)" class="md1-stepper__feedback" role="status">
            <Md1ProgressCircular />

            <span class="md1-stepper__message">{{ feedback }}</span>
          </div>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  </Teleport>

  <div v-else class="md1-stepper__content">
    <slot />
  </div>
</template>

<!-- Unscoped: the content is teleported out of the component tree's DOM position. -->
<style>
  /* Horizontal: the active step's body under the header, on the 24 dp step padding. */
  .md1-stepper__content {
    box-sizing: border-box;
    padding: var(--md1-spacing-3, 24px);
    font-size: var(--md1-type-body-1-size, 14px);
    font-weight: var(--md1-type-body-1-weight, 400);
    line-height: var(--md1-type-body-1-leading, 20px);
    letter-spacing: var(--md1-type-body-1-tracking, 0.01em);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-stepper__content[hidden] {
    display: none;
  }

  /*
   * Vertical: indented to the label keyline (24 + 24 + 12 = 60 dp), 24 dp
   * from the right edge, and 24 dp below so the next label starts 48 dp under
   * the button row. The region opens as a height change on a grid track, the
   * expansion panel's mechanism; the page states no motion, so the duration
   * is the standard one.
   */
  .md1-stepper[data-vertical]:not([data-mobile]) .md1-stepper__content {
    display: grid;
    grid-template-rows: 1fr;
    padding: 0 var(--md1-spacing-3, 24px) var(--md1-spacing-3, 24px);
    padding-inline-start: 60px;
    overflow: hidden;
    transition:
      grid-template-rows var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      padding var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      display var(--md1-duration-standard, 300ms) allow-discrete;
  }

  .md1-stepper[data-vertical]:not([data-mobile]) .md1-stepper__content[hidden] {
    display: none;
    grid-template-rows: 0fr;
    padding-bottom: 0;
  }

  @starting-style {
    .md1-stepper[data-vertical]:not([data-mobile]) .md1-stepper__content {
      grid-template-rows: 0fr;
      padding-bottom: 0;
    }
  }

  .md1-stepper__body {
    min-height: 0;
  }

  .md1-stepper__body[hidden] {
    display: none;
  }

  /*
   * Transient feedback: the page shows it in video only, so the layout is a
   * decision: the indeterminate circle beside the message in Body 1 at 54%.
   */
  .md1-stepper__feedback {
    display: flex;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
    min-height: 48px;
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  body[data-reduced-motion='reduce'] .md1-stepper__content {
    transition: none;
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) .md1-stepper__content {
      transition: none;
    }
  }
</style>
