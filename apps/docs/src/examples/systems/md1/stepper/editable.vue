<script setup lang="ts">
  import { Md1Button, Md1Stepper } from '@paper/md1'
  import { shallowRef } from 'vue'

  // Opens on the last step so the editable settings step shows its pencil.
  const step = shallowRef('ad')
  const note = shallowRef('')

  // CANCEL abandons the run: the stepper returns to the first step.
  function onCancel () {
    note.value = ''
    step.value = 'settings'
  }

  function onDone () {
    note.value = 'Campaign published'
    step.value = 'settings'
  }
</script>

<template>
  <div class="md1-docs-stepper-flow">
    <Md1Stepper v-model="step" class="md1-docs-stepper">
      <Md1Stepper.Step editable label="Campaign settings" value="settings">
        <Md1Stepper.Content>
          Settings can be changed until the campaign is published.

          <Md1Stepper.Actions @cancel="onCancel" />
        </Md1Stepper.Content>
      </Md1Stepper.Step>

      <Md1Stepper.Step label="Billing account" value="billing">
        <Md1Stepper.Content>
          The billing account is fixed once the campaign is created.

          <Md1Stepper.Actions @cancel="onCancel" />
        </Md1Stepper.Content>
      </Md1Stepper.Step>

      <Md1Stepper.Step label="Create an ad" value="ad">
        <Md1Stepper.Content>
          Write the headline and the two description lines.

          <Md1Stepper.Actions>
            <Md1Button variant="raised" @click="onDone">Publish campaign</Md1Button>

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
