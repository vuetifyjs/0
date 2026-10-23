<script setup lang="ts">
  import { QuStepper } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const step = shallowRef('settings')
</script>

<template>
  <QuStepper v-model="step" class="quantum-docs-stepper">
    <QuStepper.Step label="Campaign settings" value="settings">
      <QuStepper.Content>
        Name the campaign and pick the markets it runs in.

        <QuStepper.Actions />
      </QuStepper.Content>
    </QuStepper.Step>

    <QuStepper.Step label="Audience" optional value="audience">
      <QuStepper.Content>
        Narrow the audience, or continue to show the ads to everyone.

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
