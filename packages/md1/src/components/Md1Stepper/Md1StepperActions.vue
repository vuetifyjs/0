<script lang="ts">
  // Framework
  import { useLocale } from '@vuetify/v0'

  // Context
  import { orphan, useMd1Stepper } from './Md1Stepper.vue'

  // Components
  import Md1Button from '../Md1Button/Md1Button.vue'
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1StepperActions' })

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

  const stepper = useMd1Stepper()
  const locale = useLocale()

  orphan('Md1StepperActions', 'Md1Stepper', !stepper)

  function onContinue () {
    stepper?.step.next()
    emit('continue')
  }

  function onCancel () {
    emit('cancel')
  }
</script>

<template>
  <div class="md1-stepper__actions">
    <slot>
      <Md1Button variant="raised" @click="onContinue">{{ locale.ti('Md1.continue') ?? 'Continue' }}</Md1Button>

      <Md1Button @click="onCancel">{{ locale.ti('Md1.cancel') ?? 'Cancel' }}</Md1Button>
    </slot>
  </div>
</template>

<!-- Unscoped: the row renders inside teleported content. -->
<style>
  /* CONTINUE (raised) and CANCEL (flat): a 48 dp row 16 dp under the content, 8 dp between the buttons (vertical step specs). */
  .md1-stepper__actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
    min-height: var(--md1-touch-target, 48px);
    margin-top: var(--md1-spacing-2, 16px);
  }
</style>
