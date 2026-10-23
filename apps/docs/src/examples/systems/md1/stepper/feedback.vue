<script setup lang="ts">
  import { Md1Button, Md1Stepper } from '@paper/md1'
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
  <Md1Stepper v-model="step" class="md1-docs-stepper" :feedback vertical>
    <Md1Stepper.Step label="Select campaign settings" value="settings">
      <Md1Stepper.Content>
        Settings are saved to the server before the next step opens.

        <Md1Stepper.Actions>
          <Md1Button variant="raised" @click="onSave">Save</Md1Button>
        </Md1Stepper.Actions>
      </Md1Stepper.Content>
    </Md1Stepper.Step>

    <Md1Stepper.Step label="Create an ad group" value="group">
      <Md1Stepper.Content>
        Group the ads that share a budget and a set of keywords.

        <Md1Stepper.Actions>
          <Md1Button @click="onBack">Back</Md1Button>
        </Md1Stepper.Actions>
      </Md1Stepper.Content>
    </Md1Stepper.Step>
  </Md1Stepper>
</template>

<style>
  .md1-docs-stepper {
    width: 100%;
    max-width: 720px;
  }
</style>
