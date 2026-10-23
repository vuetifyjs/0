<script setup lang="ts">
  import { QuStepper } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const step = shallowRef('group')
</script>

<template>
  <QuStepper v-model="step" alternative-labels class="quantum-docs-stepper">
    <QuStepper.Step label="Campaign settings" value="settings">
      <QuStepper.Content>Name the campaign and pick its markets.</QuStepper.Content>
    </QuStepper.Step>

    <QuStepper.Step label="Ad group" value="group">
      <QuStepper.Content>Group the ads that share a budget.</QuStepper.Content>
    </QuStepper.Step>

    <QuStepper.Step label="Ad" value="ad">
      <QuStepper.Content>Write the headline and description.</QuStepper.Content>
    </QuStepper.Step>
  </QuStepper>
</template>

<style>
  .quantum-docs-stepper {
    width: 100%;
    max-width: 720px;
  }
</style>
