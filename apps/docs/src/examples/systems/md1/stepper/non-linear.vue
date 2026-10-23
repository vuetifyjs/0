<script setup lang="ts">
  import { Md1Stepper } from '@paper/md1'
  import { shallowRef } from 'vue'

  const step = shallowRef('payment')
</script>

<template>
  <Md1Stepper v-model="step" class="md1-docs-stepper" :linear="false">
    <Md1Stepper.Step complete label="Shipping address" value="address">
      <Md1Stepper.Content>The address the order ships to.</Md1Stepper.Content>
    </Md1Stepper.Step>

    <Md1Stepper.Step label="Payment method" value="payment">
      <Md1Stepper.Content>The card or account the order is charged to.</Md1Stepper.Content>
    </Md1Stepper.Step>

    <Md1Stepper.Step label="Gift options" value="gift">
      <Md1Stepper.Content>A message and wrapping, if the order is a gift.</Md1Stepper.Content>
    </Md1Stepper.Step>
  </Md1Stepper>
</template>

<style>
  .md1-docs-stepper {
    width: 100%;
    max-width: 720px;
  }
</style>
