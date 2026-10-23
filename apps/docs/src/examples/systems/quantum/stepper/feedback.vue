<script setup lang="ts">
  import { QuButton, QuStepper } from '@paper/quantum'
  import { useTimer } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const step = shallowRef('settings')
  const feedback = shallowRef<string>()

  // Stands in for a slow save: the feedback shows for two seconds, then the next step opens.
  const save = useTimer(() => {
    feedback.value = undefined
    step.value = 'group'
  }, { duration: 2000 })

  function onSave () {
    feedback.value = 'Saving campaign settings'
    save.start()
  }

  function onBack () {
    step.value = 'settings'
  }
</script>

<template>
  <QuStepper v-model="step" class="quantum-docs-stepper" :feedback vertical>
    <QuStepper.Step label="Select campaign settings" value="settings">
      <QuStepper.Content>
        Settings are saved to the server before the next step opens.

        <QuStepper.Actions>
          <QuButton variant="raised" @click="onSave">Save</QuButton>
        </QuStepper.Actions>
      </QuStepper.Content>
    </QuStepper.Step>

    <QuStepper.Step label="Create an ad group" value="group">
      <QuStepper.Content>
        Group the ads that share a budget and a set of keywords.

        <QuStepper.Actions>
          <QuButton @click="onBack">Back</QuButton>
        </QuStepper.Actions>
      </QuStepper.Content>
    </QuStepper.Step>
  </QuStepper>
</template>

<style>
  .quantum-docs-stepper {
    width: 100%;
    max-width: 720px;
  }
</style>
