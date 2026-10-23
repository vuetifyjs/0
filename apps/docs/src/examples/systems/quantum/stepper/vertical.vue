<script setup lang="ts">
  import { QuStepper } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const step = shallowRef('settings')
</script>

<template>
  <QuStepper v-model="step" class="quantum-docs-stepper" vertical>
    <QuStepper.Step label="Select campaign settings" value="settings">
      <QuStepper.Content>
        Name the campaign and pick the markets it runs in.

        <QuStepper.Actions />
      </QuStepper.Content>
    </QuStepper.Step>

    <QuStepper.Step label="Create an ad group" value="group">
      <QuStepper.Content>
        Group the ads that share a budget and a set of keywords.

        <QuStepper.Actions />
      </QuStepper.Content>
    </QuStepper.Step>

    <QuStepper.Step label="Create an ad" value="ad">
      <QuStepper.Content>
        Write the headline and the two description lines.

        <QuStepper.Actions />
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
