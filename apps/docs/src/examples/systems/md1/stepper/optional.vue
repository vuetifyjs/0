<script setup lang="ts">
  import { Md1Button, Md1Stepper } from '@paper/md1'
  import { shallowRef } from 'vue'

  const step = shallowRef('settings')
  const note = shallowRef('')

  // CANCEL abandons the run: the stepper returns to the first step.
  function onCancel () {
    note.value = ''
    step.value = 'settings'
  }

  function onDone () {
    note.value = 'Campaign created'
    step.value = 'settings'
  }
</script>

<template>
  <div class="md1-docs-stepper-flow">
    <Md1Stepper v-model="step" class="md1-docs-stepper">
      <Md1Stepper.Step label="Campaign settings" value="settings">
        <Md1Stepper.Content>
          Name the campaign and pick the markets it runs in.

          <Md1Stepper.Actions @cancel="onCancel" />
        </Md1Stepper.Content>
      </Md1Stepper.Step>

      <Md1Stepper.Step label="Audience" optional value="audience">
        <Md1Stepper.Content>
          Narrow the audience, or continue to show the ads to everyone.

          <Md1Stepper.Actions @cancel="onCancel" />
        </Md1Stepper.Content>
      </Md1Stepper.Step>

      <Md1Stepper.Step label="Create an ad" value="ad">
        <Md1Stepper.Content>
          Write the headline and the two description lines.

          <Md1Stepper.Actions>
            <Md1Button variant="raised" @click="onDone">Create campaign</Md1Button>

            <Md1Button @click="onCancel">Cancel</Md1Button>
          </Md1Stepper.Actions>
        </Md1Stepper.Content>
      </Md1Stepper.Step>
    </Md1Stepper>

    <p v-if="note" class="md1-docs-readout md1-docs-stepper-note" role="status">{{ note }}</p>
  </div>
</template>

<style>
  .md1-docs-stepper {
    width: 100%;
    max-width: 720px;
  }
</style>
