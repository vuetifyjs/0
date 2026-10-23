<script setup lang="ts">
  import { QuStepper } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const step = shallowRef('ad')
</script>

<template>
  <QuStepper v-model="step" class="quantum-docs-stepper" :linear="false">
    <QuStepper.Step complete label="Campaign settings" value="settings">
      <QuStepper.Content>Name the campaign and pick its markets.</QuStepper.Content>
    </QuStepper.Step>

    <QuStepper.Step error="Budget is below the daily minimum" label="Ad group" value="group">
      <QuStepper.Content>Raise the daily budget to at least 5.00.</QuStepper.Content>
    </QuStepper.Step>

    <QuStepper.Step label="Create an ad" value="ad">
      <QuStepper.Content>Write the headline and the two description lines.</QuStepper.Content>
    </QuStepper.Step>
  </QuStepper>
</template>

<style>
  .quantum-docs-stepper {
    width: 100%;
    max-width: 720px;
  }
</style>
