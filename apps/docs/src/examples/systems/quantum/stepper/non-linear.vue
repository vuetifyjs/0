<script setup lang="ts">
  import { QuStepper } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const step = shallowRef('payment')
</script>

<template>
  <QuStepper v-model="step" class="quantum-docs-stepper" :linear="false">
    <QuStepper.Step complete label="Shipping address" value="address">
      <QuStepper.Content>The address the order ships to.</QuStepper.Content>
    </QuStepper.Step>

    <QuStepper.Step label="Payment method" value="payment">
      <QuStepper.Content>The card or account the order is charged to.</QuStepper.Content>
    </QuStepper.Step>

    <QuStepper.Step label="Gift options" value="gift">
      <QuStepper.Content>A message and wrapping, if the order is a gift.</QuStepper.Content>
    </QuStepper.Step>
  </QuStepper>
</template>

<style>
  .quantum-docs-stepper {
    width: 100%;
    max-width: 720px;
  }
</style>
