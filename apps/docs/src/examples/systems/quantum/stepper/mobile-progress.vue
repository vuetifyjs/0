<script setup lang="ts">
  import { QuStepper } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const STEPS = [
    'Choose a plan',
    'Add your details',
    'Pick a delivery day',
    'Choose your meals',
    'Add extras',
    'Enter a promo code',
    'Add payment',
    'Review the order',
  ]

  const step = shallowRef(0)
</script>

<template>
  <QuStepper v-model="step" class="quantum-docs-phone" mobile="progress">
    <QuStepper.Step
      v-for="(label, index) in STEPS"
      :key="index"
      :label
      :value="index"
    >
      <QuStepper.Content>{{ label }}.</QuStepper.Content>
    </QuStepper.Step>

    <QuStepper.Bar />
  </QuStepper>
</template>

<style>
  .quantum-docs-phone {
    width: 100%;
    max-width: 360px;
  }
</style>
