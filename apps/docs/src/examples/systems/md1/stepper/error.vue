<script setup lang="ts">
  import { Md1Stepper } from '@paper/md1'
  import { shallowRef } from 'vue'

  const step = shallowRef('ad')
</script>

<template>
  <Md1Stepper v-model="step" class="md1-docs-stepper" :linear="false">
    <Md1Stepper.Step complete label="Campaign settings" value="settings">
      <Md1Stepper.Content>Name the campaign and pick its markets.</Md1Stepper.Content>
    </Md1Stepper.Step>

    <Md1Stepper.Step error="Budget is below the daily minimum" label="Ad group" value="group">
      <Md1Stepper.Content>Raise the daily budget to at least 5.00.</Md1Stepper.Content>
    </Md1Stepper.Step>

    <Md1Stepper.Step label="Create an ad" value="ad">
      <Md1Stepper.Content>Write the headline and the two description lines.</Md1Stepper.Content>
    </Md1Stepper.Step>
  </Md1Stepper>
</template>

<style>
  .md1-docs-stepper {
    width: 100%;
    max-width: 720px;
  }
</style>
