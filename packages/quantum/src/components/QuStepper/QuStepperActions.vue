<script lang="ts">
  // Framework
  import { useLocale } from '@vuetify/v0'

  // Context
  import { orphan, useQuStepper } from './QuStepper.vue'

  // Components
  import QuButton from '../QuButton/QuButton.vue'
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuStepperActions' })

  defineSlots<{
    /** Your own buttons in place of CONTINUE and CANCEL, for a step that must validate before it moves on. */
    default?: () => any
  }>()

  const emit = defineEmits<{
    /** CONTINUE was pressed; the stepper has already moved to the next step. */
    continue: []
    /** CANCEL was pressed. What cancelling means is the app's. */
    cancel: []
  }>()

  const stepper = useQuStepper()
  const locale = useLocale()

  orphan('QuStepperActions', 'QuStepper', !stepper)

  function onContinue () {
    stepper?.step.next()
    emit('continue')
  }

  function onCancel () {
    emit('cancel')
  }
</script>

<template>
  <div class="quantum-stepper__actions">
    <slot>
      <QuButton variant="raised" @click="onContinue">{{ locale.ti('Quantum.continue') ?? 'Continue' }}</QuButton>

      <QuButton @click="onCancel">{{ locale.ti('Quantum.cancel') ?? 'Cancel' }}</QuButton>
    </slot>
  </div>
</template>

<!-- Unscoped: the row renders inside teleported content. -->
<style>
  /* CONTINUE (raised) and CANCEL (flat): a 48 dp row 16 dp under the content, 8 dp between the buttons (vertical step specs). */
  .quantum-stepper__actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--quantum-spacing-1, 8px);
    min-height: var(--quantum-touch-target, 48px);
    margin-top: var(--quantum-spacing-2, 16px);
  }
</style>
