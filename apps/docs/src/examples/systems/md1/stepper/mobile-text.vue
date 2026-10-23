<script setup lang="ts">
  import { Md1Stepper } from '@paper/md1'
  import { shallowRef } from 'vue'

  const STEPS = ['Choose a plan', 'Add your details', 'Pick a delivery day', 'Review the order']

  const step = shallowRef(0)
</script>

<template>
  <Md1Stepper v-model="step" class="md1-docs-phone" mobile="text">
    <Md1Stepper.Step
      v-for="(label, index) in STEPS"
      :key="index"
      :label
      :value="index"
    >
      <Md1Stepper.Content>{{ label }}.</Md1Stepper.Content>
    </Md1Stepper.Step>

    <Md1Stepper.Bar />
  </Md1Stepper>
</template>

<style>
  .md1-docs-phone {
    width: 100%;
    max-width: 360px;
  }
</style>
